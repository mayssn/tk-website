import React, { createContext, useContext, useMemo, useState } from "react";

export type OverlayName = null | "contact" | "types";

type OverlayCtx = {
  open: OverlayName;
  openOverlay: (name: Exclude<OverlayName, null>) => void;
  closeOverlay: () => void;
};

const Ctx = createContext<OverlayCtx | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<OverlayName>(null);

  const value = useMemo(
    () => ({
      open,
      openOverlay: (name: Exclude<OverlayName, null>) => setOpen(name),
      closeOverlay: () => setOpen(null),
    }),
    [open]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOverlay() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOverlay must be used inside OverlayProvider");
  return v;
}

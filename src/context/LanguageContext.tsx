import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "en" | "ar";

type LanguageCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  isRTL: boolean;
};

const Ctx = createContext<LanguageCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const isRTL = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [lang, isRTL]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((p) => (p === "en" ? "ar" : "en")),
      isRTL,
    }),
    [lang, isRTL]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanguage() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLanguage must be used inside LanguageProvider");
  return v;
}

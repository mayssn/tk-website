import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      const small = window.matchMedia?.("(max-width: 768px)")?.matches;
      setIsMobile(Boolean(coarse || small));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

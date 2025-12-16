import { useEffect, useState } from "react";
import { client } from "../lib/sanity/client";
import { SITE_SETTINGS_QUERY } from "../lib/sanity/queries";

export type NavLinkItem = {
  label_en: string;
  label_ar: string;
  href: string;
};

type SiteSettings = {
  logo?: any;
  navLinks?: NavLinkItem[];
};

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    client
      .fetch(SITE_SETTINGS_QUERY)
      .then((res) => {
        if (!mounted) return;
        setData(res || null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    logo: data?.logo,
    navLinks: (data?.navLinks || []) as NavLinkItem[],
    loading,
    error,
  };
}

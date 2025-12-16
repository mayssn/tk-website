// src/hooks/useSiteSettings.ts
import { useEffect, useState } from "react";
import { client } from "../lib/sanity/client";
import { SITE_SETTINGS_QUERY } from "../lib/sanity/queries";

export type NavLinkItem = {
  label_en: string;
  label_ar: string;
  href: string;
};

export type SiteContact = {
  emailAddress?: string;

  phoneNumber_en?: string;
  phoneNumber_ar?: string;

  // label for the "Chat on WhatsApp" link (schema-driven)
  whatsappLabel_en?: string;
  whatsappLabel_ar?: string;

  whatsappNumber?: string;

  mapLinkLabel_en?: string;
  mapLinkLabel_ar?: string;
  mapUrl?: string;

  address_en?: string;
  address_ar?: string;

  // overlay content (schema-driven)
  contactOverlayIntro_en?: string;
  contactOverlayIntro_ar?: string;
  contactOverlayImage?: any;
};

type SiteSettings = {
  logo?: any;
  navLinks?: NavLinkItem[];
} & SiteContact;

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
    // existing
    logo: data?.logo,
    navLinks: (data?.navLinks || []) as NavLinkItem[],

    // ✅ contact fields (from siteSettings)
    contact: data
      ? ({
          emailAddress: data.emailAddress,

          phoneNumber_en: data.phoneNumber_en,
          phoneNumber_ar: data.phoneNumber_ar,

          whatsappLabel_en: data.whatsappLabel_en,
          whatsappLabel_ar: data.whatsappLabel_ar,
          whatsappNumber: data.whatsappNumber,

          mapLinkLabel_en: data.mapLinkLabel_en,
          mapLinkLabel_ar: data.mapLinkLabel_ar,
          mapUrl: data.mapUrl,

          address_en: data.address_en,
          address_ar: data.address_ar,

          contactOverlayIntro_en: data.contactOverlayIntro_en,
          contactOverlayIntro_ar: data.contactOverlayIntro_ar,
          contactOverlayImage: data.contactOverlayImage,
        } as SiteContact)
      : null,

    loading,
    error,
  };
}

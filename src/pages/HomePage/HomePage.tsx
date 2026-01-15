import { useEffect, useState, useMemo } from "react";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { HOME_PAGE_QUERY } from "@/queries/Homepage"; // ✅ use your existing file
import { useLanguage } from "@/context/LanguageContext";
import { Helmet } from "react-helmet-async";
import Gallery from "@/components/Gallery/Gallery";
import DOMPurify from "dompurify";

import HeroHomepage from "@/pages/HomePage/sections/HeroHomepage/HeroHomepage";
import Industries from "@/pages/HomePage/sections/Industries/Industries";
import ProductsServices from "@/pages/HomePage/sections/ProductsServices/ProductsServices";
import FindMyUnit from "@/pages/HomePage/sections/FindMyUnit/FindMyUnit";
import AboutGroup from "@/pages/HomePage/sections/AboutGroup/AboutGroup";
import TrustedBy from "@/pages/HomePage/sections/TrustedBy/TrustedBy";

import "./HomePage.css";

export default function HomePage() {
  const { lang } = useLanguage();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    client.fetch(HOME_PAGE_QUERY).then(setData);
  }, []);

  const sanitizedEn = useMemo(() => {
    return data?.seoBodyEn ? DOMPurify.sanitize(data.seoBodyEn) : "";
  }, [data?.seoBodyEn]);

  const sanitizedAr = useMemo(() => {
    return data?.seoBodyAr ? DOMPurify.sanitize(data.seoBodyAr) : "";
  }, [data?.seoBodyAr]);

  if (!data) return null;

  return (
    <div className="homepage">
      <Helmet>
        <title>{data.seoTitle || ""}</title>
        {data.metaDescription && (
          <meta name="description" content={data.metaDescription} />
        )}
        {data.seoKeywords && (
          <meta name="keywords" content={data.seoKeywords} />
        )}
        {/* Social preview (used by Facebook, WhatsApp, Twitter, etc.) */}
        {typeof window !== "undefined" && (
          <>
            <meta property="og:title" content={data.seoTitle || ""} />
            {data.metaDescription && (
              <meta property="og:description" content={data.metaDescription} />
            )}
            <meta
              property="og:image"
              content={`${window.location.origin}/social-thumb.png`}
            />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={data.seoTitle || ""} />
            {data.metaDescription && (
              <meta name="twitter:description" content={data.metaDescription} />
            )}
            <meta
              name="twitter:image"
              content={`${window.location.origin}/social-thumb.png`}
            />
          </>
        )}
      </Helmet>
      <HeroHomepage
        title={lang === "ar" ? data.heroTitle_ar : data.heroTitle_en}
        imageUrl={urlFor(data.heroImage).width(2000).url()}
      />

      <Industries
        title={
          lang === "ar" ? data.industriesTitle_ar : data.industriesTitle_en
        }
        items={data.industries}
      />

      <ProductsServices
        title={lang === "ar" ? data.servicesTitle_ar : data.servicesTitle_en}
        image={data.servicesGeneralImage}
        services={data.services}
      />

      <FindMyUnit
        title={lang === "ar" ? data.findTitle_ar : data.findTitle_en}
        image={data.findImage}
      />

      {/* Gallery */}
      {data.gallery && (
        <Gallery
          items={data.gallery}
          title={lang === "ar" ? data.galleryTitle_ar : data.galleryTitle_en}
          lang={lang}
        />
      )}

      <AboutGroup
        title={lang === "ar" ? data.aboutTitle_ar : data.aboutTitle_en}
        body={lang === "ar" ? data.aboutBody_ar : data.aboutBody_en}
      />

      <TrustedBy
        title={lang === "ar" ? data.partnersTitle_ar : data.partnersTitle_en}
        partners={data.partners}
      />

      {/* SEO bodies */}
      {sanitizedEn && (
        <section lang="en" className="seo-body en">
          <div dangerouslySetInnerHTML={{ __html: sanitizedEn }} />
        </section>
      )}

      {sanitizedAr && (
        <section lang="ar" dir="rtl" className="seo-body ar">
          <div dangerouslySetInnerHTML={{ __html: sanitizedAr }} />
        </section>
      )}
    </div>
  );
}

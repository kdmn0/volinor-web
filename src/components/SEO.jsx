export const SEO = ({ title, description, keywords }) => {
  const defaultTitle = "Volinor | İleri Teknoloji Çözümleri";
  const defaultDescription = "Volinor ile 3D modelleme, simülasyon, ileri malzeme ve yapay zeka çözümlerini keşfedin.";
  const defaultKeywords = "volinor, 3d, modelleme, simülasyon, yapay zeka, ileri malzeme, kompozit";

  return (
    <>
      <title>{title ? `${title} | Volinor` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? `${title} | Volinor` : defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | Volinor` : defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </>
  );
};

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, type = 'website', url }) => {
  const siteName = 'HomeSpace';
  const defaultDescription = 'Your trusted partner in finding the perfect property, securing the right loan, and making smart real estate investments.';
  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';
  
  const currentUrl = url || window.location.href;

  return (
    <Helmet>
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description || defaultDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title ? `${title} | ${siteName}` : siteName} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title ? `${title} | ${siteName}` : siteName} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;

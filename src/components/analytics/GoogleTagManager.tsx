'use client';

import { useEffect } from 'react';

interface GoogleTagManagerProps {
  gtmId: string;
}

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  useEffect(() => {
    if (!gtmId) return;

    // Add GTM script to the page
    const addGtmScript = () => {
      // Skip if script already exists
      if (document.getElementById('gtm-script')) return;

      const script = document.createElement('script');
      script.id = 'gtm-script';
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);
    };

    // Add GTM noscript iframe for browsers with JavaScript disabled
    const addGtmNoScript = () => {
      // Skip if noscript already exists
      if (document.getElementById('gtm-noscript')) return;

      const noscript = document.createElement('noscript');
      noscript.id = 'gtm-noscript';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);
    };

    // Initialize GTM
    addGtmScript();
    addGtmNoScript();

    // Cleanup function
    return () => {
      // Remove GTM script and noscript if component unmounts
      const script = document.getElementById('gtm-script');
      const noscript = document.getElementById('gtm-noscript');
      if (script) script.remove();
      if (noscript) noscript.remove();
    };
  }, [gtmId]);

  return null; // This component doesn't render anything
}
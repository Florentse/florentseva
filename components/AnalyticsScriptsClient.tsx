"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import {
  CONSENT_CHANGE_EVENT,
  getStoredConsent,
  getStoredConsentServerSnapshot,
} from "@/lib/cookieConsent";

type AnalyticsScriptsClientProps = {
  googleAnalyticsId?: string;
  clarityId?: string;
  yandexMetricaId?: string;
};

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

// Scripts only start rendering once the visitor has accepted the
// "analytics" cookie category — mounting them earlier and hiding the
// requests isn't an option, since the whole point is not to fire them
// before consent is given. Revoking consent afterwards stops future
// visits from loading them again, but can't un-fire an already running
// tracker on the current page (same limitation any consent banner has).
export default function AnalyticsScriptsClient({
  googleAnalyticsId,
  clarityId,
  yandexMetricaId,
}: AnalyticsScriptsClientProps) {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getStoredConsent,
    getStoredConsentServerSnapshot,
  );

  if (consent?.analytics !== true) return null;

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {yandexMetricaId && (
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(${yandexMetricaId}, 'init', {
              webvisor:true,
              clickmap:true,
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce:true,
              trackLinks:true
            });
          `}
        </Script>
      )}
    </>
  );
}

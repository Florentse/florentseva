import { client } from "@/sanity/lib/client";
import AnalyticsScriptsClient from "./AnalyticsScriptsClient";

const ANALYTICS_QUERY = `*[_type == "siteSettings"][0]{
  googleAnalyticsId,
  clarityId,
  yandexMetricaId
}`;

export default async function AnalyticsScripts() {
  const settings = await client.fetch(ANALYTICS_QUERY);

  if (!settings) return null;

  return (
    <AnalyticsScriptsClient
      googleAnalyticsId={settings.googleAnalyticsId}
      clarityId={settings.clarityId}
      yandexMetricaId={settings.yandexMetricaId}
    />
  );
}

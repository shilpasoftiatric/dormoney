export type SiteSettings = {
  site_name: string;
  support_email: string;
  support_phone: string;
};

const defaultSettings: SiteSettings = {
  site_name: "Dormoney",
  support_email: "support@dormoney.com",
  support_phone: "1-800-DORMONEY",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return defaultSettings;
}

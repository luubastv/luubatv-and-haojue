import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.luubatv256.com"),
  title: "Luuba TV 256 | Media & Haojue Motorcycles Uganda",
  description: "Watch Luuba TV, compare Haojue motorcycle prices, start a loan enquiry and get direct sales help in Uganda.",
  applicationName: "Luuba TV 256",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Luuba TV 256 | Move Your Story Forward",
    description: "Ugandan media, Haojue motorcycles, financing enquiries and direct sales support.",
    url: "https://www.luubatv256.com",
    siteName: "Luuba TV 256",
    locale: "en_UG",
    type: "website",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#15191d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

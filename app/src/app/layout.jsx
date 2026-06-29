import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/utils/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "FREE CSIT ENTRANCE PREPARATION - PARIKSHA",
  manifest: "/manifest.json",
  description: "Join Pariksha to get free CSIT entrance preparation.",
  icons: {
    icon: "/imagesPWA/icons/icon-192x192.png",
    shortcut: "/imagesPWA/icons/icon-192x192.png",
    apple: "/imagesPWA/icons/icon-192x192.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/imagesPWA/icons/icon-192x192.png",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          <Navbar />
          <div className="min-h-[calc(100vh-280px)]">{children}</div>
          <Footer />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-EWTY7DRG2Y" />
    </html>
  );
}

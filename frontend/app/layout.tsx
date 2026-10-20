import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kaushal-drishti.msde.gov.in";

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Centre Sentinel | National Skill Training Surveillance & Attendance Verification Portal (MSDE)",
    template: "%s | Centre Sentinel (MSDE)",
  },
  description:
    "Ministry of Skill Development and Entrepreneurship (MSDE Problem ID 26245) real-time privacy-preserving edge video analytics platform for training centre attendance discrepancy detection and infrastructure compliance monitoring under rural low-bandwidth constraints.",
  keywords: [
    "MSDE",
    "Skill India",
    "Centre Sentinel",
    "National Centre Sentinel",
    "Problem ID 26245",
    "Edge AI",
    "Privacy-Preserving Video Analytics",
    "Attendance Discrepancy",
    "Infrastructure Compliance",
    "Rural Low-Bandwidth",
    "Gaussian Blur Anonymization",
    "Operability IoU",
  ],
  authors: [{ name: "Ministry of Skill Development and Entrepreneurship", url: "https://www.msde.gov.in" }],
  creator: "Scheme Monitoring Unit (SMU), MSDE",
  publisher: "Government of India",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Centre Sentinel: National Skill Training Surveillance & Attendance Verification Portal",
    description:
      "Official SMU portal monitoring 15,000+ empaneled vocational training centres across India with zero biometric storage and low-bandwidth rural telemetry.",
    url: SITE_URL,
    siteName: "Centre Sentinel National MSDE Portal",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-preview.png`,
        width: 1200,
        height: 630,
        alt: "Centre Sentinel MSDE Real-Time Edge Analytics Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Centre Sentinel | MSDE Privacy-Preserving Analytics",
    description: "Rural edge video analytics & compliance platform for MSDE training centres.",
    creator: "@MSDESkillIndia",
    images: [`${SITE_URL}/og-preview.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured GovernmentService JSON-LD Schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: "Centre Sentinel - National Skill Training Centre Surveillance & Biometric Verification Portal",
    alternateName: "MSDE Problem ID 26245 Centre Sentinel Compliance Grid",
    serviceType: "Vocational Training Centre Monitoring and Audit",
    provider: {
      "@type": "GovernmentOrganization",
      name: "Ministry of Skill Development and Entrepreneurship (MSDE)",
      parentOrganization: {
        "@type": "GovernmentOrganization",
        name: "Government of India",
      },
      url: "https://www.msde.gov.in",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    description:
      "Automated edge AI platform monitoring empaneled skill development centres for student attendance verification and sanctioned infrastructure compliance while preserving trainee privacy via automated Gaussian blurring.",
    url: SITE_URL,
    serviceOperator: {
      "@type": "GovernmentOrganization",
      name: "Scheme Monitoring Unit (SMU)",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900 font-sans">
        {children}
      </body>
    </html>
  );
}

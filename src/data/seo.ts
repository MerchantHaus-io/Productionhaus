/**
 * Central SEO and AI-search metadata for merchanthaus.io.
 *
 * Read by <PageSEO> (titles, canonical URLs, Open Graph, JSON-LD) in the
 * browser and by scripts/prerender.mjs at build time, which uses the rendered
 * <head> of every route to write the static HTML, sitemap.xml, llms.txt and
 * per-page Markdown that search engines and AI assistants read.
 *
 * Keep facts here accurate: AI assistants quote structured data verbatim.
 */

export const SITE_URL = "https://merchanthaus.io";
export const SITE_NAME = "MerchantHaus";
export const DEFAULT_IMAGE = `${SITE_URL}/favicons/icon_pack_updated/shield_1024x1024.png`;
export const LOGO_URL = `${SITE_URL}/favicons/icon_pack_updated/shield_512x512.png`;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** The business entity, referenced from every page's structured data. */
export const organizationJsonLd = {
  "@type": ["Organization", "FinancialService"],
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: ["MerchantHaus.io", "Merchant Haus"],
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 512,
    height: 512,
  },
  image: DEFAULT_IMAGE,
  legalName: "MerchantHaus LLC",
  description:
    "MerchantHaus provides payment gateway technology, merchant accounts and U.S.-based support for merchants, ISOs, mid-market and enterprise organizations: credit and debit cards, ACH/eCheck, digital wallets, contactless and pay links, online, in-store and on mobile. Powered by NMI. Payment processing services are provided by NMI Payments, a registered ISO/MSP of Merrick Bank, Woodbury, NY.",
  slogan: "Plug in, play and process",
  email: "support@merchanthaus.io",
  telephone: "+1-505-600-6042",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1209 Mountain Road Pl NE Ste N",
    addressLocality: "Albuquerque",
    addressRegion: "NM",
    postalCode: "87110",
    addressCountry: "US",
  },
  areaServed: { "@type": "Country", name: "United States" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+1-505-600-6042",
      email: "support@merchanthaus.io",
      areaServed: "US",
      availableLanguage: ["English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+1-505-600-6042",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
  knowsAbout: [
    "Merchant accounts",
    "Credit card processing",
    "Payment gateways",
    "ACH and eCheck processing",
    "Point-of-sale (POS) terminals",
    "Tap to Pay on phone (SoftPOS)",
    "3-D Secure authentication",
    "PCI DSS compliance",
    "Network tokenization",
    "Chargeback and fraud prevention",
    "Visa Acquirer Monitoring Program (VAMP)",
    "Level II and Level III card data",
    "Recurring billing and subscriptions",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Payment processing services",
    itemListElement: [
      "Credit and debit card processing",
      "ACH / eCheck processing",
      "Payment gateway and virtual terminal",
      "In-store POS and SmartPOS terminals",
      "Mobile and Tap-to-Mobile payments",
      "Online checkout, hosted payment pages and pay links",
      "Recurring billing and customer vault",
      "Fraud prevention and 3-D Secure",
      "Level III data for B2B and government cards",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: "Payment processing, merchant accounts and developer documentation from MerchantHaus.",
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "en-US",
};

export type ArticleMeta = {
  /** ISO 8601 date (YYYY-MM or YYYY-MM-DD). */
  datePublished: string;
  dateModified?: string;
  section: string;
  image: string;
};

/** Blog articles, keyed by route. Dates match the dates shown on each article. */
export const ARTICLES: Record<string, ArticleMeta> = {
  "/vamp": { datePublished: "2025-10", section: "Compliance & Risk", image: "/blog-images/vamp_metrics.webp" },
  "/3ds": { datePublished: "2025-10", section: "Security & Compliance", image: "/blog-images/3ds_ai.png" },
  "/3ds2": { datePublished: "2025-11", section: "Authentication", image: "/blog-images/3ds_handshake.png" },
  "/tap-to-mobile": { datePublished: "2025-11", section: "Merchant Acceptance", image: "/blog-images/TAP1.webp" },
  "/payments-survey-2025": { datePublished: "2025-12", section: "Industry Insights", image: "/blog-images/payments-survey-2025.webp" },
  "/prediction-2026": { datePublished: "2026-01-14", section: "Market Analysis", image: "/blog-images/prediction.webp" },
  "/construction-finance": { datePublished: "2026-04-12", section: "Industry Analysis", image: "/blog-images/construction-finance-hero.jpg" },
  "/payment-gateway-guide": { datePublished: "2026-07-02", section: "Business Resources", image: "/blog-images/payment-gateway-guide.webp" },
  "/swipe-fee-settlement": { datePublished: "2026-10-27", section: "Industry News", image: "/blog-images/swipe-fee-settlement.webp" },
};

export type DocMeta = {
  title: string;
  description: string;
  section: "developer" | "portal";
};

export const DOC_SECTIONS = {
  developer: { name: "Developer Guides", path: "/developer-guides" },
  portal: { name: "Merchant Portal Guides", path: "/TheMerchantPortal" },
} as const;

/**
 * Developer and Merchant Portal guides. These pages render <NavTree>, which
 * emits their <PageSEO> from this table, so a new guide only needs an entry here.
 */
export const DOCS: Record<string, DocMeta> = {
  "/developer-guides": {
    title: "Developer Guides",
    description: "Integration documentation for building custom payment solutions on the MerchantHaus gateway: Payment API, Collect.js, hosted payment pages, webhooks, SDKs and 3-D Secure.",
    section: "developer",
  },
  "/TheMerchantPortal": {
    title: "The Merchant Portal",
    description: "Guides for the MerchantHaus Merchant Portal: transaction reporting, merchant and partner users, settlement, security settings and account configuration.",
    section: "portal",
  },
  "/IntegrationOverview": {
    title: "Integration Overview",
    description: "The fundamentals of integrating with the MerchantHaus payment gateway: what APIs and SDKs are, how they differ, and how to choose the right integration path.",
    section: "developer",
  },
  "/DirectConnect": {
    title: "Direct Connect & Gateway Emulator",
    description: "This section describes two advanced integration paths: Direct Connect for device manufacturers and the Gateway Emulator for merchants migrating from other…",
    section: "developer",
  },
  "/GatewayJs": {
    title: "Gateway.js Quick Start",
    description: "Gateway.js is a JavaScript library that extends your checkout integration with additional gateway services such as 3-D Secure and Kount fraud screening.",
    section: "developer",
  },
  "/Secure3DS": {
    title: "3-D Secure Integration Guide",
    description: "Three-Domain Secure (3-DS) is a fraud prevention protocol that authenticates cardholders before you submit a transaction.",
    section: "developer",
  },
  "/KountFraudManagement": {
    title: "Fraud Management",
    description: "Kount Fraud Manager is an industry-leading, AI-driven fraud prevention service designed for eCommerce, mobile commerce and other card-not-present transactions.",
    section: "developer",
  },
  "/AccountInformation": {
    title: "Account Information",
    description: "Your account profile contains key details about your business, contact information and banking setup.",
    section: "portal",
  },
  "/AddressVerification": {
    title: "Address Verification (AVS)",
    description: "AVS compares the billing information provided by a customer against the records held by their card issuer.",
    section: "developer",
  },
  "/AutomaticCardUpdater": {
    title: "Automatic Card Updater",
    description: "The Automatic Card Updater service keeps your stored card information current by automatically replacing expired or reissued cards.",
    section: "developer",
  },
  "/AutomaticLevelIII": {
    title: "Automatic Level III Template",
    description: "Level III data provides additional line-item details for corporate or purchasing cards.",
    section: "developer",
  },
  "/BillingStatement": {
    title: "Billing Statement",
    description: "When your provider bills gateway and transaction fees directly to you, a billing statement is available in the portal.",
    section: "portal",
  },
  "/BlindCredits": {
    title: "Blind Credits",
    description: "Blind credits should be used sparingly. Because they are not tied to an original sale, they open the door to fraud or misuse.",
    section: "portal",
  },
  "/CardIDVerification": {
    title: "Card ID Verification (CVV)",
    description: "The card verification value (CVV) is a three- or four-digit code printed on cards.",
    section: "developer",
  },
  "/CountryCurrencyConfiguration": {
    title: "Country/Currency Configuration",
    description: "If you process transactions in multiple currencies, you can set a default country and currency for manual transactions in the virtual terminal.",
    section: "portal",
  },
  "/CustomerFeeConfiguration": {
    title: "Customer Fee Configuration",
    description: "To offset processing costs or recover bank fees, you can charge additional fees on customer transactions.",
    section: "portal",
  },
  "/DkimSpfValidation": {
    title: "DKIM & SPF Validation",
    description: "Use the domain validation tool to check that your DNS records include the correct SPF and DKIM entries.",
    section: "portal",
  },
  "/EmailTemplateChanges": {
    title: "Email Template Changes",
    description: "Automated emails sent from the portal can be customised to match your branding or include additional information.",
    section: "portal",
  },
  "/InvoiceLookFeel": {
    title: "Invoice Look & Feel",
    description: "Customise your electronic invoices with a logo to reinforce your brand.",
    section: "portal",
  },
  "/ManagingPartnerUsers": {
    title: "Managing Partner Users",
    description: "Partners can create multiple users for their accounts to control access to the partner portal.",
    section: "portal",
  },
  "/MerchantDefinedFields": {
    title: "Merchant Defined Fields",
    description: "Use custom fields to capture extra information during checkout. MDFs can appear on virtual terminal screens, payment pages, recurring schedules and reports.",
    section: "developer",
  },
  "/MerchantIPRestrictions": {
    title: "Merchant IP Restrictions",
    description: "Restricting access by IP address provides an extra layer of protection against unauthorized logins.",
    section: "portal",
  },
  "/MerchantServiceProviderContacts": {
    title: "Service Provider Contact Details",
    description: "Support information is displayed within the portal so your merchants know who to contact.",
    section: "portal",
  },
  "/MerchantUserAccounts": {
    title: "Merchant User Accounts",
    description: "Manage the people who can access your merchant gateway. This guide explains how to add and configure users, reset passwords and update existing accounts.",
    section: "portal",
  },
  "/PasswordPolicy90Day": {
    title: "90-Day Password Policy",
    description: "To improve security, accounts without two-factor authentication are required to update their password every 90 days.",
    section: "portal",
  },
  "/ReportConfiguration": {
    title: "Report Configuration",
    description: "Tailor your exported transaction reports to include only the information you need. Create templates and set a default format for future downloads.",
    section: "portal",
  },
  "/SecCodeConfiguration": {
    title: "SEC Code Configuration",
    description: "Choosing the correct SEC code for each ACH transaction is a regulatory requirement. It specifies how the transaction was authorised and processed.",
    section: "portal",
  },
  "/SettlementSchedule": {
    title: "Settlement Schedule",
    description: "Adjust the time of day your terminal-captured transactions are submitted for settlement.",
    section: "portal",
  },
  "/SpfDkimRecords": {
    title: "SPF & DKIM Records",
    description: "Email providers use SPF and DKIM to verify that messages are authorised to send from your domain.",
    section: "portal",
  },
  "/SubscriptionReports": {
    title: "Subscription Reports",
    description: "Generate reports on your recurring subscriptions to see which schedules are active, completed or past due.",
    section: "portal",
  },
  "/TestMode": {
    title: "Test Mode",
    description: "Enable test mode to simulate payments without affecting real funds. This is useful for development, testing and staff training.",
    section: "portal",
  },
  "/TransactionReports": {
    title: "Transaction Reports",
    description: "This guide introduces the transaction reporting feature and shows you how to run the most common reports.",
    section: "portal",
  },
  "/TransactionRouting": {
    title: "Transaction Routing",
    description: "Use transaction routing to split your payment volume across multiple processors. This can help you optimise costs and maintain redundancy.",
    section: "portal",
  },
  "/TwoFactorAuthentication": {
    title: "Two-Factor Authentication",
    description: "Two-factor authentication (2FA) requires you to enter a one-time code in addition to your password.",
    section: "portal",
  },
  "/WhatIsACH": {
    title: "What is ACH?",
    description: "The Automated Clearing House (ACH) is an electronic network for transferring funds between bank accounts in the United States.",
    section: "developer",
  },
  "/CollectCheckout": {
    title: "Collect Checkout",
    description: "Collect Checkout offers a fully hosted checkout page that you can embed into most web-based payment flows.",
    section: "developer",
  },
  "/CollectJs": {
    title: "Collect.js",
    description: "Collect.js is a browser-based tokenisation library. It displays a pop-up form hosted on the gateway, collects payment data and returns a token that you use in…",
    section: "developer",
  },
  "/CustomerPresentCloud": {
    title: "Customer Present Cloud",
    description: "Customer Present Cloud is a browser-based point of sale solution that eliminates the need for software installation and driver maintenance.",
    section: "developer",
  },
  "/HostedPaymentPage": {
    title: "Hosted Payment Page",
    description: "A hosted payment page provides a turnkey checkout solution. Also known as QuickClick, it lets you add a payment button or link to your website without writing…",
    section: "developer",
  },
  "/MobileSDK": {
    title: "Mobile SDK (iOS/Android)",
    description: "The mobile SDKs provide libraries for iOS and Android applications requiring encrypted mobile card readers.",
    section: "developer",
  },
  "/PaymentAPI": {
    title: "Payment API",
    description: "The Payment API, sometimes called the Direct Post method, is the simplest way to post transactions directly from your server to the gateway.",
    section: "developer",
  },
  "/PaymentDeviceSDK": {
    title: "Payment Device SDK (Windows/Linux)",
    description: "The Payment Device SDKs for Windows and Linux enable developers to integrate software with a variety of payment terminals.",
    section: "developer",
  },
  "/QueryAPI": {
    title: "Query API",
    description: "The Query API provides machine-readable access to your transaction history.",
    section: "developer",
  },
  "/ThreeStepRedirect": {
    title: "Three Step Redirect",
    description: "The Three Step Redirect is designed to reduce your PCI compliance burden by hosting the payment form on the gateway.",
    section: "developer",
  },
  "/Webhooks": {
    title: "Webhooks",
    description: "Webhooks allow you to receive notifications whenever certain events occur on your account—such as transaction status changes, recurring billing updates or…",
    section: "developer",
  },
};

import { Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, createRoutesFromChildren, matchRoutes } from "react-router-dom";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { RouteProgress } from "./components/RouteProgress";
import { isLazyPage, lazyPage } from "./lib/lazyPage";
import { ScrollToTop } from "./components/ScrollToTop";

/**
 * Main site pages - lazy loaded for initial bundle optimization
 */
const Index = lazyPage(() => import("./pages/Index"));
const Services = lazyPage(() => import("./pages/Services"));
const Blog = lazyPage(() => import("./pages/Blog"));
const Vamp = lazyPage(() => import("./pages/Vamp"));
const Prediction2026Article = lazyPage(() => import("./pages/Prediction2026Article"));
const PaymentGatewayGuide = lazyPage(() => import("./pages/PaymentGatewayGuide"));
const SwipeFeeSettlement = lazyPage(() => import("./pages/SwipeFeeSettlement"));
const ThreeDS = lazyPage(() => import("./pages/ThreeDS"));
const ThreeDS2 = lazyPage(() => import("./pages/ThreeDS2"));
const PaymentsSurvey2025 = lazyPage(() => import("./pages/PaymentsSurvey2025"));
const TapToMobile = lazyPage(() => import("./pages/TapToMobile"));
const ConstructionFinance = lazyPage(() => import("./pages/ConstructionFinance"));
const AboutPage = lazyPage(() => import("./pages/AboutPage"));
const Terms = lazyPage(() => import("./pages/Terms"));
const Privacy = lazyPage(() => import("./pages/Privacy"));
const Apply = lazyPage(() => import("./pages/Apply"));
const Security = lazyPage(() => import("./pages/Security"));
const ComingSoon = lazyPage(() => import("./pages/ComingSoon"));
const SupportedProcessors = lazyPage(() => import("./pages/SupportedProcessors"));
const DeviceCatalog = lazyPage(() => import("./pages/DeviceCatalog"));
const NotFound = lazyPage(() => import("./pages/NotFound"));
const Quote = lazyPage(() => import("./pages/Quote"));
const Todos = lazyPage(() => import("./pages/Todos"));
const Pipeline = lazyPage(() => import("./pages/Pipeline"));

/**
 * Developer Guides and Merchant Portal pages. Also lazy loaded, so the home page
 * doesn't download ~45 docs pages; moving between them stays quick because links
 * preload their page on hover, focus or touch (see PreloadOnIntent below).
 */
const DeveloperPortal = lazyPage(() => import("./pages/DeveloperPortal"));
const AccountInformation = lazyPage(() => import("./pages/AccountInformation"));
const AddressVerification = lazyPage(() => import("./pages/AddressVerification"));
const AutomaticCardUpdater = lazyPage(() => import("./pages/AutomaticCardUpdater"));
const AutomaticLevelIII = lazyPage(() => import("./pages/AutomaticLevelIII"));
const BillingStatement = lazyPage(() => import("./pages/BillingStatement"));
const BlindCredits = lazyPage(() => import("./pages/BlindCredits"));
const CardIDVerification = lazyPage(() => import("./pages/CardIDVerification"));
const CountryCurrencyConfiguration = lazyPage(() => import("./pages/CountryCurrencyConfiguration"));
const CustomerFeeConfiguration = lazyPage(() => import("./pages/CustomerFeeConfiguration"));
const DkimSpfValidation = lazyPage(() => import("./pages/DkimSpfValidation"));
const EmailTemplateChanges = lazyPage(() => import("./pages/EmailTemplateChanges"));
const IntegrationOverview = lazyPage(() => import("./pages/IntegrationOverview"));
const InvoiceLookFeel = lazyPage(() => import("./pages/InvoiceLookFeel"));
const ManagingPartnerUsers = lazyPage(() => import("./pages/ManagingPartnerUsers"));
const MerchantDefinedFields = lazyPage(() => import("./pages/MerchantDefinedFields"));
const MerchantIPRestrictions = lazyPage(() => import("./pages/MerchantIPRestrictions"));
const MerchantServiceProviderContacts = lazyPage(() => import("./pages/MerchantServiceProviderContacts"));
const MerchantUserAccounts = lazyPage(() => import("./pages/MerchantUserAccounts"));
const PasswordPolicy90Day = lazyPage(() => import("./pages/PasswordPolicy90Day"));
const DirectConnect = lazyPage(() => import("./pages/DirectConnect"));
const GatewayJs = lazyPage(() => import("./pages/GatewayJs"));
const ReportConfiguration = lazyPage(() => import("./pages/ReportConfiguration"));
const SecCodeConfiguration = lazyPage(() => import("./pages/SecCodeConfiguration"));
const SettlementSchedule = lazyPage(() => import("./pages/SettlementSchedule"));
const SpfDkimRecords = lazyPage(() => import("./pages/SpfDkimRecords"));
const Secure3DS = lazyPage(() => import("./pages/Secure3DS"));
const SubscriptionReports = lazyPage(() => import("./pages/SubscriptionReports"));
const TestMode = lazyPage(() => import("./pages/TestMode"));
const TheMerchantPortal = lazyPage(() => import("./pages/TheMerchantPortal"));
const TransactionReports = lazyPage(() => import("./pages/TransactionReports"));
const TransactionRouting = lazyPage(() => import("./pages/TransactionRouting"));
const TwoFactorAuthentication = lazyPage(() => import("./pages/TwoFactorAuthentication"));
const WhatIsACH = lazyPage(() => import("./pages/WhatIsACH"));
const KountFraudManagement = lazyPage(() => import("./pages/KountFraudManagement"));
const CollectCheckout = lazyPage(() => import("./pages/CollectCheckout"));
const CollectJs = lazyPage(() => import("./pages/CollectJs"));
const CustomerPresentCloud = lazyPage(() => import("./pages/CustomerPresentCloud"));
const HostedPaymentPage = lazyPage(() => import("./pages/HostedPaymentPage"));
const MobileSDK = lazyPage(() => import("./pages/MobileSDK"));
const PaymentAPI = lazyPage(() => import("./pages/PaymentAPI"));
const PaymentDeviceSDK = lazyPage(() => import("./pages/PaymentDeviceSDK"));
const QueryAPI = lazyPage(() => import("./pages/QueryAPI"));
const ThreeStepRedirect = lazyPage(() => import("./pages/ThreeStepRedirect"));
const Webhooks = lazyPage(() => import("./pages/Webhooks"));

/**
 * The route table, shared by the browser entry (BrowserRouter) and the
 * build-time prerender (StaticRouter in src/entry-server.tsx), so every public
 * route is shipped as real HTML that search engines and AI crawlers can read
 * without running JavaScript.
 */
const routeElements = (
  <>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/vamp" element={<Vamp />} />
              <Route path="/prediction-2026" element={<Prediction2026Article />} />
              <Route path="/payment-gateway-guide" element={<PaymentGatewayGuide />} />
              <Route path="/swipe-fee-settlement" element={<SwipeFeeSettlement />} />
              <Route path="/payments-survey-2025" element={<PaymentsSurvey2025 />} />
              <Route path="/3ds" element={<ThreeDS />} />
              <Route path="/3ds2" element={<ThreeDS2 />} />
              <Route path="/tap-to-mobile" element={<TapToMobile />} />
              <Route path="/construction-finance" element={<ConstructionFinance />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/security" element={<Security />} />
              <Route path="/developer-guides" element={<DeveloperPortal />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/TheMerchantPortal" element={<TheMerchantPortal />} />
              <Route path="/IntegrationOverview" element={<IntegrationOverview />} />
              <Route path="/DirectConnect" element={<DirectConnect />} />
              <Route path="/GatewayJs" element={<GatewayJs />} />
              <Route path="/Secure3DS" element={<Secure3DS />} />
              <Route path="/KountFraudManagement" element={<KountFraudManagement />} />
              <Route path="/AccountInformation" element={<AccountInformation />} />
              <Route path="/AddressVerification" element={<AddressVerification />} />
              <Route path="/AutomaticCardUpdater" element={<AutomaticCardUpdater />} />
              <Route path="/AutomaticLevelIII" element={<AutomaticLevelIII />} />
              <Route path="/BillingStatement" element={<BillingStatement />} />
              <Route path="/BlindCredits" element={<BlindCredits />} />
              <Route path="/CardIDVerification" element={<CardIDVerification />} />
              <Route path="/CountryCurrencyConfiguration" element={<CountryCurrencyConfiguration />} />
              <Route path="/CustomerFeeConfiguration" element={<CustomerFeeConfiguration />} />
              <Route path="/DkimSpfValidation" element={<DkimSpfValidation />} />
              <Route path="/EmailTemplateChanges" element={<EmailTemplateChanges />} />
              <Route path="/InvoiceLookFeel" element={<InvoiceLookFeel />} />
              <Route path="/ManagingPartnerUsers" element={<ManagingPartnerUsers />} />
              <Route path="/MerchantDefinedFields" element={<MerchantDefinedFields />} />
              <Route path="/MerchantIPRestrictions" element={<MerchantIPRestrictions />} />
              <Route path="/MerchantServiceProviderContacts" element={<MerchantServiceProviderContacts />} />
              <Route path="/MerchantUserAccounts" element={<MerchantUserAccounts />} />
              <Route path="/PasswordPolicy90Day" element={<PasswordPolicy90Day />} />
              <Route path="/ReportConfiguration" element={<ReportConfiguration />} />
              <Route path="/SecCodeConfiguration" element={<SecCodeConfiguration />} />
              <Route path="/SettlementSchedule" element={<SettlementSchedule />} />
              <Route path="/SpfDkimRecords" element={<SpfDkimRecords />} />
              <Route path="/SubscriptionReports" element={<SubscriptionReports />} />
              <Route path="/TestMode" element={<TestMode />} />
              <Route path="/TransactionReports" element={<TransactionReports />} />
              <Route path="/TransactionRouting" element={<TransactionRouting />} />
              <Route path="/TwoFactorAuthentication" element={<TwoFactorAuthentication />} />
              <Route path="/WhatIsACH" element={<WhatIsACH />} />
              <Route path="/CollectCheckout" element={<CollectCheckout />} />
              <Route path="/CollectJs" element={<CollectJs />} />
              <Route path="/CustomerPresentCloud" element={<CustomerPresentCloud />} />
              <Route path="/HostedPaymentPage" element={<HostedPaymentPage />} />
              <Route path="/MobileSDK" element={<MobileSDK />} />
              <Route path="/PaymentAPI" element={<PaymentAPI />} />
              <Route path="/PaymentDeviceSDK" element={<PaymentDeviceSDK />} />
              <Route path="/QueryAPI" element={<QueryAPI />} />
              <Route path="/ThreeStepRedirect" element={<ThreeStepRedirect />} />
              <Route path="/Webhooks" element={<Webhooks />} />
              <Route path="/supported-processors" element={<SupportedProcessors />} />
              <Route path="/device-catalog" element={<DeviceCatalog />} />
              <Route path="/pipeline" element={<Pipeline />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
  </>
);

const routeObjects = createRoutesFromChildren(routeElements.props.children);

/** Start downloading the page for `pathname`, if it's a lazy page. Resolves when it's ready. */
// The route table lives here because scripts/prerender.mjs reads routes from this file.
// eslint-disable-next-line react-refresh/only-export-components
export const preloadRoute = async (pathname: string) => {
  const matches = matchRoutes(routeObjects, pathname) ?? [];
  await Promise.all(
    matches.map(({ route }) => {
      const type = (route.element as JSX.Element | undefined)?.type;
      return isLazyPage(type) ? type.preload().catch(() => undefined) : undefined;
    }),
  );
};

/*
 * Only reached if a page suspends outside a navigation transition (the first
 * page is preloaded in main.tsx, and navigations keep the old page on screen).
 * It holds the page's space quietly; <RouteProgress /> shows that work is happening.
 */
const PageFallback = () => <div className="min-h-screen bg-background" aria-busy="true" />;

export const AppRoutes = () => (
  <Suspense fallback={<PageFallback />}>
    <Routes>{routeElements}</Routes>
  </Suspense>
);

/**
 * Providers shared by the browser and the prerender. `helmetContext` is only
 * passed by the prerender, which reads the collected <head> tags back out.
 */
export const AppProviders = ({
  children,
  helmetContext,
}: {
  children: ReactNode;
  helmetContext?: Record<string, unknown>;
}) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

/** Preload a page as soon as the visitor points at, focuses or touches a link to it. */
const PreloadOnIntent = () => {
  useEffect(() => {
    const onIntent = (event: Event) => {
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;
      if (link.pathname !== window.location.pathname) void preloadRoute(link.pathname);
    };
    const events = ["pointerover", "focusin", "touchstart"] as const;
    events.forEach((name) => document.addEventListener(name, onIntent, { passive: true }));
    return () => events.forEach((name) => document.removeEventListener(name, onIntent));
  }, []);
  return null;
};

const App = () => (
  <AppProviders>
    {/* v7_startTransition keeps the current page on screen while the next one loads. */}
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteProgress />
      <PreloadOnIntent />
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
);

export default App;

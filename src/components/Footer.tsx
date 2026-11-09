import { MerchantApplicationDialog } from "./MerchantApplicationDialog";
import { useState } from "react";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/device-catalog", label: "Device catalog" },
  { href: "/blog", label: "Blog" },
  { href: "https://ops-terminal.merchant.haus/merchant-apply", label: "Apply now" },
  {
    href: "https://merchanthausio.transactiongateway.com/merchants/login.php?cookie_check=1",
    label: "Client login",
    external: true,
  },
];

const resourceLinks = [
  { href: "/TheMerchantPortal", label: "The merchant portal" },
  { href: "/terms", label: "Terms and conditions" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/security", label: "Security and compliance" },
  { href: "/developer-guides", label: "Developer guides" },
];

const seals = [
  { src: "/trust-seals/pci-dss.png", alt: "PCI DSS Level 1 Compliant", label: "PCI DSS compliant" },
  { src: "/trust-seals/ssl-secure.png", alt: "SSL Secure 256-bit Encryption", label: "256-bit SSL" },
  { src: "/trust-seals/bank-security.png", alt: "Bank-Level Security", label: "Bank-level security" },
  { src: "/trust-seals/247-support.png", alt: "24/7 Customer Support", label: "24/7 support" },
];

const headingClass = "text-xs font-bold uppercase leading-4 tracking-[0.08em] text-brand-cream";
const linkClass = "text-sm text-white/75 transition-colors duration-[120ms] hover:text-white";

/* The footer sits on neutral-dark in both themes, so it uses white text and the white lockup. */
const Footer = () => {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  return (
    <footer className="relative z-20 bg-neutral-dark text-white/75">
      <div className="px-6 md:px-16 lg:px-24 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr] mb-12">
          <div className="space-y-6">
            <img
              src="/favicons/icon_pack_updated/logo_horizontal.webp"
              alt="merchanthaus.io"
              className="h-10 w-auto"
              loading="lazy"
            />
            <p className="max-w-md text-sm font-light leading-relaxed text-white/75">
              Empowering mid-market and enterprise organizations through tailored payment processing solutions.
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-white">Phone</span>{" "}
                <a href="tel:+15056006042" className={linkClass}>
                  1-505-600-6042
                </a>
              </div>
              <div>
                <span className="font-semibold text-white">Email</span>{" "}
                <button onClick={() => setIsApplicationOpen(true)} className={`${linkClass} text-left`}>
                  support@merchanthaus.io
                </button>
              </div>
              <div className="leading-relaxed">
                1209 Mountain Road Pl NE Ste N
                <br />
                Albuquerque, NM 87110 US
              </div>
            </div>
          </div>

          <div>
            <h4 className={`${headingClass} mb-6`}>Quick links</h4>
            <ul className="space-y-3.5">
              {quickLinks.map(({ href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={linkClass}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`${headingClass} mb-6`}>Resources</h4>
            <ul className="space-y-3.5 mb-10">
              {resourceLinks.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className={`${headingClass} mb-6`}>Follow us</h4>
            <ul className="space-y-3.5">
              <li>
                <a href="#" className={linkClass}>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust seals */}
        <div className="border-t border-white/10 py-10">
          <h4 className={`${headingClass} mb-8 text-center`}>Trusted and secure payment processing</h4>
          <div className="flex flex-wrap items-center justify-center gap-8 xl:gap-12">
            {seals.map(({ src, alt, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <img src={src} alt={alt} className="h-16 w-16 rounded-md object-contain xl:h-20 xl:w-20" />
                <span className="text-xs text-white/70">{label}</span>
              </div>
            ))}
            <img src="/logos/visa.webp" alt="Visa" className="h-10 w-auto object-contain opacity-70 xl:h-12" />
            <img src="/logos/mastercard.webp" alt="Mastercard" className="h-10 w-auto object-contain opacity-70 xl:h-12" />
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-white/70">
            Payment processing services are provided by NMI Payments, a registered ISO/MSP of Merrick Bank, Woodbury,
            NY. MerchantHaus LLC provides payment technology and support services.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} MerchantHaus LLC. All rights reserved.</p>
          <nav className="flex gap-6">
            <a href="/privacy" className="transition-colors hover:text-white">
              Privacy policy
            </a>
            <a href="/terms" className="transition-colors hover:text-white">
              Terms and conditions
            </a>
          </nav>
        </div>
      </div>

      <MerchantApplicationDialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen} />
    </footer>
  );
};

export default Footer;

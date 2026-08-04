import shieldLogo from "@/assets/shield.webp";
import { MerchantApplicationDialog } from "./MerchantApplicationDialog";
import { useState } from "react";

const Footer = () => {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  return (
    <footer className="relative z-20 border-t border-border bg-background dark:bg-neutral-dark text-foreground">
      <div className="px-6 md:px-16 lg:px-24 py-16 xl:py-20 2xl:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 xl:gap-16 2xl:gap-20 mb-12 xl:mb-16">
          {/* Logo + Contact - Wider column */}
          <div className="space-y-6 xl:space-y-8 md:col-span-2">
            <div className="flex items-center gap-3 xl:gap-4 mb-2">
              <img src={shieldLogo} alt="MerchantHaus Shield" className="h-10 w-10 xl:h-12 xl:w-12" loading="lazy" />
              <h3 className="font-rajdhani font-medium text-xl xl:text-2xl 2xl:text-3xl text-foreground tracking-wider uppercase">
                Merchant Haus
              </h3>
            </div>
            <p className="font-inter text-sm xl:text-base 2xl:text-lg text-muted-foreground max-w-md xl:max-w-lg leading-relaxed font-light">
              Empowering mid-market and enterprise organizations through tailored payment processing solutions.
            </p>
            <div className="space-y-3 xl:space-y-4 font-inter text-sm xl:text-base text-muted-foreground">
              <div>
                <span className="text-foreground font-medium">Phone:</span>{" "}
                <a href="tel:+15056006042" className="hover:text-foreground transition-colors">
                  1-505-600-6042
                </a>
              </div>
              <div>
                <span className="text-foreground font-medium">Email:</span>{" "}
                <button
                  onClick={() => setIsApplicationOpen(true)}
                  className="hover:text-foreground transition-colors text-left"
                >
                  support@merchanthaus.io
                </button>
              </div>
              <div className="text-muted-foreground text-sm xl:text-base leading-relaxed">
                1209 Mountain Road Pl NE Ste N<br />
                Albuquerque, NM 87110 US
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-ubuntu font-semibold text-sm xl:text-base text-foreground mb-6 xl:mb-8 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-3 xl:space-y-4 font-inter text-sm xl:text-base">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/device-catalog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Device Catalog
                </a>
              </li>
              <li>
                <a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://ops-terminal.merchant.haus/merchant-apply" className="text-muted-foreground hover:text-foreground transition-colors">
                  Apply Now
                </a>
              </li>
              <li>
                <a
                  href="https://merchanthausio.transactiongateway.com/merchants/login.php?cookie_check=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Client Login
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Social */}
          <div>
            <h4 className="font-ubuntu font-semibold text-sm xl:text-base text-foreground mb-6 xl:mb-8 tracking-wide uppercase">Resources</h4>
            <ul className="space-y-3 xl:space-y-4 font-inter text-sm xl:text-base mb-8 xl:mb-10">
              <li>
                <a href="/TheMerchantPortal" className="text-muted-foreground hover:text-foreground transition-colors">
                  The Merchant Portal
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/security" className="text-muted-foreground hover:text-foreground transition-colors">
                  Security & Compliance
                </a>
              </li>
              <li>
                <a href="/developer-guides" className="text-muted-foreground hover:text-foreground transition-colors">
                  Developer Guides
                </a>
              </li>
            </ul>

            <h4 className="font-ubuntu font-semibold text-sm xl:text-base text-foreground mb-6 xl:mb-8 tracking-wide uppercase">Follow Us</h4>
            <ul className="space-y-3 xl:space-y-4 font-inter text-sm xl:text-base">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Seals Section */}
        <div className="py-8 xl:py-12 border-t border-border">
          <h4 className="font-ubuntu font-semibold text-sm xl:text-base text-foreground text-center mb-6 xl:mb-8 tracking-wide uppercase">
            Trusted & Secure Payment Processing
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-8 xl:gap-12 2xl:gap-16">
            <div className="flex flex-col items-center group">
              <img
                src="/trust-seals/pci-dss.png"
                alt="PCI DSS Level 1 Compliant"
                className="h-16 w-16 xl:h-20 xl:w-20 object-contain opacity-60 group-hover:opacity-80 transition-all"
              />
              <span className="text-xs xl:text-sm text-muted-foreground mt-2 xl:mt-3">PCI DSS Compliant</span>
            </div>
            <div className="flex flex-col items-center group">
              <img
                src="/trust-seals/ssl-secure.png"
                alt="SSL Secure 256-bit Encryption"
                className="h-16 w-16 xl:h-20 xl:w-20 object-contain opacity-60 group-hover:opacity-80 transition-all"
              />
              <span className="text-xs xl:text-sm text-muted-foreground mt-2 xl:mt-3">256-bit SSL</span>
            </div>
            <div className="flex flex-col items-center group">
              <img
                src="/trust-seals/bank-security.png"
                alt="Bank-Level Security"
                className="h-16 w-16 xl:h-20 xl:w-20 object-contain opacity-60 group-hover:opacity-80 transition-all"
              />
              <span className="text-xs xl:text-sm text-muted-foreground mt-2 xl:mt-3">Bank-Level Security</span>
            </div>
            <div className="flex flex-col items-center group">
              <img
                src="/trust-seals/247-support.png"
                alt="24/7 Customer Support"
                className="h-16 w-16 xl:h-20 xl:w-20 object-contain opacity-60 group-hover:opacity-80 transition-all"
              />
              <span className="text-xs xl:text-sm text-muted-foreground mt-2 xl:mt-3">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center group">
              <img
                src="/logos/visa.webp"
                alt="Visa"
                className="h-10 xl:h-12 w-auto object-contain opacity-50 group-hover:opacity-70 transition-all"
              />
            </div>
            <div className="flex flex-col items-center group">
              <img
                src="/logos/mastercard.webp"
                alt="Mastercard"
                className="h-10 xl:h-12 w-auto object-contain opacity-50 group-hover:opacity-70 transition-all"
              />
            </div>
          </div>
          <p className="text-xs xl:text-sm text-muted-foreground text-center leading-relaxed max-w-3xl xl:max-w-4xl mx-auto mt-6 xl:mt-8">
            Payment processing services are provided by NMI Payments, a registered ISO/MSP of Merrick Bank, Woodbury, NY. MerchantHaus LLC provides payment technology and support services.
          </p>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 xl:pt-10 border-t border-border text-center font-inter text-xs xl:text-sm text-muted-foreground">
          <p>
            &copy; MerchantHaus {new Date().getFullYear()}. All rights reserved. |{" "}
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a> |{" "}
            <a href="/terms" className="hover:text-foreground transition-colors">Terms and Conditions</a>
          </p>
        </div>
      </div>

      <MerchantApplicationDialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen} />
    </footer>
  );
};

export default Footer;

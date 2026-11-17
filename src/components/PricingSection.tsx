import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { PRIMARY_CTA } from "@/lib/cta";

/* Annual billing is the monthly price for 12 months, less this discount. */
const ANNUAL_DISCOUNT = 0.17;
const ANNUAL_DISCOUNT_PERCENT = Math.round(ANNUAL_DISCOUNT * 100);

const annualPriceFor = (monthlyPrice: number) => Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT));

/* One name for the Shopify feature on every plan. */
const SHOPIFY_FEATURE = "Shopify integration";

type Plan = {
  name: string;
  description: string;
  /** null for custom pricing. */
  monthlyPrice: number | null;
  features: string[];
  limitations: string[];
  gradient: string;
  popular: boolean;
};

const pricingPlans: Plan[] = [
  {
    name: "Foundation",
    description: "Essential fraud-first platform for growing businesses",
    monthlyPrice: 59,
    features: [
      "Network Tokens (Customer Token Vault)",
      "Customer Vault secure storage",
      "Basic Fraud Prevention engine",
      "Mobile Payment Gateway device",
      "TXT2PAY billing tools",
      "Automatic Card Updater",
      "Standard dashboard & reporting",
      "Email support",
    ],
    limitations: [
      "AI\u2011powered fraud scoring (Kount)",
      "Level III data optimization",
      SHOPIFY_FEATURE,
      "Priority support",
      "API access",
      "Dedicated account manager",
      "White\u2011label options",
    ],
    gradient: "from-cyan-500/10 to-blue-500/10",
    popular: false,
  },
  {
    name: "Growth",
    description: "Advanced fraud protection with AI decisioning",
    monthlyPrice: 99,
    features: [
      "Everything in Foundation",
      "Kount AI Fraud Manager",
      "Enhanced rule\u2011based risk controls",
      "Priority support",
      "API access",
    ],
    limitations: [
      "Level III data optimization",
      SHOPIFY_FEATURE,
      "Dedicated account manager",
      "White\u2011label options",
    ],
    gradient: "from-orange-500/10 to-pink-500/10",
    popular: true,
  },
  {
    name: "Scale",
    description: "Full fraud suite + advanced data optimization",
    monthlyPrice: 149,
    features: [
      "Everything in Growth",
      "Level III Advantage (B2B optimization)",
      SHOPIFY_FEATURE,
      "Custom analytics & reporting",
      "Dedicated account manager",
      "White\u2011label options",
    ],
    limitations: [],
    gradient: "from-blue-500/10 to-purple-500/10",
    popular: false,
  },
  {
    name: "Enterprise",
    description: "Bespoke solutions for high-volume businesses",
    monthlyPrice: null,
    features: [
      "Everything in Scale",
      "Custom Fraud Rulesets",
      "SLA performance guarantees",
      "Multi\u2011entity & Org management",
      "Dedicated engineering support",
      "Volume\u2011based processing rates",
      "Tailored implementation",
    ],
    limitations: [],
    gradient: "from-indigo-500/20 via-blue-500/10 to-emerald-500/20",
    popular: false,
  },
];

/* Comparison-table marks. The label is the accessible name, and the Markdown copies turn it into text. */
const Included = () => (
  <Check role="img" aria-label="Included" className="h-5 w-5 text-brand-slate-text inline" />
);
const NotIncluded = () => (
  <X role="img" aria-label="Not included" className="h-5 w-5 text-muted-foreground inline" />
);

const PlanPrice = ({ monthlyPrice, billingCycle }: { monthlyPrice: number | null; billingCycle: "monthly" | "annual" }) => {
  const amountClass = "text-[44px] font-extrabold leading-[44px] tracking-[-0.02em] text-foreground";

  if (monthlyPrice === null) {
    return <span className={amountClass}>Custom</span>;
  }

  const annualPrice = annualPriceFor(monthlyPrice);
  const annualSaving = monthlyPrice * 12 - annualPrice;

  if (billingCycle === "annual") {
    return (
      <>
        <span className={amountClass}>${Math.round(annualPrice / 12)}</span>
        <span className="text-base text-muted-foreground">/mo</span>
        <div className="mt-1 text-xs text-muted-foreground">${annualPrice.toLocaleString("en-US")} billed annually</div>
        <div className="mt-1 text-xs font-semibold text-brand-slate-text">Save ${annualSaving.toLocaleString("en-US")}</div>
      </>
    );
  }

  return (
    <>
      <span className={amountClass}>${monthlyPrice}</span>
      <span className="text-base text-muted-foreground">/month</span>
      <div className="mt-1 text-xs text-muted-foreground">
        or ${annualPrice.toLocaleString("en-US")}/yr, save {ANNUAL_DISCOUNT_PERCENT}%
      </div>
    </>
  );
};

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <section id="pricing" className="scroll-mt-20 py-24 md:py-32 bg-background border-t border-border">
      <div className="px-6 md:px-16 lg:px-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-[40px] leading-[44px] md:text-[52px] md:leading-[56px] text-heading mb-4">
            Transparent pricing
          </h2>
          <p className="text-lg leading-[27px] font-light text-muted-foreground max-w-2xl mx-auto mb-8">
            Every plan includes our fraud-first foundation: network tokens, customer vault and basic fraud prevention. Custom volume pricing available.
          </p>

          <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as "monthly" | "annual")} className="inline-flex">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">
                Annual
                <span className="rounded-pill bg-brand-slate px-2 py-0.5 text-xs font-semibold text-brand-slate-foreground">
                  Save {ANNUAL_DISCOUNT_PERCENT}%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Plan cards are counter-colour surfaces: navy on the cream page, cream on the navy page. */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`inverse relative flex flex-col gap-6 rounded-2xl bg-card p-8 ${
                plan.popular ? "border-2 border-brand-slate shadow-marketing" : "border border-border"
              }`}
            >
              {plan.popular && (
                <Badge variant="slate" className="absolute right-6 top-6">
                  Popular
                </Badge>
              )}
              <div>
                <h3 className="text-[22px] font-bold leading-7 tracking-[-0.015em] text-heading">{plan.name}</h3>
                <p className="mt-2 min-h-[40px] text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6">
                  <PlanPrice monthlyPrice={plan.monthlyPrice} billingCycle={billingCycle} />
                </div>
              </div>
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-slate-text" aria-hidden="true" />
                    <span>
                      <span className="sr-only">Included: </span>
                      {feature}
                    </span>
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground opacity-60">
                    <X className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="sr-only">Not included: </span>
                      {limitation}
                    </span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant={plan.popular ? "pill" : "cta-outline"} className="w-full">
                <a href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</a>
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h3 className="text-2xl font-bold text-center mb-8">Feature comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="text-left py-4 px-4 font-semibold">Features</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.name} scope="col" className="text-center py-4 px-4 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <th scope="row" className="py-4 px-4 text-left font-normal">AI Fraud Detection (Kount)</th>
                  <td className="text-center py-4 px-4"><NotIncluded /></td>
                  <td className="text-center py-4 px-4"><Included /></td>
                  <td className="text-center py-4 px-4"><Included /></td>
                  <td className="text-center py-4 px-4"><Included /></td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <th scope="row" className="py-4 px-4 text-left font-normal">Support Level</th>
                  <td className="text-center py-4 px-4 text-sm">Email</td>
                  <td className="text-center py-4 px-4 text-sm">Priority</td>
                  <td className="text-center py-4 px-4 text-sm">Dedicated AM</td>
                  <td className="text-center py-4 px-4 text-sm font-semibold">24/7 Engineering</td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <th scope="row" className="py-4 px-4 text-left font-normal">Custom Processing Rates</th>
                  <td className="text-center py-4 px-4"><NotIncluded /></td>
                  <td className="text-center py-4 px-4"><NotIncluded /></td>
                  <td className="text-center py-4 px-4"><NotIncluded /></td>
                  <td className="text-center py-4 px-4"><Included /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

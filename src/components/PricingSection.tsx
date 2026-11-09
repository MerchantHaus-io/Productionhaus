import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

// Updated Pricing tiers including the new high-visibility Enterprise plan.
const pricingPlans = [
  {
    name: "Foundation",
    description: "Essential fraud-first platform for growing organizations",
    monthlyPrice: 59,
    annualPrice: 588,
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
      "Shopify premium integration",
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
    annualPrice: 986,
    features: [
      "Everything in Foundation",
      "Kount AI Fraud Manager",
      "Enhanced rule\u2011based risk controls",
      "Priority support",
      "API access",
    ],
    limitations: [
      "Level III data optimization",
      "Shopify premium integration",
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
    annualPrice: 1484,
    features: [
      "Everything in Growth",
      "Level III Advantage (B2B optimization)",
      "Shopify Integration",
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
    description: "Bespoke solutions for high-volume organizations",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
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
                  Save 17%
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
                  {typeof plan.monthlyPrice === "number" ? (
                    <>
                      <span className="text-[44px] font-extrabold leading-[44px] tracking-[-0.02em] text-foreground">
                        ${billingCycle === "monthly" ? plan.monthlyPrice : Math.round((plan.annualPrice as number) / 12)}
                      </span>
                      <span className="text-base text-muted-foreground">/month</span>
                      {billingCycle === "annual" && (
                        <div className="mt-1 text-xs text-muted-foreground">${plan.annualPrice} billed annually</div>
                      )}
                    </>
                  ) : (
                    <span className="text-[44px] font-extrabold leading-[44px] tracking-[-0.02em] text-foreground">
                      Custom
                    </span>
                  )}
                </div>
              </div>
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-slate-text" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
                {plan.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground opacity-60">
                    <X className="mt-0.5 h-5 w-5 shrink-0" aria-label="Not included:" />
                    {limitation}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant={plan.popular ? "pill" : "cta-outline"} className="w-full">
                <a href="/#contact">{plan.name === "Enterprise" ? "Contact sales" : "Get started"}</a>
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
                  <th className="text-left py-4 px-4 font-semibold">Features</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.name} className="text-center py-4 px-4 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4">AI Fraud Detection (Kount)</td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground inline" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-brand-slate-text inline" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-brand-slate-text inline" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-brand-slate-text inline" /></td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4">Support Level</td>
                  <td className="text-center py-4 px-4 text-sm">Email</td>
                  <td className="text-center py-4 px-4 text-sm">Priority</td>
                  <td className="text-center py-4 px-4 text-sm">Dedicated AM</td>
                  <td className="text-center py-4 px-4 text-sm font-semibold">24/7 Engineering</td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4">Custom Processing Rates</td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground inline" /></td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground inline" /></td>
                  <td className="text-center py-4 px-4"><X className="h-5 w-5 text-muted-foreground inline" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-brand-slate-text inline" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

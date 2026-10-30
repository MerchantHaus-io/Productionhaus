import { Check, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";

const turnaround = [
  { step: "Proposal, after we get your statement", time: "1 business day" },
  { step: "Approval, standard businesses", time: "1–3 business days" },
  { step: "Approval, higher-risk businesses", time: "About 2 weeks" },
  { step: "Live, after approval", time: "1 business day" },
];

const documentGroups = [
  {
    title: "Every business",
    items: [
      "Signed application (e-sign)",
      "Photo ID for each owner with 25% or more ownership, and for the person signing",
      "Voided business check, or a bank letter on letterhead (starter checks usually aren't accepted)",
      "EIN confirmation letter from the IRS",
      "Articles of incorporation or organization, and a business license where required",
      "Your last 3 months of processing statements, if you take cards today",
    ],
  },
  {
    title: "Selling online? Also have ready:",
    items: [
      "A live website with your refund policy, privacy policy, terms, contact details, product descriptions with prices, and shipping timelines",
    ],
  },
  {
    title: "Sometimes requested:",
    items: [
      "Business bank statements, for newer or higher-risk businesses",
      "Financial statements, for higher processing volumes",
    ],
  },
];

export const OnboardingDetails = () => {
  return (
    <section id="what-you-need" className="scroll-mt-20 py-24 px-6 md:px-16 lg:px-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-14 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl text-foreground mb-6">Turnaround times</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold">Step</th>
                  <th scope="col" className="py-3 text-right font-semibold">Typical time</th>
                </tr>
              </thead>
              <tbody>
                {turnaround.map((row) => (
                  <tr key={row.step} className="border-b border-border">
                    <td className="py-3 pr-4 text-muted-foreground">{row.step}</td>
                    <td className="py-3 text-right font-medium text-foreground whitespace-nowrap">{row.time}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="py-4 pr-4 text-left font-semibold text-foreground">Start to finish</th>
                  <td className="py-4 text-right font-display text-2xl text-primary-text whitespace-nowrap">
                    About a week
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Times are typical. They start once we have a complete application and depend on processor underwriting.
            </p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl text-foreground mb-6">What you'll need</h2>
            <div className="space-y-8">
              {documentGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
                    {group.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-text" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-semibold">Keeping your processor:</span> we only need your business and owner
                details plus the VAR sheet.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4 bg-muted p-6 md:p-7">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary-text" aria-hidden="true" />
          <p className="text-sm md:text-base leading-relaxed text-foreground">
            <span className="font-semibold">Tip:</span> Make sure your legal business name, EIN, owner names and bank
            details match on every document. Mismatches are the most common reason approvals get held up.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-start gap-8 border-t border-border pt-12 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-4xl md:text-5xl leading-none text-foreground">
            Plug in, play and process<span className="text-brand-red-text">.</span>
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="rounded-none px-8 tracking-wide">
              <a href="https://ops-terminal.merchant.haus/contact">Book a 15-minute call</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-none px-8 tracking-wide">
              <a href="#contact">Send us a statement</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

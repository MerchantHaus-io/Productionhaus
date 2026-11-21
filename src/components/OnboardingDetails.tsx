import { Check, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/cta";
import { RevealGroup, RevealWords } from "@/components/Reveal";
import { reveal, revealChild } from "@/lib/reveal";

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
    <RevealGroup as="section" stagger={70} id="what-you-need" className="scroll-mt-20 py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-14 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div>
            <h2 {...reveal("words")} className="font-display text-[40px] leading-[44px] text-heading mb-3">
              <RevealWords text="Turnaround times" />
            </h2>
            <p {...reveal("up")} className="mb-6 text-sm leading-relaxed text-muted-foreground">
              Most businesses are live in about a week. Higher-risk approvals take about two weeks.
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground text-left">
                  <th scope="col" className="py-3 pr-4 font-semibold">Step</th>
                  <th scope="col" className="py-3 text-right font-semibold">Typical time</th>
                </tr>
              </thead>
              <tbody>
                {turnaround.map((row) => (
                  <tr key={row.step} {...reveal("right")} className="border-b border-border">
                    <td className="py-3 pr-4 text-muted-foreground">{row.step}</td>
                    <td className="py-3 text-right font-medium text-foreground whitespace-nowrap">{row.time}</td>
                  </tr>
                ))}
                <tr {...reveal("fade")}>
                  <th scope="row" className="py-4 pr-4 text-left font-semibold text-foreground">Start to finish</th>
                  <td className="py-4 text-right font-display text-2xl text-primary-text whitespace-nowrap">
                    {/* The answer the table builds to lands last, with a little weight. */}
                    <span {...revealChild("pop", 240)} className="inline-block origin-right">
                      About a week
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p {...reveal("fade")} className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Times are typical. They start once we have a complete application and depend on processor underwriting.
            </p>
          </div>

          <div>
            <h2 {...reveal("words")} className="font-display text-[40px] leading-[44px] text-heading mb-6">
              <RevealWords text="What you'll need" />
            </h2>
            <div className="space-y-8">
              {documentGroups.map((group) => (
                <div key={group.title}>
                  <h3 {...reveal("fade")} className="text-xs font-bold uppercase leading-4 tracking-[0.08em] text-heading mb-3">
                    {group.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} {...reveal("left")} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        {/* Each item is ticked off as it arrives. */}
                        <span {...revealChild("pop", 180)} className="mt-0.5 inline-flex shrink-0">
                          <Check className="h-4 w-4 text-brand-slate-text" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p {...reveal("up")} className="text-sm leading-relaxed text-foreground">
                <span className="font-semibold">Keeping your processor:</span> we only need your business and owner
                details plus the VAR sheet.
              </p>
            </div>
          </div>
        </div>

        <div {...reveal("up")} className="mt-12 flex gap-4 rounded-xl bg-muted p-6">
          <span {...revealChild("pop", 200)} className="mt-0.5 inline-flex shrink-0">
            <Lightbulb className="h-5 w-5 text-primary-text" aria-hidden="true" />
          </span>
          <p className="text-sm md:text-base leading-relaxed text-foreground">
            <span className="font-semibold">Tip:</span> Make sure your legal business name, EIN, owner names and bank
            details match on every document. Mismatches are the most common reason approvals get held up.
          </p>
        </div>

        <div className="relative mt-16 flex flex-col items-start gap-8 pt-12 md:flex-row md:items-center md:justify-between">
          {/* The rule draws itself across before the sign-off line rises. */}
          <span
            {...reveal("fade")}
            className="absolute inset-x-0 top-0 block h-px"
            aria-hidden="true"
          >
            <span {...revealChild("draw", 0)} className="block h-full w-full origin-left bg-border" />
          </span>
          <p {...reveal("words", 120)} className="font-display text-[40px] leading-[44px] md:text-[50px] md:leading-[59px] text-heading">
            <RevealWords text="Plug in, play and process" suffix={<span className="text-brand-red-text">.</span>} step={70} />
          </p>
          <div {...reveal("up", 360)} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" variant="pill">
              <a href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</a>
            </Button>
            <Button asChild size="lg" variant="cta-outline">
              <a href={SECONDARY_CTA.href}>{SECONDARY_CTA.label}</a>
            </Button>
          </div>
        </div>
      </div>
    </RevealGroup>
  );
};

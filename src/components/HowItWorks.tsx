import { Code2, Plug } from "lucide-react";

type Step = {
  title: string;
  time?: string;
  body: string;
  note?: string;
};

const steps: Step[] = [
  {
    title: "Talk to us",
    time: "15 minutes",
    body: "Tell us what you sell, how you take payments and what you use today. We'll tell you on the call whether we're a fit.",
  },
  {
    title: "Get your numbers",
    time: "Within 1 business day",
    body: "Send one recent processing statement. We'll show you what you pay now, what you'd pay with us, and every fee in plain English. If you don't have a statement yet, we'll quote from your estimates.",
  },
  {
    title: "Say yes and get one packet",
    body: "You get one e-sign application and one checklist, and you upload everything at once.",
  },
  {
    title: "Approval",
    time: "Typically 1 to 3 business days",
    body: "We manage underwriting and keep you updated. If the bank needs anything else, we ask once, for everything together.",
    note: "Building an integration? Your developer gets a free sandbox on day one, so the build happens while approval runs.",
  },
  {
    title: "Go live",
    time: "Within 1 business day of approval",
    body: "We activate your gateway and switch your keys to live. Then we run a test sale and refund with you and confirm the money reaches your bank. Gateway billing starts when your live account is activated, not before.",
  },
  {
    title: "We check in",
    body: "We check in at day 7, day 30 and day 90. At day 30 we compare your first statement against your quote.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-24 px-6 md:px-16 lg:px-24 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-8 h-px bg-brand-slate" />
            <span className="text-xs tracking-[0.22em] uppercase text-muted-foreground">How it works</span>
          </div>
          <h2 className="text-4xl md:text-5xl leading-[1.05] text-foreground mb-5">
            From first call to first deposit in about a week
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            One clear path with no surprises. Here's what happens, how long each step takes, and what we'll need from
            you.
          </p>
        </div>

        <h3 className="sr-only">The process</h3>
        <ol className="grid gap-px bg-border border border-border md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-4 bg-card p-7">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display text-5xl leading-none text-primary-text" aria-hidden="true">
                  {index + 1}
                </span>
                {step.time && (
                  <span className="text-right text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                    {step.time}
                  </span>
                )}
              </div>
              <h4 className="text-lg font-semibold text-foreground">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              {step.note && (
                <p className="mt-auto flex gap-3 border-t border-border pt-4 text-sm leading-relaxed text-foreground">
                  <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-text" aria-hidden="true" />
                  {step.note}
                </p>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-5 bg-muted p-7 md:flex-row md:items-start md:p-9">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand-slate text-brand-slate-foreground">
            <Plug className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl text-foreground mb-2">Already have a processor? Keep it.</h3>
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-3xl">
              We plug the MerchantHaus gateway into your existing setup. All we need is a setup sheet, called a VAR sheet,
              from your processor. Ask them for it the day you sign up, because it's usually the longest wait.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

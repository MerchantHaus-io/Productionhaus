import { useEffect } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";

/**
 * Blog post: the Visa / Mastercard swipe-fee settlement, explained for merchants.
 * Published October 27, 2026 — ahead of the November 16, 2026 final approval hearing.
 *
 * Follows the editorial template used by PaymentGatewayGuide.tsx (DM Serif Display / Montserrat,
 * numbered sections, callouts, data tables). Colours come from the site's own
 * theme tokens (--foreground, --muted, --border …) so the post follows light and dark mode,
 * with MH Red as the single accent.
 */

const accent = "#C8102E";

const blogStyles = `

  .sfs-root {
    --sfs-text: hsl(var(--foreground));
    --sfs-text-2: hsl(var(--muted-foreground));
    --sfs-rule: hsl(var(--border));
    --sfs-panel: hsl(var(--muted));
    --sfs-radius: var(--radius);

    font-family: 'Montserrat', system-ui, sans-serif;
    color: var(--sfs-text);
    max-width: 860px;
    margin: 0 auto;
    padding: 0 1.5rem 4rem;
    line-height: 1.75;
    font-size: 17px;
  }

  .sfs-root h1, .sfs-root h2, .sfs-root h3 {
    font-family: 'DM Serif Display', Georgia, serif;
    line-height: 1.2;
    font-weight: 700;
    color: var(--sfs-text);
  }

  .sfs-root a { color: var(--sfs-text); text-decoration: underline; text-decoration-color: ${accent}; text-underline-offset: 3px; }
  .sfs-root a:hover { color: ${accent}; }

  .sfs-hero {
    position: relative;
    overflow: hidden;
    border-bottom: 3px solid var(--sfs-text);
    padding: 3rem 0 2rem;
    margin-bottom: 3rem;
  }

  .sfs-kicker {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--sfs-text-2);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sfs-kicker::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 2px;
    background: ${accent};
  }

  .sfs-hero h1 {
    font-size: clamp(2.1rem, 5vw, 3.3rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    margin: 0 0 1.25rem;
    position: relative;
    z-index: 1;
  }

  .sfs-hero-sub {
    font-size: 1.15rem;
    font-style: italic;
    color: var(--sfs-text-2);
    max-width: 620px;
    margin-bottom: 2rem;
    font-weight: 300;
    position: relative;
    z-index: 1;
  }

  .sfs-meta {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 11px;
    color: var(--sfs-text-2);
    letter-spacing: 0.08em;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .sfs-watermark {
    position: absolute;
    top: -10px;
    right: -10px;
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 9rem;
    font-weight: 900;
    color: var(--sfs-text);
    opacity: 0.05;
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }

  .sfs-lead {
    font-size: 1.1rem;
    font-style: italic;
    font-weight: 300;
    color: var(--sfs-text-2);
    margin-bottom: 1.5rem;
    line-height: 1.7;
  }

  .sfs-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: var(--sfs-rule);
    border: 1px solid var(--sfs-rule);
    border-radius: var(--sfs-radius);
    overflow: hidden;
    margin: 2rem 0 2.5rem;
  }

  .sfs-stat {
    background: hsl(var(--background));
    padding: 1.1rem 1.25rem;
  }

  .sfs-stat-num {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2rem;
    font-weight: 900;
    line-height: 1.1;
    color: ${accent};
  }

  .sfs-stat-label {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sfs-text-2);
    margin-top: 0.4rem;
    line-height: 1.5;
  }

  .sfs-section { margin-bottom: 3.5rem; }

  .sfs-section-header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--sfs-rule);
  }

  .sfs-num {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 11px;
    color: ${accent};
    letter-spacing: 0.1em;
    flex-shrink: 0;
  }

  .sfs-section h2 {
    font-size: 1.75rem;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .sfs-section h3 {
    font-size: 1.2rem;
    margin: 2rem 0 0.5rem;
    letter-spacing: -0.01em;
  }

  .sfs-section p { margin-bottom: 1.25rem; }

  .sfs-qnum {
    font-family: 'Montserrat', system-ui, sans-serif;
    color: ${accent};
    font-weight: 500;
    margin-right: 0.4rem;
  }

  .sfs-pullquote {
    border-left: 3px solid ${accent};
    margin: 2rem 0;
    padding: 0.5rem 0 0.5rem 1.5rem;
  }

  .sfs-pullquote p {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.3rem;
    font-style: italic;
    font-weight: 400;
    margin: 0;
    line-height: 1.5;
  }

  .sfs-callout {
    background: var(--sfs-panel);
    border-left: 3px solid ${accent};
    border-radius: 0 var(--sfs-radius) var(--sfs-radius) 0;
    padding: 1.25rem 1.5rem;
    margin: 2rem 0;
  }

  .sfs-callout-label {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${accent};
    margin-bottom: 0.4rem;
    font-weight: 500;
  }

  .sfs-callout p { margin: 0; font-size: 15px; }
  .sfs-callout p + p { margin-top: 0.6rem; }

  .sfs-table-wrap {
    overflow-x: auto;
    margin: 1.5rem 0;
    -webkit-overflow-scrolling: touch;
  }

  .sfs-table {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    font-size: 14px;
  }

  .sfs-table thead th {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--sfs-text-2);
    border-bottom: 1.5px solid var(--sfs-text);
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-weight: 400;
  }

  .sfs-table tbody tr:nth-child(even) { background: var(--sfs-panel); }

  .sfs-table tbody td {
    padding: 0.7rem 0.75rem;
    border-bottom: 1px solid var(--sfs-rule);
    vertical-align: top;
    line-height: 1.5;
  }

  .sfs-table tbody td:first-child { font-weight: 600; white-space: nowrap; }
  .sfs-table .sfs-fine { color: var(--sfs-text-2); font-size: 13px; }

  .sfs-math {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 13.5px;
    background: var(--sfs-panel);
    border: 1px solid var(--sfs-rule);
    border-radius: var(--sfs-radius);
    padding: 1rem 1.25rem;
    margin: 1.5rem 0;
    line-height: 1.9;
    overflow-x: auto;
  }

  .sfs-math strong { color: ${accent}; font-weight: 500; }

  .sfs-flags { list-style: none; margin: 1.5rem 0; padding: 0; }

  .sfs-flags li {
    position: relative;
    padding: 0.6rem 0 0.6rem 1.75rem;
    border-bottom: 1px solid var(--sfs-rule);
  }

  .sfs-flags li::before {
    content: '\\2715';
    position: absolute;
    left: 0;
    top: 0.6rem;
    color: ${accent};
    font-family: 'Montserrat', system-ui, sans-serif;
    font-weight: 600;
  }

  .sfs-steps { list-style: none; margin: 1.5rem 0; padding: 0; counter-reset: sfs-step; }

  .sfs-steps li {
    counter-increment: sfs-step;
    position: relative;
    padding: 1rem 0 1rem 3rem;
    border-bottom: 1px solid var(--sfs-rule);
  }

  .sfs-steps li::before {
    content: counter(sfs-step, decimal-leading-zero);
    position: absolute;
    left: 0;
    top: 1.05rem;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 12px;
    color: ${accent};
    font-weight: 500;
  }

  .sfs-steps strong { display: block; font-weight: 600; margin-bottom: 0.2rem; }

  .sfs-cta { text-align: center; margin: 3rem 0 1rem; }

  .sfs-cta a {
    display: inline-block;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fff;
    background: ${accent};
    padding: 0.85rem 2rem;
    border-radius: var(--sfs-radius);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .sfs-cta a:hover { color: #fff; opacity: 0.9; }

  .sfs-divider { border: none; border-top: 1px solid var(--sfs-rule); margin: 3rem 0; }

  .sfs-sources { font-size: 14px; color: var(--sfs-text-2); padding-left: 1.1rem; margin: 0.75rem 0 0; }
  .sfs-sources li { margin-bottom: 0.35rem; }
  .sfs-sources a { color: var(--sfs-text-2); }

  .sfs-small-label {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--sfs-text-2);
  }

  @media (max-width: 640px) {
    .sfs-root { font-size: 16px; padding: 0 1rem 3rem; }
    .sfs-stats { grid-template-columns: 1fr; }
    .sfs-watermark { font-size: 5rem; }
    .sfs-section h2 { font-size: 1.45rem; }
  }
`;

export default function SwipeFeeSettlement() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="The Visa and Mastercard Swipe-Fee Settlement, Explained for Merchants"
        description="The $38 billion Visa and Mastercard settlement faces final approval on November 16, 2026. What it changes on rates, card acceptance and surcharging, what it doesn't, and five things to do now."
        path="/swipe-fee-settlement"
      />
      <style>{blogStyles}</style>

      <Header />

      <article className="sfs-root">

        <header className="sfs-hero">
          <span className="sfs-watermark" aria-hidden="true">%</span>
          <div className="sfs-kicker">Merchant Haus — Payments Briefing</div>
          <h1>The Swipe-Fee Settlement: What Actually Changes for Your Business</h1>
          <p className="sfs-hero-sub">
            Visa and Mastercard’s deal with U.S. merchants goes to its final approval hearing on November 16.
            Here’s what it changes, what it doesn’t, and five things worth doing before then.
          </p>
          <div className="sfs-meta">
            <span>October 27, 2026</span>
            <span>Merchant Haus</span>
            <span>7 min read</span>
          </div>
        </header>

        <p className="sfs-lead">
          The lawsuit started in 2005. Twenty-one years later, it’s close to finished. In June, a federal judge in
          Brooklyn gave preliminary approval to a revised settlement between Visa, Mastercard and a class of more than
          12 million U.S. merchants. If it clears its final hearing, it rewrites some of the oldest rules in card
          acceptance.
        </p>

        <p>
          You’ll see it called the “$38 billion settlement.” That number is worth understanding before anything else:
          it’s an estimate of how much merchants will save in fees over time. It is not a pot of money. Nobody is
          mailing you a cheque. What you get instead are lower rates on some cards, and new choices about which cards
          you take and what you charge for them.
        </p>

        <div className="sfs-stats">
          <div className="sfs-stat">
            <div className="sfs-stat-num">0.10%</div>
            <div className="sfs-stat-label">Average credit interchange cut, for five years</div>
          </div>
          <div className="sfs-stat">
            <div className="sfs-stat-num">1.25%</div>
            <div className="sfs-stat-label">Cap on standard consumer credit cards, for eight years</div>
          </div>
          <div className="sfs-stat">
            <div className="sfs-stat-num">3%</div>
            <div className="sfs-stat-label">Maximum credit surcharge, or your actual cost if lower</div>
          </div>
        </div>

        <hr className="sfs-divider" />

        <section className="sfs-section">
          <div className="sfs-section-header">
            <span className="sfs-num">01</span>
            <h2>What the settlement changes</h2>
          </div>

          <p>
            For decades, accepting Visa meant accepting <em>every</em> Visa credit card — the basic one and the
            heavy metal rewards card that costs you noticeably more to take. Think of a toll road that charges you
            based on which car your customer drives, and doesn’t let you close the lane to the expensive ones. The
            settlement changes the toll and lets you manage the lanes.
          </p>

          <div className="sfs-table-wrap">
            <table className="sfs-table">
              <thead>
                <tr>
                  <th>Change</th>
                  <th>What it means</th>
                  <th>The fine print</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lower rates</td>
                  <td>The average effective credit interchange rate drops by 10 basis points (0.10%) for five years.</td>
                  <td className="sfs-fine">It’s an <em>average</em>. Some card categories and industries will move more than others.</td>
                </tr>
                <tr>
                  <td>A ceiling</td>
                  <td>Standard consumer credit cards are capped at 1.25% for eight years. Visa also says posted U.S. credit rates are capped for five years.</td>
                  <td className="sfs-fine">The 1.25% cap does not cover premium rewards or commercial cards.</td>
                </tr>
                <tr>
                  <td>Pick your cards</td>
                  <td>You can choose whether to accept three groups of credit cards — commercial, premium consumer and standard consumer — and make different choices for Visa and Mastercard.</td>
                  <td className="sfs-fine">Premium and commercial cards will carry visual identifiers so staff and customers can tell them apart.</td>
                </tr>
                <tr>
                  <td>Surcharging</td>
                  <td>You can add a surcharge to Visa or Mastercard credit cards, by brand or by individual card product.</td>
                  <td className="sfs-fine">Credit only, never debit. Capped at 3% or your cost of acceptance, whichever is lower. State law still applies.</td>
                </tr>
                <tr>
                  <td>Wallets count too</td>
                  <td>The same choices apply inside digital wallets. You can accept some wallets and not others.</td>
                  <td className="sfs-fine">Useful if a wallet drives up your premium-card mix online.</td>
                </tr>
                <tr>
                  <td>Education fund</td>
                  <td>A merchant education program on acceptance and cost management, funded at around $21 million.</td>
                  <td className="sfs-fine">Details on how merchants access it haven’t been published yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr className="sfs-divider" />

        <section className="sfs-section">
          <div className="sfs-section-header">
            <span className="sfs-num">02</span>
            <h2>What it doesn’t do</h2>
          </div>

          <ul className="sfs-flags">
            <li><strong>It doesn’t pay you.</strong> There’s no cash fund in this deal. (The older $5.5 billion cash settlement, for merchants who took cards between 2004 and 2019, closed for claims a while ago.)</li>
            <li><strong>It doesn’t touch debit.</strong> Debit pricing and debit surcharging rules are unchanged.</li>
            <li><strong>It doesn’t override your state.</strong> Most states allow surcharging, but a handful limit or regulate it. Your state’s rules still win.</li>
            <li><strong>It doesn’t guarantee you see the savings.</strong> Interchange is what the card networks charge. Whether a cut reaches your statement depends on how your processor prices you. More on that below.</li>
            <li><strong>It isn’t final.</strong> Walmart and several large retail trade groups have objected, and Walmart is asking to opt out of the class entirely. Even after final approval, appeals could slow things down.</li>
          </ul>
        </section>

        <hr className="sfs-divider" />

        <section className="sfs-section">
          <div className="sfs-section-header">
            <span className="sfs-num">03</span>
            <h2>Will the 0.10% actually reach you?</h2>
          </div>

          <p>
            This is the question that matters most, and it has nothing to do with the court. It depends on your
            pricing model.
          </p>

          <h3><span className="sfs-qnum">A.</span>Interchange-plus</h3>
          <p>
            Your statement shows the network’s cost and your processor’s markup as separate lines. When interchange
            drops, your cost drops with it, automatically. Nobody has to remember to pass it on.
          </p>

          <h3><span className="sfs-qnum">B.</span>Flat-rate or tiered</h3>
          <p>
            You pay one blended rate, or a handful of “qualified / non-qualified” buckets. The processor pays the
            interchange underneath. When interchange falls and your rate doesn’t, the difference stays with the
            processor. Some will pass it on. Some won’t. You won’t be able to tell from the statement.
          </p>

          <div className="sfs-math" aria-label="Savings example">
            <div className="sfs-small-label" style={{ marginBottom: "0.4rem" }}>What 0.10% is worth</div>
            $100,000 / month in credit volume × 0.10% = <strong>$100 / month</strong> · $1,200 a year<br />
            $1,000,000 / month in credit volume × 0.10% = <strong>$1,000 / month</strong> · $12,000 a year
          </div>

          <p>
            Small per transaction, real at scale — and only if it lands on your side of the ledger.
          </p>

          <div className="sfs-callout">
            <div className="sfs-callout-label">Quick check</div>
            <p>
              Open last month’s statement. If you can’t find interchange listed separately from the processor’s
              fees, you’re almost certainly not on interchange-plus. That’s worth fixing whether or not the
              settlement goes through.
            </p>
          </div>
        </section>

        <hr className="sfs-divider" />

        <section className="sfs-section">
          <div className="sfs-section-header">
            <span className="sfs-num">04</span>
            <h2>The bigger lever: which cards you take, and on what terms</h2>
          </div>

          <p>
            The rate cut is modest. The acceptance and surcharging rules are where a business with a heavy premium-card
            mix can move its costs. They’re also where it can annoy customers, so treat them as decisions, not defaults.
          </p>

          <div className="sfs-pullquote">
            <p>Declining a customer’s favourite card saves you a fee and might cost you the sale. Know your numbers before you choose.</p>
          </div>

          <div className="sfs-table-wrap">
            <table className="sfs-table">
              <thead>
                <tr>
                  <th>If you sell…</th>
                  <th>Worth considering</th>
                  <th>Watch out for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>B2B / invoicing</td>
                  <td>Keep commercial cards, and cut their cost with Level II and III data instead of turning them away.</td>
                  <td className="sfs-fine">Corporate buyers often have to pay by purchasing card. Declining them can lose the account.</td>
                </tr>
                <tr>
                  <td>Small-ticket retail, fuel</td>
                  <td>Surcharging or declining premium cards, where margins are thin and fees bite hardest.</td>
                  <td className="sfs-fine">Friction at the till. Test in one location or channel before rolling out.</td>
                </tr>
                <tr>
                  <td>Subscriptions</td>
                  <td>Product-level surcharging on stored premium cards, disclosed clearly at signup.</td>
                  <td className="sfs-fine">Adding a fee for existing subscribers usually means giving notice first. Card updates can change a customer’s card type mid-plan.</td>
                </tr>
                <tr>
                  <td>E-commerce</td>
                  <td>Running a test by channel: surcharge premium cards online, leave in-store alone, or the reverse.</td>
                  <td className="sfs-fine">Your checkout has to identify the card type before the total is shown.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            That last point applies to everyone. Surcharging one premium card but not the standard version of the same
            brand means your system has to recognise the card product the moment it’s entered, show the fee before the
            customer commits, and print it on the receipt. That’s a gateway job. If you’re planning to use these
            rules, confirm your gateway can do it — ours supports{" "}
            <a href="/CustomerFeeConfiguration">configurable surcharges and customer fees</a>.
          </p>
        </section>

        <hr className="sfs-divider" />

        <section className="sfs-section">
          <div className="sfs-section-header">
            <span className="sfs-num">05</span>
            <h2>Five things to do before November 16</h2>
          </div>

          <ol className="sfs-steps">
            <li>
              <strong>Find your effective rate.</strong>
              Add up every fee on your last three statements and divide by your total card volume. That single number
              is your baseline. For context, the average fee on Visa and Mastercard transactions was about 2.35% in 2024.
            </li>
            <li>
              <strong>Find your card mix.</strong>
              Ask your processor for an interchange breakdown by card type. If most of your volume is standard consumer
              cards, the 1.25% cap matters to you. If it’s premium or commercial, the acceptance rules matter more.
            </li>
            <li>
              <strong>Pin down your pricing model.</strong>
              If you’re on flat-rate or tiered pricing, ask your processor in writing how settlement reductions will be
              passed through. If the answer is vague, that is the answer.
            </li>
            <li>
              <strong>Take the saving that doesn’t need a judge.</strong>
              If you accept commercial or purchasing cards, sending{" "}
              <a href="/AutomaticLevelIII">Level II and III data</a> can lower interchange on those transactions today.
              Most businesses that qualify have never switched it on.
            </li>
            <li>
              <strong>Don’t change acceptance or start surcharging yet.</strong>
              Wait for final approval and the networks’ updated rules, check your state’s surcharging law, and make
              sure your checkout can detect card types and disclose fees properly. Getting this wrong is more
              expensive than waiting a few months.
            </li>
          </ol>
        </section>

        <hr className="sfs-divider" />

        <section className="sfs-section">
          <div className="sfs-section-header">
            <span className="sfs-num">06</span>
            <h2>The bottom line</h2>
          </div>

          <p>
            For most merchants, the settlement is a small rate cut and a big new set of options. The rate cut only helps
            if your pricing lets it through. The options only help if you know your card mix and your systems can act on
            it. Both are things you can check this week — no court ruling required.
          </p>

          <div className="sfs-callout">
            <div className="sfs-callout-label">Free statement review</div>
            <p>
              Send us a recent processing statement and we’ll show you your effective rate, your card mix, and whether
              your pricing would pass the settlement savings through. Plain English, no obligation.
            </p>
          </div>

          <div className="sfs-cta">
            <a href="/quote">Get a statement review →</a>
          </div>
        </section>

        <hr className="sfs-divider" />

        <footer style={{ paddingTop: "0.5rem", paddingBottom: "2rem" }}>
          <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--sfs-text-2)", marginBottom: "1.25rem" }}>
            This article is general information, not legal or financial advice. The settlement has preliminary approval
            only; its terms, timing and implementation may change. Check your state’s surcharging rules and your card
            network agreements before changing how you accept cards.
          </p>

          <div className="sfs-small-label">Sources</div>
          <ul className="sfs-sources">
            <li><a href="https://corporate.visa.com/en/sites/visa-perspectives/company-news/visa-statement-mdl-settlement.html" target="_blank" rel="noopener noreferrer">Visa — statement on preliminary approval of the MDL settlement (June 9, 2026)</a></li>
            <li><a href="https://www.paymentsdive.com/news/visa-mastercard-urge-court-to-approve-fee-settlement/833241/" target="_blank" rel="noopener noreferrer">Payments Dive — Visa, Mastercard urge court to approve fee settlement (October 16, 2026)</a></li>
            <li><a href="https://www.paymentsdive.com/news/why-pricey-credit-cards-may-soon-cost-more/825609/" target="_blank" rel="noopener noreferrer">Payments Dive — Why pricey credit cards may soon cost more (July 20, 2026)</a></li>
            <li><a href="https://www.lek.com/insights/financial-services/finding-new-balance-rewards-cards-after-visa-mastercard-merchant" target="_blank" rel="noopener noreferrer">L.E.K. Consulting — Rewards cards after the Visa-Mastercard merchant settlement</a></li>
          </ul>

          <div style={{ fontFamily: "'Montserrat', system-ui, sans-serif", fontSize: 11, color: "var(--sfs-text-2)", letterSpacing: "0.08em", display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "2rem" }}>
            <span>Merchant Haus</span>
            <span>Plug in, play and process</span>
            <span>Payments Briefing</span>
          </div>
        </footer>

      </article>

      <Footer />
    </div>
  );
}

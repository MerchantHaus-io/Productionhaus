import { useEffect } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";

const accent = "hsl(var(--brand-red-text))";

const blogStyles = `

  .blog-root {
    font-family: 'Montserrat', system-ui, sans-serif;
    color: var(--color-text-primary);
    max-width: 860px;
    margin: 0 auto;
    padding: 0 1.5rem 4rem;
    line-height: 1.75;
    font-size: 17px;
  }

  .blog-root h1, .blog-root h2, .blog-root h3 {
    font-family: 'DM Serif Display', Georgia, serif;
    line-height: 1.2;
    font-weight: 700;
  }

  .hero {
    border-bottom: 3px solid var(--color-text-primary);
    padding: 3rem 0 2rem;
    margin-bottom: 3rem;
  }

  .kicker {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .kicker::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 2px;
    background: ${accent};
  }

  .hero h1 {
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    margin: 0 0 1.25rem;
    color: var(--color-text-primary);
  }

  .hero-sub {
    font-size: 1.15rem;
    font-style: italic;
    color: var(--color-text-secondary);
    max-width: 600px;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .hero-meta {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 11px;
    color: var(--color-text-secondary);
    letter-spacing: 0.08em;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .section {
    margin-bottom: 3.5rem;
    position: relative;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border-tertiary);
  }

  .section-num {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 11px;
    color: var(--color-text-secondary);
    letter-spacing: 0.1em;
    flex-shrink: 0;
  }

  .section h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .section h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 2rem 0 0.5rem;
    letter-spacing: -0.01em;
  }

  .section p {
    margin-bottom: 1.25rem;
    color: var(--color-text-primary);
  }

  .lead {
    font-size: 1.1rem;
    font-style: italic;
    font-weight: 300;
    color: var(--color-text-secondary);
    margin-bottom: 2.5rem;
    line-height: 1.7;
  }

  .qnum {
    font-family: 'Montserrat', system-ui, sans-serif;
    color: ${accent};
    font-weight: 500;
    margin-right: 0.4rem;
  }

  .pullquote {
    border-left: 3px solid ${accent};
    margin: 2rem 0;
    padding: 0.5rem 0 0.5rem 1.5rem;
  }

  .pullquote p {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 1.3rem;
    font-style: italic;
    font-weight: 400;
    color: var(--color-text-primary);
    margin: 0 0 0.5rem;
    line-height: 1.5;
  }

  .callout {
    background: var(--color-background-secondary);
    border-left: 3px solid ${accent};
    border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
    padding: 1.25rem 1.5rem;
    margin: 2rem 0;
  }

  .callout-label {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${accent};
    margin-bottom: 0.4rem;
    font-weight: 500;
  }

  .callout p {
    margin: 0;
    font-size: 15px;
    color: var(--color-text-primary);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    margin: 1.5rem 0;
    font-family: 'Montserrat', system-ui, sans-serif;
  }

  .data-table thead th {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    border-bottom: 1.5px solid var(--color-text-primary);
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-weight: 400;
  }

  .data-table tbody tr:nth-child(even) {
    background: var(--color-background-secondary);
  }

  .data-table tbody td {
    padding: 0.65rem 0.75rem;
    border-bottom: 0.5px solid var(--color-border-tertiary);
    vertical-align: top;
    line-height: 1.5;
  }

  .data-table tbody td:first-child {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .flag-list {
    list-style: none;
    margin: 1.5rem 0;
    padding: 0;
  }

  .flag-list li {
    position: relative;
    padding: 0.6rem 0 0.6rem 1.75rem;
    border-bottom: 0.5px solid var(--color-border-tertiary);
    color: var(--color-text-primary);
  }

  .flag-list li::before {
    content: '\\2715';
    position: absolute;
    left: 0;
    top: 0.6rem;
    color: ${accent};
    font-family: 'Montserrat', system-ui, sans-serif;
    font-weight: 600;
  }

  .cta {
    text-align: center;
    margin: 3rem 0 1rem;
  }

  .cta a {
    display: inline-block;
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: hsl(var(--primary-foreground));
    background: hsl(var(--primary));
    padding: 0.85rem 2rem;
    border-radius: var(--border-radius-md);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .cta a:hover {
    opacity: 0.9;
  }

  .divider {
    border: none;
    border-top: 0.5px solid var(--color-border-tertiary);
    margin: 3rem 0;
  }

  .watermark {
    position: absolute;
    top: -20px;
    right: -20px;
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 8rem;
    font-weight: 900;
    color: var(--color-border-tertiary);
    opacity: 0.12;
    pointer-events: none;
    user-select: none;
    line-height: 1;
    z-index: 0;
  }

  @media (max-width: 600px) {
    .watermark { font-size: 4rem; }
  }
`;

export default function PaymentGatewayGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="How to Choose the Right Payment Gateway for Your Business"
        description="A practical, jargon-free guide to evaluating payment gateways — how your sales model shapes the choice, the questions that separate good gateways from expensive mistakes, and the red flags to walk away from."
        path="/payment-gateway-guide"
      />
      <style>{blogStyles}</style>

      <Header />

      <div className="blog-root">

        <div className="hero" style={{ position: "relative", overflow: "hidden" }}>
          <span className="watermark">§</span>
          <div className="kicker">Merchant Haus — Payments Guide</div>
          <h1>How to Choose the Right Payment Gateway for Your Business</h1>
          <p className="hero-sub">A practical guide from Merchant Haus — no jargon, no sales pitch, just the questions that actually matter.</p>
          <div className="hero-meta">
            <span>Merchant Haus</span>
            <span>Independent payments consultancy</span>
            <span>Buyer&apos;s Guide</span>
          </div>
        </div>

        <p className="lead">
          Every business that accepts payments online eventually asks the same question: which payment gateway should we use? The answer matters more than most owners realise. Your gateway sits between your customer&apos;s card and your bank account, and the wrong choice shows up later as declined transactions, surprise fees, integration headaches, and support tickets that go nowhere.
        </p>

        <p style={{ marginBottom: "2.5rem" }}>
          Here&apos;s how to evaluate your options like someone who works in payments for a living.
        </p>

        <hr className="divider" />

        <section className="section">
          <div className="section-header">
            <span className="section-num">01</span>
            <h2>Start with how you actually sell</h2>
          </div>

          <p>The right gateway depends on your sales model, not on which logo you&apos;ve seen most often.</p>

          <table className="data-table">
            <thead>
              <tr>
                <th>Sales model</th>
                <th>What to look for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>E-commerce only</td>
                <td>If everything happens through your website, you need strong developer tools, hosted payment pages or an embeddable checkout, and solid support for your platform — Shopify, WooCommerce, or a custom build.</td>
              </tr>
              <tr>
                <td>Card-present and online</td>
                <td>Retail plus web means you want a gateway that unifies both channels so your reporting, customer vault, and reconciliation live in one place instead of two systems that never agree with each other.</td>
              </tr>
              <tr>
                <td>Recurring billing</td>
                <td>Subscriptions and memberships need a proper customer vault, automatic card updater support, and flexible billing schedules. Retrying a failed payment intelligently can recover a meaningful percentage of revenue you&apos;d otherwise lose to expired cards.</td>
              </tr>
              <tr>
                <td>Invoicing and B2B</td>
                <td>If you send invoices, look for Level 2 and Level 3 data support. Passing enhanced transaction data on corporate and purchasing cards can significantly reduce your interchange costs — and most businesses never switch it on because nobody told them it existed.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr className="divider" />

        <section className="section">
          <div className="section-header">
            <span className="section-num">02</span>
            <h2>The questions that separate good gateways from expensive mistakes</h2>
          </div>

          <h3><span className="qnum">1.</span>Who owns your data?</h3>
          <p>This is the question almost nobody asks and everyone should. If you leave, can you take your customer vault and tokenized card data with you? Some providers make migration painful by design. A portable vault means you&apos;re a customer by choice, not a hostage.</p>

          <h3><span className="qnum">2.</span>What happens when a transaction fails?</h3>
          <p>Every gateway processes successful payments fine. The difference shows in the failures. Look for clear decline codes, intelligent retry logic, and reporting that tells you <em>why</em> transactions failed, not just that they did.</p>

          <h3><span className="qnum">3.</span>How is the pricing actually structured?</h3>
          <p>Flat-rate pricing is simple but usually expensive at volume. Interchange-plus pricing is more transparent and almost always cheaper once you&apos;re processing consistently. Ask for a full fee schedule — including monthly minimums, PCI fees, batch fees, and chargeback fees — before you sign anything.</p>

          <h3><span className="qnum">4.</span>Does it handle fraud without blocking real customers?</h3>
          <p>Fraud tools should be configurable, not all-or-nothing. Velocity limits, AVS and CVV rules, and device fingerprinting are standard on serious platforms. A gateway that blocks 2% of fraud but also 5% of legitimate orders is costing you money.</p>

          <h3><span className="qnum">5.</span>Who picks up the phone?</h3>
          <p>When a settlement doesn&apos;t land or a batch fails on a Friday afternoon, you want a named human who knows your account, not a ticket queue. This is where working with an independent sales organisation (ISO) or reseller often beats going direct: you get the same infrastructure with an actual relationship attached.</p>
        </section>

        <hr className="divider" />

        <section className="section">
          <div className="section-header">
            <span className="section-num">03</span>
            <h2>Gateway vs. processor: know the difference</h2>
          </div>

          <p>A common point of confusion: the gateway moves the transaction data; the processor and acquiring bank move the money. Some providers bundle both, others let you pair a gateway with the acquirer of your choice. The unbundled model gives you leverage — if your processing rates creep up, you can renegotiate or move acquirers without rebuilding your checkout, retraining staff, or migrating your customer vault.</p>

          <div className="pullquote">
            <p>&quot;One integration, many banking relationships, and your business logic stays put.&quot;</p>
          </div>

          <p>That flexibility is exactly why platforms like NMI, which power thousands of ISOs and merchants behind the scenes, have become the quiet standard in the industry.</p>
        </section>

        <hr className="divider" />

        <section className="section">
          <div className="section-header">
            <span className="section-num">04</span>
            <h2>Red flags to walk away from</h2>
          </div>

          <ul className="flag-list">
            <li>Pricing that can&apos;t be explained in one page.</li>
            <li>No clear answer on data portability.</li>
            <li>Long-term contracts with early termination fees for a <em>gateway</em> — processing agreements are one thing; gateway lock-in is another.</li>
            <li>&quot;PCI compliance included&quot; with a monthly non-compliance fee buried in the schedule.</li>
            <li>Support that&apos;s email-only or offshore-ticket-only for a business-critical service.</li>
          </ul>
        </section>

        <hr className="divider" />

        <section className="section">
          <div className="section-header">
            <span className="section-num">05</span>
            <h2>The bottom line</h2>
          </div>

          <p>The best payment gateway is the one that fits your sales model, prices transparently, lets you leave, and answers the phone. Get those four right and the logos matter a lot less than the brochures suggest.</p>

          <div className="callout">
            <div className="callout-label">A second opinion</div>
            <p>If you&apos;d like a second opinion on your current setup — or a line-by-line read of a fee schedule you&apos;ve been quoted — that&apos;s exactly what we do.</p>
          </div>

          <div className="cta">
            <a href="/apply">Talk to Merchant Haus →</a>
          </div>
        </section>

        <hr className="divider" />

        <footer style={{ paddingTop: "1rem", paddingBottom: "2rem" }}>
          <p style={{ fontFamily: "'Montserrat', system-ui, sans-serif", fontSize: 14, fontStyle: "italic", color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
            Merchant Haus is an independent payments consultancy and reseller. We help businesses choose, implement, and optimise payment infrastructure without the sales pressure.
          </p>
          <div style={{ fontFamily: "'Montserrat', system-ui, sans-serif", fontSize: 11, color: "var(--color-text-secondary)", letterSpacing: "0.08em", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <span>Merchant Haus</span>
            <span>Plug in, play and process</span>
            <span>Payments Guide</span>
          </div>
        </footer>

      </div>

      <Footer />
    </div>
  );
}

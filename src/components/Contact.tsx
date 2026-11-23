import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { ThankYouDialog } from "./ThankYouDialog";
import { Label } from "./ui/label";
import { RequiredIndicator } from "./ui/required-indicator";
import { RevealGroup, RevealWords } from "@/components/Reveal";
import { reveal } from "@/lib/reveal";
import { supabase } from "@/supabase"; //

/* Statements go by email through netlify/functions/send-statement.js, which applies the same limits. */
const STATEMENT_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const STATEMENT_MAX_BYTES = 4 * 1024 * 1024;

const checkStatement = (file: File) => {
  if (!STATEMENT_TYPES.includes(file.type)) return "Please choose a PDF, JPG or PNG file.";
  if (file.size > STATEMENT_MAX_BYTES) return "The file must be 4 MB or smaller.";
  return null;
};

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [statement, setStatement] = useState<File | null>(null);
  const [statementError, setStatementError] = useState<string | null>(null);
  const statementInput = useRef<HTMLInputElement>(null);

  const clearStatement = () => {
    setStatement(null);
    setStatementError(null);
    if (statementInput.current) statementInput.current.value = "";
  };

  const handleStatementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return clearStatement();
    const problem = checkStatement(file);
    setStatementError(problem);
    setStatement(problem ? null : file);
    if (problem) event.target.value = "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const submission = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      // Phone and message are optional; empty fields are sent as empty strings.
      phone: (formData.get("phone") as string) ?? "",
      company: (formData.get("company") as string) || null,
      message: (formData.get("message") as string) ?? "",
    };

    try {
      if (statement) {
        // With a statement, the email carries everything; the Supabase copy is best effort.
        const response = await fetch("/.netlify/functions/send-statement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...submission,
            website: formData.get("website"),
            file: { name: statement.name, type: statement.type, data: await toBase64(statement) },
          }),
        });
        if (!response.ok) {
          const { error } = await response.json().catch(() => ({ error: null }));
          throw new Error(error || "Statement upload failed");
        }
        const { error } = await supabase.from("contact_submissions").insert([submission]);
        if (error) console.error("Supabase Error:", error);
      } else {
        const { error } = await supabase.from("contact_submissions").insert([submission]);
        if (error) throw error;
      }

      toast({
        title: "Message sent!",
        description: "We'll get back to you shortly.",
      });
      setShowThankYou(true);
      form.reset();
      clearStatement();
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Error",
        description:
          statement && error instanceof Error && error.message !== "Statement upload failed"
            ? error.message
            : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RevealGroup as="section" stagger={70} id="contact" className="inverse scroll-mt-20 py-24 px-6 md:px-16 lg:px-24 bg-background">
      {/* ContactBand: a counter-colour surface (navy on the cream page, cream on the navy page);
          its fields flip back to the page palette. */}
      <div className="max-w-[880px] mx-auto">
        <div className="text-center mb-12">
          <h2 {...reveal("words")} className="font-display text-[40px] leading-[44px] md:text-[52px] md:leading-[56px] text-heading mb-4">
            <RevealWords text="Get in touch" />
          </h2>
          <p {...reveal("up", 120)} className="text-lg leading-[27px] text-muted-foreground max-w-2xl mx-auto font-light">
            Ready to transform your payment processing? Contact us today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div {...reveal("up")}>
              <Label htmlFor="contact-name" className="flex items-center text-foreground">
                Name
                <RequiredIndicator />
              </Label>
              <Input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
            <div {...reveal("up")}>
              <Label htmlFor="contact-email" className="flex items-center text-foreground">
                Email
                <RequiredIndicator />
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Your email"
                required
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
            <div {...reveal("up")}>
              <Label htmlFor="contact-phone" className="flex items-center text-foreground">
                Phone <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="Your phone"
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
            <div {...reveal("up")}>
              <Label htmlFor="contact-company" className="flex items-center text-foreground">Company</Label>
              <Input
                id="contact-company"
                name="company"
                autoComplete="organization"
                placeholder="Company name"
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
          </div>

          <div {...reveal("up")}>
            <Label htmlFor="contact-message" className="flex items-center text-foreground">
              Message <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="How can we help you?"
              rows={6}
              className="mt-1.5 resize-none bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
            />
          </div>

          <div {...reveal("up")}>
            <Label htmlFor="contact-statement" className="flex items-center text-foreground">
              Processing statement <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
            </Label>
            <p id="contact-statement-hint" className="mt-1 text-sm text-muted-foreground">
              Attach your latest statement and we'll show you what you'd pay with us. PDF, JPG or PNG, up to 4 MB.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input
                ref={statementInput}
                id="contact-statement"
                name="statement"
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleStatementChange}
                aria-describedby={`contact-statement-hint${statementError ? " contact-statement-error" : ""}`}
                aria-invalid={statementError ? true : undefined}
                className="peer sr-only"
              />
              <label
                htmlFor="contact-statement"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-page-input bg-page-background px-4 py-2.5 text-sm font-semibold text-page-foreground transition-colors hover:border-page-ring peer-focus-visible:ring-2 peer-focus-visible:ring-page-ring/30"
              >
                <Paperclip className="h-4 w-4" aria-hidden="true" />
                {statement ? "Choose a different file" : "Attach statement"}
              </label>
              {statement && (
                <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-foreground">
                  <span className="truncate max-w-[16rem]">{statement.name}</span>
                  <button
                    type="button"
                    onClick={clearStatement}
                    className="rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Remove ${statement.name}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              )}
            </div>
            {statementError && (
              <p id="contact-statement-error" role="alert" className="mt-2 text-sm font-medium text-destructive">
                {statementError}
              </p>
            )}
          </div>

          {/* Honeypot for bots; hidden from people and assistive tech. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <Button {...reveal("up")} type="submit" variant="cta" size="lg" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>

      <ThankYouDialog
        open={showThankYou}
        onOpenChange={(open) => {
          if (!open) {
            setShowThankYou(false);
          }
        }}
        title="Message received."
        description="Thanks for contacting MerchantHaus."
        body="A member of our team will reach out within one business day."
      />
    </RevealGroup>
  );
};

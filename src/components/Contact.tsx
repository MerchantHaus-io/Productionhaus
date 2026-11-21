import { useState } from "react";
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

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

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
      // Supabase Insert
      const { error } = await supabase
        .from("contact_submissions")
        .insert([submission]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you shortly.",
      });
      setShowThankYou(true);
      form.reset();
    } catch (error) {
      console.error("Supabase Error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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

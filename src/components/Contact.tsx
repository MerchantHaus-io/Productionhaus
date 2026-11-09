import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { ThankYouDialog } from "./ThankYouDialog";
import { Label } from "./ui/label";
import { RequiredIndicator } from "./ui/required-indicator";
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
      phone: formData.get("phone") as string,
      company: (formData.get("company") as string) || null,
      message: formData.get("message") as string,
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
    <section id="contact" className="inverse scroll-mt-20 py-24 px-6 md:px-16 lg:px-24 bg-background">
      {/* ContactBand: a counter-colour surface (navy on the cream page, cream on the navy page);
          its fields flip back to the page palette. */}
      <div className="max-w-[880px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-[40px] leading-[44px] md:text-[52px] md:leading-[56px] text-heading mb-4">
            Get in touch
          </h2>
          <p className="text-lg leading-[27px] text-muted-foreground max-w-2xl mx-auto font-light">
            Ready to transform your payment processing? Contact us today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center text-foreground">
                Name
                <RequiredIndicator />
              </Label>
              <Input
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
            <div>
              <Label className="flex items-center text-foreground">
                Email
                <RequiredIndicator />
              </Label>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Your email"
                required
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
            <div>
              <Label className="flex items-center text-foreground">
                Phone
                <RequiredIndicator />
              </Label>
              <Input
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="Your phone"
                required
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
            <div>
              <Label className="flex items-center text-foreground">Company</Label>
              <Input
                name="company"
                autoComplete="organization"
                placeholder="Company name"
                className="mt-1.5 bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
              />
            </div>
          </div>

          <div>
            <Label className="flex items-center text-foreground">
              Message
              <RequiredIndicator />
            </Label>
            <Textarea
              name="message"
              placeholder="How can we help you?"
              required
              rows={6}
              className="mt-1.5 resize-none bg-page-background text-page-foreground border-page-input placeholder:text-page-muted-foreground focus-visible:border-page-ring focus-visible:ring-page-ring/30"
            />
          </div>

          <Button type="submit" variant="cta" size="lg" disabled={isSubmitting} className="w-full">
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
    </section>
  );
};

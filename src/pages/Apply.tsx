import React, { useState, useEffect, useRef, FormEvent } from "react";
import {
  Check,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  FileText,
  Briefcase,
  Scale,
  CreditCard,
  Save,
  Info,
  ShieldCheck,
  Lock,
  RefreshCw,
  Cloud,
  Loader2,
  LucideIcon,
} from "lucide-react";
import { supabase } from "@/supabase"; // Ensure path is correct
import { PageSEO } from "@/components/PageSEO";
import { MerchantApplication } from "@/types/database";

// --- Types & Interfaces ---

interface MerchantFormState {
  id: string;

  // Business
  dbaName: string;
  products: string;
  natureOfBusiness: string;
  dbaContactFirst: string;
  dbaContactLast: string;
  dbaPhone: string;
  dbaEmail: string;
  dbaAddress: string;
  dbaAddress2: string;
  dbaCity: string;
  dbaState: string;
  dbaZip: string;

  // Legal
  legalEntityName: string;
  legalPhone: string;
  legalEmail: string;
  tin: string;
  ownershipType: string;
  formationDate: string;
  stateIncorporated: string;
  legalAddress: string;
  legalAddress2: string;
  legalCity: string;
  legalState: string;
  legalZip: string;

  // Processing
  hasExistingProcessor: string; // "yes" | "no" | ""
  isSwitchingProcessor: string; // "yes" | "no" | ""
  currentProcessorName: string;

  // Billing (if keeping MID)
  hasVarSheet: string; // "yes" | "no" | ""

  monthlyVolume: string;
  avgTicket: string;
  highTicket: string;
  swipedPct: string;
  keyedPct: string;
  motoPct: string;
  ecomPct: string;
  b2cPct: string;
  b2bPct: string;
  sicMcc: string;
  website: string;

  // Docs Readiness
  hasBankOrProcessingStatements: string;
  hasVoidedCheckOrBankLetter: string;
  hasGovernmentId: string;
  hasArticlesOfOrganization: string;
  hasTaxDocument: string;
  docsLocationOrLink: string;

  // Gateway-only review confirmation
  gatewayOnlyReviewConfirmed: string; // "yes" | ""

  // Notes
  notes: string;

  // Index signature to allow dynamic access
  [key: string]: string;
}

interface StepConfig {
  label: string;
  icon: LucideIcon;
}

interface RequiredFieldsMap {
  business: (keyof MerchantFormState)[];
  legal: (keyof MerchantFormState)[];
  processing: (keyof MerchantFormState)[];
}

interface StepProps {
  form: MerchantFormState;
  onChange: (field: keyof MerchantFormState, value: string) => void;
}

interface ReviewStepProps extends StepProps {
  allMissing: Record<string, string[]>;
  isChecklistRequired: boolean;
  isChecklistComplete: boolean;
  isGatewayOnly: boolean;
}

// --- Constants & Config ---

const STEPS: StepConfig[] = [
  { label: "Business Profile", icon: Briefcase },
  { label: "Legal Information", icon: Scale },
  { label: "Processing Info", icon: CreditCard },
  { label: "Application Readiness", icon: FileText },
];

const REQUIRED_FIELDS: RequiredFieldsMap = {
  business: [
    "dbaName",
    "products",
    "natureOfBusiness",
    "dbaContactFirst",
    "dbaContactLast",
    "dbaPhone",
    "dbaEmail",
    "dbaAddress",
    "dbaCity",
    "dbaState",
    "dbaZip",
  ],
  legal: [
    "legalEntityName",
    "legalPhone",
    "legalEmail",
    "tin",
    "ownershipType",
    "formationDate",
    "stateIncorporated",
    "legalAddress",
    "legalCity",
    "legalState",
    "legalZip",
  ],
  processing: [
    "hasExistingProcessor",
    "monthlyVolume",
    "avgTicket",
    "highTicket",
    "swipedPct",
    "keyedPct",
    "motoPct",
    "ecomPct",
    "b2cPct",
    "b2bPct",
  ],
};

const DOCS_CHECKLIST_FIELDS: (keyof MerchantFormState)[] = [
  "hasBankOrProcessingStatements",
  "hasVoidedCheckOrBankLetter",
  "hasGovernmentId",
  "hasArticlesOfOrganization",
  "hasTaxDocument",
];

const initialState: MerchantFormState = {
  id: "",

  // business
  dbaName: "",
  products: "",
  natureOfBusiness: "",
  dbaContactFirst: "",
  dbaContactLast: "",
  dbaPhone: "",
  dbaEmail: "",
  dbaAddress: "",
  dbaAddress2: "",
  dbaCity: "",
  dbaState: "",
  dbaZip: "",

  // legal
  legalEntityName: "",
  legalPhone: "",
  legalEmail: "",
  tin: "",
  ownershipType: "",
  formationDate: "",
  stateIncorporated: "",
  legalAddress: "",
  legalAddress2: "",
  legalCity: "",
  legalState: "",
  legalZip: "",

  // processing
  hasExistingProcessor: "",
  isSwitchingProcessor: "",
  currentProcessorName: "",

  // billing info
  hasVarSheet: "",

  monthlyVolume: "",
  avgTicket: "",
  highTicket: "",
  swipedPct: "",
  keyedPct: "",
  motoPct: "",
  ecomPct: "",
  b2cPct: "",
  b2bPct: "",
  sicMcc: "",
  website: "",

  // document readiness checklist
  hasBankOrProcessingStatements: "",
  hasVoidedCheckOrBankLetter: "",
  hasGovernmentId: "",
  hasArticlesOfOrganization: "",
  hasTaxDocument: "",
  docsLocationOrLink: "",

  // gateway-only review confirmation
  gatewayOnlyReviewConfirmed: "",

  // notes
  notes: "",
};

// --- Main Component ---

export default function Apply() {
  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<MerchantFormState>(initialState);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");

  // Autosave State
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const isFirstRender = useRef(true);
  const [showChecklistWarning, setShowChecklistWarning] = useState(false);

  const isChecklistRequired =
    form.hasExistingProcessor === "no" ||
    (form.hasExistingProcessor === "yes" && form.isSwitchingProcessor === "yes");

  // Gateway-only: has existing processor AND keeping it (not switching)
  const isGatewayOnly =
    form.hasExistingProcessor === "yes" && form.isSwitchingProcessor === "no";

  const isChecklistComplete =
    !isChecklistRequired || DOCS_CHECKLIST_FIELDS.every((field) => form[field]);

  // Gateway-only clients must confirm review before submission
  const isGatewayOnlyConfirmed =
    !isGatewayOnly || form.gatewayOnlyReviewConfirmed === "yes";

  // 1. Initialize Session ID
  useEffect(() => {
    if (!form.id) {
      // Use crypto.randomUUID() for Supabase compatibility
      const newId = crypto.randomUUID();
      setForm((prev) => ({ ...prev, id: newId }));
    }
  }, [form.id]);

  // 2. Autosave Logic (Supabase)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveToSupabase(form);
    }, 1500); // Slightly longer delay to debounce typing

    return () => clearTimeout(timer);
  }, [form]);

  useEffect(() => {
    if (isChecklistComplete) {
      setShowChecklistWarning(false);
    }
  }, [isChecklistComplete]);

  // 3. Supabase Save Handler
  const saveToSupabase = async (formData: MerchantFormState) => {
    if (!formData.id) return;
    setSaveStatus("saving");

    // Map Frontend State to Database Columns
    const dbPayload: MerchantApplication = {
      id: formData.id,
      dba_name: formData.dbaName,
      products: formData.products,
      nature_of_business: formData.natureOfBusiness,
      dba_contact_first: formData.dbaContactFirst,
      dba_contact_last: formData.dbaContactLast,
      dba_phone: formData.dbaPhone,
      dba_email: formData.dbaEmail,
      dba_address: formData.dbaAddress,
      dba_address2: formData.dbaAddress2,
      dba_city: formData.dbaCity,
      dba_state: formData.dbaState,
      dba_zip: formData.dbaZip,
      legal_entity_name: formData.legalEntityName,
      legal_phone: formData.legalPhone,
      legal_email: formData.legalEmail,
      tin: formData.tin,
      ownership_type: formData.ownershipType,
      formation_date: formData.formationDate || null, // Handle empty date
      state_incorporated: formData.stateIncorporated,
      legal_address: formData.legalAddress,
      legal_address2: formData.legalAddress2,
      legal_city: formData.legalCity,
      legal_state: formData.legalState,
      legal_zip: formData.legalZip,
      has_existing_processor: formData.hasExistingProcessor,
      is_switching_processor: formData.isSwitchingProcessor,
      current_processor_name: formData.currentProcessorName,
      has_var_sheet: formData.hasVarSheet,
      // Helper to parse numbers safely
      monthly_volume: parseFloat(formData.monthlyVolume) || 0,
      avg_ticket: parseFloat(formData.avgTicket) || 0,
      high_ticket: parseFloat(formData.highTicket) || 0,
      swiped_pct: parseFloat(formData.swipedPct) || 0,
      keyed_pct: parseFloat(formData.keyedPct) || 0,
      moto_pct: parseFloat(formData.motoPct) || 0,
      ecom_pct: parseFloat(formData.ecomPct) || 0,
      b2c_pct: parseFloat(formData.b2cPct) || 0,
      b2b_pct: parseFloat(formData.b2bPct) || 0,
      website: formData.website,
      sic_mcc: formData.sicMcc,
      has_bank_statements: formData.hasBankOrProcessingStatements,
      has_voided_check: formData.hasVoidedCheckOrBankLetter,
      has_gov_id: formData.hasGovernmentId,
      has_articles_org: formData.hasArticlesOfOrganization,
      has_tax_doc: formData.hasTaxDocument,
      docs_link: formData.docsLocationOrLink,
      notes: formData.notes,
      gateway_only_confirmed: formData.gatewayOnlyReviewConfirmed,
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('merchant_applications')
        .upsert(dbPayload, { onConflict: 'id' });

      if (error) throw error;
      setSaveStatus("saved");
    } catch (err) {
      console.error("Autosave failed:", err);
      setSaveStatus("error");
    }
  };

  const handleChange = (field: keyof MerchantFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getMissingFieldsForSection = (sectionKey: keyof RequiredFieldsMap) => {
    const required = REQUIRED_FIELDS[sectionKey] || [];
    return required.filter((field) => !String(form[field] ?? "").trim()) as string[];
  };

  const allMissing = {
    business: getMissingFieldsForSection("business"),
    legal: getMissingFieldsForSection("legal"),
    processing: getMissingFieldsForSection("processing"),
  };

  const totalRequiredFields =
    REQUIRED_FIELDS.business.length +
    REQUIRED_FIELDS.legal.length +
    REQUIRED_FIELDS.processing.length;

  const completedRequiredFields =
    REQUIRED_FIELDS.business.length -
    allMissing.business.length +
    (REQUIRED_FIELDS.legal.length - allMissing.legal.length) +
    (REQUIRED_FIELDS.processing.length - allMissing.processing.length);

  const progress = Math.round(
    (completedRequiredFields / totalRequiredFields) * 100,
  );

  const nextDisabled = () => {
    return false; // Validation disabled per original code
  };

  const finalizeSubmit = async () => {
    setSubmissionStatus("submitting");

    try {
      // 1. Force a final save first
      await saveToSupabase(form);

      // 2. Update Status to 'submitted'
      const { error: dbError } = await supabase
        .from('merchant_applications')
        .update({ status: 'submitted' })
        .eq('id', form.id);

      if (dbError) throw dbError;

      // 3. TRIGGER EMAIL (New Code)
      console.log("Triggering email notification...");
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'new_web_application',
          recipientEmail: 'sales@merchanthaus.io', // <--- REPLACE THIS EMAIL if needed
          recipientName: 'Sales Team',
          data: {
            dbaName: form.dbaName,
            contactName: `${form.dbaContactFirst} ${form.dbaContactLast}`,
            email: form.dbaEmail,
            phone: form.dbaPhone,
            monthlyVolume: form.monthlyVolume,
            crmUrl: "https://merchantflow.merchanthaus.io/admin/web-submissions"
          }
        }
      });

      if (emailError) {
        console.error("Email failed to send:", emailError);
        // We do NOT stop execution here; the DB save was successful.
      }

      console.log("Supabase Form Submitted Successfully");
      setSubmissionStatus("success");
    } catch (error) {
      console.error("Submission Failed:", error);
      alert("Submission failed. Please check your connection.");
      setSubmissionStatus("idle");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    if (e) e.preventDefault();

    if (step < STEPS.length - 1) {
      return;
    }

    // Block submission if document checklist is required but not complete
    if (isChecklistRequired && !isChecklistComplete) {
      setStep(3);
      setShowChecklistWarning(true);
      return;
    }

    // Block submission if gateway-only client hasn't confirmed review
    if (isGatewayOnly && !isGatewayOnlyConfirmed) {
      setStep(3);
      setShowChecklistWarning(true);
      return;
    }

    finalizeSubmit();
  };

  // Auto-redirect to homepage after 10 seconds on success
  useEffect(() => {
    if (submissionStatus === "success") {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [submissionStatus]);

  if (submissionStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-xl p-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-status-approved-bg rounded-full flex items-center justify-center text-status-approved">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Application Received!</h2>
          <p className="text-muted-foreground">
            Thank you for submitting your application. A member of our sales team will contact you within 24 hours to request any supporting documentation.
          </p>
          <p className="text-muted-foreground text-sm">
            Alternatively, you can send documents directly to{" "}
            <a href="mailto:sales@merchanthaus.io" className="text-primary-text font-medium hover:underline">
              sales@merchanthaus.io
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            You will be redirected to the homepage in 10 seconds.
          </p>
          <div className="pt-4">
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-2 bg-muted text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted font-sans text-foreground pb-20 md:pb-10">
      <PageSEO
        title="Apply"
        description="Apply for a MerchantHaus merchant account. Start accepting credit cards, ACH, and digital payments with fast approval and transparent pricing."
        path="/apply"
      />
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="text-primary-foreground w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Merchant Preboarding</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-muted-foreground hidden sm:block">Intake Wizard v2.4 (Supabase)</p>
                {/* Save Status Indicator */}
                {saveStatus === "saving" && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground animate-pulse">
                    <Loader2 size={10} className="animate-spin" /> Saving...
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-status-approved">
                    <Cloud size={10} /> Saved
                  </span>
                )}
                {saveStatus === "error" && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-destructive">
                    <AlertCircle size={10} /> Save Failed
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-foreground">{progress}% Complete</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Step Indicators (Desktop) */}
        <div className="mb-8 hidden md:block">
          <ol className="flex items-center w-full">
            {STEPS.map((s, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              const Icon = s.icon;

              return (
                <li
                  key={s.label}
                  className={`flex items-center ${index !== STEPS.length - 1 ? "w-full" : ""}`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 border-2 transition-colors ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary-text"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-card text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={18} />}
                  </div>

                  <span
                    className={`ml-3 text-sm font-medium hidden lg:block ${
                      isActive ? "text-primary-text" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>

                  {index !== STEPS.length - 1 && (
                    <div className={`w-full h-0.5 mx-4 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile Step Indicator */}
        <div className="md:hidden mb-6 flex items-center justify-between bg-card p-3 rounded-lg border border-border shadow-sm">
          <span className="text-sm font-semibold text-foreground">
            Step {step + 1}: {STEPS[step].label}
          </span>
          <span className="text-xs text-muted-foreground">
            {step + 1} of {STEPS.length}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
          {/* Main Form Area */}
          <section className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <form
              onSubmit={handleSubmit}
            >
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-1">{STEPS[step].label}</h2>
                  <p className="text-sm text-muted-foreground">
                    Please complete all required fields marked with <span className="text-destructive">*</span>
                  </p>
                </div>

                {step === 0 && <BusinessProfileStep form={form} onChange={handleChange} />}
                {step === 1 && <LegalInfoStep form={form} onChange={handleChange} />}
                {step === 2 && <ProcessingStep form={form} onChange={handleChange} />}
                {step === 3 && (
                  <ReviewStep
                    form={form}
                    allMissing={allMissing}
                    onChange={handleChange}
                    isChecklistRequired={isChecklistRequired}
                    isChecklistComplete={isChecklistComplete}
                    isGatewayOnly={isGatewayOnly}
                  />
                )}
              </div>

              {/* Navigation Footer */}
              <div className="bg-muted px-6 py-4 border-t border-border flex justify-between items-center">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                  disabled={step === 0}
                >
                  <ChevronLeft size={16} /> Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none transition-all"
                    onClick={() => setStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
                    disabled={nextDisabled()}
                  >
                    Next Step <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none transition-all"
                    disabled={(isChecklistRequired && !isChecklistComplete) || (isGatewayOnly && !isGatewayOnlyConfirmed)}
                  >
                    Complete Preboarding <Save size={16} />
                  </button>
                )}

                {step === STEPS.length - 1 &&
                  showChecklistWarning &&
                  ((isChecklistRequired && !isChecklistComplete) ||
                   (isGatewayOnly && !isGatewayOnlyConfirmed)) && (
                  <div className="flex items-center gap-2 text-xs text-status-pending font-medium mt-3" role="alert">
                    <AlertCircle size={14} />
                    <span>
                      {isChecklistRequired && !isChecklistComplete
                        ? "Complete the application readiness checklist before submitting."
                        : "Please confirm you have reviewed the application details before submitting."}
                    </span>
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* Right Sidebar - Status Snapshot */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
              <h3 className="font-sans text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Info size={16} className="text-primary-text" />
                Status Snapshot
              </h3>

              <div className="space-y-4">
                <SectionStatus
                  label="Business Profile"
                  done={allMissing.business.length === 0}
                  count={REQUIRED_FIELDS.business.length - allMissing.business.length}
                  total={REQUIRED_FIELDS.business.length}
                />
                <SectionStatus
                  label="Legal Info"
                  done={allMissing.legal.length === 0}
                  count={REQUIRED_FIELDS.legal.length - allMissing.legal.length}
                  total={REQUIRED_FIELDS.legal.length}
                />
                <SectionStatus
                  label="Processing"
                  done={allMissing.processing.length === 0}
                  count={REQUIRED_FIELDS.processing.length - allMissing.processing.length}
                  total={REQUIRED_FIELDS.processing.length}
                />
              </div>

              {progress < 100 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Missing Items</h4>
                  <div className="space-y-3">
                    {Object.entries(allMissing).map(([section, fields]) =>
                      fields.length ? (
                        <div key={section} className="text-xs">
                          <span className="font-semibold text-foreground capitalize">{section}:</span>
                          <span className="text-destructive ml-1">
                            {fields.length} field{fields.length > 1 ? "s" : ""} remaining
                          </span>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-muted rounded-lg border border-border p-5">
              <h3 className="font-sans text-xs font-bold text-foreground uppercase tracking-wider mb-2">Tip</h3>
              <p className="text-xs text-foreground leading-relaxed">
                If your business does not currently have a processor, we will ask for additional documentation readiness checks after you click
                "Complete".
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// --- Subcomponents ---

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}

function Field({ label, required, children, hint, className = "" }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  const hasValue = props.value !== undefined && props.value !== null && String(props.value).trim() !== "";
  return (
    <input
      {...props}
      className={`w-full rounded-lg border bg-card text-foreground px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all ${
        hasValue ? "border-foreground/40" : "border-input"
      } ${props.className || ""}`}
    />
  );
}

function NumberInput(props: InputProps) {
  return <Input type="number" step="any" min="0" {...props} />;
}

interface SectionStatusProps {
  label: string;
  done: boolean;
  count: number;
  total: number;
}

function SectionStatus({ label, done, count, total }: SectionStatusProps) {
  const pct = Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-xs font-semibold ${done ? "text-status-approved" : "text-foreground"}`}>
          {label}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {count}/{total}
        </span>
      </div>
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${done ? "bg-status-approved" : "bg-status-approved/40"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function BusinessProfileStep({ form, onChange }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="DBA Name" required className="md:col-span-2">
          <Input
            value={form.dbaName}
            onChange={(e) => onChange("dbaName", e.target.value)}
            placeholder="Doing Business As..."
          />
        </Field>
        <Field label="Products / Services" required>
          <Input
            value={form.products}
            onChange={(e) => onChange("products", e.target.value)}
            placeholder="e.g. Shoes, Consulting"
          />
        </Field>
        <Field label="Nature of Business" required>
          <Input
            value={form.natureOfBusiness}
            onChange={(e) => onChange("natureOfBusiness", e.target.value)}
            placeholder="e.g. Retail, eCommerce"
          />
        </Field>
      </div>

      <hr className="border-border" />
      <h3 className="font-sans text-sm font-semibold text-foreground">Contact Information</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="First Name" required>
          <Input
            value={form.dbaContactFirst}
            onChange={(e) => onChange("dbaContactFirst", e.target.value)}
          />
        </Field>
        <Field label="Last Name" required>
          <Input
            value={form.dbaContactLast}
            onChange={(e) => onChange("dbaContactLast", e.target.value)}
          />
        </Field>
        <Field label="Phone Number" required>
          <Input
            value={form.dbaPhone}
            onChange={(e) => onChange("dbaPhone", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </Field>
        <Field label="Email Address" required>
          <Input
            type="email"
            value={form.dbaEmail}
            onChange={(e) => onChange("dbaEmail", e.target.value)}
            placeholder="name@business.com"
          />
        </Field>
      </div>

      <hr className="border-border" />
      <h3 className="font-sans text-sm font-semibold text-foreground">Location</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Address Line 1" required>
          <Input
            value={form.dbaAddress}
            onChange={(e) => onChange("dbaAddress", e.target.value)}
          />
        </Field>
        <Field label="Address Line 2">
          <Input
            value={form.dbaAddress2}
            onChange={(e) => onChange("dbaAddress2", e.target.value)}
          />
        </Field>
        <Field label="City" required>
          <Input value={form.dbaCity} onChange={(e) => onChange("dbaCity", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="State" required>
            <Input value={form.dbaState} onChange={(e) => onChange("dbaState", e.target.value)} />
          </Field>
          <Field label="ZIP Code" required>
            <Input value={form.dbaZip} onChange={(e) => onChange("dbaZip", e.target.value)} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function LegalInfoStep({ form, onChange }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Legal Entity Name" required className="md:col-span-2">
          <Input
            value={form.legalEntityName}
            onChange={(e) => onChange("legalEntityName", e.target.value)}
            placeholder="Official Registered Name"
          />
        </Field>
        <Field label="Business Phone" required>
          <Input value={form.legalPhone} onChange={(e) => onChange("legalPhone", e.target.value)} />
        </Field>
        <Field label="Business Email" required>
          <Input
            type="email"
            value={form.legalEmail}
            onChange={(e) => onChange("legalEmail", e.target.value)}
          />
        </Field>
        <Field label="Tax ID (TIN/EIN)" required>
          <Input value={form.tin} onChange={(e) => onChange("tin", e.target.value)} placeholder="XX-XXXXXXX" />
        </Field>
        <Field label="Ownership Type" required>
          <Input
            value={form.ownershipType}
            onChange={(e) => onChange("ownershipType", e.target.value)}
            placeholder="e.g. LLC, Sole Prop, Corp"
          />
        </Field>
        <Field label="Formation Date" required>
          <Input type="date" value={form.formationDate} onChange={(e) => onChange("formationDate", e.target.value)} />
        </Field>
        <Field label="State Incorporated" required>
          <Input value={form.stateIncorporated} onChange={(e) => onChange("stateIncorporated", e.target.value)} />
        </Field>
      </div>

      <hr className="border-border" />
      <h3 className="font-sans text-sm font-semibold text-foreground">Legal Address</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Address Line 1" required>
          <Input value={form.legalAddress} onChange={(e) => onChange("legalAddress", e.target.value)} />
        </Field>
        <Field label="Address Line 2">
          <Input value={form.legalAddress2} onChange={(e) => onChange("legalAddress2", e.target.value)} />
        </Field>
        <Field label="City" required>
          <Input value={form.legalCity} onChange={(e) => onChange("legalCity", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="State" required>
            <Input value={form.legalState} onChange={(e) => onChange("legalState", e.target.value)} />
          </Field>
          <Field label="ZIP Code" required>
            <Input value={form.legalZip} onChange={(e) => onChange("legalZip", e.target.value)} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function ProcessingStep({ form, onChange }: StepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-muted p-5 rounded-lg border border-border">
        <div className="space-y-6">
          {/* Question 1: Have Processor? */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground block">
              Do you have a payment processor? (Merchant ID) <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onChange("hasExistingProcessor", "yes");
                  onChange("isSwitchingProcessor", ""); // reset sub-question
                }}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                  form.hasExistingProcessor === "yes"
                    ? "border-primary bg-card text-primary-text ring-2 ring-ring/30 ring-offset-1"
                    : "border-input bg-card text-foreground hover:bg-accent hover:border-foreground/40"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("hasExistingProcessor", "no");
                  onChange("isSwitchingProcessor", "");
                }}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                  form.hasExistingProcessor === "no"
                    ? "border-status-pending bg-card text-status-pending ring-2 ring-status-pending/30 ring-offset-1"
                    : "border-input bg-card text-foreground hover:bg-accent hover:border-foreground/40"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Sub-Question: Switching? (Only if Yes to MID) */}
          {form.hasExistingProcessor === "yes" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-bold text-foreground block">
                Are you switching your payment processing to us? <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onChange("isSwitchingProcessor", "yes")}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                    form.isSwitchingProcessor === "yes"
                      ? "border-primary bg-card text-primary-text ring-2 ring-ring/30 ring-offset-1"
                      : "border-input bg-card text-foreground hover:bg-accent hover:border-foreground/40"
                  }`}
                >
                  Yes, switching
                </button>
                <button
                  type="button"
                  onClick={() => onChange("isSwitchingProcessor", "no")}
                  className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                    form.isSwitchingProcessor === "no"
                      ? "border-brand-slate bg-card text-brand-slate-text ring-2 ring-brand-slate/30 ring-offset-1"
                      : "border-input bg-card text-foreground hover:bg-accent hover:border-foreground/40"
                  }`}
                >
                  No, keeping existing
                </button>
              </div>
            </div>
          )}

          {/* 1. Switching Logic */}
          {form.hasExistingProcessor === "yes" && form.isSwitchingProcessor === "yes" && (
            <div className="mt-4 pt-4 border-t border-border animate-in fade-in">
              <Field label="Current Processor Name">
                <Input
                  value={form.currentProcessorName}
                  onChange={(e) => onChange("currentProcessorName", e.target.value)}
                  placeholder="e.g. Stripe, Square, Chase"
                />
              </Field>
            </div>
          )}

          {/* 2. Keeping MID Logic */}
          {form.hasExistingProcessor === "yes" && form.isSwitchingProcessor === "no" && (
            <div className="mt-4 pt-4 border-t border-border space-y-5 animate-in fade-in">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-3 text-sm text-foreground">
                <Info size={18} className="shrink-0 mt-0.5 text-brand-slate-text" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Gateway Configuration Required</p>
                  <p>
                    Since you are keeping your current processor, we need to bridge the gateway manually.
                    Please email a <span className="font-semibold">Voided Check</span> or <span className="font-semibold">Bank Confirmation Letter</span> to:
                  </p>
                  <p className="text-xs text-foreground">
                    Do not enter routing or account numbers in this form. We only accept the documents above for banking verification.
                  </p>
                  <div className="font-mono bg-background p-2 rounded text-foreground select-all inline-block mt-1">
                    sales@merchanthaus.io
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Confirm Availability</h4>

                <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
                  <input
                    type="checkbox"
                    id="chkVoided"
                    className="h-4 w-4 rounded border-input text-primary-text focus:ring-ring"
                    checked={form.hasVoidedCheckOrBankLetter === "yes"}
                    onChange={(e) => onChange("hasVoidedCheckOrBankLetter", e.target.checked ? "yes" : "")}
                  />
                  <label htmlFor="chkVoided" className="text-sm text-foreground cursor-pointer select-none">
                    I will send the <span className="font-semibold">Voided Check</span> or <span className="font-semibold">Bank Letter</span> to the email above.
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
                  <input
                    type="checkbox"
                    id="chkVar"
                    className="h-4 w-4 rounded border-input text-primary-text focus:ring-ring"
                    checked={form.hasVarSheet === "yes"}
                    onChange={(e) => onChange("hasVarSheet", e.target.checked ? "yes" : "")}
                  />
                  <label htmlFor="chkVar" className="text-sm text-foreground cursor-pointer select-none">
                    I confirm I have the <span className="font-semibold">VAR Sheet</span> (Value Added Reseller sheet) from the current processor.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 3. New Setup Logic */}
          {form.hasExistingProcessor === "no" && (
            <div className="mt-3 flex items-start gap-3 rounded-lg border border-status-pending/40 bg-status-pending-bg p-3 text-xs text-foreground animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>
                Heads up: After you submit this form, we'll ask a few quick questions about document readiness (bank statements, voided checks, etc.) to ensure a smooth boarding process.
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-sans text-sm font-semibold text-foreground mb-4">Volume & Ticket Size</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Monthly Volume ($)" required>
            <NumberInput value={form.monthlyVolume} onChange={(e) => onChange("monthlyVolume", e.target.value)} />
          </Field>
          <Field label="Average Ticket ($)" required>
            <NumberInput value={form.avgTicket} onChange={(e) => onChange("avgTicket", e.target.value)} />
          </Field>
          <Field label="High Ticket ($)" required>
            <NumberInput value={form.highTicket} onChange={(e) => onChange("highTicket", e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Transaction Breakdown - shows percentage split across different transaction types */}
      <div>
        <h3 className="font-sans text-sm font-semibold text-foreground mb-4">
          Transaction Breakdown (%) <span className="text-muted-foreground font-normal ml-1">(Percentage of transactions you see or anticipate)</span>
        </h3>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          <Field label="Swiped" required hint="Card physically swiped at terminal">
            <NumberInput value={form.swipedPct} onChange={(e) => onChange("swipedPct", e.target.value)} />
          </Field>
          <Field label="Keyed" required hint="Card number manually entered">
            <NumberInput value={form.keyedPct} onChange={(e) => onChange("keyedPct", e.target.value)} />
          </Field>
          <Field label="MOTO" required hint="Mail Order / Telephone Order transactions">
            <NumberInput value={form.motoPct} onChange={(e) => onChange("motoPct", e.target.value)} />
          </Field>
          <Field label="eCom" required hint="eCommerce / online transactions">
            <NumberInput value={form.ecomPct} onChange={(e) => onChange("ecomPct", e.target.value)} />
          </Field>
          <Field label="B2C" required hint="Business-to-Consumer sales">
            <NumberInput value={form.b2cPct} onChange={(e) => onChange("b2cPct", e.target.value)} />
          </Field>
          <Field label="B2B" required hint="Business-to-Business sales">
            <NumberInput value={form.b2bPct} onChange={(e) => onChange("b2bPct", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Website URL">
          <Input
            value={form.website}
            onChange={(e) => onChange("website", e.target.value)}
            placeholder="https://example.com"
          />
        </Field>
        <Field label="SIC / MCC (if known)" hint="Standard Industry / Merchant Category Code">
          <Input
            value={form.sicMcc}
            onChange={(e) => onChange("sicMcc", e.target.value)}
            placeholder="e.g. 5411"
          />
        </Field>
      </div>
    </div>
  );
}

function ReviewStep({
  form,
  allMissing,
  onChange,
  isChecklistRequired,
  isChecklistComplete,
  isGatewayOnly,
}: ReviewStepProps) {
  // Show full checklist if New Setup OR Switching Processor
  const showFullChecklist =
    form.hasExistingProcessor === "no" ||
    (form.hasExistingProcessor === "yes" && form.isSwitchingProcessor === "yes");

  // Gateway-only clients need to confirm they've reviewed before submitting
  const isGatewayOnlyConfirmed = form.gatewayOnlyReviewConfirmed === "yes";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Anti-Fraud Value Prop */}
      <div className="rounded-lg border border-border bg-muted p-5">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-brand-slate/20 rounded-lg text-brand-slate-text">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-foreground">Security & Value Added Services</h4>
            <p className="text-sm text-foreground leading-relaxed">
              We are an anti-fraud first company.
              <span className="font-semibold"> Customer Vault</span>,
              <span className="font-semibold"> Network Tokens</span>, and
              <span className="font-semibold"> Account Updater</span> are provided by default as a value-added service to ensure your transactions are secure and seamless.
            </p>
            <div className="flex gap-4 pt-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-slate-text">
                <Lock size={12} /> Vault
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-slate-text">
                <RefreshCw size={12} /> Updater
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-slate-text">
                <ShieldCheck size={12} /> Tokens
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground border border-border">
        <p>
          Please review the details below. Once you submit, this data will be queued for formal onboarding.
        </p>
      </div>

      {/* Gateway-Only Review Confirmation - requires explicit acknowledgment before submission */}
      {isGatewayOnly && (
        <div className="rounded-lg border border-border bg-muted p-5 animate-in fade-in">
          <h4 className="flex items-center gap-2 mb-4 text-sm font-bold text-foreground uppercase tracking-wide">
            <Info size={16} className="text-brand-slate-text" />
            Review & Confirm
          </h4>
          <p className="text-sm text-foreground mb-4">
            You are setting up a <span className="font-semibold">Gateway-Only</span> configuration (keeping your existing processor).
            Please review all the information above and confirm you are ready to submit.
          </p>
          <div
            className={`flex items-center gap-2 text-xs font-semibold mb-3 ${
              isGatewayOnlyConfirmed ? "text-status-approved" : "text-brand-slate-text"
            }`}
            role="status"
          >
            {isGatewayOnlyConfirmed ? <Check size={14} /> : <AlertCircle size={14} />}
            <span>
              {isGatewayOnlyConfirmed
                ? "Review confirmed. You may now submit."
                : "Please confirm your review to enable submission."}
            </span>
          </div>
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
            <input
              type="checkbox"
              id="gatewayOnlyConfirm"
              className="h-5 w-5 rounded border-input text-primary-text focus:ring-ring"
              checked={isGatewayOnlyConfirmed}
              onChange={(e) => onChange("gatewayOnlyReviewConfirmed", e.target.checked ? "yes" : "")}
            />
            <label htmlFor="gatewayOnlyConfirm" className="text-sm text-foreground cursor-pointer select-none">
              I have reviewed all the application details and confirm they are correct. <span className="text-destructive">*</span>
            </label>
          </div>
        </div>
      )}

      {/* Required Docs Confirmation for NEW SETUPS & SWITCHING */}
      {showFullChecklist && (
        <div className="rounded-lg border border-status-pending/40 bg-status-pending-bg p-5 animate-in fade-in">
          <h4 className="flex items-center gap-2 mb-4 text-sm font-bold text-foreground uppercase tracking-wide">
            <FileText size={16} className="text-status-pending" />
            Application Readiness Checklist
          </h4>
          <p className="text-sm text-foreground mb-4">
            Please confirm you have access to the following documents before proceeding.
            (Uploads will be requested in the formal application). Do not enter routing or account numbers in this form.
          </p>
          <div
            className={`flex items-center gap-2 text-xs font-semibold mb-3 ${
              isChecklistComplete ? "text-status-approved" : "text-status-pending"
            }`}
            role="status"
          >
            {isChecklistComplete ? <Check size={14} /> : <AlertCircle size={14} />}
            <span>
              {isChecklistComplete
                ? "Application readiness checklist completed."
                : "Please answer each checklist item to enable submission."}
            </span>
          </div>
          <div className="space-y-3">
            <ChecklistRow
              label="Bank or processing statements"
              value={form.hasBankOrProcessingStatements}
              onChange={(v) => onChange("hasBankOrProcessingStatements", v)}
            />
            <ChecklistRow
              label="Voided check or bank letter"
              value={form.hasVoidedCheckOrBankLetter}
              onChange={(v) => onChange("hasVoidedCheckOrBankLetter", v)}
            />
            <ChecklistRow
              label="Government ID (Driver's License/Passport)"
              value={form.hasGovernmentId}
              onChange={(v) => onChange("hasGovernmentId", v)}
            />
            <ChecklistRow
              label="Articles of Organization"
              value={form.hasArticlesOfOrganization}
              onChange={(v) => onChange("hasArticlesOfOrganization", v)}
            />
            <ChecklistRow
              label="Tax Document (Confirm EIN)"
              value={form.hasTaxDocument}
              onChange={(v) => onChange("hasTaxDocument", v)}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <SummaryCard title="Business Profile" icon={Briefcase}>
          <SummaryItem label="DBA Name" value={form.dbaName} />
          <SummaryItem label="Products" value={form.products} />
          <SummaryItem label="Industry" value={form.natureOfBusiness} />
          <SummaryItem label="Contact" value={`${form.dbaContactFirst} ${form.dbaContactLast}`} />
          <SummaryItem label="Phone" value={form.dbaPhone} />
          <SummaryItem label="Email" value={form.dbaEmail} />
        </SummaryCard>

        <SummaryCard title="Legal Information" icon={Scale}>
          <SummaryItem label="Legal Entity" value={form.legalEntityName} />
          <SummaryItem label="Tax ID (TIN)" value={form.tin} />
          <SummaryItem label="Ownership" value={form.ownershipType} />
          <SummaryItem label="Founded" value={form.formationDate} />
          <SummaryItem label="State Inc." value={form.stateIncorporated} />
        </SummaryCard>

        <SummaryCard title="Processing Details" icon={CreditCard}>
          <SummaryItem
            label="Processor"
            value={
              form.hasExistingProcessor === "yes"
                ? form.isSwitchingProcessor === "yes"
                  ? "Switching from " + (form.currentProcessorName || "Current")
                  : "Keeping Existing MID"
                : "New Setup"
            }
          />

          {form.hasExistingProcessor === "yes" && form.isSwitchingProcessor === "no" && (
            <div className="py-2 my-2 border-y border-border bg-muted rounded px-2">
              <SummaryItem label="Banking" value="Email Instr. Sent" />
              <SummaryItem label="VAR Sheet" value={form.hasVarSheet} />
            </div>
          )}

          <SummaryItem label="Monthly Vol" value={`$${form.monthlyVolume}`} />
          <SummaryItem label="Avg Ticket" value={`$${form.avgTicket}`} />
          <div className="grid grid-cols-2 gap-y-1 mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Swiped: {form.swipedPct}%</span>
            <span className="text-xs text-muted-foreground">Keyed: {form.keyedPct}%</span>
            <span className="text-xs text-muted-foreground">eCom: {form.ecomPct}%</span>
            <span className="text-xs text-muted-foreground">B2B: {form.b2bPct}%</span>
          </div>
        </SummaryCard>

        <SummaryCard title="Notes & Docs" icon={FileText}>
          {/* Summary of docs logic */}
          {showFullChecklist ? (
            <div className="space-y-1">
              <SummaryItem label="Statements" value={form.hasBankOrProcessingStatements || "—"} />
              <SummaryItem label="Voided Check" value={form.hasVoidedCheckOrBankLetter || "—"} />
              <SummaryItem label="Government ID" value={form.hasGovernmentId || "—"} />
              <SummaryItem label="Articles of Org." value={form.hasArticlesOfOrganization || "—"} />
              <SummaryItem label="Tax Doc (EIN)" value={form.hasTaxDocument || "—"} />
            </div>
          ) : form.isSwitchingProcessor === "no" ? (
            <div className="space-y-1">
              <SummaryItem label="Voided Check" value={form.hasVoidedCheckOrBankLetter || "—"} />
              <SummaryItem label="VAR Sheet" value={form.hasVarSheet || "—"} />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic mb-2">Standard docs verification pending.</p>
          )}
          <SummaryItem label="Docs Link" value={form.docsLocationOrLink} />
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground block mb-1">Internal Notes</span>
            <p className="text-sm text-foreground whitespace-pre-wrap">{form.notes || "—"}</p>
          </div>
        </SummaryCard>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}

function SummaryCard({ title, icon: Icon, children }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h4 className="flex items-center gap-2 mb-4 text-sm font-bold text-foreground uppercase tracking-wide">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        {title}
      </h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value?: string | number;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex justify-between items-start text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right max-w-[60%] break-words">{value || "—"}</span>
    </div>
  );
}

interface ChecklistRowProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function ChecklistRow({ label, value, onChange }: ChecklistRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border hover:border-foreground/30 transition-colors bg-card">
      <span className="font-medium text-foreground flex items-center gap-2">
        <FileText size={16} className="text-muted-foreground" />
        {label} <span className="text-destructive">*</span>
      </span>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onChange("yes")}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
            value === "yes"
              ? "bg-status-approved-bg border-status-approved text-status-approved shadow-sm"
              : "bg-card border-input text-muted-foreground hover:bg-accent"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
            value === "no"
              ? "bg-status-declined-bg border-status-declined text-status-declined shadow-sm"
              : "bg-card border-input text-muted-foreground hover:bg-accent"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

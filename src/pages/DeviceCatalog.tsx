import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { ContactDialog } from "@/components/ContactDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DEVICE_CATEGORIES,
  HERO_STATS,
  MATRIX_HEADERS,
  MATRIX_ROWS,
  PLATFORM_STATS,
  TOTAL_DEVICES,
  type Device,
  type MatrixCell,
} from "@/data/deviceCatalog";

/** Flat lookup so the matrix can link a row back to its device detail. */
const DEVICES_BY_NAME = new Map<string, Device>(
  DEVICE_CATEGORIES.flatMap((category) =>
    category.devices.map((device) => [device.name, device] as const)
  )
);

const CATEGORY_OF_DEVICE = new Map<string, string>(
  DEVICE_CATEGORIES.flatMap((category) =>
    category.devices.map((device) => [device.name, category.title] as const)
  )
);

/** A supported capability renders as a filled pip; anything else as a dash. */
const MatrixValue = ({ cell }: { cell: MatrixCell }) => {
  if (cell === true) {
    return (
      <span
        className="inline-block h-2 w-2 rounded-full bg-foreground"
        aria-label="Supported"
        role="img"
      />
    );
  }
  if (typeof cell === "string") {
    return <span className="text-muted-foreground">{cell}</span>;
  }
  return (
    <span className="text-muted-foreground/50" aria-label="Not applicable" role="img">
      —
    </span>
  );
};

const SpecList = ({ device }: { device: Device }) => (
  <dl className="space-y-3 border-t border-border pt-4">
    {device.specs.map((spec) => (
      <div key={spec.label} className="grid grid-cols-[5.5rem_1fr] gap-3 text-sm">
        <dt className="font-inter text-xs uppercase tracking-wider text-muted-foreground/70 pt-0.5">
          {spec.label}
        </dt>
        <dd className="font-inter text-foreground/80">
          {"badges" in spec ? (
            <div className="flex flex-wrap gap-1.5">
              {spec.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : spec.pending ? (
            <span className="italic text-muted-foreground/70">{spec.value}</span>
          ) : (
            spec.value
          )}
        </dd>
      </div>
    ))}
  </dl>
);

const DeviceCard = ({
  device,
  onSelect,
}: {
  device: Device;
  onSelect: (device: Device) => void;
}) => (
  <button
    type="button"
    onClick={() => onSelect(device)}
    aria-label={`View ${device.name} details`}
    className="group flex flex-col text-left border border-border bg-background dark:bg-neutral-dark/40 transition-all hover:border-foreground/30 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    {device.image ? (
      <div className="flex h-44 items-center justify-center overflow-hidden border-b border-border bg-muted/30 p-6">
        <img
          src={device.image}
          alt={device.imageAlt ?? device.name}
          loading="lazy"
          className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    ) : (
      <div className="flex h-44 items-center justify-center border-b border-border bg-muted/20">
        <span className="font-rajdhani text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
          Software only
        </span>
      </div>
    )}

    <div className="flex flex-1 flex-col p-6">
      <h3 className="font-rajdhani text-xl font-medium uppercase tracking-wide text-foreground">
        {device.name}
      </h3>
      <p className="mt-1 font-inter text-xs uppercase tracking-wider text-muted-foreground/70">
        {device.manufacturer}
      </p>
      <p className="mt-4 flex-1 font-inter text-sm font-light leading-relaxed text-muted-foreground">
        {device.description}
      </p>
      <div className="mt-5">
        <SpecList device={device} />
      </div>
      <span className="mt-5 font-inter text-xs uppercase tracking-wider text-foreground/50 transition-colors group-hover:text-foreground">
        View details →
      </span>
    </div>
  </button>
);

const DeviceDetailDialog = ({
  device,
  onOpenChange,
}: {
  device: Device | null;
  onOpenChange: (open: boolean) => void;
}) => (
  <Dialog open={device !== null} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      {device && (
        <>
          {device.image && (
            <div className="flex h-56 items-center justify-center border border-border bg-muted/30 p-8">
              <img
                src={device.image}
                alt={device.imageAlt ?? device.name}
                className="h-full w-auto object-contain"
              />
            </div>
          )}

          <DialogHeader className="text-left">
            <p className="font-inter text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
              {CATEGORY_OF_DEVICE.get(device.name)}
            </p>
            <DialogTitle className="font-rajdhani text-2xl font-medium uppercase tracking-wide">
              {device.name}
            </DialogTitle>
            <DialogDescription className="font-inter text-sm text-muted-foreground">
              {device.manufacturer}
            </DialogDescription>
          </DialogHeader>

          <p className="font-inter text-sm font-light leading-relaxed text-foreground/80">
            {device.description}
          </p>

          {device.highlights.length > 0 && (
            <section>
              <h4 className="font-ubuntu mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                Highlights
              </h4>
              <ul className="space-y-2">
                {device.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 font-inter text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {device.useCases.length > 0 && (
            <section>
              <h4 className="font-ubuntu mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
                Where it fits
              </h4>
              <ul className="space-y-2">
                {device.useCases.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 font-inter text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h4 className="font-ubuntu mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Specifications
            </h4>
            <SpecList device={device} />
          </section>

          {device.notes && (
            <p className="border-l-2 border-border pl-4 font-inter text-sm italic text-muted-foreground">
              {device.notes}
            </p>
          )}
        </>
      )}
    </DialogContent>
  </Dialog>
);

const DeviceCatalog = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jumpLinks = useMemo(
    () =>
      DEVICE_CATEGORIES.map((category) => ({
        id: category.id,
        title: category.title,
        count: category.devices.length,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-dark">
      <PageSEO
        title="Device Catalog — Card-Present Payment Hardware"
        description={`${TOTAL_DEVICES} card-present payment devices across countertop, SmartPOS, mobile, and SoftPOS form factors — all on one MerchantHaus account.`}
        path="/device-catalog"
      />

      <Header />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <span className="font-inter text-xs uppercase tracking-[0.25em] text-muted-foreground/70">
            Merchant Haus · Card-present hardware
          </span>
          <h1 className="mt-6 max-w-4xl font-rajdhani text-4xl font-medium uppercase leading-tight tracking-wide text-foreground sm:text-5xl lg:text-6xl">
            Every device your business will ever need,{" "}
            <span className="text-foreground/45">on one account.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-inter text-base font-light leading-relaxed text-muted-foreground">
            Twelve devices across four form factors — countertop, SmartPOS, mobile, and
            SoftPOS. One account, one set of reporting, and the same rails underneath
            whether you're taking a tap at the counter, at the table, or out in the field.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-rajdhani text-3xl font-medium text-foreground">
                    {stat.value}
                  </span>
                  <span className="mt-1 block font-inter text-xs uppercase tracking-wider text-muted-foreground/70">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Jump-to strip */}
      <nav
        aria-label="Jump to device category"
        className="sticky top-[73px] z-40 border-b border-border bg-background/95 backdrop-blur dark:bg-neutral-dark/95"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-4">
          <span className="font-inter text-xs uppercase tracking-wider text-muted-foreground/60">
            Jump to
          </span>
          {jumpLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="inline-flex items-center gap-2 border border-border px-3 py-1.5 font-inter text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {link.title}
              <span className="text-muted-foreground/50">{link.count}</span>
            </a>
          ))}
          <a
            href="#compare"
            className="inline-flex items-center border border-border px-3 py-1.5 font-inter text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Compare
          </a>
        </div>
      </nav>

      <main>
        {DEVICE_CATEGORIES.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="border-b border-border scroll-mt-36"
          >
            <div className="mx-auto max-w-7xl px-6 py-16">
              <span className="font-inter text-xs uppercase tracking-[0.25em] text-muted-foreground/60">
                Form factor
              </span>
              <div className="mt-3 flex flex-wrap items-baseline gap-4">
                <h2 className="font-rajdhani text-3xl font-medium uppercase tracking-wide text-foreground sm:text-4xl">
                  {category.title}
                </h2>
                <span className="font-inter text-sm text-muted-foreground/70">
                  {category.devices.length}{" "}
                  {category.devices.length === 1 ? "device" : "devices"}
                </span>
              </div>
              <p className="mt-4 max-w-3xl font-inter text-sm font-light leading-relaxed text-muted-foreground">
                {category.description}
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.devices.map((device) => (
                  <DeviceCard
                    key={device.slug}
                    device={device}
                    onSelect={setSelectedDevice}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Capability comparison */}
        <section id="compare" className="border-b border-border scroll-mt-36">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <span className="font-inter text-xs uppercase tracking-[0.25em] text-muted-foreground/60">
              Side by side
            </span>
            <h2 className="mt-3 font-rajdhani text-3xl font-medium uppercase tracking-wide text-foreground sm:text-4xl">
              Capability comparison
            </h2>
            <p className="mt-4 max-w-3xl font-inter text-sm font-light leading-relaxed text-muted-foreground">
              A summary of what each device supports, based on published catalog
              descriptions. Confirm the exact configuration with us before you order.
            </p>

            <div className="mt-10 overflow-x-auto border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    {MATRIX_HEADERS.map((header, index) => (
                      <th
                        key={header}
                        scope="col"
                        className={`whitespace-nowrap px-4 py-3 font-ubuntu text-xs font-semibold uppercase tracking-wider text-foreground ${
                          index === 0 ? "text-left" : "text-center"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_ROWS.map((row) => {
                    if ("category" in row) {
                      return (
                        <tr key={`cat-${row.category}`} className="border-t border-border">
                          <td
                            colSpan={MATRIX_HEADERS.length}
                            className="bg-muted/20 px-4 py-2 font-inter text-xs uppercase tracking-[0.2em] text-muted-foreground/70"
                          >
                            {row.category}
                          </td>
                        </tr>
                      );
                    }

                    const device = DEVICES_BY_NAME.get(row.device);
                    return (
                      <tr
                        key={row.device}
                        className="border-t border-border transition-colors hover:bg-muted/20"
                      >
                        <th
                          scope="row"
                          className="whitespace-nowrap px-4 py-3 text-left font-inter text-sm font-medium text-foreground"
                        >
                          {device ? (
                            <button
                              type="button"
                              onClick={() => setSelectedDevice(device)}
                              className="underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-foreground"
                            >
                              {row.device}
                            </button>
                          ) : (
                            row.device
                          )}
                        </th>
                        {row.cells.map((cell, index) => (
                          <td
                            key={MATRIX_HEADERS[index + 1] ?? index}
                            className="px-4 py-3 text-center font-inter text-sm"
                          >
                            <MatrixValue cell={cell} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-4 flex flex-wrap items-center gap-2 font-inter text-xs text-muted-foreground/70">
              <span className="inline-block h-2 w-2 rounded-full bg-foreground" />
              Supported
              <span className="mx-1 text-muted-foreground/40">·</span>
              <span className="text-muted-foreground/50">—</span>
              Not applicable or not confirmed in the catalog. Confirm with Merchant Haus
              before you order.
            </p>
          </div>
        </section>

        {/* Closing */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <span className="font-inter text-xs uppercase tracking-[0.25em] text-muted-foreground/60">
              Behind the catalog
            </span>
            <h2 className="mt-3 max-w-3xl font-rajdhani text-3xl font-medium uppercase tracking-wide text-foreground sm:text-4xl">
              Put our experience to work for you.
            </h2>
            <p className="mt-6 max-w-3xl font-inter text-base font-light leading-relaxed text-muted-foreground">
              Merchant Haus boards merchants on global payment infrastructure — a platform
              carrying 1.2M+ merchants worldwide, processing $502B+ in annual volume, and
              connected to 150+ acquirers. Whichever device you need, the rails underneath
              don't change.
            </p>

            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
              {PLATFORM_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-rajdhani text-2xl font-medium text-foreground">
                      {stat.value}
                    </span>
                    <span className="mt-1 block font-inter text-xs uppercase tracking-wider text-muted-foreground/70">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Button
                onClick={() => setIsContactOpen(true)}
                className="rounded-none bg-foreground px-8 font-inter text-sm font-medium tracking-wide text-background transition-all hover:bg-foreground/90"
              >
                Talk to us about hardware
              </Button>
              <a
                href="/supported-processors"
                className="inline-flex items-center border border-foreground/20 px-6 py-2 font-inter text-sm font-medium tracking-wide text-foreground/70 transition-all hover:bg-foreground hover:text-background"
              >
                View supported processors
              </a>
            </div>
          </div>
        </section>
      </main>

      <DeviceDetailDialog
        device={selectedDevice}
        onOpenChange={(open) => {
          if (!open) setSelectedDevice(null);
        }}
      />
      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} />

      <Footer />
    </div>
  );
};

export default DeviceCatalog;

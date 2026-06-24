import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { menu } from "@/lib/menu";
import { useCart } from "@/lib/cart-store";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AquaFlow — Premium Water Delivery" },
      { name: "description", content: "Elegant water delivery in Ruiru. Order 10L, 20L jugs or 500ml bottle packs straight to your door." },
      { property: "og:title", content: "AquaFlow — Premium Water Delivery" },
      { property: "og:description", content: "Elegant water delivery in Ruiru. Order 10L, 20L jugs or 500ml bottle packs straight to your door." },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "254799341904";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.38-1.67a11.83 11.83 0 0 0 5.66 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.45ZM12.05 21.5h-.01a9.65 9.65 0 0 1-4.92-1.35l-.35-.21-3.79.99 1.01-3.69-.23-.38a9.66 9.66 0 0 1-1.48-5.12c0-5.34 4.35-9.68 9.69-9.68 2.59 0 5.02 1.01 6.85 2.84a9.62 9.62 0 0 1 2.84 6.85c0 5.34-4.35 9.75-9.61 9.75Zm5.31-7.27c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.76.94-.93 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.6-.91-2.19-.24-.57-.48-.49-.66-.5l-.56-.01c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.02.15.19 2.06 3.15 5 4.42.7.3 1.25.48 1.67.62.7.22 1.34.19 1.85.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34Z" />
    </svg>
  );
}

function Index() {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const totalCount = useCart((s) =>
    Object.values(s.items).reduce((a, b) => a + b, 0),
  );
  const totalPrice = useMemo(
    () =>
      Object.entries(items).reduce((sum, [id, qty]) => {
        const it = menu.find((m) => m.id === id);
        return sum + (it ? it.price * qty : 0);
      }, 0),
    [items],
  );

  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky checkout at the top */}
      {totalCount > 0 && (
        <div className="sticky top-0 z-40 px-4 pt-3 pb-3 backdrop-blur-md"
          style={{ background: "color-mix(in oklab, var(--background) 80%, transparent)" }}
        >
          <div className="mx-auto max-w-xl">
            <button
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-between gap-4 rounded-full bg-primary px-5 py-3.5 text-primary-foreground transition active:scale-[0.99]"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-foreground/15">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">
                  {totalCount} {totalCount === 1 ? "item" : "items"}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  KES {totalPrice.toLocaleString()}
                </span>
                <span className="text-xs opacity-80">Checkout →</span>
              </span>
            </button>
          </div>
        </div>
      )}

      <div
        className="px-5 pt-12 pb-8 sm:pt-16"
        style={{ background: "var(--gradient-soft)" }}
      >
        <div className="mx-auto max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            RUIRU· PREMIUM DELIVERY
          </p>
          <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
            Aqua<span className="font-serif italic text-primary">Flow</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Soft, pure, perfectly chilled water — delivered with care to your
            doorstep.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-5 pb-16 pt-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Our Selection
        </h2>
        <div className="space-y-5">
          {menu.map((item) => {
            const qty = items[item.id] ?? 0;
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl bg-card"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-5 py-5">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-medium">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      KES {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 rounded-full bg-secondary px-2 py-1.5">
                      <button
                        onClick={() => remove(item.id)}
                        disabled={qty === 0}
                        className="grid h-8 w-8 place-items-center rounded-full bg-card text-foreground disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => add(item.id)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => add(item.id)}
                      className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                      style={{ boxShadow: "var(--shadow-soft)" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* About Us */}
        <section className="mt-14">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            About Us
          </p>
          <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
            Hydration, with a softer touch.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            AquaFlow is a small, family-run delivery service based in Ruiru.
            We hand-pick every jug, sanitize each bottle, and bring it to your
            door — so your home, office or studio always feels calm, clean and
            beautifully hydrated.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Same-day delivery · Friendly riders · Confirmed on WhatsApp.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:opacity-90"
            style={{ boxShadow: "var(--shadow-soft)" }}
            aria-label="Chat with us on WhatsApp"
          >
            <WhatsAppIcon className="h-4 w-4 text-primary" />
            Chat with us
          </a>
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Free delivery within Ruiru · Order confirmed via WhatsApp
        </p>
      </main>

      {open && <CheckoutModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const lines = Object.entries(items)
    .map(([id, qty]) => {
      const it = menu.find((m) => m.id === id);
      if (!it) return null;
      return { it, qty, subtotal: it.price * qty };
    })
    .filter(Boolean) as {
    it: (typeof menu)[number];
    qty: number;
    subtotal: number;
  }[];

  const total = lines.reduce((s, l) => s + l.subtotal, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || lines.length === 0) return;

    const text =
      `*New AquaFlow Order*\n\n` +
      `*Customer:* ${name}\n` +
      `*Delivery Address:* ${address}\n\n` +
      `*Order:*\n` +
      lines
        .map(
          (l) =>
            `• ${l.it.name} × ${l.qty} — KES ${l.subtotal.toLocaleString()}`,
        )
        .join("\n") +
      `\n\n*Total:* KES ${total.toLocaleString()}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    clear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 px-3 pb-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="w-full max-w-md rounded-3xl bg-card p-6"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-medium">Almost there</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              We'll confirm your order via WhatsApp.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5 space-y-3 rounded-2xl bg-muted/60 p-4">
          {lines.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Your cart is empty.
            </p>
          )}
          {lines.map((l) => (
            <div
              key={l.it.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{l.it.name}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  KES {l.subtotal.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-card px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => remove(l.it.id)}
                  className="grid h-7 w-7 place-items-center rounded-full bg-secondary"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[1.25rem] text-center text-sm font-semibold tabular-nums">
                  {l.qty}
                </span>
                <button
                  type="button"
                  onClick={() => add(l.it.id)}
                  className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setQty(l.it.id, 0)}
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label={`Remove ${l.it.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {lines.length > 0 && (
            <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold">
              <span>Total</span>
              <span className="tabular-nums">
                KES {total.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Delivery Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              placeholder="Building, street, area, landmarks"
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <button
            type="submit"
            disabled={lines.length === 0}
            className="mt-2 w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            Send order on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

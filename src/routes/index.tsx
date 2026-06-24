import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
const MAX_QTY = 5;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
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

  // Animate cart when items added
  const [pop, setPop] = useState(0);
  const prevCount = useRef(totalCount);
  useEffect(() => {
    if (totalCount > prevCount.current) setPop((p) => p + 1);
    prevCount.current = totalCount;
  }, [totalCount]);

  const handleAdd = (id: string) => {
    const qty = items[id] ?? 0;
    if (qty >= MAX_QTY) return;
    add(id);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Floating cart — top right */}
      <button
        onClick={() => totalCount > 0 && setOpen(true)}
        aria-label={`Open cart, ${totalCount} items`}
        className="fixed right-4 top-4 z-40 sm:right-6 sm:top-6"
      >
        <span
          key={pop}
          className={`relative grid h-12 w-12 place-items-center rounded-full text-primary-foreground ${pop ? "animate-cart-pop" : ""}`}
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-float)" }}
        >
          <ShoppingBag className="h-5 w-5" />
          {totalCount > 0 && (
            <span
              key={`b-${pop}`}
              className="animate-badge-pop absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background"
            >
              {totalCount}
            </span>
          )}
        </span>
      </button>

      {/* Hero */}
      <header
        className="px-5 pt-14 pb-10 sm:pt-20"
        style={{ background: "var(--gradient-soft)" }}
      >
        <div className="mx-auto max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            RUIRU · PREMIUM DELIVERY
          </p>
          <h1 className="mt-4 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            Aqua<span className="font-serif italic text-primary">Flow</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Soft, pure, perfectly chilled water — delivered with quiet care
            to your doorstep.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 pb-32 pt-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Our Selection
          </h2>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Max {MAX_QTY} per item
          </span>
        </div>

        <div className="space-y-6">
          {menu.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>


        {/* About */}
        <section className="mt-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            About Us
          </p>
          <h2 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
            Hydration, with a <span className="font-serif italic text-primary">softer</span> touch.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            AquaFlow is a small, family-run delivery service based in Ruiru.
            We hand-pick every jug, sanitize every bottle, and bring it to
            your door — so your home, office, or studio always feels calm,
            clean, and beautifully hydrated.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { k: "Same-day", v: "Delivery" },
              { k: "Sanitized", v: "Every bottle" },
              { k: "Friendly", v: "Riders" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl bg-card px-3 py-4"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <p className="text-sm font-medium">{s.k}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Confirmed via WhatsApp · Made in Ruiru
        </p>
      </main>

      {/* Floating WhatsApp — bottom right, always visible */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-card py-3 pl-3 pr-4 text-sm font-medium text-foreground transition hover:scale-[1.03] active:scale-95 sm:bottom-6 sm:right-6"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <span
          className="grid h-9 w-9 place-items-center rounded-full text-primary-foreground"
          style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
        >
          <WhatsAppIcon className="h-5 w-5" />
        </span>
        <span className="pr-1">Chat with us</span>
      </a>

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
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-medium">Your cart</h2>
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
            <div key={l.it.id} className="flex items-center justify-between gap-2 text-sm">
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
                  onClick={() => l.qty < MAX_QTY && add(l.it.id)}
                  disabled={l.qty >= MAX_QTY}
                  className="grid h-7 w-7 place-items-center rounded-full text-primary-foreground disabled:opacity-40"
                  style={{ background: "var(--gradient-primary)" }}
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
              <span className="tabular-nums">KES {total.toLocaleString()}</span>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
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
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
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
            className="mt-2 w-full rounded-full py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-50"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-soft)" }}
          >
            Send order on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

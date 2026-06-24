import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { menu } from "@/lib/menu";
import { useCart } from "@/lib/cart-store";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AquaFlow — Premium Water Delivery" },
      { name: "description", content: "Elegant water delivery in Nairobi. Order 10L, 20L jugs or 500ml bottle packs straight to your door." },
      { property: "og:title", content: "AquaFlow — Premium Water Delivery" },
      { property: "og:description", content: "Elegant water delivery in Nairobi. Order 10L, 20L jugs or 500ml bottle packs straight to your door." },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "254799341904";

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

      <main className="mx-auto max-w-xl px-5 pb-40 pt-6">
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
                <div className="flex items-center justify-between gap-4 px-5 py-5">
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
                  {qty === 0 ? (
                    <button
                      onClick={() => add(item.id)}
                      className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                      style={{ boxShadow: "var(--shadow-soft)" }}
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex shrink-0 items-center gap-3 rounded-full bg-secondary px-2 py-1.5">
                      <button
                        onClick={() => remove(item.id)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-card text-foreground"
                        aria-label="Remove one"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => add(item.id)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"
                        aria-label="Add one"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Free delivery within Nairobi · Order confirmed via WhatsApp
        </p>
      </main>

      {totalCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-5 pt-3">
          <div className="mx-auto max-w-xl">
            <button
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-between gap-4 rounded-full bg-primary px-5 py-4 text-primary-foreground transition active:scale-[0.99]"
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

      {open && <CheckoutModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
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
    if (!name.trim() || !address.trim()) return;

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

        <div className="mb-5 space-y-2 rounded-2xl bg-muted/60 p-4">
          {lines.map((l) => (
            <div
              key={l.it.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate pr-3 text-muted-foreground">
                {l.it.name}{" "}
                <span className="text-foreground">× {l.qty}</span>
              </span>
              <span className="font-medium tabular-nums">
                KES {l.subtotal.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm font-semibold">
            <span>Total</span>
            <span className="tabular-nums">
              KES {total.toLocaleString()}
            </span>
          </div>
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
            className="mt-2 w-full rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            Send order on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

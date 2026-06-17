"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ── types & data imports ── */
import { Product, products, calculatePrice, calculateOldPrice } from "@/lib/products";

/* ── Drawer ── */
function Drawer({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [weight, setWeight] = useState("250g");
  useEffect(() => {
    if (product) setWeight("250g");
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;

  const currentPrice = calculatePrice(product.price, weight);
  const currentOldPrice = calculateOldPrice(product.oldPrice, weight);

  const handleAddToCart = () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cart");
    let items: { id: number; weight: string; quantity: number }[] = [];
    if (stored) {
      try {
        items = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const existing = items.find((item) => item.id === product.id && item.weight === weight);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ id: product.id, weight, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-change"));
    onClose();
    window.dispatchEvent(new Event("open-cart"));
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true">
        <div className="drawer-head">
          <span className="drawer-head-label">Single Origin · {product.origin}</span>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="drawer-img">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="drawer-body">
          <span className="drawer-tag">{product.tag}</span>
          <h2 className="drawer-name">{product.name}</h2>
          <p className="drawer-origin">{product.origin}</p>
          <div className="drawer-price">
            {currentPrice}
            {product.discount && <span className="drawer-price-tag">{product.discount}</span>}
            {currentOldPrice && <span style={{ fontSize:13, color:"var(--text-light)", fontWeight:400, textDecoration:"line-through" }}>{currentOldPrice}</span>}
          </div>
          <p className="drawer-desc">{product.tagline}</p>
          <div className="drawer-specs">
            {[
              { key: "Flavor", val: product.flavor },
              { key: "Nutrition", val: product.nutrition },
              { key: "Harvest", val: product.harvest },
            ].map(({ key, val }) => (
              <div className="drawer-spec-row" key={key}>
                <span className="drawer-spec-key">{key}</span>
                <span className="drawer-spec-val">{val}</span>
              </div>
            ))}
          </div>
          <div className="weight-row">
            {["100g","250g","500g","1kg"].map((w) => (
              <button key={w} className={`weight-btn${weight===w?" active":""}`} onClick={() => setWeight(w)}>{w}</button>
            ))}
          </div>
          <div className="drawer-footer">
            <button className="btn-primary" onClick={handleAddToCart} style={{ width:"100%", justifyContent:"center", gap:8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Add to Cart · {currentPrice} / {weight}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function PCard({ p, onClick }: { p: Product; onClick: () => void }) {
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const checkWished = () => {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        try {
          const ids = JSON.parse(stored) as number[];
          setWished(ids.includes(p.id));
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkWished();
    window.addEventListener("wishlist-change", checkWished);
    return () => window.removeEventListener("wishlist-change", checkWished);
  }, [p.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("wishlist");
    let ids: number[] = [];
    if (stored) {
      try {
        ids = JSON.parse(stored) as number[];
      } catch (err) {
        console.error(err);
      }
    }
    if (ids.includes(p.id)) {
      ids = ids.filter((id) => id !== p.id);
    } else {
      ids.push(p.id);
    }
    localStorage.setItem("wishlist", JSON.stringify(ids));
    window.dispatchEvent(new Event("wishlist-change"));
  };

  return (
    <div className="pcard">
      <div className="pcard-img-wrap">
        <img src={p.img} alt={p.name} />
        <span className="pcard-tag">{p.tag}</span>
        {p.discount && <span className="pcard-badge">{p.discount}</span>}
        <button
          className="pcard-wish"
          aria-label="Wishlist"
          onClick={toggleWishlist}
          style={{ color: wished ? "#c0392b" : undefined, opacity: wished ? 1 : undefined }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button className="pcard-quick" onClick={onClick}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          Quick Add
        </button>
      </div>
      <span className="pcard-origin">{p.origin}</span>
      <h3 className="pcard-name" onClick={onClick}>{p.name}</h3>
      <div className="pcard-price">
        {p.price}
        {p.oldPrice && <span className="pcard-price-old">{p.oldPrice}</span>}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [active, setActive] = useState<Product | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const handleOpenQuickView = (e: Event) => {
      const customEvent = e as CustomEvent<Product>;
      if (customEvent.detail) {
        setActive(customEvent.detail);
      }
    };
    window.addEventListener("open-quick-view", handleOpenQuickView);
    return () => window.removeEventListener("open-quick-view", handleOpenQuickView);
  }, []);

  const categories = ["All", "Almonds", "Pistachios", "Dates", "Walnuts", "Macadamia", "Raisins", "Hazelnuts", "Cashews"];

  const filteredProducts = filter === "All"
    ? products
    : products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="info-page-header" style={{ padding: "120px 40px 60px" }}>
        <span className="info-page-label">Harvest Collection</span>
        <h1 className="info-page-title">The Collection</h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "var(--text-mid)", marginTop: "16px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          Curated single-origin selections, batch-tested and fresh-sealed at the source.
        </p>
      </div>

      <main style={{ flex: 1, padding: "0 40px 100px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", borderBottom: "1px solid var(--border)", paddingBottom: "24px", marginBottom: "48px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? "var(--dark)" : "none",
                color: filter === cat ? "var(--cream)" : "var(--text-mid)",
                border: filter === cat ? "1px solid var(--dark)" : "1px solid var(--border)",
                padding: "8px 16px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid-4">
          {filteredProducts.map((p) => (
            <PCard key={p.id} p={p} onClick={() => setActive(p)} />
          ))}
        </div>
      </main>

      <Footer />
      <Drawer product={active} onClose={() => setActive(null)} />
    </div>
  );
}

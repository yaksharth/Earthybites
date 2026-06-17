"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

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

/* ── Product Card ── */
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

/* ── Scroll observer ── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function Home() {
  const [active, setActive] = useState<Product | null>(null);
  useReveal();

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

  const tickerWords = ["Not Basic","Straight from Farm","Pure &amp; Natural","Hand Selected","Nitrogen Sealed","Lab Certified","Direct Trade","Heritage Sourced"];

  return (
    <div style={{ background: "#faf8f4", minHeight:"100vh" }}>

      {/* ── Ticker bar ── */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[...tickerWords, ...tickerWords].map((t, i) => (
            <span key={i} className="ticker-item">
              {t} <span className="ticker-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <img
          className="hero-img"
          src="/hero.jpg"
          alt="Earthy Bites hero"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-label">2024 Harvest Collection</span>
          <h1 className="hero-title">
            Nature&apos;s<br /><em>Finest</em><br />Harvest.
          </h1>
          <p className="hero-desc">
            Sourced from the world&apos;s most pristine heritage farms and delivered to your table without compromise.
          </p>
          <div className="hero-btns">
            <Link href="/shop" className="btn-dark">Shop Now</Link>
            <Link href="/story" className="btn-outline-white">Our Story</Link>
          </div>
        </div>
      </section>

      {/* ── PROMISES STRIP ── */}
      <div className="promises">
        {[
          { icon: "🌿", title: "Zero Pesticides", desc: "Certified clean farming" },
          { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
          { icon: "🔬", title: "Lab Certified", desc: "Every batch tested" },
          { icon: "♻️", title: "Eco Packaging", desc: "Compostable kraft & glass" },
        ].map((p) => (
          <div className="promise-item" key={p.title}>
            <span className="promise-icon" style={{ fontSize: 22 }}>{p.icon}</span>
            <div className="promise-text">
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── BESTSELLERS ── */}
      <div className="section-wrap">
        <div className="section-head fade-up">
          <h2 className="section-title">Best<span>sellers</span></h2>
          <Link href="/shop" className="view-all">
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="scroll-row">
          {products.slice(0, 6).map(p => (
            <PCard key={p.id} p={p} onClick={() => setActive(p)} />
          ))}
        </div>
      </div>

      {/* ── FEATURED BANNER ── */}
      <div className="feature-banner fade-up">
        <div className="feature-banner-img">
          <img
            src="/products/featured-almonds.png"
            alt="California Almonds"
          />
        </div>
        <div className="feature-banner-body">
          <div className="feature-banner-label">Featured Selection</div>
          <h2 className="feature-banner-title">
            Heritage<br />Almonds.
          </h2>
          <p className="feature-banner-desc">
            From multi-generational orchards at 350 meters elevation. Each kernel dried slowly on the branch, concentrating vital oils and a buttery profile no industrial process can replicate.
          </p>
          <div className="feature-specs">
            {[
              { key: "Origin", val: "Sacramento Valley · 350m" },
              { key: "Notes", val: "Wild honey · almond milk · vanilla" },
              { key: "Harvest", val: "September – November" },
            ].map(({ key, val }) => (
              <div className="feature-spec" key={key}>
                <span className="feature-spec-key">{key}</span>
                <span className="feature-spec-val">{val}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button className="btn-primary" onClick={() => setActive(products[0])}>
              Shop Now — ₹599
            </button>
            <button className="btn-secondary" onClick={() => setActive(products[0])}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* ── NEW HARVESTS ── */}
      <div className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="section-head fade-up">
          <h2 className="section-title">New <span>Harvests</span></h2>
          <Link href="/shop" className="view-all">
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="scroll-row">
          {[...products].reverse().slice(0, 6).map(p => (
            <PCard key={p.id} p={p} onClick={() => setActive(p)} />
          ))}
        </div>
      </div>

      {/* ── DARK SPLIT QUOTE ── */}
      <div className="split-dark fade-up">
        <div className="split-dark-img">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop"
            alt="Farm"
          />
        </div>
        <div className="split-dark-body">
          <span className="split-dark-label">The Earthy Standard</span>
          <h2 className="split-dark-title">
            "The earth does not hurry. Yet everything is accomplished."
          </h2>
          <p className="split-dark-desc">
            Three non-negotiable principles: responsible sourcing from heritage farms, independent purity testing, and nitrogen-sealed packaging. No exceptions.
          </p>
          <Link href="/standard" className="btn-outline-white" style={{ alignSelf:"flex-start", borderColor:"rgba(184,151,90,0.4)", color:"rgba(184,151,90,0.9)" }}>
            Our Standard
          </Link>
        </div>
      </div>

      {/* ── ABOUT ── */}
      <div className="about-strip fade-up">
        <h2 className="about-title">
          Rooted in<br /><span>Nature.</span>
        </h2>
        <div className="about-right">
          <p className="about-desc">
            Earthy Bites began with a single question: what if we could close the gap between the world&apos;s most pristine farms and the mindful modern consumer? Every product is a direct relationship — with the farmer, the soil, the season.
          </p>
          <div className="about-points">
            {["Heritage Farm Partners", "Direct Trade Only", "Zero Intermediaries", "Lab Tested Every Batch"].map(p => (
              <span className="about-point" key={p}>{p}</span>
            ))}
          </div>
          <Link href="/story" className="btn-primary" style={{ alignSelf:"flex-start" }}>
            Read Our Story
          </Link>
        </div>
      </div>

      {/* ── FULL COLLECTION GRID ── */}
      <div className="section-wrap" style={{ background:"#f5f2ec" }}>
        <div className="section-head fade-up">
          <h2 className="section-title">Full <span>Collection</span></h2>
          <Link href="/shop" className="view-all">
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <div className="grid-4">
          {products.map((p, i) => (
            <div key={p.id} className={`fade-up delay-${(i % 4) + 1}`}>
              <PCard p={p} onClick={() => setActive(p)} />
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <Drawer product={active} onClose={() => setActive(null)} />
    </div>
  );
}

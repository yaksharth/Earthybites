"use client";
import { useEffect, useState, useRef } from "react";
import { Product, products } from "@/lib/products";

export default function SearchDrawer({
  isOpen,
  onClose,
  onOpenProduct
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      // Delay focus slightly to allow drawer animation to complete
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.origin.toLowerCase().includes(query.toLowerCase()) ||
          p.tag.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularSearches = ["Almonds", "Pistachios", "Dates", "Cashews"];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} style={{ zIndex: 210 }} />
      <div className="drawer" role="dialog" aria-modal="true" style={{ zIndex: 211 }}>
        <div className="drawer-head" style={{ padding: "24px" }}>
          <div className="search-input-wrap" style={{ position: "relative", width: "100%", marginRight: "16px" }}>
            <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--text-light)", display: "flex" }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search Earthy Bites..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--border)",
                padding: "12px 32px 12px 28px",
                fontSize: "15px",
                fontFamily: "var(--sans)",
                color: "var(--text)",
                outline: "none"
              }}
            />
            {query && (
              <button 
                onClick={() => setQuery("")} 
                style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-light)", padding: "4px", fontSize: "12px" }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close" style={{ padding: "4px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "0 24px 24px" }}>
          {!query.trim() ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "20px" }}>
              <div>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Popular Searches</span>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        padding: "8px 16px",
                        fontSize: "12px",
                        color: "var(--text-mid)",
                        borderRadius: "0",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--dark)";
                        e.currentTarget.style.color = "var(--text)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text-mid)";
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--text-light)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Explore Categories</span>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["Almonds", "Pistachios", "Dates", "Walnuts", "Macadamia", "Raisins", "Hazelnuts", "Cashews"].map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setQuery(cat);
                          inputRef.current?.focus();
                        }}
                        style={{ background: "none", border: "none", padding: 0, fontSize: "14px", fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--text)", textAlign: "left", cursor: "pointer" }}
                      >
                        {cat} Selection
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "40px", textAlign: "center", gap: "8px" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "var(--text-mid)" }}>No results found</p>
              <p style={{ fontSize: "13px", color: "var(--text-light)", maxWidth: "260px" }}>We couldn&apos;t find anything matching &quot;{query}&quot;. Try searching for something else.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", flex: 1, marginTop: "16px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--text-light)", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Search Results ({filtered.length})</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {filtered.map((item) => (
                  <div key={item.id} className="search-result-item" style={{ display: "flex", gap: "16px", padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                    <div style={{ width: "60px", aspectRatio: "3/4", background: "#f0ece4", overflow: "hidden", flexShrink: 0, cursor: "pointer", border: "1px solid var(--border)" }} onClick={() => { onOpenProduct(item); onClose(); }}>
                      <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>{item.tag}</span>
                      <h4 style={{ fontFamily: "var(--sans)", fontSize: "13px", fontWeight: 500, color: "var(--text)", margin: 0, cursor: "pointer" }} onClick={() => { onOpenProduct(item); onClose(); }}>{item.name}</h4>
                      <span style={{ fontSize: "9px", fontWeight: 500, color: "var(--text-light)", letterSpacing: "0.05em" }}>{item.origin}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{item.price}</span>
                      <button 
                        onClick={() => { onOpenProduct(item); onClose(); }}
                        style={{
                          background: "var(--dark)",
                          border: "none",
                          color: "var(--cream)",
                          fontSize: "8px",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "6px 10px",
                          cursor: "pointer"
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

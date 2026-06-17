"use client";
import { useEffect, useState } from "react";
import { Product, products } from "@/lib/products";

export default function WishlistDrawer({
  isOpen,
  onClose,
  onOpenProduct
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
}) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        try {
          const ids = JSON.parse(stored) as number[];
          const filtered = products.filter((p) => ids.includes(p.id));
          setWishlistItems(filtered);
        } catch (e) {
          console.error(e);
        }
      } else {
        setWishlistItems([]);
      }
    };

    loadWishlist();

    window.addEventListener("wishlist-change", loadWishlist);
    return () => {
      window.removeEventListener("wishlist-change", loadWishlist);
    };
  }, [isOpen]);

  const handleRemove = (id: number) => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        const ids = JSON.parse(stored) as number[];
        const updated = ids.filter((itemId) => itemId !== id);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        window.dispatchEvent(new Event("wishlist-change"));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} style={{ zIndex: 210 }} />
      <div className="drawer" role="dialog" aria-modal="true" style={{ zIndex: 211 }}>
        <div className="drawer-head">
          <span className="drawer-head-label">Your Wishlist ({wishlistItems.length})</span>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {wishlistItems.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "40px", textAlign: "center", gap: "16px" }}>
              <span style={{ fontSize: "32px", color: "var(--text-light)" }}>♡</span>
              <p style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "var(--text-mid)" }}>Your wishlist is empty</p>
              <p style={{ fontSize: "13px", color: "var(--text-light)", maxWidth: "260px" }}>Explore our harvest collections and save your favorite selections here.</p>
              <button className="btn-primary" onClick={onClose} style={{ marginTop: "12px" }}>Continue Shopping</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", flex: 1 }}>
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item" style={{ display: "flex", gap: "16px", padding: "16px 24px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
                  <div style={{ width: "70px", aspectRatio: "3/4", background: "#f0ece4", overflow: "hidden", flexShrink: 0, cursor: "pointer", border: "1px solid var(--border)" }} onClick={() => { onOpenProduct(item); onClose(); }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)" }}>{item.origin}</span>
                    <h4 style={{ fontFamily: "var(--sans)", fontSize: "14px", fontWeight: 500, color: "var(--text)", margin: 0, cursor: "pointer" }} onClick={() => { onOpenProduct(item); onClose(); }}>{item.name}</h4>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{item.price}</span>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    style={{ background: "none", border: "none", color: "var(--text-light)", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.2s" }}
                    aria-label="Remove"
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-light)"}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

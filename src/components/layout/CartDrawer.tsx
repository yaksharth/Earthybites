"use client";
import { useEffect, useState } from "react";
import { Product, products, calculatePrice } from "@/lib/products";

type CartItemState = {
  id: number;
  weight: "100g" | "250g" | "500g" | "1kg";
  quantity: number;
};

export default function CartDrawer({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cartItems, setCartItems] = useState<(CartItemState & { product: Product })[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const loadCart = () => {
      if (typeof window === "undefined") return;
      const stored = localStorage.getItem("cart");
      if (stored) {
        try {
          const items = JSON.parse(stored) as CartItemState[];
          const enriched = items
            .map((item) => {
              const p = products.find((prod) => prod.id === item.id);
              if (!p) return null;
              return { ...item, product: p };
            })
            .filter((item): item is CartItemState & { product: Product } => item !== null);
          setCartItems(enriched);
        } catch (e) {
          console.error(e);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCart();
    window.addEventListener("cart-change", loadCart);
    return () => {
      window.removeEventListener("cart-change", loadCart);
    };
  }, [isOpen]);

  const updateQuantity = (id: number, weight: string, delta: number) => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItemState[];
        const updated = items
          .map((item) => {
            if (item.id === id && item.weight === weight) {
              return { ...item, quantity: item.quantity + delta };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cart-change"));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const removeItem = (id: number, weight: string) => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const items = JSON.parse(stored) as CartItemState[];
        const updated = items.filter((item) => !(item.id === id && item.weight === weight));
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cart-change"));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-change"));
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const singlePrice = parseInt(calculatePrice(item.product.price, item.weight).replace(/[^\d]/g, ""), 10);
    return acc + singlePrice * item.quantity;
  }, 0);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} style={{ zIndex: 210 }} />
      <div className="drawer" role="dialog" aria-modal="true" style={{ zIndex: 211 }}>
        <div className="drawer-head">
          <span className="drawer-head-label">Your Shopping Cart</span>
          <button className="drawer-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {checkoutSuccess ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "40px", textAlign: "center", gap: "16px" }}>
            <span style={{ fontSize: "40px", color: "var(--gold)" }}>✓</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "var(--text)" }}>Thank you for your order</h3>
            <p style={{ fontSize: "13px", color: "var(--text-light)", maxWidth: "280px" }}>Your purchase was successful. We are preparing your heritage package with carbon-neutral shipping.</p>
            <button className="btn-primary" onClick={() => { setCheckoutSuccess(false); onClose(); }} style={{ marginTop: "12px" }}>Continue Shopping</button>
          </div>
        ) : cartItems.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "40px", textAlign: "center", gap: "16px" }}>
            <span style={{ fontSize: "32px", color: "var(--text-light)" }}>🛍</span>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "var(--text-mid)" }}>Your cart is empty</p>
            <p style={{ fontSize: "13px", color: "var(--text-light)", maxWidth: "260px" }}>Add items from our premium collections to place an order.</p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: "12px" }}>Browse Shop</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", flex: 1 }}>
              {cartItems.map((item, idx) => {
                const singlePriceStr = calculatePrice(item.product.price, item.weight);
                const singlePriceNum = parseInt(singlePriceStr.replace(/[^\d]/g, ""), 10);
                const itemTotal = singlePriceNum * item.quantity;

                return (
                  <div 
                    key={`${item.id}-${item.weight}-${idx}`} 
                    style={{ display: "flex", gap: "16px", padding: "20px 24px", borderBottom: "1px solid var(--border)", alignItems: "center" }}
                  >
                    <div style={{ width: "65px", aspectRatio: "3/4", background: "#f0ece4", overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)" }}>
                      <img src={item.product.img} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>{item.weight}</span>
                      <h4 style={{ fontFamily: "var(--sans)", fontSize: "14px", fontWeight: 500, color: "var(--text)", margin: 0 }}>{item.product.name}</h4>
                      
                      {/* Quantity Controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.weight, -1)}
                          style={{
                            width: "22px", height: "22px", border: "1px solid var(--border)", background: "none",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--text-mid)", cursor: "pointer"
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: "12px", fontWeight: 600, minWidth: "16px", textAlign: "center" }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.weight, 1)}
                          style={{
                            width: "22px", height: "22px", border: "1px solid var(--border)", background: "none",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--text-mid)", cursor: "pointer"
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>₹{itemTotal}</span>
                      <button 
                        onClick={() => removeItem(item.id, item.weight)}
                        style={{ background: "none", border: "none", color: "var(--text-light)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div style={{ padding: "24px", background: "var(--white)", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-mid)" }}>Subtotal</span>
                <span style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--text)" }}>₹{subtotal}</span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-light)", margin: 0, lineHeight: 1.5 }}>
                Taxes and carbon-neutral packaging included. Shipping calculated at checkout (free on orders above ₹999).
              </p>
              <button 
                onClick={handleCheckout}
                className="btn-primary" 
                style={{ width: "100%", justifyContent: "center", padding: "16px" }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import WishlistDrawer from "./WishlistDrawer";
import SearchDrawer from "./SearchDrawer";
import CartDrawer from "./CartDrawer";
import { Product } from "@/lib/products";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const updateCounts = () => {
      if (typeof window === "undefined") return;

      // Wishlist
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        try {
          const ids = JSON.parse(storedWishlist) as number[];
          setWishlistCount(ids.length);
        } catch (e) {
          console.error(e);
        }
      } else {
        setWishlistCount(0);
      }

      // Cart
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const items = JSON.parse(storedCart) as { quantity: number }[];
          const totalQty = items.reduce((acc, curr) => acc + curr.quantity, 0);
          setCartCount(totalQty);
        } catch (e) {
          console.error(e);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCounts();
    window.addEventListener("wishlist-change", updateCounts);
    window.addEventListener("cart-change", updateCounts);
    
    const handleOpenCart = () => {
      setCartOpen(true);
    };
    window.addEventListener("open-cart", handleOpenCart);

    return () => {
      window.removeEventListener("wishlist-change", updateCounts);
      window.removeEventListener("cart-change", updateCounts);
      window.removeEventListener("open-cart", handleOpenCart);
    };
  }, []);

  const handleOpenProduct = (product: Product) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-quick-view", { detail: product }));
    }
  };

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none" }}>
        <ul className="navbar-left">
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/story">Story</Link></li>
          <li><Link href="/journal">Journal</Link></li>
        </ul>

        <Link href="/" className="navbar-logo-link">
          <img src="/logo.jpg" alt="Earthy Bites" className="navbar-logo-img" />
        </Link>

        <div className="navbar-right">
          {/* Search */}
          <button className="navbar-icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          {/* Wishlist */}
          <button className="navbar-icon" aria-label="Wishlist" onClick={() => setWishlistOpen(true)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && <span className="cart-badge" style={{ background: "#c0392b" }}>{wishlistCount}</span>}
          </button>
          {/* Cart */}
          <button className="navbar-icon" aria-label="Cart" onClick={() => setCartOpen(true)}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </nav>

      <WishlistDrawer 
        isOpen={wishlistOpen} 
        onClose={() => setWishlistOpen(false)} 
        onOpenProduct={handleOpenProduct}
      />

      <SearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenProduct={handleOpenProduct}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}

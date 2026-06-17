"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, ShoppingBag, FolderOpen, Box, Users, Ticket, Star,
  BookOpen, Image, Home, BarChart3, Settings, Shield, Bell, LogOut,
  Search, Menu, X, Keyboard, Sun, Moon, ChevronLeft, ChevronRight
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/admin/products", icon: Box },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Inventory", href: "/admin/inventory", icon: Shield },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Ticket },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Media Library", href: "/admin/media", icon: Image },
  { name: "Homepage Manager", href: "/admin/homepage", icon: Home },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Admins & Roles", href: "/admin/admins", icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [shortcutOpen, setShortcutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  // Zustand Store
  const {
    theme, sidebarOpen, user, toggleTheme, toggleSidebar, logout, login,
    searchQuery, setSearchQuery, setTheme
  } = useAdminStore();

  // Redirect if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const isLoggedIn = !!data.session?.user;

      if (pathname === "/admin/login") {
        if (isLoggedIn) {
          router.push("/admin");
        } else {
          setCheckingAuth(false);
        }
      } else {
        const u = data.session?.user;
        if (!isLoggedIn || !u) {
          router.push("/admin/login");
        } else {
          login(u.email, u.role, u.name);
          setCheckingAuth(false);
        }
      }
    };
    
    // Set theme class on HTML element
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("admin_theme") as "light" | "dark" | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    checkAuth();
  }, [router, login, setTheme, pathname]);

  // Sync theme to local storage
  useEffect(() => {
    localStorage.setItem("admin_theme", theme);
  }, [theme]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    let keysPressed: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "");

      if (e.key === "s" && !isInput) {
        e.preventDefault();
        searchRef.current?.focus();
      }

      if (e.key === "t" && !isInput) {
        e.preventDefault();
        toggleTheme();
      }

      if (e.key === "?" && !isInput) {
        setShortcutOpen(true);
      }

      if (e.key === "Escape") {
        setShortcutOpen(false);
        setProfileOpen(false);
        setAlertsOpen(false);
      }

      // 'g' then key sequence
      if (e.key === "g" && !isInput) {
        keysPressed["g"] = true;
        setTimeout(() => {
          keysPressed["g"] = false;
        }, 800);
      } else if (keysPressed["g"] && !isInput) {
        if (e.key === "d") { router.push("/admin"); }
        if (e.key === "o") { router.push("/admin/orders"); }
        if (e.key === "p") { router.push("/admin/products"); }
        if (e.key === "c") { router.push("/admin/customers"); }
        if (e.key === "s") { router.push("/admin/settings"); }
        if (e.key === "h") { router.push("/admin/homepage"); }
        keysPressed = {};
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, toggleTheme]);

  if (checkingAuth) {
    return (
      <div style={{
        background: "var(--cream)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--sans)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>AUTHENTICATING SESSION...</span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push("/admin/login");
  };

  return (
    <div style={{
      background: "var(--cream)",
      color: "var(--text)",
      minHeight: "100vh",
      display: "flex",
      fontFamily: "var(--sans)"
    }} className="admin-body">
      
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? "260px" : "68px",
        background: "#163020", // Deep Forest Green
        color: "#f6f1e9", // Warm Beige
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(246,241,233,0.1)",
        position: "fixed",
        top: 0, bottom: 0, left: 0,
        zIndex: 100,
        transition: "width 0.25s cubic-bezier(0.16,1,0.3,1)"
      }}>
        {/* Sidebar Header */}
        <div style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          padding: sidebarOpen ? "0 24px" : "0",
          justifyContent: sidebarOpen ? "space-between" : "center",
          borderBottom: "1px solid rgba(246,241,233,0.08)"
        }}>
          {sidebarOpen ? (
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: "32px", height: "32px", filter: "brightness(1.1)", border: "1px solid rgba(250,250,250,0.15)" }} />
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "#ffffff" }}>Earthy Admin</span>
            </Link>
          ) : (
            <img src="/logo.jpg" alt="Logo" style={{ width: "32px", height: "32px", filter: "brightness(1.1)", border: "1px solid rgba(250,250,250,0.15)" }} />
          )}

          {sidebarOpen && (
            <button onClick={toggleSidebar} style={{ background: "none", border: "none", color: "rgba(246,241,233,0.5)", cursor: "pointer", display: "flex" }}>
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#ffffff" : "rgba(246,241,233,0.65)",
                  background: isActive ? "rgba(246,241,233,0.08)" : "transparent",
                  borderLeft: isActive ? "3px solid #d4af7a" : "3px solid transparent", // Soft Gold line
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(246,241,233,0.65)";
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          borderTop: "1px solid rgba(246,241,233,0.08)",
          padding: "16px 8px"
        }}>
          {!sidebarOpen && (
            <button onClick={toggleSidebar} style={{ width: "100%", height: "40px", background: "none", border: "none", color: "rgba(246,241,233,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} />
            </button>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              fontSize: "12px",
              color: "rgba(246,241,233,0.65)",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(246,241,233,0.65)"}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{
        flex: 1,
        paddingLeft: sidebarOpen ? "260px" : "68px",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        transition: "padding-left 0.25s cubic-bezier(0.16,1,0.3,1)"
      }}>
        
        {/* HEADER */}
        <header style={{
          height: "72px",
          background: "#ffffff",
          borderBottom: "1px solid #e8e2d9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 90
        }} className="admin-header">
          {/* Header Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "40%", maxWidth: "360px", position: "relative" }}>
            <span style={{ color: "var(--text-light)", display: "flex" }}><Search size={16} /></span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search orders, products, logs... (Press 'S' to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "none",
                fontSize: "13px",
                width: "100%",
                outline: "none",
                color: "var(--text)"
              }}
            />
          </div>

          {/* Header Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{ background: "none", border: "none", color: "var(--text-mid)", cursor: "pointer", display: "flex", padding: "4px" }}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Keyboard Shortcuts Help Button */}
            <button
              onClick={() => setShortcutOpen(true)}
              style={{ background: "none", border: "none", color: "var(--text-mid)", cursor: "pointer", display: "flex", padding: "4px" }}
              aria-label="Keyboard shortcuts"
            >
              <Keyboard size={18} />
            </button>

            {/* Notifications Panel Trigger */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setAlertsOpen(!alertsOpen)}
                style={{ background: "none", border: "none", color: "var(--text-mid)", cursor: "pointer", display: "flex", padding: "4px", position: "relative" }}
              >
                <Bell size={18} />
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  width: "12px", height: "12px", background: "#c0392b",
                  borderRadius: "50%", color: "#ffffff", fontSize: "7px", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  3
                </span>
              </button>

              {alertsOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "36px",
                  background: "#ffffff", border: "1px solid #e8e2d9",
                  width: "280px", boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                  display: "flex", flexDirection: "column"
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #e8e2d9", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Operational Alerts</span>
                    <Link href="/admin/notifications" onClick={() => setAlertsOpen(false)} style={{ fontSize: "9px", color: "var(--gold)", fontWeight: 600 }}>View All</Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", maxHeight: "240px", overflowY: "auto" }}>
                    {[
                      { msg: "California Almonds stock is low (12 left)", time: "25 min ago", level: "critical" },
                      { msg: "New order #1005 received (₹649)", time: "1 hour ago", level: "info" },
                      { msg: "Spam comment flagged on Ajwa review", time: "3 hours ago", level: "warning" },
                    ].map((alert, idx) => (
                      <div key={idx} style={{ padding: "12px 16px", borderBottom: "1px solid #e8e2d9", fontSize: "12px" }}>
                        <p style={{ color: "var(--text)", margin: "0 0 4px" }}>{alert.msg}</p>
                        <span style={{ fontSize: "9px", color: "var(--text-light)" }}>{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Popover */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "8px"
                }}
              >
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "#163020", color: "#faf8f4", fontWeight: 700, fontSize: "11px",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  EA
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-mid)" }}>{user?.name || "Admin"}</span>
              </button>

              {profileOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "36px",
                  background: "#ffffff", border: "1px solid #e8e2d9",
                  width: "200px", boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                  display: "flex", flexDirection: "column"
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #e8e2d9" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>{user?.name || "Earthy Admin"}</p>
                    <p style={{ margin: 0, fontSize: "10px", color: "var(--text-light)" }}>{user?.email || "admin@earthybites.com"}</p>
                    <span style={{ display: "inline-block", padding: "2px 6px", background: "var(--cream)", color: "var(--gold)", fontSize: "9px", fontWeight: 700, marginTop: "6px" }}>
                      {user?.role || "SUPER_ADMIN"}
                    </span>
                  </div>
                  <Link href="/admin/settings" onClick={() => setProfileOpen(false)} style={{ padding: "10px 16px", fontSize: "12px", color: "var(--text-mid)" }}>Brand Settings</Link>
                  <Link href="/admin/admins" onClick={() => setProfileOpen(false)} style={{ padding: "10px 16px", fontSize: "12px", color: "var(--text-mid)" }}>Roles & Permissions</Link>
                  <button onClick={handleLogout} style={{ border: "none", borderTop: "1px solid #e8e2d9", background: "none", padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "#c0392b", cursor: "pointer", fontWeight: 600 }}>
                    Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      {/* KEYBOARD SHORTCUTS MODAL */}
      {shortcutOpen && (
        <>
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1100, cursor: "pointer"
          }} onClick={() => setShortcutOpen(false)} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "#ffffff", border: "1px solid #e8e2d9", width: "90%", maxWidth: "480px",
            zIndex: 1101, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e8e2d9" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Keyboard Commands</span>
              <button onClick={() => setShortcutOpen(false)} style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", display: "flex" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", display: "block", marginBottom: "12px" }}>Global Commands</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { cmd: "S", desc: "Focus top search input" },
                    { cmd: "T", desc: "Toggle Light & Dark theme" },
                    { cmd: "?", desc: "Open this keyboard helper" },
                    { cmd: "Esc", desc: "Dismiss drawers or modals" }
                  ].map((sc) => (
                    <div key={sc.cmd} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "var(--text-mid)" }}>{sc.desc}</span>
                      <kbd style={{ background: "var(--cream)", border: "1px solid var(--border)", padding: "2px 8px", fontSize: "11px", fontWeight: 700, borderRadius: "2px" }}>{sc.cmd}</kbd>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ borderTop: "1px solid #e8e2d9", paddingTop: "20px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)", display: "block", marginBottom: "12px" }}>Navigation Sequences</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { cmd: "g then d", desc: "Go to Operations Dashboard" },
                    { cmd: "g then o", desc: "Go to Orders Queue" },
                    { cmd: "g then p", desc: "Go to Products Manager" },
                    { cmd: "g then c", desc: "Go to Customer Profiles" },
                    { cmd: "g then s", desc: "Go to Settings Panel" },
                    { cmd: "g then h", desc: "Go to Homepage Manager" }
                  ].map((sc) => (
                    <div key={sc.cmd} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", color: "var(--text-mid)" }}>{sc.desc}</span>
                      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        {sc.cmd.split(" ").map((k, idx) => (
                          k === "then" ? (
                            <span key={idx} style={{ fontSize: "11px", color: "var(--text-light)" }}>then</span>
                          ) : (
                            <kbd key={idx} style={{ background: "var(--cream)", border: "1px solid var(--border)", padding: "2px 8px", fontSize: "11px", fontWeight: 700, borderRadius: "2px" }}>{k}</kbd>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

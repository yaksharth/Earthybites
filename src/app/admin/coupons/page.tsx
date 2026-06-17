"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Ticket, Calendar, Ban, CheckCircle, Percent, ShieldAlert } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const [formFields, setFormFields] = useState({
    code: "",
    type: "PERCENTAGE",
    value: 10,
    minOrder: 999,
    expiry: "2026-12-31",
    limit: 100,
    usageCount: 0,
    status: "ACTIVE"
  });

  const loadCoupons = async () => {
    setLoading(true);
    const { data } = await supabase.from("coupons").select("*");
    if (data) setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();

    const handleDataChange = () => {
      loadCoupons();
    };
    window.addEventListener("db_coupons_changed", handleDataChange);
    return () => window.removeEventListener("db_coupons_changed", handleDataChange);
  }, []);

  const handleOpenForm = (coup: any | null = null) => {
    if (coup) {
      setEditingCoupon(coup);
      setFormFields({
        code: coup.code,
        type: coup.type,
        value: coup.value,
        minOrder: coup.minOrder,
        expiry: coup.expiry,
        limit: coup.limit,
        usageCount: coup.usageCount,
        status: coup.status
      });
    } else {
      setEditingCoupon(null);
      setFormFields({
        code: "",
        type: "PERCENTAGE",
        value: 10,
        minOrder: 999,
        expiry: "2026-12-31",
        limit: 100,
        usageCount: 0,
        status: "ACTIVE"
      });
    }
    setFormOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const row = {
      ...formFields,
      code: formFields.code.toUpperCase().replace(/\s+/g, "")
    };

    if (editingCoupon) {
      await supabase.from("coupons").update(row).eq("id", editingCoupon.id);
    } else {
      await supabase.from("coupons").insert(row);
    }
    setFormOpen(false);
  };

  const handleToggleStatus = async (coup: any) => {
    const nextStatus = coup.status === "ACTIVE" ? "EXPIRED" : "ACTIVE";
    await supabase.from("coupons").update({ status: nextStatus }).eq("id", coup.id);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "EB-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormFields(prev => ({ ...prev, code }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Discount Coupons</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Create percentage rates, cash offsets, or BOGO discount codes.</p>
        </div>
        <button onClick={() => handleOpenForm(null)} className="btn-primary" style={{ gap: "8px" }}>
          <Plus size={14} /> Add Coupon
        </button>
      </div>

      {/* Grid of Coupons */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px"
      }}>
        {loading ? (
          <div style={{ padding: "40px", gridColumn: "1/-1", textAlign: "center", color: "var(--text-light)" }}>Loading coupons list...</div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: "40px", gridColumn: "1/-1", textAlign: "center", color: "var(--text-light)" }}>No discount codes created.</div>
        ) : (
          coupons.map(coup => (
            <div key={coup.id} style={{
              background: "var(--white)", border: "1px solid var(--border)", padding: "24px",
              display: "flex", flexDirection: "column", gap: "16px", position: "relative",
              boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Ticket size={18} style={{ color: "var(--gold)" }} />
                  <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text)" }}>{coup.code}</span>
                </div>
                <span style={{
                  display: "inline-block", padding: "2px 8px", fontSize: "9px", fontWeight: 700,
                  background: coup.status === "ACTIVE" ? "#ebf7ee" : "#fcf3f2",
                  color: coup.status === "ACTIVE" ? "#27ae60" : "#c0392b"
                }}>
                  {coup.status}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)" }}>Offer Value</span>
                  <span style={{ fontWeight: 600 }}>
                    {coup.type === "PERCENTAGE" ? `${coup.value}% Off` :
                     coup.type === "FIXED" ? `₹${coup.value} Off` :
                     coup.type === "FREE_SHIPPING" ? "Free Shipping" : "Buy 1 Get 1"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)" }}>Min Order Required</span>
                  <span style={{ fontWeight: 600 }}>₹{coup.minOrder}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)" }}>Usage Redemptions</span>
                  <span style={{ fontWeight: 600 }}>{coup.usageCount} / {coup.limit} times</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-light)" }}>Expiry Date</span>
                  <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={10} /> {coup.expiry}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                <button onClick={() => handleOpenForm(coup)} style={{
                  flex: 1, background: "none", border: "1px solid var(--border)", color: "var(--text-mid)",
                  padding: "8px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer"
                }} onMouseEnter={e => e.currentTarget.style.borderColor="var(--text)"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                  Edit Rules
                </button>
                <button onClick={() => handleToggleStatus(coup)} style={{
                  flex: 1, background: "none", border: "1px solid " + (coup.status === "ACTIVE" ? "#f5c2c2" : "#e8e2d9"),
                  color: coup.status === "ACTIVE" ? "#c0392b" : "var(--text-mid)",
                  padding: "8px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer"
                }}>
                  {coup.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATION FORM DRAWER */}
      {formOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setFormOpen(false)} style={{ zIndex: 200 }} />
          <div className="drawer" role="dialog" aria-modal="true" style={{ zIndex: 201 }}>
            <div className="drawer-head">
              <span className="drawer-head-label">{editingCoupon ? "Edit Coupon Specifications" : "Create New Coupon"}</span>
              <button className="drawer-close" onClick={() => setFormOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveCoupon} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Coupon Promo Code</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MONSOON20"
                    value={formFields.code}
                    onChange={(e) => setFormFields({ ...formFields, code: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", flex: 1, color: "var(--text)" }}
                  />
                  {!editingCoupon && (
                    <button type="button" onClick={generateCode} style={{
                      background: "none", border: "1px solid var(--border)", color: "var(--gold)", padding: "10px 16px",
                      fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer"
                    }}>
                      Generate
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Discount Type</label>
                  <select
                    value={formFields.type}
                    onChange={(e) => setFormFields({ ...formFields, type: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  >
                    <option value="PERCENTAGE">Percentage rate (%)</option>
                    <option value="FIXED">Fixed cash offset (₹)</option>
                    <option value="FREE_SHIPPING">Free shipping</option>
                    <option value="BOGO">Buy One Get One (BOGO)</option>
                  </select>
                </div>
                
                {formFields.type !== "FREE_SHIPPING" && formFields.type !== "BOGO" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Discount Value</label>
                    <input
                      type="number"
                      required
                      value={formFields.value}
                      onChange={(e) => setFormFields({ ...formFields, value: parseInt(e.target.value, 10) || 0 })}
                      style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Min Purchase (₹)</label>
                  <input
                    type="number"
                    required
                    value={formFields.minOrder}
                    onChange={(e) => setFormFields({ ...formFields, minOrder: parseInt(e.target.value, 10) || 0 })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Usage Limit</label>
                  <input
                    type="number"
                    required
                    value={formFields.limit}
                    onChange={(e) => setFormFields({ ...formFields, limit: parseInt(e.target.value, 10) || 0 })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY-MM-DD"
                    value={formFields.expiry}
                    onChange={(e) => setFormFields({ ...formFields, expiry: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Status</label>
                  <select
                    value={formFields.status}
                    onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "12px" }}>
                Save Coupon Rule
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
import { X } from "lucide-react";

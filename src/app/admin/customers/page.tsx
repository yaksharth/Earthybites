"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Edit2, ShieldAlert, Award, FileText, Calendar, X } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit details
  const [detailCustomer, setDetailCustomer] = useState<any | null>(null);
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("ACTIVE");
  const [notes, setNotes] = useState("");

  const loadCustomers = async () => {
    setLoading(true);
    const { data } = await supabase.from("customers").select("*");
    if (data) setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();

    const handleDataChange = () => {
      loadCustomers();
    };
    window.addEventListener("db_customers_changed", handleDataChange);
    return () => window.removeEventListener("db_customers_changed", handleDataChange);
  }, []);

  const handleOpenDetails = (cust: any) => {
    setDetailCustomer(cust);
    setPoints(cust.loyaltyPoints || 0);
    setStatus(cust.status || "ACTIVE");
    setNotes(cust.notes || "");
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailCustomer) return;

    await supabase.from("customers").update({
      loyaltyPoints: points,
      status: status,
      notes: notes
    }).eq("id", detailCustomer.id);

    setDetailCustomer(null);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Customer Profiles</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Analyze customer loyalty tiers, modify loyalty points, and review wishlists.</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px",
        display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "320px"
      }}>
        <Search size={16} style={{ color: "var(--text-light)" }} />
        <input
          type="text"
          placeholder="Search customers by name/email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: "none", outline: "none", fontSize: "13px", width: "100%", color: "var(--text)" }}
        />
      </div>

      {/* TABLE */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "var(--text-light)" }}>Loading customer profiles...</div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "var(--text-light)" }}>No customers found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 24px" }}>Customer Name</th>
                <th style={{ padding: "16px 8px" }}>Email</th>
                <th style={{ padding: "16px 8px" }}>Total Orders</th>
                <th style={{ padding: "16px 8px" }}>Loyalty Points</th>
                <th style={{ padding: "16px 8px" }}>Wishlist History</th>
                <th style={{ padding: "16px 8px" }}>Spend Level</th>
                <th style={{ padding: "16px 8px" }}>Account Status</th>
                <th style={{ padding: "16px 24px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[#faf8f4]">
                  <td style={{ padding: "16px 24px", fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: "16px 8px" }}>{c.email}</td>
                  <td style={{ padding: "16px 8px", fontWeight: 500 }}>{c.ordersCount} orders</td>
                  <td style={{ padding: "16px 8px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600, color: "var(--gold)" }}>
                      <Award size={12} /> {c.loyaltyPoints || 0} pts
                    </span>
                  </td>
                  <td style={{ padding: "16px 8px", color: "var(--text-mid)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.wishlist || "None"}
                  </td>
                  <td style={{ padding: "16px 8px", fontWeight: 600, color: "#163020" }}>{c.spent}</td>
                  <td style={{ padding: "16px 8px" }}>
                    <span style={{
                      display: "inline-block", padding: "2px 6px", fontSize: "9px", fontWeight: 700,
                      background: c.status === "ACTIVE" ? "#ebf7ee" : "#fcf3f2",
                      color: c.status === "ACTIVE" ? "#27ae60" : "#c0392b"
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <button onClick={() => handleOpenDetails(c)} style={{
                      background: "none", border: "1px solid var(--border)", color: "var(--text)",
                      padding: "4px 8px", fontSize: "11px", fontWeight: 600, cursor: "pointer"
                    }} onMouseEnter={e => e.currentTarget.style.borderColor="var(--text)"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                      Manage Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CRM MANAGE DRAWER */}
      {detailCustomer && (
        <>
          <div className="drawer-overlay" onClick={() => setDetailCustomer(null)} style={{ zIndex: 200 }} />
          <div className="drawer" role="dialog" aria-modal="true" style={{ zIndex: 201 }}>
            <div className="drawer-head">
              <span className="drawer-head-label">CRM Profile · {detailCustomer.name}</span>
              <button className="drawer-close" onClick={() => setDetailCustomer(null)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveCustomer} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto" }}>
              <div style={{ padding: "16px", background: "var(--cream)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-light)" }}>Email Account</span>
                  <span style={{ fontWeight: 600 }}>{detailCustomer.email}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-light)" }}>Cumulative Spending</span>
                  <span style={{ fontWeight: 600 }}>{detailCustomer.spent}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-light)" }}>Wishlist History</span>
                  <span style={{ fontWeight: 600 }}>{detailCustomer.wishlist || "None"}</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Loyalty Points</label>
                  <input
                    type="number"
                    required
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value, 10) || 0)}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Account Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Customer Notes / Flagged Incidents</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. VIP client, requests eco-friendly packaging only"
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", minHeight: "100px", resize: "vertical", fontFamily: "var(--sans)", color: "var(--text)" }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "12px" }}>
                Save CRM Modifications
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  );
}


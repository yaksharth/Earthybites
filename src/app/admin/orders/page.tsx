"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Search, Eye, Printer, Mail, Send, X, Clipboard, DollarSign, Calendar
} from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Drawer / Details state
  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const [trackingNo, setTrackingNo] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [payStatus, setPayStatus] = useState("");
  const [notes, setNotes] = useState("");

  // Print Invoice Modal state
  const [printOrder, setPrintOrder] = useState<any | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("date", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    const handleDataChange = () => {
      loadOrders();
    };
    window.addEventListener("db_orders_changed", handleDataChange);
    return () => window.removeEventListener("db_orders_changed", handleDataChange);
  }, []);

  const handleOpenDetails = (ord: any) => {
    setDetailOrder(ord);
    setTrackingNo(ord.trackingNumber || "");
    setOrderStatus(ord.status || "PENDING");
    setPayStatus(ord.paymentStatus || "UNPAID");
    setNotes(ord.notes || "");
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailOrder) return;
    
    await supabase.from("orders").update({
      status: orderStatus,
      trackingNumber: trackingNo,
      paymentStatus: payStatus,
      notes: notes
    }).eq("id", detailOrder.id);

    setDetailOrder(null);
  };

  const handleSendNotification = () => {
    alert(`Shipping update notification email sent to ${detailOrder.email}!`);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          o.id.toString().includes(search) ||
                          o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["ALL", "PENDING", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Orders Queue</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Process payments, log tracking coordinates, and print packing lists.</p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px"
      }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "300px" }}>
          <Search size={16} style={{ color: "var(--text-light)" }} />
          <input
            type="text"
            placeholder="Search by ID, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: "13px", width: "100%", color: "var(--text)" }}
          />
        </div>

        {/* Tab filters */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? "var(--dark)" : "none",
                color: statusFilter === st ? "#ffffff" : "var(--text-mid)",
                border: "1px solid " + (statusFilter === st ? "var(--dark)" : "var(--border)"),
                padding: "6px 12px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                cursor: "pointer"
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "var(--text-light)" }}>Loading orders ledger...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "var(--text-light)" }}>No orders match filters.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 24px" }}>Order ID</th>
                <th style={{ padding: "16px 8px" }}>Date</th>
                <th style={{ padding: "16px 8px" }}>Customer Details</th>
                <th style={{ padding: "16px 8px" }}>Items</th>
                <th style={{ padding: "16px 8px" }}>Total Amount</th>
                <th style={{ padding: "16px 8px" }}>Payment</th>
                <th style={{ padding: "16px 8px" }}>Fulfillment</th>
                <th style={{ padding: "16px 24px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[#faf8f4]">
                  <td style={{ padding: "16px 24px", fontWeight: 600 }}>#{o.id}</td>
                  <td style={{ padding: "16px 8px", color: "var(--text-mid)" }}>{new Date(o.date).toLocaleDateString()}</td>
                  <td style={{ padding: "16px 8px" }}>
                    <div style={{ fontWeight: 500 }}>{o.customerName}</div>
                    <span style={{ fontSize: "10px", color: "var(--text-light)" }}>{o.email}</span>
                  </td>
                  <td style={{ padding: "16px 8px", color: "var(--text-mid)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {o.items}
                  </td>
                  <td style={{ padding: "16px 8px", fontWeight: 600 }}>{o.total}</td>
                  <td style={{ padding: "16px 8px" }}>
                    <span style={{
                      display: "inline-block", padding: "2px 6px", fontSize: "9px", fontWeight: 700,
                      background: o.paymentStatus === "PAID" ? "#ebf7ee" : o.paymentStatus === "REFUNDED" ? "#f0f0f0" : "#fcf3f2",
                      color: o.paymentStatus === "PAID" ? "#27ae60" : o.paymentStatus === "REFUNDED" ? "#7f8c8d" : "#c0392b"
                    }}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "16px 8px" }}>
                    <span style={{
                      display: "inline-block", padding: "2px 6px", fontSize: "9px", fontWeight: 700,
                      background: o.status === "DELIVERED" ? "#ebf7ee" : o.status === "CANCELLED" ? "#fcf3f2" : "#fef8eb",
                      color: o.status === "DELIVERED" ? "#27ae60" : o.status === "CANCELLED" ? "#c0392b" : "#f39c12"
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button onClick={() => handleOpenDetails(o)} title="Manage" style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--text)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-light)"}><Eye size={14} /></button>
                      <button onClick={() => setPrintOrder(o)} title="Print Invoice" style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--text)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-light)"}><Printer size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DETAIL VIEW / UPDATE DRAWER */}
      {detailOrder && (
        <>
          <div className="drawer-overlay" onClick={() => setDetailOrder(null)} style={{ zIndex: 200 }} />
          <div className="drawer" role="dialog" aria-modal="true" style={{ width: "min(500px, 100vw)", zIndex: 201 }}>
            <div className="drawer-head">
              <span className="drawer-head-label">Order Details · #{detailOrder.id}</span>
              <button className="drawer-close" onClick={() => setDetailOrder(null)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateOrder} style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px", overflowY: "auto", gap: "24px" }}>
              
              {/* Order summary info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "var(--cream)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Customer Name</span>
                  <span style={{ fontWeight: 600 }}>{detailOrder.customerName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Email Address</span>
                  <span style={{ fontWeight: 600 }}>{detailOrder.email}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Date Logged</span>
                  <span style={{ fontWeight: 600 }}>{new Date(detailOrder.date).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-light)", fontWeight: 500 }}>Items Ordered</span>
                  <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "200px" }}>{detailOrder.items}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderTop: "1px solid var(--border)", paddingTop: "8px", marginTop: "4px" }}>
                  <span style={{ color: "var(--text)", fontWeight: 700 }}>Total Charge</span>
                  <span style={{ fontWeight: 700, color: "var(--gold)" }}>{detailOrder.total}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)" }}>Shipping Destination</span>
                <p style={{ fontSize: "13px", color: "var(--text-mid)", border: "1px solid var(--border)", padding: "12px", background: "#ffffff", lineHeight: 1.6 }}>
                  {detailOrder.shippingAddress}
                </p>
              </div>

              {/* Status Updates */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Fulfillment Status</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="PACKED">PACKED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Payment Status</label>
                  <select
                    value={payStatus}
                    onChange={(e) => setPayStatus(e.target.value)}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>

              {/* Tracking Coordinates */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Tracking Code</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="e.g. EB-TRK-89021"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", flex: 1, color: "var(--text)" }}
                  />
                  {trackingNo && (
                    <button type="button" onClick={handleSendNotification} style={{
                      background: "none", border: "1px solid var(--border)", color: "var(--gold)", padding: "10px",
                      display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600
                    }}>
                      <Send size={12} /> Notify User
                    </button>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Internal Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", minHeight: "80px", resize: "vertical", fontFamily: "var(--sans)", color: "var(--text)" }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "12px" }}>
                Save Order Settings
              </button>

            </form>
          </div>
        </>
      )}

      {/* PRINT INVOICE MODAL */}
      {printOrder && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000 }} onClick={() => setPrintOrder(null)} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "#ffffff", padding: "40px", width: "90%", maxWidth: "600px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)", zIndex: 1001, display: "flex", flexDirection: "column", gap: "32px"
          }}>
            {/* Header info */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #163020", paddingBottom: "20px" }}>
              <div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", color: "#163020", margin: 0 }}>Earthy Bites</h2>
                <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Heritage Sourced Botanicals</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <h3 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 600 }}>INVOICE</h3>
                <span style={{ fontSize: "11px", color: "var(--text-light)" }}>Order #{printOrder.id}</span>
              </div>
            </div>

            {/* Billing addresses */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "12px" }}>
              <div>
                <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Billed To</span>
                <div style={{ fontWeight: 600, color: "var(--text)" }}>{printOrder.customerName}</div>
                <div style={{ color: "var(--text-mid)" }}>{printOrder.email}</div>
                <div style={{ color: "var(--text-light)", marginTop: "4px", lineHeight: 1.4 }}>{printOrder.shippingAddress}</div>
              </div>
              <div>
                <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Fulfillment Logs</span>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Invoice Date</span>
                  <span style={{ fontWeight: 600 }}>{new Date(printOrder.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Fulfillment</span>
                  <span style={{ fontWeight: 600 }}>{printOrder.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tracking Code</span>
                  <span style={{ fontWeight: 600 }}>{printOrder.trackingNumber || "PENDING"}</span>
                </div>
              </div>
            </div>

            {/* Line items table */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Line Items Breakdown</span>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <th style={{ padding: "8px 0" }}>Description</th>
                    <th style={{ padding: "8px 0", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 0" }}>
                      <div style={{ fontWeight: 600 }}>{printOrder.items}</div>
                      <span style={{ fontSize: "10px", color: "var(--text-light)" }}>Premium single-origin selections</span>
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 600 }}>{printOrder.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Block */}
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "2px solid var(--border)", paddingTop: "20px" }}>
              <div style={{ width: "220px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tax & Duties</span>
                  <span>Included</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "8px", fontSize: "14px", fontWeight: 700 }}>
                  <span>Grand Total</span>
                  <span style={{ color: "#163020" }}>{printOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
              <button onClick={() => setPrintOrder(null)} style={{
                background: "none", border: "1px solid var(--border)", color: "var(--text-mid)",
                padding: "10px 20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer"
              }}>
                Cancel
              </button>
              <button onClick={() => { window.print(); }} className="btn-primary" style={{ padding: "10px 24px", gap: "8px" }}>
                <Printer size={14} /> Send to Printer
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

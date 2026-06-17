"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Plus, Minus, AlertTriangle, ListFilter, RotateCcw } from "lucide-react";

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [stockLogs, setStockLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [adjustQty, setAdjustQty] = useState(10);
  const [warehouse, setWarehouse] = useState("Mumbai-Central");
  const [reason, setReason] = useState("Restock Delivery");

  const loadInventory = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);

    // Initial seed logs
    setStockLogs([
      { date: "2026-06-17 14:02", productName: "California Almonds", sku: "CAL-AL-1", change: "+100", reason: "Restock Delivery", warehouse: "Mumbai-Central" },
      { date: "2026-06-17 11:20", productName: "Mamra Almonds", sku: "MAM-AL-9", change: "-1", reason: "Order #1004 Sale", warehouse: "Mumbai-Central" },
      { date: "2026-06-16 16:10", productName: "Medjool Dates", sku: "MED-DA-3", change: "+50", reason: "Incoming Freight", warehouse: "Delhi-Okhla" },
      { date: "2026-06-16 14:32", productName: "California Almonds", sku: "CAL-AL-1", change: "-2", reason: "Order #1002 Sale", warehouse: "Mumbai-Central" },
      { date: "2026-06-16 10:14", productName: "Mamra Almonds", sku: "MAM-AL-9", change: "-1", reason: "Order #1001 Sale", warehouse: "Mumbai-Central" }
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const currentStock = selectedProduct.stock;
    const finalStock = currentStock + adjustQty;

    await supabase.from("products").update({
      stock: finalStock
    }).eq("id", selectedProduct.id);

    // Log the change
    const newLog = {
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      change: adjustQty >= 0 ? `+${adjustQty}` : `${adjustQty}`,
      reason,
      warehouse
    };

    setStockLogs(prev => [newLog, ...prev]);
    setAdjustOpen(false);
    
    // Refresh products
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
  };

  const criticalProducts = products.filter(p => p.stock <= 15);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Inventory Hub</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Review stock logs, check warehouse distribution, and log restocks.</p>
        </div>
      </div>

      {/* ALERT STRIPS FOR CRITICAL STOCK */}
      {criticalProducts.length > 0 && (
        <div style={{
          background: "#fcf3f2", border: "1px solid #f5c2c2", color: "#c0392b",
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: "8px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "14px" }}>
            <AlertTriangle size={16} /> Low Stock Notification ({criticalProducts.length} Items Affected)
          </div>
          <p style={{ fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
            The following items are running below safe reserve margins (15 units) and could go out of stock soon:
            <strong> {criticalProducts.map(p => p.name).join(", ")}</strong>.
          </p>
        </div>
      )}

      {/* INVENTORY SPLIT LAYOUT (LEDGER + LOGS) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr",
        gap: "24px"
      }}>
        {/* Ledger Table */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Stock Tracker</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text)", margin: 0 }}>Warehouse Ledger</h3>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 8px" }}>Product</th>
                <th style={{ padding: "12px 8px" }}>SKU</th>
                <th style={{ padding: "12px 8px" }}>Current Stock</th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[#faf8f4]">
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: "12px 8px", color: "var(--text-light)" }}>{p.sku}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{
                      fontWeight: 600,
                      color: p.stock <= 15 ? "#c0392b" : "var(--text)"
                    }}>{p.stock}</span>
                    {p.stock <= 15 && <span style={{ fontSize: "8px", fontWeight: 700, color: "#c0392b", marginLeft: "6px" }}>CRITICAL</span>}
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>
                    <button onClick={() => { setSelectedProduct(p); setAdjustOpen(true); }} style={{
                      background: "none", border: "1px solid var(--border)", color: "var(--text)",
                      padding: "4px 8px", fontSize: "11px", fontWeight: 600, cursor: "pointer"
                    }} onMouseEnter={e => e.currentTarget.style.borderColor="var(--text)"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Change Log Feed */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Audit Trail</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text)", margin: 0 }}>Stock Adjustments</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {stockLogs.map((log, idx) => (
              <div key={idx} style={{
                paddingBottom: "16px", borderBottom: "1px solid var(--border)", fontSize: "12px",
                display: "flex", flexDirection: "column", gap: "4px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{log.productName}</span>
                  <span style={{
                    fontSize: "11px", fontWeight: 700,
                    color: log.change.startsWith("+") ? "#27ae60" : "#c0392b"
                  }}>{log.change}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-light)", fontSize: "10px" }}>
                  <span>{log.reason} · {log.warehouse}</span>
                  <span>{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ADJUST QUANTITY DRAWER */}
      {adjustOpen && selectedProduct && (
        <>
          <div className="drawer-overlay" onClick={() => setAdjustOpen(false)} style={{ zIndex: 200 }} />
          <div className="drawer" role="dialog" aria-modal="true" style={{ zIndex: 201 }}>
            <div className="drawer-head">
              <span className="drawer-head-label">Stock Adjust · {selectedProduct.name}</span>
              <button className="drawer-close" onClick={() => setAdjustOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAdjustStock} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>Current Stock Level</span>
                <span style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text)" }}>{selectedProduct.stock} units</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Adjustment Amount (Positive for restock, negative for deduction)</label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Warehouse Allocation</label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                >
                  <option value="Mumbai-Central">Mumbai-Central Warehouse</option>
                  <option value="Delhi-Okhla">Delhi-Okhla Depot</option>
                  <option value="Bengaluru-Whitefield">Bengaluru-Whitefield Hub</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Reason for Log</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Inbound shipment, damages check"
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "12px" }}>
                Confirm Stock Adjustment
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
import { X } from "lucide-react";

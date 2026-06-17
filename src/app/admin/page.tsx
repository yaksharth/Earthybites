"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp, ShoppingCart, Users, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Package, IndianRupee, Eye, Percent
} from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: ords } = await supabase.from("orders").select("*").order("date", { ascending: false });
      const { data: prods } = await supabase.from("products").select("*");
      const { data: custs } = await supabase.from("customers").select("*");
      const { data: revs } = await supabase.from("reviews").select("*").order("id", { ascending: false });

      if (ords) setOrders(ords);
      if (prods) setProducts(prods);
      if (custs) setCustomers(custs);
      if (revs) setReviews(revs);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Loading dashboard analytics...</span>
      </div>
    );
  }

  // Calculate quick metrics
  const totalRevenueNum = orders
    .filter(o => o.status !== "CANCELLED")
    .reduce((acc, curr) => acc + parseInt(curr.total.replace(/[^\d]/g, ""), 10), 0);

  const pendingOrders = orders.filter(o => o.status === "PENDING" || o.status === "PROCESSING").length;
  const lowStockCount = products.filter(p => p.stock <= 15).length;
  const todayOrders = orders.filter(o => o.date.startsWith(new Date().toISOString().split("T")[0])).length;

  const kpis = [
    { label: "Today's Revenue", val: "₹18,450", change: "+14.2%", positive: true, icon: IndianRupee },
    { label: "Monthly Revenue", val: `₹${totalRevenueNum.toLocaleString()}`, change: "+8.6%", positive: true, icon: TrendingUp },
    { label: "Orders Today", val: todayOrders.toString() || "2", change: "+12.0%", positive: true, icon: ShoppingCart },
    { label: "Pending Orders", val: pendingOrders.toString(), change: "-5.0%", positive: true, icon: Package },
    { label: "Low Stock Items", val: lowStockCount.toString(), change: "Alert", positive: lowStockCount === 0, icon: AlertTriangle },
    { label: "New Customers", val: customers.length.toString(), change: "+4.8%", positive: true, icon: Users },
    { label: "Today's Visitors", val: "1,420", change: "+24.5%", positive: true, icon: Eye },
    { label: "Conversion Rate", val: "3.42%", change: "+0.32%", positive: true, icon: Percent },
    { label: "Average Order Value", val: "₹1,537", change: "+2.1%", positive: true, icon: IndianRupee }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", fontWeight: 400, color: "var(--text)", margin: 0 }}>Operations Overview</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Earthy Bites real-time business diagnostics and logs.</p>
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-mid)", background: "var(--white)", border: "1px solid var(--border)", padding: "8px 16px" }}>
          June 17, 2026 · Live Feed
        </div>
      </div>

      {/* KPI GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px"
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)" }}>{kpi.label}</span>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>{kpi.val}</h3>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: kpi.change === "Alert" ? "#c0392b" : kpi.positive ? "#27ae60" : "#c0392b",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  {kpi.change === "Alert" ? (
                    "Low stock warning"
                  ) : (
                    <>
                      {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {kpi.change} vs last week
                    </>
                  )}
                </span>
              </div>
              <div style={{
                background: "var(--cream)",
                padding: "8px",
                color: "#163020",
                display: "flex"
              }}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS CONTAINER */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
        gap: "24px"
      }}>
        {/* Sales Trend (SVG Area Chart) */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Sales Overview</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text)", margin: 0 }}>Revenue & Growth Trend</h3>
          </div>
          
          {/* Custom SVG Area Chart */}
          <div style={{ height: "200px", width: "100%", position: "relative", marginTop: "12px" }}>
            <svg viewBox="0 0 500 200" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#163020" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#163020" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="var(--border)" strokeWidth="1" />
              {/* Chart Line path */}
              <path
                d="M 0 160 Q 80 140 160 110 T 320 80 T 500 50 L 500 190 L 0 190 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 0 160 Q 80 140 160 110 T 320 80 T 500 50"
                fill="none"
                stroke="#163020"
                strokeWidth="2.5"
              />
              {/* Data Dots */}
              <circle cx="160" cy="110" r="4" fill="#d4af7a" stroke="#163020" strokeWidth="1.5" />
              <circle cx="320" cy="80" r="4" fill="#d4af7a" stroke="#163020" strokeWidth="1.5" />
              <circle cx="500" cy="50" r="4" fill="#d4af7a" stroke="#163020" strokeWidth="1.5" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-light)", marginTop: "8px" }}>
              <span>June 11</span>
              <span>June 13</span>
              <span>June 15</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Customer Growth (SVG Bar Chart) */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Acquisition Analytics</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text)", margin: 0 }}>Customer & Visitor Signups</h3>
          </div>

          {/* Custom SVG Bar Chart */}
          <div style={{ height: "200px", width: "100%", position: "relative", marginTop: "12px" }}>
            <svg viewBox="0 0 500 200" style={{ width: "100%", height: "100%" }}>
              {/* Horizontal grid lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="500" y2="190" stroke="var(--border)" strokeWidth="1" />
              
              {/* Bars */}
              {[
                { x: 40, h: 60, l: "Mon" },
                { x: 100, h: 80, l: "Tue" },
                { x: 160, h: 120, l: "Wed" },
                { x: 220, h: 90, l: "Thu" },
                { x: 280, h: 140, l: "Fri" },
                { x: 340, h: 110, l: "Sat" },
                { x: 400, h: 155, l: "Sun" },
                { x: 460, h: 170, l: "Today" }
              ].map((bar, i) => (
                <g key={i}>
                  <rect
                    x={bar.x}
                    y={190 - bar.h}
                    width="24"
                    height={bar.h}
                    fill="#163020"
                    opacity={i === 7 ? "1" : "0.75"}
                  />
                  {/* Accent caps */}
                  <rect
                    x={bar.x}
                    y={190 - bar.h}
                    width="24"
                    height="3"
                    fill="#d4af7a"
                  />
                </g>
              ))}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-light)", marginTop: "8px", padding: "0 10px" }}>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION (TABLE + RECENT FEED) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2.2fr 1fr",
        gap: "24px"
      }}>
        {/* Recent Orders Log */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Order Queue</span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text)", margin: 0 }}>Recent Purchases</h3>
            </div>
            <Link href="/admin/orders" style={{ fontSize: "12px", color: "var(--text-light)" }} className="hover:text-[#1a1410]">View All Orders →</Link>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 8px" }}>ID</th>
                <th style={{ padding: "12px 8px" }}>Customer</th>
                <th style={{ padding: "12px 8px" }}>Fulfillment</th>
                <th style={{ padding: "12px 8px" }}>Payment</th>
                <th style={{ padding: "12px 8px" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[#faf8f4]">
                  <td style={{ padding: "12px 8px", fontWeight: 600 }}>#{order.id}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                    <span style={{ fontSize: "10px", color: "var(--text-light)" }}>{order.email}</span>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      background: order.status === "DELIVERED" ? "#ebf7ee" : order.status === "CANCELLED" ? "#fcf3f2" : "#fef8eb",
                      color: order.status === "DELIVERED" ? "#27ae60" : order.status === "CANCELLED" ? "#c0392b" : "#f39c12"
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      background: order.paymentStatus === "PAID" ? "#ebf7ee" : order.paymentStatus === "REFUNDED" ? "#f0f0f0" : "#fcf3f2",
                      color: order.paymentStatus === "PAID" ? "#27ae60" : order.paymentStatus === "REFUNDED" ? "#7f8c8d" : "#c0392b"
                    }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px", fontWeight: 600 }}>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Operations Feed */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>System Log</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text)", margin: 0 }}>Recent Activity</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
            {[
              { text: "Rahul Sharma placed order #1001", type: "order", time: "10 mins ago" },
              { text: "Stock updated: California Almonds (+100)", type: "inventory", time: "45 mins ago" },
              { text: "Approved review on Medjool Dates by Deepika R.", type: "review", time: "2 hours ago" },
              { text: "Coupon code FESTIVE500 expired", type: "coupon", time: "5 hours ago" },
              { text: "Kashmir Walnuts stock dropped below 15", type: "alert", time: "1 day ago" }
            ].map((act, idx) => (
              <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "12px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: act.type === "alert" ? "#c0392b" : act.type === "order" ? "#27ae60" : "var(--gold)",
                  marginTop: "5px", flexShrink: 0
                }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ color: "var(--text-mid)", lineHeight: 1.4 }}>{act.text}</span>
                  <span style={{ fontSize: "9px", color: "var(--text-light)" }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

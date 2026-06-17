"use client";
import { useEffect, useState } from "react";
import { Bell, ShieldAlert, Check, Trash2, MailOpen, AlertTriangle, Info, ShieldCheck, RefreshCw } from "lucide-react";

interface NotificationItem {
  id: string;
  msg: string;
  category: "INVENTORY" | "ORDER" | "REVIEWS" | "SECURITY" | "SYSTEM";
  level: "critical" | "warning" | "info";
  time: string;
  read: boolean;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD, CRITICAL

  const loadNotifications = () => {
    setLoading(true);
    const stored = localStorage.getItem("db_notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const seeded: NotificationItem[] = [
        { id: "n1", msg: "California Almonds stock is low (12 left in warehouse A)", category: "INVENTORY", level: "critical", time: "25 min ago", read: false },
        { id: "n2", msg: "New order #1005 received from Kabir Mehta (₹649)", category: "ORDER", level: "info", time: "1 hour ago", read: false },
        { id: "n3", msg: "Spam comment flagged on Ajwa Dates review (Spam Score: 98%)", category: "REVIEWS", level: "warning", time: "3 hours ago", read: false },
        { id: "n4", msg: "New editor preeti@earthybites.com authorized for blog publishing", category: "SECURITY", level: "info", time: "1 day ago", read: true },
        { id: "n5", msg: "Automatic database local compaction executed successfully", category: "SYSTEM", level: "info", time: "2 days ago", read: true }
      ];
      localStorage.setItem("db_notifications", JSON.stringify(seeded));
      setNotifications(seeded);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const saveNotifications = (newItems: NotificationItem[]) => {
    setNotifications(newItems);
    localStorage.setItem("db_notifications", JSON.stringify(newItems));
    // Trigger custom event to sync layouts if needed
    window.dispatchEvent(new Event("db_notifications_changed"));
  };

  const handleMarkRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const handleClearRead = () => {
    const updated = notifications.filter(n => !n.read);
    saveNotifications(updated);
  };

  const filteredItems = notifications.filter(n => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "CRITICAL") return n.level === "critical";
    return true;
  });

  const getIcon = (cat: string, level: string) => {
    if (level === "critical") return <ShieldAlert size={16} style={{ color: "#c0392b" }} />;
    if (level === "warning") return <AlertTriangle size={16} style={{ color: "#f39c12" }} />;
    if (cat === "SECURITY") return <ShieldCheck size={16} style={{ color: "#2980b9" }} />;
    return <Info size={16} style={{ color: "var(--text-mid)" }} />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>System Notifications</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Audit log feeds, inventory thresholds warnings, and payment queue reports.</p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleMarkAllRead}
            style={{
              background: "none", border: "1px solid var(--border)", color: "var(--text-mid)",
              padding: "8px 16px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px"
            }}
          >
            <MailOpen size={12} /> Mark All Read
          </button>
          
          <button
            onClick={handleClearRead}
            style={{
              background: "none", border: "1px solid var(--border)", color: "#c0392b",
              padding: "8px 16px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fcf3f2"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <Trash2 size={12} /> Clear Read Logs
          </button>
        </div>
      </div>

      {/* TABS FILTERS */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px",
        display: "flex", gap: "8px", flexWrap: "wrap"
      }}>
        {[
          { label: "All Events", key: "ALL" },
          { label: `Unread (${notifications.filter(n => !n.read).length})`, key: "UNREAD" },
          { label: "Critical Alerts", key: "CRITICAL" }
        ].map(tb => (
          <button
            key={tb.key}
            onClick={() => setFilter(tb.key)}
            style={{
              background: filter === tb.key ? "var(--dark)" : "none",
              color: filter === tb.key ? "#ffffff" : "var(--text-mid)",
              border: "1px solid " + (filter === tb.key ? "var(--dark)" : "var(--border)"),
              padding: "6px 12px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
              cursor: "pointer"
            }}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* FEED QUEUE */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>Fetching event log...</div>
        ) : filteredItems.length === 0 ? (
          <div style={{
            background: "var(--white)", border: "1px solid var(--border)", padding: "60px 20px",
            textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px"
          }}>
            <Bell size={28} style={{ color: "var(--gold)" }} />
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>Notifications Queue Clear</p>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-light)" }}>No alerts match your current filter selection.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isCritical = item.level === "critical";
            return (
              <div
                key={item.id}
                style={{
                  background: item.read ? "var(--white)" : "rgba(184, 151, 90, 0.03)",
                  border: `1px solid ${isCritical ? "#f5c2c2" : "var(--border)"}`,
                  padding: "16px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.01)",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ display: "flex", gap: "16px", alignItems: "center", minWidth: 0 }}>
                  {/* Status Indicator Icon */}
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: isCritical ? "#fcf3f2" : "var(--cream)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {getIcon(item.category, item.level)}
                  </div>

                  {/* Message body */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontSize: "13px", fontWeight: item.read ? 500 : 600,
                      color: "var(--text)", lineHeight: 1.4, wordBreak: "break-word"
                    }}>
                      {item.msg}
                    </p>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "4px" }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase" }}>{item.category}</span>
                      <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--border)" }} />
                      <span style={{ fontSize: "10px", color: "var(--text-light)" }}>{item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "16px" }}>
                  {!item.read && (
                    <button
                      onClick={() => handleMarkRead(item.id)}
                      style={{
                        background: "none", border: "1px solid #27ae60", color: "#27ae60",
                        padding: "4px 8px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "4px"
                      }}
                      title="Mark as read"
                    >
                      <Check size={12} /> Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: "none", border: "none", color: "var(--text-light)", padding: "6px", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#c0392b"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-light)"}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

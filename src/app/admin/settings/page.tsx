"use client";
import { useState, useEffect } from "react";
import {
  Settings, Building, Globe, Percent, Mail, Save, RefreshCw, Check, CheckCircle2,
  Trash2, Plus, Truck
} from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("GENERAL");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General settings state
  const [storeName, setStoreName] = useState("Earthy Bites");
  const [supportEmail, setSupportEmail] = useState("concierge@earthybites.com");
  const [supportPhone, setSupportPhone] = useState("+91 98450 12345");
  const [address, setAddress] = useState("No. 12, Sourcing House, Indiranagar, Bengaluru, KA - 560038");

  // Taxes state
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstRate, setGstRate] = useState("5");
  const [inclusiveTax, setInclusiveTax] = useState(true);

  // Shipping zones state
  const [shippingZones, setShippingZones] = useState([
    { id: 1, name: "Domestic Zone (India)", rate: "₹0", minOrder: "₹999", duration: "2-4 Days" },
    { id: 2, name: "Express Air Zone", rate: "₹150", minOrder: "None", duration: "1-2 Days" },
    { id: 3, name: "International Zone", rate: "₹1,800", minOrder: "₹9,999", duration: "7-12 Days" }
  ]);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneRate, setNewZoneRate] = useState("");
  const [newZoneMin, setNewZoneMin] = useState("");

  // Email notifications state
  const [emailSubject, setEmailSubject] = useState("Your Earthy Bites Order #{{order_id}} has been received!");
  const [emailTemplate, setEmailTemplate] = useState(
    `Dear {{customer_name}},\n\nThank you for choosing Earthy Bites. Your order for single-origin forest delicacies has been received and is currently in queue at our climate-controlled warehouse.\n\nItems Sourced:\n{{order_items}}\n\nTotal Paid: {{order_total}}\n\nWarm regards,\nEarthy Bites Sourcing Team`
  );

  useEffect(() => {
    const stored = localStorage.getItem("db_brand_settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStoreName(parsed.storeName);
        setSupportEmail(parsed.supportEmail);
        setSupportPhone(parsed.supportPhone);
        setAddress(parsed.address);
        setGstEnabled(parsed.gstEnabled);
        setGstRate(parsed.gstRate);
        setInclusiveTax(parsed.inclusiveTax);
        setShippingZones(parsed.shippingZones || []);
        setEmailSubject(parsed.emailSubject);
        setEmailTemplate(parsed.emailTemplate);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    const settingsPayload = {
      storeName, supportEmail, supportPhone, address,
      gstEnabled, gstRate, inclusiveTax, shippingZones,
      emailSubject, emailTemplate
    };
    localStorage.setItem("db_brand_settings", JSON.stringify(settingsPayload));
    
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const handleAddShippingZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName || !newZoneRate) return;
    const newZone = {
      id: Date.now(),
      name: newZoneName,
      rate: newZoneRate.startsWith("₹") ? newZoneRate : "₹" + newZoneRate,
      minOrder: newZoneMin ? (newZoneMin.startsWith("₹") ? newZoneMin : "₹" + newZoneMin) : "None",
      duration: "3-5 Days"
    };
    setShippingZones([...shippingZones, newZone]);
    setNewZoneName("");
    setNewZoneRate("");
    setNewZoneMin("");
  };

  const handleDeleteShippingZone = (id: number) => {
    setShippingZones(shippingZones.filter(z => z.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Brand Settings</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Configure domestic shipping grids, tax calculation rates, email communication templates, and billing addresses.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saveSuccess ? "#27ae60" : "#163020",
            color: "#ffffff", border: "none", padding: "10px 20px",
            fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"
          }}
        >
          {saving ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : saveSuccess ? (
            <Check size={14} />
          ) : (
            <Save size={14} />
          )}
          <span>{saving ? "Saving settings..." : saveSuccess ? "Saved Settings" : "Save Settings"}</span>
        </button>
      </div>

      {/* DUAL WORKSPACE */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "32px", alignItems: "start" }}>
        
        {/* Left Side Tab Menu */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            { label: "General Details", key: "GENERAL", icon: Building },
            { label: "Taxes & Duties", key: "TAXES", icon: Percent },
            { label: "Shipping Zones", key: "SHIPPING", icon: Truck },
            { label: "Email Notifications", key: "EMAIL", icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px",
                  fontSize: "12px", fontWeight: active ? 600 : 500,
                  color: active ? "#ffffff" : "var(--text-mid)",
                  background: active ? "#163020" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                }}
              >
                <Icon size={14} style={{ opacity: 0.8 }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Editor panel */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "32px" }}>
          
          {/* TAB 1: GENERAL BRAND */}
          {activeTab === "GENERAL" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", margin: "0 0 6px", color: "var(--text)" }}>Corporate Sourcing Details</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-light)" }}>Identify your store brand credentials and helpline contacts.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Official Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Helpline Support Phone</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Customer Concierge Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Fulfillment Center Warehouse Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: "12px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", minHeight: "60px", resize: "vertical", fontFamily: "var(--sans)" }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: TAXES */}
          {activeTab === "TAXES" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", margin: "0 0 6px", color: "var(--text)" }}>Taxation & GST Rates</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-light)" }}>Configure tax codes applicable to retail purchases.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={gstEnabled}
                    onChange={(e) => setGstEnabled(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#163020" }}
                  />
                  <span>Automate GST Collection on Cart Checkout</span>
                </label>

                {gstEnabled && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", background: "var(--cream)", padding: "20px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Standard GST/VAT rate (%)</label>
                      <input
                        type="number"
                        value={gstRate}
                        onChange={(e) => setGstRate(e.target.value)}
                        style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", background: "#ffffff" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Calculation Standard</label>
                      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                          <input type="radio" checked={inclusiveTax} onChange={() => setInclusiveTax(true)} style={{ accentColor: "#163020" }} />
                          Inclusive (GST in catalog prices)
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                          <input type="radio" checked={!inclusiveTax} onChange={() => setInclusiveTax(false)} style={{ accentColor: "#163020" }} />
                          Exclusive (Add GST at checkout)
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SHIPPING */}
          {activeTab === "SHIPPING" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", margin: "0 0 6px", color: "var(--text)" }}>Domestic & Global Shipping Rates</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-light)" }}>Set shipping charges based on minimum purchase thresholds.</p>
              </div>

              {/* Active Zones List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>Active Sourcing Zones</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid var(--border)" }}>
                  {shippingZones.map(zone => (
                    <div key={zone.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600 }}>{zone.name}</div>
                        <span style={{ fontSize: "10px", color: "var(--text-light)" }}>Free from: {zone.minOrder} · Delivery: {zone.duration}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--gold)" }}>{zone.rate}</span>
                        <button
                          onClick={() => handleDeleteShippingZone(zone.id)}
                          style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Zone Form */}
              <form onSubmit={handleAddShippingZone} style={{ border: "1px solid var(--border)", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Register Shipping Region</span>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "12px" }}>
                  <input
                    type="text"
                    placeholder="e.g. South India Express"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid var(--border)", fontSize: "12px", outline: "none" }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Rate e.g. 80"
                    value={newZoneRate}
                    onChange={(e) => setNewZoneRate(e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid var(--border)", fontSize: "12px", outline: "none" }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Min Order e.g. 1500"
                    value={newZoneMin}
                    onChange={(e) => setNewZoneMin(e.target.value)}
                    style={{ padding: "8px 12px", border: "1px solid var(--border)", fontSize: "12px", outline: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    alignSelf: "flex-end", background: "none", border: "1px solid var(--dark)", color: "var(--dark)",
                    padding: "8px 16px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer"
                  }}
                >
                  Add Sourcing Zone
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: EMAIL NOTIFICATIONS */}
          {activeTab === "EMAIL" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", margin: "0 0 6px", color: "var(--text)" }}>Email Sourcing Digests</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-light)" }}>Edit transactional templates dispatched upon order fulfillment.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>Receipt Email Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-mid)" }}>
                  <span>Customer Dispatch Text Template</span>
                  <span style={{ color: "var(--gold)" }}>Variables: &#123;&#123;order_id&#125;&#125;, &#123;&#123;customer_name&#125;&#125;, &#123;&#123;order_items&#125;&#125;</span>
                </div>
                <textarea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  style={{ padding: "14px", border: "1px solid var(--border)", fontSize: "12px", outline: "none", minHeight: "180px", resize: "vertical", fontFamily: "monospace", lineHeight: 1.5 }}
                />
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

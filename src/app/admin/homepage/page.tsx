"use client";
import { useState, useEffect } from "react";
import { Eye, Settings, Save, RefreshCw, Layers, Layout, FileText, Check, AlertCircle } from "lucide-react";

interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroOpacity: number;
  quoteText: string;
  quoteAuthor: string;
  showBestSellers: boolean;
  showStandardSourcing: boolean;
  showJournalHighlights: boolean;
  showNewsletterStrip: boolean;
  editorialPauseColor: string;
}

export default function AdminHomepage() {
  const [config, setConfig] = useState<HomepageConfig>({
    heroTitle: "Nature Never Rushes. Neither Do We.",
    heroSubtitle: "Single-origin forest delicacies, cold packed and climate routed for the absolute preservation of molecular integrity.",
    heroImageUrl: "/products/featured-almonds.png",
    heroOpacity: 55,
    quoteText: "To eat pure food is a form of quiet resistance. In an age of synthetic rush, selecting slow-grown forest delicacies is an act of deep mindfulness.",
    quoteAuthor: "Earthy Journal — Issue No. 04",
    showBestSellers: true,
    showStandardSourcing: true,
    showJournalHighlights: true,
    showNewsletterStrip: true,
    editorialPauseColor: "#163020"
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("db_homepage_config");
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse homepage config", e);
      }
    }
  }, []);

  const handleFieldChange = (field: keyof HomepageConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem("db_homepage_config", JSON.stringify(config));
    // Simulate API write
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const resetDefaults = () => {
    if (confirm("Reset layout blocks to factory defaults?")) {
      const defaults: HomepageConfig = {
        heroTitle: "Nature Never Rushes. Neither Do We.",
        heroSubtitle: "Single-origin forest delicacies, cold packed and climate routed for the absolute preservation of molecular integrity.",
        heroImageUrl: "/products/featured-almonds.png",
        heroOpacity: 55,
        quoteText: "To eat pure food is a form of quiet resistance. In an age of synthetic rush, selecting slow-grown forest delicacies is an act of deep mindfulness.",
        quoteAuthor: "Earthy Journal — Issue No. 04",
        showBestSellers: true,
        showStandardSourcing: true,
        showJournalHighlights: true,
        showNewsletterStrip: true,
        editorialPauseColor: "#163020"
      };
      setConfig(defaults);
      localStorage.setItem("db_homepage_config", JSON.stringify(defaults));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", minHeight: "100%" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Homepage Configurator</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Edit brand copy values, toggle editorial sections, and monitor visual layout changes.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={resetDefaults}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-mid)",
              padding: "10px 18px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            Reset Defaults
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saveSuccess ? "#27ae60" : "#163020",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer"
            }}
          >
            {saving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : saveSuccess ? (
              <Check size={14} />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? "Storing..." : saveSuccess ? "Saved Config" : "Save Configurations"}</span>
          </button>
        </div>
      </div>

      {/* DUAL SCREEN WORKSPACE */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        gap: "32px",
        alignItems: "start"
      }}>
        
        {/* LEFT COLUMN: VISUAL CONTROLS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Hero Customization Section */}
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <Layers size={16} style={{ color: "var(--gold)" }} />
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", margin: 0 }}>Section 1: Hero Billboard</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>Hero Title Text</label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>Hero Subtitle / Description</label>
                <textarea
                  value={config.heroSubtitle}
                  onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", minHeight: "72px", resize: "vertical", fontFamily: "var(--sans)", lineHeight: 1.4 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>Hero Background Image URL</label>
                  <input
                    type="text"
                    value={config.heroImageUrl}
                    onChange={(e) => handleFieldChange("heroImageUrl", e.target.value)}
                    style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>
                    <span>Overlay Opacity</span>
                    <span>{config.heroOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={config.heroOpacity}
                    onChange={(e) => handleFieldChange("heroOpacity", parseInt(e.target.value))}
                    style={{ marginTop: "12px", accentColor: "#163020", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Editorial Pause */}
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <FileText size={16} style={{ color: "var(--gold)" }} />
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", margin: 0 }}>Section 2: Editorial Quote</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>Philosophical Quote</label>
                <textarea
                  value={config.quoteText}
                  onChange={(e) => handleFieldChange("quoteText", e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", minHeight: "72px", resize: "vertical", fontFamily: "var(--sans)", lineHeight: 1.4 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>Citation / Issue Source</label>
                  <input
                    type="text"
                    value={config.quoteAuthor}
                    onChange={(e) => handleFieldChange("quoteAuthor", e.target.value)}
                    style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-light)" }}>Quote Text Shade Theme</label>
                  <select
                    value={config.editorialPauseColor}
                    onChange={(e) => handleFieldChange("editorialPauseColor", e.target.value)}
                    style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", background: "#ffffff" }}
                  >
                    <option value="#163020">Brand Deep Forest Green</option>
                    <option value="#b8975a">Luxury Warm Gold</option>
                    <option value="#1a1410">Earthy Charcoal Black</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Active Content Blocks Layout */}
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <Layout size={16} style={{ color: "var(--gold)" }} />
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", margin: 0 }}>Section 3: Layout Structure Modules</h3>
            </div>

            <p style={{ margin: 0, fontSize: "11px", color: "var(--text-light)" }}>Toggle standard modules visible on the customer facing storefront index page.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Highlight Best Sellers Catalog Carousel", field: "showBestSellers" },
                { label: "Heritage elevation & purity standards chapters", field: "showStandardSourcing" },
                { label: "Latest Wellness Journal articles showcase", field: "showJournalHighlights" },
                { label: "Footer newsletter subscription banner", field: "showNewsletterStrip" }
              ].map(block => (
                <label
                  key={block.field}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    border: "1px solid var(--border)",
                    background: (config as any)[block.field] ? "var(--cream)" : "transparent",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  <span style={{ color: (config as any)[block.field] ? "var(--text)" : "var(--text-mid)" }}>{block.label}</span>
                  <input
                    type="checkbox"
                    checked={(config as any)[block.field]}
                    onChange={(e) => handleFieldChange(block.field as any, e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#163020", cursor: "pointer" }}
                  />
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME SIMULATED PREVIEW */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "96px" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)" }}>
            <Eye size={12} />
            <span>Responsive Live Storefront Preview (1/4 Scale)</span>
          </div>

          {/* Scaled storefront container */}
          <div style={{
            background: "#faf8f4",
            border: "1px solid var(--border)",
            height: "560px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
            fontFamily: "var(--sans)"
          }} className="simulated-browser">
            
            {/* Simulated Header Ticker */}
            <div style={{ background: "#1a1410", color: "#ffffff", padding: "4px 8px", fontSize: "6px", textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              FREE CLIMATE-CONTROLLED COURIER DELIVERY ACROSS INDIA ABOVE ₹999
            </div>

            {/* Simulated Navbar */}
            <div style={{ background: "#ffffff", borderBottom: "1px solid #e8e2d9", padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "8px", fontWeight: 700, fontFamily: "var(--serif)" }}>EARTHY BITES</span>
              <div style={{ display: "flex", gap: "8px", fontSize: "6px", fontWeight: 600, color: "var(--text-mid)", textTransform: "uppercase" }}>
                <span>SHOP</span>
                <span>JOURNAL</span>
                <span>HERITAGE</span>
              </div>
            </div>

            {/* Simulated Hero */}
            <div style={{
              height: "180px",
              background: `url(${config.heroImageUrl}) center/cover no-repeat #1a1410`,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "16px"
            }}>
              {/* Opacity mask */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "black",
                opacity: config.heroOpacity / 100
              }} />
              
              <div style={{ position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: "5px", color: "var(--gold)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>HARVEST DISPATCH</span>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "#ffffff", margin: "0 0 4px", fontWeight: 400, lineHeight: 1.2 }}>
                  {config.heroTitle || "Title goes here"}
                </h2>
                <p style={{ fontSize: "6px", color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.3 }}>
                  {config.heroSubtitle || "Subtitle goes here"}
                </p>
              </div>
            </div>

            {/* Editorial Quote Pause */}
            <div style={{ padding: "20px 16px", textAlign: "center", background: "#faf8f4", borderBottom: "1px solid #e8e2d9" }}>
              <p style={{
                fontFamily: "var(--serif)", fontSize: "10px", lineHeight: 1.5,
                color: config.editorialPauseColor, margin: "0 auto 6px", maxWidth: "80%", fontStyle: "italic"
              }}>
                &quot;{config.quoteText || "Philosophical copy goes here..."}&quot;
              </p>
              <span style={{ fontSize: "5px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>
                {config.quoteAuthor}
              </span>
            </div>

            {/* CONTENT MODULES LIST */}
            
            {/* module: best sellers */}
            {config.showBestSellers && (
              <div style={{ padding: "16px", borderBottom: "1px solid #e8e2d9", background: "#ffffff" }}>
                <span style={{ fontSize: "5px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>COLLECTION HIGHLIGHTS</span>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: "8px", margin: "0 0 8px", color: "var(--text)" }}>The Best-Seller Nut Ledger</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {[
                    { name: "Mamra Almonds", price: "₹2,200", origin: "Kabul" },
                    { name: "Ajwa Dates", price: "₹1,150", origin: "Medina" },
                    { name: "Antep Pistachios", price: "₹1,450", origin: "Gaziantep" }
                  ].map((p, i) => (
                    <div key={i} style={{ border: "1px solid #e8e2d9", padding: "6px", fontSize: "6px" }}>
                      <div style={{ height: "30px", background: "var(--cream)", marginBottom: "4px" }} />
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: "var(--text-light)", fontSize: "5px" }}>{p.origin}</div>
                      <div style={{ fontWeight: 700, marginTop: "2px" }}>{p.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* module: standards */}
            {config.showStandardSourcing && (
              <div style={{ padding: "16px", background: "#163020", color: "#f6f1e9", borderBottom: "1px solid #e8e2d9" }}>
                <span style={{ fontSize: "5px", fontWeight: 700, color: "var(--gold)", display: "block", marginBottom: "2px" }}>THE EARTHY STANDARD</span>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: "8px", margin: "0 0 6px" }}>Purity Sourced & Sealed</h4>
                <p style={{ fontSize: "5px", color: "rgba(246,241,233,0.7)", margin: 0, lineHeight: 1.4 }}>
                  Rigorous dual testing for pesticide residues. Climate controlled warehousing maintains enzyme preservation.
                </p>
              </div>
            )}

            {/* module: wellness journal */}
            {config.showJournalHighlights && (
              <div style={{ padding: "16px", background: "#ffffff", borderBottom: "1px solid #e8e2d9" }}>
                <span style={{ fontSize: "5px", fontWeight: 700, color: "var(--gold)", display: "block", marginBottom: "2px" }}>THE JOURNAL</span>
                <h4 style={{ fontFamily: "var(--serif)", fontSize: "8px", margin: "0 0 6px" }}>Featured Dispatches</h4>
                <div style={{ borderTop: "1px solid #e8e2d9", paddingTop: "4px", fontSize: "6px" }}>
                  <div style={{ fontWeight: 600 }}>Sourcing Dates in the Jordan Valley</div>
                  <span style={{ fontSize: "4px", color: "var(--text-light)" }}>Sourcing Dispatch · 5 mins read</span>
                </div>
              </div>
            )}

            {/* module: newsletter */}
            {config.showNewsletterStrip && (
              <div style={{ padding: "12px", background: "var(--cream)", textAlign: "center" }}>
                <h5 style={{ fontFamily: "var(--serif)", fontSize: "7px", margin: "0 0 4px" }}>Register for Sourcing Digests</h5>
                <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
                  <div style={{ width: "80px", border: "1px solid #e8e2d9", background: "#ffffff", height: "10px" }} />
                  <div style={{ width: "30px", background: "#163020", height: "10px" }} />
                </div>
              </div>
            )}

            {/* Simulated Footer */}
            <div style={{ background: "#1a1410", padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: "5px", textAlign: "center" }}>
              © 2026 Earthy Bites. Curating purity, integrity, and wellness.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

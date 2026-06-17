"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function StoryPage() {
  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div className="info-page-header" style={{ padding: "120px 40px 80px" }}>
        <span className="info-page-label">Origin & Ethos</span>
        <h1 className="info-page-title" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          Our Story
        </h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text-mid)", marginTop: "24px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          A pursuit of pure taste, born from deep respect for old-growth soils, heritage crops, and the patient rhythm of nature.
        </p>
      </div>

      <main className="info-page-container" style={{ flex: 1, maxWidth: "1100px", padding: "0 40px 120px" }}>
        {/* Split Section */}
        <div className="contact-grid" style={{ alignItems: "center", marginBottom: "100px" }}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1505253668822-42074d58a7c6?q=80&w=1200&auto=format&fit=crop"
              alt="Harvesting groves"
              style={{ width: "100%", height: "500px", objectFit: "cover", border: "1px solid var(--border)" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase" }}>Chapter I</span>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.5rem", color: "var(--text)", lineHeight: 1.1 }}>The Gap in the Market</h2>
            <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: 1.8 }}>
              Earthy Bites was born out of frustration with the standard commodity market. Walking down supermarket aisles, we saw dry fruits treated as generic commodities—mass-aggregated, chemically bleached, and stripped of their natural flavor profiles. 
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: 1.8 }}>
              We asked a simple question: why do we value single-origin terroir in fine wines, coffees, and olive oils, but accept mixed, lifeless blends in the nuts we eat every day?
            </p>
          </div>
        </div>

        {/* Full Width Quote */}
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 0", textAlign: "center", marginBottom: "100px" }}>
          <h3 style={{ fontFamily: "var(--serif)", fontSize: "2.25rem", fontStyle: "italic", color: "var(--text)", maxWidth: "800px", margin: "0 auto 24px", lineHeight: 1.4 }}>
            "We do not cultivate the land; we steward it. Nature does the real work."
          </h3>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-light)" }}>
            — Devendra Sharma, Old-Growth Walnut Grower, Kashmir
          </span>
        </div>

        {/* Core Values Section */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", color: "var(--gold)", textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: "40px" }}>Chapter II · Core Values</span>
          <div className="contact-grid">
            <div style={{ border: "1px solid var(--border)", padding: "40px", background: "#ffffff" }}>
              <span style={{ fontSize: "1.5rem", color: "var(--gold)", display: "block", marginBottom: "16px" }}>✦</span>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", marginBottom: "12px" }}>100% Traceability</h4>
              <p style={{ fontSize: "13px", color: "var(--text-mid)", lineHeight: 1.7 }}>
                Every single almond, pistachio, dates, and cashew in our jars can be traced back to its specific farm, elevation, and harvest month. We never blend crops.
              </p>
            </div>
            <div style={{ border: "1px solid var(--border)", padding: "40px", background: "#ffffff" }}>
              <span style={{ fontSize: "1.5rem", color: "var(--gold)", display: "block", marginBottom: "16px" }}>✦</span>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", marginBottom: "12px" }}>Uncompromised Purity</h4>
              <p style={{ fontSize: "13px", color: "var(--text-mid)", lineHeight: 1.7 }}>
                No sulfur dioxide, no artificial colorings, and zero chemical preservatives. Every single batch is independently tested to ensure it remains clean.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

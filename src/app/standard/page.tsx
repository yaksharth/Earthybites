"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function StandardPage() {
  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="info-page-header" style={{ padding: "120px 40px 80px" }}>
        <span className="info-page-label">Purity Protocol</span>
        <h1 className="info-page-title">The Earthy Standard</h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text-mid)", marginTop: "24px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          Three non-negotiable standards of sourcing, purity testing, and packaging that separate us from the commodity market.
        </p>
      </div>

      <main className="info-page-container" style={{ flex: 1, maxWidth: "1000px", paddingBottom: "120px" }}>
        {/* Standard 1 */}
        <div className="info-page-section" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "60px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Standard 01</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.25rem", color: "var(--text)", marginBottom: "20px" }}>Terroir & Elevation Sourcing</h2>
          <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: 1.8 }}>
            We believe that altitude, soil chemistry, and temperature dictate nutritional density and taste profiles. We source our products strictly from single-origin farms situated in geographic sweet spots:
          </p>
          <ul style={{ marginTop: "20px" }}>
            <li><strong>California Almonds:</strong> Grown in the mineral-rich soils of the Sacramento Valley, harvested only when naturally dried on the branch.</li>
            <li><strong>Iranian Pistachios:</strong> Cultivated at 1600 meters elevation in Kerman, ensuring a rich earthy saltiness from native soils.</li>
            <li><strong>Himalayan Walnuts:</strong> Gathered from old-growth orchards at 1800 meters in Kashmir, producing paper-thin shells and high omega fat contents.</li>
          </ul>
        </div>

        {/* Standard 2 */}
        <div className="info-page-section" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "60px", paddingTop: "40px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Standard 02</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.25rem", color: "var(--text)", marginBottom: "20px" }}>Rigorous Laboratory Compliance</h2>
          <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: 1.8 }}>
            Nuts and dry fruits are highly susceptible to chemical sprays, mold development (aflatoxins), and heavy metal contamination. We implement a double-barrier testing protocol:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px" }}>
            <div style={{ border: "1px solid var(--border)", padding: "24px", background: "#ffffff" }}>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", marginBottom: "10px", color: "var(--text)" }}>Farm Testing</h4>
              <p style={{ fontSize: "13px", color: "var(--text-mid)", margin: 0, lineHeight: 1.6 }}>We test raw crop samples at the source prior to shipment to ensure zero chemical pesticides or growth hormones were applied.</p>
            </div>
            <div style={{ border: "1px solid var(--border)", padding: "24px", background: "#ffffff" }}>
              <h4 style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", marginBottom: "10px", color: "var(--text)" }}>Import & Seal Testing</h4>
              <p style={{ fontSize: "13px", color: "var(--text-mid)", margin: 0, lineHeight: 1.6 }}>Every batch is tested in NABL-accredited labs in Mumbai for aflatoxins and micro-bacterial impurities before modified packaging occurs.</p>
            </div>
          </div>
        </div>

        {/* Standard 3 */}
        <div className="info-page-section" style={{ paddingTop: "40px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Standard 03</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.25rem", color: "var(--text)", marginBottom: "20px" }}>Nitrogen Atmospheric Preservation</h2>
          <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: 1.8 }}>
            Natural oils spoil rapidly under light and oxygen exposure. Commodity brands mask stale harvests with roasting and heavy salting. We seal raw and lightly dried products in nitrogen-flushed packages. This excludes all oxygen and moisture, keeping our harvests fresh, crisp, and nutrient-dense without chemical preservatives or sulfur-dioxide treatments.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

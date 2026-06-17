"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function JournalPage() {
  const articles = [
    {
      tag: "SOURCING DISPATCH",
      title: "Sourcing Dates in the Jordan Valley",
      desc: "A personal dispatch from our team meeting multi-generational palm growers and tasting harvests from 30-year-old Medjool palms.",
      img: "/products/dates.png",
      date: "May 2026",
    },
    {
      tag: "NUTRITION SCIENCE",
      title: "Rich Fats & Mindful Mornings",
      desc: "The molecular science of monounsaturated fats in raw almonds and how they support cognitive focus and long-term energy release.",
      img: "/products/almonds.png",
      date: "April 2026",
    },
    {
      tag: "AGRICULTURE",
      title: "Micro-Nutrients of High Altitudes",
      desc: "Why nuts grown at high elevations (above 1500 meters) develop denser shells, deeper oils, and higher concentrations of trace minerals.",
      img: "/products/pistachios.png",
      date: "March 2026",
    },
    {
      tag: "SOURCING DISPATCH",
      title: "The Terroir of Bam: Iran's Fresh Date Oasis",
      desc: "Tracing the historic date palms of Bam, irrigated by ancient qanat water systems to produce soft, fresh Kimia harvests.",
      img: "/products/kimia_dates.png",
      date: "February 2026",
    },
    {
      tag: "NUTRITION SCIENCE",
      title: "Zinc & Immunity: The Cashew Science",
      desc: "Understanding how the high zinc, copper, and magnesium densities in raw premium cashews support cellular health and focus.",
      img: "/products/cashews.png",
      date: "January 2026",
    },
    {
      tag: "AGRICULTURE",
      title: "Himalayan Wild Harvesting Protocols",
      desc: "A detailed look at the sustainable wild-gathering and cold-cracking methods employed by our walnut partners in Kashmir.",
      img: "/products/walnuts.png",
      date: "December 2025",
    },
    {
      tag: "FOOD SCIENCE",
      title: "The Secret to Nitrogen Sealing",
      desc: "How modified atmospheric packaging halts lipid oxidation and preserves the delicate, fresh fats of raw nuts.",
      img: "/hero.jpg",
      date: "November 2025",
    },
    {
      tag: "AGRICULTURE",
      title: "Traditional Shadow-Drying in Xinjiang",
      desc: "Why drying seedless grapes inside ventilated brick kilns preserves natural vitamin densities and prevents sun-scorching.",
      img: "/products/golden_raisins.png",
      date: "October 2025",
    },
    {
      tag: "NUTRITION SCIENCE",
      title: "Essential Fats of Volcanic Soils",
      desc: "Analyzing the exceptional monounsaturated fat density of raw macadamias grown on the volcanic slopes of the Kona Coast.",
      img: "/products/macadamia.png",
      date: "September 2025",
    },
  ];

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Header */}
      <div className="info-page-header" style={{ padding: "120px 40px 80px" }}>
        <span className="info-page-label">Earthy Journal</span>
        <h1 className="info-page-title" style={{ fontStyle: "italic" }}>Wellness Journal</h1>
        <p style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "var(--text-mid)", marginTop: "24px", letterSpacing: "0.05em" }}>
          Issue No. 04 — Slow Living & Mindful Sourcing
        </p>
      </div>

      <main className="info-page-container" style={{ flex: 1, maxWidth: "1200px", paddingBottom: "120px" }}>
        {/* Featured Editorial */}
        <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "80px", marginBottom: "80px" }}>
          <div className="contact-grid" style={{ alignItems: "center" }}>
            <div>
              <img
                src="/products/featured-almonds.png"
                alt="Slow drying"
                style={{ width: "100%", height: "450px", objectFit: "cover", border: "1px solid var(--border)" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase" }}>FEATURED EDITORIAL</span>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "2.75rem", color: "var(--text)", lineHeight: 1.1 }}>
                The Art of Slow Drying:<br />Why Solar Dehydration Matters
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: 1.8 }}>
                Industrial dry fruits are dehydrated in massive electric ovens in under 12 hours. This extreme heat damages vital micro-nutrients and dries out natural moisture, leading to tough textures. 
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: 1.8 }}>
                At Earthy Bites, our partner orchards use elevated racks to dry nuts and fruits naturally under the sun for 5 to 7 days. This patient method concentrates natural fruit sugars, locks in essential fatty acids, and preserves the plump chewiness of dates and raisins.
              </p>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-light)" }}>June 2026 · 6 min read</span>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--text-light)", textTransform: "uppercase", display: "block", marginBottom: "40px" }}>All Dispatches</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
            {articles.map((art, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "16/10" }}>
                  <img
                    src={art.img}
                    alt={art.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                  />
                </div>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>{art.tag}</span>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", color: "var(--text)", margin: 0 }}>{art.title}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-mid)", lineHeight: 1.7, margin: 0 }}>{art.desc}</p>
                <span style={{ fontSize: "11px", color: "var(--text-light)" }}>{art.date}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

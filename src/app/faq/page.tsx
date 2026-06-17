"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type FAQItemType = {
  q: string;
  a: string;
};

export default function FAQPage() {
  const faqs: FAQItemType[] = [
    {
      q: "What makes Earthy Bites dry fruits and nuts premium?",
      a: "Unlike commodity dry fruits that are mass-aggregated and blended from various sources, Earthy Bites operates on a single-origin heritage model. We source exclusively from premium micro-climates (such as Himalayan groves at 1800m for Walnuts or volcanic Kona Coast for Macadamias). We package them in small, certified batches directly at the source, ensuring you taste the unique terroir and peak-fresh crunch of each crop.",
    },
    {
      q: "Why do you package using nitrogen sealing?",
      a: "Raw nuts and dry fruits contain rich, delicate oils and healthy fats that quickly oxidize when exposed to air, turning stale or bitter. Standard packaging lacks protective barriers. We pack all our selections under modified atmospheric packaging (nitrogen flushed) in multi-layer barrier pouches. This locks out oxygen and moisture, keeping the harvests fresh, crunchy, and nutritionally active without chemical preservatives or sulfur dioxide.",
    },
    {
      q: "Are Earthy Bites products pesticide-free?",
      a: "Yes. Every single harvest batch undergoes rigorous independent lab testing at NABL-accredited facilities for over 120 pesticide residues, heavy metals, and mycotoxins. We only partner with growers who employ sustainable, clean-crop agricultural practices. Purity certificates for each batch are available upon request.",
    },
    {
      q: "How should I store my dry fruits and nuts to maintain quality?",
      a: "To preserve their natural textures and prevent oxidation, store them in a cool, dry place away from direct sunlight. Once opened, seal them tightly in their original resealable barrier pouches, or transfer them to dry glass containers. For long-term preservation (more than 30 days), we highly recommend storing them in your refrigerator.",
    },
    {
      q: "Do you offer international shipping or custom corporate gifting?",
      a: "Yes, we ship internationally on request and curate bespoke gift collections for corporate partnerships and special events. Please reach out to our corporate concierge desk through our contact page or at gifting@earthybites.in to discuss tailored selections.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="info-page-header">
        <span className="info-page-label">Information Desk</span>
        <h1 className="info-page-title">Frequently Asked Questions</h1>
      </div>

      <main className="info-page-container" style={{ flex: 1 }}>
        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div className="faq-item" key={idx}>
                <button
                  className="faq-question"
                  onClick={() => toggle(idx)}
                  style={{ width: "100%", background: "none", border: "none", textAlign: "left", padding: 0 }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: 16, color: "var(--gold)", transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p style={{ margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

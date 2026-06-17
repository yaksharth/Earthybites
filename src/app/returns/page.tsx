"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="info-page-header">
        <span className="info-page-label">Help & Services</span>
        <h1 className="info-page-title">Returns Policy</h1>
      </div>

      <main className="info-page-container" style={{ flex: 1 }}>
        <div className="info-page-section">
          <h3>Our Quality Assurance & Return Policy</h3>
          <p>
            Due to the perishable nature and strict hygiene standards of our food products, Earthy Bites does not accept physical returns of dry fruits, nuts, berries, or seeds once they have left our climate-controlled facilities.
          </p>
          <p>
            However, we stand behind the exceptional quality of our harvests. If you are unsatisfied with your order or if any product arrives in less than perfect condition, we will make it right.
          </p>
        </div>

        <div className="info-page-section">
          <h3>The Earthy Bites Guarantee</h3>
          <p>
            You are entitled to a full replacement or refund in the following circumstances:
          </p>
          <ul>
            <li><strong>Transit Damage:</strong> The packaging seal was broken, or the outer container was punctured during transit.</li>
            <li><strong>Quality Discrepancy:</strong> The flavor, texture, or freshness does not align with our single-origin standards.</li>
            <li><strong>Incorrect Fulfillment:</strong> You received a different product size or selection than what you ordered.</li>
          </ul>
        </div>

        <div className="info-page-section">
          <h3>How to Request a Replacement or Refund</h3>
          <p>
            Please report any quality or transit issues within 48 hours of delivery:
          </p>
          <ol style={{ paddingLeft: 20, marginBottom: 20, fontSize: 14, lineHeight: 1.8, color: "var(--text-mid)" }}>
            <li style={{ marginBottom: 8 }}>Take a photograph of the outer packaging and the batch number printed on the back of the pouch.</li>
            <li style={{ marginBottom: 8 }}>Send the photo, along with your Order ID, to our concierge team at <strong>concierge@earthybites.in</strong> or via our <Link href="/contact" style={{ color: "var(--gold)", textDecoration: "underline" }}>Contact Page</Link>.</li>
            <li style={{ marginBottom: 8 }}>Our quality compliance team will review your ticket and issue a replacement or refund within 24 hours. Refunds will be credited back to your original payment method within 5–7 business days.</li>
          </ol>
        </div>

        <div className="info-page-section">
          <h3>Cancellations</h3>
          <p>
            Orders can be cancelled before they are dispatched from our Mumbai facility. Once dispatched, orders cannot be cancelled or redirected. To check the status of your order, please contact our helpline immediately.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

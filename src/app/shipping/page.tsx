"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="info-page-header">
        <span className="info-page-label">Help & Services</span>
        <h1 className="info-page-title">Shipping Info</h1>
      </div>

      <main className="info-page-container" style={{ flex: 1 }}>
        <div className="info-page-section">
          <h3>The Earthy Sourcing & Dispatch standard</h3>
          <p>
            Because we deliver pure, single-origin harvests directly from growers to your doorstep, our shipping standards are designed to preserve the delicate essential oils, moisture levels, and textures of our products. All orders are processed at our climate-controlled fulfillment center in Mumbai and sealed under modified atmospheric packaging (nitrogen flushed) right before shipping.
          </p>
        </div>

        <div className="info-page-section">
          <h3>Domestic Delivery & Rates</h3>
          <p>
            We partner with premier logistics providers across India to ensure prompt, secure delivery.
          </p>
          <ul>
            <li><strong>Express Metro Delivery (2–4 Business Days):</strong> Free for all orders above ₹999. A flat shipping charge of ₹99 applies for orders below ₹999.</li>
            <li><strong>Standard National Delivery (4–7 Business Days):</strong> Available nationwide. Tracked from dispatch to delivery.</li>
            <li><strong>Same-Day Delivery:</strong> Currently available in select pin codes across Mumbai and Bengaluru for orders placed before 11:00 AM.</li>
          </ul>
        </div>

        <div className="info-page-section">
          <h3>Climate-Preserving Packaging</h3>
          <p>
            To prevent rancidity and texture loss, our products are shipped in multi-layer barrier pouches that exclude light, oxygen, and humidity. We recommend transferring your dry fruits and nuts to airtight glass jars or storing them in the refrigerator upon receipt to maintain absolute freshness.
          </p>
        </div>

        <div className="info-page-section">
          <h3>Order Tracking & Inquiries</h3>
          <p>
            Once your order is dispatched, you will receive a SMS and email containing your tracking link. You can also view details of your order on our tracking portal.
          </p>
          <p>
            For urgent delivery requests or custom orders, please contact our dispatch desk at <Link href="/contact" style={{ color: "var(--gold)", textDecoration: "underline" }}>Contact Us</Link> or email us at <strong>concierge@earthybites.in</strong>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

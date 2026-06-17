"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", orderId: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all required fields.");
      return;
    }
    // Simulate API request
    setSubmitted(true);
  };

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="info-page-header">
        <span className="info-page-label">Get In Touch</span>
        <h1 className="info-page-title">Contact Us</h1>
      </div>

      <main className="info-page-container" style={{ flex: 1 }}>
        <div className="contact-grid">
          {/* Details */}
          <div className="contact-details">
            <div className="contact-detail-item">
              <h4>Gourmet Concierge</h4>
              <p>For order queries, tracking help, and subscription assistance.</p>
              <p style={{ marginTop: 8 }}>
                <strong>Email:</strong> concierge@earthybites.in<br />
                <strong>Phone:</strong> +91 22 4972 8900
              </p>
            </div>

            <div className="contact-detail-item">
              <h4>Partnerships & Corporate Gifting</h4>
              <p>For custom gift curation, wholesale supplies, or farm relations.</p>
              <p style={{ marginTop: 8 }}>
                <strong>Email:</strong> partner@earthybites.in
              </p>
            </div>

            <div className="contact-detail-item">
              <h4>Headquarters</h4>
              <p>
                Earthy Bites Private Limited<br />
                4th Floor, Heritage House, Ballard Estate<br />
                Mumbai, MH 400001
              </p>
            </div>

            <div className="contact-detail-item">
              <h4>Operating Hours</h4>
              <p>Monday to Saturday: 10:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div style={{ background: "#ffffff", border: "1px solid var(--border)", padding: "40px", textAlign: "center" }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: "16px" }}>✦</span>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", marginBottom: "12px", color: "var(--text)" }}>Thank You</h3>
                <p style={{ fontSize: "14px", color: "var(--text-mid)", lineHeight: "1.6" }}>
                  Your message has been received. Our concierge team will reach out to you within 24 hours.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => { setForm({ name: "", email: "", orderId: "", message: "" }); setSubmitted(false); }}
                  style={{ marginTop: "24px", display: "inline-flex" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Full Name *</label>
                  <input
                    className="form-input"
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email Address *</label>
                  <input
                    className="form-input"
                    id="contact-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-order">Order Reference ID (Optional)</label>
                  <input
                    className="form-input"
                    id="contact-order"
                    type="text"
                    placeholder="e.g. EB-10243"
                    value={form.orderId}
                    onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message *</label>
                  <textarea
                    className="form-textarea"
                    id="contact-message"
                    required
                    placeholder="How can our concierge assist you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: "12px" }}>
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

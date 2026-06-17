import Link from "next/link";
export default function Footer() {
  return (
    <>
      {/* Newsletter */}
      <div className="newsletter">
        <div>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,151,90,0.6)", display: "block", marginBottom: 12 }}>Stay Connected</span>
          <h2 className="newsletter-title">
            Join the <span>inner</span><br />circle.
          </h2>
        </div>
        <div className="newsletter-right">
          <p className="newsletter-desc">
            Early access to new harvests. Seasonal recipes. Nutrition dispatches from our sourcing team. No noise.
          </p>
          <form className="newsletter-form">
            <input className="newsletter-input" type="email" placeholder="Enter your email address" />
            <button type="submit" className="newsletter-btn">Subscribe →</button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-logo-wrap">
              <img src="/logo.jpg" alt="Earthy Bites" className="footer-logo-img" />
            </div>
            <p className="footer-tagline">
              Nature&apos;s finest harvest, thoughtfully sourced from the world&apos;s most pristine heritage farms and delivered fresh to your table.
            </p>
          </div>
          {[
            { h: "Explore", links: [["Collection", "/shop"], ["Our Story", "/story"], ["The Standard", "/standard"], ["Wellness Journal", "/journal"]] },
            { h: "Help", links: [["Shipping Info", "/shipping"], ["Returns", "/returns"], ["FAQ", "/faq"], ["Contact Us", "/contact"]] },
          ].map((col) => (
            <div className="footer-col" key={col.h}>
              <h4>{col.h}</h4>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Earthy Bites. All rights reserved.</span>
          <span>Nature&apos;s Finest. Delivered Fresh.</span>
        </div>
      </footer>
    </>
  );
}

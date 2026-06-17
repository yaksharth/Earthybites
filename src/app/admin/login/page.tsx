"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, seedDatabase } from "@/lib/supabase";
import { useAdminStore } from "@/lib/store";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginStore = useAdminStore((state) => state.login);
  const user = useAdminStore((state) => state.user);

  useEffect(() => {
    // Seed database on login load
    seedDatabase();

    // Check if already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        loginStore(data.session.user.email, data.session.user.role, data.session.user.name);
        router.push("/admin");
      }
    };
    checkSession();
  }, [router, loginStore]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data?.user) {
      loginStore(data.user.email, data.user.role, data.user.name);
      router.push("/admin");
    }
  };

  const autofill = () => {
    setEmail("admin@earthybites.com");
    setPassword("admin123");
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #f6f1e9 0%, #ffffff 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "var(--sans)"
    }}>
      <div style={{
        background: "#ffffff",
        border: "1px solid #e8e2d9",
        boxShadow: "0 20px 40px rgba(26,20,16,0.06)",
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        borderRadius: "0px"
      }}>
        {/* Header / Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
          <div style={{ width: "70px", height: "70px", overflow: "hidden", border: "1px solid #e8e2d9" }}>
            <img src="/logo.jpg" alt="Earthy Bites" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", color: "#163020", fontWeight: 400, letterSpacing: "-0.01em" }}>Earthy Bites</h1>
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", color: "#b8975a", textTransform: "uppercase" }}>Business Operations</span>
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {error && (
            <div style={{
              background: "#fcf3f2",
              border: "1px solid #f5c2c2",
              color: "#c0392b",
              fontSize: "12px",
              padding: "12px 16px",
              lineHeight: 1.5
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5c5248" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@earthybites.com"
              required
              style={{
                background: "#faf8f4",
                border: "1px solid #e8e2d9",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#1a1410",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#163020"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e8e2d9"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5c5248" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                background: "#faf8f4",
                border: "1px solid #e8e2d9",
                padding: "12px 14px",
                fontSize: "14px",
                color: "#1a1410",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#163020"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e8e2d9"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#163020",
              color: "#faf8f4",
              border: "none",
              padding: "14px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "opacity 0.2s",
              marginTop: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {loading ? "Verifying Credentials..." : "Authenticate"}
          </button>
        </form>

        <div style={{
          borderTop: "1px solid #e8e2d9",
          paddingTop: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "12px", color: "#9c9088" }}>Need fast access for review?</p>
          <button
            onClick={autofill}
            style={{
              background: "none",
              border: "1px dashed #b8975a",
              color: "#b8975a",
              padding: "10px",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            Auto-Fill Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

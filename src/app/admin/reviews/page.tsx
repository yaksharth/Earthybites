"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star, CheckCircle, ShieldAlert, AlertOctagon, Trash } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const loadReviews = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("id", { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();

    const handleDataChange = () => {
      loadReviews();
    };
    window.addEventListener("db_reviews_changed", handleDataChange);
    return () => window.removeEventListener("db_reviews_changed", handleDataChange);
  }, []);

  const handleApprove = async (id: number) => {
    await supabase.from("reviews").update({ status: "APPROVED" }).eq("id", id);
  };

  const handleReject = async (id: number) => {
    await supabase.from("reviews").update({ status: "REJECTED" }).eq("id", id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this review permanently?")) {
      await supabase.from("reviews").delete().eq("id", id);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return r.status === "PENDING";
    if (filter === "SPAM") return r.spamScore > 0.5;
    return r.status === filter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Review Moderation</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Filter automated spam, approve legacy ratings, and read customer testimonials.</p>
        </div>
      </div>

      {/* TABS FILTER */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px",
        display: "flex", gap: "8px", flexWrap: "wrap"
      }}>
        {["ALL", "PENDING", "APPROVED", "SPAM"].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            style={{
              background: filter === st ? "var(--dark)" : "none",
              color: filter === st ? "#ffffff" : "var(--text-mid)",
              border: "1px solid " + (filter === st ? "var(--dark)" : "var(--border)"),
              padding: "6px 12px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
              cursor: "pointer"
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* REVIEWS GRID */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>Loading reviews ledger...</div>
        ) : filteredReviews.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-light)", background: "var(--white)", border: "1px solid var(--border)" }}>No reviews found for filter.</div>
        ) : (
          filteredReviews.map(rev => {
            const isSpam = rev.spamScore > 0.5;
            return (
              <div key={rev.id} style={{
                background: "var(--white)", border: "1px solid " + (isSpam ? "#f5c2c2" : "var(--border)"),
                padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)" }}>{rev.productName}</span>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: "4px 0" }}>{rev.customerName}</h3>
                    <div style={{ display: "flex", gap: "2px", color: "var(--gold)" }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={12} fill={idx < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {isSpam && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px",
                        background: "#fcf3f2", border: "1px solid #f5c2c2", color: "#c0392b", fontSize: "10px", fontWeight: 700
                      }}>
                        <AlertOctagon size={12} /> Spam Flag ({Math.round(rev.spamScore * 100)}%)
                      </span>
                    )}

                    <span style={{
                      display: "inline-block", padding: "2px 8px", fontSize: "9px", fontWeight: 700,
                      background: rev.status === "APPROVED" ? "#ebf7ee" : rev.status === "REJECTED" ? "#fcf3f2" : "#fef8eb",
                      color: rev.status === "APPROVED" ? "#27ae60" : rev.status === "REJECTED" ? "#c0392b" : "#f39c12"
                    }}>
                      {rev.status}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-mid)", lineHeight: 1.6, margin: 0 }}>
                  &quot;{rev.content}&quot;
                </p>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "8px" }}>
                  {rev.status === "PENDING" && (
                    <>
                      <button onClick={() => handleApprove(rev.id)} style={{
                        background: "none", border: "1px solid #27ae60", color: "#27ae60",
                        padding: "6px 12px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer"
                      }}>
                        Approve
                      </button>
                      <button onClick={() => handleReject(rev.id)} style={{
                        background: "none", border: "1px solid #c0392b", color: "#c0392b",
                        padding: "6px 12px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer"
                      }}>
                        Reject
                      </button>
                    </>
                  )}
                  {rev.status !== "PENDING" && (
                    <button onClick={() => handleDelete(rev.id)} style={{
                      background: "none", border: "none", color: "var(--text-light)",
                      display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, cursor: "pointer"
                    }} onMouseEnter={e => e.currentTarget.style.color="#c0392b"} onMouseLeave={e => e.currentTarget.style.color="var(--text-light)"}>
                      <Trash size={12} /> Delete Permanently
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

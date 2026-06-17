"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Folder, Image, Plus, Trash2, Edit2, ShieldAlert } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);

  const [formFields, setFormFields] = useState({
    name: "",
    count: 0,
    banner: "/hero.jpg",
    seoTitle: "",
    seoDesc: ""
  });

  const loadCategories = () => {
    // Generate static list of categories based on existing data
    setCategories([
      { id: 1, name: "Almonds", count: 4, banner: "/products/almonds.png", seoTitle: "Premium California & Mamra Almonds", seoDesc: "Browse the finest single-origin Mamra, Gurbandi, and California almonds." },
      { id: 2, name: "Pistachios", count: 3, banner: "/products/pistachios.png", seoTitle: "Earthy Iranian & Turkish Pistachios", seoDesc: "Rich, split-kernel Antep and Kerman pistachios." },
      { id: 3, name: "Dates", count: 4, banner: "/products/dates.png", seoTitle: "Medina Ajwa & Jordan Medjool Dates", seoDesc: "Sweet, soft, organic oasis dates." },
      { id: 4, name: "Walnuts", count: 2, banner: "/products/walnuts.png", seoTitle: "Himalayan Kashmir Walnuts", seoDesc: "Wild-harvested paper-shell walnuts from Kashmir." },
      { id: 5, name: "Cashews", count: 3, banner: "/products/cashews.png", seoTitle: "Jumbo Kollam Cashew Nuts", seoDesc: "Whole raw and masala roasted premium cashews." },
      { id: 6, name: "Raisins", count: 4, banner: "/products/raisins.png", seoTitle: "Kandahar Sun-dried Raisins", seoDesc: "Plump green, golden and Munakka raisins." }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenForm = (cat: any | null = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormFields({
        name: cat.name,
        count: cat.count,
        banner: cat.banner,
        seoTitle: cat.seoTitle || "",
        seoDesc: cat.seoDesc || ""
      });
    } else {
      setEditingCat(null);
      setFormFields({
        name: "",
        count: 0,
        banner: "/hero.jpg",
        seoTitle: "",
        seoDesc: ""
      });
    }
    setFormOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, ...formFields } : c));
    } else {
      setCategories(prev => [...prev, { id: prev.length + 1, ...formFields }]);
    }
    setFormOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this category? Products in this category will become uncategorized.")) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Categories</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Manage product collections, banners, and search listings.</p>
        </div>
        <button onClick={() => handleOpenForm(null)} className="btn-primary" style={{ gap: "8px" }}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {categories.map(cat => (
          <div key={cat.id} style={{
            background: "var(--white)", border: "1px solid var(--border)",
            display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
          }}>
            <div style={{ height: "120px", background: "#f0ece4", overflow: "hidden", position: "relative" }}>
              <img src={cat.banner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
              <h3 style={{ position: "absolute", bottom: "16px", left: "16px", color: "#ffffff", fontFamily: "var(--sans)", fontSize: "1.25rem", fontWeight: 600 }}>{cat.name}</h3>
              <span style={{ position: "absolute", bottom: "16px", right: "16px", color: "#faf8f4", fontSize: "10px", fontWeight: 700, background: "rgba(26,20,16,0.5)", padding: "2px 8px" }}>
                {cat.count} Items
              </span>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              <div style={{ fontSize: "12px", color: "var(--text-mid)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--text)", display: "block", marginBottom: "4px" }}>SEO Meta Title</strong>
                {cat.seoTitle || "None configured"}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                <button onClick={() => handleOpenForm(cat)} style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color="var(--text)"} onMouseLeave={e => e.currentTarget.style.color="var(--text-light)"}>
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id)} style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color="#c0392b"} onMouseLeave={e => e.currentTarget.style.color="var(--text-light)"}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setFormOpen(false)} style={{ zIndex: 200 }} />
          <div className="drawer" role="dialog" aria-modal="true" style={{ zIndex: 201 }}>
            <div className="drawer-head">
              <span className="drawer-head-label">{editingCat ? "Modify Category" : "New Category"}</span>
              <button className="drawer-close" onClick={() => setFormOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", flex: 1, overflowY: "auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Category Name</label>
                <input
                  type="text"
                  required
                  value={formFields.name}
                  onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Banner Image Path</label>
                <input
                  type="text"
                  required
                  value={formFields.banner}
                  onChange={(e) => setFormFields({ ...formFields, banner: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>SEO Title</label>
                <input
                  type="text"
                  value={formFields.seoTitle}
                  onChange={(e) => setFormFields({ ...formFields, seoTitle: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>SEO Meta Description</label>
                <textarea
                  value={formFields.seoDesc}
                  onChange={(e) => setFormFields({ ...formFields, seoDesc: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px", fontSize: "13px", outline: "none", minHeight: "80px", resize: "vertical", fontFamily: "var(--sans)", color: "var(--text)" }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "12px" }}>
                Save Category
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
import { X } from "lucide-react";

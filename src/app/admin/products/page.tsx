"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/products";
import {
  Plus, Edit, Trash2, Copy, FileDown, FileUp, Search, X, Check, Eye
} from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Selection states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Drawer Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formFields, setFormFields] = useState({
    name: "",
    origin: "",
    price: "",
    oldPrice: "",
    discount: "",
    img: "/products/almonds.png",
    tag: "NEW HARVEST" as any,
    tagline: "",
    flavor: "",
    nutrition: "",
    harvest: "",
    sku: "",
    category: "",
    costPrice: "",
    stock: 0,
    status: "ACTIVE"
  });

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();

    const handleDataChange = () => {
      loadProducts();
    };
    window.addEventListener("db_products_changed", handleDataChange);
    return () => window.removeEventListener("db_products_changed", handleDataChange);
  }, []);

  const handleOpenForm = (prod: any | null = null) => {
    if (prod) {
      setEditingProduct(prod);
      setFormFields({
        name: prod.name || "",
        origin: prod.origin || "",
        price: prod.price || "",
        oldPrice: prod.oldPrice || "",
        discount: prod.discount || "",
        img: prod.img || "/products/almonds.png",
        tag: prod.tag || "NEW HARVEST",
        tagline: prod.tagline || "",
        flavor: prod.flavor || "",
        nutrition: prod.nutrition || "",
        harvest: prod.harvest || "",
        sku: prod.sku || "",
        category: prod.category || "",
        costPrice: prod.costPrice || "",
        stock: prod.stock || 0,
        status: prod.status || "ACTIVE"
      });
    } else {
      setEditingProduct(null);
      setFormFields({
        name: "",
        origin: "",
        price: "₹599",
        oldPrice: "",
        discount: "",
        img: "/products/almonds.png",
        tag: "NEW HARVEST",
        tagline: "",
        flavor: "",
        nutrition: "",
        harvest: "",
        sku: "",
        category: "Almonds",
        costPrice: "₹380",
        stock: 50,
        status: "ACTIVE"
      });
    }
    setFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formFields.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const row = {
      ...formFields,
      slug
    };

    if (editingProduct) {
      await supabase.from("products").update(row).eq("id", editingProduct.id);
    } else {
      await supabase.from("products").insert(row);
    }
    setFormOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await supabase.from("products").delete().eq("id", id);
    }
  };

  const handleDuplicate = async (prod: any) => {
    const duplicated = {
      ...prod,
      id: undefined,
      name: `${prod.name} (Copy)`,
      sku: `${prod.sku}-COPY`
    };
    await supabase.from("products").insert(duplicated);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected products?`)) {
      for (const id of selectedIds) {
        await supabase.from("products").delete().eq("id", id);
      }
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = "id,name,sku,category,price,costPrice,stock,origin,status\n";
    const rows = products.map(p => 
      `"${p.id}","${p.name}","${p.sku}","${p.category}","${p.price}","${p.costPrice}","${p.stock}","${p.origin}","${p.status}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `earthybites_products_${Date.now()}.csv`;
    link.click();
  };

  // Mock CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").slice(1);
      const imported: any[] = [];
      
      lines.forEach((line) => {
        const parts = line.split(",").map(p => p.replace(/"/g, "").trim());
        if (parts.length >= 7) {
          imported.push({
            name: parts[1],
            sku: parts[2],
            category: parts[3],
            price: parts[4],
            costPrice: parts[5],
            stock: parseInt(parts[6], 10) || 10,
            origin: parts[7] || "Imported",
            tag: "NEW HARVEST",
            status: parts[8] || "ACTIVE",
            img: "/products/almonds.png",
            tagline: "Imported batch",
            flavor: "Raw",
            nutrition: "Vitamins",
            harvest: "September"
          });
        }
      });

      if (imported.length > 0) {
        await supabase.from("products").insert(imported);
        alert(`Successfully imported ${imported.length} products!`);
      }
    };
    reader.readAsText(file);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Almonds", "Pistachios", "Dates", "Walnuts", "Macadamia", "Raisins", "Hazelnuts", "Cashews"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Products Catalog</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Create, edit, duplicate, and adjust Earthy Bites inventory offerings.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {/* CSV Import */}
          <label style={{
            background: "var(--white)", border: "1px solid var(--border)", color: "var(--text-mid)",
            padding: "10px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer"
          }}>
            <FileUp size={14} /> Import
            <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: "none" }} />
          </label>
          {/* CSV Export */}
          <button onClick={exportCSV} style={{
            background: "var(--white)", border: "1px solid var(--border)", color: "var(--text-mid)",
            padding: "10px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "8px"
          }}>
            <FileDown size={14} /> Export
          </button>
          {/* Add Product */}
          <button onClick={() => handleOpenForm(null)} className="btn-primary" style={{ gap: "8px", padding: "10px 20px" }}>
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px"
      }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", maxWidth: "320px", position: "relative" }}>
          <Search size={16} style={{ color: "var(--text-light)" }} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: "13px", width: "100%", color: "var(--text)" }}
          />
        </div>

        {/* Categories filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                background: categoryFilter === cat ? "var(--dark)" : "none",
                color: categoryFilter === cat ? "#ffffff" : "var(--text-mid)",
                border: "1px solid " + (categoryFilter === cat ? "var(--dark)" : "var(--border)"),
                padding: "6px 12px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                cursor: "pointer"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* BULK ACTIONS CONTAINER */}
      {selectedIds.length > 0 && (
        <div style={{
          background: "#163020", color: "#faf8f4", padding: "12px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ fontSize: "12px", fontWeight: 600 }}>{selectedIds.length} items selected</span>
          <button onClick={handleBulkDelete} style={{
            background: "none", border: "1px solid rgba(250,250,250,0.3)", color: "#faf8f4",
            padding: "6px 12px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer"
          }}>
            Bulk Delete Selected
          </button>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "var(--text-light)" }}>Loading inventory table...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "var(--text-light)" }}>No products match filters.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 24px", width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th style={{ padding: "16px 8px" }}>Image</th>
                <th style={{ padding: "16px 8px" }}>Name / SKU</th>
                <th style={{ padding: "16px 8px" }}>Category</th>
                <th style={{ padding: "16px 8px" }}>Sales Price</th>
                <th style={{ padding: "16px 8px" }}>Cost Price</th>
                <th style={{ padding: "16px 8px" }}>Stock</th>
                <th style={{ padding: "16px 8px" }}>Status</th>
                <th style={{ padding: "16px 24px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", background: isSelected ? "var(--cream)" : "none" }}>
                    <td style={{ padding: "12px 24px" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ width: "45px", aspectRatio: "3/4", background: "var(--cream)", overflow: "hidden", border: "1px solid var(--border)" }}>
                        <img src={p.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{p.name}</div>
                      <span style={{ fontSize: "10px", color: "var(--text-light)", letterSpacing: "0.05em" }}>{p.sku || "NO-SKU"}</span>
                    </td>
                    <td style={{ padding: "12px 8px", color: "var(--text-mid)" }}>{p.category}</td>
                    <td style={{ padding: "12px 8px", fontWeight: 600 }}>{p.price}</td>
                    <td style={{ padding: "12px 8px", color: "var(--text-light)" }}>{p.costPrice || "—"}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <span style={{
                        fontWeight: 600,
                        color: p.stock <= 15 ? "#c0392b" : "var(--text)"
                      }}>
                        {p.stock}
                      </span>
                      {p.stock <= 15 && <span style={{ fontSize: "8px", fontWeight: 700, color: "#c0392b", textTransform: "uppercase", display: "block" }}>LOW</span>}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <span style={{
                        display: "inline-block", padding: "2px 6px", fontSize: "9px", fontWeight: 700,
                        background: p.status === "ACTIVE" ? "#ebf7ee" : "#f0f0f0",
                        color: p.status === "ACTIVE" ? "#27ae60" : "#7f8c8d"
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 24px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button onClick={() => handleDuplicate(p)} title="Duplicate" style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--text)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-light)"}><Copy size={14} /></button>
                        <button onClick={() => handleOpenForm(p)} title="Edit" style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => e.currentTarget.style.color="var(--text)"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-light)"}><Edit size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} title="Delete" style={{ background: "none", border: "none", color: "var(--text-light)", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => e.currentTarget.style.color="#c0392b"} onMouseLeave={(e) => e.currentTarget.style.color="var(--text-light)"}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* DRAWER FORM */}
      {formOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setFormOpen(false)} style={{ zIndex: 200 }} />
          <div className="drawer" role="dialog" aria-modal="true" style={{ width: "min(500px, 100vw)", zIndex: 201 }}>
            <div className="drawer-head">
              <span className="drawer-head-label">{editingProduct ? "Edit Product Details" : "Create New Product"}</span>
              <button className="drawer-close" onClick={() => setFormOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", flex: 1, padding: "24px", overflowY: "auto", gap: "20px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Product Name</label>
                <input
                  type="text"
                  required
                  value={formFields.name}
                  onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>SKU</label>
                  <input
                    type="text"
                    required
                    value={formFields.sku}
                    onChange={(e) => setFormFields({ ...formFields, sku: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Category</label>
                  <select
                    value={formFields.category}
                    onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Sales Price</label>
                  <input
                    type="text"
                    required
                    value={formFields.price}
                    onChange={(e) => setFormFields({ ...formFields, price: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Cost Price</label>
                  <input
                    type="text"
                    value={formFields.costPrice}
                    onChange={(e) => setFormFields({ ...formFields, costPrice: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Stock Level</label>
                  <input
                    type="number"
                    required
                    value={formFields.stock}
                    onChange={(e) => setFormFields({ ...formFields, stock: parseInt(e.target.value, 10) || 0 })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Origin Country</label>
                  <input
                    type="text"
                    value={formFields.origin}
                    onChange={(e) => setFormFields({ ...formFields, origin: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Product Status</label>
                  <select
                    value={formFields.status}
                    onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                    style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Description Tagline</label>
                <textarea
                  value={formFields.tagline}
                  onChange={(e) => setFormFields({ ...formFields, tagline: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", minHeight: "60px", resize: "vertical", fontFamily: "var(--sans)", color: "var(--text)" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Nutrition Value</label>
                <input
                  type="text"
                  value={formFields.nutrition}
                  onChange={(e) => setFormFields({ ...formFields, nutrition: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mid)" }}>Harvest Details</label>
                <input
                  type="text"
                  value={formFields.harvest}
                  onChange={(e) => setFormFields({ ...formFields, harvest: e.target.value })}
                  style={{ background: "#faf8f4", border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", color: "var(--text)" }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: "12px" }}>
                {editingProduct ? "Save Operations Updates" : "Create Operations Listing"}
              </button>

            </form>
          </div>
        </>
      )}

    </div>
  );
}

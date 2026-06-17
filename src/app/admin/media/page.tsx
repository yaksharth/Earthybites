"use client";
import { useState, useEffect } from "react";
import {
  Image as ImageIcon, Folder, Grid, List, Search, UploadCloud, Copy, Trash, Eye, Calendar, HardDrive, Info, Check
} from "lucide-react";

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  folder: "products" | "journal" | "banners" | "brand";
  size: string;
  dimensions: string;
  createdAt: string;
}

export default function AdminMedia() {
  const [activeFolder, setActiveFolder] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Initial media assets seed
  useEffect(() => {
    const stored = localStorage.getItem("db_media_assets");
    if (stored) {
      setAssets(JSON.parse(stored));
    } else {
      const defaultAssets: MediaAsset[] = [
        { id: "m1", name: "california_almonds.png", url: "/products/almonds.png", folder: "products", size: "142 KB", dimensions: "1200 x 1200", createdAt: "2026-06-10" },
        { id: "m2", name: "mamra_almonds.png", url: "/products/mamra_almonds.png", folder: "products", size: "158 KB", dimensions: "1200 x 1200", createdAt: "2026-06-10" },
        { id: "m3", name: "medjool_dates.png", url: "/products/dates.png", folder: "products", size: "204 KB", dimensions: "1200 x 1200", createdAt: "2026-06-11" },
        { id: "m4", name: "ajwa_dates.png", url: "/products/ajwa_dates.png", folder: "products", size: "189 KB", dimensions: "1200 x 1200", createdAt: "2026-06-11" },
        { id: "m5", name: "kashmir_walnuts.png", url: "/products/walnuts.png", folder: "products", size: "212 KB", dimensions: "1200 x 1200", createdAt: "2026-06-12" },
        { id: "m6", name: "sourcing_dates_jordan.jpg", url: "/products/featured-almonds.png", folder: "journal", size: "512 KB", dimensions: "1920 x 1080", createdAt: "2026-05-12" },
        { id: "m7", name: "hero_harvest_collection.png", url: "/products/featured-almonds.png", folder: "banners", size: "890 KB", dimensions: "2400 x 1600", createdAt: "2026-06-01" },
        { id: "m8", name: "earthy_bites_logo.jpg", url: "/logo.jpg", folder: "brand", size: "48 KB", dimensions: "500 x 500", createdAt: "2026-06-01" }
      ];
      localStorage.setItem("db_media_assets", JSON.stringify(defaultAssets));
      setAssets(defaultAssets);
    }
  }, []);

  const saveAssets = (newAssets: MediaAsset[]) => {
    setAssets(newAssets);
    localStorage.setItem("db_media_assets", JSON.stringify(newAssets));
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(window.location.origin + asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this asset from storage?")) {
      const updated = assets.filter(a => a.id !== id);
      saveAssets(updated);
      if (selectedAsset?.id === id) setSelectedAsset(null);
    }
  };

  const simulateUpload = (fileName: string) => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newAsset: MediaAsset = {
              id: "m_" + Date.now(),
              name: fileName.toLowerCase().replace(/\s+/g, "_"),
              url: "/products/almonds.png", // fallback placeholder for mock upload representation
              folder: activeFolder === "ALL" ? "products" : activeFolder as any,
              size: `${Math.floor(Math.random() * 300) + 50} KB`,
              dimensions: "1200 x 1200",
              createdAt: new Date().toISOString().split("T")[0]
            };
            saveAssets([newAsset, ...assets]);
            setUploadProgress(null);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files[0].name);
    }
  };

  // Filtered assets
  const filteredAssets = assets.filter(a => {
    const folderMatch = activeFolder === "ALL" ? true : a.folder === activeFolder;
    const searchMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return folderMatch && searchMatch;
  });

  const folders = [
    { label: "All Items", key: "ALL", count: assets.length },
    { label: "Product Listing Assets", key: "products", count: assets.filter(a => a.folder === "products").length },
    { label: "Journal Editor Images", key: "journal", count: assets.filter(a => a.folder === "journal").length },
    { label: "Hero Banners", key: "banners", count: assets.filter(a => a.folder === "banners").length },
    { label: "Brand Identity", key: "brand", count: assets.filter(a => a.folder === "brand").length }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Media Storage</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Host brand logos, product details cards, and marketing asset folders.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--white)", border: "1px solid var(--border)", padding: "6px 12px", fontSize: "11px", fontWeight: 600, color: "var(--text-mid)" }}>
          <HardDrive size={14} />
          <span>Storage Mock Allocation: 1.4 MB / 100 MB</span>
        </div>
      </div>

      {/* WORKSPACE PANELS */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Folders Directory */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-light)" }}>Directories</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {folders.map(f => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFolder(f.key);
                  setSelectedAsset(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  fontSize: "12px",
                  fontWeight: activeFolder === f.key ? 600 : 500,
                  color: activeFolder === f.key ? "#ffffff" : "var(--text-mid)",
                  background: activeFolder === f.key ? "#163020" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Folder size={14} style={{ opacity: 0.8 }} />
                  <span>{f.key === "ALL" ? "All assets" : f.key}</span>
                </div>
                <span style={{ fontSize: "10px", opacity: 0.6 }}>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Assets Explorer Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* SEARCH, VIEW TOGGLE, UPLOAD ACTIONS */}
          <div style={{
            background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px"
          }}>
            {/* Search Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--border)", padding: "6px 12px", width: "100%", maxWidth: "280px", background: "var(--cream)" }}>
              <Search size={14} style={{ color: "var(--text-light)" }} />
              <input
                type="text"
                placeholder="Search storage folder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "none", background: "none", fontSize: "12px", outline: "none", width: "100%", color: "var(--text)" }}
              />
            </div>

            {/* Layout Toggler & Upload Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", border: "1px solid var(--border)" }}>
                <button
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: "6px 10px", background: viewMode === "grid" ? "var(--cream)" : "#ffffff",
                    border: "none", borderRight: "1px solid var(--border)", cursor: "pointer", display: "flex", color: "var(--text-mid)"
                  }}
                >
                  <Grid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  style={{
                    padding: "6px 10px", background: viewMode === "list" ? "var(--cream)" : "#ffffff",
                    border: "none", cursor: "pointer", display: "flex", color: "var(--text-mid)"
                  }}
                >
                  <List size={14} />
                </button>
              </div>

              {/* Uploader Input */}
              <label style={{
                background: "#163020", color: "#ffffff", padding: "8px 16px", fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"
              }}>
                <UploadCloud size={14} />
                Upload Asset
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          {/* UPLOAD PROGRESS FEEDBACK */}
          {uploadProgress !== null && (
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 600, color: "var(--text-mid)", marginBottom: "8px" }}>
                <span>Uploading local file to server storage bucket...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ width: "100%", height: "4px", background: "var(--cream)" }}>
                <div style={{ width: `${uploadProgress}%`, height: "100%", background: "var(--gold)", transition: "width 0.2s" }} />
              </div>
            </div>
          )}

          {/* EXPLORER GRID / LIST AREA */}
          <div style={{ display: "grid", gridTemplateColumns: selectedAsset ? "1fr 280px" : "1fr", gap: "24px", alignItems: "start" }}>
            
            {/* Assets Pane */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Drag Area wrapper */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: dragging ? "2px dashed var(--gold)" : "2px dashed transparent",
                  background: dragging ? "rgba(184, 151, 90, 0.05)" : "transparent",
                  padding: "4px",
                  transition: "all 0.2s"
                }}
              >
                {filteredAssets.length === 0 ? (
                  <div style={{
                    background: "var(--white)", border: "1px solid var(--border)", padding: "80px 40px",
                    textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px"
                  }}>
                    <UploadCloud size={32} style={{ color: "var(--text-light)" }} />
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>Drag & Drop assets here to upload</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-light)" }}>Supported file types: PNG, JPEG, SVG up to 10MB.</p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "16px"
                  }}>
                    {filteredAssets.map(asset => {
                      const isSelected = selectedAsset?.id === asset.id;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          style={{
                            background: "var(--white)",
                            border: `1px solid ${isSelected ? "var(--gold)" : "var(--border)"}`,
                            boxShadow: isSelected ? "0 0 0 2px rgba(184,151,90,0.15)" : "none",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            transition: "all 0.15s"
                          }}
                        >
                          {/* Image Thumbnail */}
                          <div style={{ height: "100px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                            <img src={asset.url} alt={asset.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                            <span style={{
                              position: "absolute", top: "4px", right: "4px", fontSize: "8px", fontWeight: 700,
                              background: "rgba(0,0,0,0.65)", color: "#ffffff", padding: "2px 4px", textTransform: "uppercase"
                            }}>
                              {asset.folder}
                            </span>
                          </div>
                          {/* Title Label */}
                          <div style={{ padding: "8px 12px", borderTop: "1px solid var(--border)" }}>
                            <p style={{
                              margin: 0, fontSize: "11px", fontWeight: 600, color: "var(--text)",
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }}>
                              {asset.name}
                            </p>
                            <span style={{ fontSize: "9px", color: "var(--text-light)" }}>{asset.size}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* List View Table */
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", background: "var(--white)", border: "1px solid var(--border)" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "left" }}>
                        <th style={{ padding: "12px 16px" }}>Thumbnail</th>
                        <th style={{ padding: "12px 16px" }}>Name</th>
                        <th style={{ padding: "12px 16px" }}>Directory</th>
                        <th style={{ padding: "12px 16px" }}>Dimensions</th>
                        <th style={{ padding: "12px 16px" }}>Weight</th>
                        <th style={{ padding: "12px 16px" }}>Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map(asset => {
                        const isSelected = selectedAsset?.id === asset.id;
                        return (
                          <tr
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            style={{
                              borderBottom: "1px solid var(--border)", cursor: "pointer",
                              background: isSelected ? "var(--cream)" : "transparent"
                            }}
                          >
                            <td style={{ padding: "8px 16px" }}>
                              <img src={asset.url} alt="" style={{ width: "32px", height: "32px", objectFit: "contain", border: "1px solid var(--border)", padding: "2px" }} />
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>{asset.name}</td>
                            <td style={{ padding: "12px 16px", textTransform: "uppercase", fontSize: "10px", color: "var(--gold)", fontWeight: 700 }}>{asset.folder}</td>
                            <td style={{ padding: "12px 16px", color: "var(--text-mid)" }}>{asset.dimensions}</td>
                            <td style={{ padding: "12px 16px", color: "var(--text-mid)" }}>{asset.size}</td>
                            <td style={{ padding: "12px 16px", color: "var(--text-light)" }}>{asset.createdAt}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Sidebar Inspector Panel */}
            {selectedAsset && (
              <div style={{
                background: "var(--white)", border: "1px solid var(--border)", padding: "20px",
                display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "96px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)" }}>Inspector Panel</span>
                  <button onClick={() => setSelectedAsset(null)} style={{ background: "none", border: "none", fontSize: "10px", fontWeight: 600, cursor: "pointer", color: "var(--text-light)" }}>CLOSE</button>
                </div>

                {/* Inspect Image Box */}
                <div style={{ background: "var(--cream)", border: "1px solid var(--border)", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", height: "160px", overflow: "hidden" }}>
                  <img src={selectedAsset.url} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>

                {/* Info Ledger */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
                  <div>
                    <span style={{ fontSize: "9px", color: "var(--text-light)", textTransform: "uppercase" }}>File Name</span>
                    <p style={{ margin: "2px 0 0", fontWeight: 600, color: "var(--text)", wordBreak: "break-all" }}>{selectedAsset.name}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "9px", color: "var(--text-light)", textTransform: "uppercase" }}>Resolution Dimensions</span>
                    <p style={{ margin: "2px 0 0", fontWeight: 500, color: "var(--text)" }}>{selectedAsset.dimensions}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "9px", color: "var(--text-light)", textTransform: "uppercase" }}>Size Weight</span>
                    <p style={{ margin: "2px 0 0", fontWeight: 500, color: "var(--text)" }}>{selectedAsset.size}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "9px", color: "var(--text-light)", textTransform: "uppercase" }}>Registered Date</span>
                    <p style={{ margin: "2px 0 0", fontWeight: 500, color: "var(--text)" }}>{selectedAsset.createdAt}</p>
                  </div>
                </div>

                {/* Copy / Delete CTA Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                  <button
                    onClick={() => handleCopyUrl(selectedAsset)}
                    style={{
                      background: copiedId === selectedAsset.id ? "#27ae60" : "none",
                      color: copiedId === selectedAsset.id ? "#ffffff" : "var(--text)",
                      border: copiedId === selectedAsset.id ? "1px solid #27ae60" : "1px solid var(--border)",
                      padding: "8px 14px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer"
                    }}
                  >
                    {copiedId === selectedAsset.id ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedId === selectedAsset.id ? "Copied" : "Copy URL"}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(selectedAsset.id)}
                    style={{
                      background: "none", color: "#c0392b", border: "1px solid #fcf3f2",
                      padding: "8px 14px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fcf3f2"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <Trash size={12} />
                    <span>Delete File</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

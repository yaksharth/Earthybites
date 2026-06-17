"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookOpen, Search, Plus, Edit, Trash, Calendar, User, Tag, FileText, Check } from "lucide-react";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  
  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<any | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Sourcing Dispatch");
  const [status, setStatus] = useState("DRAFT");
  const [publishedAt, setPublishedAt] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");

  const loadBlogs = async () => {
    setLoading(true);
    const { data } = await supabase.from("blogs").select("*").order("id", { ascending: false });
    if (data) setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
    const handleDataChange = () => {
      loadBlogs();
    };
    window.addEventListener("db_blogs_changed", handleDataChange);
    return () => window.removeEventListener("db_blogs_changed", handleDataChange);
  }, []);

  const openAddDrawer = () => {
    setCurrentPost(null);
    setTitle("");
    setAuthor("Earthy Sourcing");
    setCategory("Sourcing Dispatch");
    setStatus("DRAFT");
    setPublishedAt(new Date().toISOString().split("T")[0]);
    setContent("");
    setSeoTitle("");
    setDrawerOpen(true);
  };

  const openEditDrawer = (post: any) => {
    setCurrentPost(post);
    setTitle(post.title);
    setAuthor(post.author);
    setCategory(post.category);
    setStatus(post.status);
    setPublishedAt(post.publishedAt || new Date().toISOString().split("T")[0]);
    setContent(post.content);
    setSeoTitle(post.seoTitle || "");
    setDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      await supabase.from("blogs").delete().eq("id", id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please provide a title and content.");
      return;
    }

    const payload = {
      title,
      author,
      category,
      status,
      publishedAt: status === "PUBLISHED" ? publishedAt : "",
      content,
      seoTitle: seoTitle || title
    };

    if (currentPost) {
      // Update
      await supabase.from("blogs").update(payload).eq("id", currentPost.id);
    } else {
      // Insert
      await supabase.from("blogs").insert(payload);
    }
    setDrawerOpen(false);
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesFilter = filter === "ALL" ? true : b.status === filter;
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title / Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Wellness Journal Editor</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Write editorial features, schedule harvests dispatches, and review metadata.</p>
        </div>
        <button
          onClick={openAddDrawer}
          style={{
            background: "#163020",
            color: "#ffffff",
            border: "none",
            padding: "10px 20px",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer"
          }}
        >
          <Plus size={14} /> New Journal Entry
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div style={{
        background: "var(--white)",
        border: "1px solid var(--border)",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        {/* Status Tabs */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["ALL", "PUBLISHED", "DRAFT"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                background: filter === st ? "var(--dark)" : "none",
                color: filter === st ? "#ffffff" : "var(--text-mid)",
                border: "1px solid " + (filter === st ? "var(--dark)" : "var(--border)"),
                padding: "6px 12px",
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer"
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--border)", padding: "6px 12px", width: "100%", maxWidth: "320px", background: "var(--cream)" }}>
          <Search size={14} style={{ color: "var(--text-light)" }} />
          <input
            type="text"
            placeholder="Search articles, authors, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              background: "none",
              fontSize: "12px",
              outline: "none",
              width: "100%",
              color: "var(--text)"
            }}
          />
        </div>
      </div>

      {/* ARTICLES LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>Syncing editorial log...</div>
        ) : filteredBlogs.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", background: "var(--white)", border: "1px solid var(--border)" }}>
            <BookOpen size={32} style={{ color: "var(--gold)", margin: "0 auto 12px" }} />
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>No Articles Found</p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-light)" }}>Create a new journal entry to populate the Wellness Journal.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px"
          }}>
            {filteredBlogs.map((post) => (
              <div
                key={post.id}
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                }}
              >
                <div>
                  {/* Category & Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Tag size={10} /> {post.category}
                    </span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      background: post.status === "PUBLISHED" ? "#ebf7ee" : "#fef8eb",
                      color: post.status === "PUBLISHED" ? "#27ae60" : "#f39c12"
                    }}>
                      {post.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--text)", margin: "0 0 10px", lineHeight: 1.3 }}>
                    {post.title}
                  </h3>

                  {/* Snippet */}
                  <p style={{ fontSize: "12px", color: "var(--text-mid)", lineHeight: 1.5, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.content}
                  </p>

                  {/* Author / Date */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-light)" }}>
                      <User size={12} />
                      <span>{post.author}</span>
                    </div>
                    {post.publishedAt && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--text-light)" }}>
                        <Calendar size={12} />
                        <span>{post.publishedAt}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-light)" }}>
                    SEO: {post.seoTitle || "None"}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => openEditDrawer(post)}
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        padding: "6px",
                        cursor: "pointer",
                        color: "var(--text-mid)",
                        display: "flex",
                        alignItems: "center"
                      }}
                      title="Edit Post"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        padding: "6px",
                        cursor: "pointer",
                        color: "#c0392b",
                        display: "flex",
                        alignItems: "center"
                      }}
                      title="Delete Post"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* DRAWER FOR EDITING / CREATING */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1000,
              cursor: "pointer"
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "520px",
              background: "#ffffff",
              zIndex: 1001,
              boxShadow: "-10px 0 30px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid var(--border)"
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: "24px 32px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>
                  {currentPost ? "Update Feature Article" : "Write New Feature"}
                </span>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", color: "var(--text)", margin: "4px 0 0" }}>
                  {currentPost ? "Edit Journal Entry" : "New Journal Entry"}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-light)",
                  cursor: "pointer"
                }}
              >
                DISMISS
              </button>
            </div>

            {/* Drawer Form */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Title */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Article Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sourcing Pecans from Wilderness Orchards"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "var(--sans)"
                  }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Author */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sourcing Team"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                      outline: "none"
                    }}
                    required
                  />
                </div>

                {/* Category */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Category Tag</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                      outline: "none",
                      background: "#ffffff"
                    }}
                  >
                    <option value="Sourcing Dispatch">Sourcing Dispatch</option>
                    <option value="Nutrition Science">Nutrition Science</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Slow Living">Slow Living</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Publish Status</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["DRAFT", "PUBLISHED"].map((st) => (
                    <label
                      key={st}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "12px",
                        border: `1px solid ${status === st ? "var(--dark)" : "var(--border)"}`,
                        background: status === st ? "var(--cream)" : "transparent",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        textTransform: "uppercase"
                      }}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={st}
                        checked={status === st}
                        onChange={() => setStatus(st)}
                        style={{ display: "none" }}
                      />
                      {status === st && <Check size={12} style={{ color: "var(--gold)" }} />}
                      {st}
                    </label>
                  ))}
                </div>
              </div>

              {/* Publish Date */}
              {status === "PUBLISHED" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Published/Scheduled Date</label>
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid var(--border)",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                </div>
              )}

              {/* SEO Title */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>SEO Custom Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sourcing Organic Pecans Sourcing Sells"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>

              {/* Content Editor */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Article Content</label>
                <textarea
                  placeholder="Write editorial narrative here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{
                    flex: 1,
                    minHeight: "220px",
                    padding: "14px",
                    border: "1px solid var(--border)",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "var(--sans)",
                    lineHeight: 1.6,
                    resize: "none"
                  }}
                  required
                />
              </div>

              {/* Drawer Footer Actions */}
              <div style={{ display: "flex", gap: "12px", paddingTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "none",
                    border: "1px solid var(--border)",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    color: "var(--text-mid)"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: "14px",
                    background: "#163020",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: "pointer"
                  }}
                >
                  {currentPost ? "Save Changes" : "Publish Article"}
                </button>
              </div>

            </form>
          </div>
        </>
      )}

    </div>
  );
}

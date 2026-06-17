"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Plus, Search, Edit, Trash2, Key, Check, AlertCircle, UserCheck, UserX } from "lucide-react";

export default function AdminMembers() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MANAGER");
  const [status, setStatus] = useState("ACTIVE");
  const [permissions, setPermissions] = useState<string[]>([]);

  const loadAdmins = async () => {
    setLoading(true);
    const { data } = await supabase.from("admins").select("*").order("id", { ascending: true });
    if (data) setAdmins(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
    const handleDataChange = () => {
      loadAdmins();
    };
    window.addEventListener("db_admins_changed", handleDataChange);
    return () => window.removeEventListener("db_admins_changed", handleDataChange);
  }, []);

  const openAddDrawer = () => {
    setCurrentAdmin(null);
    setName("");
    setEmail("");
    setRole("MANAGER");
    setStatus("ACTIVE");
    setPermissions(["products", "inventory"]);
    setDrawerOpen(true);
  };

  const openEditDrawer = (adm: any) => {
    setCurrentAdmin(adm);
    setName(adm.name);
    setEmail(adm.email);
    setRole(adm.role);
    setStatus(adm.status);
    setPermissions(adm.permissions || []);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (id === 1) {
      alert("The primary Super Admin cannot be deleted.");
      return;
    }
    if (confirm("Revoke this team member's dashboard credentials permanently?")) {
      await supabase.from("admins").delete().eq("id", id);
    }
  };

  const handleToggleStatus = async (adm: any) => {
    if (adm.id === 1) {
      alert("Primary Super Admin must remain active.");
      return;
    }
    const nextStatus = adm.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await supabase.from("admins").update({ status: nextStatus }).eq("id", adm.id);
  };

  const handlePermissionToggle = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please provide name and email.");
      return;
    }

    const isSuper = role === "SUPER_ADMIN";
    const payload = {
      name,
      email,
      role,
      status,
      permissions: isSuper ? ["ALL"] : permissions
    };

    if (currentAdmin) {
      await supabase.from("admins").update(payload).eq("id", currentAdmin.id);
    } else {
      await supabase.from("admins").insert(payload);
    }
    setDrawerOpen(false);
  };

  const filteredAdmins = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const permissionList = [
    { key: "products", desc: "Modify products inventory & pricing catalogs" },
    { key: "categories", desc: "Create new categories tags and SEO summaries" },
    { key: "orders", desc: "Manage shipping tracking and generate invoices" },
    { key: "inventory", desc: "Adjust warehouse allocation ledger and alerts" },
    { key: "customers", desc: "Edit CRM customer logs and loyalty points" },
    { key: "coupons", desc: "Generate voucher codes and discount rules" },
    { key: "reviews", desc: "Approve user review submissions & flag spam" },
    { key: "blog", desc: "Write features on wellness journal publication" },
    { key: "settings", desc: "Edit brand specifications and webhooks" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "2.2rem", color: "var(--text)", margin: 0 }}>Admins & Roles</h1>
          <p style={{ fontSize: "13px", color: "var(--text-light)", margin: "4px 0 0" }}>Manage team dashboard credentials, configure fine-grained resource permissions, and review logs.</p>
        </div>
        
        <button
          onClick={openAddDrawer}
          style={{
            background: "#163020", color: "#ffffff", border: "none", padding: "10px 20px",
            fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"
          }}
        >
          <Plus size={14} /> Register New Admin
        </button>
      </div>

      {/* QUICK SUMMARY BLOCKS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Total Registered Staff", val: admins.length.toString(), color: "var(--dark)" },
          { label: "Active Sessions", val: admins.filter(a => a.status === "ACTIVE").length.toString(), color: "#27ae60" },
          { label: "Revoked/Inactive Staff", val: admins.filter(a => a.status === "INACTIVE").length.toString(), color: "#c0392b" }
        ].map((stat, idx) => (
          <div key={idx} style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-light)" }}>{stat.label}</span>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", margin: "4px 0 0" }}>{stat.val}</h3>
            </div>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: stat.color }} />
          </div>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)", padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--border)", padding: "6px 12px", width: "100%", maxWidth: "320px", background: "var(--cream)" }}>
          <Search size={14} style={{ color: "var(--text-light)" }} />
          <input
            type="text"
            placeholder="Search team members name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", background: "none", fontSize: "12px", outline: "none", width: "100%", color: "var(--text)" }}
          />
        </div>
      </div>

      {/* TEAM MEMBERS TABLE */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-light)" }}>Syncing members directory...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-light)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 24px" }}>Team Member</th>
                <th style={{ padding: "16px 24px" }}>System Role</th>
                <th style={{ padding: "16px 24px" }}>Privileges Granted</th>
                <th style={{ padding: "16px 24px" }}>Account State</th>
                <th style={{ padding: "16px 24px" }} />
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((adm) => (
                <tr key={adm.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[#faf8f4]">
                  
                  {/* Name / Email */}
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", background: "var(--cream)",
                        color: "var(--gold)", fontWeight: 700, fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid var(--border)"
                      }}>
                        {adm.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>{adm.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-light)" }}>{adm.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 8px",
                      background: adm.role === "SUPER_ADMIN" ? "#163020" : "var(--cream)",
                      color: adm.role === "SUPER_ADMIN" ? "#ffffff" : "var(--text)",
                      fontSize: "9px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase"
                    }}>
                      <Shield size={10} style={{ color: adm.role === "SUPER_ADMIN" ? "var(--gold)" : "var(--text-mid)" }} />
                      {adm.role.replace("_", " ")}
                    </span>
                  </td>

                  {/* Permissions Chips */}
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "280px" }}>
                      {adm.permissions.includes("ALL") ? (
                        <span style={{ fontSize: "9px", fontWeight: 600, color: "var(--gold)" }}>Inherits Full Privileges (*)</span>
                      ) : adm.permissions.length === 0 ? (
                        <span style={{ fontSize: "9px", color: "var(--text-light)" }}>No resource privileges</span>
                      ) : (
                        adm.permissions.map((p: string) => (
                          <span key={p} style={{ fontSize: "9px", background: "var(--cream)", border: "1px solid var(--border)", padding: "2px 6px", textTransform: "uppercase", fontWeight: 600 }}>
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Status Toggle Button */}
                  <td style={{ padding: "16px 24px" }}>
                    <button
                      onClick={() => handleToggleStatus(adm)}
                      style={{
                        background: "none", border: "none", display: "inline-flex", alignItems: "center", gap: "6px",
                        fontSize: "9px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase",
                        color: adm.status === "ACTIVE" ? "#27ae60" : "#c0392b"
                      }}
                      title="Toggle System Access"
                    >
                      {adm.status === "ACTIVE" ? <UserCheck size={12} /> : <UserX size={12} />}
                      <span>{adm.status}</span>
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: "16px 24px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "10px" }}>
                      <button
                        onClick={() => openEditDrawer(adm)}
                        style={{ background: "none", border: "none", color: "var(--text-mid)", cursor: "pointer" }}
                        title="Modify Member"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(adm.id)}
                        disabled={adm.id === 1}
                        style={{ background: "none", border: "none", color: adm.id === 1 ? "var(--border)" : "#c0392b", cursor: adm.id === 1 ? "default" : "pointer" }}
                        title="Delete Credentials"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DRAWER DIALOG FOR CREATING / EDITING */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, cursor: "pointer" }}
          />
          <div
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: "500px",
              background: "#ffffff", zIndex: 1001, boxShadow: "-10px 0 30px rgba(0,0,0,0.08)",
              display: "flex", flexDirection: "column", borderLeft: "1px solid var(--border)"
            }}
          >
            {/* Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase" }}>Staff Security Desk</span>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.6rem", color: "var(--text)", margin: "4px 0 0" }}>
                  {currentAdmin ? "Modify Team Member" : "Register Credentials"}
                </h2>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", fontSize: "12px", fontWeight: 600, color: "var(--text-light)", cursor: "pointer" }}>DISMISS</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Siddharth Sen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Staff Email (Login username)</label>
                <input
                  type="email"
                  placeholder="e.g. name@earthybites.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* System Role */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Security Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", background: "#ffffff" }}
                    disabled={currentAdmin?.id === 1}
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="MANAGER">Operations Manager</option>
                    <option value="CUSTOMER_SUPPORT">Customer Support</option>
                    <option value="EDITOR">Editorial Writer</option>
                  </select>
                </div>

                {/* Status */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Access State</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ padding: "10px 14px", border: "1px solid var(--border)", fontSize: "13px", outline: "none", background: "#ffffff" }}
                    disabled={currentAdmin?.id === 1}
                  >
                    <option value="ACTIVE">ACTIVE (Granted)</option>
                    <option value="INACTIVE">INACTIVE (Revoked)</option>
                  </select>
                </div>
              </div>

              {/* Resource Privileges Checklist */}
              {role === "SUPER_ADMIN" ? (
                <div style={{ background: "var(--cream)", border: "1px solid var(--border)", padding: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Shield size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text)" }}>Super Admin Access Granted</span>
                    <p style={{ margin: "2px 0 0", fontSize: "10px", color: "var(--text-mid)" }}>Super Admins automatically inherit read & write permission across all features. Settings are inherited.</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-mid)" }}>Configure Resource Privileges</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto", border: "1px solid var(--border)", padding: "10px" }}>
                    {permissionList.map(p => {
                      const active = permissions.includes(p.key);
                      return (
                        <label
                          key={p.key}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: "8px", padding: "8px",
                            background: active ? "var(--cream)" : "transparent", cursor: "pointer",
                            fontSize: "11px", borderBottom: "1px solid #fafafa"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => handlePermissionToggle(p.key)}
                            style={{ marginTop: "2px", accentColor: "#163020" }}
                          />
                          <div>
                            <span style={{ fontWeight: 600, textTransform: "uppercase", color: active ? "var(--text)" : "var(--text-mid)" }}>{p.key}</span>
                            <p style={{ margin: "1px 0 0", fontSize: "9px", color: "var(--text-light)" }}>{p.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div style={{ display: "flex", gap: "12px", marginTop: "auto", paddingTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    flex: 1, padding: "14px", background: "none", border: "1px solid var(--border)",
                    fontSize: "11px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", color: "var(--text-mid)"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2, padding: "14px", background: "#163020", border: "none", color: "#ffffff",
                    fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer"
                  }}
                >
                  {currentAdmin ? "Save Member Details" : "Register Admin"}
                </button>
              </div>

            </form>
          </div>
        </>
      )}

    </div>
  );
}

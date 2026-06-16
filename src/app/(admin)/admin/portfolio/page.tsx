"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, ExternalLink, Github, Loader2, X, Check, GripVertical, Database } from "lucide-react";

interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  longDesc: string;
  image: string;
  tags: string[];
  category: "web" | "app" | "ui" | "backend";
  github: string;
  live: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
}

type FormCategory = "web" | "app" | "ui" | "backend";

interface ProjectForm {
  title: string;
  description: string;
  longDesc: string;
  image: string;
  tags: string;
  category: FormCategory;
  github: string;
  live: string;
  featured: boolean;
  published: boolean;
  order: number;
}

const EMPTY_FORM: ProjectForm = {
  title: "",
  description: "",
  longDesc: "",
  image: "",
  tags: "",
  category: "web",
  github: "",
  live: "",
  featured: false,
  published: true,
  order: 0,
};

const CATEGORY_COLORS: Record<string, string> = {
  web: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  app: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  ui: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  backend: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // GitHub import states
  const [gitRepos, setGitRepos] = useState<any[]>([]);
  const [loadingGit, setLoadingGit] = useState(false);
  const [showGitModal, setShowGitModal] = useState(false);
  const [gitSearch, setGitSearch] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      showToast("Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const fetchGitRepos = async () => {
    setLoadingGit(true);
    try {
      const res = await fetch("/api/github-projects");
      const data = await res.json();
      setGitRepos(data.projects || []);
    } catch {
      showToast("Failed to fetch GitHub repositories", "error");
    } finally {
      setLoadingGit(false);
    }
  };

  const openGitImport = () => {
    setShowGitModal(true);
    fetchGitRepos();
  };

  const detectCategory = (repoName: string, desc: string, lang: string, topics: string[]): FormCategory => {
    const allText = `${repoName} ${desc} ${lang} ${topics.join(" ")}`.toLowerCase();
    
    if (
      allText.includes("flutter") ||
      allText.includes("dart") ||
      allText.includes("swift") ||
      allText.includes("kotlin") ||
      allText.includes("react-native") ||
      allText.includes("android") ||
      allText.includes("ios") ||
      allText.includes("mobile-app")
    ) {
      return "app";
    }

    if (
      allText.includes("express") ||
      allText.includes("django") ||
      allText.includes("flask") ||
      allText.includes("spring-boot") ||
      allText.includes("node") ||
      allText.includes("backend") ||
      allText.includes("python") ||
      allText.includes("golang") ||
      allText.includes("rust") ||
      allText.includes("api") ||
      allText.includes("mongodb") ||
      allText.includes("postgresql")
    ) {
      return "backend";
    }

    if (
      allText.includes("figma") ||
      allText.includes("design") ||
      allText.includes("ui-ux") ||
      allText.includes("framer-motion") ||
      allText.includes("tailwindcss") ||
      allText.includes("css")
    ) {
      return "ui";
    }

    return "web";
  };

  const handleSelectRepo = (repo: any) => {
    const detected = detectCategory(repo.name, repo.description, repo.language, repo.topics);
    const tagsArray = Array.from(new Set([repo.language, ...repo.topics].filter(Boolean)));
    
    setEditingId(null);
    setForm({
      title: repo.name,
      description: repo.description || "",
      longDesc: repo.description || "",
      image: "",
      tags: tagsArray.join(", "),
      category: detected,
      github: repo.githubUrl || "",
      live: repo.liveUrl || "",
      featured: false,
      published: true,
      order: 0,
    });
    
    setShowGitModal(false);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p: PortfolioProject) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      longDesc: p.longDesc || "",
      image: p.image || "",
      tags: p.tags.join(", "),
      category: p.category,
      github: p.github || "",
      live: p.live || "",
      featured: p.featured,
      published: p.published,
      order: p.order,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        order: Number(form.order),
        ...(editingId ? { id: editingId } : {}),
      };

      const res = await fetch("/api/admin/portfolio", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");
      showToast(editingId ? "Project updated!" : "Project added!");
      setShowForm(false);
      fetchProjects();
    } catch {
      showToast("Failed to save project", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleField = async (id: string, field: "published" | "featured", value: boolean) => {
    try {
      await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      setProjects((prev) => prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)));
    } catch {
      showToast("Failed to update", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      showToast("Project deleted");
      setDeleteConfirm(null);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      showToast("Failed to delete project", "error");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/portfolio/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      showToast(data.message);
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || "Seed failed", "error");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${toast.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" : "bg-red-500/20 border border-red-500/30 text-red-400"}`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage what shows on your public portfolio & home page.</p>
        </div>
        <div className="flex items-center gap-2">
          {projects.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-500/30 transition-all disabled:opacity-60"
              title="Seed database with your original projects"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {seeding ? "Seeding..." : "Seed Old Projects"}
            </button>
          )}
          <button
            onClick={openGitImport}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-accent border border-border text-foreground rounded-xl text-sm font-medium transition-all animate-in fade-in duration-200"
          >
            <Github className="w-4 h-4" /> Import from GitHub
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: projects.length, color: "from-purple-500 to-blue-500" },
          { label: "Published", value: projects.filter((p) => p.published).length, color: "from-emerald-500 to-green-500" },
          { label: "Featured", value: projects.filter((p) => p.featured).length, color: "from-amber-500 to-orange-500" },
          { label: "Hidden", value: projects.filter((p) => !p.published).length, color: "from-slate-500 to-gray-500" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border border-border bg-card">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <span className="text-white text-xs font-bold">{s.value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Project list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground text-lg mb-2">No projects yet</p>
          <p className="text-sm text-muted-foreground mb-6">Add your first portfolio project to get started.</p>
          <button onClick={openAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className={`group flex items-center gap-4 p-4 rounded-2xl border bg-card transition-all ${project.published ? "border-border hover:border-primary/30" : "border-border/50 opacity-60"}`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 hidden sm:block" />

              {/* Image preview */}
              {project.image ? (
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-secondary flex items-center justify-center">
                  <span className="text-xl">{project.title.charAt(0)}</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm">{project.title}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full border font-medium ${CATEGORY_COLORS[project.category]}`}>
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 text-xs rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 font-medium">
                      ★ Featured
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs line-clamp-1 mb-1.5">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{project.tags.length - 4}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Links */}
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title="Live site">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {/* Feature toggle */}
                <button onClick={() => toggleField(project._id, "featured", !project.featured)}
                  className={`p-2 rounded-lg transition-colors ${project.featured ? "text-amber-400 hover:bg-amber-500/10" : "text-muted-foreground hover:text-amber-400 hover:bg-accent"}`}
                  title={project.featured ? "Remove from featured" : "Mark as featured"}>
                  {project.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                </button>
                {/* Publish toggle */}
                <button onClick={() => toggleField(project._id, "published", !project.published)}
                  className={`p-2 rounded-lg transition-colors ${project.published ? "text-emerald-400 hover:bg-emerald-500/10" : "text-muted-foreground hover:text-emerald-400 hover:bg-accent"}`}
                  title={project.published ? "Unpublish" : "Publish"}>
                  {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                {/* Edit */}
                <button onClick={() => openEdit(project)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                {/* Delete */}
                {deleteConfirm === project._id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(project._id)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors">
                      Confirm
                    </button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(project._id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold">{editingId ? "Edit Project" : "Add New Project"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title *</label>
                  <input
                    value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required placeholder="GainIQ App"
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                  <select
                    value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FormCategory }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="web">Web</option>
                    <option value="app">App</option>
                    <option value="ui">UI</option>
                    <option value="backend">Backend</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Short Description *</label>
                <input
                  value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  required placeholder="Brief one-line description for the project card"
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Long Description (shown in modal)</label>
                <textarea
                  value={form.longDesc} onChange={(e) => setForm((f) => ({ ...f, longDesc: e.target.value }))}
                  rows={3} placeholder="Full details about the project, tech used, features, etc."
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Image URL</label>
                <input
                  value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  type="url" placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
                {form.image && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tags (comma separated)</label>
                <input
                  value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="Next.js, TypeScript, MongoDB, Tailwind"
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* GitHub & Live */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">GitHub URL</label>
                  <input
                    value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                    type="url" placeholder="https://github.com/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Live URL</label>
                  <input
                    value={form.live} onChange={(e) => setForm((f) => ({ ...f, live: e.target.value }))}
                    type="url" placeholder="https://yourproject.vercel.app"
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Display Order (lower = first)</label>
                <input
                  value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                  type="number" min={0} placeholder="0"
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                    className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${form.published ? "bg-emerald-500" : "bg-secondary border border-border"}`}
                    style={{ height: "22px", width: "40px" }}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.published ? "left-5" : "left-0.5"}`} />
                  </div>
                  <span className="text-sm">Published</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                    className={`relative rounded-full transition-colors cursor-pointer ${form.featured ? "bg-amber-500" : "bg-secondary border border-border"}`}
                    style={{ height: "22px", width: "40px" }}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.featured ? "left-5" : "left-0.5"}`} />
                  </div>
                  <span className="text-sm">Featured (shows on home page)</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Import Modal */}
      {showGitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowGitModal(false)}>
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Github className="w-5 h-5 text-primary" /> Import from GitHub
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Select a repository to pre-fill the project showcase form.</p>
              </div>
              <button onClick={() => setShowGitModal(false)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border bg-card">
              <input
                value={gitSearch}
                onChange={(e) => setGitSearch(e.target.value)}
                placeholder="Search repositories by name, language, or topic..."
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Repos list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {loadingGit ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm">Fetching public repositories...</span>
                </div>
              ) : gitRepos.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                  No public repositories found.
                </div>
              ) : (() => {
                const filtered = gitRepos.filter((r) => {
                  if (!gitSearch) return true;
                  const q = gitSearch.toLowerCase();
                  return (
                    r.name.toLowerCase().includes(q) ||
                    (r.description || "").toLowerCase().includes(q) ||
                    (r.language || "").toLowerCase().includes(q) ||
                    (r.topics || []).some((t: string) => t.toLowerCase().includes(q))
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-20 text-muted-foreground text-sm">
                      No repositories matching &quot;{gitSearch}&quot;
                    </div>
                  );
                }

                return filtered.map((repo) => (
                  <div key={repo.id} className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-border bg-secondary/30 hover:border-primary/30 transition-all duration-300">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-foreground mb-1">{repo.name}</h3>
                      <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
                        {repo.description || "No description provided."}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            {repo.language}
                          </span>
                        )}
                        {repo.stars > 0 && <span>★ {repo.stars}</span>}
                        {repo.topics && repo.topics.slice(0, 3).map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectRepo(repo)}
                      className="px-3.5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-all shrink-0 shadow-sm"
                    >
                      Select
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

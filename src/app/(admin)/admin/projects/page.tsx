"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { Plus, Search, Filter, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects || []); setLoading(false); });
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.projectName.toLowerCase().includes(search.toLowerCase()) || p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      const { project } = await res.json();
      setProjects((prev) => [project, ...prev]);
      setShowNewModal(false);
      toast.success("Project created!");
    } else toast.error("Failed to create project");
    setCreating(false);
  };

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Projects</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{projects.length} total projects</p>
        </div>
        <Button onClick={() => setShowNewModal(true)} variant="gradient" size="sm">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by project or client..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Under Review</option>
          <option value="delivered">Delivered</option>
          <option value="on-hold">On Hold</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                {["Project", "Client", "Status", "Progress", "Delivery", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.projectName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.clientName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>{getStatusLabel(p.status)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.deliveryDate ? formatDate(p.deliveryDate) : "TBD"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/projects/${p._id}`} className="text-primary hover:underline flex items-center gap-1 text-xs font-medium">
                      Edit <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No projects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New project modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg">Create New Project</h2>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {[
                { name: "clientEmail", label: "Client Email", placeholder: "client@example.com", type: "email" },
                { name: "clientName", label: "Client Name", placeholder: "John Doe" },
                { name: "projectName", label: "Project Name", placeholder: "My Awesome App" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                  <input name={f.name} type={f.type || "text"} placeholder={f.placeholder} required
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea name="description" rows={3} placeholder="Brief project description..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Budget (USD)</label>
                  <input name="budget" type="number" placeholder="1000"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Delivery Date</label>
                  <input name="deliveryDate" type="date"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewModal(false)}>Cancel</Button>
                <Button type="submit" variant="gradient" className="flex-1" disabled={creating}>
                  {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

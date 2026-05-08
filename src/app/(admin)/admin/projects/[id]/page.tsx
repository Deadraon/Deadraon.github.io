"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getStatusLabel, formatRelativeDate } from "@/lib/utils";
import { Save, Loader2, Plus, Trash2, ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
const STATUSES = ["pending", "in-progress", "review", "delivered", "on-hold"];

export default function AdminProjectEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newMilestone, setNewMilestone] = useState("");

  const fetch_ = useCallback(async () => {
    const res = await fetch(`/api/admin/projects/${id}`);
    const data = await res.json();
    setProject(data.project);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: project.status, progress: project.progress, deliveryDate: project.deliveryDate,
        budget: project.budget, paymentStatus: project.paymentStatus,
        description: project.description, techStack: project.techStack,
        milestones: project.milestones, notes: project.notes, changelog: project.changelog,
        liveUrl: project.liveUrl, githubUrl: project.githubUrl,
      }),
    });
    if (res.ok) toast.success("Project saved!"); else toast.error("Save failed");
    setSaving(false);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = { id: Date.now().toString(), content: newNote, author: "Deadraon", createdAt: new Date().toISOString(), isInternal: false };
    const log = { id: Date.now().toString(), message: `Note added: "${newNote.slice(0, 50)}..."`, type: "note", createdAt: new Date().toISOString() };
    setProject((p: any) => ({ ...p, notes: [...(p.notes || []), note], changelog: [...(p.changelog || []), log] }));
    setNewNote("");
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    const m = { id: Date.now().toString(), title: newMilestone, completed: false };
    const log = { id: Date.now().toString(), message: `Milestone added: "${newMilestone}"`, type: "milestone", createdAt: new Date().toISOString() };
    setProject((p: any) => ({ ...p, milestones: [...(p.milestones || []), m], changelog: [...(p.changelog || []), log] }));
    setNewMilestone("");
  };

  const toggleMilestone = (mId: string) => {
    setProject((p: any) => ({
      ...p,
      milestones: p.milestones.map((m: any) =>
        m.id === mId ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined } : m
      ),
    }));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!project) return <div className="p-8 text-center">Project not found.</div>;

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{project.projectName}</h1>
          <p className="text-sm text-muted-foreground">{project.clientName} • {project.clientEmail}</p>
        </div>
        <Button onClick={save} variant="gradient" size="sm" disabled={saving}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Core settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Progress */}
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="font-semibold">Project Status</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <select value={project.status} onChange={(e) => setProject((p: any) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {STATUSES.map((s) => <option key={s} value={s}>{getStatusLabel(s as any)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Progress: {project.progress}%</label>
                <input type="range" min={0} max={100} value={project.progress}
                  onChange={(e) => setProject((p: any) => ({ ...p, progress: parseInt(e.target.value) }))}
                  className="w-full accent-purple-600" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Payment Status</label>
                <select value={project.paymentStatus} onChange={(e) => setProject((p: any) => ({ ...p, paymentStatus: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {["unpaid", "partial", "paid"].map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Delivery Date</label>
                <input type="date" value={project.deliveryDate ? project.deliveryDate.split("T")[0] : ""}
                  onChange={(e) => setProject((p: any) => ({ ...p, deliveryDate: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <textarea rows={3} value={project.description || ""} onChange={(e) => setProject((p: any) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Live URL</label>
                <input value={project.liveUrl || ""} onChange={(e) => setProject((p: any) => ({ ...p, liveUrl: e.target.value }))} placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">GitHub URL</label>
                <input value={project.githubUrl || ""} onChange={(e) => setProject((p: any) => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h2 className="font-semibold mb-4">Milestones</h2>
            <div className="space-y-2 mb-4">
              {project.milestones?.map((m: any) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary group">
                  <button onClick={() => toggleMilestone(m.id)}>
                    {m.completed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />}
                  </button>
                  <span className={`flex-1 text-sm ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</span>
                  <button onClick={() => setProject((p: any) => ({ ...p, milestones: p.milestones.filter((x: any) => x.id !== m.id) }))}
                    className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)} placeholder="Add milestone..."
                onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <Button onClick={addMilestone} size="sm" variant="outline"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Notes */}
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h2 className="font-semibold mb-4">Client Notes</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {project.notes?.filter((n: any) => !n.isInternal).map((note: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-secondary text-sm">
                  <p>{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeDate(note.createdAt)}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note for the client..."
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <Button onClick={addNote} size="sm" variant="outline"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        {/* Right: Activity */}
        <div className="p-6 rounded-2xl border border-border bg-card h-fit">
          <h2 className="font-semibold mb-4">Activity Timeline</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {project.changelog?.slice().reverse().map((log: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs">{log.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
            {!project.changelog?.length && <p className="text-sm text-muted-foreground">No activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

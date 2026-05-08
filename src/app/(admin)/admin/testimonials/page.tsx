"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/testimonials").then((r) => r.json()).then((d) => { setTestimonials(d.testimonials || []); setLoading(false); });
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSaving(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      const { testimonial } = await res.json();
      setTestimonials((p) => [testimonial, ...p]);
      setShowModal(false); toast.success("Testimonial added!");
    } else toast.error("Failed to add testimonial");
    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={() => setShowModal(true)} variant="gradient" size="sm"><Plus className="w-4 h-4" /> Add</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t._id} className="p-5 rounded-2xl border border-border bg-card">
              <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">{t.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} @ {t.company}</p>
                </div>
                <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${t.featured ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary text-muted-foreground"}`}>{t.featured ? "Featured" : "Hidden"}</span>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <p className="text-muted-foreground col-span-3 text-center py-12">No testimonials yet. Seed the database or add one!</p>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-border"><h2 className="font-semibold">Add Testimonial</h2></div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {[{ name: "name", label: "Client Name" }, { name: "role", label: "Role/Position" }, { name: "company", label: "Company" }, { name: "projectType", label: "Project Type" }].map((f) => (
                <div key={f.name}>
                  <label className="text-sm font-medium mb-1.5 block">{f.label}</label>
                  <input name={f.name} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Testimonial</label>
                <textarea name="content" rows={3} required className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Rating (1-5)</label>
                  <input name="rating" type="number" min={1} max={5} defaultValue={5} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="flex items-end pb-0.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input name="featured" type="checkbox" value="true" className="w-4 h-4 accent-purple-600" />
                    Featured
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="gradient" className="flex-1" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

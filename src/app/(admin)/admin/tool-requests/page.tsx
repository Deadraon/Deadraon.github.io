"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatRelativeDate } from "@/lib/utils";
import { Sparkles, Trash2, Check, RefreshCw, Mail, CheckCircle2 } from "lucide-react";

interface ToolRequestData {
  _id: string;
  name: string;
  description: string;
  email?: string;
  status: "new" | "reviewed" | "completed";
  createdAt: string;
}

export default function AdminToolRequestsPage() {
  const [requests, setRequests] = useState<ToolRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "reviewed" | "completed">("all");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tool-requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        toast.error("Failed to load requests.");
      }
    } catch (err) {
      toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "reviewed" | "completed") => {
    try {
      const res = await fetch("/api/admin/tool-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Request marked as ${newStatus}!`);
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
      } else {
        toast.error(data.error || "Failed to update status.");
      }
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool request?")) return;

    try {
      const res = await fetch(`/api/admin/tool-requests?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Request deleted!");
        setRequests((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.error || "Failed to delete request.");
      }
    } catch (err) {
      toast.error("Failed to delete request.");
    }
  };

  const filteredRequests = requests.filter(
    (r) => filter === "all" || r.status === filter
  );

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            User Tool Requests
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage custom digital utility requests submitted by visitors.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-secondary border border-border hover:bg-accent rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-secondary p-1 rounded-xl w-max gap-1 border border-border">
        {(["all", "new", "reviewed", "completed"] as const).map((tab) => {
          const count = tab === "all" ? requests.length : requests.filter((r) => r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <span>Retrieving tool submissions...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-40 text-primary" />
            <p>No tool requests in this category.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req._id}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                  {req.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-semibold text-base text-foreground truncate">{req.name}</h3>
                    {req.status === "new" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                        New
                      </span>
                    )}
                    {req.status === "reviewed" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                        Reviewed
                      </span>
                    )}
                    {req.status === "completed" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {req.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-4 border-t border-white/[0.05] mt-4">
                    {req.email ? (
                      <a href={`mailto:${req.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        {req.email}
                      </a>
                    ) : (
                      <span className="text-white/20">Anonymous requester</span>
                    )}
                    <span className="text-white/10">•</span>
                    <span>Submitted {formatRelativeDate(req.createdAt)}</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start">
                  {req.status === "new" && (
                    <button
                      onClick={() => handleStatusChange(req._id, "reviewed")}
                      className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl transition-all shadow-sm"
                      title="Mark as Reviewed"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {req.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange(req._id, "completed")}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl transition-all shadow-sm"
                      title="Mark as Completed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(req._id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl transition-all shadow-sm"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inline Loader2 fallback
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

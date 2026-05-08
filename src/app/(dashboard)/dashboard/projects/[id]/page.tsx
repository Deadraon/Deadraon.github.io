import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getStatusColor, getStatusLabel, formatDate, formatRelativeDate } from "@/lib/utils";
import { CheckCircle, Circle, Clock, FileText, MessageSquare, Activity } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();
  const project = await Project.findOne({ _id: params.id, clientId: userId }).lean() as any;
  if (!project) notFound();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "milestones", label: "Milestones" },
    { id: "files", label: "Files" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{project.projectName}</h1>
            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{project.description}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Progress", value: `${project.progress}%` },
          { label: "Payment", value: project.paymentStatus === "paid" ? "Paid" : project.paymentStatus === "partial" ? "Partial" : "Unpaid" },
          { label: "Started", value: formatDate(project.startDate) },
          { label: "Delivery", value: project.deliveryDate ? formatDate(project.deliveryDate) : "TBD" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-border bg-card text-center">
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="p-6 rounded-2xl border border-border bg-card mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Project Progress</h2>
          <span className="text-2xl font-black gradient-text">{project.progress}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${project.progress}%` }} />
        </div>
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.techStack.map((tech: string) => (
              <span key={tech} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{tech}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Milestones */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-card">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-primary" /> Milestones
          </h2>
          {project.milestones?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No milestones yet.</p>
          ) : (
            <div className="space-y-3">
              {project.milestones?.map((m: any, i: number) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${m.completed ? "bg-emerald-500/10" : "bg-secondary"}`}>
                  {m.completed ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className={`font-medium text-sm ${m.completed ? "line-through text-muted-foreground" : ""}`}>{m.title}</p>
                    {m.description && <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>}
                    {m.dueDate && <p className="text-xs text-muted-foreground mt-1"><Clock className="w-3 h-3 inline mr-1" />Due: {formatDate(m.dueDate)}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity / Changelog */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" /> Activity
          </h2>
          {project.changelog?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="space-y-4">
              {project.changelog?.slice(-10).reverse().map((log: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeDate(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {project.notes?.filter((n: any) => !n.isInternal).length > 0 && (
        <div className="mt-8 p-6 rounded-2xl border border-border bg-card">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-primary" /> Notes from Deadraon
          </h2>
          <div className="space-y-3">
            {project.notes.filter((n: any) => !n.isInternal).map((note: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-secondary text-sm">
                <p>{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatRelativeDate(note.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {project.files?.length > 0 && (
        <div className="mt-8 p-6 rounded-2xl border border-border bg-card">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" /> Project Files
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.files.map((file: any, i: number) => (
              <a key={i} href={file.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

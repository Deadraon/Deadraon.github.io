import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";

export default async function DashboardProjectsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectDB();
  const projects = await Project.find({ clientId: userId }).sort({ updatedAt: -1 }).lean() as any[];

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
      </div>

      {projects.length === 0 ? (
        <div className="p-16 rounded-2xl border border-dashed border-border text-center">
          <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No projects yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Your projects will appear here once Deadraon sets them up.</p>
          <Link href="/contact" className="text-primary hover:underline text-sm">→ Start a project</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project._id.toString()} href={`/dashboard/projects/${project._id}`}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-semibold group-hover:text-primary transition-colors">{project.projectName}</h2>
                    <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${project.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                      {project.paymentStatus === "paid" ? "Paid" : project.paymentStatus === "partial" ? "Partial" : "Unpaid"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{project.description || "No description provided."}</p>
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStack.slice(0, 4).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-8 text-center">
                  <div>
                    <p className="text-2xl font-black gradient-text">{project.progress}%</p>
                    <div className="w-16 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Progress</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{project.milestones?.filter((m: any) => m.completed).length || 0}/{project.milestones?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Milestones</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

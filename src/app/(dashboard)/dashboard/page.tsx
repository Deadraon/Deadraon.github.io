import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { ArrowRight, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();

  await connectDB();
  const projects = await Project.find({ clientId: userId }).sort({ updatedAt: -1 }).lean();

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "in-progress").length,
    delivered: projects.filter((p) => p.status === "delivered").length,
    avgProgress: projects.length ? Math.round(projects.reduce((a, b) => a + b.progress, 0) / projects.length) : 0,
  };

  const statCards = [
    { label: "Total Projects", value: stats.total, icon: TrendingUp, color: "from-purple-500 to-blue-500" },
    { label: "In Progress", value: stats.active, icon: Clock, color: "from-blue-500 to-cyan-500" },
    { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "from-emerald-500 to-green-500" },
    { label: "Avg. Progress", value: `${stats.avgProgress}%`, icon: AlertCircle, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || "Client"} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s an overview of all your projects.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="p-5 rounded-2xl border border-border bg-card">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Projects</h2>
          <Link href="/dashboard/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Once your project starts, you&apos;ll see updates here.</p>
            <Link href="/contact" className="text-primary text-sm hover:underline">Hire Deadraon →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project: any) => (
              <Link key={project._id.toString()} href={`/dashboard/projects/${project._id}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-200 group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{project.projectName}</h3>
                    <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{project.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  {/* Progress */}
                  <div className="text-center min-w-[60px]">
                    <p className="font-bold text-lg">{project.progress}%</p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <div className="w-16 h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  {project.deliveryDate && (
                    <div className="text-center hidden sm:block">
                      <p className="font-medium text-sm">{formatDate(project.deliveryDate)}</p>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                    </div>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

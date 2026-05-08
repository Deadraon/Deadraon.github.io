import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Contact from "@/models/Contact";
import { getStatusColor, getStatusLabel, formatRelativeDate } from "@/lib/utils";
import { Users, FolderOpen, MessageSquare, TrendingUp, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  await connectDB();
  const [projects, contacts] = await Promise.all([
    Project.find({}).sort({ updatedAt: -1 }).lean(),
    Contact.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  const uniqueClients = new Set(projects.map((p: any) => p.clientId)).size;
  const activeProjects = projects.filter((p: any) => p.status === "in-progress").length;
  const newInquiries = contacts.filter((c: any) => c.status === "new").length;

  const statCards = [
    { label: "Total Projects", value: projects.length, icon: FolderOpen, color: "from-purple-500 to-blue-500", href: "/admin/projects" },
    { label: "Active Clients", value: uniqueClients, icon: Users, color: "from-blue-500 to-cyan-500", href: "/admin/clients" },
    { label: "In Progress", value: activeProjects, icon: TrendingUp, color: "from-emerald-500 to-green-500", href: "/admin/projects" },
    { label: "New Inquiries", value: newInquiries, icon: MessageSquare, color: "from-amber-500 to-orange-500", href: "/admin/contacts" },
  ];

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage all client projects and business operations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all card-hover group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent projects */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><FolderOpen className="w-4 h-4 text-primary" /> Recent Projects</h2>
            <Link href="/admin/projects" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {(projects as any[]).slice(0, 5).map((project) => (
              <Link key={project._id.toString()} href={`/admin/projects/${project._id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-primary">{project.projectName}</p>
                  <p className="text-xs text-muted-foreground">{project.clientName}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(project.status)}`}>{getStatusLabel(project.status)}</span>
                  <p className="text-xs text-muted-foreground mt-1">{project.progress}%</p>
                </div>
              </Link>
            ))}
            {projects.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No projects yet.</p>}
          </div>
        </div>

        {/* Recent contacts */}
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Recent Inquiries</h2>
            <Link href="/admin/contacts" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {(contacts as any[]).slice(0, 5).map((contact) => (
              <Link key={contact._id.toString()} href={`/admin/contacts`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.subject}</p>
                </div>
                <div className="text-right">
                  {contact.status === "new" && <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">New</span>}
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeDate(contact.createdAt)}</p>
                </div>
              </Link>
            ))}
            {contacts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No inquiries yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

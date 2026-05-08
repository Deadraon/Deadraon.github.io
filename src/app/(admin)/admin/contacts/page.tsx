import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { formatRelativeDate } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";

export default async function AdminContactsPage() {
  await connectDB();
  const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean() as any[];

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Client Inquiries</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{contacts.length} total submissions</p>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-border text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No inquiries yet. Share your contact page!</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact._id.toString()} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-semibold">{contact.name}</h3>
                    {contact.status === "new" && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">New</span>
                    )}
                    {contact.projectType && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{contact.projectType}</span>
                    )}
                  </div>
                  <p className="font-medium text-sm mb-1">{contact.subject}</p>
                  <p className="text-sm text-muted-foreground mb-3">{contact.message}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="w-3 h-3" /> {contact.email}
                    </a>
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="w-3 h-3" /> {contact.phone}
                      </a>
                    )}
                    {contact.budget && <span>Budget: {contact.budget}</span>}
                    {contact.timeline && <span>Timeline: {contact.timeline}</span>}
                    <span>{formatRelativeDate(contact.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

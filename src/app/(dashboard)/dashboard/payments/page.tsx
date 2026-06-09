import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Project from "@/models/Project";
import Link from "next/link";
import { CreditCard, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Clock, Calendar, Hash, Tag, Landmark, IndianRupee } from "lucide-react";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function PaymentsHistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  await connectDB();

  // Find all projects for this user to fetch associated payments
  const clientProjects = (await Project.find({ clientId: userId }).lean()) as any[];
  const projectIds = clientProjects.map((p) => p._id.toString());

  // Retrieve payments matched by email or linked projectId
  const payments = await Payment.find({
    $or: [
      { clientEmail: userEmail },
      { projectId: { $in: projectIds } }
    ]
  })
    .sort({ createdAt: -1 })
    .lean() as any[];

  // Statistics
  const totalPaid = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentsCount = payments.filter((p) => p.status === "pending").length;

  return (
    <div className="p-6 lg:p-8 pt-16 lg:pt-8 min-h-screen bg-[#030308]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#be38f3]" />
            Payment History
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your milestones, receipts, and UPI transaction updates.
          </p>
        </div>
        <Link
          href="/pay"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8a2be2] to-[#be38f3] text-white hover:opacity-95 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(190,56,243,0.15)] active:scale-95 self-start sm:self-auto"
        >
          Make a Payment
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-xl font-black text-white">
              ₹{totalPaid.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending Orders</p>
            <p className="text-xl font-black text-white">{pendingPaymentsCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#be38f3]/10 text-[#be38f3] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Security Protocol</p>
            <p className="text-sm font-semibold text-white/80">UPI / SSL 256-bit</p>
          </div>
        </div>
      </div>

      {/* Payments List / Table */}
      {payments.length === 0 ? (
        <div className="p-16 rounded-3xl border border-dashed border-white/10 text-center bg-card/20 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-4 text-white/30">
            <CreditCard className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-lg text-white mb-2">No payment transactions yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Your transactions will appear here once you initiate or complete a payment.
          </p>
          <Link
            href="/pay"
            className="text-[#be38f3] text-sm font-medium hover:underline flex items-center justify-center gap-1"
          >
            Initiate your first payment <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-card/20 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-bold text-white/40 uppercase tracking-wider bg-white/[0.01]">
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Payment Purpose / Note</th>
                  <th className="py-4 px-6">UTR / Transaction ID</th>
                  <th className="py-4 px-6">Payment Mode</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03] text-sm text-white/80">
                {payments.map((payment) => (
                  <tr key={payment._id.toString()} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/30" />
                        <span className="font-medium text-white/70">{formatDateTime(payment.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2 max-w-xs truncate" title={payment.note}>
                        <Tag className="w-4 h-4 text-white/30 flex-shrink-0" />
                        <span className="truncate">{payment.note || "Milestone Payment"}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <Hash className="w-3.5 h-3.5 text-white/30" />
                        <span className={payment.utr ? "text-white/60" : "text-white/30"}>
                          {payment.utr || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-white/30" />
                        <span className="text-xs font-semibold px-2 py-0.5 bg-white/[0.03] rounded-md border border-white/5 uppercase text-white/70">
                          {payment.paymentMode || "UPI"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-right whitespace-nowrap font-bold text-white">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4.5 px-6 text-center whitespace-nowrap">
                      {payment.status === "success" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Success
                        </span>
                      )}
                      {payment.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      )}
                      {payment.status === "failed" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Grid View */}
          <div className="block md:hidden divide-y divide-white/5">
            {payments.map((payment) => (
              <div key={payment._id.toString()} className="p-5 space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{formatDateTime(payment.createdAt)}</span>
                  {payment.status === "success" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                      Success
                    </span>
                  )}
                  {payment.status === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/15">
                      Pending
                    </span>
                  )}
                  {payment.status === "failed" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/15">
                      Failed
                    </span>
                  )}
                </div>

                {/* Amount & Purpose */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white/70">
                      {payment.note || "Milestone Payment"}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-white/40">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Mode: {payment.paymentMode || "UPI"}</span>
                    </div>
                  </div>
                  <p className="text-base font-bold text-white">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Transaction ID / UTR */}
                <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between text-[11px]">
                  <span className="text-white/40">UTR / txn ID:</span>
                  <span className="font-mono text-white/70">{payment.utr || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

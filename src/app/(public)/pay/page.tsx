import type { Metadata } from "next";
import PayPageContent from "./PayPageContent";

export const metadata: Metadata = {
  title: "Secure Payment Portal | Deadraon Checkout",
  description: "Securely pay invoices, milestones, or retainers to Kunal Chauhan (Deadraon Development). Supports instant UPI, Google Pay, PhonePe, Paytm, and net banking.",
  keywords: ["Deadraon Payment", "Secure Invoice Payment UPI", "Kunal Chauhan pay", "freelance developer bill pay", "UPI payment gateway online"],
};

export default function PayPage() {
  return <PayPageContent />;
}

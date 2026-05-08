import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export const projectStatuses = [
  "pending",
  "in-progress",
  "review",
  "delivered",
  "on-hold",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export function getStatusColor(status: ProjectStatus) {
  const colors: Record<ProjectStatus, string> = {
    pending: "status-pending",
    "in-progress": "status-in-progress",
    review: "status-review",
    delivered: "status-delivered",
    "on-hold": "status-on-hold",
  };
  return colors[status] || "status-pending";
}

export function getStatusLabel(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    pending: "Pending",
    "in-progress": "In Progress",
    review: "Under Review",
    delivered: "Delivered",
    "on-hold": "On Hold",
  };
  return labels[status] || status;
}

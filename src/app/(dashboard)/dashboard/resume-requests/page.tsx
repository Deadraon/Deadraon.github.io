"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, X, Loader2, Mail, Building2, User } from "lucide-react";

interface ResumeRequest {
  _id: string;
  name: string;
  email: string;
  company?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function ResumeRequestsPage() {
  const [requests, setRequests] = useState<ResumeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const response = await fetch("/api/admin/resume");
      const data = await response.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    setProcessingId(id);
    try {
      const response = await fetch("/api/admin/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (response.ok) {
        toast.success(`Request ${action}d successfully`);
        fetchRequests();
      } else {
        toast.error(`Failed to ${action} request`);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resume Requests</h1>
        <p className="text-muted-foreground">Manage who can see your resume.</p>
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        {request.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {request.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.company ? (
                      <span className="flex items-center gap-1.5 text-sm">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        {request.company}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "success"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleAction(request._id, "reject")}
                          disabled={processingId === request._id}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                          onClick={() => handleAction(request._id, "approve")}
                          disabled={processingId === request._id}
                        >
                          {processingId === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

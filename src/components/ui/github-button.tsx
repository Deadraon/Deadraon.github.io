"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GithubButton() {
  return (
    <Button 
      onClick={() => window.dispatchEvent(new CustomEvent('triggerGithubTransition'))}
      variant="outline" 
      size="lg" 
      className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
    >
      <Github className="w-4 h-4 mr-2" /> GitHub
    </Button>
  );
}

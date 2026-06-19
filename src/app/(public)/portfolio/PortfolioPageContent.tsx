"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, X, Loader2, Star, GitFork, Code2, Layers, RefreshCw } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
interface PortfolioProject {
  _id: string;
  title: string;
  description: string;
  longDesc: string;
  image: string;
  tags: string[];
  category: string;
  github: string;
  live: string;
  featured: boolean;
}

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  topics: string[];
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

// ── Language colour map ────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Dart: "bg-cyan-500",
  HTML: "bg-orange-500",
  CSS: "bg-purple-500",
  "C++": "bg-pink-500",
  Go: "bg-teal-500",
  Rust: "bg-orange-600",
};

const PORTFOLIO_FILTERS = ["all", "web", "app", "ui", "backend"];

function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border bg-card overflow-hidden animate-pulse ${tall ? "h-72" : ""}`}>
      {tall && <div className="h-52 bg-secondary" />}
      <div className="p-5 space-y-3">
        <div className="h-4 bg-secondary rounded-full w-3/4" />
        <div className="h-3 bg-secondary rounded-full w-full" />
        <div className="h-3 bg-secondary rounded-full w-5/6" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-14 bg-secondary rounded-full" />
          <div className="h-5 w-18 bg-secondary rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── GitHub Repo Card ────────────────────────────────────────────────────
function RepoCard({ repo }: { repo: GitHubRepo }) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-white/5 bg-black/30 backdrop-blur-md p-5 hover:border-primary/40 transition-all duration-300 card-hover shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-primary flex-shrink-0" />
          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
            {repo.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {repo.liveUrl && (
            <a href={repo.liveUrl} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Live site">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <a href={repo.githubUrl} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="GitHub">
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
        {repo.description || "No description provided."}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {repo.topics.slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${LANG_COLORS[repo.language] || "bg-gray-400"}`} />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" /> {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3" /> {repo.forks}
          </span>
        )}
        <span className="ml-auto">{timeAgo(repo.updatedAt)}</span>
      </div>
    </div>
  );
}

// ── Main Page Content Component ─────────────────────────────────────────
export default function PortfolioPageContent() {
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [loadingGithub, setLoadingGithub] = useState(true);
  const [activeTab, setActiveTab] = useState<"showcase" | "github">("showcase");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const [githubSearch, setGithubSearch] = useState("");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => setPortfolioProjects(d.projects || []))
      .catch(() => setPortfolioProjects([]))
      .finally(() => setLoadingPortfolio(false));

    fetch("/api/github-projects")
      .then((r) => r.json())
      .then((d) => setGithubRepos(d.projects || []))
      .catch(() => setGithubRepos([]))
      .finally(() => setLoadingGithub(false));
  }, []);

  const filteredPortfolio = portfolioProjects.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  const filteredGithub = githubRepos.filter((r) => {
    if (!githubSearch) return true;
    const q = githubSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.topics.some((t) => t.toLowerCase().includes(q)) ||
      r.language.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-14">
      {/* ── Header ── */}
      <section className="section-padding pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Portfolio</span>
          <h1 className="text-5xl lg:text-6xl font-black mt-2 mb-6">
            My <span className="gradient-text">Work &amp; Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Curated showcase projects and every repo I&apos;ve built — updated automatically.
          </p>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="flex justify-center mb-10 px-4">
        <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-1.5 gap-1 border border-white/5 shadow-xl">
          <button
            onClick={() => setActiveTab("showcase")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "showcase" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Layers className="w-4 h-4" />
            Showcase
            <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === "showcase" ? "bg-white/20" : "bg-white/10"}`}>
              {portfolioProjects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("github")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "github" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Github className="w-4 h-4" />
            All GitHub Repos
            {!loadingGithub && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === "github" ? "bg-white/20" : "bg-white/10"}`}>
                {githubRepos.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── SHOWCASE TAB ── */}
      {activeTab === "showcase" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-10 px-4">
            {PORTFOLIO_FILTERS.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeFilter === f ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-black/30 text-muted-foreground hover:text-foreground border border-white/5 backdrop-blur-sm"}`}>
                {f}
              </button>
            ))}
          </div>

          <section className="px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingPortfolio ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} tall />)
              ) : filteredPortfolio.length === 0 ? (
                <div className="col-span-full text-center py-24 text-muted-foreground">
                  {portfolioProjects.length === 0
                    ? "No projects yet. Check back soon!"
                    : "No projects in this category."}
                </div>
              ) : (
                filteredPortfolio.map((project) => (
                  <div key={project._id}
                    className="group relative rounded-2xl border border-white/5 bg-black/30 backdrop-blur-md overflow-hidden card-hover cursor-pointer shadow-xl"
                    onClick={() => setSelected(project)}>
                    <div className="relative h-52 overflow-hidden">
                      {project.image ? (
                        <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                          <span className="text-5xl font-black text-primary/30">{project.title.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium border border-white/20">
                          View Case Study
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}

      {/* ── GITHUB TAB ── */}
      {activeTab === "github" && (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Search + info bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4" />
                <span>Auto-syncs with GitHub every hour</span>
                {!loadingGithub && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {githubRepos.length} repos
                  </span>
                )}
              </div>
              <input
                value={githubSearch}
                onChange={(e) => setGithubSearch(e.target.value)}
                placeholder="Search by name, language, topic…"
                className="w-full sm:w-72 px-4 py-2 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {loadingGithub ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredGithub.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                {githubSearch ? `No repos matching "${githubSearch}"` : "No public repos found."}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGithub.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}

            {/* GitHub profile link */}
            {!loadingGithub && filteredGithub.length > 0 && (
              <div className="text-center mt-12">
                <a href="https://github.com/Deadraon" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:border-primary/40 transition-all text-sm font-medium hover:text-primary">
                  <Github className="w-4 h-4" />
                  View full GitHub profile
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Modal (Showcase) ── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64">
              {selected.image ? (
                <Image src={selected.image} alt={selected.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                  <span className="text-7xl font-black text-primary/30">{selected.title.charAt(0)}</span>
                </div>
              )}
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{selected.longDesc || selected.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selected.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4">
                {selected.live && (
                  <Button asChild variant="gradient" className="flex-1">
                    <a href={selected.live} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /> Live Demo</a>
                  </Button>
                )}
                {selected.github && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={selected.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" /> GitHub</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

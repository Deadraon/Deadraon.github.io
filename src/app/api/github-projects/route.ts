import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour — auto-refreshes every hour

const GITHUB_USERNAME = "Deadraon";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  fork: boolean;
  private: boolean;
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Deadraon-Portfolio",
    };

    // Use token if available for higher rate limits (5000 req/hr vs 60/hr)
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=public`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos: GitHubRepo[] = await res.json();

    // Filter out forks, map to a clean shape
    const projects = repos
      .filter((r) => !r.fork)
      .map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description || "",
        githubUrl: r.html_url,
        liveUrl: r.homepage || "",
        topics: r.topics || [],
        language: r.language || "",
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.updated_at,
        createdAt: r.created_at,
      }));

    return NextResponse.json({ projects, total: projects.length });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub repos", projects: [] }, { status: 500 });
  }
}

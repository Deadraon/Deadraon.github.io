"use client";

import { useState } from "react";

interface MediaInfo {
  title: string;
  duration: string;
  author: string;
  thumbnail: string;
}

const inputClass = "w-full rounded-xl border border-border bg-ink/5 text-ink px-4 py-2.5 text-sm placeholder-ink-faint focus:border-indigo-500/50 outline-none transition-all";

export function MediaDownloadTool() {
  const [url, setUrl] = useState("");
  const [backendUrl, setBackendUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<"video" | "audio">("video");
  const [selectedQuality, setSelectedQuality] = useState("best");
  const [showSettings, setShowSettings] = useState(false);

  async function handleAnalyze() {
    if (!url.trim()) return;
    setBusy(true);
    setError(null);
    setMediaInfo(null);
    setStatus("Analyzing media URL...");
    setProgress(15);

    try {
      if (backendUrl.trim()) {
        const res = await fetch(`${backendUrl}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) throw new Error("Backend analysis failed.");
        const data = await res.json();
        setMediaInfo(data);
      } else {
        let extractedTitle = "Online Video File";
        let author = "Content Creator";
        let thumbnail = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=225&fit=crop";
        let duration = "Video Stream";

        try {
          if (url.includes("youtube.com") || url.includes("youtu.be")) {
            setStatus("Fetching YouTube metadata...");
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await fetch(oembedUrl);
            if (res.ok) {
              const info = await res.json();
              extractedTitle = info.title || extractedTitle;
              author = info.author_name || author;
              thumbnail = info.thumbnail_url || thumbnail;
            }
          } else if (url.includes("vimeo.com")) {
            setStatus("Fetching Vimeo metadata...");
            const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
            const res = await fetch(oembedUrl);
            if (res.ok) {
              const info = await res.json();
              extractedTitle = info.title || extractedTitle;
              author = info.author_name || author;
              thumbnail = info.thumbnail_url || thumbnail;
              duration = info.duration ? `${Math.floor(info.duration / 60)}m ${info.duration % 60}s` : duration;
            }
          } else {
            const u = new URL(url);
            extractedTitle = u.pathname.split("/").pop() || u.hostname;
          }
        } catch (err) {
          console.warn("oEmbed failed:", err);
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
        setMediaInfo({ title: extractedTitle, duration, author, thumbnail });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze URL.");
    } finally {
      setBusy(false);
      setStatus(null);
      setProgress(0);
    }
  }

  async function handleDownload() {
    if (!url) return;
    setBusy(true);
    setError(null);
    setStatus("Generating download link...");
    setProgress(20);

    try {
      // 1. Try custom backend url if provided
      if (backendUrl.trim()) {
        setStatus("Downloading via custom backend...");
        const res = await fetch(`${backendUrl}/download`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, format: formatType, quality: selectedQuality }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setProgress(90);
            const a = document.createElement("a");
            a.href = data.url;
            a.target = "_blank";
            a.click();
            setProgress(100);
            setStatus("Completed!");
            return;
          }
        }
      }

      // 2. Try the primary server proxy
      setProgress(40);
      let downloadUrl = "";
      try {
        const res = await fetch("/api/media-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, format: formatType, quality: selectedQuality }),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            downloadUrl = data.url;
          } else if (data.error) {
            console.warn("Primary API proxy returned error response:", data.error);
          }
        }
      } catch (err) {
        console.warn("Primary API proxy failed, falling back to direct client-side requests...", err);
      }

      // 3. Dual-layer fallback: Direct browser requests to Cobalt instances
      if (!downloadUrl) {
        setStatus("Retrying directly from browser...");
        setProgress(60);
        
        const COBALT_CLIENT_INSTANCES = [
          "https://lime.clxxped.lol/",
          "https://grapefruit.clxxped.lol/",
          "https://nuko-c.meowing.de/",
          "https://cobaltapi.kittycat.boo/",
          "https://apicobalt.mgytr.top/",
          "https://cobaltapi.squair.xyz/"
        ];

        const isAudioOnly = formatType === "audio";
        let videoQuality = "720";
        if (selectedQuality === "1080p") videoQuality = "1080";
        if (selectedQuality === "720p") videoQuality = "720";
        if (selectedQuality === "480p") videoQuality = "480";
        if (selectedQuality === "best") videoQuality = "1080";

        const payload = {
          url: url,
          videoQuality: videoQuality,
          downloadMode: isAudioOnly ? "audio" : "auto",
          audioFormat: "mp3",
          filenameStyle: "classic"
        };

        let lastError = "";
        for (const endpoint of COBALT_CLIENT_INSTANCES) {
          try {
            const res = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.url) {
                downloadUrl = data.url;
                break;
              }
            } else {
              const errData = await res.json().catch(() => ({}));
              lastError = errData.text || `HTTP error ${res.status}`;
            }
          } catch (err) {
            lastError = err instanceof Error ? err.message : "Network error";
          }
        }

        if (!downloadUrl) {
          throw new Error(lastError || "Could not generate download link. All downloader nodes are currently offline or blocking the request.");
        }
      }

      setProgress(90);
      
      // Open in a new tab/window to trigger direct browser file stream download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.target = "_blank";
      a.click();
      
      setProgress(100);
      setStatus("Completed!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex gap-3 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 shrink-0 mt-0.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div className="space-y-1">
          <p className="font-semibold text-indigo-200">Serverless Downloader Proxy Active</p>
          <p className="text-indigo-300/70 text-xs leading-relaxed">
            Downloads are fully operational. Supports YouTube, TikTok, Twitter/X, Instagram, Vimeo, and more. Processing is completed client-side with a serverless link generator.
          </p>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-3">
        <label htmlFor="media-url" className="block text-xs font-semibold text-[#8891a8] uppercase tracking-wider">
          Media URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="media-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAnalyze(); }}
            placeholder="YouTube, Vimeo, Twitter, TikTok link…"
            disabled={busy}
            className={`${inputClass} flex-1`}
          />
          <button
            onClick={handleAnalyze}
            disabled={busy || !url.trim()}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 whitespace-nowrap flex items-center gap-2"
          >
            {busy && !mediaInfo ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
            ) : "Analyze link"}
          </button>
        </div>
      </div>

      {/* Progress */}
      {busy && (
        <div className="p-4 border border-border rounded-xl bg-bg-card space-y-3">
          <div className="flex justify-between text-xs text-ink-soft">
            <span className="font-semibold">{status}</span>
            <span className="font-[family-name:var(--font-mono)]">{progress}%</span>
          </div>
          <div className="w-full bg-ink/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 leading-relaxed">
          {error}
        </div>
      )}

      {/* Media info + download controls */}
      {mediaInfo && !busy && (
        <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
          {/* Thumbnail header */}
          <div className="relative h-36 bg-black overflow-hidden">
            <img src={mediaInfo.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-sm font-bold text-white line-clamp-1">{mediaInfo.title}</p>
              <p className="text-xs text-white/60 mt-0.5">{mediaInfo.author}</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Format toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Format</label>
              <div className="grid grid-cols-2 gap-2">
                {(["video", "audio"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormatType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      formatType === type
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                        : "bg-ink/5 border-border text-ink-soft hover:text-ink hover:border-border-hover"
                    }`}
                  >
                    {type === "video" ? "🎬 Video" : "🎵 Audio (MP3)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <label htmlFor="quality-select" className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                Quality
              </label>
              <select
                id="quality-select"
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className={inputClass}
              >
                {formatType === "video" ? (
                  <>
                    <option value="best">Best Quality (MP4)</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p SD</option>
                  </>
                ) : (
                  <option value="audio">High Quality (320kbps MP3)</option>
                )}
              </select>
            </div>

            <button
              onClick={handleDownload}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Start download
            </button>
          </div>
        </div>
      )}

      {/* Developer settings */}
      <div className="border-t border-border pt-5">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs font-semibold text-ink-faint hover:text-ink-soft transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {showSettings ? "Hide" : "Show"} Developer Settings
        </button>

        {showSettings && (
          <div className="mt-4 p-4 bg-bg-card border border-border rounded-xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint block">
              Custom backend endpoint
            </span>
            <p className="text-[11px] text-ink-faint leading-relaxed">
              Host a local API server running <span className="text-ink-soft font-mono">yt-dlp</span> and enter its URL here to enable real downloads.
            </p>
            <input
              type="url"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="e.g. http://localhost:5000/api"
              className={inputClass}
            />
          </div>
        )}
      </div>
    </div>
  );
}

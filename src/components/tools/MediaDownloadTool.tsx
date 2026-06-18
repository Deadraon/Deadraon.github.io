"use client";

import { useState, useEffect } from "react";
import { Download, Film, Music, Loader2, Link2, AlertCircle } from "lucide-react";

interface MediaInfo {
  title: string;
  duration: string;
  author: string;
  thumbnail: string;
}

export function MediaDownloadTool() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<"video" | "audio">("video");
  const [selectedQuality, setSelectedQuality] = useState("best");

  // Auto-analyze URL when it changes (debounced)
  useEffect(() => {
    if (!url.trim()) {
      setMediaInfo(null);
      setError(null);
      return;
    }

    // Basic URL validation before running analysis
    const isUrl = url.startsWith("http://") || url.startsWith("https://");
    if (!isUrl) return;

    const timer = setTimeout(() => {
      handleAnalyze(url);
    }, 600);

    return () => clearTimeout(timer);
  }, [url]);

  async function handleAnalyze(targetUrl: string) {
    setError(null);
    setStatus("Analyzing link...");
    setProgress(15);

    try {
      let extractedTitle = "Online Video File";
      let author = "Content Creator";
      let thumbnail = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=225&fit=crop";
      let duration = "Video Stream";

      try {
        if (targetUrl.includes("youtube.com") || targetUrl.includes("youtu.be")) {
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;
          const res = await fetch(oembedUrl);
          if (res.ok) {
            const info = await res.json();
            extractedTitle = info.title || extractedTitle;
            author = info.author_name || author;
            thumbnail = info.thumbnail_url || thumbnail;
          }
        } else if (targetUrl.includes("vimeo.com")) {
          const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(targetUrl)}`;
          const res = await fetch(oembedUrl);
          if (res.ok) {
            const info = await res.json();
            extractedTitle = info.title || extractedTitle;
            author = info.author_name || author;
            thumbnail = info.thumbnail_url || thumbnail;
            duration = info.duration ? `${Math.floor(info.duration / 60)}m ${info.duration % 60}s` : duration;
          }
        } else {
          const u = new URL(targetUrl);
          extractedTitle = u.pathname.split("/").pop() || u.hostname;
        }
      } catch (err) {
        console.warn("oEmbed fetch skipped or failed:", err);
      }

      setMediaInfo({ title: extractedTitle, duration, author, thumbnail });
    } catch (e) {
      console.error(e);
    } finally {
      setStatus(null);
      setProgress(0);
    }
  }

  async function handleDownload() {
    if (!url) return;
    setBusy(true);
    setError(null);
    setStatus("Connecting to downloader nodes...");
    setProgress(20);

    try {
      // 1. Try the primary server proxy
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

      // 2. Dual-layer fallback: Direct browser requests to Cobalt instances
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
      setError(e instanceof Error ? e.message : "Download failed. Please check the URL or try again.");
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Search Input Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label htmlFor="media-url" className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" />
            Media Link
          </label>
          {status && (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              {status}
            </span>
          )}
        </div>
        <div className="relative group/input">
          <input
            id="media-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube, Vimeo, TikTok, Instagram, Twitter link..."
            disabled={busy}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] text-foreground pl-5 pr-14 py-4 text-sm placeholder-white/20 focus:border-primary/50 focus:bg-white/[0.04] outline-none transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {url.trim() && (
              <button
                onClick={() => setUrl("")}
                disabled={busy}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground/60 leading-relaxed pl-1">
          Supports video/audio extraction from major platforms. Media is analyzed automatically in the background.
        </p>
      </div>

      {/* Progress Indicator */}
      {busy && (
        <div className="p-5 border border-white/10 rounded-2xl bg-white/[0.01] backdrop-blur-md space-y-3">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              {status || "Processing..."}
            </span>
            <span className="font-mono text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/[0.02]">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Download controls section */}
      {url.trim() && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-primary/20">
          
          {/* Optional Media Preview Cover */}
          {mediaInfo && (
            <div className="relative h-44 bg-black overflow-hidden border-b border-white/5">
              <img src={mediaInfo.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-60 scale-105 blur-[2px] absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/40 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end gap-1.5">
                <span className="text-[9px] font-bold text-primary border border-primary/20 bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest w-max">
                  {mediaInfo.duration}
                </span>
                <h3 className="text-sm md:text-base font-extrabold text-white line-clamp-1 select-none">
                  {mediaInfo.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-1 select-none">
                  {mediaInfo.author}
                </p>
              </div>
            </div>
          )}

          {/* Form Settings and Download Button */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Format Select */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Target Format
                </label>
                <div className="grid grid-cols-2 gap-2 bg-white/[0.03] p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setFormatType("video")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      formatType === "video"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-blue-500/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    Video
                  </button>
                  <button
                    onClick={() => setFormatType("audio")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      formatType === "audio"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-blue-500/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    Audio (MP3)
                  </button>
                </div>
              </div>

              {/* Quality Select */}
              <div className="space-y-2.5">
                <label htmlFor="quality-selector" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Media Quality
                </label>
                <select
                  id="quality-selector"
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-white/[0.03] text-foreground px-4 py-2.5 text-xs font-semibold focus:border-primary/50 outline-none transition-all cursor-pointer"
                >
                  {formatType === "video" ? (
                    <>
                      <option value="best" className="bg-[#0f1423]">Best Quality (Auto)</option>
                      <option value="1080p" className="bg-[#0f1423]">1080p Full HD</option>
                      <option value="720p" className="bg-[#0f1423]">720p HD</option>
                      <option value="480p" className="bg-[#0f1423]">480p SD</option>
                    </>
                  ) : (
                    <option value="audio" className="bg-[#0f1423]">High Quality (320kbps MP3)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={handleDownload}
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold px-6 py-4 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.01]"
            >
              <Download className="w-4 h-4" />
              {busy ? "Generating download..." : "Download Media"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

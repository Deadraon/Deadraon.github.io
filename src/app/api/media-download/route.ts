import { NextResponse } from "next/server";

// Primary & Secondary verified Cobalt v10 / API instances
const COBALT_ENDPOINTS = [
  "https://api.cobalt.tools/",
  "https://co.wuk.sh/",
  "https://cobalt.smalldev.tools/",
  "https://cobalt.kwiatekm.tokyo/",
  "https://cobalt.api.scrim.cloud/",
  "https://api.v2.cobalt.tools/",
  "https://lime.clxxped.lol/",
  "https://nuko-c.meowing.de/",
];

// Helper to sanitize incoming video/social media URLs
function cleanUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    // Retain core pathname, remove tracking queries
    const allowedParams = new Set(["v", "p", "id"]);
    const cleanParams = new URLSearchParams();
    
    parsed.searchParams.forEach((val, key) => {
      if (allowedParams.has(key)) {
        cleanParams.set(key, val);
      }
    });

    parsed.search = cleanParams.toString();
    return parsed.toString();
  } catch {
    return rawUrl.trim();
  }
}

// Fallback: TikTok Direct Downloader (No Watermark) via TikWM
async function downloadTikTokFallback(url: string) {
  try {
    const apiRes = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url, hd: "1" }),
      signal: AbortSignal.timeout(5000),
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.data) {
        return {
          url: data.data.play || data.data.wmplay || data.data.music,
          title: data.data.title || "TikTok Video",
          author: data.data.author?.nickname || "TikTok Creator",
        };
      }
    }
  } catch (err) {
    console.warn("TikTok fallback failed:", err);
  }
  return null;
}

// Fallback: Twitter / X Media via VxTwitter API
async function downloadTwitterFallback(url: string) {
  try {
    const tweetMatch = url.match(/(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/i);
    if (!tweetMatch) return null;
    const tweetId = tweetMatch[1];
    
    const apiRes = await fetch(`https://api.vxtwitter.com/Twitter/status/${tweetId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data && data.media_extended && data.media_extended.length > 0) {
        const media = data.media_extended.find((m: { type: string }) => m.type === "video" || m.type === "gif") || data.media_extended[0];
        return {
          url: media.url,
          title: data.text ? data.text.slice(0, 60) : "Twitter Media",
          author: data.user_name || "Twitter User",
        };
      }
    }
  } catch (err) {
    console.warn("Twitter fallback failed:", err);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawUrl = body.url;
    const format = body.format || "video";
    const quality = body.quality || "720p";

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "Media URL is required" }, { status: 400 });
    }

    const sanitizedUrl = cleanUrl(rawUrl);
    const isAudioOnly = format === "audio";
    
    let videoQuality = "720";
    if (quality === "1080p") videoQuality = "1080";
    if (quality === "480p") videoQuality = "480";
    if (quality === "best") videoQuality = "max";

    const payload = {
      url: sanitizedUrl,
      videoQuality: videoQuality,
      downloadMode: isAudioOnly ? "audio" : "auto",
      audioFormat: "mp3",
      filenameStyle: "classic",
    };

    let downloadUrl = "";
    let downloadTitle = "download";
    let lastError = "";

    // 1. Try Tier 1 Cobalt Instances
    for (const endpoint of COBALT_ENDPOINTS) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && (data.url || data.picker)) {
            downloadUrl = data.url || (data.picker && data.picker[0] ? data.picker[0].url : "");
            downloadTitle = data.filename || "media_download";
            if (downloadUrl) break;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData.text || errData.error || `HTTP error ${res.status}`;
        }
      } catch (e) {
        lastError = e instanceof Error ? e.message : "Network timeout";
      }
    }

    // 2. Try Dedicated Tier 2 Fallbacks if Cobalt did not yield a direct link
    if (!downloadUrl) {
      if (sanitizedUrl.includes("tiktok.com")) {
        const tiktokResult = await downloadTikTokFallback(sanitizedUrl);
        if (tiktokResult && tiktokResult.url) {
          downloadUrl = tiktokResult.url;
          downloadTitle = tiktokResult.title;
        }
      } else if (sanitizedUrl.includes("twitter.com") || sanitizedUrl.includes("x.com")) {
        const twitterResult = await downloadTwitterFallback(sanitizedUrl);
        if (twitterResult && twitterResult.url) {
          downloadUrl = twitterResult.url;
          downloadTitle = twitterResult.title;
        }
      }
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { 
          error: lastError || "Could not retrieve media link. Please verify the URL or make sure the post is public." 
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: downloadUrl,
      title: downloadTitle,
    });
  } catch (err) {
    console.error("Media downloader API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

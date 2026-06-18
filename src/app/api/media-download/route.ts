import { NextResponse } from "next/server";

// Fallback list of public Cobalt instances in case the main one is rate-limited or offline
const COBALT_INSTANCES = [
  "https://lime.clxxped.lol/",
  "https://grapefruit.clxxped.lol/",
  "https://nuko-c.meowing.de/",
  "https://cobaltapi.kittycat.boo/",
  "https://apicobalt.mgytr.top/",
  "https://cobaltapi.squair.xyz/"
];

export async function POST(request: Request) {
  try {
    const { url, format, quality } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Media URL is required" }, { status: 400 });
    }

    // Determine Cobalt request payload parameters
    const isAudioOnly = format === "audio";
    let videoQuality = "720";
    if (quality === "1080p") videoQuality = "1080";
    if (quality === "720p") videoQuality = "720";
    if (quality === "480p") videoQuality = "480";
    if (quality === "best") videoQuality = "1080";

    const payload = {
      url: url,
      videoQuality: videoQuality,
      downloadMode: isAudioOnly ? "audio" : "auto",
      audioFormat: "mp3",
      filenameStyle: "classic"
    };

    let responseData = null;
    let lastError = "";

    // Try Cobalt API endpoints in order
    for (const apiEndpoint of COBALT_INSTANCES) {
      try {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          // Short timeout to fallback quickly if an instance is lagging
          signal: AbortSignal.timeout(6000)
        });

        if (res.ok) {
          responseData = await res.json();
          if (responseData && responseData.url) {
            break;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = errData.text || `HTTP error ${res.status}`;
        }
      } catch (e) {
        lastError = e instanceof Error ? e.message : "Network error";
      }
    }

    if (!responseData || !responseData.url) {
      return NextResponse.json(
        { error: lastError || "Failed to retrieve stream URL from downloader nodes. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      url: responseData.url,
      title: responseData.filename || "download"
    });
  } catch (err) {
    console.error("Media downloader API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

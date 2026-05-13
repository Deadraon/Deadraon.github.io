import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Kunal Chauhan | Premium Full Stack Developer";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#030712",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Background Accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "12px",
            background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
          }}
        />

        {/* Floating Decorative Elements */}
        <div style={{ position: "absolute", right: "10%", top: "15%", color: "rgba(59, 130, 246, 0.15)", fontSize: "120px", fontWeight: "bold" }}>{"{"}</div>
        <div style={{ position: "absolute", right: "20%", top: "45%", color: "rgba(139, 92, 246, 0.15)", fontSize: "80px", fontWeight: "bold" }}>{"["}</div>
        <div style={{ position: "absolute", right: "12%", top: "70%", color: "rgba(16, 185, 129, 0.15)", fontSize: "140px", fontWeight: "bold" }}>{"</>"}</div>

        {/* Top right: Open to work badge */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            padding: "12px 24px",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "2px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "100px",
          }}
        >
          <div style={{ width: "16px", height: "16px", borderRadius: "8px", backgroundColor: "#10b981", marginRight: "16px" }} />
          <span style={{ color: "#10b981", fontSize: "24px", fontWeight: "bold", letterSpacing: "0.05em" }}>OPEN TO WORK</span>
        </div>

        {/* Main Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            paddingLeft: "100px",
          }}
        >
          {/* Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "110px",
                fontWeight: "900",
                color: "white",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              Kunal
            </h1>
            <h1
              style={{
                fontSize: "110px",
                fontWeight: "900",
                color: "white",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                margin: 0,
              }}
            >
              Chauhan.
            </h1>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: "48px",
              fontWeight: "500",
              color: "#9ca3af",
              margin: 0,
              marginBottom: "60px",
              letterSpacing: "-0.02em",
            }}
          >
            Premium Full-Stack Developer
          </h2>

          {/* Tech Stack List */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", maxWidth: "850px", alignItems: "center" }}>
            {[
              { name: "React", color: "#38bdf8" },
              { name: "Next.js", color: "#ffffff" },
              { name: "Node.js", color: "#4ade80" },
              { name: "Flutter", color: "#60a5fa" },
              { name: "TypeScript", color: "#818cf8" },
              { name: "MongoDB", color: "#34d399" },
            ].map((tech, i) => (
              <div
                key={tech.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                {i > 0 && <span style={{ color: "#374151", marginRight: "24px" }}>•</span>}
                <span style={{ color: tech.color }}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Website URL */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "100px",
            display: "flex",
            alignItems: "center",
            color: "#6b7280",
            fontSize: "30px",
            fontWeight: "600",
            letterSpacing: "0.05em",
          }}
        >
          deadraon.dev
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

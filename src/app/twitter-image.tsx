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
          backgroundColor: "#050B14", // Very dark professional blue/black
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* SVG Grid Background */}
        <svg
          width="1200"
          height="630"
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "-100px",
            width: "800px",
            height: "800px",
            backgroundImage: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "400px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            right: "-100px",
            width: "800px",
            height: "800px",
            backgroundImage: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "400px",
          }}
        />

        {/* Floating Decorative Code Elements */}
        <div style={{ position: "absolute", right: "8%", top: "15%", color: "rgba(59, 130, 246, 0.2)", fontSize: "120px", fontWeight: "bold", fontFamily: "monospace" }}>{"{"}</div>
        <div style={{ position: "absolute", right: "20%", top: "40%", color: "rgba(139, 92, 246, 0.15)", fontSize: "80px", fontWeight: "bold", fontFamily: "monospace" }}>{"["}</div>
        <div style={{ position: "absolute", right: "12%", top: "65%", color: "rgba(16, 185, 129, 0.15)", fontSize: "140px", fontWeight: "bold", fontFamily: "monospace" }}>{"</>"}</div>

        {/* Top right: Open to work badge */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "rgba(20, 30, 50, 0.8)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "100px",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.1)",
          }}
        >
          <div style={{ width: "12px", height: "12px", borderRadius: "6px", backgroundColor: "#10b981", marginRight: "12px" }} />
          <span style={{ color: "#d1d5db", fontSize: "20px", fontWeight: "600", letterSpacing: "0.05em" }}>OPEN TO WORK</span>
        </div>

        {/* Main Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            paddingLeft: "80px",
          }}
        >
          {/* Logo / Monogram */}
          <div style={{ display: "flex", marginBottom: "40px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "36px",
                fontWeight: "900",
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
              }}
            >
              KC
            </div>
          </div>

          {/* Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "16px",
            }}
          >
            <h1
              style={{
                fontSize: "96px",
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
                fontSize: "96px",
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
              fontSize: "42px",
              fontWeight: "500",
              color: "#9ca3af",
              margin: 0,
              marginBottom: "50px",
              letterSpacing: "-0.02em",
            }}
          >
            Premium Full-Stack Developer
          </h2>

          {/* Tech Stack List */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", maxWidth: "800px", alignItems: "center" }}>
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
                  fontSize: "26px",
                  fontWeight: "600",
                }}
              >
                {i > 0 && <span style={{ color: "#374151", marginRight: "20px" }}>•</span>}
                <span style={{ color: tech.color }}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Website URL */}
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            color: "#6b7280",
            fontSize: "26px",
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

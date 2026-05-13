import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Deadraon | Premium Full Stack Developer";
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
          background: "linear-gradient(to bottom right, #09090b, #18181b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60%",
            height: "60%",
            background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 100,
              fontWeight: "bold",
              color: "white",
              letterSpacing: "-0.05em",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Deadraon.dev
          </div>
          <div
            style={{
              fontSize: 48,
              color: "#a1a1aa",
              textAlign: "center",
              marginBottom: 60,
              maxWidth: "900px",
            }}
          >
            Premium Full Stack & Mobile App Developer
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            {["React", "Next.js", "Node.js", "Flutter", "TypeScript"].map((tech) => (
              <div
                key={tech}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "12px 24px",
                  borderRadius: "100px",
                  color: "#e4e4e7",
                  fontSize: 28,
                  fontWeight: 500,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

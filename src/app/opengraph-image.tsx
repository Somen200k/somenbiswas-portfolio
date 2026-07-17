import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(245,158,11,0.28), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            color: "#a3a3a3",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          Solo AI Builder
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 84,
            fontWeight: 700,
            color: "#f5f5f4",
          }}
        >
          Somen&nbsp;
          <span
            style={{
              display: "flex",
              backgroundImage: "linear-gradient(120deg, #fcd34d, #f59e0b)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Biswas
          </span>
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 32, color: "#a3a3a3" }}>
          I build AI-powered products
        </div>
      </div>
    ),
    { ...size }
  );
}

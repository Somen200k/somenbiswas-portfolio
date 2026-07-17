import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #161104, #0a0a0a)",
          borderRadius: 16,
        }}
      >
        <svg width="42" height="42" viewBox="0 0 40 40" fill="none">
          <path
            d="M10.5 26.5 Q19.5 23.5 28.5 11.5"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="10.5" cy="26.5" r="2.6" fill="#f59e0b" />
          <circle cx="19.7" cy="20.6" r="3.4" fill="#f7ac1f" />
          <circle cx="28.5" cy="11.5" r="4.3" fill="#fcd34d" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

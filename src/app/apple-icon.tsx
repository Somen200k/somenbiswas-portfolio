import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <svg width="112" height="112" viewBox="0 0 40 40" fill="none">
          <path
            d="M27 14.8c-1.1-1.6-2.9-2.5-5.4-2.5-3.6 0-5.7 1.7-5.7 4.1 0 2.2 1.5 3.3 4.3 3.9l2.3.5c3.6.8 5.6 2.3 5.6 5.1 0 3.3-2.9 5.4-7.2 5.4-3.4 0-6-1.2-7.4-3.5"
            stroke="#f59e0b"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}

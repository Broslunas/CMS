import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Broslunas CMS";
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
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "white",
              margin: 0,
              marginBottom: 20,
              letterSpacing: "-0.05em",
            }}
          >
            Broslunas
          </h1>
          <div
            style={{
              fontSize: 40,
              color: "#a1a1aa", // zinc-400
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            CMS System
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The link preview for every page without a photograph of its own (dish and
 * category pages use their dish photo): Heritage Red, the logo in ivory, and
 * Panda 7 at the wok. Built once at build time.
 */

export const alt = "7 Noodles 恰小面: Sichuan noodles on Yonge Street, North York";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RED = "#862218";
const IVORY = "#f3eee5";
const GOLD = "#f2d288";

export default async function Image() {
  const [logoSource, panda] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo-lockup.svg"), "utf8"),
    readFile(join(process.cwd(), "src/assets/og/panda-chef.png")),
  ]);
  // The site's own logo file, recoloured ivory.
  const logo = `data:image/svg+xml;base64,${Buffer.from(
    logoSource.replace("<path ", `<path fill="${IVORY}" `),
  ).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: RED,
        padding: "0 80px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <img src={logo} width={680} height={210} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: IVORY,
            fontSize: 34,
            lineHeight: 1.3,
          }}
        >
          <span>Sichuan noodles · Yonge St, North York</span>
          <span style={{ color: GOLD }}>Come for a bowl. Stay for a little warmth.</span>
        </div>
      </div>
      <img
        src={`data:image/png;base64,${panda.toString("base64")}`}
        width={380}
        height={389}
        alt=""
      />
    </div>,
    size,
  );
}

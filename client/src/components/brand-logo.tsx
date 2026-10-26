import logoShieldPng from "@assets/OpenDefenderLogo2-removebg-preview_1773114975197.png";

interface BrandLogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md";
}

const TEAL = "var(--editorial-signal)";
const WHITE = "#FFFFFF";

export function BrandLogo({ variant = "default", size = "sm" }: BrandLogoProps) {
  const color = variant === "light" ? WHITE : TEAL;
  const textSize = size === "sm" ? "text-xl" : "text-[22px]";
  const dim = size === "sm" ? 27 : 30;

  return (
    <div className="flex items-center gap-2" style={{ lineHeight: 1 }}>
      <span
        aria-hidden="true"
        style={{ width: dim, height: dim, flexShrink: 0, backgroundColor: color,
          mask: `url(${logoShieldPng}) center / contain no-repeat`,
          WebkitMask: `url(${logoShieldPng}) center / contain no-repeat` }}
      />
      <span
        className={`brand-wordmark font-bold ${textSize} tracking-tight`}
        style={{ color, letterSpacing: "-1px" }}
      >
        OpenDefender.
      </span>
    </div>
  );
}

export function BrandShieldIcon({
  size = 16,
  className = "",
  light = false,
}: {
  size?: number;
  className?: string;
  light?: boolean;
}) {
  return (
    <img
      src={logoShieldPng}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        flexShrink: 0,
        display: "block",
        filter: light ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}

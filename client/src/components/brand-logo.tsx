interface BrandLogoProps {
  variant?: "default" | "light";
  size?: "sm" | "md";
}

const TEAL = "#2D8EA5";
const WHITE = "#FFFFFF";

function ShieldIcon({ size }: { size: "sm" | "md" }) {
  const dim = size === "sm" ? 28 : 36;
  return (
    <img
      src="/android-chrome-192x192.png"
      width={dim}
      height={dim}
      alt=""
      aria-hidden="true"
      style={{ flexShrink: 0, objectFit: "contain" }}
    />
  );
}

export function BrandLogo({ variant = "default", size = "sm" }: BrandLogoProps) {
  const color = variant === "light" ? WHITE : TEAL;
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2" style={{ lineHeight: 1 }}>
      <ShieldIcon size={size} />
      <span
        className={`font-bold ${textSize} tracking-tight`}
        style={{ color, letterSpacing: "-0.01em" }}
      >
        OpenDefender
      </span>
    </div>
  );
}

export function BrandShieldIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
  light?: boolean;
}) {
  return (
    <img
      src="/android-chrome-192x192.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={className}
      style={{ flexShrink: 0, objectFit: "contain" }}
    />
  );
}

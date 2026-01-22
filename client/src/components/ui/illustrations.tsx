import { cn } from "@/lib/utils";

interface IllustrationProps {
  className?: string;
}

// Empty search results illustration - magnifying glass with document
export function EmptySearchIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-muted/50" />

      {/* Document stack */}
      <rect x="55" y="50" width="70" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
      <rect x="60" y="45" width="70" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
      <rect x="65" y="40" width="70" height="90" rx="4" className="fill-card stroke-border" strokeWidth="2" />

      {/* Document lines */}
      <line x1="75" y1="60" x2="125" y2="60" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="72" x2="120" y2="72" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="84" x2="115" y2="84" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="96" x2="110" y2="96" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />

      {/* Magnifying glass */}
      <circle cx="135" cy="130" r="25" className="fill-background stroke-primary" strokeWidth="3" />
      <line x1="153" y1="148" x2="170" y2="165" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />

      {/* Question mark in magnifying glass */}
      <text x="135" y="138" textAnchor="middle" className="fill-muted-foreground text-2xl font-bold">?</text>
    </svg>
  );
}

// No data / empty state illustration
export function EmptyDataIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-muted/50" />

      {/* Folder */}
      <path
        d="M45 70 L45 150 Q45 155 50 155 L150 155 Q155 155 155 150 L155 80 Q155 75 150 75 L100 75 L90 65 L50 65 Q45 65 45 70"
        className="fill-card stroke-border"
        strokeWidth="2"
      />

      {/* Folder tab */}
      <path
        d="M50 65 L90 65 L100 75 L50 75 Q45 75 45 70 L45 70 Q45 65 50 65"
        className="fill-muted stroke-border"
        strokeWidth="2"
      />

      {/* Empty indicator - dashed circle */}
      <circle cx="100" cy="115" r="20" className="stroke-muted-foreground/40" strokeWidth="2" strokeDasharray="4 4" fill="none" />

      {/* Plus sign */}
      <line x1="100" y1="105" x2="100" y2="125" className="stroke-muted-foreground/40" strokeWidth="2" strokeLinecap="round" />
      <line x1="90" y1="115" x2="110" y2="115" className="stroke-muted-foreground/40" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Success / completed illustration
export function SuccessIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-green-100 dark:fill-green-900/30" />

      {/* Inner circle */}
      <circle cx="100" cy="100" r="50" className="fill-green-500/20 stroke-green-500" strokeWidth="3" />

      {/* Checkmark */}
      <path
        d="M75 100 L92 117 L125 84"
        className="stroke-green-600 dark:stroke-green-400"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Legal scales illustration
export function LegalScalesIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-primary/5" />

      {/* Base */}
      <rect x="85" y="160" width="30" height="8" rx="2" className="fill-primary/60" />

      {/* Pillar */}
      <rect x="96" y="70" width="8" height="95" className="fill-primary/40" />

      {/* Top beam */}
      <rect x="40" y="65" width="120" height="8" rx="2" className="fill-primary/60" />

      {/* Left pan holder */}
      <line x1="55" y1="73" x2="55" y2="100" className="stroke-primary/50" strokeWidth="2" />

      {/* Right pan holder */}
      <line x1="145" y1="73" x2="145" y2="90" className="stroke-primary/50" strokeWidth="2" />

      {/* Left pan */}
      <ellipse cx="55" cy="105" rx="25" ry="8" className="fill-primary/30 stroke-primary/50" strokeWidth="2" />

      {/* Right pan */}
      <ellipse cx="145" cy="95" rx="25" ry="8" className="fill-primary/30 stroke-primary/50" strokeWidth="2" />

      {/* Decorative top */}
      <circle cx="100" cy="60" r="8" className="fill-primary/60" />
    </svg>
  );
}

// Document/form illustration
export function DocumentIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-muted/50" />

      {/* Document */}
      <rect x="55" y="35" width="90" height="130" rx="4" className="fill-card stroke-border" strokeWidth="2" />

      {/* Corner fold */}
      <path d="M115 35 L145 35 L145 65 L115 65 L115 35" className="fill-muted stroke-border" strokeWidth="2" />
      <path d="M115 35 L115 65 L145 65" className="fill-card stroke-border" strokeWidth="2" />

      {/* Document lines */}
      <line x1="70" y1="80" x2="130" y2="80" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="95" x2="125" y2="95" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="110" x2="120" y2="110" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="125" x2="115" y2="125" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="140" x2="100" y2="140" className="stroke-muted-foreground/30" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Location/map illustration
export function LocationIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-teal-100 dark:fill-teal-900/30" />

      {/* Map pin */}
      <path
        d="M100 45 C75 45 55 65 55 90 C55 120 100 155 100 155 C100 155 145 120 145 90 C145 65 125 45 100 45"
        className="fill-teal-500/80 stroke-teal-600"
        strokeWidth="3"
      />

      {/* Inner circle */}
      <circle cx="100" cy="85" r="18" className="fill-white dark:fill-teal-100" />
    </svg>
  );
}

// Error/warning illustration
export function ErrorIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-red-100 dark:fill-red-900/30" />

      {/* Warning triangle */}
      <path
        d="M100 50 L155 140 L45 140 Z"
        className="fill-red-500/20 stroke-red-500"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Exclamation mark */}
      <line x1="100" y1="80" x2="100" y2="110" className="stroke-red-600 dark:stroke-red-400" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="125" r="4" className="fill-red-600 dark:fill-red-400" />
    </svg>
  );
}

// Shield/security illustration (for privacy)
export function ShieldIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-primary/5" />

      {/* Shield */}
      <path
        d="M100 40 L155 55 L155 100 C155 130 130 155 100 170 C70 155 45 130 45 100 L45 55 L100 40"
        className="fill-primary/20 stroke-primary"
        strokeWidth="3"
      />

      {/* Checkmark */}
      <path
        d="M75 100 L92 117 L125 84"
        className="stroke-primary"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Gavel illustration (for court)
export function GavelIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-amber-100 dark:fill-amber-900/30" />

      {/* Gavel head */}
      <rect x="60" y="55" width="50" height="25" rx="4" className="fill-amber-600 dark:fill-amber-500" transform="rotate(-30 85 67.5)" />

      {/* Handle */}
      <rect x="85" y="70" width="70" height="12" rx="2" className="fill-amber-700 dark:fill-amber-600" transform="rotate(60 120 76)" />

      {/* Sound block base */}
      <rect x="55" y="145" width="90" height="15" rx="3" className="fill-amber-800 dark:fill-amber-700" />
      <rect x="60" y="135" width="80" height="12" rx="2" className="fill-amber-700 dark:fill-amber-600" />
    </svg>
  );
}

// People/community illustration (for support)
export function CommunityIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={cn("w-full h-full", className)}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="80" className="fill-rose-100 dark:fill-rose-900/30" />

      {/* Center person (larger) */}
      <circle cx="100" cy="75" r="20" className="fill-rose-400 dark:fill-rose-500" />
      <path d="M70 130 Q70 105 100 105 Q130 105 130 130" className="fill-rose-400 dark:fill-rose-500" />

      {/* Left person */}
      <circle cx="55" cy="90" r="15" className="fill-rose-300 dark:fill-rose-400" />
      <path d="M35 130 Q35 110 55 110 Q75 110 75 130" className="fill-rose-300 dark:fill-rose-400" />

      {/* Right person */}
      <circle cx="145" cy="90" r="15" className="fill-rose-300 dark:fill-rose-400" />
      <path d="M125 130 Q125 110 145 110 Q165 110 165 130" className="fill-rose-300 dark:fill-rose-400" />
    </svg>
  );
}

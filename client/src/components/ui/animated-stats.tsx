import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (value - startValue) * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={cn("stat-number", className)}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

interface StatCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  value,
  label,
  prefix,
  suffix,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "text-center p-6 rounded-xl bg-card border",
        "hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

interface StatRowProps {
  stats: Array<{
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export function StatRow({ stats, className }: StatRowProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        stats.length === 2 && "grid-cols-2",
        stats.length === 3 && "grid-cols-1 sm:grid-cols-3",
        stats.length === 4 && "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          value={stat.value}
          label={stat.label}
          prefix={stat.prefix}
          suffix={stat.suffix}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

// Compact inline stat for use in text
interface InlineStatProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function InlineStat({ value, suffix = "", className }: InlineStatProps) {
  return (
    <span className={cn("font-bold text-primary", className)}>
      <AnimatedNumber value={value} suffix={suffix} duration={1500} />
    </span>
  );
}

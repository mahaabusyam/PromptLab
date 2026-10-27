import { useId } from "react";

interface SparklineProps {
  values: number[];
  className?: string; // اللون بيجي من text-* لأن الرسم بيستخدم currentColor
}

const WIDTH = 160;
const HEIGHT = 36;
const PADDING = 4;

export function Sparkline({ values, className = "" }: SparklineProps) {
  const gradientId = useId().replace(/:/g, "");
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const step = WIDTH / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * step;
    const y = PADDING + (1 - (v - min) / range) * (HEIGHT - PADDING * 2);
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const line = `M${points.join(" L")}`;
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={`h-9 w-full overflow-visible ${className}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

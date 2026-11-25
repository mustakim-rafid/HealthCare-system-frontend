import { useId } from "react";
import { cn } from "@/lib/utils";

export const BRAND_NAME = "Health Care";

interface LogoMarkProps {
  /** Rendered width/height of the mark in pixels. */
  size?: number;
  className?: string;
}

/**
 * The Health Care brand mark: a rounded shield with a medical cross and a
 * pulse line. Purely decorative — always pair it with visible or sr-only text.
 */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  // Unique gradient id so several logos on one page never clash.
  const gradientId = `hc-logo-gradient-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="5"
          y1="2"
          x2="27"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#14b8c4" />
          <stop offset="1" stopColor="#0e6fa8" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.75 26.25 6.6c.75.28 1.25 1 1.25 1.8V15c0 6.9-4.6 12.2-11.06 14.37a1.4 1.4 0 0 1-.88 0C9.1 27.2 4.5 21.9 4.5 15V8.4c0-.8.5-1.52 1.25-1.8L16 2.75Z"
        fill={`url(#${gradientId})`}
      />
      <rect x="14.4" y="7.25" width="3.2" height="9.5" rx="1" fill="#fff" />
      <rect x="11.25" y="10.4" width="9.5" height="3.2" rx="1" fill="#fff" />
      <path
        d="M8.75 21.5h3.75l1.4-2.25 2.2 4.5 1.8-3.5 1.1 1.25h4.25"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  /** Size of the mark in pixels. Text scales via `textClassName`. */
  size?: number;
  /** Show the "Health Care" wordmark next to the mark. */
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * Mark + wordmark. When `showText` is false the brand name is still exposed
 * to assistive technology via an sr-only label.
 */
export default function Logo({
  size = 32,
  showText = true,
  className,
  textClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {showText ? (
        <span
          className={cn(
            "text-xl font-bold tracking-tight whitespace-nowrap text-foreground",
            textClassName
          )}
        >
          {BRAND_NAME}
        </span>
      ) : (
        <span className="sr-only">{BRAND_NAME}</span>
      )}
    </span>
  );
}

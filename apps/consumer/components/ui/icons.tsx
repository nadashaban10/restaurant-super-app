import {
  Check,
  Clock3,
  Heart,
  MapPin,
  Phone,
  ShoppingCart,
  TriangleAlert,
  X,
} from "lucide-react";

type IconProps = {
  className?: string;
  title?: string;
  size?: number;
  strokeWidth?: number;
};

function a11y(title?: string) {
  if (!title) return { "aria-hidden": true as const };
  return { "aria-hidden": false as const, "aria-label": title, role: "img" as const };
}

export function IconPhone({ className, title, size = 20, strokeWidth = 1.8 }: IconProps) {
  return <Phone className={className} size={size} strokeWidth={strokeWidth} {...a11y(title)} />;
}

export function IconWhatsApp({ className, title, size = 20 }: IconProps) {
  // Lucide has no WhatsApp brand icon; keep the recognizable mark.
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={!title}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.96.52 3.84 1.5 5.5L2 22l4.83-1.56a9.9 9.9 0 0 0 5.21 1.47h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2Zm5.76 14.03c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.3-1.64-.59-2.89-1.25-4.77-4.16-4.91-4.35-.14-.2-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.26-.28.57-.35.76-.35h.55c.18 0 .41-.05.64.49.24.56.8 1.94.87 2.08.07.14.12.3.02.48-.1.19-.15.3-.3.47-.14.16-.3.36-.43.49-.14.14-.29.29-.12.56.16.28.73 1.2 1.57 1.94 1.08.95 1.99 1.25 2.27 1.39.28.14.44.12.61-.07.16-.19.7-.81.89-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.7-.17 1.38Z" />
    </svg>
  );
}

export function IconMapPin({ className, title, size = 20, strokeWidth = 1.8 }: IconProps) {
  return <MapPin className={className} size={size} strokeWidth={strokeWidth} {...a11y(title)} />;
}

export function IconFacebook({ className, title, size = 20 }: IconProps) {
  // Lucide v1 removed brand icons; keep the recognizable mark.
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={!title}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
    </svg>
  );
}

export function IconInstagram({ className, title, size = 20, strokeWidth = 1.8 }: IconProps) {
  // Lucide v1 removed brand icons; keep the recognizable mark.
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={!title}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTikTok({ className, title, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={!title}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d="M16.6 5.8A4.7 4.7 0 0 1 14.9 2h-3.1v13.2a2.5 2.5 0 1 1-1.8-2.4V9.6a5.6 5.6 0 1 0 4.9 5.5V9a7.8 7.8 0 0 0 4.5 1.4V7.3a4.7 4.7 0 0 1-2.8-1.5Z" />
    </svg>
  );
}

export function IconClock({ className, title, size = 20, strokeWidth = 1.8 }: IconProps) {
  return <Clock3 className={className} size={size} strokeWidth={strokeWidth} {...a11y(title)} />;
}

export function IconCheck({ className, title, size = 18, strokeWidth = 2.2 }: IconProps) {
  return <Check className={className} size={size} strokeWidth={strokeWidth} {...a11y(title)} />;
}

export function IconAlert({ className, title, size = 18, strokeWidth = 1.8 }: IconProps) {
  return <TriangleAlert className={className} size={size} strokeWidth={strokeWidth} {...a11y(title)} />;
}

export function IconClose({ className, title, size = 18, strokeWidth = 1.8 }: IconProps) {
  return <X className={className} size={size} strokeWidth={strokeWidth} {...a11y(title)} />;
}

export function IconHeart({
  className,
  filled = false,
  size = 20,
  strokeWidth = 1.8,
}: IconProps & { filled?: boolean }) {
  return (
    <Heart
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      fill={filled ? "currentColor" : "none"}
      aria-hidden
    />
  );
}

export function IconCart({ className, title, size = 22, strokeWidth = 1.8 }: IconProps) {
  return <ShoppingCart className={className} size={size} strokeWidth={strokeWidth} {...a11y(title)} />;
}

import type { ReactNode } from "react";

export type IconName =
  | "sales"
  | "purchases"
  | "inventory"
  | "production"
  | "accounting"
  | "workforce"
  | "grid"
  | "mobile"
  | "lock"
  | "lineNode"
  | "shield"
  | "spreadsheet"
  | "chat"
  | "notebook"
  | "mark";

const PATHS: Record<IconName, ReactNode> = {
  sales: (
    <>
      <path d="M3 4h2l2.4 11.6a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </>
  ),
  purchases: (
    <>
      <path d="M12 3v11" />
      <path d="M7 9l5 5 5-5" />
      <path d="M4 19h16" />
    </>
  ),
  inventory: (
    <>
      <rect x="3" y="10" width="7" height="7" rx="1" />
      <rect x="14" y="10" width="7" height="7" rx="1" />
      <rect x="8.5" y="3" width="7" height="6" rx="1" />
    </>
  ),
  production: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </>
  ),
  accounting: <path d="M4 20V12M10 20V6M16 20v-9M21 20H3" />,
  workforce: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="11" y1="19" x2="13" y2="19" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  lineNode: (
    <>
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  spreadsheet: (
    <g strokeWidth={1.6}>
      <rect x="3.5" y="4" width="17" height="16" rx="1.5" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="3.5" y1="15" x2="20.5" y2="15" />
      <line x1="10" y1="4" x2="10" y2="20" />
      <line x1="15.5" y1="4" x2="15.5" y2="20" />
    </g>
  ),
  chat: (
    <g strokeWidth={1.6}>
      <path d="M4 5h16v11H9l-4 3.5V16H4V5z" />
    </g>
  ),
  notebook: (
    <g strokeWidth={1.6}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <line x1="8.5" y1="8" x2="15.5" y2="8" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
      <line x1="8.5" y1="16" x2="13" y2="16" />
    </g>
  ),
  mark: (
    <g strokeWidth={1.9}>
      <line x1="4" y1="12" x2="14" y2="12" />
      <circle cx="19" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </g>
  ),
};

export default function Icon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

// src/features/bug-hunting/constants/tabs.ts
export const BUG_TABS = {
  LOGS: "logs",
  SQL: "sql",
  CODE: "code",
  DOCS: "docs",
  DEPLOYMENTS: "deployments",
} as const;

export type TabId = (typeof BUG_TABS)[keyof typeof BUG_TABS];

export const TAB_LIST: { id: TabId; label: string }[] = [
  { id: BUG_TABS.LOGS, label: "Logs" },
  { id: BUG_TABS.SQL, label: "SQL runner" },
  { id: BUG_TABS.CODE, label: "Code" },
  { id: BUG_TABS.DOCS, label: "Tech docs" },
  { id: BUG_TABS.DEPLOYMENTS, label: "Deployments" },
];
import {
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Article, User } from "./types";

export const currency = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
});

export const number = new Intl.NumberFormat("es-EC");

export const dateFormatter = new Intl.DateTimeFormat("es-EC", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function sectionName(article: Article) {
  return typeof article.sectionId === "string"
    ? "Sin sección"
    : article.sectionId.name;
}

export function roleName(user: User) {
  const role = user.role ?? user.roleId;
  return typeof role === "string" ? "Rol asignado" : role?.roleName ?? "Sin rol";
}

export function formatDate(value?: string) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sin fecha" : dateFormatter.format(date);
}

export type ActionRunner = <T>(
  action: () => Promise<T>,
  successMessage: string,
) => Promise<boolean>;

export function EmptyState({
  icon: Icon = CheckCircle2,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={22} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function StatusBadge({
  status,
  children,
}: {
  status: "success" | "warning" | "neutral";
  children: ReactNode;
}) {
  return <span className={`status-badge ${status}`}>{children}</span>;
}

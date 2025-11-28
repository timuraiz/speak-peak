import { ReactNode } from "react";

interface MenuItemProps {
  label: string;
  href?: string;
  icon?: ReactNode;
  soon?: boolean;
}

export default function MenuItem({ label, href = "#", icon, soon }: MenuItemProps) {
  return (
    <li>
      {soon ? (
        <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          {icon && <span>{icon}</span>}
          <span className="text-[var(--color-dark-50)]">{label}</span>
          </div>
          <span className="px-2 py-1.5 rounded-full bg-[var(--color-accent-12)] text-[var(--color-accent)] text-xs font-medium">
            Soon
          </span>
        </div>
      ) : (
        <a href={href} className="flex gap-2 items-center">
          {icon && <span>{icon}</span>}
          <span className="text-[var(--color-dark)]">{label}</span>
        </a>
      )}
    </li>
  );
}


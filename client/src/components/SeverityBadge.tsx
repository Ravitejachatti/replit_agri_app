import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { Severity } from "@shared/schema";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const { t } = useTranslation();

  const config = {
    green: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300",
      label: t("label.severity.green"),
    },
    orange: {
      icon: AlertCircle,
      className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300",
      label: t("label.severity.orange"),
    },
    red: {
      icon: AlertTriangle,
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300",
      label: t("label.severity.red"),
    },
  };

  const { icon: Icon, className: badgeClass, label } = config[severity];

  return (
    <Badge className={`${badgeClass} ${className || ""}`} data-testid={`badge-severity-${severity}`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

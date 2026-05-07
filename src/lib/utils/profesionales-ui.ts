import { AlertTriangle, ShieldCheck } from "lucide-react";

export function getDeudaUI(tieneDeuda: boolean) {
  if (tieneDeuda) {
    return {
      label: "Con deuda",
      className: "text-amber-600",
      Icon: AlertTriangle,
    };
  }

  return {
    label: "Al día",
    className: "text-emerald-600",
    Icon: ShieldCheck,
  };
}
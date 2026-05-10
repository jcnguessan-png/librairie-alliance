import type { BookStatus } from "@/data/books";

export function formatPrice(price: number | null): string {
  if (price === null) return "Prix à venir";
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export function getStatusLabel(status: BookStatus): string {
  const labels: Record<BookStatus, string> = {
    available: "Disponible",
    "out-of-stock": "Rupture de stock",
    preorder: "Pré-commande",
    "coming-soon": "Bientôt disponible",
  };
  return labels[status];
}

export function getStatusColor(status: BookStatus): string {
  const colors: Record<BookStatus, string> = {
    available: "bg-green-100 text-green-800",
    "out-of-stock": "bg-red-100 text-red-700",
    preorder: "bg-blue-100 text-blue-800",
    "coming-soon": "bg-amber-100 text-amber-800",
  };
  return colors[status];
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

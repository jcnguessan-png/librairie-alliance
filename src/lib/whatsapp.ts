const WHATSAPP_NUMBER = "2250705320607";

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getOrderLink(bookTitle: string): string {
  return getWhatsAppLink(
    `Bonjour Librairie d'Alliance 📖\nJe souhaite commander : *${bookTitle}*\nMerci !`
  );
}

export function getNotifyLink(bookTitle: string): string {
  return getWhatsAppLink(
    `Bonjour 📖\nJe souhaite être notifié(e) dès que *${bookTitle}* sera disponible.\nMerci !`
  );
}

export function getGeneralLink(): string {
  return getWhatsAppLink(
    `Bonjour, je souhaite commander un livre depuis le site de la Librairie d'Alliance 📖`
  );
}

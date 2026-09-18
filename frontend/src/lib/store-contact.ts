// Set a real international number (digits only) before showing WhatsApp links.
const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "");
export const whatsappUrl = number && /^[1-9][0-9]{7,14}$/.test(number) ? `https://wa.me/${number}` : null;

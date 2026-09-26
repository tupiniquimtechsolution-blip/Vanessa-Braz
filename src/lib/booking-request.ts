export interface BookingRequestMessageInput {
  name: string;
  service: string;
  date: string;
  time: string;
}

export function formatBookingRequestDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function buildBookingRequestMessage(input: BookingRequestMessageInput): string {
  const name = input.name.trim();
  const service = input.service.trim();
  const date = formatBookingRequestDate(input.date);
  const time = input.time.trim();

  return [
    'Oi, vim através do site e tenho interesse em fazer esses serviços:',
    '',
    `Nome: ${name}`,
    `Serviço: ${service}`,
    `Data: ${date}`,
    `Horário: ${time}`,
    '',
    'Aguardo a confirmação da disponibilidade. Obrigado(a)!',
    'Origem: Site Vanessa Braz',
  ].join('\n');
}

export function buildWhatsAppBookingUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

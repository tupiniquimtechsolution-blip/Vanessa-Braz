import { describe, expect, it } from 'vitest';
import {
  buildBookingRequestMessage,
  buildWhatsAppBookingUrl,
  formatBookingRequestDate,
} from '../../src/lib/booking-request';

describe('booking request message', () => {
  it('formats the requested date for Brazilian customers', () => {
    expect(formatBookingRequestDate('2026-09-27')).toBe('27/09/2026');
  });

  it('builds a stable structured message for the attendant and future automation', () => {
    const message = buildBookingRequestMessage({
      name: 'Rodrigo da Silva',
      service: 'Manicure e Pedicure',
      date: '2026-09-27',
      time: '12:00',
    });

    expect(message).toContain('Oi, vim através do site e tenho interesse em fazer esses serviços:');
    expect(message).toContain('Nome: Rodrigo da Silva');
    expect(message).toContain('Serviço: Manicure e Pedicure');
    expect(message).toContain('Data: 27/09/2026');
    expect(message).toContain('Horário: 12:00');
    expect(message).toContain('Origem: Site Vanessa Braz');
  });

  it('encodes the exact structured message in the WhatsApp link', () => {
    const message = 'Nome: Rodrigo da Silva\nHorário: 12:00';
    const url = buildWhatsAppBookingUrl('5511988149152', message);

    expect(url).toBe(`https://wa.me/5511988149152?text=${encodeURIComponent(message)}`);
  });
});

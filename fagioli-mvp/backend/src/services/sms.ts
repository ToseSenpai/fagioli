import { Twilio } from 'twilio';

// Initialize Twilio client (mock if credentials not provided)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Only initialize Twilio if valid credentials are provided
const isValidTwilioConfig =
  accountSid &&
  authToken &&
  fromNumber &&
  accountSid.startsWith('AC');

const twilioClient = isValidTwilioConfig ? new Twilio(accountSid, authToken) : null;

/**
 * Send SMS using Twilio or mock if credentials not available
 */
async function sendSMS(to: string, message: string): Promise<boolean> {
  // Mock mode if Twilio not configured
  if (!twilioClient || !fromNumber) {
    console.log('[SMS MOCK] To:', to);
    console.log('[SMS MOCK] Message:', message);
    console.log('---');
    return true;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });
    console.log('[SMS SENT] To:', to);
    return true;
  } catch (error) {
    console.error('[SMS ERROR]', error);
    return false;
  }
}

/**
 * Format phone number for display
 */
function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Add +39 if it's an Italian number without country code
  if (cleaned.length === 10 && !cleaned.startsWith('39')) {
    return `+39${cleaned}`;
  }

  // Add + if not present
  if (!phone.startsWith('+')) {
    return `+${cleaned}`;
  }

  return phone;
}

/**
 * Send appointment confirmation SMS
 */
export async function sendAppointmentConfirmation(
  phone: string,
  date: Date,
  time: string,
  trackingCode: string
): Promise<boolean> {
  const formattedPhone = formatPhoneNumber(phone);
  const formattedDate = new Date(date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const message = `Carrozzeria Fagioli: Appuntamento confermato per ${formattedDate} alle ${time}. Codice tracking: ${trackingCode}. Segui lo stato: https://fagioli.it/track/${trackingCode}`;

  return sendSMS(formattedPhone, message);
}

/**
 * Send status update SMS
 */
export async function sendStatusUpdate(
  phone: string,
  status: string,
  vehiclePlate: string
): Promise<boolean> {
  const formattedPhone = formatPhoneNumber(phone);

  const statusMessages: Record<string, string> = {
    accepted: 'in lavorazione - veicolo accettato',
    disassembly: 'in smontaggio componenti',
    bodywork: 'in lavorazione carrozzeria',
    painting: 'in fase di verniciatura',
    reassembly: 'in rimontaggio componenti',
    quality_check: 'in controllo qualita',
    ready: 'pronto per il ritiro',
  };

  const statusText = statusMessages[status] || status;
  const message = `Carrozzeria Fagioli: Il tuo veicolo (${vehiclePlate}) e ${statusText}.`;

  return sendSMS(formattedPhone, message);
}

/**
 * Send ready for pickup SMS
 */
export async function sendReadyForPickup(
  phone: string,
  vehiclePlate: string
): Promise<boolean> {
  const formattedPhone = formatPhoneNumber(phone);
  const message = `Carrozzeria Fagioli: Il tuo veicolo (${vehiclePlate}) e pronto per il ritiro! Contattaci per concordare l'orario.`;

  return sendSMS(formattedPhone, message);
}

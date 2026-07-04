import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

let client;

const isBuildPhase = typeof process !== 'undefined' && 
    (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-export');

if (typeof window === 'undefined' && !isBuildPhase) {
    // Only run on the server side and not during build phases
    if (!global.whatsappClient) {
        console.log('Initializing WhatsApp Client (Next.js integrated)...');
        client = new Client({
            authStrategy: new LocalAuth({
                clientId: 'emojud-whatsapp',
                dataPath: './.wwebjs_auth'
            }),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        global.whatsappReady = false;

        client.on('qr', (qr) => {
            console.log('\n==================================================================');
            console.log('SCAN THIS QR CODE TO AUTHENTICATE WHATSAPP (Next.js integrated):');
            console.log('==================================================================\n');
            qrcode.generate(qr, { small: true });
            console.log('\n==================================================================\n');
        });

        client.on('ready', () => {
            console.log('==================================================================');
            console.log('WhatsApp Client is ready!');
            console.log('==================================================================');
            global.whatsappReady = true;
        });

        client.on('auth_failure', msg => {
            console.error('WhatsApp Authentication Failure:', msg);
        });

        client.on('disconnected', (reason) => {
            console.log('WhatsApp Client was disconnected:', reason);
            global.whatsappReady = false;
        });

        client.initialize().catch(err => {
            console.error('Error initializing WhatsApp client:', err);
        });

        global.whatsappClient = client;
    } else {
        client = global.whatsappClient;
    }
}

export async function sendWhatsAppMessage(number, message) {
    if (!number) {
        console.warn('WhatsApp warning: No recipient number provided.');
        return { success: false, error: 'No phone number provided' };
    }

    // Clean up number: remove all non-digit characters except the @c.us suffix if present
    let cleanedNumber = number.toString().trim();
    const isFormattedSuffix = cleanedNumber.includes('@c.us');
    
    // Extract digit parts
    let digits = cleanedNumber.replace(/[^0-9]/g, '');

    // Convert standard BD number starting with '01' (11 digits) to international format '8801...'
    if (digits.startsWith('01') && digits.length === 11) {
        digits = '88' + digits;
    }

    const formattedNumber = isFormattedSuffix ? cleanedNumber : `${digits}@c.us`;

    if (!global.whatsappReady) {
        console.warn('WhatsApp client is not ready yet. Please scan the QR code in your server terminal.');
        return { success: false, error: 'WhatsApp client is not ready. Please scan the QR code in the server terminal.' };
    }

    try {
        await global.whatsappClient.sendMessage(formattedNumber, message);
        console.log(`Message successfully sent to ${formattedNumber}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        return { success: false, error: error.message };
    }
}

export async function sendAdminNotification(message) {
    const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
    if (!adminNumber) {
        console.warn('WhatsApp config: WHATSAPP_ADMIN_NUMBER is not set in environment variables.');
        return { success: false, error: 'Admin number not set' };
    }
    return sendWhatsAppMessage(adminNumber, message);
}

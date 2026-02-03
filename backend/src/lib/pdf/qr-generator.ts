import QRCode from 'qrcode';
import { ApiError } from '../types/api-error';

const generateQRCodeDataURL = async (text: string): Promise<string> => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(text, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error('QR Code Generation Error:', error);
        throw ApiError.internalServerError('Failed to generate QR code');
    }
}

export const QRGenerator = {
    generateQRCodeDataURL
}
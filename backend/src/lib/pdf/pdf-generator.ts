import puppeteer from 'puppeteer';
import { ApiError } from '../types/api-error';

type PdfGenerationOptions = {
    format?: 'A4' | 'Letter';
    landscape?: boolean;
    printBackground?: boolean;
}

const generatePdfFromHtml = async (
    html: string,
    options: PdfGenerationOptions = {}
): Promise<Buffer> => {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        const pdfBuffer = await page.pdf({
            format: options.format || 'A4',
            landscape: options.landscape || false,
            printBackground: options.printBackground !== false,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        return Buffer.from(pdfBuffer);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw ApiError.internalServerError('Failed to generate PDF certificate');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

export const PdfGenerator = {
    generatePdfFromHtml
}
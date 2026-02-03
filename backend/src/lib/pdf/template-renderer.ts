import { ApiError } from '../types/api-error';
import { StringUtils } from '../utils/string-util';
import { DateUtil } from '../utils/date-util';

type TemplateData = {
    studentName: string;
    courseTitle: string;
    courseDuration: string;
    completionDate: string;
    credentialId: string;
    validationUrl: string;
    qrCodeDataURL: string;
    collegeOrganization?: string;
    startDate?: string;
    endDate?: string;
}

const renderTemplate = (template: string, data: TemplateData): string => {
    if (StringUtils.isEmpty(template)) {
        throw ApiError.badRequest('Certificate template is empty');
    }

    let renderedHtml = template;

    // Replace all placeholders
    renderedHtml = renderedHtml.replace(/{{STUDENT_NAME}}/g, data.studentName);
    renderedHtml = renderedHtml.replace(/{{COURSE_TITLE}}/g, data.courseTitle);
    renderedHtml = renderedHtml.replace(/{{COURSE_DURATION}}/g, data.courseDuration);
    renderedHtml = renderedHtml.replace(/{{COMPLETION_DATE}}/g, data.completionDate);
    renderedHtml = renderedHtml.replace(/{{CREDENTIAL_ID}}/g, data.credentialId);
    renderedHtml = renderedHtml.replace(/{{VALIDATION_URL}}/g, data.validationUrl);
    renderedHtml = renderedHtml.replace(/{{QR_CODE}}/g, data.qrCodeDataURL);
    renderedHtml = renderedHtml.replace(/{{COLLEGE_ORGANIZATION}}/g, data.collegeOrganization || '');
    renderedHtml = renderedHtml.replace(/{{START_DATE}}/g, data.startDate || '');
    renderedHtml = renderedHtml.replace(/{{END_DATE}}/g, data.endDate || '');

    return renderedHtml;
}

const getDefaultTemplate = (): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
        }
        
        .certificate {
            background: white;
            padding: 60px;
            max-width: 900px;
            margin: 0 auto;
            border: 20px solid #f0f0f0;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
        }
        
        .certificate::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 2px solid #667eea;
            pointer-events: none;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .certificate-title {
            font-size: 48px;
            color: #667eea;
            font-weight: bold;
            letter-spacing: 3px;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 20px;
            color: #666;
            font-style: italic;
        }
        
        .content {
            text-align: center;
            margin: 40px 0;
        }
        
        .presented-to {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        
        .student-name {
            font-size: 42px;
            color: #333;
            font-weight: bold;
            margin: 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            display: inline-block;
        }
        
        .course-details {
            margin: 30px 0;
            line-height: 1.8;
            font-size: 18px;
            color: #555;
        }
        
        .course-title {
            font-weight: bold;
            color: #667eea;
            font-size: 24px;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 60px;
            padding-top: 40px;
            border-top: 2px solid #e0e0e0;
        }
        
        .qr-section {
            text-align: center;
        }
        
        .qr-code {
            width: 120px;
            height: 120px;
            margin-bottom: 10px;
        }
        
        .credential-id {
            font-size: 12px;
            color: #999;
            font-family: 'Courier New', monospace;
        }
        
        .date-section {
            text-align: right;
        }
        
        .date-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .date-value {
            font-size: 16px;
            color: #333;
            font-weight: bold;
        }
        
        .organization {
            font-size: 14px;
            color: #888;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="certificate-title">CERTIFICATE</div>
            <div class="subtitle">of Completion</div>
        </div>
        
        <div class="content">
            <p class="presented-to">This certificate is proudly presented to</p>
            
            <div class="student-name">{{STUDENT_NAME}}</div>
            
            <div class="course-details">
                <p>for successfully completing the</p>
                <p class="course-title">{{COURSE_TITLE}}</p>
                <p style="margin-top: 15px;">Duration: {{COURSE_DURATION}}</p>
                <p class="organization">{{COLLEGE_ORGANIZATION}}</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="qr-section">
                <img src="{{QR_CODE}}" alt="QR Code" class="qr-code">
                <div class="credential-id">{{CREDENTIAL_ID}}</div>
                <div style="font-size: 10px; color: #999; margin-top: 5px;">Scan to verify</div>
            </div>
            
            <div class="date-section">
                <div class="date-label">Date of Completion</div>
                <div class="date-value">{{COMPLETION_DATE}}</div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

export const TemplateRenderer = {
    renderTemplate,
    getDefaultTemplate
}
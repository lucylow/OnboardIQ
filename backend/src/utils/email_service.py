import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import requests

class EmailService:
    def __init__(self):
        self.sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@onboardiq.com')
    
    def send_email_with_sendgrid(self, to_email, subject, content, attachment_path=None):
        """
        Send email using SendGrid API
        """
        if not self.sendgrid_api_key:
            return {
                'success': False,
                'error': 'SendGrid API key not configured'
            }
        
        url = 'https://api.sendgrid.com/v3/mail/send'
        
        headers = {
            'Authorization': f'Bearer {self.sendgrid_api_key}',
            'Content-Type': 'application/json'
        }
        
        email_data = {
            'personalizations': [{
                'to': [{'email': to_email}],
                'subject': subject
            }],
            'from': {'email': self.from_email, 'name': 'OnboardIQ'},
            'content': [{
                'type': 'text/html',
                'value': content
            }]
        }
        
        # Add attachment if provided
        if attachment_path and os.path.exists(attachment_path):
            try:
                import base64
                with open(attachment_path, 'rb') as f:
                    file_data = f.read()
                    encoded_file = base64.b64encode(file_data).decode()
                
                filename = os.path.basename(attachment_path)
                email_data['attachments'] = [{
                    'content': encoded_file,
                    'filename': filename,
                    'type': 'application/pdf',
                    'disposition': 'attachment'
                }]
            except Exception as e:
                return {
                    'success': False,
                    'error': f'Failed to attach file: {str(e)}'
                }
        
        try:
            response = requests.post(url, headers=headers, json=email_data)
            
            if response.status_code == 202:
                return {
                    'success': True,
                    'message': 'Email sent successfully via SendGrid'
                }
            else:
                return {
                    'success': False,
                    'error': f'SendGrid API error: {response.status_code}'
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def send_email_with_smtp(self, to_email, subject, content, attachment_path=None):
        """
        Send email using SMTP
        """
        if not self.smtp_username or not self.smtp_password:
            return {
                'success': False,
                'error': 'SMTP credentials not configured'
            }
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body
            msg.attach(MIMEText(content, 'html'))
            
            # Add attachment if provided
            if attachment_path and os.path.exists(attachment_path):
                with open(attachment_path, 'rb') as attachment:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment.read())
                
                encoders.encode_base64(part)
                filename = os.path.basename(attachment_path)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename= {filename}'
                )
                msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            text = msg.as_string()
            server.sendmail(self.from_email, to_email, text)
            server.quit()
            
            return {
                'success': True,
                'message': 'Email sent successfully via SMTP'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def send_welcome_email(self, to_email, user_data, document_path=None):
        """
        Send welcome email with personalized content
        """
        user_id = user_data.get('user_id', 'Valued Customer')
        plan_type = user_data.get('plan_type', 'basic')
        
        subject = f"Welcome to OnboardIQ, {user_id}!"
        
        content = f"""
        <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4F46E5;">Welcome to OnboardIQ!</h1>
                
                <p>Dear {user_id},</p>
                
                <p>Thank you for joining OnboardIQ's AI-Powered Customer Onboarding Platform!</p>
                
                <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Your Account Details:</h3>
                    <ul>
                        <li><strong>User ID:</strong> {user_id}</li>
                        <li><strong>Plan Type:</strong> {plan_type.upper()}</li>
                        <li><strong>Phone Number:</strong> {user_data.get('phone_number', 'N/A')}</li>
                    </ul>
                </div>
                
                <h3>What's Next?</h3>
                <ol>
                    <li>Complete your profile setup</li>
                    <li>Explore our multi-channel communication features</li>
                    <li>Generate and manage your documents</li>
                    <li>Access our AI-powered personalization tools</li>
                </ol>
                
                <p>If you have any questions, please don't hesitate to contact our support team.</p>
                
                <p>Best regards,<br>
                The OnboardIQ Team</p>
                
                <hr style="margin: 30px 0;">
                <p style="font-size: 12px; color: #6B7280;">
                    This email was sent from OnboardIQ's automated onboarding system.
                </p>
            </div>
        </body>
        </html>
        """
        
        # Try SendGrid first, fallback to SMTP
        result = self.send_email_with_sendgrid(to_email, subject, content, document_path)
        if not result['success']:
            result = self.send_email_with_smtp(to_email, subject, content, document_path)
        
        return result
    
    def send_document_email(self, to_email, document_id, document_path):
        """
        Send email with document attachment
        """
        subject = "Your OnboardIQ Documents"
        
        content = f"""
        <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4F46E5;">Your Documents are Ready!</h1>
                
                <p>Your personalized documents have been generated and are attached to this email.</p>
                
                <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Document Details:</h3>
                    <ul>
                        <li><strong>Document ID:</strong> {document_id}</li>
                        <li><strong>Generated:</strong> {os.path.basename(document_path) if document_path else 'N/A'}</li>
                    </ul>
                </div>
                
                <p>Please review the attached documents and keep them for your records.</p>
                
                <p>If you have any questions about these documents, please contact our support team.</p>
                
                <p>Best regards,<br>
                The OnboardIQ Team</p>
            </div>
        </body>
        </html>
        """
        
        # Try SendGrid first, fallback to SMTP
        result = self.send_email_with_sendgrid(to_email, subject, content, document_path)
        if not result['success']:
            result = self.send_email_with_smtp(to_email, subject, content, document_path)
        
        return result


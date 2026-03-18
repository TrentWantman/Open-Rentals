import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails."""

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.FROM_EMAIL

    def _send(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
    ) -> bool:
        """Send an email."""
        if not self.smtp_host:
            # Email not configured, skip
            return False

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.from_email
        msg["To"] = to_email

        if text_content:
            msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        try:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                if self.smtp_user and self.smtp_password:
                    server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.from_email, to_email, msg.as_string())
            return True
        except Exception as e:
            logger.error("Failed to send email to %s: %s", to_email, e)
            return False

    def send_welcome_email(self, to_email: str, first_name: str) -> bool:
        """Send welcome email to new user."""
        subject = "Welcome to Open Rentals!"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Open Rentals</h1>
            </div>
            <div style="padding: 30px 20px;">
                <h2>Welcome, {first_name}!</h2>
                <p>Thank you for joining Open Rentals - the open source platform for verified rental listings.</p>
                <p>Here's what you can do:</p>
                <ul>
                    <li>Browse verified rental listings</li>
                    <li>Save your favorite properties</li>
                    <li>Apply directly through our platform</li>
                    <li>Chat with verified landlords</li>
                </ul>
                <p>
                    <a href="{settings.FRONTEND_URL}/listings"
                       style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        Browse Listings
                    </a>
                </p>
            </div>
            <div style="background: #1a1a1a; color: #888; padding: 20px; text-align: center; font-size: 12px;">
                <p>Open Rentals - Verified Rentals, Zero Fraud</p>
            </div>
        </body>
        </html>
        """
        return self._send(to_email, subject, html)

    def send_application_received(
        self,
        to_email: str,
        landlord_name: str,
        property_title: str,
        applicant_name: str,
    ) -> bool:
        """Notify landlord of new application."""
        subject = f"New Application for {property_title}"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">New Application</h1>
            </div>
            <div style="padding: 30px 20px;">
                <h2>Hi {landlord_name},</h2>
                <p>You have received a new rental application!</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Property:</strong> {property_title}</p>
                    <p><strong>Applicant:</strong> {applicant_name}</p>
                </div>
                <p>
                    <a href="{settings.FRONTEND_URL}/dashboard/landlord"
                       style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        Review Application
                    </a>
                </p>
            </div>
        </body>
        </html>
        """
        return self._send(to_email, subject, html)

    def send_application_status_update(
        self,
        to_email: str,
        applicant_name: str,
        property_title: str,
        status: str,
    ) -> bool:
        """Notify applicant of application status change."""
        status_messages = {
            "under_review": "is now under review",
            "approved": "has been approved! Congratulations!",
            "denied": "was not approved at this time",
        }
        status_msg = status_messages.get(status, f"status is now: {status}")

        subject = f"Application Update: {property_title}"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Application Update</h1>
            </div>
            <div style="padding: 30px 20px;">
                <h2>Hi {applicant_name},</h2>
                <p>Your application for <strong>{property_title}</strong> {status_msg}.</p>
                <p>
                    <a href="{settings.FRONTEND_URL}/dashboard/renter"
                       style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        View Details
                    </a>
                </p>
            </div>
        </body>
        </html>
        """
        return self._send(to_email, subject, html)

    def send_verification_approved(
        self,
        to_email: str,
        landlord_name: str,
    ) -> bool:
        """Notify landlord that verification is approved."""
        subject = "Verification Approved - You're Now a Verified Landlord!"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #06b6d4); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Verified!</h1>
            </div>
            <div style="padding: 30px 20px;">
                <h2>Congratulations, {landlord_name}!</h2>
                <p>Your landlord verification has been approved. You now have the verified badge on all your listings.</p>
                <p>Benefits of being verified:</p>
                <ul>
                    <li>Verified badge on all listings</li>
                    <li>Higher visibility in search results</li>
                    <li>Increased trust from potential renters</li>
                    <li>Priority support</li>
                </ul>
                <p>
                    <a href="{settings.FRONTEND_URL}/dashboard/landlord/properties/new"
                       style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        List a Property
                    </a>
                </p>
            </div>
        </body>
        </html>
        """
        return self._send(to_email, subject, html)

    def send_password_reset(
        self,
        to_email: str,
        first_name: str,
        reset_link: str,
    ) -> bool:
        """Send password reset email with reset link."""
        subject = "Reset Your Password"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Open Rentals</h1>
            </div>
            <div style="padding: 30px 20px;">
                <h2>Hi {first_name},</h2>
                <p>We received a request to reset your password. Click the button below to set a new one.</p>
                <p>
                    <a href="{reset_link}"
                       style="display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        Reset Password
                    </a>
                </p>
                <p style="color: #888; font-size: 14px;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
            </div>
        </body>
        </html>
        """
        return self._send(to_email, subject, html)

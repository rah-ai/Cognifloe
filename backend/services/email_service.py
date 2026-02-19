"""
Email Service using Resend API

This service handles sending OTP verification emails for authentication.
Requires RESEND_API_KEY environment variable.

NOTE: With free Resend account, emails can only be sent to the account owner's email
unless you verify a custom domain. For development, OTP is printed to console.
"""

import os
import random
import string
from datetime import datetime, timedelta
from typing import Optional, Tuple
import threading

# Resend API configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_API_URL = "https://api.resend.com/emails"
FROM_EMAIL = os.getenv("FROM_EMAIL", "CogniFloe <onboarding@resend.dev>")

# OTP configuration
OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 10


def generate_otp() -> str:
    """Generate a 6-digit OTP code"""
    return ''.join(random.choices(string.digits, k=OTP_LENGTH))


def get_otp_expiry() -> datetime:
    """Get the expiry time for an OTP (10 minutes from now)"""
    return datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)


def is_otp_expired(expiry_time: datetime) -> bool:
    """Check if an OTP has expired"""
    if expiry_time is None:
        return True
    return datetime.utcnow() > expiry_time


def _send_email_async(to_email: str, otp_code: str, user_name: str):
    """Send email in background thread (non-blocking)"""
    try:
        import requests
        
        name = user_name or "User"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table role="presentation" style="width: 100%; max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <tr>
                    <td style="padding: 40px 40px 20px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #F97316; font-size: 28px; margin: 0; font-weight: 700;">
                                🧠 CogniFloe
                            </h1>
                            <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">
                                AI-Powered Workflow Automation
                            </p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 30px; text-align: center;">
                            <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px;">
                                Verify Your Email
                            </h2>
                            <p style="color: #94a3b8; font-size: 15px; margin: 0 0 25px; line-height: 1.6;">
                                Hi {name},<br>
                                Use the code below to verify your email address.
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); border-radius: 12px; padding: 20px 30px; display: inline-block;">
                                <span style="font-size: 36px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Monaco', 'Consolas', monospace;">
                                    {otp_code}
                                </span>
                            </div>
                            
                            <p style="color: #64748b; font-size: 13px; margin: 25px 0 0;">
                                This code expires in <strong style="color: #F97316;">{OTP_EXPIRY_MINUTES} minutes</strong>
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <p style="color: #64748b; font-size: 12px; margin: 0;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>
                            <p style="color: #475569; font-size: 11px; margin: 15px 0 0;">
                                © 2026 CogniFloe. All rights reserved.
                            </p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        response = requests.post(
            RESEND_API_URL,
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "from": FROM_EMAIL,
                "to": [to_email],
                "subject": f"Your CogniFloe verification code: {otp_code}",
                "html": html_content,
                "text": f"Your CogniFloe verification code is: {otp_code}"
            },
            timeout=5  # Short timeout
        )
        
        if response.status_code == 200:
            print(f"✅ Email sent successfully to {to_email}")
        else:
            error_data = response.json() if response.content else {}
            print(f"⚠️ Email delivery failed: {error_data.get('message', response.status_code)}")
            print(f"   (This is normal with free Resend - domain verification required)")
            
    except Exception as e:
        print(f"⚠️ Email sending error (non-blocking): {e}")


def send_otp(to_email: str, otp_code: str, user_name: Optional[str] = None) -> Tuple[bool, str]:
    """
    Send OTP - always prints to console, attempts email in background.
    
    For development: Look at the terminal to see the OTP code.
    For production: Verify your domain in Resend dashboard.
    """
    name = user_name or "User"
    
    # ALWAYS print to console for development
    print(f"\n{'='*60}")
    print(f"📧 OTP VERIFICATION CODE")
    print(f"   To: {to_email}")
    print(f"   Name: {name}")
    print(f"   ╔══════════════════════════════════════╗")
    print(f"   ║  Your OTP Code:  {otp_code}              ║")
    print(f"   ╚══════════════════════════════════════╝")
    print(f"   Expires in: {OTP_EXPIRY_MINUTES} minutes")
    print(f"{'='*60}\n")
    
    # Try to send email in background (non-blocking)
    if RESEND_API_KEY:
        thread = threading.Thread(
            target=_send_email_async,
            args=(to_email, otp_code, name),
            daemon=True
        )
        thread.start()
        return True, "OTP sent (check terminal for code)"
    else:
        return True, "OTP generated (check terminal - no email API configured)"

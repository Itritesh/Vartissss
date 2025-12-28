import os
import json
import smtplib
from email.message import EmailMessage


def _json_response(body_dict, status=200):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body_dict)
    }


def handler(request):
    # CORS preflight
    try:
        method = request.method
    except Exception:
        method = None

    if method == 'OPTIONS':
        return _json_response({"success": True}, status=204)

    # Parse JSON body safely
    try:
        payload = None
        if hasattr(request, 'get_json'):
            payload = request.get_json()
        elif hasattr(request, 'json'):
            payload = request.json()
        else:
            payload = json.loads(request.body.decode('utf-8')) if hasattr(request, 'body') else {}
    except Exception:
        try:
            payload = json.loads(request.get_data(as_text=True))
        except Exception:
            payload = {}

    name = (payload.get('name') or '').strip()
    email = (payload.get('email') or '').strip()
    phone = (payload.get('phone') or '').strip()
    message = (payload.get('message') or '').strip()
    source = payload.get('source', 'unknown')

    if not name or not email or not message:
        return _json_response({"success": False, "error": "Missing required fields"}, status=400)

    gmail_user = os.environ.get('GMAIL_USER')
    gmail_pass = os.environ.get('GMAIL_APP_PASSWORD')

    if not gmail_user or not gmail_pass:
        return _json_response({"success": False, "error": "Mail credentials not configured"}, status=500)

    try:
        msg = EmailMessage()
        msg['Subject'] = f"New enquiry from {name}"
        msg['From'] = gmail_user
        msg['To'] = 'vartisticstudio@gmail.com'
        body = f"Name: {name}\nEmail: {email}\nPhone: {phone}\nSource: {source}\n\nMessage:\n{message}\n"
        msg.set_content(body)

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(gmail_user, gmail_pass)
            smtp.send_message(msg)

        return _json_response({"success": True}, status=200)
    except Exception as e:
        return _json_response({"success": False, "error": str(e)}, status=500)

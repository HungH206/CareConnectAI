# careconnect/backend/careteam/twilio-messaging.py

from flask import Blueprint, request, jsonify
from twilio.rest import Client 
#import os
#from dotenv import load_dotenv 

# Load environment variables
# load_dotenv()

twilio_api = Blueprint('twilio_api', __name__)

# Load from environment variables
account_sid = "ACbb20e8d1966490f5348ebe9c32337840"
auth_token = "f42a2c0153cbaf21703842873269b144"
#twilio_number = os.environ.get("+18445230853")
client = Client(account_sid, auth_token)

@twilio_api.route("/api/send-message", methods=["POST"])
def send_sms():
    try:
        data = request.json
        body = data.get("body", "Default message")

        message = client.messages.create(
            body=body,
            from_="+18445230853",
            to="+18777804236"# in real use: data.get("to")
        )

        return jsonify({"status": "success", "sid": message.sid}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


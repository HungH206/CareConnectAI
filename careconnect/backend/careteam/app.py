# careconnect/backend/careteam/app.py

from flask import Flask
from twilio_messaging import twilio_api

app = Flask(__name__)
app.register_blueprint(twilio_api)

if __name__ == "__main__":
    app.run(debug=True)

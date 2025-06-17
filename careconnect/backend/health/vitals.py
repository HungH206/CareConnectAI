# backend/api/vitals.py
from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

@app.route("/api/vitals", methods=["GET"])
def get_vitals():
    vitals = {
        "heart_rate": random.randint(65, 100),
        "blood_pressure": f"{random.randint(100, 120)}/{random.randint(60, 80)}",
        "temperature": round(random.uniform(97.0, 99.5), 1),
        "spo2": random.randint(95, 100),
        "respiration_rate": random.randint(12, 20),
        "timestamp": int(time.time())
    }
    return jsonify(vitals)

if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, request, jsonify
from handler import generate_conversation
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS so frontend can access this API

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    messages = [{
        "role": "user",
        "content": [{"text": prompt}]
    }]

    try:
        response_text = generate_conversation(messages)
        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Runs the Flask app on localhost:5000
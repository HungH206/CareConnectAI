import os
import json
import boto3
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from weasyprint import HTML # <--- NEW IMPORT

# --- INITIALIZATION ---
app = Flask(__name__)
CORS(app) 

# Initialize Firebase
try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"ERROR: Could not initialize Firebase. Details: {e}")
    db = None

# Initialize AWS Clients
bedrock_runtime = boto3.client(service_name='bedrock-runtime', region_name='us-east-1') 
translate_client = boto3.client(service_name='translate', region_name='us-east-1')

# --- API ENDPOINTS ---

@app.route('/api/reports', methods=['GET'])
def get_reports():
    # This function remains the same
    if not db: return jsonify({"error": "Database not initialized"}), 500
    try:
        reports_ref = db.collection('reports').order_by('date', direction=firestore.Query.DESCENDING)
        reports = []
        for doc in reports_ref.stream():
            report_data = doc.to_dict()
            report_data['id'] = doc.id
            if 'date' in report_data and hasattr(report_data['date'], 'strftime'):
                 report_data['date'] = report_data['date'].strftime('%B %d, %Y')
            reports.append(report_data)
        return jsonify(reports), 200
    except Exception as e: return jsonify({"error": f"Failed to fetch reports: {e}"}), 500

@app.route('/api/reports', methods=['POST'])
def create_report():
    # This function remains the same
    if not db: return jsonify({"error": "Database not initialized"}), 500
    try:
        data = request.get_json()
        new_report_data = {
            "icon_name": "LineChart", "title": data.get('title'),
            "date": firestore.SERVER_TIMESTAMP,
            "content": {"diagnosis": data.get('diagnosis'), "recommendations": data.get('recommendations')}
        }
        update_time, doc_ref = db.collection('reports').add(new_report_data)
        created_doc = doc_ref.get().to_dict()
        created_doc['id'] = doc_ref.id
        created_doc['date'] = created_doc['date'].strftime('%B %d, %Y')
        return jsonify(created_doc), 201
    except Exception as e: return jsonify({"error": f"Failed to create report: {e}"}), 500


# --- NEW PDF DOWNLOAD ENDPOINT ---
@app.route('/api/reports/<report_id>/pdf', methods=['GET'])
def download_report_pdf(report_id):
    """
    Generates a PDF for a specific report and sends it for download.
    """
    if not db: return jsonify({"error": "Database not initialized"}), 500
    try:
        # 1. Fetch the specific report from Firestore
        doc = db.collection('reports').document(report_id).get()
        if not doc.exists:
            return jsonify({"error": "Report not found"}), 404
        report_data = doc.to_dict()
        report_date = report_data.get('date')
        if hasattr(report_date, 'strftime'):
            report_date = report_date.strftime('%B %d, %Y')

        # 2. Create a styled HTML template for the PDF
        html_template = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: sans-serif; color: #333; }}
                    .header {{ text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }}
                    .header h1 {{ color: #0d9488; margin: 0; }}
                    .report-title {{ margin-top: 30px; }}
                    .section {{ margin-top: 25px; }}
                    .section h3 {{ background-color: #f0fdfa; color: #064e3b; padding: 10px; border-left: 4px solid #10b981; }}
                    .content {{ padding: 5px 10px; white-space: pre-wrap; line-height: 1.6; }}
                    .footer {{ position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 12px; color: #999; }}
                </style>
            </head>
            <body>
                <div class="header"><h1>CareConnect Health Report</h1></div>
                <div class="report-title">
                    <h2>{report_data.get('title', 'N/A')}</h2>
                    <p>Generated on: {report_date}</p>
                </div>
                <div class="section">
                    <h3>Official Diagnosis</h3>
                    <div class="content">{report_data.get('content', {}).get('diagnosis', 'Not provided.')}</div>
                </div>
                <div class="section">
                    <h3>Doctor's Recommendations</h3>
                    <div class="content">{report_data.get('content', {}).get('recommendations', 'Not provided.')}</div>
                </div>
                <div class="footer">This is an official patient record from CareConnect.</div>
            </body>
        </html>
        """

        # 3. Generate the PDF in memory using WeasyPrint
        pdf_bytes = HTML(string=html_template).write_pdf()

        # 4. Create a Flask response to send the file
        response = make_response(pdf_bytes)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename="Report-{report_id}.pdf"'
        return response
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({"error": "Failed to generate PDF"}), 500


@app.route('/api/process-text', methods=['POST'])
def process_text():
    # This AI processing logic remains the same
    # ... (code for this function is unchanged) ...
    try:
        data = request.get_json()
        text_to_process = data.get('text')
        target_language_code = data.get('language', 'en')
        prompt = f"Human: You are a medical assistant. Explain the following text to a patient in simple, clear language. <text>{text_to_process}</text> Assistant:"
        body = json.dumps({"anthropic_version": "bedrock-2023-05-31", "max_tokens": 1000, "messages": [{"role": "user", "content": prompt}]})
        response = bedrock_runtime.invoke_model(body=body, modelId='anthropic.claude-3-sonnet-20240229-v1:0', accept='application/json', contentType='application/json')
        response_body = json.loads(response.get('body').read())
        simplified_text = response_body['content'][0]['text']
        translated_text = simplified_text
        if target_language_code != 'en':
            translation_response = translate_client.translate_text(Text=simplified_text, SourceLanguageCode='en', TargetLanguageCode=target_language_code)
            translated_text = translation_response.get('TranslatedText')
        return jsonify({"simplifiedText": simplified_text, "translatedText": translated_text})
    except Exception as e:
        print(f"Error processing text: {e}")
        return jsonify({"error": "AI processing failed"}), 500

# Run the Flask App
if __name__ == '__main__':
    app.run(port=5002, debug=True)
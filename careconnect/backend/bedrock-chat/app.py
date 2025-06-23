from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import json
import os

app = Flask(__name__)
CORS(app)

# AWS Configuration
AWS_ACCESS_KEY_ID = "AKIAQ7F3FZGCR3GZYRNG"
AWS_SECRET_ACCESS_KEY = "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"
AWS_REGION = "us-east-1"

# Bedrock clients setup
bedrock_runtime = boto3.client(
    "bedrock-runtime", 
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

bedrock_agent = boto3.client(
    "bedrock-agent-runtime",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

# Model and Knowledge Base Configuration
MODEL_ID = "us.anthropic.claude-3-5-haiku-20241022-v1:0"
KB_ID = "1BSXCFNWOS"
KB_MODEL_ARN = "arn:aws:bedrock:us-east-1:066964539781:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0"

def generate_conversation(messages):
    """
    Generate conversation using Bedrock Claude model (from handler.py)
    """
    try:
        # Create the request body for Claude
        request_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": messages[0]["content"][0]["text"]
                }
            ]
        }
        
        # Send the message to the model
        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body)
        )
        
        # Parse the response
        response_body = json.loads(response.get('body').read())
        return response_body['content'][0]['text']
    except Exception as e:
        return f"Error generating conversation: {str(e)}"

def query_knowledge_base(prompt):
    """
    Query AWS Knowledge Base (from aws_kb.py)
    """
    try:
        response = bedrock_agent.retrieve_and_generate(
            input={
                'text': prompt,
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': KB_ID,
                    'modelArn': KB_MODEL_ARN,
                }
            }
        )
        
        if 'output' in response and 'text' in response['output']:
            return response['output']['text']
        else:
            return f"No text found in response: {response}"
            
    except Exception as e:
        return f"Error from AWS Knowledge Base: {str(e)}"

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint (from api.py) - handles general conversations
    """
    try:
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Wrap prompt into Claude-compatible message format
        messages = [{
            "role": "user",
            "content": [{"text": prompt}]
        }]

        result = generate_conversation(messages)
        return jsonify({"response": result, "source": "bedrock_runtime"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/knowledge-query', methods=['POST'])
def knowledge_query():
    """
    Knowledge base query endpoint
    """
    try:
        data = request.json
        prompt = data.get("prompt", "")
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
            
        result = query_knowledge_base(prompt)
        return jsonify({"response": result, "source": "knowledge_base"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/unified-chat', methods=['POST'])
def unified_chat():
    """
    Unified chat endpoint that automatically routes between general chat and knowledge base
    """
    try:
        data = request.json
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Determine if this is a knowledge-base question
        knowledge_keywords = [
            "blood pressure", "heart rate", "vital signs", "health data", 
            "medical", "diagnosis", "symptoms", "treatment", "medication",
            "blood sugar", "cholesterol", "temperature", "pulse", "oxygen",
            "health", "medical condition", "disease", "illness", "patient",
            "doctor", "medical history", "Dr.", "physician"
        ]
        
        is_knowledge_query = any(keyword in prompt.lower() for keyword in knowledge_keywords)
        
        if is_knowledge_query:
            # Use Knowledge Base for health-related queries
            result = query_knowledge_base(prompt)
            source = "knowledge_base"
        else:
            # Use Claude for general conversation
            messages = [{
                "role": "user",
                "content": [{"text": prompt}]
            }]
            result = generate_conversation(messages)
            source = "bedrock_runtime"
        
        return jsonify({
            "response": result,
            "source": source,
            "is_knowledge_query": is_knowledge_query
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({"status": "healthy", "message": "CareConnect AI Chat API is running"})

@app.route('/api/test', methods=['GET'])
def test_services():
    """
    Test both Bedrock Runtime and Knowledge Base services
    """
    results = {}
    
    # Test Bedrock Runtime
    try:
        test_messages = [{
            "role": "user",
            "content": [{"text": "Hello! Please respond with 'Bedrock Runtime working'."}]
        }]
        bedrock_result = generate_conversation(test_messages)
        results['bedrock_runtime'] = {
            'status': 'success',
            'response': bedrock_result
        }
    except Exception as e:
        results['bedrock_runtime'] = {
            'status': 'failed',
            'error': str(e)
        }
    
    # Test Knowledge Base
    try:
        knowledge_result = query_knowledge_base("What is blood pressure?")
        results['knowledge_base'] = {
            'status': 'success',
            'response': knowledge_result
        }
    except Exception as e:
        results['knowledge_base'] = {
            'status': 'failed',
            'error': str(e)
        }
    
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0') 
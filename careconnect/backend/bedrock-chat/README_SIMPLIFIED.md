# CareConnect AI - Simplified Flask Application

This is a simplified version of the CareConnect AI chat application that integrates AWS Bedrock Runtime and Knowledge Base services into a single Flask application.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5001`

## 📋 Available Endpoints

### 1. Health Check
- **GET** `/api/health`
- Returns the health status of the API

### 2. General Chat
- **POST** `/api/chat`
- Uses AWS Bedrock Runtime (Claude) for general conversations
- **Body**: `{"prompt": "Your message here"}`

### 3. Knowledge Base Query
- **POST** `/api/knowledge-query`
- Uses AWS Knowledge Base for medical/health queries
- **Body**: `{"prompt": "Your medical question here"}`

### 4. Unified Chat (Recommended)
- **POST** `/api/unified-chat`
- Automatically routes between general chat and knowledge base based on keywords
- **Body**: `{"prompt": "Your question here"}`

### 5. Test Services
- **GET** `/api/test`
- Tests both Bedrock Runtime and Knowledge Base services

## 🧪 Testing the Application

### Option 1: Using the Test Script

```bash
python test_app.py
```

### Option 2: Using the Web Interface

1. Open `frontend_test.html` in your web browser
2. Test different endpoints using the provided interface

### Option 3: Using curl

```bash
# Health check
curl http://localhost:5001/api/health

# General chat
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello! How are you today?"}'

# Knowledge base query
curl -X POST http://localhost:5001/api/knowledge-query \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is blood pressure?"}'

# Unified chat
curl -X POST http://localhost:5001/api/unified-chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Tell me about Dr. Phil D medical history"}'
```

## 🔧 Configuration

The application uses the following AWS configuration:

- **Region**: `us-east-1`
- **Model**: `us.anthropic.claude-3-5-haiku-20241022-v1:0`
- **Knowledge Base ID**: `1BSXCFNWOS`
- **Knowledge Base Model ARN**: `arn:aws:bedrock:us-east-1:066964539781:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0`

## 🎯 How It Works

### Unified Chat Logic

The `/api/unified-chat` endpoint automatically determines which service to use based on keywords:

**Medical/Health Keywords** (routes to Knowledge Base):
- blood pressure, heart rate, vital signs, health data
- medical, diagnosis, symptoms, treatment, medication
- blood sugar, cholesterol, temperature, pulse, oxygen
- health, medical condition, disease, illness, patient
- doctor, medical history, Dr., physician

**General Keywords** (routes to Bedrock Runtime):
- Everything else

### Example Usage

```javascript
// Frontend JavaScript example
const response = await fetch('http://localhost:5001/api/unified-chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: "What is blood pressure?" // Will use Knowledge Base
    })
});

const result = await response.json();
console.log(result.response); // The AI response
console.log(result.source); // "knowledge_base" or "bedrock_runtime"
console.log(result.is_knowledge_query); // true or false
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error**: Make sure the Flask app is running on port 5001
2. **AWS Credentials**: Verify your AWS credentials are correct
3. **CORS Issues**: The app includes CORS headers, but make sure your frontend is making requests to the correct URL

### Debug Mode

The application runs in debug mode by default. Check the console output for detailed error messages.

## 📁 File Structure

```
bedrock-chat/
├── app.py              # Main Flask application (simplified)
├── test_app.py         # Python test script
├── frontend_test.html  # Web interface for testing
├── requirements.txt    # Python dependencies
└── README_SIMPLIFIED.md # This file
```

## 🔄 Integration with Frontend

To integrate with your frontend application, use the `/api/unified-chat` endpoint for the best user experience. It will automatically route queries to the appropriate service.

Example frontend integration:

```javascript
async function sendMessage(message) {
    try {
        const response = await fetch('http://localhost:5001/api/unified-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: message })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}
```

## ✅ Success Indicators

- Health check returns `{"status": "healthy"}`
- General chat responds with Claude-generated text
- Knowledge base queries return medical information
- Unified chat automatically routes to appropriate service
- Test endpoint shows both services working 
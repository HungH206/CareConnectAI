import boto3  # type: ignore
import json
import os

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")  # Adjust your region

def generate_conversation(messages):
    # Create the Bedrock Runtime client
    bedrock_client = boto3.client(service_name='bedrock-runtime', region_name="us-east-1")
    model_id = "us.anthropic.claude-3-5-haiku-20241022-v1:0"
    
    # Send the message to the model
    response = bedrock_client.converse(
        modelId=model_id,
        messages=messages
    )
    
    # Return the model-generated content
    return response["output"]["message"]["content"][0]["text"]


messages = [{
    "role": "user",
    "content": [{"text": "hello world"}]
}]

generate_conversation(messages)
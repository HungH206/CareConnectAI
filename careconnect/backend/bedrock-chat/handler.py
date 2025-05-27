import boto3 # type: ignore
import json

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")  # Adjust your region

def chat_with_claude(prompt):
    body = {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 400,
        "anthropic_version": "bedrock-2023-05-31"
    }

    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        contentType="application/json",
        accept="application/json",
        body=json.dumps(body)
    )

    response_body = json.loads(response['body'].read())
    return response_body['content'][0]['text']  # extract text from response

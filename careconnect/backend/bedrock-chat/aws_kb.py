import boto3
import os

# Use bedrock-runtime client for retrieve_and_generate
client = boto3.client('bedrock-agent-runtime',
                                aws_access_key_id="AKIAQ7F3FZGCR3GZYRNG",
                                aws_secret_access_key="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",
                                region_name='us-east-1')

kb_id = '1BSXCFNWOS'
model_arn = 'arn:aws:bedrock:us-east-1:066964539781:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0'

def retrieve_generated(input, kb_id, model_arn):
    response = client.retrieve_and_generate(
        input = {
            'text': input,
        },
        retrieveAndGenerateConfiguration= {
            'type': 'KNOWLEDGE_BASE',
            'knowledgeBaseConfiguration': {
                'knowledgeBaseId': kb_id,
                'modelArn': model_arn,
            }
        }
    )

    return response

response = retrieve_generated('Can You tell me about the recent medical history from Dr. Phil D?', kb_id=kb_id, model_arn=model_arn)
generated_text = response['output']['text']
print(generated_text)
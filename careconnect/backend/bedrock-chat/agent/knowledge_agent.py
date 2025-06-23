# backend/agents/knowledge_agent.py

import boto3

# Bedrock Agent setup
bedrock = boto3.client("bedrock-agent-runtime", region_name="us-east-1")  # adjust if needed
agent_id = "AOI3TVWWRP"
agent_alias_id = "MUBOOI7BWE"

def query_knowledge_base(prompt):
    """
    Query the Bedrock knowledge agent with a user prompt
    
    Args:
        prompt (str): The user's query text
        
    Returns:
        str: The agent's response
    """
    try:
        response = bedrock.invoke_agent(
            agentId=agent_id,
            agentAliasId=agent_alias_id,
            sessionId="user-session-123",  # you can use per-user/session logic
            input={"text": prompt}
        )

        return response["completion"]["content"]
    except Exception as e:
        return f"Error from knowledge agent: {str(e)}"
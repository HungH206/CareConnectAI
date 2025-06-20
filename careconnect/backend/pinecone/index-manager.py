# Import the Pinecone library
from pinecone import Pinecone

pc = Pinecone(api_key="pcsk_5yYuHL_9wisnWNysuSA53ehPsk685AYjoRpYqEj3PMM6RVprh2shYwVMLnfby3iVhjAhzU")
index = pc.Index("careconnect-quickstart-py")


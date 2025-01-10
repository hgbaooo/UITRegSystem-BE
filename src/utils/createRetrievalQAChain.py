import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFaceHub
from dotenv import load_dotenv
load_dotenv()

def create_retrieval_qa_chain(vector_store, model_name = "google/flan-t5-base"):
    try:
        model = HuggingFaceHub(
            repo_id=model_name, 
            huggingfacehub_api_token = os.getenv("HUGGINGFACEHUB_API_KEY")
        )
        
        chain = RetrievalQA.from_llm(
          llm=model, 
          retriever=vector_store.as_retriever(search_kwargs={'k': 5}),
          return_source_documents=True
        )
        return chain
    except Exception as e:
        print(f"Error create retrieval QA chain: {e}")
        raise


if __name__ == '__main__':
    from utils.createVectorStore import create_vector_store
    csv_path = '../data_regulation.csv'
    vector_store = create_vector_store(csv_path)
    qa_chain = create_retrieval_qa_chain(vector_store)
    print(qa_chain)
import os
import sys
import shutil

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from utils.loadDataFromCSV import load_data_from_csv
from utils.createRetrievalQAChain import create_retrieval_qa_chain
from dotenv import load_dotenv

load_dotenv()

def finetune_and_save_model(data_path, output_dir):
    try:
        print("Start fine-tuning model...")
        
        csv_data = load_data_from_csv(data_path)
        if csv_data is None:
          raise ValueError("No data load from CSV")
        
        docs = []
        for _, row in csv_data.iterrows():
            doc = f"Câu hỏi: {row['Câu hỏi']} \nCâu trả lời: {row['Câu trả lời']} \nCăn cứ: {row['Căn cứ']} \nNgày ban hành: {row['Ngày ban hành']} \nNgày cập nhật: {row['Ngày cập nhật']} \nĐường dẫn căn cứ: {row['Đường dẫn căn cứ']} \nĐường dẫn các file cập nhật: {row['Đường dẫn các file cập nhật']}"
            docs.append(doc)


        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splitted_docs = text_splitter.create_documents(docs)

        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = FAISS.from_documents(splitted_docs, embeddings)

        print("Model is fine-tuned")
        if not os.path.exists(output_dir):
          os.makedirs(output_dir)
        
        # Lưu vector store
        vector_store.save_local(output_dir)
        print(f"Vector store saved to: {output_dir}")
        print("Finished saving model!")
    except Exception as e:
      print(f"Error in fine-tuning model: {e}")
    

if __name__ == "__main__":
    data_path = os.path.join(os.path.dirname(__file__), 'data_regulation.csv')
    output_dir = 'model_output'
    finetune_and_save_model(data_path, output_dir)
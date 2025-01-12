import os
import sys
import shutil
import pandas as pd
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
# Thay đổi import ở đây
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from utils.loadDataFromCSV import load_data_from_csv
from dotenv import load_dotenv

load_dotenv()

def finetune_and_save_model(data_path, output_dir, embedding_model = "sentence-transformers/all-MiniLM-L6-v2"):
    try:
        print("Start fine-tuning model...")

        csv_data = load_data_from_csv(data_path)
        if csv_data is None:
          raise ValueError("No data load from CSV")

        docs = []
        for _, row in csv_data.iterrows():
            doc = f"Câu hỏi: {row['Câu hỏi'].strip()} \n" \
                  f"Câu trả lời: {row['Câu trả lời'].strip()} \n" \
                  f"Căn cứ: {row['Căn cứ'].strip()} \n" \
                  f"Ngày ban hành: {row['Ngày ban hành'].strip()} \n" \
                  f"Ngày cập nhật: {row['Ngày cập nhật'].strip()} \n" \
                  f"Đường dẫn căn cứ: {row['Đường dẫn căn cứ'].strip()} \n" \
                  f"Đường dẫn các file cập nhật: {row['Đường dẫn các file cập nhật'].strip()}"
            docs.append(doc)

        # Split the documents
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=600)
        splitted_docs = text_splitter.create_documents(docs)

        # Embedding model
        # Sử dụng HuggingFaceEmbeddings từ langchain-huggingface
        embeddings = HuggingFaceEmbeddings(model_name=embedding_model)

        # Create vector store
        vector_store = FAISS.from_documents(splitted_docs, embeddings)

        print("Model is fine-tuned")

        # Đường dẫn tuyệt đối
        output_path = os.path.join(output_dir, 'model_output')
        if not os.path.exists(output_path):
            os.makedirs(output_path)

        # Lưu vector store
        vector_store.save_local(output_path)
        print(f"Vector store saved to: {output_path}")
        print("Finished saving model!")
    except Exception as e:
      print(f"Error in fine-tuning model: {e}")

if __name__ == "__main__":
    data_path = os.path.join(os.path.dirname(__file__), 'data_regulation.csv')
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'finetune_model'))
    finetune_and_save_model(data_path, output_dir)
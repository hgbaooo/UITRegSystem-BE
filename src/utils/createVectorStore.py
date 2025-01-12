import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from utils.loadDataFromCSV import load_data_from_csv


def create_vector_store(data_path, embedding_model = "sentence-transformers/all-MiniLM-L6-v2"):
    try:
        csv_data = load_data_from_csv(data_path)
        if csv_data is None:
          raise ValueError("No data load from CSV")
        
        docs = []
        for _, row in csv_data.iterrows():
          doc = f"Câu hỏi: {row['Câu hỏi']} \nCâu trả lời: {row['Câu trả lời']} \nCăn cứ: {row['Căn cứ']} \nNgày ban hành: {row['Ngày ban hành']} \nNgày cập nhật: {row['Ngày cập nhật']} \nĐường dẫn căn cứ: {row['Đường dẫn căn cứ']} \nĐường dẫn các file cập nhật: {row['Đường dẫn các file cập nhật']}"
          docs.append(doc)
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1800, chunk_overlap=600)
        splitted_docs = text_splitter.create_documents(docs)

        embeddings = HuggingFaceEmbeddings(model_name=embedding_model)
        vector_store = FAISS.from_documents(splitted_docs, embeddings)
        return vector_store
    except Exception as e:
        print(f"Error creating vector store: {e}")
        raise


if __name__ == '__main__':
    csv_path = '../data_regulation.csv'
    vector_store = create_vector_store(csv_path)
    print(vector_store)
import sys
import json
import os
import re
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from utils.loadDataFromCSV import load_data_from_csv
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFaceHub
from dotenv import load_dotenv
load_dotenv()


def process_question(question):
    try:
        # Load model from file system
        model_path = os.path.join(os.path.dirname(__file__), '../finetune_model/model_output')
        
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = FAISS.load_local(model_path, embeddings, allow_dangerous_deserialization=True)
        
        model = HuggingFaceHub(
            repo_id="google/flan-t5-base", 
            huggingfacehub_api_token = os.getenv("HUGGINGFACEHUB_API_KEY")
          )
        
        qa_chain = RetrievalQA.from_llm(
            llm=model, 
            retriever=vector_store.as_retriever(search_kwargs={'k': 5}),
            return_source_documents=True
            )
        result = qa_chain({"query": question})
        formatted_results = []
        for doc in result['source_documents']:
            lines = doc.page_content.split("\n")
            answer = ""
            source = ""
            issue_date = ""
            update_date = ""
            source_path = ""
            update_files_path = ""
            current_key = None
            for line in lines:
                 if line.strip() == "" :
                    continue
                 match = re.match(r"^(Câu trả lời:|Căn cứ:|Ngày ban hành:|Ngày cập nhật:|Đường dẫn căn cứ:|Đường dẫn các file cập nhật:)\s*(.*)", line)
                 if match:
                    current_key = match.group(1).strip()
                    value = match.group(2).strip()
                    if current_key == "Câu trả lời:":
                       answer = value
                    elif current_key == "Căn cứ:":
                        source = value
                    elif current_key == "Ngày ban hành:":
                        issue_date = value
                    elif current_key == "Ngày cập nhật:":
                       update_date = value
                    elif current_key == "Đường dẫn căn cứ:":
                       source_path = value
                    elif current_key == "Đường dẫn các file cập nhật:":
                        update_files_path = value
                 elif current_key == "Câu trả lời:" and line.strip():
                     answer += "\n" + line.strip()
            
            formatted_results.append({
                "answer": answer.strip(),
                "source": source,
                "issueDate": issue_date,
                "updateDate": update_date,
                "sourcePath": source_path,
                "updateFilesPath": update_files_path
            })
        return  {"results": formatted_results}
    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    input_json = json.loads(sys.argv[1])
    question = input_json['question']
    
    result = process_question(question)
    print(json.dumps(result))
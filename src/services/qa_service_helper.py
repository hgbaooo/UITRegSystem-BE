import sys
import json
import os
import re
import io

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
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
            huggingfacehub_api_token = os.getenv("HUGGINGFACEHUB_API_KEY"),
          )
        
        qa_chain = RetrievalQA.from_llm(
            llm=model, 
            retriever=vector_store.as_retriever(search_kwargs={'k': 4}),
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
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                if not line:
                    i+=1
                    continue
                match = re.match(r"^(Câu trả lời:|Căn cứ:|Ngày ban hành:|Ngày cập nhật:|Đường dẫn căn cứ:|Đường dẫn các file cập nhật:)\s*(.*)", line)
                if match:
                    current_key = match.group(1).strip()
                    value = match.group(2).strip()
                    if current_key == "Câu trả lời:":
                        answer = value
                        i += 1
                        while i < len(lines):
                          next_line = lines[i].strip()
                          if not next_line:
                             i += 1
                             continue
                          if re.match(r"^(Câu trả lời:|Căn cứ:|Ngày ban hành:|Ngày cập nhật:|Đường dẫn căn cứ:|Đường dẫn các file cập nhật:)",next_line):
                            break
                          else:
                            answer += "\n" + next_line
                            i += 1
                        
                    elif current_key == "Căn cứ:":
                        source = value
                        i+=1
                    elif current_key == "Ngày ban hành:":
                        issue_date = value
                        i+=1
                    elif current_key == "Ngày cập nhật:":
                       update_date = value
                       i+=1
                    elif current_key == "Đường dẫn căn cứ:":
                       source_path = value
                       i+=1
                    elif current_key == "Đường dẫn các file cập nhật:":
                        update_files_path = value
                        i+=1
                else:
                  i +=1


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
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    result = process_question(question)
    print(json.dumps(result, ensure_ascii=False))
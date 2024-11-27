import json
import joblib  # Ensure you have this import
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import sys

# Load the FAISS vector store and the answers/bases
vector_store = FAISS.load_local(
    "src/models/faiss_index",
    HuggingFaceEmbeddings(model_name='distilbert-base-nli-stsb-mean-tokens'),
    allow_dangerous_deserialization=True
)

answers_and_bases = joblib.load("src/models/answers_and_bases.pkl")

def get_answer(question):
    similar_questions = vector_store.similarity_search(question, k=1)
    
    if similar_questions:
        retrieved_question = similar_questions[0].page_content
        return answers_and_bases.get(retrieved_question, ("No answer found.", ""))
    
    return "No similar questions found.", ""

def main():
    # Get the question from command-line arguments
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No question provided.'}))
        sys.exit(1)

    question = " ".join(sys.argv[1:])
    answer, base = get_answer(question)

    # Prepare the output as JSON
    output = {
        'answer': answer,
        'base': base
    }

    print(json.dumps(output))  # Print output as JSON

if __name__ == "__main__":
    main()

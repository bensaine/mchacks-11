from openai import OpenAI

client = OpenAI()
import json
from pypdf import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import OpenAIEmbeddings
from langchain_community.llms import OpenAI
from langchain_openai import ChatOpenAI
from flask_cors import CORS

# from langchain_community.document_loaders import PyPDFLoader
from flask import Flask, request, abort, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = "/pdfs"
ALLOWED_EXTENSIONS = {"pdf"}

key = os.getenv("OPENAI_API_KEY")


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return abort(400, "No file part")
    if "uuid" not in request.form:
        return abort(400, "No uuid")
    file = request.files["file"]
    if file.filename == "":
        return abort(400, "No selected file")
    if file and allowed_file(file.filename):
        filename = request.form["uuid"] + ".pdf"
        path = os.getcwd() + app.config["UPLOAD_FOLDER"] + "/" + filename
        file.save(path)
        return analyze_resume(path)


@app.route("/uploads/<uuid>", methods=["GET"])
def download_file(uuid):
    return send_from_directory(os.getcwd() + app.config["UPLOAD_FOLDER"], uuid + ".pdf")


def ask_openAI(question):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[{"content": question, "role": "user"}],
        max_tokens=400,
        n=1,
        stop=None,
        temperature=0,
    )
    print(response)
    return response.choices[0].message.content.strip()


def analyze_resume(resume_path):
    reader = PdfReader(resume_path)
    try:
        resume = reader.pages[0].extract_text(
            extraction_mode="layout",
            layout_mode_space_vertically=False,
        )
    except:
        resume = reader.pages[0].extract_text()

    text_splitter = CharacterTextSplitter(
        separator="\n", chunk_size=600, chunk_overlap=100, length_function=len
    )

    chunks = text_splitter.split_text(resume)

    embeddings = OpenAIEmbeddings(openai_api_key=key)
    knowledge_base = FAISS.from_texts(chunks, embeddings)

    llm = ChatOpenAI(
        openai_api_key=key,
        temperature=0,
        model_name="gpt-3.5-turbo-1106",
        max_tokens="2000",
        model_kwargs={"response_format": {"type": "json_object"}},
    )
    chain = load_qa_chain(llm, chain_type="stuff")

    question1 = f"From the resume, what is the graduation year of the candidate? Return in json format with key 'graduation'. If not found, return null."
    docs1 = knowledge_base.similarity_search(question1)

    question2 = f"First take a break. Today is January 2024. Please return an 'insights' array of between 2-4 strings of short bullet points from this resume to provide a useful overview of the candidate for a hiring manager in json format. Do not add a title or formatting. The first insight should summarize education (school name, degree, major, and future graduation year). The second insight should summarize work experience. For the third and fourth insights, please summarize skills or anything the recruiter should know."
    docs2 = knowledge_base.similarity_search(question2)

    response1 = chain.invoke({"input_documents": docs1, "question": question1})[
        "output_text"
    ]
    response2 = chain.invoke({"input_documents": docs2, "question": question2})[
        "output_text"
    ]

    json_response = {**json.loads(response1), **json.loads(response2)}

    return json_response

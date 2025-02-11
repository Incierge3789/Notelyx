import os

import whisper
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from openai import OpenAI

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # すべてのオリジンからのリクエストを許可

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///notelyx.db"
db = SQLAlchemy(app)

# OpenAI APIキー
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your_openai_api_key")


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)


# 初回実行時にデータベースを作成
with app.app_context():
    db.create_all()


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Notelyx API is running!"}), 200


# ✅ `/api/notes` にエンドポイントを変更
@app.route("/api/notes", methods=["POST"])
def create_note():
    data = request.json
    new_note = Note(title=data["title"], content=data["content"])
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"message": "Note created"}), 201


@app.route("/api/notes", methods=["GET"])
def get_notes():
    notes = Note.query.all()
    return (
        jsonify([{"id": n.id, "title": n.title, "content": n.content} for n in notes]),
        200,
    )


@app.route("/api/notes/<int:id>", methods=["DELETE"])
def delete_note(id):
    note = Note.query.get(id)
    if not note:
        return jsonify({"error": "Note not found"}), 404
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 200


@app.route("/api/transcribe", methods=["POST"])
def transcribe_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    file_path = "temp_audio.wav"
    file.save(file_path)

    model = whisper.load_model("base")
    result = model.transcribe(file_path)

    return jsonify({"text": result["text"]})


@app.route("/summary", methods=["POST"])
def summarize_text():
    data = request.json
    text = data.get("text", "")

    # 🔹 リクエストヘッダーからAPIキーを取得
    user_api_key = request.headers.get("Authorization")
    if not user_api_key or not user_api_key.startswith("Bearer "):
        return jsonify({"error": "APIキーが設定されていません"}), 400
    
    user_api_key = user_api_key.replace("Bearer ", "")  # "Bearer "を除去

    try:
        client = OpenAI(api_key=user_api_key)
        response = client.Completion.create(
            model="gpt-4o",
            prompt=f"要約してください:\n{text}",
            max_tokens=100
        )
        return jsonify({"summary": response["choices"][0]["text"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)

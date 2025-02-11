from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///notelyx.db"
db = SQLAlchemy(app)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)

# 初回実行時にデータベースを作成
with app.app_context():
    db.create_all()

@app.route("/notes", methods=["POST"])
def create_note():
    data = request.json
    new_note = Note(title=data["title"], content=data["content"])
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"message": "Note created"}), 201

@app.route("/notes", methods=["GET"])
def get_notes():
    notes = Note.query.all()
    return jsonify([{"id": n.id, "title": n.title, "content": n.content} for n in notes])

if __name__ == "__main__":
    app.run(debug=True, port=5000)

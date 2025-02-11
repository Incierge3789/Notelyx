import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// ✅ Noteの型を定義
type NoteType = {
    id: number;
    title: string;
    content: string;
};

export default function NotesPage() {
    // ✅ 型を明示
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [summary, setSummary] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/notes`)
            .then((res) => res.json())
            .then((data: NoteType[]) => setNotes(data)); // ✅ 型アサーションを適用
    }, []);

    const addNote = async () => {
        if (!title || !content) return;

        const response = await fetch(`${API_BASE_URL}/api/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            const newNote: NoteType = await response.json(); // ✅ newNoteの型を明示
            setNotes([...notes, newNote]); // ✅ スプレッド演算子のエラーを解決
            setTitle("");
            setContent("");
        }
    };

    const deleteNote = async (id: number) => {
        await fetch(`${API_BASE_URL}/api/notes/${id}`, { method: "DELETE" });
        setNotes(notes.filter((note) => note.id !== id));
    };

    const startRecording = () => {
        setRecording(true);
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];
            mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: "audio/wav" });
                setAudioBlob(audioBlob);
            };
            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000); // 5秒間録音
        });
    };

    const stopRecording = async () => {
        setRecording(false);
        if (!audioBlob) return;
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");

        const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        setContent(data.text);
    };

    const generateSummary = async (id: number) => {
        setLoadingSummary(true);

        // 🔹 ユーザーのAPIキーを `localStorage` から取得
        const userApiKey = localStorage.getItem("OPENAI_API_KEY");
        if (!userApiKey) {
            alert("⚠️ OpenAI APIキーが設定されていません！設定ページで入力してください。");
            setLoadingSummary(false);
            return;
        }

        const note = notes.find(n => n.id === id);
        if (!note) {
            alert("⚠️ 指定されたノートが見つかりません。");
            setLoadingSummary(false);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/summary`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userApiKey}`  // ✅ ユーザーのAPIキーをヘッダーに追加
            },
            body: JSON.stringify({ text: note.content })
        });

        if (!response.ok) {
            alert("⚠️ 要約の取得に失敗しました。APIキーが正しいか確認してください。");
            setLoadingSummary(false);
            return;
        }

        const data = await response.json();
        setSummary(data.summary);
        setLoadingSummary(false);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
            <h1 style={{ textAlign: "center" }}>Notes</h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {notes.map((note) => (
                    <li key={note.id} style={{
                        marginBottom: "20px",
                        padding: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9"
                    }}>
                        <h2 style={{ margin: "0 0 5px" }}>{note.title}</h2>
                        <p style={{ margin: "0 0 10px" }}>{note.content}</p>
                        <button onClick={() => deleteNote(note.id)}
                            style={{
                                background: "red",
                                color: "white",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}>
                            Delete
                        </button>
                        <button onClick={() => generateSummary(note.id)}
                            style={{
                                background: "green",
                                color: "white",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginLeft: "10px"
                            }}>
                            {loadingSummary ? "Loading..." : "✨ 要約"}
                        </button>
                    </li>
                ))}
            </ul>

            <h2 style={{ textAlign: "center", marginTop: "30px" }}>Add a New Note</h2>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f4f4f4"
            }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", height: "100px" }}
                />
                <button onClick={addNote} style={{
                    background: "blue",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    Add Note
                </button>
            </div>

            <h2 style={{ textAlign: "center", marginTop: "30px" }}>Record Audio</h2>
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px"
            }}>
                <button onClick={startRecording} disabled={recording} style={{
                    background: recording ? "gray" : "green",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: recording ? "default" : "pointer"
                }}>
                    🎤 {recording ? "Recording..." : "Start Recording"}
                </button>
                <button onClick={stopRecording} disabled={!recording} style={{
                    background: recording ? "red" : "gray",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: recording ? "pointer" : "default"
                }}>
                    ⏹ Stop Recording
                </button>
            </div>

            {summary && (
                <div style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#e0f7fa"
                }}>
                    <h3>要約:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}
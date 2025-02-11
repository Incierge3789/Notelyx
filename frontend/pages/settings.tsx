import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("");
    const router = useRouter(); // ✅ ルーターを取得

    useEffect(() => {
        const storedKey = localStorage.getItem("OPENAI_API_KEY");
        if (storedKey) setApiKey(storedKey);
    }, []);

    const saveApiKey = () => {
        localStorage.setItem("OPENAI_API_KEY", apiKey);
        alert("APIキーが保存されました！");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
            <h1 style={{ textAlign: "center" }}>Settings</h1>

            {/* ✅ 追加：ホームに戻るボタン */}
            <button onClick={() => router.push("/notes")} style={{
                marginBottom: "20px",
                background: "gray",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer"
            }}>
                ← ホームに戻る
            </button>

            <label>OpenAI API Key:</label>
            <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
                style={{ width: "100%", padding: "10px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            <button onClick={saveApiKey} style={{
                marginTop: "10px",
                background: "blue",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer"
            }}>
                Save API Key
            </button>
        </div>
    );
}

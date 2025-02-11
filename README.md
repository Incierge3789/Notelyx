README.md (English & Japanese)

# Notelyx 📝🎤 – AI-Powered Note Taking App (英語 & 日本語)

Notelyx is an AI-powered note-taking app with **voice recording, transcription, and summarization** features.  
It utilizes **OpenAI Whisper & GPT-4** to help users easily record conversations, convert speech to text, and generate summaries.

Notelyx は、**音声録音、文字起こし、要約** 機能を備えた AI ノートアプリです。  
**OpenAI Whisper & GPT-4** を活用し、会話を簡単に記録し、文字起こしし、要点を抽出できます。

---

## 🚀 Features | 機能

✅ **Create, delete, and list notes**  
✅ **Voice recording & automatic transcription (Whisper AI)**  
✅ **Note summarization with GPT-4**  
✅ **Custom API Key settings (users can set their own OpenAI API Key)**  
✅ **Settings page for API key management & UI customization**  

✅ **ノートの作成・削除・一覧表示**  
✅ **音声録音 & 自動文字起こし (Whisper AI)**  
✅ **ノートの要約 (GPT-4)**  
✅ **カスタム API キー設定 (ユーザー自身が設定可能)**  
✅ **設定ページで API キー管理 & UI の調整**  

---

## 🔧 Installation & Setup | インストール & セットアップ

### 1️⃣ Clone the repository | リポジトリをクローン
```sh
git clone https://github.com/Incierge3789/Notelyx.git
cd Notelyx

2️⃣ Set up the backend (Flask) | バックエンド（Flask）のセットアップ

cd backend
python -m venv venv
source venv/bin/activate  # Windows の場合: venv\Scripts\activate
pip install -r requirements.txt
python main.py

3️⃣ Set up the frontend (Next.js) | フロントエンド（Next.js）のセットアップ

cd frontend
npm install
npm run dev

4️⃣ Configure environment variables | 環境変数の設定

Create a .env.local file in frontend/ and set the OpenAI API Key:

frontend/.env.local

NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000

🛠 API Endpoints | API エンドポイント

Method	Endpoint	Description	説明
GET	/api/notes	Get all notes	ノート一覧を取得
POST	/api/notes	Create a new note	ノートを作成
DELETE	/api/notes/{id}	Delete a note by ID	指定ノートを削除
POST	/api/transcribe	Upload audio for transcription	音声データを送信し、Whisper で文字起こし
POST	/api/summary	Generate a summary with GPT-4	GPT-4 でノートの要約

📌 Development Progress & Future Updates | 開発状況 & 今後のアップデート

✅ Current Status | 現在の開発状況
	•	GitHub push issue resolved! | GitHub への push 問題を解決！
	•	Implemented API Key settings page & UI fixes | API キー設定ページ & UI 修正完了
	•	Optimized voice recording | 音声録音の最適化
	•	Improved error handling | エラーハンドリング強化
	•	Standardized environment variable management (.env.local) | 環境変数管理を .env.local に統一

🚀 Next Steps | 次のステップ

1️⃣ Improve API Key management (localStorage → .env.local) | API キーの管理を改善
2️⃣ Optimize UI update after note deletion | ノート削除後の UI 更新を最適化
3️⃣ Prepare backend (Flask) for deployment | バックエンド（Flask）のデプロイ準備
4️⃣ Enhance error handling & security | エラーハンドリングとセキュリティ強化

🛠 Technical Issues | 技術的課題
	•	Refine CORS settings (Access-Control-Allow-Origin adjustments) | CORS 設定の見直し
	•	Limit recording duration & test long recordings | 録音時間の制限 & 長時間録音のテスト
	•	Improve local storage management (API Key security) | ローカルストレージ管理の改善（API キーの安全性向上）

🔧 Deployment Plan | デプロイ計画

Frontend: Vercel / Netlify
Backend: Render / Heroku / Google Cloud Platform (GCP)

🎯 Contribution | 貢献

If you want to contribute to Notelyx, feel free to create a pull request! 🚀
Notelyx への貢献を希望される方は、プルリクエストを送ってください！💡

📜 License | ライセンス

This project is licensed under the MIT License.
このプロジェクトは MIT ライセンスのもとで公開されています。

---

### ✅ **ポイント**
1. **README.md** は簡潔で、セットアップと機能に焦点を当てる  
2. **詳細な開発情報** は `docs/DEVELOPMENT.md` に分離  
3. **日本語 & 英語** を併記し、どのユーザーでも理解できるようにする  

🚀 **このまま `git add README.md` して `git commit` すれば OK！**

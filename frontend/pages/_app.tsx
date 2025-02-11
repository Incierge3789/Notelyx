import { AppProps } from "next/app";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            {/* 🔹 ナビゲーションバー */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
                backgroundColor: "#333",
                color: "white"
            }}>
                <Link href="/" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
                    📝 Notelyx
                </Link>
                <Link href="/settings" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>
                    ⚙ 設定
                </Link>
            </nav>

            {/* 🔹 各ページのコンテンツ */}
            <Component {...pageProps} />
        </div>
    );
}

export default MyApp;

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch("http://127.0.0.1:5000/");
        const data = await response.json();
        res.status(200).json(data);
    } catch (error: unknown) {  // 型アサーションを追加
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: `Failed to fetch from Flask API: ${errorMessage}` });
    }
}
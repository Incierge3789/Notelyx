import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000"; // ベースURLを設定

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    if (req.method === "DELETE") {
        const response = await fetch(`${apiBaseUrl}/notes/${id}`, { method: "DELETE" });

        if (response.ok) {
            res.status(200).json({ message: "Note deleted" });
        } else {
            res.status(response.status).json({ error: "Failed to delete note" });
        }
    } else if (req.method === "GET") {
        const response = await fetch(`${apiBaseUrl}/notes/${id}`);

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: "Note not found" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}

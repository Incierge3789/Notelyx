import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const formData = new FormData();
        formData.append("file", req.body.audioFile);

        const response = await fetch("http://127.0.0.1:5000/transcribe", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        res.status(200).json(data);
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}

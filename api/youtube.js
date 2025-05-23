// /api/youtube.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
/**
 * Vercel Serverless API Function
 */
export default async function handler(req, res) {
  const query = req.query.q;
  const API_KEY = process.env.YOUTUBE_API_KEY;
  console.log("🔑 API_KEY:", API_KEY);

  if (!query) {
    return res.status(400).json({ error: "검색어가 필요합니다." });
  }

  try {
    const searchRes = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: API_KEY,
        q: `${query} official audio`,
        part: "snippet",
        maxResults: 20,
        type: "video",
      },
    });

    const videos = searchRes.data.items;
    const ids = videos.map((v) => v.id.videoId).join(",");

    const detailRes = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        key: API_KEY,
        id: ids,
        part: "snippet,statistics,status",
      },
    });

    const detailMap = {};
    detailRes.data.items.forEach((item) => {
      detailMap[item.id] = item;
    });

    const enriched = videos.map((video) => {
      const detail = detailMap[video.id.videoId];
      return {
        ...video,
        snippet: {
          ...video.snippet,
          description: detail?.snippet?.description || "",
        },
        statistics: detail?.statistics || {},
        embeddable: detail?.status?.embeddable ?? false,
      };
    });

    res.status(200).json(enriched);
  } catch (err) {
    console.error("❌ YouTube API 오류:", err.message);
    res.status(500).json({ error: "YouTube 검색 실패" });
  }
}

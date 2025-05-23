// src/services/youtubeAPI.js
/*
import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYouTube = (query) => {
  return axios
    .get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: API_KEY,
        q: `${query} official audio`,
        part: "snippet",
        maxResults: 20,
        type: "video",
      },
    })
    .then((searchRes) => {
      const videos = searchRes.data.items;
      const ids = videos.map((v) => v.id.videoId).join(",");

      return axios
        .get("https://www.googleapis.com/youtube/v3/videos", {
          params: {
            key: API_KEY,
            id: ids,
            part: "snippet,statistics,status",
          },
        })
        .then((detailRes) => {
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

          return enriched;
        });
    })
    .catch((err) => {
      console.error("❌ YouTube 검색 실패:", err.response?.data || err.message);
      return [];
    });
};
*/


// src/services/youtubeAPI.js
import axios from "axios";

export const searchYouTube = (query) => {
  return axios
    .get(`/api/youtube?q=${encodeURIComponent(query)}`)
    .then((res) => {
      const data = res.data;
      return Array.isArray(data) ? data : []; // 안전하게 배열 보장
    })
    .catch((err) => {
      console.error("❌ 검색 실패:", err.response?.data || err.message);
      return [];
    });
};


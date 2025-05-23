/*
import React, { useEffect, useState } from "react";
import { searchYouTube } from "./services/youtubeAPI";
import {
  savePlaylist,
  getPlaylist,
} from "./services/indexedDB";
import SearchBar from "./components/SearchBar";
import YouTubeCard from "./components/YouTubeCard";
import Playlist from "./components/Playlist";
import PlaylistSelector from "./components/PlaylistSelector";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentName, setCurrentName] = useState(null);

  // ✅ YouTube API 스크립트 로딩 (필요 없다면 이 부분도 제거 가능)
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.body.appendChild(tag);
  }, []);

  const handleSearch = async (customQuery = null) => {
    try {
      const q = customQuery || query;
      const items = await searchYouTube(q);
      setResults(items);
    } catch (err) {
      console.error("검색 실패", err);
    }
  };

  const handleSelectPlaylist = async (name) => {
    setCurrentName(name);
    if (name) {
      const data = await getPlaylist(name);
      setPlaylist(data);
    } else {
      setPlaylist([]);
    }
  };

  const handleCreatePlaylist = async (name) => {
    setCurrentName(name);
    setPlaylist([]);
  };

  const addToPlaylist = async (video) => {
    if (!currentName) return alert("플레이리스트를 먼저 선택하세요!");
    if (!playlist.some((v) => v.id.videoId === video.id.videoId)) {
      const updated = [...playlist, video];
      setPlaylist(updated);
      await savePlaylist(currentName, updated);
    }
  };

  const removeFromPlaylist = async (videoId) => {
    const updated = playlist.filter((v) => v.id.videoId !== videoId);
    setPlaylist(updated);
    await savePlaylist(currentName, updated);
  };

  // ✅ 유튜브에서 전체 재생
  const handleExternalPlaylistPlay = () => {
    const ids = playlist
      .map((v) => v.id?.videoId)
      .filter(Boolean)
      .slice(0, 50); // 유튜브는 최대 50개까지만 허용

    if (ids.length === 0) {
      alert("재생 가능한 영상이 없습니다.");
      return;
    }

    const url = `https://www.youtube.com/watch_videos?video_ids=${ids.join(",")}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        YouTube 노래 검색 및 플레이리스트 저장
      </h1>

      <PlaylistSelector
        selected={currentName}
        onSelect={handleSelectPlaylist}
        onCreate={handleCreatePlaylist}
      />

      <div className="flex items-center gap-2 mb-6">
        <SearchBar query={query} setQuery={setQuery} onSearch={() => handleSearch()} />
        {currentName && (
          <button
            onClick={handleExternalPlaylistPlay}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            유튜브에서 전체 재생
          </button>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">검색 결과</h2>
        <div className="flex flex-wrap gap-4">
          {results.map((video) => (
            <YouTubeCard
              key={video.id.videoId}
              video={video}
              onAdd={addToPlaylist}
              isInPlaylist={playlist.some((v) => v.id.videoId === video.id.videoId)}
              onKeywordClick={(keyword) => {
                setQuery(keyword);
                handleSearch(keyword);
              }}
            />
          ))}
        </div>
      </div>

      {currentName && (
        <Playlist
          videos={playlist}
          onDelete={removeFromPlaylist}
        />
      )}
    </div>
  );
};

export default App;
*/






import React, { useEffect, useState } from "react";
import { searchYouTube } from "./services/youtubeAPI";
import {
  savePlaylist,
  getPlaylist,
} from "./services/indexedDB";
import SearchBar from "./components/SearchBar";
import YouTubeCard from "./components/YouTubeCard";
import Playlist from "./components/Playlist";
import PlaylistSelector from "./components/PlaylistSelector";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentName, setCurrentName] = useState(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.body.appendChild(tag);
  }, []);

  const handleSearch = async (customQuery = null) => {
    const q = customQuery || query;
    if (!q.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      const items = await searchYouTube(q);
      console.log("🔍 YouTube 검색 결과:", items); // ← 여기가 핵심!
      setResults(items);
    } catch (err) {
      console.error("검색 실패", err);
    }
  };

  const handleSelectPlaylist = async (name) => {
    setCurrentName(name);
    if (name) {
      const data = await getPlaylist(name);
      setPlaylist(data);
    } else {
      setPlaylist([]);
    }
  };

  const handleCreatePlaylist = async (name) => {
    setCurrentName(name);
    setPlaylist([]);
  };

  const addToPlaylist = async (video) => {
    if (!currentName) return alert("플레이리스트를 먼저 선택하세요!");
    if (!playlist.some((v) => v.id.videoId === video.id.videoId)) {
      const updated = [...playlist, video];
      setPlaylist(updated);
      await savePlaylist(currentName, updated);
    }
  };

  const removeFromPlaylist = async (videoId) => {
    const updated = playlist.filter((v) => v.id.videoId !== videoId);
    setPlaylist(updated);
    await savePlaylist(currentName, updated);
  };

  const handleExternalPlaylistPlay = () => {
    const ids = playlist
      .map((v) => v.id?.videoId)
      .filter(Boolean)
      .slice(0, 50);

    if (ids.length === 0) {
      alert("재생 가능한 영상이 없습니다.");
      return;
    }

    const url = `https://www.youtube.com/watch_videos?video_ids=${ids.join(",")}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        YouTube 노래 검색 및 플레이리스트 저장
      </h1>

      <PlaylistSelector
        selected={currentName}
        onSelect={handleSelectPlaylist}
        onCreate={handleCreatePlaylist}
      />

      <div className="flex items-center gap-2 mb-6">
        <SearchBar query={query} setQuery={setQuery} onSearch={() => handleSearch()} />
        {currentName && (
          <button
            onClick={handleExternalPlaylistPlay}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            유튜브에서 전체 재생
          </button>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">검색 결과</h2>
        <div className="flex flex-wrap gap-4">
          {Array.isArray(results) && results.map((video) => (
            <YouTubeCard
              key={video.id.videoId}
              video={video}
              onAdd={addToPlaylist}
              isInPlaylist={playlist.some((v) => v.id.videoId === video.id.videoId)}
              onKeywordClick={(keyword) => {
                setQuery(keyword);
                handleSearch(keyword);
              }}
            />
          ))}
        </div>
      </div>

      {currentName && (
        <Playlist
          videos={playlist}
          onDelete={removeFromPlaylist}
        />
      )}
    </div>
  );
};

export default App;



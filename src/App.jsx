import React, { useEffect, useState } from "react";
import { searchYouTube } from "./services/youtubeAPI";
import {
  savePlaylist, // 플레이리스트 저장
  getPlaylist, // 플레이리스트 불러오기
  saveRecentQuery, // 최근검색어 저장
  getRecentQueries, // 최근검색어 불러오기
  deleteRecentQuery, // 최근검색어 삭제
} from "./services/indexedDB";

import SearchBar from "./components/SearchBar";
import YouTubeCard from "./components/YouTubeCard";
import Playlist from "./components/Playlist";
import PlaylistSelector from "./components/PlaylistSelector";

const App = () => {
  const [query, setQuery] = useState(""); // 현재검색어
  const [results, setResults] = useState([]); // 검색 결과 영상 리스트
  const [playlist, setPlaylist] = useState([]); // 현재 선택된 플레이리스트
  const [currentName, setCurrentName] = useState(null); // 현재 선택된 플레이리스트 이름
  const [recentQueries, setRecentQueries] = useState([]); // 최근검색어 리스트

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.body.appendChild(tag);
  }, []);
  // 앱 시작 시 최근검색어 불러오기 
  useEffect(() => {
    getRecentQueries().then(setRecentQueries);
  }, []);
  // 유튜브 검색 
  const handleSearch = async (customQuery = null) => {
    const q = customQuery || query;
    if (!q.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      const items = await searchYouTube(q);
      await saveRecentQuery(q); // 검색어 저장
      const updatedRecent = await getRecentQueries(); // 최근검색어 갱신
      setRecentQueries(updatedRecent);
      //console.log(" YouTube 검색 결과:", items); //디버깅용
      setResults(items);
    } catch (err) {
      console.error("검색 실패", err);
    }
  };
  // 플레이리스트 선택시 내용 불러오기
  const handleSelectPlaylist = async (name) => {
    setCurrentName(name);
    if (name) {
      const data = await getPlaylist(name);
      setPlaylist(data);
    } else {
      setPlaylist([]);
    }
  };
  // 새 플레이리스트 생성 시 초기화
  const handleCreatePlaylist = async (name) => {
    setCurrentName(name);
    setPlaylist([]);
  };
  // 플레이리스트에 노래 추가
  const addToPlaylist = async (video) => {
    if (!currentName) return alert("플레이리스트를 먼저 선택하세요!");
    if (!playlist.some((v) => v.id.videoId === video.id.videoId)) {
      const updated = [...playlist, video];
      setPlaylist(updated);
      await savePlaylist(currentName, updated);
    }
  };

  // 플레이리스트 노래 제거
  const removeFromPlaylist = async (videoId) => {
    const updated = playlist.filter((v) => v.id.videoId !== videoId);
    setPlaylist(updated);
    await savePlaylist(currentName, updated);
  };
  // 만든 플레이리스트 재생목록으로 만들어서 링크로 재생
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

      <div className="flex items-center gap-2 mb-4">
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

      {/* ✅ 최근 검색어 + 삭제 버튼 */}
      {recentQueries.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm text-gray-500 mb-1">최근 검색어</h3>
          <div className="flex gap-2 flex-wrap">
            {recentQueries.map((keyword, i) => (
              <div key={i} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                <button
                  onClick={() => {
                    setQuery(keyword);
                    handleSearch(keyword);
                  }}
                  className="text-sm text-black hover:underline"
                >
                  {keyword}
                </button>
                <button
                  onClick={async () => {
                    await deleteRecentQuery(keyword);
                    const updated = await getRecentQueries();
                    setRecentQueries(updated);
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                  title="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">검색 결과</h2>
        <div className="flex flex-wrap gap-4">
          {Array.isArray(results) &&
            results.map((video) => (
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

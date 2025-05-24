
import React from "react";

const YouTubeCard = ({ video, onAdd, onDelete, isInPlaylist, onKeywordClick }) => {
  const { title, thumbnails, description } = video.snippet;
  const videoId = video.id.videoId;
  const viewCount = video.statistics?.viewCount;
  const embeddable = video.embeddable;

  const handleClick = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  const formatViews = (num) =>
    num ? Number(num).toLocaleString("ko-KR") + "회" : "";

  const parseDescription = (text) => {
    const lines = text.split(/\n| - /);
    const elements = [];

    const patterns = [
      /(\d{1,2}:\d{2})\s*[-–—]?\s*(.+)/,   // 어떤 하이픈이라도 인식 //왜안되지..?
      /(\d{1,2}:\d{2})\s*-\s*(.+)/,                      // 00:15 - 제목
      /(\d{1,2}:\d{2})\s+(.+)/,                          // 00:15 제목
      /\d+\.\s*(\d{1,2}:\d{2})\s+(.+)/,                  // 1. 00:30 제목
      /\[(\d{1,2}:\d{2})\]\s*(.+)/,                      // [00:15] 제목
      /(\d{1,2}:\d{2})》(.+)/,                           // 00:15》제목
    ];

    lines.forEach((line, i) => {
      for (let pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const [, time, songTitle] = match;
          elements.push(
            <div key={i} className="text-xs">
              <span className="text-gray-400 mr-2">{time}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onKeywordClick) onKeywordClick(songTitle.trim());
                }}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {songTitle.trim()}
              </button>
            </div>
          );
          return;
        }
      }
    });

    return elements.length > 0 ? elements : <p>{text}</p>;
  };

  return (
    <div
      className="w-64 bg-white shadow rounded overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      <img src={thumbnails.medium.url} alt={title} className="w-full" />
      <div className="p-3">
        <p className="font-semibold text-sm mb-1 truncate">{title}</p>
        {viewCount && (
          <p className="text-xs text-gray-500 mb-1">조회수 {formatViews(viewCount)}</p>
        )}
        <div className="text-xs text-gray-600 max-h-28 overflow-y-auto mb-2">
          {parseDescription(description)}
        </div>
        {isInPlaylist ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(videoId);
            }}
            className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            삭제
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(video);
            }}
            className="mt-2 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            플레이리스트에 추가
          </button>
        )}
      </div>
    </div>
  );
};

export default YouTubeCard;





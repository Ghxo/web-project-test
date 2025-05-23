// src/components/Playlist.jsx
import React from "react";
import YouTubeCard from "./YouTubeCard";

const Playlist = ({ videos, onDelete }) => (
  <div className="mt-10">
    <h2 className="text-xl font-semibold mb-4">내 플레이리스트</h2>
    <div className="flex flex-wrap gap-4">
      {videos.map((video) => (
        <YouTubeCard
          key={video.id.videoId}
          video={video}
          onDelete={onDelete}
          isInPlaylist
        />
      ))}
    </div>
  </div>
);

export default Playlist;

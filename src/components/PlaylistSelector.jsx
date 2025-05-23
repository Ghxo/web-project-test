// src/components/PlaylistSelector.jsx
import React, { useState, useEffect } from "react";
import {
  getAllPlaylistNames,
  savePlaylist,
  deletePlaylist,
} from "../services/indexedDB";

const PlaylistSelector = ({ selected, onSelect, onCreate }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    refreshPlaylists();
  }, []);

  const refreshPlaylists = async () => {
    const names = await getAllPlaylistNames();
    setPlaylists(names);
  };

  const handleCreate = async () => {
    if (!newName) return;
    await savePlaylist(newName, []);
    setNewName("");
    refreshPlaylists();
    onCreate(newName); // 생성 시 자동 선택
  };

  const handleDelete = async (name) => {
    await deletePlaylist(name);
    refreshPlaylists();
    if (name === selected) onSelect(null);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <select
          value={selected || ""}
          onChange={(e) => onSelect(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">플레이리스트 선택</option>
          {playlists.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {selected && (
          <button
            onClick={() => handleDelete(selected)}
            className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            삭제
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="새 이름 입력"
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          생성
        </button>
      </div>
    </div>
  );
};

export default PlaylistSelector;

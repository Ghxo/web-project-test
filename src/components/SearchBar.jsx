// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ query, setQuery, onSearch }) => (
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="노래 제목 또는 아티스트 입력"
      className="border border-gray-300 px-4 py-2 rounded w-64 shadow-sm"
    />
    <button
      onClick={onSearch}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      검색
    </button>
  </div>
);

export default SearchBar;

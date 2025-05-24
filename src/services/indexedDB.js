const DB_NAME = "YouTubePlaylistDB";
const STORE_NAME = "playlists";  // 플레이리스트 저장용
const RECENT_STORE = "recentQueries";  // 최근검색어 저장용
const DB_VERSION = 2; // 2개라서 2로 했는데 큰 상관은 없는듯?

let dbInstance = null;
// DB 열기
export const openDB = () => {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // 기존 플레이리스트 store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }

      // 새로 추가된 최근 검색어 store
      if (!db.objectStoreNames.contains(RECENT_STORE)) {
        db.createObjectStore(RECENT_STORE, { keyPath: "query" });
      }
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      console.error("❌ DB 열기 실패", e);
      reject(e);
    };
  });
};

//  플레이리스트 관련 기능
export const savePlaylist = async (name, videos) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put({ name, videos });
  return tx.complete;
};
// 플레이리스트 목록 가져오기
export const getPlaylist = async (name) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const req = store.get(name);

  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result?.videos || []);
    req.onerror = () => reject(req.error);
  });
};
// 저장된 플레이리스트 이름 가져오기
export const getAllPlaylistNames = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const req = store.getAllKeys();

  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};
// 플레이리스트 삭제
export const deletePlaylist = async (name) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(name);
  return tx.complete;
};


// 최근 검색어 저장
export const saveRecentQuery = async (query) => {
  const db = await openDB();
  const tx = db.transaction(RECENT_STORE, "readwrite");
  const store = tx.objectStore(RECENT_STORE);
  const data = { query, date: Date.now() };
  store.put(data);
  return tx.complete;
};

// 최근 검색어 불러오기 (최신순, 최대 10개)
export const getRecentQueries = async () => {
  const db = await openDB();
  const tx = db.transaction(RECENT_STORE, "readonly");
  const store = tx.objectStore(RECENT_STORE);
  const req = store.getAll();

  return new Promise((resolve, reject) => {
    req.onsuccess = () => {
      const all = req.result
        .sort((a, b) => b.date - a.date)
        .slice(0, 10)
        .map((q) => q.query);
      resolve(all);
    };
    req.onerror = () => reject(req.error);
  });
};
// 최근검색어 삭제
export const deleteRecentQuery = async (query) => {
  const db = await openDB();
  const tx = db.transaction("recentQueries", "readwrite");
  const store = tx.objectStore("recentQueries");
  store.delete(query);
  return tx.complete;
};

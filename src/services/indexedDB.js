/*
const DB_NAME = "YouTubePlaylistDB";
const STORE_NAME = "playlist";
const DB_VERSION = 3;

let dbInstance = null;

export const openDB = () => {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id.videoId" });
        console.log("✅ object store 생성됨");
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

export const saveToIndexedDB = (video) => {
  return openDB()
    .then((db) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(video);
      tx.oncomplete = () => {
        console.log("✅ 저장 완료", video);
      };
    })
    .catch((err) => {
      console.error("❌ 저장 실패", err);
    });
};

export const loadPlaylistFromIndexedDB = (callback) => {
  return openDB()
    .then((db) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        console.log("✅ 불러오기 성공", getAllRequest.result);
        callback(getAllRequest.result);
      };

      getAllRequest.onerror = (e) => {
        console.error("❌ getAll 실패", e);
      };
    })
    .catch((err) => {
      console.error("❌ 불러오기 실패", err);
    });
};

export const removeFromIndexedDB = (videoId, callback) => {
  return openDB()
    .then((db) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(videoId);
      tx.oncomplete = () => {
        console.log("🗑️ 삭제 완료", videoId);
        if (callback) callback();
      };
    })
    .catch((err) => {
      console.error("❌ 삭제 실패", err);
    });
};

*/
// src/services/indexedDB.js

const DB_NAME = "YouTubePlaylistDB";
const STORE_NAME = "playlists";
const DB_VERSION = 1;

let dbInstance = null;

export const openDB = () => {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" }); // 이름으로 구분
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

export const savePlaylist = async (name, videos) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put({ name, videos });
  return tx.complete;
};

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

export const deletePlaylist = async (name) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(name);
  return tx.complete;
};

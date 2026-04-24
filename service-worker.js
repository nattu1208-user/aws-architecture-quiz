/**
 * AWS構成図クイズ - Service Worker（PWAオフライン対応）
 * 作成者: Sekimoto Naoto
 * 作成日: 2026-04-24
 * 説明: アプリのコアファイルをキャッシュし、オフラインでも動作できるようにする
 */

'use strict';

const CACHE_NAME = 'aws-arch-quiz-v1';

// キャッシュ対象ファイル一覧
const CACHE_URLS = [
  './index.html',
  './questions.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// =============================================
// インストール時: 全リソースをキャッシュ
// =============================================
self.addEventListener('install', (event) => {
  console.log('[SW] install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    }).then(() => {
      // 待機中の SW をすぐに有効化
      return self.skipWaiting();
    })
  );
});

// =============================================
// アクティベート時: 古いキャッシュを削除
// =============================================
self.addEventListener('activate', (event) => {
  console.log('[SW] activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // 現在開いているページをすぐに制御下に置く
      return self.clients.claim();
    })
  );
});

// =============================================
// フェッチ時: キャッシュ優先（Cache First）戦略
// =============================================
self.addEventListener('fetch', (event) => {
  // chromeExtensionやhttpでないリクエストはスキップ
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      // キャッシュにない場合はネットワークから取得してキャッシュに追加
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        // オフライン時にHTMLが必要な場合はキャッシュ済みのindex.htmlを返す
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

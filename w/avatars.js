/**
 * TikFinity AZ Studio v4.2 PRO — Photographic Portrait Avatar Resolver
 * Maps streamers, likers, and gifters to local high-resolution photographic portraits
 * (/assets/avatars/avatar1.jpg .. avatar8.jpg). Zero cartoon vectors.
 */
(function (root) {
  'use strict';

  const PHOTO_AVATARS = [
    'assets/avatars/avatar1.jpg',
    'assets/avatars/avatar2.jpg',
    'assets/avatars/avatar3.jpg',
    'assets/avatars/avatar4.jpg',
    'assets/avatars/avatar5.jpg',
    'assets/avatars/avatar6.jpg',
    'assets/avatars/avatar7.jpg',
    'assets/avatars/avatar8.jpg',
  ];

  const USER_TO_AVATAR = {
    'orxan.aliyev': 'assets/avatars/avatar1.jpg',
    'kenan.m': 'assets/avatars/avatar2.jpg',
    'aysel.h': 'assets/avatars/avatar3.jpg',
    'cesur.b': 'assets/avatars/avatar4.jpg',
    'tural.q': 'assets/avatars/avatar5.jpg',
    'elvin.k': 'assets/avatars/avatar7.jpg',
    'ferid.qasimov': 'assets/avatars/avatar7.jpg',
    'leyla.aliyeva': 'assets/avatars/avatar6.jpg',
    'reshad.h': 'assets/avatars/avatar4.jpg',
    'kamran.v': 'assets/avatars/avatar2.jpg',
    'nergiz.s': 'assets/avatars/avatar8.jpg',
    'narmin.m': 'assets/avatars/avatar6.jpg',
    'gamecamp.az': 'assets/avatars/avatar8.jpg',
  };

  function getAvatar(keyOrUsername, indexFallback) {
    if (keyOrUsername) {
      const str = String(keyOrUsername).trim();
      if (str.startsWith('assets/avatars/') || str.startsWith('assets/avatars/') || str.startsWith('http://') || str.startsWith('https://')) {
        return str;
      }
      const clean = str.replace(/^@+/, '').toLowerCase();
      if (USER_TO_AVATAR[clean]) {
        return USER_TO_AVATAR[clean];
      }
      if (typeof indexFallback === 'number' && indexFallback >= 0) {
        return PHOTO_AVATARS[indexFallback % PHOTO_AVATARS.length];
      }
      let hash = 0;
      for (let i = 0; i < clean.length; i++) {
        hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
      }
      return PHOTO_AVATARS[hash % PHOTO_AVATARS.length];
    }
    const idx = typeof indexFallback === 'number' && indexFallback >= 0 ? indexFallback : 0;
    return PHOTO_AVATARS[idx % PHOTO_AVATARS.length];
  }

  const api = { PHOTO_AVATARS, USER_TO_AVATAR, getAvatar };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.TikFinityAvatars = api;
})(typeof window !== 'undefined' ? window : globalThis);

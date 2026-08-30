/* ============================================================
   Shared helpers — Data Engineering Roadmap
   All progress lives in the browser's localStorage, so it
   persists across visits but is local to this browser/device.
   ============================================================ */

const ROADMAP_KEY = 'de-roadmap-progress'; // { [topicId]: true }  — one entry per topic (74 total)

/** Read a JSON object out of localStorage, or {} if missing/broken. */
function deReadStore(key){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}

/** Write a JSON object into localStorage. */
function deWriteStore(key, obj){
  try{ localStorage.setItem(key, JSON.stringify(obj)); }
  catch(e){ console.error('de-roadmap: could not save progress', e); }
}

/** The per-topic item-progress key, e.g. de-topic-git-items */
function deTopicItemsKey(topicId){
  return `de-topic-${topicId}-items`;
}

/**
 * Recompute whether a topic is fully done and update the
 * roadmap-level (main page) progress record accordingly.
 * total = how many items that topic has in total.
 */
function deSyncTopicToRoadmap(topicId, total){
  const items = deReadStore(deTopicItemsKey(topicId));
  const done = Object.values(items).filter(Boolean).length;
  const roadmap = deReadStore(ROADMAP_KEY);
  if(done === total && total > 0) roadmap[topicId] = true;
  else delete roadmap[topicId];
  deWriteStore(ROADMAP_KEY, roadmap);
  return { done, total };
}

/** Set the stroke-dashoffset of a progress ring (circumference 169.6, r=27). */
function deUpdateRing(circleEl, done, total){
  const circumference = 169.6;
  const ratio = total > 0 ? done / total : 0;
  circleEl.style.strokeDashoffset = circumference - ratio * circumference;
}

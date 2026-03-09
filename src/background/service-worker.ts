import { getWords } from '../utils/storage';

const ALARM_NAME = 'daily-review';

async function updateBadge() {
  try {
    const words = await getWords();
    const today = new Date().toISOString().split('T')[0];
    const dueCount = words.filter((w) => w.nextReview <= today).length;

    await chrome.action.setBadgeText({
      text: dueCount > 0 ? String(dueCount) : '',
    });
    await chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
  } catch {
    // Storage might not be available yet
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: 60,
    delayInMinutes: 1,
  });
  updateBadge();
});

chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    updateBadge();
  }
});

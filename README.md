# RememberMe Vocab

A Chrome extension for building your English vocabulary using **spaced repetition** (SM-2 algorithm). Add words you want to learn, and the extension surfaces a configurable number of words each day — prioritizing words you find difficult and spacing out the ones you know well.

## Features

- **Daily word suggestions** — configurable count (default: 10 words/day)
- **Spaced repetition (SM-2)** — rate each word as *Didn't know / Hard / Good / Easy*; the algorithm schedules the next review accordingly
- **Reveal on tap** — see the English word first, click to reveal definition, phonetics, example sentences, and synonyms (via free dictionary API)
- **Google Translate link** — one click to open the full translation page
- **Cross-device sync** — data stored in Chrome Sync Storage, synced automatically via your Google account (no server, no cost)
- **Badge count** — extension icon shows how many words are due for review

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite + CRXJS |
| Styling | Tailwind CSS v4 |
| Chrome APIs | `storage.sync`, `storage.local`, `alarms`, `action` |
| Dictionary | [Free Dictionary API](https://dictionaryapi.dev/) |
| Algorithm | SM-2 spaced repetition |

## Development

### Prerequisites

- Node.js 18+
- Google Chrome

### Setup

```bash
git clone https://github.com/MehrajShakil/RememberMe.Vocab.git
cd RememberMe.Vocab
npm install
```

### Build

```bash
npm run build
```

### Load as Chrome Extension

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `dist/` folder

### Development with hot reload

```bash
npm run dev
```

Then load the `dist/` folder as an unpacked extension. CRXJS handles live reloading.

## Project Structure

```
src/
├── types/index.ts            # TypeScript interfaces
├── utils/
│   ├── sm2.ts                # SM-2 spaced repetition algorithm (pure function)
│   ├── storage.ts            # Chrome sync storage CRUD helpers
│   ├── dictionary.ts         # Free Dictionary API fetch + local cache
│   └── daily.ts              # Daily word selection logic
├── hooks/
│   ├── useWords.ts           # Word CRUD React hook
│   ├── useSettings.ts        # Settings React hook
│   ├── useDailyWords.ts      # Today's review set hook
│   └── useDictionary.ts      # Definition fetch hook
├── background/
│   └── service-worker.ts     # Daily alarm + badge update
├── components/
│   ├── Layout.tsx            # App shell with bottom nav
│   ├── WordCard.tsx          # Word card with reveal + rating
│   ├── RatingButtons.tsx     # Didn't know / Hard / Good / Easy
│   ├── WordListItem.tsx      # Row in word list
│   └── EmptyState.tsx
└── pages/
    ├── DailyWordsPage.tsx    # Today's review (default view)
    ├── AddWordPage.tsx       # Add new word
    ├── WordListPage.tsx      # Browse / search / delete words
    └── SettingsPage.tsx      # Configure daily word count
```

## How the Algorithm Works

The **SM-2** algorithm schedules when you should next review each word:

| Your rating | Effect |
|---|---|
| Didn't know | Resets to day 1 |
| Hard | Short interval |
| Good | Normal interval growth |
| Easy | Longer interval |

Words you know well are shown less frequently. Words you struggle with come back sooner.

## Storage

All data is stored in `chrome.storage.sync` — synced across your Chrome browsers via your Google account. No server, no sign-up, completely free. Supports ~500 words within Chrome's 100 KB sync limit.

## License

MIT

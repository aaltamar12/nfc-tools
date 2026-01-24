# nfc-tools

Demonstrates the Web NFC API — scanning NDEF tags, writing structured records (URL, text, vCard, WiFi), and maintaining a scan history.

## Web APIs Used

| API | Chrome Android | Chrome Desktop | Firefox | Safari | Edge Android |
|-----|---------------|----------------|---------|--------|--------------|
| Web NFC | 89+ | ❌ | ❌ | ❌ | 89+ |
| NDEFReader | 89+ (Android) | ❌ | ❌ | ❌ | 89+ |

> Web NFC is only available on Chrome for Android. Use the NFC DevTools extension for desktop testing.

## How to Run

```bash
npm install
npm run dev   # http://localhost:3000
```

Requires an Android device with Chrome 89+ and an NFC-enabled tag.

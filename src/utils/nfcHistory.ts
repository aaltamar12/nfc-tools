export interface NfcHistoryEntry {
  id: string;
  scannedAt: string;
  lastSeenAt: string;
  scanCount: number;
  serialNumber?: string;
  recordType: string;
  rawPayload: string;
  parsedSummary: string;
}

const STORAGE_KEY = "nfc:scanHistory";
const DEFAULT_MAX_ENTRIES = 100;

function loadHistory(): NfcHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NfcHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: NfcHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    try {
      const trimmed = entries.slice(1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // ignore
    }
  }
}

function entryId(rawPayload: string): string {
  let hash = 5381;
  for (let i = 0; i < rawPayload.length; i++) {
    hash = (hash * 33) ^ rawPayload.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

export function addNfcScan(
  entry: Omit<NfcHistoryEntry, "id" | "scannedAt" | "lastSeenAt" | "scanCount">,
  maxEntries = DEFAULT_MAX_ENTRIES,
): NfcHistoryEntry[] {
  const history = loadHistory();
  const id = entryId(entry.rawPayload);
  const existing = history.find((e) => e.id === id);
  const now = new Date().toISOString();

  let updated: NfcHistoryEntry[];
  if (existing) {
    updated = history.map((e) =>
      e.id === id ? { ...e, lastSeenAt: now, scanCount: e.scanCount + 1 } : e,
    );
  } else {
    const newEntry: NfcHistoryEntry = { ...entry, id, scannedAt: now, lastSeenAt: now, scanCount: 1 };
    updated = [newEntry, ...history].slice(0, maxEntries);
  }

  saveHistory(updated);
  return updated;
}

export function clearNfcHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getNfcHistory(): NfcHistoryEntry[] {
  return loadHistory();
}

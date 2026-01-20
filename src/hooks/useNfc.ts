"use client";
import { useState, useCallback, useRef } from "react";

export interface NfcRecord {
  recordType: string;
  mediaType?: string;
  data: string;
  encoding?: string;
  id?: string;
}

export interface NfcScan {
  serialNumber: string;
  records: NfcRecord[];
  scannedAt: Date;
}

declare global {
  interface Window { NDEFReader?: new () => NDEFReaderInstance }
  interface NDEFReaderInstance {
    scan(opts?: { signal?: AbortSignal }): Promise<void>;
    write(message: NDEFMessageInit, opts?: { signal?: AbortSignal }): Promise<void>;
    addEventListener(type: "reading", handler: (event: NDEFReadingEvent) => void): void;
    addEventListener(type: "readingerror", handler: (event: Event) => void): void;
  }
  interface NDEFReadingEvent extends Event {
    serialNumber: string;
    message: { records: NDEFRecord[] };
  }
  interface NDEFRecord {
    recordType: string; mediaType?: string;
    data: ArrayBuffer; encoding?: string; id?: string;
  }
  interface NDEFMessageInit { records: NDEFRecordInit[] }
  interface NDEFRecordInit { recordType: string; data?: string | ArrayBuffer; mediaType?: string; encoding?: string }
}

export function useNfc() {
  const [isSupported] = useState(() => typeof window !== "undefined" && "NDEFReader" in window);
  const [scanning, setScanning] = useState(false);
  const [scans, setScans] = useState<NfcScan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const startScan = useCallback(async (onScan?: (scan: NfcScan) => void) => {
    if (!isSupported) { setError("NFC not supported"); return; }
    abortRef.current = new AbortController();
    try {
      const reader = new window.NDEFReader!();
      reader.addEventListener("reading", (event) => {
        const scan: NfcScan = {
          serialNumber: event.serialNumber,
          scannedAt: new Date(),
          records: event.message.records.map((r) => ({
            recordType: r.recordType,
            mediaType: r.mediaType,
            data: r.data.byteLength > 0 ? new TextDecoder(r.encoding ?? "utf-8").decode(r.data) : "",
            encoding: r.encoding,
            id: r.id,
          })),
        };
        setScans((prev) => [scan, ...prev.slice(0, 9)]);
        onScan?.(scan);
      });
      reader.addEventListener("readingerror", () => setError("NFC read error"));
      await reader.scan({ signal: abortRef.current.signal });
      setScanning(true);
      setError(null);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message);
    }
  }, [isSupported]);

  const stopScan = useCallback(() => {
    abortRef.current?.abort();
    setScanning(false);
  }, []);

  const write = useCallback(async (text: string) => {
    if (!isSupported) { setError("NFC not supported"); return; }
    const writer = new window.NDEFReader!();
    await writer.write({ records: [{ recordType: "text", data: text, encoding: "utf-8" }] });
  }, [isSupported]);

  return { isSupported, scanning, scans, error, startScan, stopScan, write };
}

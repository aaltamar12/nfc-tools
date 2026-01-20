"use client";
import { useNfc } from "@/hooks/useNfc";

export default function NfcScanner() {
  const { isSupported, scanning, scans, error, startScan, stopScan, write } = useNfc();

  if (!isSupported) return (
    <div className="p-4 bg-yellow-50 rounded text-yellow-700">
      Web NFC is only supported in Chrome on Android with HTTPS.
    </div>
  );

  return (
    <div className="max-w-sm mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">NFC Reader</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button onClick={() => startScan()} disabled={scanning} className="flex-1 bg-indigo-600 text-white py-2 rounded disabled:opacity-50">
          {scanning ? "Scanning…" : "Start Scan"}
        </button>
        <button onClick={stopScan} disabled={!scanning} className="flex-1 bg-gray-200 py-2 rounded disabled:opacity-50">Stop</button>
      </div>
      <button onClick={() => write("hello-treasury")} className="w-full border py-2 rounded text-sm">Write Tag</button>
      <ul className="space-y-2">
        {scans.map((scan, i) => (
          <li key={i} className="p-3 bg-gray-50 rounded text-sm">
            <p className="font-mono text-xs text-gray-400">{scan.serialNumber}</p>
            {scan.records.map((r, j) => <p key={j} className="mt-1">{r.recordType}: {r.data}</p>)}
          </li>
        ))}
      </ul>
    </div>
  );
}

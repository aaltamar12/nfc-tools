type NfcRecord = { recordType: string; data: string; mediaType?: string; lang?: string };

export const NFC_TEMPLATES = {
  url: (url: string): NfcRecord[] => [{ recordType: "url", data: url }],

  text: (text: string, lang = "en"): NfcRecord[] => [
    { recordType: "text", data: text, lang },
  ],

  vcard: (name: string, phone: string, email: string): NfcRecord[] => [
    {
      recordType: "mime",
      mediaType: "text/vcard",
      data: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`,
    },
  ],

  wifi: (ssid: string, password: string, auth = "WPA"): NfcRecord[] => [
    {
      recordType: "mime",
      mediaType: "application/vnd.wfa.wsc",
      data: `WIFI:T:${auth};S:${ssid};P:${password};;`,
    },
  ],
} as const;

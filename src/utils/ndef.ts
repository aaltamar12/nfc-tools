export function parseNdefRecords(records: NDEFRecord[]): Array<{ type: string; value: string }> {
  return records.map(r => {
    const decoder = new TextDecoder();
    try {
      return { type: r.recordType, value: decoder.decode(r.data ?? new ArrayBuffer(0)) };
    } catch {
      return { type: r.recordType, value: "[binary]" };
    }
  });
}
export function isWritableTag(message: NDEFMessage): boolean {
  return message.records.length > 0;
}

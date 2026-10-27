export const STORAGE_PREFIX = "promptlab-";
export const STORAGE_QUOTA_BYTES = 5 * 1024 * 1024; // typical browser limit (estimate)

export interface StorageUsage {
  bytes: number;
  keys: number;
  percent: number;
}

export function measureStorage(
  storage: Pick<Storage, "length" | "key" | "getItem">,
): StorageUsage {
  let bytes = 0;
  let keys = 0;
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    bytes += (key.length + (storage.getItem(key) ?? "").length) * 2; // UTF-16 = 2 bytes/char
    keys++;
  }
  return {
    bytes,
    keys,
    percent: Math.min(100, Math.round((bytes / STORAGE_QUOTA_BYTES) * 100)),
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

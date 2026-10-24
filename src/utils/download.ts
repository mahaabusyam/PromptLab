function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Plain-text download, e.g. a unified diff. */
export function downloadTextFile(filename: string, text: string): void {
  downloadFile(filename, text, 'text/plain;charset=utf-8');
}

/** Pretty-printed JSON download (backups, exports). */
export function downloadJson(data: unknown, filename: string): void {
  downloadFile(filename, JSON.stringify(data, null, 2), 'application/json');
}
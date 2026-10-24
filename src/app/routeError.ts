import { isRouteErrorResponse } from 'react-router-dom';

export function describeRouteError(error: unknown): { code: number | null; message: string } {
  if (isRouteErrorResponse(error)) return { code: error.status, message: error.statusText || 'Request failed' };
  if (error instanceof Error) return { code: null, message: error.message };
  return { code: null, message: 'Unknown error' };
}
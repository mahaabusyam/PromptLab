import { describe, expect, it } from 'vitest';
import { describeRouteError } from './routeError';

describe('describeRouteError', () => {
  it('reads route error responses', () => {
    const response = { status: 404, statusText: 'Not Found', internal: true, data: null };
    expect(describeRouteError(response)).toEqual({ code: 404, message: 'Not Found' });
  });

  it('reads plain errors', () => {
    expect(describeRouteError(new Error('boom'))).toEqual({ code: null, message: 'boom' });
  });

  it('handles anything else', () => {
    expect(describeRouteError('weird')).toEqual({ code: null, message: 'Unknown error' });
  });
});
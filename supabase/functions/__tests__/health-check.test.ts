import { handleRequest } from '../health-check/index';
import { describe, it, expect } from 'vitest';

describe('health-check', () => {
  it('returns ok', async () => {
    const res = await handleRequest();
    expect(res.status).toBe(200);
  });
});

import { ShortenIdPipe } from './shorten-id.pipe';

describe('ShortenIdPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenIdPipe();
    expect(pipe).toBeTruthy();
  });

  it('shorten UUIDs', () => {
    const pipe = new ShortenIdPipe();
    expect(pipe.transform('123e4567-e89b-12d3-a456-426614174000')).toBe('123e4567');
  });
});

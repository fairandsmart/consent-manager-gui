import { ShortIdPipe } from './short-id.pipe';

describe('ShortIdPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortIdPipe();
    expect(pipe).toBeTruthy();
  });

  it('shorten UUIDs', () => {
    const pipe = new ShortIdPipe();
    expect(pipe.transform('123e4567-e89b-12d3-a456-426614174000')).toBe('123e4567');
  });
});

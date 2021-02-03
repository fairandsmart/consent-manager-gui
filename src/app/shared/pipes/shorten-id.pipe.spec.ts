/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
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

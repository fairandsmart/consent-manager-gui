import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenId'
})
export class ShortenIdPipe implements PipeTransform {

  transform(uuid: string, ...args: unknown[]): unknown {
    return uuid.substr(0, 8);
  }

}

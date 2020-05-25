import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortId'
})
export class ShortIdPipe implements PipeTransform {

  transform(uuid: string, ...args: unknown[]): unknown {
    return uuid.substr(0, 8);
  }

}

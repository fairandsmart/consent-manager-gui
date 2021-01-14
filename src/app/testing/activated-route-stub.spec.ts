import { Observable, ReplaySubject } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, Data, ParamMap, Params, UrlSegment } from '@angular/router';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStubSpec {

  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private paramMapSubject = new ReplaySubject<ParamMap>();
  private queryParamMapSubject = new ReplaySubject<ParamMap>();
  private dataSubject = new ReplaySubject<Data>();
  private urlSubject = new ReplaySubject<UrlSegment[]>();

  /** The mock paramMap observable */
  readonly queryParamMap = this.queryParamMapSubject.asObservable();
  readonly data = this.dataSubject.asObservable();
  readonly snapshot: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  readonly parent: { url: Observable<UrlSegment[]> } = {url: this.urlSubject.asObservable()};

  constructor(initialValues: {params?: Params, queryParams?: Params, data?: Data, url?: UrlSegment[]} = {}) {
    this.setParamMap(initialValues.params);
    this.setQueryParamMap(initialValues.queryParams);
    this.setData(initialValues.data);
    this.setUrl(initialValues.url);
  }

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params): void {
    if (params) {
      this.paramMapSubject.next(convertToParamMap(params));
    }
    this.snapshot.params = params;
  }

  setQueryParamMap(params?: Params): void {
    if (params) {
      this.queryParamMapSubject.next(convertToParamMap(params));
    }
    this.snapshot.queryParams = params;
  }

  setData(data?: Data): void {
    if (data) {
      this.dataSubject.next(data);
    }
    this.snapshot.data = data;
  }

  setUrl(url?: UrlSegment[]): void {
    if (url) {
      this.urlSubject.next(url);
    }
    this.snapshot.url = url;
  }
}

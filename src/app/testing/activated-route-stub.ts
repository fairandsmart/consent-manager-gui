import { ReplaySubject } from 'rxjs';
import { ActivatedRouteSnapshot, convertToParamMap, Data, ParamMap, Params } from '@angular/router';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {

  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private paramMapSubject = new ReplaySubject<ParamMap>();
  private queryParamMapSubject = new ReplaySubject<ParamMap>();
  private dataSubject = new ReplaySubject<Data>();

  /** The mock paramMap observable */
  readonly paramMap = this.paramMapSubject.asObservable();
  readonly queryParamMap = this.queryParamMapSubject.asObservable();
  readonly data = this.dataSubject.asObservable();
  readonly snapshot: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

  constructor(initialValues: {params?: Params, queryParams?: Params, data?: Data} = {}) {
    this.setParamMap(initialValues.params);
    this.setQueryParamMap(initialValues.queryParams);
    this.setData(initialValues.data);
  }

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    if (params) {
      this.paramMapSubject.next(convertToParamMap(params));
    }
    this.snapshot.params = params;
  }

  setQueryParamMap(params?: Params) {
    if (params) {
      this.queryParamMapSubject.next(convertToParamMap(params));
    }
    this.snapshot.queryParams = params;
  }

  setData(data?: Data) {
    if (data) {
      this.dataSubject.next(data);
    }
    this.snapshot.data = data;
  }
}

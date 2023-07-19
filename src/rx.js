import {
  ReplaySubject,
  Subject,
  Observable,
  combineLatest,
  from,
  of,
  merge,
  empty,
} from "rxjs";
import {
  tap,
  first,
  map,
  scan,
  filter,
  switchMap,
  pluck,
  startWith,
  distinctUntilChanged,
  finalize,
  delay,
  share,
  shareReplay,
  refCount,
  publishReplay,
  debounceTime,
} from "rxjs/operators";

export const Rx = {
  ReplaySubject,
  Subject,
  combineLatest,
  Observable: { ...Observable, from, of, empty, merge },
  fromPromise: from,
};

function usePipe(fn) {
  return function (...args) {
    return this.pipe(fn(...args));
  };
}

global.Rx = Rx;

Observable.prototype.tap = usePipe(tap);
Observable.prototype.first = usePipe(first);
Observable.prototype.map = usePipe(map);
Observable.prototype.scan = usePipe(scan);
Observable.prototype.filter = usePipe(filter);
Observable.prototype.switchMap = usePipe(switchMap);
Observable.prototype.pluck = usePipe(pluck);
Observable.prototype.startWith = usePipe(startWith);
Observable.prototype.finalize = usePipe(finalize);
Observable.prototype.delay = usePipe(delay);
Observable.prototype.share = usePipe(share);
Observable.prototype.shareReplay = usePipe(shareReplay);
Observable.prototype.refCount = usePipe(refCount);
Observable.prototype.publishReplay = usePipe(publishReplay);
Observable.prototype.debounceTime = usePipe(debounceTime);
Observable.prototype.distinctUntilChanged = usePipe(distinctUntilChanged);

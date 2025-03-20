import { ReplaySubject, Subject, Observable, combineLatest, from, of, merge, empty } from 'rxjs'
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
} from 'rxjs/operators'

export const Rx = {
  ReplaySubject,
  Subject,
  combineLatest,
  Observable: { ...Observable, from, of, empty, merge },
  fromPromise: from,
}

function usePipe(fn) {
  return function (...args) {
    return this.pipe(fn(...args))
  }
}

global.Rx = Rx

Observable.prototype.tap = usePipe(tap)
Observable.prototype.first = usePipe(first)
Observable.prototype.map = usePipe(map)
Observable.prototype.scan = usePipe(scan)
Observable.prototype.filter = usePipe(filter)
Observable.prototype.switchMap = usePipe(switchMap)
Observable.prototype.pluck = usePipe(pluck)
Observable.prototype.startWith = usePipe(startWith)
Observable.prototype.finalize = usePipe(finalize)
Observable.prototype.delay = usePipe(delay)
Observable.prototype.share = usePipe(share)
Observable.prototype.shareReplay = usePipe(shareReplay)
Observable.prototype.refCount = usePipe(refCount)
Observable.prototype.publishReplay = usePipe(publishReplay)
Observable.prototype.debounceTime = usePipe(debounceTime)
Observable.prototype.distinctUntilChanged = usePipe(distinctUntilChanged)

global.rxComponent = (definition) => {
  return {
    ...definition,
    created() {
      this.$stream = (property) => {
        const stream = new Rx.ReplaySubject(1)
        stream.next(this[property])
        this.$watch(property, (newValue) => {
          console.log(property, 'set to', newValue)
          stream.next(newValue)
        })
        return stream
      }
      const subscriptions = definition.subscriptions.call(this)
      this._subscriptions = Object.keys(subscriptions).map((key) => {
        this[key] = undefined
        return subscriptions[key].subscribe((value) => {
          this[key] = value
        })
      })
      definition.created?.call(this)
    },
    beforeUnmount() {
      console.log('TODO! must clean them up!')
      console.log(this._subscriptions)
    },
  }
}

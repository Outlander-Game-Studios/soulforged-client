import { Rx } from "./rx.js";

const SOME_DATA = "some data";
const SOME_OTHER_DATA = { b: 5 };

describe("RxJS", function () {
  it("Replay subject works as expected", function () {
    const subject = new Rx.ReplaySubject(1);
    const sub1Handler = jest.fn();
    const sub1 = subject.subscribe(sub1Handler);

    subject.next(SOME_DATA);

    const sub2Handler = jest.fn();
    subject.subscribe(sub2Handler);

    expect(sub1Handler).toHaveBeenCalledTimes(1);
    expect(sub1Handler).toHaveBeenCalledWith(SOME_DATA);
    expect(sub2Handler).toHaveBeenCalledTimes(1);
    expect(sub2Handler).toHaveBeenCalledWith(SOME_DATA);

    sub1.unsubscribe();

    subject.next(SOME_OTHER_DATA);

    expect(sub1Handler).toHaveBeenCalledTimes(1);
    expect(sub2Handler).toHaveBeenCalledTimes(2);
    expect(sub2Handler).toHaveBeenCalledWith(SOME_OTHER_DATA);
  });

  it("detects unsubscribe", function () {
    const subject = new Rx.ReplaySubject(1);
    const unsubHandler = jest.fn();
    const subHandler = jest.fn();
    const subWatchHandler = jest.fn();

    const subjectWithWatch = subject.finalize(unsubHandler);
    const sub = subject.subscribe(subHandler);
    const subWatch = subjectWithWatch.subscribe(subWatchHandler);

    sub.unsubscribe();

    expect(unsubHandler).toHaveBeenCalledTimes(0);

    subWatch.unsubscribe();

    expect(unsubHandler).toHaveBeenCalledTimes(1);
  });

  it("detects final unsubscribe", function () {
    const subject = new Rx.ReplaySubject(1);
    const unsubHandler = jest.fn();
    const subWatch1Handler = jest.fn();
    const subWatch2Handler = jest.fn();
    const subWatch3Handler = jest.fn();

    const subjectWithWatch = subject
      .finalize(unsubHandler)
      .publishReplay(1)
      .refCount();

    const subWatch1 = subjectWithWatch.subscribe(subWatch1Handler);
    subject.next(SOME_DATA);
    const subWatch2 = subjectWithWatch.subscribe(subWatch2Handler);

    expect(subWatch1Handler).toHaveBeenCalledTimes(1);
    expect(subWatch1Handler).toHaveBeenCalledWith(SOME_DATA);
    expect(subWatch2Handler).toHaveBeenCalledTimes(1);
    expect(subWatch2Handler).toHaveBeenCalledWith(SOME_DATA);
    expect(subject.observers.length).toEqual(1);

    subWatch1.unsubscribe();

    expect(unsubHandler).toHaveBeenCalledTimes(0);
    expect(subject.observers.length).toEqual(1);

    subWatch2.unsubscribe();

    expect(unsubHandler).toHaveBeenCalledTimes(1);
    expect(subject.observers.length).toEqual(0);
  });
});

class Subject {
  next() {}
}

class ReplaySubject {
  next() {}
}

const Rx = { Subject, ReplaySubject }
global.Rx = Rx

export { Rx }

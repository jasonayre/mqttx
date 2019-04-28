export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function afterDuration(duration=1000, callback=()=> {}) {
  sleep(duration).then(() => {
    callback();
  });
}

function waitUntilPromiseResolves({max_attempts=5, resolve, reject, interval, condition, onInterval, returnValue=() => { return true}}) {
  afterDuration(interval, () => {
    if(condition()) {
      resolve(returnValue());
    } else {
      onInterval();
      max_attempts--;
      if(max_attempts < 1) { reject('max_attempts_threshold_reached') }
      waitUntilPromiseResolves({condition, interval, onInterval, resolve, returnValue});
    }
  })
}

export function waitUntilCondition({
  condition=() => { return true },
  interval=100,
  max_attempts=5,
  onInterval =() => {},
  returnValue=() => { return true }
}={}) {
  return new Promise((resolve, reject) => {
    waitUntilPromiseResolves({resolve, condition, interval, max_attempts, onInterval, returnValue, reject});
  });
}

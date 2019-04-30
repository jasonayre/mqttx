// import {assign, invokeMap, some} from 'lodash';
import assign from 'lodash/assign';
import invokeMap from 'lodash/invokeMap';
import some from 'lodash/some';
import {Serialization} from './serialization';

export class Subscription {
  static matchesTopic(source_topic, other_topic) { return source_topic === other_topic }

  constructor({perform, topic, is_one_time=false, observable, onBeforeDispose=[]}={}) {
    assign(this, {_perform: perform, topic, is_one_time, observable, is_disposed: false, _onBeforeDisposeCallbacks: onBeforeDispose});
  }

  matchesTopic(topic) {
    return this.constructor.matchesTopic(topic, this.topic);
  }

  perform(message, topic, packet)  {
    if(this.matchesTopic(topic)) {
      this._perform(Serialization.parse(message), topic, packet, this);
      if(this.is_one_time) { this.dispose() }
    }
  }

  dispose() {
    if(some(this._onBeforeDisposeCallbacks)) {
      invokeMap(this._onBeforeDisposeCallbacks, 'call');
    }

    if(this.observable) {
      this.observable.unsubscribe(this);
      this.observable = null;
    }

    this.is_disposed = true;
  }
}

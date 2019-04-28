import {assign, invokeMap, some} from 'lodash';
// import {waitUntilCondition} from './helpers';
// import mqtt from 'mqttjs';

function topicMatches(source_topic, other_topic) {
  return source_topic === other_topic;
}

function parseRawMessage(data) {
  return JSON.parse(data.toString());
}

class Subscription {
  constructor({perform, topic, is_one_time=false, observable, onBeforeDispose=[]}={}) {
    assign(this, {_perform: perform, topic, is_one_time, observable, _onBeforeDisposeCallbacks: onBeforeDispose});
  }

  matchesTopic(topic) {
    return topicMatches(topic, this.topic);
  }

  perform(topic, message, packet)  {
    if(this.matchesTopic(topic)) {
      this._perform(_topic, parseRawMessage(message), packet, this);
    }
  }

  dispose() {
    if(some(this._onBeforeDisposeCallbacks)) {
      invokeMap(this._onBeforeDisposeCallbacks, 'call');
    }

    if(this.observable) {
      this.observable.unsubscribe(this);
    }

    this.observable = null;
    this.scope = null;
  }
}

export class SubscriptionManager {
  constructor(mqttx) {
    this.registry = {};
    this.subscriptions = [];
    this.mqttx = mqttx;
    console.log('initializing main sub');
    this._initializeMainSubscription();
  }

  _initializeMainSubscription() {
    this.mqttx.client.on('message', (topic, message, packet) => {
      this.notifySubscriptions(topic, message, packet);
    })
  }

  subscribe(topic, callback=() => { }, {is_one_time=false, onBeforeDispose}={}) {
    let subscription = new Subscription({
      perform: callback,
      topic,
      is_one_time,
      observable: this,
      onBeforeDispose,
    })

    this.subscriptions.push(subscription);
  }

  unsubscribe(_subscription) {
    this.mqttx.client.unsubscribe(_subscription.topic);
    this.subscriptions = this.subscriptions.filter(subscription => subscription !== _subscription);
  }

  //the global callback when a message arrives, and main reason for this library
  notifySubscriptions(topic, message, packet) {
    let subscriptions = [...this.subscriptions];
    invokeMap(subscriptions, 'perform', topic, message, packet);
  }
}

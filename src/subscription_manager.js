import invokeMap from 'lodash/invokeMap';
import {Subscription} from './subscription';

export class SubscriptionManager {
  constructor(mqttx, client) {
    this.subscriptions = [];
    this.mqttx = mqttx;
    this.client = client;
    this._initializeMainSubscription();
  }

  _initializeMainSubscription() {
    this.mqttx.client.on('message', (topic, message, packet) => {
      this.notifySubscriptions(message, topic, packet);
    })
  }

  on(topic, callback=(msg) => { console.log(msg) }, {connection=this, ...options}={}) {
    return this.mqttx.on(topic, callback, {connection, ...options});
  }

  // publish(...args) {
  //   return this.client.publish(...args);
  // }

  publish(topic, data, {connection=this, ...options}={}) {
    return this.mqttx.publish(topic, data, {connection, ...options});
  }

  subscribe(topic, callback=() => { }, {is_one_time=false, onBeforeDispose}={}) {
    let subscription = new Subscription({
      perform: callback,
      topic,
      is_one_time,
      observable: this,
      onBeforeDispose
    });

    this.subscriptions.push(subscription);
    return subscription;
  }

  unsubscribe(_subscription) {
    this.mqttx.client.unsubscribe(_subscription.topic);
    this.subscriptions = this.subscriptions.filter(subscription => subscription !== _subscription);
  }

  //the global callback when a message arrives, and main reason for this library
  notifySubscriptions(message, topic, packet) {
    let subscriptions = [...this.subscriptions];
    invokeMap(subscriptions, 'perform', message, topic, packet);
  }

  clear() {
    let subscriptions = [...this.subscriptions];
    invokeMap(subscriptions, 'dispose');
  }
}

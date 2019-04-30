import get from 'lodash/get';
import mqtt from 'mqtt';
import {SubscriptionManager} from './subscription_manager';
import {waitUntilCondition} from './helpers';
import {Serialization} from './serialization';

if((typeof process !== 'undefined') && (get(process, 'release.name') === 'node')) {
  require('mqtt');
  console.log("after requiring mqtt");
} else {

}

export class MQTTX {
  static connect(...args) {
    this.mqtt = mqtt;
    this.client = mqtt.connect(...args);
    this.subscription_manager = new SubscriptionManager(this);
  }

  static on(topic, callback=(msg) => { console.log(msg) }, {qos=1, retain=false, ...options}={}) {
    let subscription = this.subscription_manager.subscribe(topic, callback, {...options});
    this.client.subscribe(topic, callback, {qos, ...options});
    return subscription;
  }

  static publish(topic, data, {as_json=true, qos=1, ...options}={}) {
    if(as_json) {
      this.client.publish(topic, Serialization.serialize(data), {qos, ...options});
    } else {
      this.client.publish(topic, Serialization.serialize(data), {qos, ...options});
    }
  }

  //for basic rpc like functionality, note I don't condone using this, although I have
  // the need to do so in a project of mine. Basically only use if absolutely necessary
  // and ONLY if the topic is completely unique.
  // and make sure the server calls response method before request method here
  static async request(topic, data={}, {publish_params={}, qos=1, retain=false, interval=50, max_attempts=5, is_one_time=true, ...options}={}) {
    let response_topic = `${topic}/response`;
    let request_topic = `${topic}/request`;
    let response;
    const _callback = (message) => {
      response = message;
      return response;
    }

    let subscription = this.on(response_topic, _callback, {qos, retain, is_one_time, ...options});
    this.publish(request_topic, data, {...publish_params});
    let response_data = await waitUntilCondition({condition: () => { return subscription.is_disposed }, returnValue: () => { return response }});
    return response_data;
  }

  static async respondsTo(topic, callback=() => {}, {publish_params={}, qos=1, retain=false, interval=50, max_attempts=5, ...options}={}) {
    let response_topic = `${topic}/response`;
    let request_topic = `${topic}/request`;
    let response;

    const callbackAndPublish = (message) => {
      let response = callback(message);
      this.publish(response_topic, response, publish_params);
    }

    return this.on(request_topic, callbackAndPublish, {qos, retain, ...options});
  }

  static clear() {
    this.subscription_manager.clear();
  }
}

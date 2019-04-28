import {assign, get} from 'lodash';
import mqtt from 'mqtt';
// import {waitUntilCondition} from './helpers';


import {SubscriptionManager} from './subscription_manager';

if((typeof process !== 'undefined') && (get(process, 'release.name') === 'node')) {
  require('mqtt');
  console.log("after requiring mqtt");
} else {

}


export class MQTTX {
  static connect(...args) {
    this.mqtt = mqtt;
    console.log("CALLING CONNECT");
    // this.mqtt = mqtt;
    this.client = mqtt.connect(...args);
    // console.log("BOUNT TO INIT SUBSCRIPTION MANAGER");
    this.subscription_manager = new SubscriptionManager(this);
  }

  static on(topic, callback=(msg) => { console.log(msg) }, {qos=1, ...options}={}) {
    console.log("calling on");
    this.subscription_manager.subscribe(topic, callback);
    this.client.subscribe(topic, callback, {qos, ...options});
  }

  static subscribe(...args) {
    this.subscription_manager.subscribe(...args);
  }
}

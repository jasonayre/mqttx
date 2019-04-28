### A more RabbitMQ like, Multiplexed, MQTT javascript implementation

This library wraps mqttjs, and adds syntactic/operability sugar on top of it, and multiplexes the topic subscriptions so each topic can be called with specific behavior. The main issue it solves is the following use case, which is a very common use case in topic based messaging so I was surprised to find out that MQTT doesn't seem to support it.

### Take the following use case, which caused me to create this library.

``` javascript
mqtt_client.subscribe(`match/inspect/${id}`, { qos: 1, retain: false }, function() {
  mqtt_client.on('message', function(topic, message, packet) {
    if(topic === `match/inspect/${id}`) {
      handleInspectRequest(message.toString());
    }
  })
});

mqtt_client.subscribe(`match/sync/${id}`, { qos: 1, retain: false }, function() {
  mqtt_client.on('message', function(topic, message, packet) {
    if(topic === `match/sync/${id}`) {
      handleSyncRequest(message.toString());
    }
  })
});
```

With MQTTX however, you can do:

## MQTTX Equivalent
``` javascript
MQTTX.on(`match/inspect/${id}`, (message, topic) => {
  handleInspectRequest(message);
});

MQTTX.on(`match/sync/${id}`, (message, topic) => {
  handleSyncRequest(message);
});
```

Note, ATM, doesn't support wildcard routing as it's not something I am using, however it wouldn't be hard to add.

### Connection / MQTT Client
Connect will proxy a connection over to the underlying MQTT library, so all the options which apply there apply here as well. Just call `MQTTX.connect(params)`

You can access the connection afterwards at `MQTTX.client`

### Subscriptions

When you call .on(), it isn't just proxying over to MQTT, it wraps everything in a subscription object, which you can later dispose. Disposing the subscription will clean everything up and unsubscribe from the topic. You can pass MQTT params in the third param, i.e.

``` javascript
let subscription = MQTTX.on(`match/inspect/${id}`, (message, topic) => {
  handleInspectRequest(message);
}, {qos: 0});

subscription.dispose();
```

Also note, if you haven't already, the callback function param order is changed slightly, as you generally dont really need to care about the topic in context of the callback any longer, so args passed into each callback are (note the additional 4th arg as well, subscription, which you can use to dispose after a message arrives, etc)

``` javascript
let subscription = MQTTX.on(`match/inspect/${id}`, (message, topic, packet, subscription) => {
  handleInspectRequest(message);
}, {qos: 0});
```

### Serialization
Also note, I'm auto parsing the messages as JSON when publishing and subscribing, if you need to change this behavior, I've exported serialization as a class with static class methods, so you should be able to override it easily, i.e.

``` javascript
import {Serialization} from 'mqttx';
Serialization.serialize = (message) => { return JSON.stringify(message) }
Serialization.parse = (message) => { return JSON.parse(message) }
//or whatever, ^ is the actual method implementation
```

### One Time Subscriptions

You can also have one time subscriptions, which will auto unsubscribe when a message comes through.

``` javascript
MQTTX.on(`match/inspect/${id}`, (message, topic, packet, subscription) => {
  handleInspectRequest(message);
}, {is_one_time: true});
```

### RPC Style Communication
For basic RPC like functionality, note I don't condone using this, although I have the need to do so in a project of mine. Basically only use if absolutely necessary.

Also, ONLY use this if you are mapping a unique topic

On the server, you'd do something like:
``` javascript
MQTTX.respondsTo(`match/events/${id}`, (request) => { return {id: request.id, blah: 'blah'} }, options)
```

On the client:
``` javascript
let response = await MQTTX.request(`match/events/${id}`, {id: 123}, {qos: 1});
```

Basically, I'm making it communicate by appending /request and /response on the client and server to the routing keys.

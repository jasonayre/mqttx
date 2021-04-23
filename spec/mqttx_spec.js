require('../src/index');

import {MQTTX, Helpers} from '../src/index';
const {sleep} = Helpers;

MQTTX.connect("wss://test.mosquitto.org:8081");

describe('MQTTX', function() {
  let subject, conditions, result, expected_message;

  beforeAll(async () => {
    await sleep(500);
  })

  afterEach(() => {
    MQTTX.clear();
  })

  describe('connect', function(){
    it('proxies over to mqtt', async function(){
      let response;
      expected_message = {one: 'two'};

      MQTTX.on("mqttx/some/fake/topic/one", (message, topic) => {
        response = message;
      })

      expect(MQTTX.connection.subscriptions.length).toEqual(1);

      await sleep(300);
      MQTTX.client.publish("mqttx/some/fake/topic/one", JSON.stringify(expected_message));
      await sleep(300);
      MQTTX.clear();
      expect(MQTTX.connection.subscriptions.length).toEqual(0);
      expect(response).toEqual(expected_message);
    })
  })

  describe('multiple_topics', function(){
    it('handles callbacks individually', async function(){
      let response, second_response;
      expected_message = {one: 'two'};

      MQTTX.on("mqttx/multiple_topics/fake/topic/one", (message, topic) => {
        response = message;
      })

      MQTTX.on("mqttx/multiple_topics/fake/topic/two", (message, topic) => {
        second_response = message;
      })

      await sleep(300);
      MQTTX.client.publish("mqttx/multiple_topics/fake/topic/one", JSON.stringify(expected_message))
      await sleep(300);

      expect(response).toEqual(expected_message);
      expect(second_response).toEqual(undefined);
    })
  })

  describe('one_time_subscription', function(){
    it('disposes after called first time', async function() {
      let response, second_response;
      expected_message = {one: 'two'};

      let subscription = MQTTX.on("mqttx/one_time_subscription/fake/topic/one", (message, topic) => {
        response = message;
      }, {is_one_time: true});

      expect(subscription.is_one_time).toEqual(true);

      expect(subscription.observable).not.toEqual(undefined);

      await sleep(300);
      MQTTX.client.publish("mqttx/one_time_subscription/fake/topic/one", JSON.stringify(expected_message));
      await sleep(300);

      expect(response).toEqual(expected_message);
      await sleep(300);
      let second_message = {two: 'three'};
      MQTTX.client.publish("mqttx/one_time_subscription/fake/topic/one", JSON.stringify(second_message));
      expect(response).toEqual(expected_message);
      expect(subscription.observable).toEqual(null);
    })
  })

  describe('request and response', function(){
    it('makes request/response', async function() {
      let response,
          topic='mqttx/user/123/events',
          expected_message = {event_type: 'FakeResponse'},
          fake_request_data = {id: 13};

      let server_response_subscription = MQTTX.respondsTo(topic, (request) => { return {id: request.id, ...expected_message} }, {})
      await sleep(300);
      let fake_response_data = await MQTTX.request(topic, fake_request_data);
      await sleep(300);
      expect(fake_response_data.id).toEqual(13);
      expect(fake_response_data.event_type).toEqual('FakeResponse');
    })
  })
});

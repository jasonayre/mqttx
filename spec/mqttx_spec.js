require('../src/index');

import {MQTTX} from '../src/index';

MQTTX.connect("wss://test.mosquitto.org:8081");

describe('MQTTX', function() {
  let subject, conditions, result;

  beforeAll(() => {
  })

  describe('connect', function(){
    it('proxies over to mqtt', function(){
      MQTTX.on("some/fake/topic/one", (topic, message) => {
        expect(1).toEqual(1);
      })

      expect(true).toEqual(false);
    })
  })
});

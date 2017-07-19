const assert = require('assert');
const app = require('../../src/app');

describe('\'crawlers\' service', () => {
  it('registered the service', () => {
    const service = app.service('crawlers');

    assert.ok(service, 'Registered the service');
  });
});

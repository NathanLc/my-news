const assert = require('assert');
const sanitizeCreateCategory = require('../../src/hooks/sanitize-create-category');

describe('\'sanitize-create-category\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = sanitizeCreateCategory();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});

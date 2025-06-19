import { click, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | dynamic tabs', function (hooks) {
  setupApplicationTest(hooks);

  test('aria-multiselectable=false and role=tablist is added when non-empty', async function (assert) {
    await visit('/dynamic-tabs');
    assert
      .dom('#dynamic-tablist')
      .doesNotHaveAria('multiselectable')
      .hasAttribute('role', 'presentation');

    await click('[data-test-add-item]');

    assert
      .dom('#dynamic-tablist')
      .hasAria('multiselectable', 'false')
      .hasAttribute('role', 'tablist');

    await click('[data-test-selector="tab-1"] .close');

    assert
      .dom('#dynamic-tablist')
      .doesNotHaveAria('multiselectable')
      .hasAttribute('role', 'presentation');
  });

  test('the first tab added should be selected', async function (assert) {
    await visit('/dynamic-tabs');
    await click('[data-test-add-item]');

    assert.dom('[data-test-selector="tab-1"]').hasClass('active');
  });

  test('the first tab should remain selected when additional tabs are added', async function (assert) {
    await visit('/dynamic-tabs');
    await click('[data-test-add-item]');
    await click('[data-test-add-item]');

    assert.dom('[data-test-selector="tab-1"]').hasClass('active');
  });

  test('the next tab should become selected when the first tab is active and is removed', async function (assert) {
    await visit('/dynamic-tabs');
    await click('[data-test-add-item]');
    await click('[data-test-add-item]');
    await click('[data-test-selector="tab-1"]');
    await click('[data-test-selector="tab-1"] .close');

    assert.dom('[data-test-selector="tab-2"]').hasClass('active');
  });

  test('the previous tab should become selected when the active tab is removed', async function (assert) {
    await visit('/dynamic-tabs');
    await click('[data-test-add-item]');
    await click('[data-test-add-item]');
    await click('[data-test-selector="tab-2"]');

    assert.dom('[data-test-selector="tab-2"]').hasClass('active');

    await click('[data-test-selector="tab-2"] .close');

    assert.dom('[data-test-selector="tab-1"]').hasClass('active');
  });

  test('removing all tabs should not prevent additional tabs from being added', async function (assert) {
    await visit('/dynamic-tabs');
    await click('[data-test-add-item]');
    await click('[data-test-selector="tab-1"] .close');
    await click('[data-test-add-item]');

    assert.dom('[data-test-selector="tab-2"]').hasClass('active');
  });
});

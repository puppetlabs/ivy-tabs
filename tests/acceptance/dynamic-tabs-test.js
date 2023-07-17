import { click, find, visit } from '@ember/test-helpers';
import { findButtonByText, findTab } from '../helpers/finders';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | dynamic tabs', function (hooks) {
  setupApplicationTest(hooks);

  test('aria-multiselectable=false and role=tablist is added when non-empty', async function (assert) {
    await visit('/dynamic-tabs');

    const tablist = find('#dynamic-tablist');
    assert.strictEqual(tablist.getAttribute('aria-multiselectable'), null);
    assert.strictEqual(tablist.getAttribute('role'), 'presentation');

    await click(findButtonByText('Add an Item'));

    assert.strictEqual(tablist.getAttribute('aria-multiselectable'), 'false');
    assert.strictEqual(tablist.getAttribute('role'), 'tablist');

    await click(findTab('Item 1').querySelector('.close'));

    assert.strictEqual(tablist.getAttribute('aria-multiselectable'), null);
    assert.strictEqual(tablist.getAttribute('role'), 'presentation');
  });

  test('the first tab added should be selected', async function (assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));

    assert.dom(findTab('Item 1')).hasClass('active');
  });

  test('the first tab should remain selected when additional tabs are added', async function (assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findButtonByText('Add an Item'));

    assert.dom(findTab('Item 1')).hasClass('active');
  });

  test('the next tab should become selected when the first tab is active and is removed', async function (assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findButtonByText('Add an Item'));
    await click(findTab('Item 1'));
    await click(findTab('Item 1').querySelector('.close'));

    assert.dom(findTab('Item 2')).hasClass('active');
  });

  test('the previous tab should become selected when the active tab is removed', async function (assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findButtonByText('Add an Item'));
    await click(findTab('Item 2'));

    assert.dom(findTab('Item 2')).hasClass('active');

    await click(findTab('Item 2').querySelector('.close'));

    assert.dom(findTab('Item 1')).hasClass('active');
  });

  test('removing all tabs should not prevent additional tabs from being added', async function (assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findTab('Item 1').querySelector('.close'));
    await click(findButtonByText('Add an Item'));

    assert.dom(findTab('Item 2')).hasClass('active');
  });
});

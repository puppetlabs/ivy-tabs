import { click, visit } from '@ember/test-helpers';
import { findButtonByText, findTab } from '../helpers/finders';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | dynamic tabs', function(hooks) {
  setupApplicationTest(hooks);

  test('the first tab added should be selected', async function(assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));

    assert.ok(findTab('Item 1').classList.contains('active'));
  });

  test('the first tab should remain selected when additional tabs are added', async function(assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findButtonByText('Add an Item'));

    assert.ok(findTab('Item 1').classList.contains('active'));
  });

  test('the next tab should become selected when the first tab is active and is removed', async function(assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findButtonByText('Add an Item'));
    await click(findTab('Item 1'));
    await click(findTab('Item 1').querySelector('.close'));

    assert.ok(findTab('Item 2').classList.contains('active'));
  });

  test('the previous tab should become selected when the active tab is removed', async function(assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findButtonByText('Add an Item'));
    await click(findTab('Item 2'));

    assert.ok(findTab('Item 2').classList.contains('active'));

    await click(findTab('Item 2').querySelector('.close'));

    assert.ok(findTab('Item 1').classList.contains('active'));
  });

  test('removing all tabs should not prevent additional tabs from being added', async function(assert) {
    await visit('/dynamic-tabs');
    await click(findButtonByText('Add an Item'));
    await click(findTab('Item 1').querySelector('.close'));
    await click(findButtonByText('Add an Item'));

    assert.ok(findTab('Item 2').classList.contains('active'));
  });
});

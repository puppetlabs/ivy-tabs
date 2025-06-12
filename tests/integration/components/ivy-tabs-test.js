import hbs from 'htmlbars-inline-precompile';
import { A } from '@ember/array';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render } from '@ember/test-helpers';

module('ivy-tabs', function (hooks) {
  setupRenderingTest(hooks);

  const eachTemplate = hbs`
    <IvyTabs @selection={{this.selection}} as |tabs|>
      <tabs.tablist as |tablist|>
        {{#each this.items as |item|}}
          <tablist.tab @model={{item}} @onSelect={{this.updateSelection}}>{{item}}</tablist.tab>
        {{/each}}
      </tabs.tablist>
      {{#each this.items as |item|}}
        <tabs.tabpanel item>{{item}}</tabs.tabpanel>
      {{/each}}
    </IvyTabs>
  `;

  test('selects previous tab if active tab is removed', async function (assert) {
    this.set('updateSelection', (item) => {
      this.set('selection', item);
    });
    this.set('selection', 'Item 2');
    this.set('items', ['Item 1', 'Item 2']);
    await render(eachTemplate);

    await Promise.resolve().then(() => {
      this.set('items', ['Item 1']);
    });

    assert.strictEqual(this.selection, 'Item 1', 'previous tab became active');
  });

  test('selects previous tab if active tab is removed via replacement', async function (assert) {
    this.set('updateSelection', (item) => {
      this.set('selection', item);
    });
    this.set('selection', 'Item 2');
    this.set('items', ['Item 1', 'Item 2']);
    await render(eachTemplate);

    this.set('items', ['Item 3']);

    assert.strictEqual(this.selection, 'Item 3', 'previous tab became active');
  });

  test('retains tab selection if preceeding tab is removed', async function (assert) {
    this.set('updateSelection', (item) => {
      this.set('selection', item);
    });
    this.set('selection', 'Item 2');
    this.set('items', A(['Item 1', 'Item 2']));
    await render(eachTemplate);

    this.items.setObjects(['Item 2']);

    assert.strictEqual(this.selection, 'Item 2', 'tab selection is retained');
  });

  test('selects the next tab when an active, first tab is removed', async function (assert) {
    this.set('updateSelection', (item) => {
      this.set('selection', item);
    });
    this.set('selection', 'Item 1');
    this.set('items', ['Item 1', 'Item 2', 'Item 3']);
    await render(eachTemplate);

    this.set('items', ['Item 2', 'Item 3']);

    assert.strictEqual(this.selection, 'Item 2', 'selects next tab');
  });

  test('does not select tabs while being destroyed', async function (assert) {
    let selectionCount = 0;

    this.set('selectionAction', (selection) => {
      this.set('selection', selection);
      selectionCount++;
    });

    this.set('items', ['Item 1', 'Item 2', 'Item 3']);
    await render(hbs`
      {{#unless this.hideComponent}}
        <IvyTabs @selection={{this.selection}} as |tabs|>
          <tabs.tablist as |tablist|>
            {{#each this.items as |item|}}
              <tablist.tab @model={{item}} @onSelect={{this.selectionAction}}>{{item}}</tablist.tab>
            {{/each}}
          </tabs.tablist>
          {{#each this.items as |item|}}
            <tabs.tabpanel @model={{item}}>{{item}}</tabs.tabpanel>
          {{/each}}
        </IvyTabs>
      {{/unless}}
    `);

    assert.strictEqual(
      selectionCount,
      1,
      'Triggers initial, automatic on-select during setup',
    );

    // Force a destruction of the component.
    this.set('hideComponent', true);

    assert.strictEqual(
      selectionCount,
      1,
      'Does not trigger on-select during destroy',
    );
  });
});

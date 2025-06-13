import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class TrackedEntry {
  @tracked entries = [];
  insertItem(item) {
    this.entries = this.entries.concat(item);
  }
  removeItem(item) {
    this.entries = this.entries.filter((model) => model !== item);
  }
  removeItems(items) {
    this.entries = this.entries.filter((model) => !items.includes(model));
  }
}

export default class DynamicTabsRoute extends Route {
  entryHolder = new TrackedEntry();
  model() {
    return this.entryHolder;
  }

  @action
  insertItemIntoModel(item) {
    this.entryHolder.insertItem(item);
  }

  @action
  removeItemFromModel(items) {
    this.entryHolder.removeItem(items);
  }

  @action
  removeItemsFromModel(items) {
    this.entryHolder.removeItems(items);
  }
}

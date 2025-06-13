import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

class ModelObject {
  @tracked checked = false;
  @tracked index;
  constructor(index) {
    this.index = index;
  }
}

export default class DynamicTabsController extends Controller {
  @action
  addItem() {
    this.send('insertItemIntoModel', new ModelObject(++this.nextIndex));
  }

  @action
  removeItem(item) {
    this.send('removeItemFromModel', item);
  }

  @action
  removeSelected() {
    this.send('removeItemsFromModel', this.checkedItems);
  }

  @action
  updateDynamicSelection(item) {
    if (this.selection !== item) {
      this.selection = item;
    }
  }

  get checkedItems() {
    return this.model.entries.filter((item) => item.checked);
  }

  @tracked
  nextIndex = 0;

  get noCheckedItems() {
    return this.checkedItems.length === 0;
  }

  @tracked
  selection = null;

  @action
  toggleItemCheckedState(item) {
    item.checked = !item.checked;
  }
}

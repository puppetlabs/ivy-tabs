import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class QueryParamsController extends Controller {
  get queryParams() {
    return ['selection'];
  }

  @tracked selection;

  @action
  updateSelection(newValue) {
    this.selection = newValue;
  }
}

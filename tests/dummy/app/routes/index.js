import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;
  redirect() {
    // Redirect to the first tab if no query param is set
    this.router.transitionTo('simple');
  }
}

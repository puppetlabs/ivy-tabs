import Route from '@ember/routing/route';

export default class QueryParamsRoute extends Route {
  queryParams = {
    selection: {
      as: 'tab',

      // There's no sense polluting the browser history every time someone
      // changes tabs, so we'll instruct Ember to use `replaceState` instead of
      // `pushState` when this property changes.
      replace: true,
    },
  };
}

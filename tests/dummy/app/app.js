import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'dummy/config/environment';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  Resolver = Resolver;
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
}

loadInitializers(App, config.modulePrefix);

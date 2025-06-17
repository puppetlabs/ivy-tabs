import Component from '@glimmer/component';
import { isNone } from '@ember/utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { runTask } from 'ember-lifeline';

export const DOWN_ARROW = 40;
export const LEFT_ARROW = 37;
export const RIGHT_ARROW = 39;
export const UP_ARROW = 38;

/**
 * @module ivy-tabs
 */

let instanceCount = 0;

/**
 * @class IvyTabListComponent
 * @namespace IvyTabs
 * @extends Ember.Component
 */
export default class IvyTabsTabListComponent extends Component {
  registerWithTabsContainer = modifier(() => {
    this.args.tabsContainer.registerTabList(this);
    return () => {
      this.args.tabsContainer.unregisterTabList(this);
    };
  });

  /**
   * Tells screenreaders that only one tab can be selected at a time.
   *
   * @property aria-multiselectable
   * @type String
   * @default 'false'
   */
  get isMultiSelectable() {
    if (!this.isEmpty) {
      return 'false';
    }
    return undefined;
  }

  /**
   * The `role` attribute of the tab list element.
   *
   * See http://www.w3.org/TR/wai-aria/roles#tablist
   *
   * @property ariaRole
   * @type String
   * @default 'tablist'
   */
  get ariaRole() {
    if (!this.isEmpty) {
      return 'tablist';
    } else {
      // FIXME: Ember 3.1.0-beta.1 introduced a bug which does not bind/watch
      // ariaRole changes if it's initially falsy. This sets a non-falsy,
      // "safe" value for ariaRole until it can be a "tablist" when Tabs are
      // added.
      return 'presentation';
    }
  }

  /**
   * Gives focus to the selected tab.
   *
   * @method focusSelectedTab
   */
  @action
  focusSelectedTab() {
    if (!this.isDestroyed && !this.isDestroying) {
      this.selectedTab.focus();
    }
  }

  constructor() {
    super(...arguments);
    this.internalId = `ivy-tabs-list-${instanceCount++}`;
  }

  get isEmpty() {
    return this.tabs.length === 0;
  }

  /**
   * Event handler for navigating tabs via arrow keys. The left (or up) arrow
   * selects the previous tab, while the right (or down) arrow selects the next
   * tab.
   *
   * @method keyDown
   * @param {Event} event
   */
  @action
  keyDown(event) {
    switch (event.keyCode) {
      case LEFT_ARROW:
      case UP_ARROW:
        this.selectPreviousTab();
        break;
      case RIGHT_ARROW:
      case DOWN_ARROW:
        this.selectNextTab();
        break;
      default:
        return;
    }

    event.preventDefault();
    runTask(this, this.focusSelectedTab);
  }

  /**
   * Adds a tab to the `tabs` array.
   *
   * @method registerTab
   * @param {IvyTabs.IvyTabComponent} tab
   */
  @action
  registerTab(tab) {
    this.tabs = this.tabs.concat(tab);
    // run this later so that all the tabs are registered before we try to select one
    runTask(this, () => {
      // if none of the tabs are selected, try to select one
      let selected = this.tabs.find((tab) => tab.isSelected);
      if (!selected && this.tabs.length > 0) {
        this.selectTab();
      }
    });
  }

  /**
   * Selects the next tab in the list, if any.
   *
   * @method selectNextTab
   */
  @action
  selectNextTab() {
    const selectedTab = this.selectedTab;
    const tabs = this.tabs;
    const length = tabs.length;

    let idx = selectedTab.index;
    let tab;

    do {
      idx++;
      // Next from the last tab should select the first tab.
      if (idx === length) {
        idx = 0;
      }

      tab = tabs[idx];
    } while (tab && tab.isDestroying && tab !== selectedTab);

    if (tab) {
      tab.select();
    }
  }

  /**
   * Selects the previous tab in the list, if any.
   *
   * @method selectPreviousTab
   */
  @action
  selectPreviousTab() {
    const selectedTab = this.selectedTab;
    const tabs = this.tabs;
    const length = tabs.length;

    let idx = selectedTab.index;
    let tab;

    do {
      idx--;
      // Previous from the first tab should select the last tab.
      if (idx < 0) {
        idx = length - 1;
      }
      // This would only happen if there are no tabs, so stay at 0.
      if (idx < 0) {
        idx = 0;
      }

      tab = tabs[idx];
    } while (tab && tab.isDestroying && tab !== selectedTab);

    if (tab) {
      tab.select();
    }
  }

  get selection() {
    return this.args.tabsContainer.selection;
  }

  get elementId() {
    return this.args.id || this.internalId;
  }

  get effectiveAriaLabel() {
    return this.args['aria-label'];
  }

  @action
  selectTab() {
    const selection = this.selection;
    if (isNone(selection)) {
      this.selectTabByIndex(0);
    } else {
      this.selectTabByModel(selection);
    }
  }

  /**
   * Select the tab at `index`.
   *
   * @method selectTabByIndex
   * @param {Number} index
   */
  selectTabByIndex(index) {
    const tab = this.tabs[index];

    if (tab) {
      tab.select();
    }
  }

  selectTabByModel(model) {
    const tab = this.tabs.find((element) => element.model === model);

    if (tab) {
      tab.select();
    } else {
      this.selectTabByIndex(0);
    }
  }

  /**
   * The currently-selected `ivy-tabs-tab` instance.
   *
   * @property selectedTab
   * @type IvyTabs.IvyTabComponent
   */
  get selectedTab() {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].model === this.selection) {
        return this.tabs[i];
      }
    }
    return null;
  }

  @tracked tabs = [];

  /**
   * Removes a tab from the `tabs` array.
   *
   * @method unregisterTab
   * @param {IvyTabs.IvyTabComponent} tab
   */
  unregisterTab(tab) {
    const index = tab.index;
    if (tab.isSelected && !this.isDestroying && !this.isDestroyed) {
      if (index === 0) {
        this.selectNextTab();
      } else {
        this.selectPreviousTab();
      }
    }

    this.tabs = this.tabs.filter((element) => {
      return element !== tab;
    });
  }

  isRegistered(tab) {
    return this.tabs.includes(tab);
  }
}

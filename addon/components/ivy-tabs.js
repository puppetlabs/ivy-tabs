import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
/**
 * @module ivy-tabs
 */

/**
 * @class IvyTabsComponent
 * @namespace IvyTabs
 * @extends glimmer Component
 */
export default class IvyTabsTabsComponent extends Component {
  @tracked tabList = null;
  /**
   * Registers the `ivy-tabs-tablist` instance.
   *
   * @method registerTabList
   * @param {IvyTabs.IvyTabListComponent} tabList
   */
  @action
  registerTabList(tabList) {
    this.tabList = tabList;
  }

  /**
   * Adds a panel to the `tabPanels` array.
   *
   * @method registerTabPanel
   * @param {IvyTabs.IvyTabPanelComponent} tabPanel
   */
  @action
  registerTabPanel(tabPanel) {
    this.tabPanels = this.tabPanels.concat(tabPanel);
  }

  @tracked tabPanels = [];

  get selection() {
    return this.args.selection;
  }

  /**
   * Removes the `ivy-tabs-tablist` component.
   *
   * @method unregisterTabList
   * @param {IvyTabs.IvyTabListComponent} tabList
   */
  @action
  unregisterTabList(/* tabList */) {
    this.tabList = null;
  }

  /**
   * Removes a panel from the `tabPanels` array.
   *
   * @method unregisterTabPanel
   * @param {IvyTabs.IvyTabPanelComponent} tabPanel
   */
  @action
  unregisterTabPanel(tabPanel) {
    this.tabPanels = this.tabPanels.filter((element) => {
      return element !== tabPanel;
    });
  }
}

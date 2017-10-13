'use strict';

import base from './base.js';

export default class extends base {
  /**
   * homepage
   * @return {} []
   */
  indexAction(){
    return this.display();
  }
  /**
   * about page
   * @return {} []
   */
  aboutAction(){
    this.assign('currentNav', 'about');
    this.assign('title', this.locale('title-about'));
    return this.display();
  }
  /**
   * event
   * @return {}
   */
  eventAction(){
    this.assign('currentNav', 'event');
    this.assign('title', this.locale('title-event'));
    return this.display();
  }
  /**
   * birthday
   * @return {}
   */
  birthdayAction(){
    this.assign('currentNav', 'birthday');
    this.assign('title', this.locale('title-birthday'));
    return this.display();
  }
  /**
   * discovery
   * @return {}
   */
  discoveryAction(){
    this.assign('currentNav', 'discovery');
    this.assign('title', this.locale('title-discovery'));
    return this.display();
  }
}
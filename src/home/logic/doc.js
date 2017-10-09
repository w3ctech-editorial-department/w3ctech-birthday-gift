export default class extends think.logic.base {

  constructor(...args) {
    super(...args);
    if(this.http.lang() === 'en') {
      this.version = "string|in:1.2,2.0,2.1,2.2,3.0|default:2.0";
    } else {
      this.version = "string|in:1.2,2.0,2.1,2.2,3.0|default:3.0";
    }
  }

  /**
   * doc logic
   * @return {} []
   */
  indexAction(){
    this.rules = {
      version: this.version
    }
  }
  /**
   * search action
   * @return {} []
   */
  searchAction(){
    this.rules = {
      version: this.version,
      keyword: 'required'
    }
  }
  /**
   * single document
   * @return {} []
   */
  singleAction(){
    this.rules = {
      version: this.version,
    }
  }
}
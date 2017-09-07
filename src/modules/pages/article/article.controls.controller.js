////////////////
// CONTROLLER //
////////////////

class ArticleControlsController {

  /*@ngInject*/
  constructor($scope, $location, $anchorScroll, Api, PagesService) {
    this.$location = $location;
    this.$anchorScroll = $anchorScroll;
    this.Api = Api;
    this.PagesService = PagesService;

    this.types = _.filter($scope.pages.pagesTypes, 'isArticle');
    this._initControls();
  }

  _initControls() {
    this.fetchWriters();
  }

  /////////////
  // ANCHORS //
  /////////////

  goToAnchor($e, anchor) {
    $e.preventDefault();

    var newHash = anchor;
    if (this.$location.hash() !== newHash) {
      // set the $location.hash to `newHash` and
      // $anchorScroll will automatically scroll to it
      this.$location.hash(anchor);
    }
    else {
      // call $anchorScroll() explicitly,
      // since $location.hash hasn't changed
      this.$anchorScroll();
    }
  }


  /////////////
  // WRITERS //
  /////////////

  writersLoaded() {
    return this.writers && this.writers.length;
  }

  // Get or set writer select value
  getSetWriter(writer) {
    // set with a valid writer
    if (arguments.length) {
      this.PagesService.setWriter(writer);
    }
    // get or invalid witer
    else {}

    return this.PagesService.getWriter();
  }

  // Fetch remote list of writers
  fetchWriters() {
    this.Api.get('/auteurs/')
      .then((success) => {
        this.writers = success.data;
        return;
      });
  }

}


////////////
// EXPORT //
////////////

export default ArticleControlsController;
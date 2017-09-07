////////////////
// CONTROLLER //
////////////////

class ArticleController {

  /*@ngInject*/
  constructor($scope, $state, $stateParams, PagesService, ModalService) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.PagesService = PagesService;
    this.ModalService = ModalService;

    this.editorConfig = {
      insertPlugin: {
        // verbatim: false
      }
      // type: 'components'
    };

    this.stickyControls = true;

    this._initArticle();
  }

  _initArticle() {
    const id = _.getInteger(this.$stateParams.id);

    // new article
    if (_.isUndefined(id)) {
      this.PagesService.initPage();
    }
    // fetch article
    else {
      const populate = ['article'];

      this.PagesService.fetchPage(id, populate);
    }
  }


  // SAVE

  save(status) {
    console.log('SAVE')

    const pagesScope = this.$scope.pages;

    pagesScope.setLoadingEvent(status);

    let saveData = _.clone(pagesScope.data);

    if (_.isUndefined(saveData.type)) {
      this.toastr.error("Type de l'article manquant.");
      pagesScope.abortEvent(status);
      return;
    }

    // status
    if (!_.isUndefined(status)) {
      saveData.status = status;
    }

    // api entry
    let apiEntry = '/pages/createArticle';
    if (!_.isUndefined(saveData.id)) {
      apiEntry = '/pages/updateArticle/' + saveData.id;
    }

    // populate
    saveData.populate = ['article'];

    this.PagesService.updatePage(apiEntry, saveData).then(
      (success) => {
        console.log('SAVED', success)

        if (!pagesScope.isCreated()) {
          this.$state.go('article', { id: success.data.id }, { reload: true });
          return;
        }

        pagesScope.data = success.data;

        pagesScope.setDoneEvent(status);
      },
      (error) => {
        pagesScope.abortEvent(status);
      }
    );
  }

  archive() {
    console.log('ARCHIVE')

    const pagesScope = this.$scope.pages;

    this.ModalService.confirm({
      text: "<p>L'archivage de cet article le dépubliera complètement.</p><p>As-tu conscience des conséquences ?</p>"
    })
    .result.then((success) => {
      this.save(pagesScope.STATUS.archived);
    });
  }

  delete() {
    console.log('DELETE')

    const pagesScope = this.$scope.pages;

    this.ModalService.confirm({
      text: "<p>La suppression de ce brouillon le retirera du BO.</p><p>Fais pas l'con Johnny !</p>"
    })
    .result.then((success) => {
      pagesScope.events.deleting = true;

      this.Api
        .get('/pages/destroyArticle/' + pagesScope.data.id)
        .then((success) => {
          this.$state.go('dashboard');
        });
    });
  }

}


////////////
// EXPORT //
////////////

export default ArticleController;
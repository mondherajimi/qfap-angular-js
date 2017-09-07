////////////////
// CONTROLLER //
////////////////

class PagesController {

  /*@ngInject*/
  constructor($scope, PagesService, pagesStatus, pagesTypes) {
    this.$scope = $scope;
    this.pagesTypes = pagesTypes;

    this.events = {
      // saving: false,
      // saved: false,
      // publishing: false,
      // published: false
      // archiving: false
      // archived: false
    };

    this.STATUS = _.reduce(pagesStatus, (result, value, key) => {
      result[value.slug] = value.id;
      return result;
    }, {});

    this.data = {};
    // watch page data from PagesService
    $scope.$watch(() => { return PagesService.page; }, (page) => {
      this.data = page;
    });
  }


  // PARSE

  cpntEditorParse(structure, anchors) {
    this.data.components = structure;
    this.data.anchors = anchors;

    this.$scope.$digest();
  }


  // STATUS

  isCreated() {
    return this.data && !_.isNil(this.data.id);
  }

  isDraft() {
    return this.data &&
           (this.data.status === this.STATUS.draft) &&
           (_.isNil(this.data.publishedAt));
  }

  isPublished() {
    return this.data && (this.data.status === this.STATUS.published);
  }

  isArchived() {
    return this.data && (this.data.status === this.STATUS.archived);
  }


  // EVENTS

  setLoadingEvent(status) {
    this.events.saving = _.isUndefined(status);
    this.events.publishing = (status === this.STATUS.published);
    this.events.archiving = (status === this.STATUS.archived);
  }

  setDoneEvent(status) {
    if (_.isUndefined(status)) {
      this.events.saving = false;
      this.events.saved = true;
    }
    else if (status === this.STATUS.published) {
      this.events.publishing = false;
      this.events.published = true;
    }
    else if (status === this.STATUS.archived) {
      this.events.archiving = false;
      this.events.archived = true;
    }
  }

  abortEvent(status) {
    if (_.isUndefined(status)) {
      this.events.saving = false;
    }
    else if (status === this.STATUS.published) {
      this.events.publishing = false;
    }
    else if (status === this.STATUS.archived) {
      this.events.archiving = false;
    }
  }

  clearEvent() {
    this.events = {};
  }
}


////////////
// EXPORT //
////////////

export default PagesController;
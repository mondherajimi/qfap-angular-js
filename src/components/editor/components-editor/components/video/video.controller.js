////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/video/&prefix=component/!html!./video.html';

// load constant
import { VIDEO_EMBED } from './video.constant.js';


////////////////
// CONTROLLER //
////////////////

class VideoComponentController {

  /*@ngInject*/
  constructor($http, $log, $scope, $uibModalInstance, ModalService, params) {
    this.$http = $http;
    this.$log = $log;
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.ModalService = ModalService;

    this.type = 'video';
    this.jsonTpl = {
      title: '',
      url: '',
      block: '',
      cookie: false
    };

    this.events = {
      loading: false,
      errorMsg: false
    };

    this.init(params);
  }

  // Initialize component
  init(params) {
    this.$cpnt = params.$element;
    this.data = params.structure ? _.clone(params.structure.data) : this.jsonTpl;
    this.showDelete = !!params.structure;
  }


  //////////////////
  // MANAGE EMBED //
  //////////////////

  // Return data object with parsed iframe
  parseIframe(html, title) {
    let data = this.jsonTpl;
    data.title = title || '';
    data.url = this.data.url || '';

    if (html.includes("<iframe")) {
      let $iframe = angular.element(html);
      $iframe = $iframe[0].tagName ===  'IFRAME' ? $iframe.eq(0) : $iframe.find('iframe').eq(0);
      $iframe.removeAttr('height');
      $iframe.removeAttr('width');
      $iframe.attr('title', data.title);

      data.block = $iframe[0].outerHTML;
    }

    return data;
  }

  // Fetch embed from url
  fetchEmbed(url) {

    const vendor = _.find(VIDEO_EMBED, (vendor) => {
      return _.find(vendor.re, (re) => {
        return re.test(url);
      });
    });

    if (_.isUndefined(vendor)) {
      this.events.errorMsg = "Ce format d'url n'est pas reconnu.";
      return;
    }

    const params = angular.extend({}, vendor.config.params);
    params.url = url;

    this.events.loading = true;

    this.$http({
      method: vendor.config.method,
      cache: false,
      url: vendor.config.url,
      responseType: 'json',
      params: params
    })
    .then(
      (success) => {
        this.events.loading = false;

        if (!_.has(success, 'data') && !_.has(success.data, 'html')) {
          this.events.errorMsg = "Les informations relatives à cette url sont erronées.";
          return;
        }

        const title = this.data.title || success.data.title;
        this.data = this.parseIframe(success.data.html, title);
      },
      (error) => {
        this.$log.error(error);
        this.events.loading = false;
        this.events.errorMsg = "Les informations relatives à cette url sont erronées.";
      }
    );
  }

  // Get or set title input value
  getSetTitle(title) {
    // set with a valid title
    if (arguments.length) {
      this.data.title = title;
      this.data = this.parseIframe(this.data.block, title);
    }
    // get or invalid title
    else {}

    return this.data.title;
  }

  // Get or set url input value
  getSetURL(url) {
    // set with a valid url
    if (arguments.length) {
      this.events.errorMsg = false;

      this.data.url = url;
      this.fetchEmbed(url);
    }
    // get or invalid url
    else {}

    return this.data.url;
  }


  //////////////////////
  // MANAGE COMPONENT //
  //////////////////////

  // Update or insert component
  update() {
    const updateData = {
      $element: this.$cpnt
    };

    // update
    if (this.showDelete) {
      updateData.method = 'update';
      updateData.structure = this.data;
    }
    // insert
    else {
      updateData.method = 'create';
      updateData.structure = {
        type: this.type,
        data: this.data
      };
    }

    this.$uibModalInstance.close(updateData);
  }

  // Delete component
  delete() {
    this.ModalService.confirm({
      text: 'Êtes-vous sûr de vouloir supprimer ce composant ?'
    })
    .result.then(
      (success) => {
        this.$uibModalInstance.close({
          method: 'destroy',
          $element: this.$cpnt
        });
      },
      (error) => { }
    );
  }

}


////////////
// EXPORT //
////////////

export default VideoComponentController;

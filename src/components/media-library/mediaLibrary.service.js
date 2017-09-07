
import mediaLibraryTemplate from './mediaLibrary.html';

//////////////
// SERVICES //
//////////////

class MediaLibraryService {

  /*@ngInject*/
  constructor($uibModal,StaticData) {
    this.$uibModal = $uibModal;
  }

 

  getMedia(options) {

    let _modalInstance = this.$uibModal.open({
      template: mediaLibraryTemplate,
      controller: 'MediaLibraryController',
      controllerAs: 'mediaLib',
      windowClass: 'MediaLibraryModal',
      backdropClass: 'MediaLibraryBackdrop',
      size: 'lg',
      resolve: {
        options: function() { return options || {}; },

      }
    });

    return _modalInstance.result;
  }


}

////////////
// EXPORT //
////////////

export default MediaLibraryService;

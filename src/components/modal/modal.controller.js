////////////////
// CONTROLLER //
////////////////

class ModalController {

  /*@ngInject*/
  constructor($uibModalInstance, params) {
    this.$uibModalInstance = $uibModalInstance;
    this.params = params;
  }

  close(result) {
    this.$uibModalInstance.close(result);
  }

  dismiss(result) {
    this.$uibModalInstance.dismiss(result);
  }

}


////////////
// EXPORT //
////////////

export default ModalController;

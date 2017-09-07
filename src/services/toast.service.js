
//////////////
// SERVICES //
//////////////

class ToastService {

  /*@ngInject*/
  constructor($mdToast) {
    this.$mdToast = $mdToast;
  }

  serverError(errorMessage) {
    // The toastController gets an instance of toastService,
    // so the error message is exposed via the message property
    // and the controller provides it to the toast.html view
    this.message = errorMessage;

    this.$mdToast.show(
      this.$mdToast.simple()
        .textContent(errorMessage)
        .position('top right')
        .hideDelay(3000)
    );
  }
}


////////////
// EXPORT //
////////////

export default ToastService;

////////////
// CONFIG //
////////////

/*@ngInject*/
function appConfig($locationProvider, $urlRouterProvider, $httpProvider, toastrConfig) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $httpProvider.useLegacyPromiseExtensions = false;

  angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,
    newestOnTop: false,
    positionClass: 'toast-bottom-right',
    preventDuplicates: false,
    preventOpenDuplicates: true,
    target: 'body',

    // customization
    allowHtml: false,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    extendedTimeOut: 1000,
    iconClasses: {
      success: 'qfap-toast-success',
      info: 'qfap-toast-info',
      warning: 'qfap-toast-warning',
      error: 'qfap-toast-error'
    },
    messageClass: 'toast-message',
    onHidden: null,
    onShown: null,
    onTap: null,
    progressBar: false,
    tapToDismiss: true,
    templates: {
      toast: 'directives/toast/toast.html',
      progressbar: 'directives/progressbar/progressbar.html'
    },
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  });

  // Moment init
  // Use current timezone instead of UTC
  Moment().local();
  // Use fr locale (for day of week and months)
  Moment.locale('fr');
}


////////////
// EXPORT //
////////////

export default appConfig;
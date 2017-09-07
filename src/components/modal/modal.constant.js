export const MODAL_CONFIG = {
  // Set to false to disable animations on new modal/backdrop.
  // Does not toggle animations for modals/backdrops that are already displayed.
  // (Type: boolean, Default: true)
  // animation: true,

  // Appends the modal to a specific element.
  // (Type: angular.element, Default: body: Example: $document.find('aside').eq(0))
  // appendTo: 'body',

  // Controls presence of a backdrop.
  // Allowed values: true (default), false (no backdrop), 'static' (disables modal closing by click on the backdrop).
  // (Type: boolean|string, Default: true)
  backdrop: 'static',

  // Additional CSS class(es) to be added to a modal backdrop template.
  // (Type: string)
  // backdropClass: '',

  // When used with controllerAs & set to true, it will bind the $scope properties onto the controller.
  // (Type: boolean, Default: false)
  // bindToController: false,

  // A controller for the modal instance, either a controller name as a string,
  // or an inline controller function, optionally wrapped in array notation for dependency injection.
  // Allows the controller-as syntax. Has a special $uibModalInstance injectable to access the modal instance.
  // (Type: function|string|array, Example: MyModalController)
  controller: 'ModalController',

  // An alternative to the controller-as syntax.
  // Requires the controller option to be provided as well.
  // (Type: string, Example: ctrl)
  controllerAs: 'modal',

  // Indicates whether the dialog should be closable by hitting the ESC key.
  // (Type: boolean, Default: true)
  // keyboard: true,

  // Class added to the body element when the modal is opened.
  // (Type: string, Default: modal-open)
  // openedClass: 'modal-open',

  // Members that will be resolved and passed to the controller as locals;
  // it is equivalent of the resolve property in the router.
  // (Type: Object)
  // resolve: {},

  // The parent scope instance to be used for the modal's content.
  // Defaults to $rootScope.
  // (Type: $scope)
  // scope: $rootscope,

  // Optional suffix of modal window class.
  // The value used is appended to the modal- class, i.e. a value of sm gives modal-sm.
  // (Type: string, Example: lg)
  // size: 'md',

  // Inline template representing the modal's content.
  // (Type: string)
  // template: '',

  // A path to a template representing modal's content.
  // You need either a template or templateUrl.
  // (Type: string)
  // templateUrl: '',

  // Additional CSS class(es) to be added to a modal window template.
  // (Type: string)
  // windowClass: '',

  // A path to a template overriding modal's window template.
  // (Type: string, Default: uib/template/modal/window.html)
  // windowTemplateUrl: 'uib/template/modal/window.html',

  // CSS class(es) to be added to the top modal window.
  // (Type: string)
  // windowTopClass: ''
};

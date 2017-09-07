////////////
// IMPORT //
////////////

// load template in templateCache
import '!ngtemplate?relativeTo=/src/components/editor/components-editor/components/html/&prefix=component/!html!./html.html';




////////////////
// CONTROLLER //
////////////////

class HtmlComponentController {

  /*@ngInject*/
  constructor($http, $log, $scope, $uibModalInstance, ModalService, params) {
    this.$http = $http;
    this.$log = $log;
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.ModalService = ModalService;

    this.type = 'html';
    this.jsonTpl = {
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
    this.data = params.structure ? params.structure.data : this.jsonTpl;
    this.showDelete = !!params.structure;
  }


  //////////////////
  // MANAGE EMBED //
  //////////////////




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

export default HtmlComponentController;

/*angular.module('htmlComponent', [])

.controller('HtmlCtrl',
['$rootScope', '$scope', '$interpolate', '$element', 'structure',
function($rootScope, $scope, $interpolate, $element, structure) {
  var jsonTpl = {
    "block": "",
    "cookie": false
  };

  var $cpnt = $element;
  $scope.data = undefined;
  $scope.showDelete = false;

  var setData = function(data) {
    $scope.data = angular.copy(data);

    if (!$scope.data.cookie) {
      $scope.data.cookie = false;
    }
  };

  // update
  if (structure) {
    $scope.showDelete = true;
    $scope.$evalAsync(setData(structure.data));
  }
  else {
    $scope.showDelete = false;
    $scope.$evalAsync(setData(jsonTpl));
  }

  //////////////////////
  // MANAGE COMPONENT //
  //////////////////////

  $scope.update = function() {

    // update
    if ($scope.showDelete) {
      $scope.$close({
        type: 'update',
        $element: $cpnt,
        structure: $scope.data
      });
    }
    // insert
    else {
      $scope.$close({
        type: 'create',
        $element: $cpnt,
        structure: {
          type: 'html',
          data: $scope.data
        }
      });
    }
  };

  $scope.delete = function() {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce composant ?')) {
      $scope.$close({
        type: 'destroy',
        $element: $cpnt
      });
    }
  };

}]);
*/

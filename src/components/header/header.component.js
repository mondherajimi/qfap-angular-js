////////////
// IMPORT //
////////////

import logo from './logo.svg';

// import './header.scss';
import headerTemplate from './header.html';


////////////////
// CONTROLLER //
////////////////

class HeaderController {

  /*@ngInject*/
  constructor($rootScope, $scope, $state, AUTH_EVENTS, USER_ACCESS, Api, UserService, MediaLibraryService) {
    this.$rootScope = $rootScope;
    this.AUTH_EVENTS = AUTH_EVENTS;
    this.USER_ACCESS = USER_ACCESS;
    this.currentUser = UserService;
    this.MediaLibrary = MediaLibraryService;

    // collapse menu
    this.navCollapsed = true;
    $scope.$on('$stateChangeSuccess', () => { this.navCollapsed = true; });

    this.logo = logo;
    this.helpLink = "http://filer.paris.fr/quefaire/uploads/files/Mode%20d%27emploi%20des%20internautes.pdf";
	
 
$scope.visible=false;
$scope.affichage=function(){
if ($scope.visible==false){
$scope.visible=true;
}
else{
$scope.visible=false;
}
}

  }

  openMediaLib(_event, _target) {
    this.MediaLibrary.getMedia({canInsert:false});
  }

  logout() {
    this.$rootScope.$broadcast(this.AUTH_EVENTS.logoutSuccess);
  }
}


////////////
// EXPORT //
////////////

export default {
  template: headerTemplate,
  controller: HeaderController,
  controllerAs: 'header'
};
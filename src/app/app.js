'use strict';

////////////
// IMPORT //
////////////

// dependencies
import angular from 'angular';
import 'angularFr';
import ngAria from 'ngAria';
import ngSanitize from 'ngSanitize';
import ngAnimate from 'ngAnimate';
import uiRouter from 'uiRouter';
//import angularSortableView from 'angularSortableView';
import toastr from 'toastr';
import 'boostrapShowErrors';
import 'angular-sortable-view';

// app
import appConfig from './app.config';
import appRun from './app.run';
import AppComponent from './app.component';
// import './app.scss';

// TODO - split it into modules and components
import '../assets/stylesheets/main.scss';

// services, directives, filters, components & modules
import services from '../services/services';
import directives from '../directives/directives';
import filters from '../filters/filters';
import modules from '../modules/modules';
import components from '../components/components';


/////////////
// MODULES //
/////////////

let envModule = angular.module('qfap.env', []);

let app = angular.module('qfap', [
    envModule.name,
    ngAria,
    ngSanitize,
    ngAnimate,
    'angular-sortable-view',
    uiRouter,
    'ui.bootstrap.showErrors',
    toastr,

    services,
    directives,
    filters,
    components,
    modules
  ])
  .config(appConfig)
  .run(appRun)
  .component('app', AppComponent)
  .name;


///////////////
// BOOTSTRAP //
///////////////

{
  let injector = angular.injector(['ng']);
  let $window = injector.get('$window');

  // TODO : try to retrieve environment from server
  // let $http = injector.get('$http');
  // $http
  //   .get('/config/local.json')
  //   .then(function success(response) {
  //     init(response.data);
  //   },
  //   function error(err) {
  //     console.log(err)
  //   });

  // environment is stored on qfapBO global
  envModule.constant('ENV', $window.qfapBO.env);

  angular.element(document).ready(function() {
    angular.bootstrap(document.body, [app], { strictDi: true });
  });
}


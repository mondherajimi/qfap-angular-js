////////////
// IMPORT //
////////////

import articleTemplate from './article/article.html';
import recordTemplate from './record/record.html';

import fichesTemplate from './fiches/fiches.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function pagesConfig($stateProvider, $urlRouterProvider, USER_ACCESS) {

  $urlRouterProvider.when('/article', '/article/');
  $urlRouterProvider.when('/fiche', '/fiche/');

  $stateProvider
    .state('pages', {
      abstract: true,
      controller: 'PagesController',
      controllerAs: 'pages',
      template: '<div class="pages-wrapper" ui-view></div>',
      resolve: {
        pagesStatus: function(StaticData) {
          return StaticData.getPagesStatus();
        },
        pagesTypes: function(StaticData) {
          return StaticData.getPagesTypes();
        }
      },
    })
    // article: selection/parisian/guide/actu/game
    .state('article', {
      url: "/article/:id",
      parent: 'pages',
      controller: 'ArticleController',
      controllerAs: 'article',
      template: articleTemplate,
      data: {
        access: USER_ACCESS.redactor
      }
    })
    // record: event/activity/program
    .state('record', {
      url: "/fiche/:id?type",
      parent: 'pages',
      controller: 'RecordController',
      controllerAs: 'record',
      template: recordTemplate,
      data: {
        access: USER_ACCESS.all
      }
    })
    // fiche: event/activity/program
    .state('fiches', {
      url: '/fiches?{type:int}',
      controller: 'FichesController',
      controllerAs: 'fiches',
      template: fichesTemplate,
      //parent: 'pages',
      resolve: {
        pagesTypes: function(StaticData) {
          return StaticData.getPagesTypes();
        },
        categories:function(StaticData){
          return StaticData.getCategories();
        },
        tags:function(StaticData){
          return StaticData.getTags();
        },
        infobulles:function(StaticData){
          return StaticData.getInfobulles();
        },
        messages:function(StaticData){
          return StaticData.getMessages();
        },
        pagesStatus: function(StaticData) {
          return StaticData.getPagesStatus();
        }
      },
      data: {
        access: USER_ACCESS.all
      }
    })
    // évènement/activité/programme
    .state('fiches.edit', {
      url: "/edit/:id",
      controller: 'FichesController',
      controllerAs: 'fiches',
      //parent: 'pages',
      template: fichesTemplate,
      resolve: {
        pagesTypes: function(StaticData) {
          return StaticData.getPagesTypes();
        },
        categories:function(StaticData){
          return StaticData.getCategories();
        },
        tags:function(StaticData){
          return StaticData.getTags();
        },
        infobulles:function(StaticData){
          return StaticData.getInfobulles();
        },
        pagesStatus: function(StaticData) {
          return StaticData.getPagesStatus();
        }
      },
      data: {
        access: USER_ACCESS.all
      }
    });
}


////////////
// EXPORT //
////////////

export default pagesConfig;

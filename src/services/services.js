////////////
// IMPORT //
////////////

import ngCookies from 'ngCookies';
import ngStorage from 'ngStorage';

import servicesConfig from './services.config';

import LodashProvider from './lodash.provider';
import ApiProvider from './api.provider';
import HttpInterceptorsService from './httpInterceptors.service';
import StaticDataService from './staticData.service';
// import ToastService from './toast.service';
import AuthService, { AUTH_EVENTS, USER_ACCESS } from './auth.service';
import UserService from './user.service';
import StyleguideService from './styleguide.service';


////////////
// EXPORT //
////////////

export default angular.module('qfap.services', [
    'qfap.env',
    ngCookies,
    ngStorage.name,
  ])
  .config(servicesConfig)
  .provider('_', LodashProvider)
  .provider('Api', ApiProvider)
  .service('HttpInterceptors', HttpInterceptorsService)
  .service('StaticData', StaticDataService)
  // .service('Toast', ToastService)
  .constant('AUTH_EVENTS', AUTH_EVENTS)
  .constant('USER_ACCESS', USER_ACCESS)
  .service('AuthService', AuthService)
  .service('UserService', UserService)
  .service('StyleguideService', StyleguideService)
  .name;
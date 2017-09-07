class HttpInterceptors {
  constructor() {
    ['request', 'requestError', 'response', 'responseError']
      .forEach((method) => {
        if(this[method]) {
          this[method] = this[method].bind(this);
        }
      });
  }
}


//////////////
// SERVICES //
//////////////

class HttpInterceptorsService extends HttpInterceptors {

  /*@ngInject*/
  constructor($rootScope, $q, ENV, UserService) {
    super();
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.apiUrl = ENV.api.url;
    this.UserService = UserService;
  }

  request(config) {

    if (config.url && _.startsWith(config.url, this.apiUrl)) {
      // add Authorization header
      let user = this.UserService.user;
      if (user && user.token) {
        config.headers['Authorization'] = 'Bearer ' + user.token;
      }
    }

    return config;
  }

  // requestError(rejection) {
  //   // do something on error
  //   if (canRecover(rejection)) {
  //     return responseOrNewPromise
  //   }
  //   return this.$q.reject(rejection);
  // }

  // response(response) {
  //   // do something on success
  //   return response;
  // }

  responseError(rejection) {

    let rejectData = rejection.data || {};

    if (_.isString(rejectData)) {
      rejectData = { message: rejectData };
    }

    rejectData.message = rejectData.message || 'Erreur serveur';

    this.$rootScope.$broadcast('$httpError', rejectData);

    // switch (rejection.status) {
    //   //...can handle different error codes differently
    //   case 500:
    //     this.$rootScope.$broadcast('$httpError', rejection.data);
    //     break;
    // }

    return this.$q.reject(rejection);
  }
}


////////////
// EXPORT //
////////////

export default HttpInterceptorsService;

////////////
// CONFIG //
////////////

/*@ngInject*/
function servicesConfig($httpProvider, $localStorageProvider) {
  $httpProvider.interceptors.push('HttpInterceptors');

  $localStorageProvider.setKeyPrefix('qfap-');
}


////////////
// EXPORT //
////////////

export default servicesConfig;
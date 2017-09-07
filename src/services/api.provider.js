'use strict';

////////////
// IMPORT //
////////////



///////////////
// FUNCTIONS //
///////////////

/**
 * EXTRACTED FROM ANGULAR SOURCES : https://github.com/angular/angular.js/blob/master/src/Angular.js
 *
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query       = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).
   replace(/%40/gi, '@').
   replace(/%3A/gi, ':').
   replace(/%24/g, '$').
   replace(/%2C/gi, ',').
   replace(/%3B/gi, ';').
   replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}


/////////
// API //
/////////

class Api {

  /*@ngInject*/
  constructor(ENV) {
    this.baseUrl = ENV.api.url;
    this.reqConfig = {};
  }

  buildUrl(url, params) {
    if (angular.isUndefined(params)) return this.baseUrl + url;

    if (params.params) params = params.params;

    var parts = [];
    angular.forEach(params, function(value, key) {
      if (value === null || angular.isUndefined(value)) return;
      if (!angular.isArray(value)) value = [value];

      angular.forEach(value, function(v) {
        if (angular.isObject(v)) {
          v = angular.toJson(v);
        }
        parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
      });
    });

    if (parts.length > 0) {
      url += ((url.indexOf('?') === -1) ? '?' : '&') + parts.join('&');
    }

    return this.baseUrl + url;
  }

  /*@ngInject*/
  $get($http) {
    return {
      get: (url, params) => $http.get(this.buildUrl(url, params), this.reqConfig),
      head: (url, params) => $http.head(this.buildUrl(url, params), this.reqConfig),
      post: (url, data) => $http.post(this.buildUrl(url), data, this.reqConfig),
      put: (url, data) => $http.put(this.buildUrl(url), data, this.reqConfig),
      delete: (url, params) => $http.delete(this.buildUrl(url, params), this.reqConfig),
    };
  }

}


////////////
// EXPORT //
////////////

export default Api;

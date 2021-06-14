(function() {
	'use strict';

	angular.module('chasqui').service('httpGetCached', httpGetCached);

  
  function httpGetCached($http) {
    var activedRequest = {};

    var _getCurrent = function (url) {
      return activedRequest[url] || null;
    }

    var _registerCall = function(url, data, promise) {
      activedRequest[url] = {
        data: data,
        promise: promise
      }

      const doneHandler = function() {
        _clearRequest(url);
      }

      promise.then(doneHandler,doneHandler);
    }

    var _clearRequest = function(url) {
      delete activedRequest[url];
    }

    var getCached = function({url, data, headers}) {
      const current = _getCurrent(url);
      if(current) {
        return current.promise;
      }

      const promise = $http({
        method: 'GET',
        url,
        data: data,
        headers: headers
      });

      _registerCall(url, data, promise);

      return promise;
    }

    return {
      get: getCached
    }
  }
})();

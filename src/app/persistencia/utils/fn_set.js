(function() {
	'use strict';
    
    angular.module('chasqui').factory('fn_set', fn_set);

    function fn_set(){

        return function(connection){
            return function(key){
                return function(value){
                    return connection.save(key, value);
                }
            }
        }
    }
})();
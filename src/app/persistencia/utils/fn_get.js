(function() {
	'use strict';
    
    angular.module('chasqui').factory('fn_get', fn_get);

    function fn_get(){

        return function(connection){
            return function(key){
                return function(){
                    return  connection.get(key)
                }
            }
        };
        
    }
})();   
(function() {
	'use strict';
    
    angular.module('chasqui').factory('fn_snoc', fn_snoc);

    function fn_snoc(){

        return function (list, elem){
            list.push(elem);
            return list;
        }
    }
})();
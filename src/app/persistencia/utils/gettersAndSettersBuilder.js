(function() {
	'use strict';
    
    angular.module('chasqui').factory('settersAndGettersBuilder', settersAndGettersBuilder);

    function settersAndGettersBuilder(){

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        function setterNameFor(fieldName){
            return "set" + capitalizeFirstLetter(fieldName);
        }
        
        function getterNameFor(fieldName){
            return "get" + capitalizeFirstLetter(fieldName);
        }
        
        return function(setter, getter, fields){
            return fields.reduce(function(r,f){
                r[setterNameFor(f)] = setter(f);
                r[getterNameFor(f)] = getter(f);
                return r;
            }, {})
        };
        
    }
})();   

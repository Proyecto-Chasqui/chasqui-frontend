(function(){
    'use strict';
    
    angular.module('chasqui').factory('globalConfigurations', 
                    ['puenteDelSur', 'mercadoTerritorial', 
            function( puenteDelSur,   mercadoTerritorial){
                
                var configurations = {};
                configurations["2"] = puenteDelSur;
                configurations["3"] = mercadoTerritorial;
                
                return configurations;
            }
    ]);    
})();
(function(){
    'use strict';
    
    angular.module('chasqui').factory('globalConfigurations', 
                    ['puenteDelSur', 'mercadoTerritorial', 'REST_ROUTES',
            function( puenteDelSur,   mercadoTerritorial,   REST_ROUTES){
                
                var configurations = {};
                configurations[REST_ROUTES.idVendedor.toString()] = puenteDelSur;
                configurations["3"] = mercadoTerritorial;
                
                return configurations;
            }
    ]);    
})();
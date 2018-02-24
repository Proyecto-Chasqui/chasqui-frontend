(function(){
    'use strict';
    
    angular.module('chasqui').factory('globalConfigurations', 
                    ['puenteDelSur', 'mercadoTerritorial', 'CTE_REST',
            function( puenteDelSur,   mercadoTerritorial,   CTE_REST){
                
                var configurations = {};
                configurations[CTE_REST.idVendedor.toString()] = puenteDelSur;
                configurations["3"] = mercadoTerritorial;
                
                return configurations;
            }
    ]);    
})();
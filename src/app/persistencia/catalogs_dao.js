angular.module('chasqui').factory('catalogs_dao', 
                            ['ls_connection',
                    function(ls_connection){
    
    var catalogs_daoInt = {
        newCatalog: newCatalog,
        loadCatalogs: loadCatalogs, 
        getCatalogs: getCatalogs,
        reset: reset
    };
                                                
    function init(){
        ls_connection.init({
            catalogs: [/*
                {
                    id: 2,
                    nombreCorto: "PdS",
                    nombre: "Puente del Sur",
                    imagen: "/imagenes/subirImagen.png",
                    estrategia: {
                        id: 2,
                        few: {
                            nodos: false,
                            gcc: true,
                            compraIndividual: true,
                            puntoDeEntrega: false,
                            seleccionDeDireccionDelUsuario: true,                        
                        },
                        app: {
                            nodosEnApp: false,
                            gccEnApp: false,
                            compraIndividualEnApp: false,
                            puntoDeEntregaEnApp: false
                        }
                    }
                },{
                    id: 3,
                    nombreCorto: "MT",
                    nombre: "Mercado Territorial",
                    imagen: "/imagenes/subirImagen.png",
                    estrategia: {
                        id: 3,
                        few: {
                            nodos: true,
                            gcc: false,
                            compraIndividual: false,
                            puntoDeEntrega: false,
                            seleccionDeDireccionDelUsuario: false,                        
                        },
                        app: {
                            nodosEnApp: false,
                            gccEnApp: false,
                            compraIndividualEnApp: false,
                            puntoDeEntregaEnApp: false
                        }
                    }
                },{
                    id: 4,
                    nombreCorto: "CyH",
                    nombre: "Caracoles y Hormigas",
                    imagen: "/imagenes/subirImagen.png",
                    estrategia: {
                        id: 4,
                        few: {
                            nodos: true,
                            gcc: true,
                            compraIndividual: true,
                            puntoDeEntrega: true,
                            seleccionDeDireccionDelUsuario: true,                        
                        },
                        app: {
                            nodosEnApp: false,
                            gccEnApp: false,
                            compraIndividualEnApp: false,
                            puntoDeEntregaEnApp: false
                        }
                    }
                }
            */]
        });
    }
                        
    init();
                        
                        
    function newCatalog(catalog){
        ls_connection.modifyField("catalogs", function(catalogs){
            catalogs.push(catalog);
            return catalogs;
        });
    }
                      
                                 
    function loadCatalogs(catalogs){
        catalogs.forEach(newCatalog);
    }    
                        
    function getCatalogs(){
        return ls_connection.get("catalogs");
    }
                        
    function reset(){
        init();
    }
                        
    //////////////////////////                        
                        
    return catalogs_daoInt;
    
}]);
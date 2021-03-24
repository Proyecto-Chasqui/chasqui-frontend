(function(){
	'use strict';

	angular.module('chasqui').service('productoService', productoService);

	function productoService(restProxy, setPromise, $log, REST_ROUTES, promiseService, 
                              toastr, $stateParams, contextCatalogsService) {
		
        var productoServiceInt = {
            getCategorias: getCategorias,
            getMedallas: getMedallas,
            getMedallasProductor: getMedallasProductor,
            getProductosDestacados: getProductosDestacados,
            getProductosByMultiplesFiltros: getProductosByMultiplesFiltros,
            getProductosSinFiltro: getProductosSinFiltro,
            getProductosByCategoria: getProductosByCategoria,
            getProductosByProductor: getProductosByProductor,
            getProductosByMedalla: getProductosByMedalla,
            getProductosByMedallaProductor: getProductosByMedallaProductor,
            getProductosByQuery: getProductosByQuery,
            crearPedidoIndividual: crearPedidoIndividual,
            verPedidoIndividual: verPedidoIndividual,
            agregarPedidoIndividual: agregarPedidoIndividual,
            quitarProductoIndividual: quitarProductoIndividual,
            cancelarPedidoIndividual: cancelarPedidoIndividual,
            confirmarPedidoIndividual: confirmarPedidoIndividual,
            verDirecciones: verDirecciones,
            imagenProducto: imagenProducto,
            normalizadorMedallas: normalizadorMedallas,
            normalizadorCategorias: normalizadorCategorias,
            normalizadorProductos: normalizadorProductos
        };

        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function getCategorias(){
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getCategorias ");
                    defered.resolve(promiseService.doGet(REST_ROUTES.categorias(catalog.id), {}));
                })
            });
        }

        function getMedallas(){
            // $log.debug(" service getMedallas ");
            return promiseService.doGet(REST_ROUTES.medallasProducto, {});
        }

        function getMedallasProductor(){
            $log.debug(" service getMedallasProdcutor ");
            return promiseService.doGet(REST_ROUTES.medallasProductor, {});
        }

        function getProductosDestacados(){
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getProductosDestacados ");
                    defered.resolve(promiseService.doGet(REST_ROUTES.productosDestacadosByVendedor(catalog.id), {}));
                });
            });
        }
        //crear funcion de REST
        function getProductosByMultiplesFiltros(params){
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getProductosByMultiplesFiltros ");
                    //defered.resolve(promiseService.doPostPublic(REST_ROUTES.productosByMultiplesFiltros(catalog.id), params));

                    var args = [];
                    args.push(`$limit=${params.cantItems}`)
                    args.push(`$skip=${(params.pagina-1)*params.cantItems}`)
                    args.push(`id_vendedor=${catalog.id}`)

                    if (params.idCategoria) args.push(`id_categoria=${params.idCategoria}`)
                    if (params.idProductor) args.push(`id_productor=${params.idProductor}`)
                    if (params.idsSellosProducto.length > 0) args.push(`id_medallas_producto=${params.idsSellosProducto}`)
                    if (params.idsSellosProductor.length > 0) args.push(`id_medallas_productor=${params.idsSellosProductor}`)
                    if (params.query) args.push(`nombre[$like]=%${params.query.replace(/ /g, '%')}%`);
                    
                    defered.resolve(promiseService.doGet(REST_ROUTES.productosByMultiplesFiltros(args.join('&')), {}));
                });
            });
        }

        function getProductosSinFiltro(params) {
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service getProductosSinFiltro ");
                    defered.resolve(promiseService.doPostPublic(REST_ROUTES.productosSinFiltro(catalog.id), params));
                });
            });
        }

        function getProductosByCategoria(params) {
            $log.debug(" service getProductosByCategoria ");
            return promiseService.doPostPublic(REST_ROUTES.productosByCategoria, params);
        }

        function getProductosByProductor(params) {
            $log.debug(" service getProductosByProductor ");
            return promiseService.doPostPublic(REST_ROUTES.productosByProductor, params);
        }

        function getProductosByMedalla(params) {
            $log.debug(" service getProductosByMedalla ");
            return promiseService.doPostPublic(REST_ROUTES.productosByMedalla, params);
        }

        function getProductosByMedallaProductor(params) {
            $log.debug(" service getProductosByMedallaProductor ");
            return promiseService.doPostPublic(REST_ROUTES.productosByMedallaProductor, params);
        }

        function getProductosByQuery(params) {
            $log.debug(" service getProductosByQuery ");
            return promiseService.doPostPublic(REST_ROUTES.productosByQuery, params);
        }

        function agregarPedidoIndividual(params) {
            $log.debug(" service agregarPedidoIndividual ");

            function doNoOk(response) {
                if (response.status == 404) {
                    toastr.error(response.data.error, "Error");
                } else {
                    toastr.error("ocurrio un error inesperado" , "Error");
                }
            }

            return promiseService.doPut(REST_ROUTES.agregarPedidoIndividual, params, doNoOk);
        }

        function crearPedidoIndividual(params, doNoOK) {
            $log.debug(" service crearPedidoIndividual ");

            return promiseService.doPost(REST_ROUTES.crearPedidoIndividual, params, doNoOK);
        }

        function verPedidoIndividual(params) {
            return setPromise(function(defered){
                contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
                    $log.debug(" service verPedidoIndividual ");

                    function doNoOk(response) {
                        $log.debug("--- callPedidoIndividual ", response.data);

                        if (response.status == 404) {
                            toastr.error("Noy  hay pedidos !" , "Error");
                        } else {
                            toastr.error("ocurrio un error inesperado!" , "Error");
                        }
                    }

                    defered.resolve(promiseService.doGetPrivate(REST_ROUTES.verPedidoIndividual(catalog.id), {}, doNoOk));
                });
            });
        }

        function quitarProductoIndividual(params) {
            $log.debug(" service quitarProductoIndividual ");
            return promiseService.doPut(REST_ROUTES.quitarProductoIndividual, params);
        }

        function cancelarPedidoIndividual(id) {
            $log.debug(" service cancelarPedidoIndividual ");
            return promiseService.doDelete(REST_ROUTES.cancelarPedidoIndividual(id), {});
        }

        function verDirecciones(params) {
            $log.debug(" service verDirecciones ");
            return promiseService.doGetPrivate(REST_ROUTES.verDirecciones, {});
        }

        function imagenProducto(id) {
            $log.debug(" service verDirecciones ");
            return promiseService.doGet(REST_ROUTES.imagenProducto(id), {});
        }

        function confirmarPedidoIndividual(params) {
            return promiseService.doPost(REST_ROUTES.confirmarPedidoIndividual, params);
        }
        
        function normalizadorMedallas(data) {
            return {
                idMedalla: data.id,
                nombre: data.nombre,
                descripcion: data.descripcion,
                pathImagen: data.path_imagen
            }
        }

        function normalizadorCategorias(data) {
            return {
                idCategoria: data.id,
                nombre: data.nombre,
            }
        }


        function normalizadorProductos(result) {
            return {
                "cantItems": result.limit,
                "pagina": Math.ceil(result.skip / result.limit) + 1,
                "total": result.total,
                "totalDePaginas": Math.ceil(result.total / result.limit),
                "productos": result.data.map(producto => 
                    ({
                        "idProducto": producto.id,
                        "idVariante": producto.VARIANTEs[0].id,
                        "idCategoria": producto.id_categoria,
                        "idFabricante": producto.id_productor,
                        "imagenPrincipal": producto.VARIANTEs[0].IMAGENs.filter(imagen => (imagen.orden === 0))[0].path,
                        "imagenes": producto.VARIANTEs[0].IMAGENs,
                        "codigoArticulo": producto.VARIANTEs[0].codigo,
                        "nombreProducto": producto.nombre,
                        "nombreVariedad": producto.VARIANTEs[0].nombre,
                        "nombreFabricante": producto.PRODUCTOR.nombre,
                        "precioParteEntera": producto.VARIANTEs[0].precio,
                        "precioParteDecimal": 0,
                        "descripcion": producto.VARIANTEs[0].descripcion,
                        "destacado": producto.VARIANTEs[0].destacado,
                        "precio": producto.VARIANTEs[0].precio,
                        "incentivo": producto.VARIANTEs[0].incentivo,
                        "stock": producto.VARIANTEs[0].stock,
                        "medallasProducto": producto.CARACTERISTICAs.map(medalla => (
                            {
                                "nombre": medalla.nombre,
                                "idMedalla": medalla.id,
                                "pathImagen": medalla.path_imagen,
                                "descripcion": medalla.descripcion
                            }
                        )),
                        "medallasProductor": [
                            {
                                "nombre": producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR && producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR.nombre,
                                "idMedalla": producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR && producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR.id,
                                "pathImagen": producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR && producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR.path_imagen,
                                "descripcion": producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR && producto.PRODUCTOR.CARACTERISTICA_PRODUCTOR.descripcion_corta
                            }
                        ],
                    })
                )
            }
        }
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                
        
        return productoServiceInt;

	}
})();

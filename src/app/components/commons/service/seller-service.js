(function() {
	'use strict';

	angular.module('chasqui').service('sellerService', sellerService);

	function sellerService(restProxy, $q, REST_ROUTES, promiseService) {
		var vm = this;

		vm.getSellers = function() {
      return promiseService.doGet(REST_ROUTES.sellers, {});
    }
    
		vm.getSellersTags = function() {
      return promiseService.doGet(REST_ROUTES.sellersTags, {});
    }
    
		vm.getSellersWithTags = function(selectedTags) {
      var params = [];
      if (selectedTags.nombre.length > 0) params.push(`nombre_vendedor[$like]=%${selectedTags.nombre.replace(/ /g,'%')}%`);
      if (selectedTags.idsTagsTipoOrganizacion.length > 0) params.push(`tag_organizacion=${selectedTags.idsTagsTipoOrganizacion[0]}`)
      if (selectedTags.idsTagsTipoProducto.length > 0) params.push(`tag_producto=${selectedTags.idsTagsTipoProducto[0]}`)
      if (selectedTags.idsTagsZonaDeCobertura.length > 0) params.push(`tag_cobertura=${selectedTags.idsTagsZonaDeCobertura[0]}`)
      return promiseService.doGet(REST_ROUTES.sellersWithTags(params.join('&')), {});
    }

		vm.getSeller = function(sellerId) {
			return promiseService.doGet(REST_ROUTES.seller(sellerId), {});
		}
        
    vm.getSellerIndividualQuestions = function(sellerId){
        return promiseService.doGet(REST_ROUTES.sellerIndividualQuestions(sellerId), {});
    }
    
    vm.getSellerColectiveQuestions = function(sellerId){
        return promiseService.doGet(REST_ROUTES.sellerColectiveQuestions(sellerId), {});
    }
    
    vm.getSellerZones = function(sellerId){
        return promiseService.doGet(REST_ROUTES.sellerZones(sellerId), {});
    }

    vm.getAddressZone = function(sellerId, addresId, doNoOk){
        return promiseService.doPost(REST_ROUTES.getAddressZone, {idVendedor: sellerId, idDireccion: addresId}, doNoOk);
    }

    vm.normalizadorSellersTags = function(data) {
      return {
        tagsTipoOrganizacion: data.filter(tag => (tag.tipo === 'organizacion')),
        tagsTipoProducto: data.filter(tag => (tag.tipo === 'producto')),
        tagsZonaDeCobertura: data.filter(tag => (tag.tipo === 'zona')),
      }
    }

    vm.normalizadorVendedores = function(data) {
      return {
        id: data.id,
        nombre: data.nombre_vendedor,
        montoMinimo: data.monto_minimo_pedido,
        nombreCorto: data.nombre_corto_vendedor,
        imagen: data.USUARIO.imagen_de_perfil,
        urlMapa: data.mapa,
        tiempoDeVencimiento: data.tiempo_vencimiento_pedidos,
        visibleEnMulticatalogo: data.visible_en_multicatalogo,
        ventasHabilitadas: data.ventas_habilitadas,
        mensajeVentasDeshabilitadas: data.mensaje_venta_deshabilitada,
        few: {
          gcc: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_gcc,
          nodos: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_nodos,
          compraIndividual: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_compra_individual,
          puntoDeEntrega: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_punto_de_entrega,
          seleccionDeDireccionDelUsuario: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_elegir_direccion,
          usaIncentivos: data.ESTRATEGIA_DE_COMERCIALIZACION.utiliza_incentivos
        },
        app: {
          gcc: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_gcc_app,
          nodos: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_nodos_app,
          compraIndividual: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_compra_indiviudal_app,
          puntoDeEntrega: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_punto_de_entrega_app,
          seleccionDeDireccionDelUsuario: data.ESTRATEGIA_DE_COMERCIALIZACION.permite_elegir_direccion,
          usaIncentivos: data.ESTRATEGIA_DE_COMERCIALIZACION.utiliza_incentivos
        },
        tagsTipoOrganizacion: data.VENDEDOR_TAG_TIPO_ORGANIZACIONs.map(tag => ({
          id: tag.id_tag_tipo_producto,
          nombre: tag.TAG.nombre,
          descripcion: tag.TAG.descripcion,
        })),
        tagsTipoProductos: data.VENDEDOR_TAG_TIPO_PRODUCTOs.map(tag => ({
          id: tag.id_tag_tipo_producto,
          nombre: tag.TAG.nombre,
          descripcion: tag.TAG.descripcion,
        })),
        tagsZonaDeCobertura: data.VENDEDOR_TAG_ZONA_COBERTURAs.map(tag => ({
          id: tag.id_tag_tipo_producto,
          nombre: tag.TAG.nombre,
          descripcion: tag.TAG.descripcion,
        })),
      }
    }

	}
})();

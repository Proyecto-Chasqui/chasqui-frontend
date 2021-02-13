(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('MulticatalogoCtrl', MulticatalogoCtrl);

    
	function MulticatalogoCtrl($scope, URLS, contextCatalogsService, $state, sellerService) {
        
    $scope.catalogs = [];
    $scope.url = url;
    $scope.goToCatalog = goToCatalog;
    $scope.catalogOrganizationType = catalogOrganizationType;
    $scope.deliveryTypeImg = deliveryTypeImg;
    $scope.agrupationTypeImg = agrupationTypeImg;
    $scope.apoyos_id = [];
    $scope.getSupportLogo = getSupportLogo;
    
        

    ////////////////////////////////////

    function catalogOrganizationType(catalog){
      return catalog.tagsTipoOrganizacion.length > 0? catalog.tagsTipoOrganizacion[0].nombre : "";
    }

    function agrupationsTypes(catalog){
      const res = [];
      if(catalog.few.compraIndividual){
        res.push({
          id: 0,
        });
      }
      if(catalog.few.gcc){
        res.push({
          id: 1,
        });
      }
      if(catalog.few.nodos){
        res.push({
          id: 2,
        });
      }

      return res;
    }

    function deliveryTypes(catalog){
      const res = [];
      if(catalog.few.seleccionDeDireccionDelUsuario){
        res.push({
          id: 0,
        });
      }
      if(catalog.few.puntoDeEntrega){
        res.push({
          id: 1,
        });
      }

      return res;
    }

    function deliveryTypeImg(id){
      var res = "./assets/images/";
      if ( id == 0 ){
        res += "estrategias/entrega_domicilio.svg";
      }

      if ( id == 1 ){
        res += "estrategias/entrega_lugar.svg";
      }
      
      return res;
    }

    function agrupationTypeImg(id){
      var res = "./assets/images/";
      if ( id == 0 ){
        res += "estrategias/compra_individual.svg";
      }
      if ( id == 1 ){
        res += "estrategias/compra_grupal.svg";
      }
      if ( id == 2 ){
        res += "estrategias/compra_nodos.svg";
      }
      
      return res;
    }
    
    function getSupportLogo(id){
      return "./assets/images/apoyos/apoyo_"+id+".jpg";
    }
    

    // busqueda de catalogos
    //$scope.tags = { "tagsTipoOrganizacion": [{ "id": 18, "nombre": "Cooperativa", "descripcion": "", "fechaCreacion": 1599153202000, "fechaModificacion": 1599153202000 }, { "id": 19, "nombre": "Comercializadora", "descripcion": "", "fechaCreacion": 1599153210000, "fechaModificacion": 1599153210000 }, { "id": 20, "nombre": "Iniciativa Universitaria", "descripcion": "", "fechaCreacion": 1599153222000, "fechaModificacion": 1599153222000 }, { "id": 21, "nombre": "Almacén", "descripcion": "", "fechaCreacion": 1599153231000, "fechaModificacion": 1599153231000 }, { "id": 22, "nombre": "Red de productores y consumidores", "descripcion": "", "fechaCreacion": 1599153245000, "fechaModificacion": 1599153245000 }, { "id": 23, "nombre": "Mutual", "descripcion": "", "fechaCreacion": 1599153305000, "fechaModificacion": 1599153305000 }, { "id": 36, "nombre": "Colectivo de editoriales asociativas", "descripcion": "", "fechaCreacion": 1606674395000, "fechaModificacion": 1606674395000 }], "tagsTipoProducto": [{ "id": 27, "nombre": "Vegetales agroecológicos", "descripcion": "", "fechaCreacion": 1599153383000, "fechaModificacion": 1599153383000 }, { "id": 28, "nombre": "Bebidas y alimentos", "descripcion": "", "fechaCreacion": 1599153395000, "fechaModificacion": 1599153395000 }, { "id": 29, "nombre": "Libros y revistas", "descripcion": "", "fechaCreacion": 1599153404000, "fechaModificacion": 1599153404000 }, { "id": 30, "nombre": "Artículos de limpieza", "descripcion": "", "fechaCreacion": 1599153415000, "fechaModificacion": 1599153415000 }, { "id": 31, "nombre": "Bazar y decoración", "descripcion": "", "fechaCreacion": 1599153425000, "fechaModificacion": 1599153425000 }], "tagsZonaDeCobertura": [{ "id": 1, "nombre": "Puerto Madryn", "descripcion": "", "fechaCreacion": 1599153036000, "fechaModificacion": 1599153036000 }, { "id": 2, "nombre": "CABA", "descripcion": "Ciudad Autónoma de Buenos Aires", "fechaCreacion": 1599153051000, "fechaModificacion": 1599153745000 }, { "id": 3, "nombre": "Quilmes", "descripcion": "", "fechaCreacion": 1599153061000, "fechaModificacion": 1599153061000 }, { "id": 6, "nombre": "Tandil", "descripcion": "", "fechaCreacion": 1599153095000, "fechaModificacion": 1599153095000 }, { "id": 7, "nombre": "Olavarria", "descripcion": "", "fechaCreacion": 1599153103000, "fechaModificacion": 1599153103000 }, { "id": 11, "nombre": "La Plata", "descripcion": "", "fechaCreacion": 1599153132000, "fechaModificacion": 1599153132000 }, { "id": 32, "nombre": "AMBA", "descripcion": "Área Metropolitana de Buenos Aires. Incluye la Ciudad Autónoma de Buenos Aires y los municipios del conurbano bonaerense.", "fechaCreacion": 1599153677000, "fechaModificacion": 1599153728000 }, { "id": 33, "nombre": "GBA", "descripcion": "Gran Buenos Aires. Incluye los municipios del Conurbano Bonaerense.", "fechaCreacion": 1599153914000, "fechaModificacion": 1599153914000 }, { "id": 34, "nombre": "Tapalqué", "descripcion": "", "fechaCreacion": 1603366672000, "fechaModificacion": 1603366672000 }, { "id": 35, "nombre": "Ranchos", "descripcion": "", "fechaCreacion": 1603366682000, "fechaModificacion": 1603366682000 }, { "id": 37, "nombre": "Todo Argentina", "descripcion": "", "fechaCreacion": 1606674428000, "fechaModificacion": 1606674428000 }, { "id": 39, "nombre": "Alta Gracia, Córdoba", "descripcion": "", "fechaCreacion": 1607613843000, "fechaModificacion": 1607613843000 }] };
    $scope.tags = {};
    $scope.selectedTags = {
      idTagTipoOrganizacion: 0,
      idTagTipoProducto: 0,
      idTagZonaDeCobertura: 0,
      nombre: "",
      usaEstrategiaNodos: false,
      usaEstrategiaGrupos: false,
      usaEstrategiaIndividual: false,
      entregaADomicilio: false,
      usaPuntoDeRetiro: false
    }

    $scope.confirmSearch = function (){
      // adaptacion

      const selectedTags = {
        nombre: $scope.selectedTags.nombre,
        usaEstrategiaNodos: $scope.selectedTags.usaEstrategiaNodos,
        usaEstrategiaGrupos: $scope.selectedTags.usaEstrategiaGrupos,
        usaEstrategiaIndividual: $scope.selectedTags.usaEstrategiaIndividual,
        entregaADomicilio: $scope.selectedTags.entregaADomicilio,
        usaPuntoDeRetiro: $scope.selectedTags.usaPuntoDeRetiro,
      }
      selectedTags.idsTagsTipoOrganizacion = $scope.selectedTags.idTagTipoOrganizacion == 0 || $scope.selectedTags.idTagTipoOrganizacion == -1? [] : [$scope.selectedTags.idTagTipoOrganizacion];
      selectedTags.idsTagsTipoProducto = $scope.selectedTags.idTagTipoProducto == 0 || $scope.selectedTags.idTagTipoProducto == -1? [] : [$scope.selectedTags.idTagTipoProducto];
      selectedTags.idsTagsZonaDeCobertura = $scope.selectedTags.idTagZonaDeCobertura == 0 || $scope.selectedTags.idTagZonaDeCobertura == -1? [] : [$scope.selectedTags.idTagZonaDeCobertura];

      console.log(selectedTags);

      $scope.catalogs = [];
      
      sellerService.getSellersWithTags(selectedTags).then(function(response){
        $scope.catalogs = response.data.map(function(c){
          c.deliveryTypes = deliveryTypes(c);
          c.agrupationsTypes = agrupationsTypes(c);
          return c;
        }).filter(function(c){
          return c.visibleEnMulticatalogo;
        });
        console.log($scope.catalogs);
      })

    }

    ////////////////////////////////////

        
    function url(path){
        return URLS.be_base + path;
    }
    
    function goToCatalog(catalogShortName){
        $state.go('catalog.products', {catalogShortName: catalogShortName});
    }

    function toTop(){
      window.scrollTo(0,0);
    }
    
    function init(){
      toTop();
      contextCatalogsService.getCatalogs().then(function(catalogs){
        // $scope.catalogs = catalogs.map(function(c){
        //   c.deliveryTypes = deliveryTypes(c);
        //   c.agrupationsTypes = agrupationsTypes(c);
        //   return c;
        // }).filter(function(c){
        //   return c.visibleEnMulticatalogo;
        // });

        $scope.catalogs = catalogs.data.map(function (c) {
          console.log(c)
          c.deliveryTypes = []; //deliveryTypes(c);
          c.agrupationsTypes = []; //agrupationsTypes(c);
          return c;
        }).filter(function (c) {
          return c.visible_en_multicatalogo.data;
        });

        
        console.log($scope.catalogs)
      })
      sellerService.getSellersTags().then(function(response){
        $scope.tags = response.data;
        console.log($scope.tags);
      })

      $scope.apoyos_id = Array.from(Array(9), function(e,i){ return i;});
    }
    
    init();
	}
})();

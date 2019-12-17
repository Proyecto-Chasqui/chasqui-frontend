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
      var res = "../../../../assets/images/";
      if ( id == 0 ){
        res += "estrategias/entrega_domicilio.svg";
      }

      if ( id == 1 ){
        res += "estrategias/entrega_lugar.svg";
      }
      
      return res;
    }

    function agrupationTypeImg(id){
      var res = "../../../../assets/images/";
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
      return "../../../../assets/images/apoyos/apoyo_"+id+".jpg";
    }
    

    // busqueda de catalogos

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

      sellerService.getSellersWithTags(selectedTags).then(function(response){
        $scope.catalogs = response.data;
        console.log($scope.catalogs);
      })

    }

    ////////////////////////////////////

        
    function url(path){
        return URLS.be_base + path;
    }
    
    function goToCatalog(catalogShortName){
        $state.go('catalog.landingPage', {catalogShortName: catalogShortName});
    }
    
    function init(){
      contextCatalogsService.getCatalogs().then(function(catalogs){
          $scope.catalogs = catalogs.map(function(c){
            c.deliveryTypes = deliveryTypes(c);
            c.agrupationsTypes = agrupationsTypes(c);
            return c;
          });
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

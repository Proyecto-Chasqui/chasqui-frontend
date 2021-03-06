(function() {
  'use strict';

  angular.module('chasqui').controller('GroupController', GroupController);

  
  function GroupController($scope, $rootScope, $stateParams, contextCatalogObserver, contextPurchaseService, agrupationTypeVAL,
                           $interval, $state,vendedorService, $log) {

    $scope.group = {};
    $scope.montoMinimo = 0;
    $scope.porcentajeMontoMinimo = 0;
    $scope.estadoPedido = "colorCero";
    $scope.montoTotalGrupo = montoTotalGrupo;
    $scope.statusBarToolTipMsg = statusBarToolTipMsg;
    
    $scope.goToState = goToState;
    $scope.getArrowState = getArrowState;
    $scope.selectedState = "";
    $scope.showProgressBar;

    ///////////////////////////////////////

    function goToState(newState){
      $scope.selectedState = newState;
    }
    
    function getArrowState(state){
      return $scope.selectedState == state? "ch-arrow-list-elem-hide" : "ch-arrow-list-elem-select";
    }

    function toTop(){
      window.scrollTo(0,0);
    }
    
    
    // Tooltips
    
    function statusBarToolTipMsg(){
      return "Total del pedido colectivo sobre el monto mínimo para poder hacer envio a domicilio. \n" + 
             "Para poder confirmar este pedido hace falta que al menos 1 integrante confirme su pedido";
    }
      
    // Datos del grupo
      
    function montoTotalGrupo(){
        return $scope.group.miembros != undefined? $scope.group.miembros.reduce(function(r,m){
            if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
                return r + m.pedido.montoActual;
            }else{
                return r;
            }
        }, 0) : 0;
    }

    // animación de la barra del monto total    
      
    function runStatusBar(){
        var porcentajeMontoMinimo = Math.min((montoTotalGrupo() / $scope.montoMinimo)*100, 100);                

        var interval = $interval(function() {
          var increment = 1;

          if($scope.porcentajeMontoMinimo < porcentajeMontoMinimo && $scope.porcentajeMontoMinimo < 100){
            if(($scope.porcentajeMontoMinimo / porcentajeMontoMinimo) * 100 < 75){
              $scope.porcentajeMontoMinimo += increment*6;
            }else{
              $scope.porcentajeMontoMinimo += increment*2;
            }

            if($scope.porcentajeMontoMinimo < 17){
              $scope.estadoPedido = "colorCero";
            }else if($scope.porcentajeMontoMinimo < 33){
              $scope.estadoPedido = "colorUno";
            }else if($scope.porcentajeMontoMinimo < 50){
              $scope.estadoPedido = "colorDos";
            }else if($scope.porcentajeMontoMinimo < 67){
              $scope.estadoPedido = "colorTres";
            }else if($scope.porcentajeMontoMinimo < 83){
              $scope.estadoPedido = "colorCuatro";
            }else if($scope.porcentajeMontoMinimo < 100){
              $scope.estadoPedido = "colorCinco";
            }else if($scope.porcentajeMontoMinimo == 100){
              $scope.estadoPedido = "puedeConfirmar";
            }

          }else{
            $interval.cancel(interval);
          }
        }, 200);
    }
      
    // Privado
      
    //////////////////////////////////////////
      
    $scope.$on('group-information-actualized', function(event) {
        init();
    });
      
    $rootScope.$on('order-cancelled', function(event) {
        init();
    });
      
    /////////////////// INIT ////////////////////

    function init(){
        contextCatalogObserver.observe(function(){
            contextPurchaseService.getAgrupations().then(function(agrupations_dao_int){
                var groups = agrupations_dao_int.getAgrupationsByType(contextPurchaseService.getCatalogContext(), agrupationTypeVAL.TYPE_GROUP);
                $scope.group = groups[$stateParams.groupId];
                //$scope.montoMinimo = $scope.group.miembros[0].pedido? $scope.group.miembros[0].pedido.montoMinimo : 500; // TODO pedir esta info dsd be
                runStatusBar();
                $scope.selectedState = $state.current.name.split(".").slice(-1)[0];
                $rootScope.$broadcast('group-is-loaded', $scope.group);
            });
        })
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                $scope.montoMinimo = response.data.montoMinimo;
                $scope.showProgressBar = response.data.few.puntoDeEntrega && !response.data.few.seleccionDeDireccionDelUsuario || !response.data.few.puntoDeEntrega && !response.data.few.seleccionDeDireccionDelUsuario;
            }
        );
        toTop();
    }

    init();

  }

})();

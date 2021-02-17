(function() {
  'use strict';
    
  angular
    .module('chasqui')
    .controller('ModifyCountCtrl', ModifyCountCtrl);
    
  function ModifyCountCtrl($log, $scope, $mdDialog, URLS, variety, order, texts, initCount, actions, responsiveTexts,
                           agrupationTypeDispatcher, contextPurchaseService, toastr, usuario_dao, productoService) {
    $scope.urlBase = URLS.be_base;
  
    $scope.title = texts.title;
    $scope.responsiveTexts = responsiveTexts;
    $scope.okButton = getOkButtonText(texts);
    $scope.okButtonResponsive = getOkButtonText(responsiveTexts);
    $scope.cancelButton = texts.cancelButton;
    $scope._count = initCount == 0? 1 : initCount;
    $scope.showOkButton = showOkButton;
    $scope.isLogged = usuario_dao.isLogged();
    $scope.imagenes = variety.imagenes;
    $scope.imageSelect = variety.imagenPrincipal != null? variety.imagenPrincipal : variety.imagen;

    
    $scope.order = order;
    $scope.variety = variety;
  
    $log.debug(order, variety);
  
    $scope.getTotal = getTotal;
    $scope.getTotalOrder = getTotalOrder;

    /// Private
    function getTotal(variety){
        var decimal = Math.floor(((variety.precio + variety.incentivo) - Math.floor(variety.precio + variety.incentivo))*100);
        return $scope._count * (Math.floor(variety.precio + variety.incentivo) + (decimal/100));
    }

    function getTotalOrder(variety){
        return getTotal(variety) + 
              (order.estado == "ABIERTO"? order.productosResponse
                                            .filter(function(p){return p.idVariante != variety.idVariante})
                                            .reduce(function(r,p){return r + (p.precio + p.incentivo)*p.cantidad}, 0) : 0);
    }
    
    $scope.countPlus = function(howMuch){
        if($scope._count + howMuch >= 0)
            $scope._count += howMuch;
    }
    
    $scope.count = function(newCount){
        $scope._count = (arguments.length)?             // (a) verifica que sea llamado con parametros
                            (newCount.length > 0)?      // (b) verifica que el largo del string sea > 0
                                parseInt(newCount):     // setea el valor en Int del string input
                                0:                      // si (a) & !(b) setea el 0 (esto es asi para que siempre haya un numero)
                            $scope._count;              // si !(a) & !(b) no modifica nada
        return $scope._count;
    }
    
    function getOkButtonText(localTexts){
      return function(){
        if(initCount == 0 && $scope._count > 0){
            return localTexts.okButtonAgregar;
        }
        if(initCount > 0 && $scope._count == 0){
          return localTexts.okButtonRemover;
        }
        if(initCount != $scope._count){
          return localTexts.okButtonModificar;
        }
      }
    }

    function showOkButton(){
      return initCount != $scope._count;
    }
    
    $scope.okAction = function(count){
        actions.doOk(count);
        $mdDialog.hide();
    }
    
    
    $scope.cancelAction = function(){
        $mdDialog.hide();
        actions.doNoOk();
    }

    $scope.getTotalLabel = function(){
      return agrupationTypeDispatcher.byElem(
        order,
        function(){
          return "El total de tu pedido individual es:";
        },
        function(groupOrder){
          return "El total de tu pedido personal dentro del grupo "+groupOrder.aliasGrupo+" es:";
        },
        function(nodeOrder){
          return "El total de tu pedido personal dentro del grupo "+nodeOrder.aliasGrupo+" es:";
        }
      )
    }

    $scope.setImageSelected = function(image){
      $scope.imageSelect = image;
    }

    function init(){

      contextPurchaseService.getSelectedCatalog()
      .then(function(catalog){
        $scope.ventasHabilitadas = catalog.ventasHabilitadas;
        if(!catalog.ventasHabilitadas){
          toastr.warning("Solo se pueden eliminar unidades del pedido","Ventas deshabilitadas");
        }

        // obtener las imagenes complementarias del producto

        // function setImagenes(response) {
        //   $log.debug("imagenProducto", response);
        //   $scope.imagenes = response.data;

        //   console.log(response.data)
        // }
        
        //productoService.imagenProducto(variety.idVariante).then(setImagenes);
      })
    }

    init();
  } 
    
})();         
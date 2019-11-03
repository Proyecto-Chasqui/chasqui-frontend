(function() {
  'use strict';

  angular.module('chasqui').controller('NodesListCtrl', NodesListCtrl);

  function NodesListCtrl(URLS, $scope, $rootScope, $state, contextPurchaseService, nodeService, 
                         usuario_dao, perfilService, us) {

    // Interfaz

    $scope.urlBase = URLS.be_base;
    $scope.showOptions = [];
    $scope.openRequests = $scope.openRequests;
    $scope.showOptionsForNode = showOptionsForNode;
    $scope.isLoggedUserNodeAdmin = isLoggedUserNodeAdmin;
    $scope.userIsLog = usuario_dao.isLogged();
    $scope.goToCatalog = goToCatalog;
    $scope.montoTotalNodo = montoTotalNodo;
    $scope.montoSinIncentivo = montoSinIncentivo;
    $scope.incentivoNodo = incentivoNodo;
    $scope.countOrdersConfirmed = countOrdersConfirmed;
    $scope.nodeActiveMembers = nodeActiveMembers;
    $scope.totalForMember = totalForMember;
    $scope.puedeCerrarPedidoGCC = puedeCerrarPedidoGCC;
    $scope.puedeCerrarPedidoGCCSegunEstrategias = puedeCerrarPedidoGCCSegunEstrategias;
    $scope.confirmNodeOrder = confirmNodeOrder;

    // Implementación


    function showOptionsForNode(nodeIndex){
      $scope.showOptions = $scope.showOptions.map(function(o,i){return i == nodeIndex && !o});
    }

    function isLoggedUserNodeAdmin(node){
      return node.esAdministrador;
    }

    function montoTotalNodo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }

    function montoSinIncentivo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.montoActual - m.pedido.incentivoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }

    function incentivoNodo(node){
      return node.miembros != undefined? node.miembros.reduce(function(r,m){
        if((m.pedido != null && m.pedido.estado == "CONFIRMADO")){
            return r + m.pedido.incentivoActual;
        }else{
            return r;
        }
      }, 0) : 0;
    }

    function countOrdersConfirmed(node){
      return countOrdersWithState(node, "CONFIRMADO");
    }

    function nodeActiveMembers(node){
      return node.miembros.filter(function(m) { return m.invitacion == 'NOTIFICACION_ACEPTADA' });
    }

    function totalForMember(member){
      return member.pedido != null? member.pedido.productosResponse.reduce(function(r,p){return r + (p.precio * p.cantidad)}, 0): 0;
    }

    function puedeCerrarPedidoGCC(node){
      return !hayAlgunPedidoAbierto(node) && hayAlgunPedidoConfirmado(node) && montoTotalGrupo(node) >= $scope.montoMinimo;
    }

    function puedeCerrarPedidoGCCSegunEstrategias(node){
        return !hayAlgunPedidoAbierto(node) && hayAlgunPedidoConfirmado(node);
    }

    function hayAlgunPedidoAbierto(node) {
        return algunPedidoTieneEstado(node.miembros, 'ABIERTO');
    }

    function hayAlgunPedidoConfirmado(node){
        return algunPedidoTieneEstado(node.miembros, 'CONFIRMADO');
    }

    function algunPedidoTieneEstado(miembros, estado){
        return any(miembros, function(m){return m.pedido != null && m.pedido.estado == estado})
    }

    function confirmNodeOrder(node){

    }

    function callNotificaciones() {
			function doOk(response) {
				$scope.invitaciones = response.data.filter(function(notificacion){
          return notificacion.estado == 'NOTIFICACION_NO_LEIDA' && isCompraColectiva(notificacion);
        }).length;
			}
			perfilService.notificacionesNoLeidas().then(doOk);
    }
    
    function isCompraColectiva(notificacion){			
			return us.contieneCadena(notificacion.mensaje ,'ha invitado al nodo de compras colectivas');
    }

    function goToCatalog(node){
      contextPurchaseService.setContextByAgrupation(node);
      $state.go('catalog.products');
    }
    // Privado
      
    function countOrdersWithState(node, state){
      return node.miembros.filter(function(m){return m.pedido != null && m.pedido.estado == state}).length;
    }  

    function any(list, property){
      return list != undefined && list.reduce(function(r,e){return r || property(e)}, false);
    } 

    function toTop(){
      window.scrollTo(0,0);
    }

    // Inicialización
    function init(){
      if(usuario_dao.isLogged()){
        nodeService.openRequests(contextPurchaseService.getCatalogContext())
        .then(function(response){
          $scope.openRequests = response.data.filter(function(r){
            return r.estado == "solicitud_nodo_en_gestion";
          });
        })
        $scope.showOptions = $scope.nodes.map(function(n){return false});
        callNotificaciones();
      }
      toTop();
    }

    $rootScope.$on('nodes-are-loaded', init);

    init();

  }

})();

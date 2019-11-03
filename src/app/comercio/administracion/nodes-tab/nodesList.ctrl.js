(function() {
  'use strict';

  angular.module('chasqui').controller('NodesListCtrl', NodesListCtrl);

  function NodesListCtrl($log, $scope, $rootScope, dialogCommons, contextPurchaseService, nodeService, 
                         usuario_dao, perfilService, us) {

    // Interfaz

    $scope.showOptions = [];
    $scope.openRequests = $scope.openRequests;
    $scope.showOptionsForNode = showOptionsForNode;
    $scope.isLoggedUserNodeAdmin = isLoggedUserNodeAdmin;
    $scope.userIsLog = usuario_dao.isLogged();

    // Implementación


    function showOptionsForNode(nodeIndex){
      $scope.showOptions = $scope.showOptions.map(function(o,i){return i == nodeIndex && !o});
    }

    function isLoggedUserNodeAdmin(node){
      return node.esAdministrador;
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

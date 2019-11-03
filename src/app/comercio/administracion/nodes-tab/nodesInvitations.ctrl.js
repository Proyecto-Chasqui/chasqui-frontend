(function() {
  'use strict';

  angular.module('chasqui').controller('NodesInvitationsController', NodesInvitationsController);

  
  function NodesInvitationsController($scope, nodeService, perfilService, us, toastr, contextPurchaseService, $state, $rootScope) {

    $scope.aceptarInvitacion = aceptarInvitacion;
    $scope.rechazarInvitacion = rechazarInvitacion;


    function aceptarInvitacion(notificacion) {
			function doOk(response) {
				toastr.success(us.translate('ACEPTADO'), us.translate('AVISO_TOAST_TITLE'));
        contextPurchaseService.refresh().then(function(){
          callNotificaciones();
          $rootScope.$emit('new-node');
          $state.go('catalog.userNodes.all');
        })
      }
      
			var params = {
        idInvitacion: notificacion.id
      }

			nodeService.acceptInvitation(params).then(doOk)

		}

		function rechazarInvitacion(notificacion) {
			function doOk(response) {
        toastr.info(us.translate('RECHAZADO'), us.translate('AVISO_TOAST_TITLE') );
        callNotificaciones();
			}
      
			var params = {
        idInvitacion: notificacion.id
      }

			nodeService.declineInvitation(params).then(doOk)

		}
    
      
    function callNotificaciones() {

			function doOk(response) {
				$scope.invitations = response.data.filter(function(notificacion){
          return notificacion.estado == 'NOTIFICACION_NO_LEIDA' && isNodeInvitation(notificacion);
        });

        console.log($scope.invitations);
			}
			perfilService.notificacionesNoLeidas().then(doOk);
    }
    
    function isNodeInvitation(notificacion){			
			return us.contieneCadena(notificacion.mensaje ,'ha invitado al nodo de compras colectivas');
    }

    /////////////////// INIT ////////////////////

    function init(){
      callNotificaciones();
    }

    init();

  }

})();

(function() {
    'use strict';

    angular.module('chasqui').controller('NewGroupCtrl', NewGroupCtrl);

    /**
    * @ngInject
    */
    function NewGroupCtrl($log, $scope, gccService, contextPurchaseService,
                          isEdit, group, callback, $mdDialog) {
        
        $scope.group = group;
        $scope.isEdit = isEdit;
        $scope.save = save;
        $scope.cancel = cancel;

        
        ////////////////////////////////////////////////
        
        
        function cancel(){
            $mdDialog.hide();
        }
        
        
        function save() {
            if ($scope.isEdit) {
                callSaveChangesInGroup();
            } else {
                callNewGroup();
            }
        }

        function callNewGroup() {
            $log.debug("guardar grupo", $scope.group);

            function doOk(response) {
                $log.debug("respuesta guardar grupo ", response);
                callback($scope.group);
                $mdDialog.hide();

            }

            gccService.nuevoGrupo($scope.group).then(doOk)
        }

        var callSaveChangesInGroup = function() {
            $log.debug("editar grupo", $scope.group);

            function doOk(response) {       
                $log.debug("editar grupo response", response);
                callback($scope.group);
                $mdDialog.hide();
            }
            
            var params = {
                alias: $scope.group.alias,
                descripcion: $scope.group.descripcion
            }
            
            gccService.editarGrupo($scope.group.idGrupo, params).then(doOk)
        }
    }

})();
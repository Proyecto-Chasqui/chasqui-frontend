(function() {
	'use strict';

	angular.module('chasqui').service('dialogCommons', dialogCommons);

	function dialogCommons($mdDialog) {

        var vm = this;
		/** Dialogo con un input text y confirmacion */
		vm.prompt = function(titulo, texto, placeholder, textOk, textCancel,
			doOk, doNoOk) {

			var confirm = $mdDialog.prompt().title(titulo).textContent(texto)
				.placeholder(placeholder).ok(textOk).cancel(textCancel);

            console.log("Confirm object", confirm);
            console.log("$mdDialog", $mdDialog.prompt());
			$mdDialog.show(confirm).then(doOk, doNoOk);

		}
        
        vm.newGroup = function(callback){
            var newGroup = {
                parent: angular.element(document.body),
                templateUrl: "app/comercio/administracion/new-group/new-group.tmpl.html",
                controller: "NewGroupCtrl",
                clickOutsideToClose: true,
                locals: {
                    isEdit: false,
                    group: {}, 
                    callback: callback
                }
            };
            
            $mdDialog.show(newGroup);
        }
        
        vm.editGroup = function(group, callback){
            var editGroup = {
                parent: angular.element(document.body),
                templateUrl: "app/comercio/administracion/new-group/new-group.tmpl.html",
                controller: "NewGroupCtrl",
                clickOutsideToClose: true,
                locals: {
                    isEdit: true,
                    group: {
                        idGrupo: group.idGrupo,
                        alias: group.alias,
                        descripcion: group.descripcion
                    }, 
                    callback: callback
                }
            };
            
            $mdDialog.show(editGroup);
        }

		/** Dialogo confirmacion */
		vm.confirm = function(titulo, texto, textOk, textCancel, doOk, doNoOk) {

			var confirm = $mdDialog.confirm().title(titulo).textContent(texto)
				.ok(textOk).cancel(textCancel);

			$mdDialog.show(confirm).then(doOk, doNoOk);

		}
        
        /* Dialogo para la modificación de la cantidad de productos de una variedad en el changuito */
        vm.modifyVarietyCount = function(texts, initCount, actions){
            var modify = {
                parent: angular.element(document.body),
                templateUrl: "app/components/commons/modifyCount.tmpl.html",
                controller: "ModifyCountCtrl",
                locals: {
                    texts: texts,
                    initCount: initCount,
                    actions: actions
                }
            };
            
            $mdDialog.show(modify);
        }
        
        vm.selectDeliveryAddress = function(actions){
            var modify = {
                parent: angular.element(document.body),
                templateUrl: "app/comercio/carrito/select-delivery-address/select-delivery-address.tmpl.html",
                controller: "SelectDeliveryAddressController",
                locals: {
                    actions: actions
                }
            };
            
            $mdDialog.show(modify);
        }
            
	} 
})(); 

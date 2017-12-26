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

			$mdDialog.show(confirm).then(doOk, doNoOk);

		}

		/** Dialogo confirmacion */
		vm.confirm = function(titulo, texto, textOk, textCancel, doOk, doNoOk) {

			var confirm = $mdDialog.confirm().title(titulo).textContent(texto)
				.ok(textOk).cancel(textCancel);

			$mdDialog.show(confirm).then(doOk, doNoOk);

		}

	} // function
})(); // anonimo

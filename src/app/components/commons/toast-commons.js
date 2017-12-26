(function() {
	'use strict';

	angular.module('chasqui').service('ToastCommons', ToastCommons);

	function ToastCommons($mdToast) {
		var vm = this;

		vm.mensaje = function(mensaje) {

			$mdToast.show($mdToast.simple().textContent(mensaje).position('bottom center') // or 'bottom center
				.hideDelay(5000));
		}

	} // function
})(); // anonimo

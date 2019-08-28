(function() {
	'use strict';

	angular
		.module('chasqui')
		.run(runBlock);

	/** @ngInject */
	function runBlock($log, $rootScope, $state, us, usuario_dao) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if (us.isUndefinedOrNull(toState.auth))
				toState.auth = false

			if (toState.auth && (!usuario_dao.isLogged())) {
				$log.debug("ir a logu !!!", toState.name);
				event.preventDefault();
				$state.go('catalog.login', { toPage: toState.name })
			}

		});
	}

})();

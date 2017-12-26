(function() {
	'use strict';

	angular
		.module('chasqui')
		.run(runBlock);

	/** @ngInject */
	function runBlock($log, $rootScope, $state, StateCommons, us, usuario_dao) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			$log.debug("is log", usuario_dao.isLogged());
			$log.debug("devbe ", toState.auth);

			if (us.isUndefinedOrNull(toState.auth))
				toState.auth = false

			if (toState.auth && (!usuario_dao.isLogged())) {
				$log.debug("ir a logu !!!", toState.name);
				event.preventDefault();
				$state.go('login', { toPage: toState.name })
			}

		});


		$log.debug('runBlock end');
	}

})();

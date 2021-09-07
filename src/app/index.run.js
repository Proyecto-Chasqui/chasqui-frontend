(function() {
	'use strict';

	angular
		.module('chasqui')
		.run(runBlock);

	/** @ngInject */
	function runBlock($log, $rootScope, $state, us, usuario_dao) {

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

			if (us.isUndefinedOrNull(toState.auth))
				toState.auth = false

			if (toState.auth && (!usuario_dao.isLogged())) {
				$log.debug("ir a logu !!!", toState.name);
        event.preventDefault();

        const catalogShortname = window.location.href.slice(
          window.location.href.indexOf("#")+2,
          window.location.href.indexOf("/", window.location.href.indexOf("#")+2)
        )

        toParams.catalogShortName = catalogShortname;
        toParams.toPage = toState.name;
				$state.go('catalog.login', toParams);
			}

		});
	}

})();

(function() {
	'use strict';

	angular.module('chasqui').service('sellerService', sellerService);

	function sellerService(restProxy, $q, REST_ROUTES, promiseService) {
		var vm = this;

		vm.getSellers = function() {
      return promiseService.doGet(REST_ROUTES.sellers, {});
    }
    
		vm.getSellersTags = function() {
      return promiseService.doGet(REST_ROUTES.sellersTags, {});
    }
    
		vm.getSellersWithTags = function(selectedTags) {
      return promiseService.doGet(REST_ROUTES.sellersWithTags, selectedTags);
    }

		vm.getSeller = function(sellerId) {
			return promiseService.doGet(REST_ROUTES.seller(sellerId), {});
		}
        
    vm.getSellerIndividualQuestions = function(sellerId){
        return promiseService.doGet(REST_ROUTES.sellerIndividualQuestions(sellerId), {});
    }
    
    vm.getSellerColectiveQuestions = function(sellerId){
        return promiseService.doGet(REST_ROUTES.sellerColectiveQuestions(sellerId), {});
    }
    
    vm.getSellerZones = function(sellerId){
        return promiseService.doGet(REST_ROUTES.sellerZones(sellerId), {});
    }

	}
})();
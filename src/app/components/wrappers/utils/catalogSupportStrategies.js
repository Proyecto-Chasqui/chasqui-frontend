
    angular.module('chasqui').service('catalogSupportStrategies', catalogSupportStrategies);
    
    /* Given a list of strategies, returns true if current catalog supports those strategies
     */
	function catalogSupportStrategies() {
        
        function parseStrategies(strategiesString){
            return strategiesString.split(" ");
        }
        
        return function(catalog, strategiesString){
            var strategies = parseStrategies(strategiesString);
            return strategies.reduce(function(r,s){
                return r || catalog.few[s];
            }, false);
        }
    }
    
    
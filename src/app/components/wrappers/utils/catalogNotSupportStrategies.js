angular.module('chasqui').service('catalogNotSupportStrategies', catalogNotSupportStrategies);
    
    /* Given a list of strategies, returns true if current catalog supports those strategies
     */
	function catalogNotSupportStrategies() {
        
        function parseStrategies(strategiesString){
            return strategiesString.split(" ");
        }
        
        return function(catalog, strategiesString){
            var strategies = parseStrategies(strategiesString);
            return strategies.reduce(function(r,s){
                return r && (s != "" && !catalog.few[s]);
            }, true);
        }
    }
    
    
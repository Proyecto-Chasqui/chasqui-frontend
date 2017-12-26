angular.module('chasqui').factory('groups_dao', 
                            ['ls_connection',
                    function(ls_connection){
    
                        
    function init(){
        ls_connection.init({
            groups: []
        });
        console.log("Starting groups_dao:", groups());
    }
                        
    init();
    
    ///////////////////////////////////////////////////////////
                        
    function reset(){
        console.log("RESET");
        init();
    }              
                        
    function newGroup(group){
        ls_connection.modifyField("groups", function(groups){
            groups.push(group);
            return groups;
        });
    }
                        
    function groups(){
        return ls_connection.get("groups");
    }
    
    function getGroup(groupId){
        return groups().filter(function(g){return g.idGrupo == groupId})[0];
    }
                        
    function deleteGroup(groupId){
        ls_connection.modifyField("groups", function(groups){
            groups.splice(groups.map(function(g){return g.idGrupo}).indexOf(groupId), 1);
            return groups;
        });
    }
                       
    function modifyGroup(id, modification){
        var group = getGroup(id);
        deleteGroup(id);
        newGroup(modification(group));
    }
                        
    //////////////////////////                        
                        
    return {
        newGroup: newGroup,
        deleteGroup: deleteGroup,
        getGroup: getGroup,
        getGroups: groups, 
        modifyGroup: modifyGroup,
        reset: reset
    }
    
}]);
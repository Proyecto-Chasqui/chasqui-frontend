angular.module('chasqui').factory('navigation_state', 
                            ['ls_connection',
                    function(ls_connection){
    
                        
    function init(){
        console.log("Init navigation_state");
        ls_connection.init({
            selectedTab: ""
        });
    }
                        
    init();
          
    //////////////////////////////////////////////
    
    var WELCOME        =        "WELCOME";
    var HOW_TO_BUY     =     "HOW_TO_BUY";
    var CATALOG        =        "CATALOG";
    var MY_ORDERS      =      "MY_ORDERS";
    var MY_GROUPS      =      "MY_GROUPS";
    var PERFIL         =         "PERFIL";
    var UNSELECTED_TAB = "UNSELECTED_TAB";
                        
                        
    function goWelcomeTab(){
        goTab(WELCOME);
    }    
    function goHowToBuyTab(){
        goTab(HOW_TO_BUY);
    }    
    function goCatalogTab(){
        goTab(CATALOG);
    }    
    function goMyOrdersTab(){
        goTab(MY_ORDERS);
    }    
    function goMyGroupsTab(){
        goTab(MY_GROUPS);
    } 
    function goPerfilTab(){
        goTab(PERFIL);
    }
    function unselectTabs(){
        goTab(UNSELECTED_TAB);
    }
                        
    function goTab(tab){
        ls_connection.save("selectedTab", tab);
    }
                        
    function getSelectedTab(){
        return ls_connection.get("selectedTab");
    }
                      
    //////////////////////////                        
                        
    return {
        goWelcomeTab: goWelcomeTab,
        goHowToBuyTab: goHowToBuyTab,
        goCatalogTab: goCatalogTab,
        goMyOrdersTab: goMyOrdersTab,
        goMyGroupsTab: goMyGroupsTab,
        goPerfilTab: goPerfilTab,
        unselectTabs: unselectTabs,
        getSelectedTab: getSelectedTab
    }
    
}]);
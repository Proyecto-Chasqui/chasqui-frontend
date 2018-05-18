angular.module('chasqui').factory('navigation_state', 
                            ['ls_connection', '$mdDialog',
                    function(ls_connection, $mdDialog){
    
                        
    function init(){
        console.log("Init navigation_state");
        ls_connection.init({
            selectedTab: ""
        });
    }
                        
    init();
          
    //////////////////////////////////////////////
    
    var WELCOME         =         "WELCOME";
    var HOW_TO_BUY      =      "HOW_TO_BUY";
    var CATALOG         =         "CATALOG";
    var MY_ORDERS       =       "MY_ORDERS";
    var MY_GROUPS       =       "MY_GROUPS";
    var MY_NODES        =        "MY_NODES";
    var DELIVERY_POINTS = "DELIVERY_POINTS";
    var PROFILE          =         "PROFILE";
    var UNSELECTED_TAB  =  "UNSELECTED_TAB";
                        
                     
    function goToTab(tab){
        return function(){
            $mdDialog.hide();
            goTab(tab);
        }
    }
                        
    function goTab(tab){
        ls_connection.save("selectedTab", tab);
    }
                        
    function getSelectedTab(){
        return ls_connection.get("selectedTab");
    }
                      
    //////////////////////////                        
                        
    return {
        goWelcomeTab: goToTab(WELCOME),
        goHowToBuyTab: goToTab(HOW_TO_BUY),
        goCatalogTab: goToTab(CATALOG),
        goMyOrdersTab: goToTab(MY_ORDERS),
        goMyGroupsTab: goToTab(MY_GROUPS),
        goMyNodesTab: goToTab(MY_NODES),
        goDeliveryPointsTab: goToTab(DELIVERY_POINTS),
        goPerfilTab: goToTab(PROFILE),
        
        unselectTabs: goToTab(UNSELECTED_TAB),
        getSelectedTab: getSelectedTab
    }
    
}]);
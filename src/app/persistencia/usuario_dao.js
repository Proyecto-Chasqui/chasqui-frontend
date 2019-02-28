angular.module('chasqui').factory('usuario_dao', usuario_dao);

function usuario_dao(ls_connection, $log){                        
                                  
    function init(){
        if(!isLogged() && getUsuario() == undefined){
            $log.debug("Starting usuario_dao");
            ls_connection.init({
                usuario: {},
                isLogged: false
            });
        }            
    }
                        
    init();
                        
    ///////////////////////////////////////
                        
    function logInUsuario(usuario){
        ls_connection.save("usuario", usuario);
        ls_connection.save("isLogged", true);
    }
                        
    function logOutUsuario(){
        ls_connection.save("usuario", {});
        ls_connection.save("isLogged", false);
    }
       
    
    function getUsuario(){
        return ls_connection.get("usuario");
    }
    
    function isLogged(){
        return ls_connection.get("isLogged");
    }
                        
    function getToken(){
        return ls_connection.get("usuario").token;
    }
                        
    return {
        logIn: logInUsuario,
        logOut: logOutUsuario, 
        getUsuario: getUsuario,
        isLogged: isLogged, 
        getToken: getToken
    }
    
}
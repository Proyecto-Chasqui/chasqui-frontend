angular.module('chasqui').directive('formUsuario', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'FormUsuarioController',
        scope: {
            new: '=',               // False by default. If true, start a new profile. If false, the
                                    // directive MUST BE USED with user logged becouse it will try to 
                                    // load user profile info
            
            labelButtonLabel: '@',  // Sin label no se muestra el boton
            labelButtonAction: '=',
            labelButtonShow: '=',    /* Function 1. 
                                     * PARAM: profile
                                     * RETURN: boolea that denotes if the button have to be showed
                                     */
            
            buttonCancelLabel: '@', // Sin label no se muestra el boton
            buttonCancelAction: '=',
            buttonCancelShow: '=',    /* Function 1. 
                                     * PARAM: profile
                                     * RETURN: boolea that denotes if the button have to be showed
                                     */
            
            buttonNextLabel: '@',   // Sin label no se muestra el boton
            buttonNextAction: '=',
            buttonNextShow: '=',    /* Function 1. 
                                     * PARAM: profile
                                     * RETURN: boolea that denotes if the button have to be showed
                                     */
                        
            buttonEditLabel: '@',   // Sin label no se muestra el boton
            buttonEditAction: '=',
            buttonEditShow: '=',    /* Function 1. 
                                     * PARAM: profile
                                     * RETURN: boolea that denotes if the button have to be showed
                                     */
            
            
            disableField: '=',  /* >>[REQUIRED]<< Función 1 para desactivar la modificación de los campos. 
                                 * PARAM:   nombre del campo
                                 * RETURN:  Si el campo debe estar desactivado
                                 * Campos:  ['nombre', 'apellido', 'apodo', 
                                             'telCel', 'telFijo', 
                                             'email', 'emailVerification',
                                             'password', 'passwordVerification']
                                 */
            
            hideField: '=',  /* >>[REQUIRED]<< Función 1 para ocultar campos. 
                              * PARAM:   nombre del campo
                              * RETURN:  Si el campo debe estar oculto
                              * Campos:  ['nombre', 'apellido', 'apodo', 
                                          'telCel', 'telFijo', 
                                          'email', 'emailVerification',
                                          'password', 'passwordVerification']
                             */
            disableAvatarSelection: '=' /* Function 1. Denota si debe estar desactivada la seleeccion de avatar. 
                                         * False por defecto.
                                         */
        },
        templateUrl: 'app/comercio/administracion/formularios/form-usuario/form-usuario.tmpl.html'
      };
        
}]);
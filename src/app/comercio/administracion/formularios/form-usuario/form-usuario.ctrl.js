(function() {
	'use strict';

	angular.module('chasqui').controller('FormUsuarioController',
		FormUsuarioController);

	/**
	 * Formulario para crear un grupo
	 */
	function FormUsuarioController($log, $state, ToastCommons, StateCommons, $scope, $timeout, perfilService, us, usuario_dao, REST_ROUTES, URLS) {
        
        
        var fields = ["nombre", "apellido", "nickName", 
                              "telefonoMovil", "telefonoFijo", 
                              "email", "emailVerification", 
                              "password", "passVerification"];
        
        
		function init(){
            
            function checkPassword(form){
                checkEquals(form, "password", "passVerification");
            }
            
            function checkMail(form){
                checkEquals(form, "email", "emailVerification");
            }
            
            function checkEquals(form, originField, checkingField){
                if(form[originField] && form[checkingField]){
                    form[checkingField].$setValidity("notMatch", form[originField].$viewValue === form[checkingField].$viewValue );
                }
            }
            
            
            $scope.fieldRows = [
                                    [
                                        {
                                            name: "nombre",
                                            translate: "NOMBRE",
                                            model: "nombre",
                                            required: function(){return true},
                                            type: "text",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "NOMBRE_ERROR"
                                                }
                                            ]
                                        },{
                                            name: "apellido",
                                            translate: "APELLIDO",
                                            model: "apellido",
                                            required: function(){return true},
                                            type: "text",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "APELLIDO_ERROR"
                                                }
                                            ]
                                        },{
                                            name: "apodo",
                                            translate: "APODO",
                                            model: "nickName",
                                            required: function(){return true},
                                            type: "text",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "APODO_ERROR"
                                                }
                                            ]
                                        }
                                    ],[
                                       {
                                            name: "telCel",
                                            translate: "TEL_CEL",
                                            model: "telefonoMovil",
                                            required: function(){
                                                return !parseInt($scope.profile.telefonoFijo) > 0;
                                            },
                                            type: "text",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "TEL_CEL_ERROR"
                                                }
                                            ]
                                        },{
                                            name: "telFijo",
                                            translate: "TEL_FIJO",
                                            model: "telefonoFijo",
                                            required: function(){ 
                                                return !parseInt($scope.profile.telefonoMovil) > 0;
                                            },
                                            type: "text",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "TEL_FIJO_ERROR"
                                                }
                                            ]
                                        } 
                                    ],[
                                       {
                                            name: "email",
                                            translate: "EMAIL",
                                            model: "email",
                                            required: function(){return true},
                                            type: "email",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "EMAIL_ERROR"
                                                }
                                            ],
                                           onChange: checkMail
                                        },{
                                            name: "emailVerification",
                                            translate: "REP_EMAIL",
                                            model: "emailVerification",
                                            required: function(){return true},
                                            type: "email",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "REP_EMAIL_ERROR"
                                                },{
                                                    name: "notMatch",
                                                    label: "EMAIL_NOT_MATCH_ERROR"
                                                }
                                            ],
                                            onChange: checkMail
                                        } 
                                    ],[
                                        {
                                            name: "password",
                                            translate: "PASS",
                                            model: "password",
                                            required: function(){return true},
                                            disclaimer: "MINIMUM_PASS_LENGHT",
                                            type: "password",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "PASS_ERROR"
                                                },{
                                                    name: "minlength",
                                                    label: "MIN_LENGTH_PASS_ERROR"
                                                },{
                                                    name: "maxlength",
                                                    label: "MAX_LENGTH_PASS_ERROR"
                                                }
                                            ],
                                            minLength: 10,
                                            maxLength: 26,
                                            onChange: checkPassword
                                        },{
                                            name: "passVerification",
                                            translate: "REP_PASS",
                                            model: "passVerification",
                                            required: function(){return true},
                                            type: "password",
                                            errors: [
                                                {
                                                    name: "required",
                                                    label: "REP_PASS_ERROR"
                                                },{
                                                    name: "notMatch",
                                                    label: "PASS_NOT_MATCH_ERROR"
                                                }
                                            ],
                                            onChange: checkPassword
                                        }
                                    ]
                                ];
            
            $log.debug("controler FormUsuarioController", $scope.profile);
		}
        
        $scope.labelButtonSave = function(profile){
            setUserAvatar($scope.avatarSelected);
            $scope.labelButtonAction(profile)
        }
        
        $scope.buttonNextSave = function(profile){
            setUserAvatar($scope.avatarSelected);
            $scope.buttonNextAction(profile)
        }
    
        /// Avatar
        
    
        // Configuracion del tamaño del avatar. Estos parametros tienen que ir en sintonia con el tamaño de
        // los avatars por defecto
        
        var avatar_height = 40;
        var avatar_width = 40;
        
        
        // [0..3]   : avatars predeterminados
        // 4        : avatar cargado por usuario
        var avatars_id = [0,1,2,3]; 
        var startAvatar = 0;
        
        var userLoadedAvatar = false;
        $scope.preds_avatars = avatars_id.map(function(a_id){
                return {
                    id: getAvatarId(a_id),
                    src: getAvatarSrc(a_id),
                    extension: ".jpg"
                }
            });          
        
        
        function getAvatarId(avatar_id){
            return 'avatar_' + avatar_id;
        }
        
        function getAvatarSrc(avatar_id){       
            return './assets/images/avatar_' + avatar_id + '.svg';
        }
        
        $scope.selectAvatar = function(avatar){
            $log.debug("Select avatar:", avatar);
            $scope.avatarSelected = avatar;
        }
        
        $scope.preSelectAvatar = function(avatar_id){
            var style = document.getElementById(avatar_id).style;
            //$log.debug("Style: ", style.border);
            style.border = "thick solid #0000FF";
        }
        
        $scope.desPreSelectAvatar = function(avatar_id){
            var style = document.getElementById(avatar_id).style;
            //$log.debug("Style: ", style.border);
            style.border = "";
        }
        
        /*
         * Prop: setea los campos del objeto user para que hagan referencia al avatar seleccionado
         */
        function setUserAvatar(objAvatar){
            $log.debug("Avatar- setUserAvatar", objAvatar)
            var avatar = document.getElementById(objAvatar.id);
            $log.debug("Avatar selected: ", avatar);
                        
            var canvas = document.createElement("canvas");
            canvas.height = avatar_height;
            canvas.width = avatar_width;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(avatar, 0, 0, avatar_width, avatar_height);   

            $scope.profile['avatar'] =  base64data(canvas.toDataURL());
            $scope.profile['extension'] = $scope.avatarSelected.extension;
            
            $log.debug("User avatar modified: ", $scope.profile['avatar']);
        }
        
        
        function resizeImg(id, img, maxWidth, maxHeight, callback){
            
            var img_avatar = new Image();
            img_avatar.onload = function() {
                // Resize
                
                var canvas_resize = document.createElement("canvas");
                var width = 0;
                var height = 0;
                var sourceX = 0;
                var sourceY = 0
                
                width = this.width;
                height = this.height;
                $log.debug("onload: ", "Width: ", width, ", Heigth: ", height);
                $log.debug("Avatar url: ", this.src);

                if(width/maxWidth > height/maxHeight){
                    $log.debug("max width, ", width * maxHeight / height);
                    width = Math.ceil(width * maxHeight / height);
                    height = maxHeight;
                    sourceX = Math.ceil((width - maxWidth) / 2);
                }else{
                    $log.debug("max height, ", height * maxWidth / width);
                    height = Math.ceil(height * maxWidth / width);  
                    width = maxWidth;
                    sourceY = Math.ceil((height - maxHeight) / 2);
                }

                canvas_resize.width = width;
                canvas_resize.height = height;
                var ctx_resize = canvas_resize.getContext("2d");
                ctx_resize.drawImage(this, 0,       0,       width,    height);
                
                var img_avatar_resize = new Image();
                
                img_avatar_resize.onload = function() {
                    // Recorte de la imagen
                    
                    var canvas_crop = document.createElement("canvas");
                    canvas_crop.width = maxWidth;
                    canvas_crop.height = maxHeight;
                    
                    $log.debug("Crop: ", canvas_crop);
                    $log.debug("Image: ", this);
                    
                    var ctx_crop = canvas_crop.getContext("2d");
                    
                    ctx_crop.drawImage(this, sourceX, sourceY, maxWidth, maxHeight, 
                                         0,       0,       maxWidth, maxHeight);
                    
                    
                    // asigna a la imagen referenciada por <id> la imagen recortada y redimensionada
                    document.getElementById(id).src = canvas_crop.toDataURL();    
                    $log.debug("cropted w: ", canvas_crop.width, "cropted h: ", canvas_crop.height, " img cropted:", document.getElementById(id).src); 
                    
                    callback();
                }
                $log.debug("resized w: ", canvas_resize.width, "resized h: ", canvas_resize.height, " img resized:", canvas_resize.toDataURL());
                img_avatar_resize.src = canvas_resize.toDataURL();
                
            };
            img_avatar.src = img.src;
        }
        
        
        $scope.cargarAvatar = function(element){
            $scope.$apply(function(scope) {
                var img_avatar = new Image();
                img_avatar.src = URL.createObjectURL(element.files[0]);
                resizeImg("custom_avatar", img_avatar, avatar_height, avatar_width, function(){
                    userLoadedAvatar = true;
                    $scope.avatar = {
                        extension: extensionDe(element.files[0].name),
                        avatar:  base64data(document.getElementById("custom_avatar").src)
                    };
                    startAvatar(4);
                });
             });
        }
        
        
        function extensionDe(nombreDelArchivo){
            return nombreDelArchivo.substring(nombreDelArchivo.lastIndexOf('.')).toLowerCase();
        }
        
        function base64data(img){
            return img.substring(img.lastIndexOf(",") + 1);
        }
        
        function getAvatarFromUserToken(user){
            return {
                    id: "avatarSelected",
                    src: URLS.be_base + user.avatar,
                    extension: extensionDe(user.avatar)
                }
        }
        
        
        
        if($scope.new){
            $scope.profile = fields.reduce(function(r, field){
                                    r[field] = "";
                                    return r;
                                    }, {});
            $scope.avatarSelected = $scope.preds_avatars[startAvatar];
            init();
        }else{
			function doOk(response) {
				$log.debug("callVerUsuario", response);
				$scope.profile = response.data;
                //$scope.avatarSelected = getAvatarFromUserToken(usuario_dao.getUsuario());
                // TODO hacer que el avatarSelected sea el mismo que el del usuario
                $scope.avatarSelected = $scope.preds_avatars[startAvatar];
                init();
			}
			perfilService.verUsuario().then(doOk);
        }
        
	}
    

})();

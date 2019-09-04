(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ComoComprarController', ComoComprarController);

  /** @ngInject */
  function ComoComprarController($log, navigation_state, $scope) {
    $log.debug('ComoComprarController ..... ')
    navigation_state.goHowToBuyTab();
      

    $scope.showHelpsAnswer = showHelpsAnswer;

    $scope.instruccionesCards = [
        /*{
            titulo: "Ingresa un catalogo",
            contenido: "Ingresa a cada catálogo para poder ver sus productos."
        },*/{
            titulo: "Elegí tu forma de consumo",
            contenido: "Chasqui te permite comprar de forma colectiva o individual."
        },{
            titulo: "Arma tu pedido", 
            contenido: "Elegí tus productos y completa tu compra."
        },{
            titulo: "Coordinar con el vendedor",
            contenido: "Coordina la fecha y lugar de entrega o retiro."
        }
    ];
      
    $scope.instrucciones = [
        {
            titulo: "¿Cómo me registro?",
            id: "registracion",
            pasos: [{
                        principal: "Haga click en [INGRESA].",
                        subPasos:[]
                     },{
                        principal: "Haga click en [SOY NUEVO!].",
                        subPasos:[]
                     },{
                        principal: "Complete el formulario (todos los campos son obligatorios):",
                        subPasos:[
                            "El email debe ser uno valido, para validar que llegan los emails para futuras invitaciones.",
                            "La contraseña debe tener más de 10 caracteres. Recomendamos no usar la misma contraseña del email."
                        ]
                     },{
                        principal: "Haga click [REGISTRARME].",
                        subPasos:[]
                     },{
                        principal: "Inicie sesión con el usuario registrado.",
                        subPasos:[]
                     }
                    ]
        }, {
            titulo: "¿Cómo agrego un domicilio?",
            id: "agregarDomicilio",
            pasos: [{
                        principal: "Vaya a Perfil.",
                        subPasos:[]
                     },{
                        principal: "Desplacese hasta abajo y haga clic en [NUEVA].",
                        subPasos:[]
                     },{
                        principal: "Complete todos los campos (piso/dpto es opcional); debe ser una dirección real.",
                        subPasos:[
                            "Luego de completar todos los campos, haga clic en [BUSCAR] y espere que aparezca un mapa.",
                            "Confirme la posición haciendo click en [Es Correcta]."
                        ]
                     },{
                        principal: "Haga click en [GUARDAR].",
                        subPasos:[]
                     }
                    ]
        }, {
            titulo: "¿Cómo realizo una compra individual?",
            id: "realizarCompraIndividual",
            pasos: [{
                        principal: "Vaya a Catálogo.",
                        subPasos:[]
                     },{
                        principal: "Seleccione el changuito donde va a cargar los productos. Le van a aparecer diferentes opciones:",
                        subPasos:[
                            "El changuito 'Personal' es para compras individuales.",
                            "Además, le van a figurar todos los grupos de compra colectiva en los que esté."
                        ]
                     },{
                        principal: "Seleccione los productos que desee comprar.",
                        subPasos:[
                            "Haga click en [AGREGAR] del producto que desee.",
                            "Elija la cantidad que desee."
                        ]
                     },{
                        principal: "Una vez finalizada la compra, vaya a Mis Pedidos.",
                        subPasos:[]
                     },{
                        principal: "Haga click en [CONFIRMAR].",
                        subPasos:[]
                     },{
                        principal: "Seleccione un domicilio y haga click [CONFIRMAR].",
                        subPasos:[]
                     }
                    ]
        }, {
            titulo: "¿Cómo realizo una compra colectiva?",
            id: "realizarCompraColectiva",
            pasos: [{
                        principal: "Cree un grupo:",
                        subPasos:[
                            "Vaya a Mis Grupos.",
                            "Haga click en [CREAR GRUPO].",
                            "Elija un nombre para el grupo y una descripción."
                        ]
                     },{
                        principal: "Si usted es administrador de un grupo, puede invitar amigos a su grupo:",
                        subPasos:[
                            "Vaya a Mis Grupos.",
                            "Seleccione el grupo al que desee invitar amigos.",
                            "Haga click en el ícono +.",
                            "Escriba el mail de su amigo. Le llegará un mail y, si ya tiene una cuenta en Chasqui, una notificación con la invitación al grupo."
                        ]
                     },{
                        principal: "Vaya a Catálogo y en vez de compra individual seleccione el grupo de compra colectiva que desee. El funcionamiento es el mismo que en el caso de compra individual.",
                        subPasos:[
                            "Recuerde confirmar su pedido en Mis Pedidos."
                        ]
                     },{
                        principal: "Si usted es administrador del grupo, es NECESARIO que cierre el pedido antes de la fecha de entrega. De otra forma el pedido no será entregado.",
                        subPasos:[
                            "Vaya a Mis Grupos.",
                            "Seleccione el grupo al que le desee cerrar el pedido.",
                            "Haga click en [CONFIRMAR PEDIDO].",
                            "Seleccione el domicilio de entrega."
                        ]
                     },{
                        principal: "Tenga en cuenta que una vez cerrado el pedido, ningún miembro del grupo podrá modificar o agregar pedidos.",
                        subPasos:[]
                     }
                    ]
        }
    ];
      

    function showHelpsAnswer(groupIndex){
      $scope.showHelp = $scope.showHelp.map(function(o,i){return i == groupIndex && !o});
    }
    


    function init(){
      $scope.showHelp = $scope.instrucciones.map(function(i){return false});
    }

    init();
    
  }
})();

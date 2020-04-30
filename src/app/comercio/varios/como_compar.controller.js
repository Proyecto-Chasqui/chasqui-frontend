(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('ComoComprarController', ComoComprarController);

  /** @ngInject */
  function ComoComprarController($log, navigation_state, $scope, contextPurchaseService, contextCatalogObserver) {
    $log.debug('ComoComprarController ..... ')
    navigation_state.goHowToBuyTab();
      
    $scope.showHelpQuestions = showHelpQuestions;
    $scope.selectedQuestions = 0;
    $scope.showHelpsAnswer = showHelpsAnswer;

    function showHelpQuestions(index){
      $scope.selectedQuestions = index;
    }

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
      
    $scope.questionsGroups = [
      {
        // General
        questions: [
          {
            titulo: "¿Cómo me registro?",
            pasos: [
              {
                principal: 'Haga click en "Ingresa". ',
                subpasos: []
              }, {
                principal: 'Haga click en "Registrarme".',
                subpasos: []
              }, {
                principal: 'Complete el formulario (todos los campos son obligatorios):',
                subpasos: [
                  'El email debe ser uno valido, para validar que llegan los emails para futuras invitaciones.,',
                  'La contraseña debe tener más de 10 carácteres. Recomendamos no usar la misma contraseña del email.',
                ]
              }, {
                principal: 'Haga click "Registrarme".',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo agrego un domicilio?",
            pasos: [
              {
                principal: 'Estando logeado, haga clic sobre su nombre de usuario arriba a la derecha para acceder al perfil.',
                subpasos: []
              }, {
                principal: 'Seleccione el tab "Direcciones de envio".',
                subpasos: []
              }, {
                principal: 'Haga clic en "Nueva dirección".',
                subpasos: []
              }, {
                principal: 'Cambie el apodo de "nueva dirección" a otra que le permita idenficar de manera agíl a que dirección se refiere, por ejemplo "casa" o "trabajo"',
                subpasos: []
              }, {
                principal: 'Complete los campos con *.',
                subpasos: []
              }, {
                principal: 'Haga clic en "Siguiente".',
                subpasos: []
              }, {
                principal: 'Confirme si es correcta la ubicación de la dirección.',
                subpasos: []
              }, {
                principal: 'Haga clic en "Guardar".',
                subpasos: []
              }, {
                principal: 'Si todo esta correcto, deberá ver un aviso de que la dirección fue guardada correctamente.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo edito un domicilio?",
            pasos: [
              {
                principal: 'Estando logeado, haga clic sobre su nombre de usuario arriba a la derecha para acceder al perfil.',
                subpasos: []
              },{
                principal: 'Seleccione el tab "Direcciones de envio".',
                subpasos: []
              },{
                principal: 'Seleccione el tab de la dirección que desea editar.',
                subpasos: []
              },{
                principal: 'Cambie los campos que desee.',
                subpasos: []
              },{
                principal: 'Haga clic en "Siguiente".',
                subpasos: []
              },{
                principal: 'Confirme si es correcta la ubicación de la dirección.',
                subpasos: []
              },{
                principal: 'Haga clic en "Guardar".',
                subpasos: []
              },{
                principal: 'Si todo esta correcto, deberá ver un aviso de que la dirección fue guardada correctamente.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo edito los datos de mi usuario?",
            pasos: [
              {
                principal: 'Estando logeado, haga clic sobre su nombre de usuario arriba a la derecha para acceder al perfil.',
                subpasos: []
              }, {
                principal: 'En la sección datos personales haga clic en el "lapiz" abajo a la derecha para editar.',
                subpasos: []
              }, {
                principal: 'Edite los datos que desee.',
                subpasos: []
              }, {
                principal: 'Haga clic en la ""tilde"" para confirmar los cambios.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿Cómo cambio la contraseña?",
            pasos: [
              {
                principal: 'Estando logeado, haga clic sobre su nombre de usuario arriba a la derecha para acceder al perfil.',
                subpasos: []
              }, {
                principal: 'Seleccione el tab "cambio de contraseña"',
                subpasos: []
              }, {
                principal: 'Complete los campos correspondientes.',
                subpasos: []
              }, {
                principal: 'Haga clic en "guardar contraseña".',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo puedo saber si entregan en mi domicilio?",
            pasos: [
              {
                principal: 'Para ver si el catálogo entrega en su domicilio, vaya a la sección entregas".',
                subpasos: []
              }, {
                principal: 'Si el cátalogo tiene entrega a domicilio, verá zonas marcadas en el mapa.',
                subpasos: []
              }, {
                principal: 'Ahi podrá verificar si hay una zona que tenga alcance sobre su domicilio.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo puedo saber las fechas de entrega?",
            pasos: [
              {
                principal: 'En la sección "Entregas", haga clic en las zonas definidas y podrá ver la información de entrega para esa zona.',
                subpasos: []
              }, {
                principal: 'Si el vendedor hace entregas en el local o en ferias, podrá ver los datos correspondientes haciendo clic en los puntos de retiro.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "Estoy muy cerca de una zona pero estoy fuera de su alcance, ¿esto no me permite comprar?",
            pasos: [
              {
                principal: 'El sistema permite comprar aún estando fuera de alcance, pero tenga en cuenta que deberá contactarse con el vendedor antes de hacer un pedido para evaluar si es posible su entrega, o corre el riesgo de que cancele su pedido.',
                subpasos: []
              }, {
                principal: 'Los datos para comunicarse con el vendedor estan en la sección Bienvenida.',
                subpasos: []
              }
            ]
          }
        ]
      },{
        // Individual
        questions: [
          {
            titulo: "¿Cómo realizo una compra individual?",
            pasos: [
              {
                principal: 'Vaya a Catálogo.',
                subpasos: []
              }, {
                principal: 'Elija el producto que desea agregar, es posible que se le pida seleccionar un carrito, seleccione "Pedido individual"',
                subpasos: []
              }, {
                principal: 'Agregue los productos que desee.',
                subpasos: []
              }, {
                principal: 'Tenga en cuenta que algunos catálogos poseen vencimiento en sus pedidos, generalmente de 30 min. Si el vencimiento ocurre perderá el pedido y tendrá que rehacerlo.',
                subpasos: []
              }, {
                principal: 'Luego de agregar los productos, en la parte superior derecha haga clic en "Confirmar" y proceda a completar los campos.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Qué es el monto mínimo?",
            pasos: [
              {
                principal: 'Para que el pedido sea enviado a domicilio, es necesario alcanzar un monto mínimo de compra.',
                subpasos: []
              }, {
                principal: 'Si el catálogo tiene entrega en local o ferias, solo le permitirá elegir pasar a retirar, caso contrario deberá alcanzar el monto mínimo para finalizar la compra.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Dónde puedo ver mis pedidos confirmados?",
            pasos: [
              {
                principal: 'Desde el catálogo en la sección "mis pedidos" podra ver los pedidos realizados, asi como filtrarlos por estado, Confirmado, Preparado o Entregado.',
                subpasos: []
              }, {
                principal: 'También podra ver un breve resumen del pedido y sus productos haciendo clic en la fila del pedido.',
                subpasos: []
              }, {
                principal: 'Además si confirmo el pedido el sistema le enviará un email con el resumen de la compra y los detalles de la misma.',
                subpasos: []
              }, 
            ]
          }
        ]
      },{
        // Groups
        questions: [
          {
            titulo: "¿Qué es un Grupo de Compras Colectivas?",
            pasos: [
              {
                principal: 'Un Grupo de Compras Colectivas está conformado por varias personas que se ponen de acuerdo para comprar conjuntamente a través de la comunidad de consumo solidario Chasqui.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Por qué hacer compras colectivas?",
            pasos: [
              {
                principal: "Quienes participamos en un Grupo de Compras Colectivas nos coordinamos para que sea más fácil hacer y recibir los pedidos. Haciendo compras colectivas, también reducimos los tiempos y costos de logística y contribuimos a la sustentabilidad de las iniciativas de la Economía Social y Solidaria.",
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Qué es el monto mínimo?",
            pasos: [
              {
                principal: "Para que el pedido sea enviado a domicilio, es necesario alcanzar un monto mínimo de compra.",
                subpasos: []
              }
            ]
          }, {
            titulo: "Soy administrador de un grupo, ¿qué debo hacer?",
            pasos: [
              {
                principal: 'La persona que crea el grupo es quien lo administra. Debe invitar al resto de integrantes del grupo, que tienen que aceptar la invitación siguiendo el enlace que les llega por correo. Luego, cada integrante carga su changuito del grupo y confirma su compra. Cuando nadie más del grupo quiere comprar, quien administra el grupo debe cerrar el pedido grupal (además de su pedido individual).',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo confirmo la compra colectiva?",
            pasos: [
              {
                principal: 'Para confirmar la compra colectiva, la persona que administra el grupo debe entrar a Mis grupos, hacer clic sobre el grupo indicado y hacer clic en el botón "Confirmar el pedido grupal" situado debajo. Luego de responder algunas preguntas como el lugar y la fecha de entrega, el pedido queda confirmado. Cada integrante del grupo que realizó una compra recibirá un correo con el detalle de la compra colectiva.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo abro una compra colectiva?",
            pasos: [
              {
                principal: 'Para comenzar una compra colectiva, es suficiente con que alguien que integra el grupo realice una compra en el changuito correspondiente al mismo.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo hago un pedido en el grupo?",
            pasos: [
              {
                principal: 'Cargando tu compra en el changuito del grupo. Podés hacerlo eligiendo ese changuito en el catálogo o haciendo clic en "Comprar" en "Mis grupos".',
                subpasos: []
              }
            ]
          }, {
            titulo: '¿Qué significa que un grupo este "activo"?',
            pasos: [
              {
                principal: 'Significa que alguien que integra el grupo ya realizó una compra.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo me uno a un grupo?",
            pasos: [
              {
                principal: 'Para poder unirte a un grupo tenés que recibir una invitación de quien administra el mismo, hacer clic sobre el enlace que incluye el correo y aceptar la invitación.',
                subpasos: []
              }
            ]
          }, {
            titulo: "¿Cómo agrego integrantes a un grupo?",
            pasos: [
              {
                principal: 'Para agregar integrantes al grupo tenés que ser quien lo administra. ',
                subpasos: []
              },{
                principal: 'Podés hacerlo al crear el grupo o después, entrando a "Mis grupos" y haciendo clic en "Integrantes" y luego en "Agregar integrantes".',
                subpasos: []
              },
            ]
          }, {
            titulo: "No puedo confirmar el pedido del grupo, ¿Qué debo hacer?",
            pasos: [
              {
                principal: 'El pedido colectivo no se puede confirmar si hay al menos 1 pedidos ABIERTO de algún integrande del grupo, deberan confirmar o cancelar sus respectivos pedidos para permitir confirmar el pedido colectivo.',
                subpasos: []
              }, {
                principal: 'Si esta seguro de que esta condición se cumple, por favor intente refrescar la página y reintente confirmar el pedido, si el problema persiste, comuniquese con el vendedor para resolver el inconveniente.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿Dónde puedo ver mis pedidos confirmados?",
            pasos: [
              {
                principal: 'Desde el catálogo en la sección ""mis pedidos"" podra ver los pedidos realizados, asi como filtrarlos por estado, Confirmado, Preparado o Entregado.',
                subpasos: []
              }, {
                principal: 'También podra ver un breve resumen del pedido y sus productos haciendo clic en la fila del pedido.',
                subpasos: []
              }, {
                principal: 'Además si confirmo el pedido el sistema le enviará un email con el resumen de la compra y los detalles de la misma.',
                subpasos: []
              }, {
                principal: 'Para distiguir a que grupo pertenece el pedido en la columna ""grupo del pedido"" podrá ver el nombre en el cual fue solicitado.',
                subpasos: []
              }, 
            ]
          }
        ]
      },{
        //Nodos
        questions: [
          {
            titulo: "¿Cómo doy de alta un nodo?",
            pasos: [
              {
                principal: 'Para dar de alta un nodo, primero debe solicitarlo. ',
                subpasos:[]
              }, {
                principal: 'Para solicitarlo en la sección "mis nodos" y seleccione "quiero armar mi nodo". ',
                subpasos:[]
              }, {
                principal: 'En la sección de la solicitud complete todos los campos y haga click en "Solicitar creación de nodo".',
                subpasos:[]
              }, {
                principal: 'Si todo es correcto será enviado la sección mis nodos con un aviso de que la solicitud fue enviada. ',
                subpasos:[]
              }, {
                principal: 'Solo resta esperar a que el vendedor apruebe la solicitud, el sistema le enviará un email con la acción tomada.',
                subpasos:[]
              }, 
            ]
          }, {
            titulo: "Envié una solicitud de nodo, pero quiero cancelarla ¿cómo hago?",
            pasos: [
              {
                principal: 'Si la solicitud no fue gestionada por el vendedor, en la sección "mis nodos" en la parte superior izquierda verá un botón "editar solicitud de nuevo nodo", desde ahi podrá acceder a su solicitud y cancelarla.',
                subpasos: []
              }
            ]
          }, {
            titulo: "Tengo un nodo cerrado, ¿cómo invito usuarios al mismo?",
            pasos: [
              {
                principal: 'Para invitar a integrantes a su nodo, en la sección "mis nodos" haga click en "integrantes" del nodo al que desea invitar.',
                subpasos: []
              }, {
                principal: 'En esa sección en la parte superior derecha haga click en "invitar", le pedira escribir el email del usuario a invitar.',
                subpasos: []
              }, {
                principal: 'Si no está registrado en la plataforma se lo invitará a registrase.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿En dónde gestiono las solicitudes que envian los usuario a mi nodo abierto?",
            pasos: [
              {
                principal: 'Las solicitudes se gestionan desde la sección "mis nodos". ',
                subpasos: []
              }, {
                principal: 'En el nodo que desea gestionar las solicitudes haga click en "integrantes" (verá un contador de solicitudes si posee alguna).',
                subpasos: []
              }, {
                principal: 'En esa sección haga click en "solicitudes", en la misma podrá rechazar o aceptar la misma así como ver los datos del solicitante.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿Cómo veo mas detalles de los nodos abiertos?",
            pasos: [
              {
                principa: 'En la sección de nodos abiertos, haga click en la fila del nodo que quiera ver mas detalles y se desplegará la información adicional.',
                subpasos: []
              }
            ]
          }, {
            titulo: "Envie una solicitud para ingresar a un nodo abierto, pero aún no me acepta ¿Hay alguna forma de comunicarse con el coordinador?",
            pasos: [
              {
                principal: 'Si, por medio de su email, el mismo se puede ver en los detalles adicionales del nodo abierto.',
                subpasos: []
              }
            ]
          }, {
            titulo: "Tengo un nodo abierto, pero por el momento no quiero recibir mas solicitudes, ¿Hay alguna manera de dejar de recibirlas?",
            pasos: [
              {
                principal: 'No si se pretende mantener el nodo abierto. ',
                subpasos: []
              }, {
                principal: 'Sin embargo puede cambiar el nodo a cerrado. ',
                subpasos: []
              }, {
                principal: 'Esto evitará que sea visible en la lista de nodos abiertos y por consecuente dejará de recibir solicitudes. ',
                subpasos: []
              }, {
                principal: 'Tenga en cuenta que el cambio de abierto a cerrado o viceversa será informado al Vendedor por el sistema, por lo que es posible que se comunique con usted para aclarar el motivo del cambio.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿Cómo hago para comprar en el nodo?",
            pasos: [
              {
                principal: 'Hay dos formas:',
                subpasos: []
              }, {
                principal: 'La primera es desde la sección "mis nodos". Ahí haga click en "comprar" en el nodo que desea hacer la compra, y será dirigido al catálogo para comenzar su compra.',
                subpasos: []
              }, {
                principal: 'La segunda forma es desde el catálogo. Elija el producto a agregar a su pedido y el sistema le pedirá seleccionar el nodo al cual desea hacer el pedido. ',
                subpasos: []
              }, {
                principal: 'Solo seleccione el nodo correspondiente y todos los demás productos que seleccione seran agregados al mismo.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿Cómo confirmo el pedido de mi nodo?",
            pasos: [
              {
                principal: 'En la sección "mis nodos", haga click en el nodo que desea confirmar para desplegar los detalles. ',
                subpasos: []
              }, {
                principal: 'Si las condiciones son correctas debajo aparecerá un botón "Confirmar pedido del nodo".',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "No puedo confirmar el pedido del nodo, ¿Qué debo hacer?",
            pasos: [
              {
                principal: 'El pedido colectivo no se puede confirmar si hay al menos 1 pedido ABIERTO de algún integrante del nodo.',
                subpasos: []
              }, {
                principal: 'Todos los integrantes deberán confirmar o cancelar sus respectivos pedidos para permitir confirmar el pedido colectivo.',
                subpasos: []
              }, {
                principal: 'Si esta seguro de que esta condición se cumple, por favor intente refrescar la página y reintente confirmar el pedido.',
                subpasos: []
              }, {
                principal: 'Si el problema persiste, comuniquese con el vendedor para resolver el inconveniente.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿Cómo puedo editar los datos del nodo?",
            pasos: [
              {
                principal: 'En la sección "mis nodos", en el nodo que desea editar sus datos haga click en "Administración".',
                subpasos: []
              }, {
                principal: 'Desde ahi podra cambiar los datos del mismo, asi como su tipo de nodo abierto o cerrado.',
                subpasos: []
              }, 
            ]
          }, {
            titulo: "¿Dónde puedo ver mis pedidos confirmados?",
            pasos: [
              {
                principal: 'Desde el catálogo en la sección ""mis pedidos"" podra ver los pedidos realizados, asi como filtrarlos por estado: Confirmado, Preparado o Entregado.',
                subpasos: []
              }, {
                principal: 'También podra ver un breve resumen del pedido y sus productos haciendo clic en la fila del pedido.',
                subpasos: []
              }, {
                principal: 'Además si confirmo el pedido el sistema le enviará un email con el resumen de la compra y los detalles de la misma.',
                subpasos: []
              }, {
                principal: 'Para distiguir a que grupo pertenece el pedido en la columna ""grupo del pedido"" podrá ver el nombre en el cual fue solicitado.',
                subpasos: []
              }, 
            ]
          }
        ]
      }
    ];
      

    function showHelpsAnswer(indexI,indexJ){
      console.log(indexI,indexJ,$scope.showHelp);
      $scope.showHelp[indexI] = $scope.showHelp[indexI].map(function(qs,j){
        return j == indexJ && !$scope.showHelp[indexI][indexJ];
      });
    }
    


    function init(){
      $scope.showHelp = $scope.questionsGroups.map(function(groups){
        return groups.questions.map(function(){
          return false;
        })
      });

      console.log($scope.showHelp);

      contextCatalogObserver.observe(function(){
        contextPurchaseService.getSelectedCatalog().then(function(catalog){
          $scope.catalog = catalog;
          showHelpQuestions(0);
        })
      });
    }

    init();
    
  }
})();

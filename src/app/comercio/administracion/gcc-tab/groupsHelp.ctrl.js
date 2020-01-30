(function() {
  'use strict';

  angular.module('chasqui').controller('HelpGCCController', HelpGCCController);

  
  function HelpGCCController($scope) {

    $scope.showHelpsAnswer = showHelpsAnswer;

    $scope.preguntas = [
      {
        titulo: "¿Qué es un grupo de compras colectivas?",
        pasos: [
          {
            principal: 'Un grupo de compras colectivas está conformado por varias personas que se ponen de acuerdo para comprar conjuntamente a través de la comunidad de consumo solidario Chasqui.',
            subpasos: []
          }
        ]
      }, {
        titulo: "¿Por qué hacer compras colectivas?",
        pasos: [
          {
            principal: "Quienes participamos en un grupo de compras colectivas nos coordinamos para que sea más fácil hacer y recibir los pedidos. Haciendo compras colectivas, también reducimos los tiempos y costos de logística y contribuimos a la sustentabilidad de las iniciativas de la Economía Social y Solidaria.",
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
    ];


    function showHelpsAnswer(groupIndex){
      $scope.showHelp = $scope.showHelp.map(function(o,i){return i == groupIndex && !o});
    }
    


    function init(){
      $scope.showHelp = $scope.preguntas.map(function(i){return false});
      $scope.showHelp[0] = true;
    }

    init();

  }

})();

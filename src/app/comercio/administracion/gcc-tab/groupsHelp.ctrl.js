(function() {
  'use strict';

  angular.module('chasqui').controller('HelpGCCController', HelpGCCController);

  
  function HelpGCCController($scope) {

    $scope.showHelpsAnswer = showHelpsAnswer;

    $scope.preguntas = [
      {
        titulo: "¿Qué es el monto minimo?",
        respuesta: "Para que el pedido sea enviado a domicilio, es necesario alcanzar un monto mínimo de compra."
      },{
        titulo: "Soy administrador, ¿qué debo hacer?",
        respuesta: "La persona que crea el grupo es quien lo administra. Debe invitar al resto de integrantes del grupo, que tienen que aceptar la invitación siguiendo el enlace que les llega por correo. Luego, cada integrante carga su changuito del grupo y confirma su compra. Cuando nadie más del grupo quiere comprar, quien administra el grupo debe cerrar el pedido grupal (además de su pedido individual)."
      },{
        titulo: "¿Cómo confirmo la compra colectiva?",
        respuesta: "Para confirmar la compra colectiva, la persona que administra el grupo debe entrar a Mis grupos, hacer clic sobre el grupo indicado y hacer clic sobre la barra verde \"Confirmar el pedido grupal\". Luego de responder algunas preguntas como el lugar y la fecha de entrega, el pedido queda confirmado. Cada integrante del grupo que realizó una compra recibirá un correo con el detalle de la compra colectiva."
      },{
        titulo: "¿Cómo abro una compra colectiva?",
        respuesta: "Para comenzar una compra colectiva, es suficiente con que alguien que integra el grupo realice una compra en el changuito correspondiente al mismo."
      },{
        titulo: "¿Cómo hago un pedido en el grupo?",
        respuesta: "Cargando tu compra en el changuito del grupo. Podés hacerlo eligiendo ese changuito en el catálogo o haciendo clic en \"Comprar en el grupo\" en \"Mis grupos\"."
      },{
        titulo: "¿Qué significa \"activo\"?",
        respuesta: "Significa que alguien que integra el grupo ya realizó una compra."
      },{
        titulo: "¿Cómo me uno a un grupo?",
        respuesta: "Para poder unirte a un grupo tenés que recibir una invitación de quien administra el mismo, hacer clic sobre el enlace que incluye el correo y aceptar la invitación."
      },{
        titulo: "¿Cómo agrego integrantes a un grupo?",
        respuesta: "Para agregar integrantes al grupo tenés que ser quien lo administra. Podés hacerlo al crear el grupo o después, entrando a \"Mis grupos\" y haciendo clic en \"Integrantes\" y luego en \"Agregar integrantes\"."
      },
    ];


    function showHelpsAnswer(groupIndex){
      $scope.showHelp = $scope.showHelp.map(function(o,i){return i == groupIndex && !o});
    }
    


    function init(){
      $scope.showHelp = $scope.preguntas.map(function(i){return false});
    }

    init();

  }

})();

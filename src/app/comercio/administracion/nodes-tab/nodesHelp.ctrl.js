(function() {
  'use strict';

  angular.module('chasqui').controller('NodeHelpCtrl', NodeHelpCtrl);

  
  function NodeHelpCtrl($scope) {

    $scope.showHelpsAnswer = showHelpsAnswer;

    $scope.preguntas = [
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

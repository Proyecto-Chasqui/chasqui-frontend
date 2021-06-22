(function () {
  "use strict";

  angular.module("chasqui").controller("NodesList2Ctrl", NodesListCtrl);

  function NodesListCtrl(
    URLS,
    $scope,
    $rootScope,
    $state,
    contextPurchaseService,
    nodeService,
    $log,
    toastr,
    usuario_dao,
    perfilService,
    us,
    dialogCommons,
    $mdDialog,
    agrupationTypeVAL,
    contextOrdersService,
    contextAgrupationsService
  ) {
    // Interfaz

    $scope.urlBase = URLS.be_base;
    $scope.showOptions = [];
    $scope.isLoggedUserNodeAdmin = isLoggedUserNodeAdmin;
    $scope.userIsLog = usuario_dao.isLogged();
    $scope.goToCatalog = goToCatalog;
    $scope.showGoToCatalog = showGoToCatalog;
    $scope.confirmNodeOrder = confirmNodeOrder;

    // Implementación

    $scope.isLoggedMember = function (miembro) {
      return miembro.email == usuario_dao.getUsuario().email;
    };

    function isLoggedUserNodeAdmin(node) {
      return node.esAdministrador;
    }

    function showGoToCatalog(node) {
      const pedido = node.miembros.filter(function (m) {
        return m.email == usuario_dao.getUsuario().email;
      })[0].pedido;

      return (
        pedido == null ||
        (pedido.productosResponse.length >= 0 && pedido.estado != "CONFIRMADO")
      );
    }

    function confirmNodeOrder(node) {
      var actions = {
        doOk: doConfirmOrder(node),
        doNotOk: ignoreAction
      };

      var activeMembers = node.miembros
        ? node.miembros.filter(function (m) {
            return m.pedido != null && m.pedido.estado == "CONFIRMADO";
          })
        : [];
      const productosPedidos = node.productosPedidos;

      const stats = productosPedidos.reduce(
        function (r, pp) {
          r.totalSinIncentivo += pp.precio * pp.cantidad;
          r.totalConIncentivo += (pp.precio + pp.incentivo) * pp.cantidad;
          r.incentivoTotal += pp.incentivo * pp.cantidad;
          return r;
        },
        {
          totalConIncentivo: 0,
          totalSinIncentivo: 0,
          incentivoTotal: 0
        }
      );

      var adHocOrder = {
        totalConIncentivo: stats.totalConIncentivo,
        totalSinIncentivo: stats.totalSinIncentivo,
        incentivoTotal: stats.incentivoTotal,
        montoActual: stats.totalSinIncentivo,
        nombresDeMiembros: activeMembers.map(function (m) {
          return m.nickname;
        }),
        montoActualPorMiembro: activeMembers.reduce(function (r, m) {
          r[m.nickname] = m.pedido.montoActual + m.pedido.incentivoActual;
          return r;
        }, {}),
        type: agrupationTypeVAL.TYPE_NODE,
        idDireccion: node.direccionDelNodo.id,
        node: node,
        productosResponse:
          productosPedidos ||
          activeMembers.reduce(function (r, m) {
            return r.concat(m.pedido.productosResponse);
          }, [])
      };

      $state.go("catalog.confirmOrder", {
        actions: actions,
        order: adHocOrder
      });
    }

    function doConfirmOrder(node) {
      return function (selectedAddress, answers) {
        $log.debug("callConfirmar", node);

        function doOk(response) {
          $log.debug("--- confirmar pedido response ", response.data);
          toastr.success(
            us.translate("PEDIDO_CONFIRMADO_MSG"),
            us.translate("AVISO_TOAST_TITLE")
          );
          contextOrdersService
            .confirmAgrupationOrder(
              contextPurchaseService.getCatalogContext(),
              node.id,
              agrupationTypeVAL.TYPE_NODE
            )
            .then(function () {
              contextAgrupationsService.confirmAgrupationOrder(
                contextPurchaseService.getCatalogContext(),
                node.id,
                agrupationTypeVAL.TYPE_NODE
              );
              $rootScope.$emit("nodes-information-actualized");
              $state.go("catalog.userNodes.all");
              dialogCommons.askToCollaborate();
            });
          toTop();
        }

        var params = {
          idGrupo: node.id,
          idDireccion: "",
          idPuntoDeRetiro: "",
          idZona: "",
          comentario: "",
          opcionesSeleccionadas: answers.map(function (a) {
            return {
              nombre: a.nombre,
              opcionSeleccionada: a.answer
            };
          })
        };

        nodeService
          .confirmNodeOrder(
            completeConfirmColectiveOrderParams(params, selectedAddress)
          )
          .then(doOk);
      };
    }

    function completeConfirmColectiveOrderParams(params, selectedAddress) {
      params.idDireccion = selectedAddress.selected.idDireccion;
      params.comentario = selectedAddress.particularities;
      return params;
    }

    function ignoreAction() {
      $mdDialog.hide();
    }

    function goToCatalog(node) {
      contextPurchaseService.setContextByAgrupation(node);
      $state.go("catalog.products");
    }
    // Privado

    function callQuitarMiembro(miembro, colectivo, callback) {
      $log.debug("quitar miembro", miembro, colectivo);

      var params = {
        idGrupo: colectivo.id,
        emailCliente: miembro.email
      };

      nodeService.quitarMiembro(params).then(callback);
    }

    /** Salir del nodo. Manejo del popUP */
    function exitGroup(colectivo, onOk) {
      const miembro = usuario_dao.getUsuario();

      dialogCommons.confirm(
          us.translate('SALIR'), 
          us.translate('SEGURO_SALIR'), 
          us.translate('SI_MEVOY'), 
          us.translate('CANCELAR'),
          function() {
            callQuitarMiembro(miembro, colectivo, function(){
              if(onOk) {
                onOk(miembro);
              }
              toastr.success(us.translate('TE_FUISTE_GRUPO'), us.translate('AVISO_TOAST_TITLE'));
            });
          },
          function() {
            $log.debug("se quedo");
          }
      )
   }

    function quitarMiembro(miembro, colectivo, callback) {
      // Esto es un resabio de la forma de cargar miembros
      var nombre = miembro.nickname == null ? miembro.email : miembro.nickname;
      var pregunta, confirmacion, fallo;
      if ($scope.isLoggedMember(miembro)) {
        pregunta = us.translate("SALIR_GRUPO");
        confirmacion = us.translate("SALIR");
        fallo = "No pudo salir del nodo de compra";
      } else {
        pregunta = us.translate("QUITAR_A") + nombre;
        confirmacion = us.translate("QUITARLO");
        fallo = "No se pudo quitar a " + nombre + " del nodo de compra";
      }

      dialogCommons.confirm(
        us.translate("SALIR_GRUPO_TITULO"),
        us.translate("ESTAS_SEGURO_DE") + pregunta + "?",
        us.translate("SI_QUIERO") + " " + confirmacion,
        us.translate("NO"),
        function () {
          callQuitarMiembro(miembro, colectivo, function () {
            toastr.info(
              us.translate("SE_QUITO_MIEMBRO"),
              us.translate("AVISO_TOAST_TITLE")
            );
            if (callback) {
              callback();
            }
          });
        },
        function () {
          $log.debug(fallo);
        }
      );
    }

    function toTop() {
      window.scrollTo(0, 0);
    }

    function callInvitarUsuario(email, node) {
      var doOk = function () {
        toastr.info(
          us.translate("ENVIARA_MAIL"),
          us.translate("AVISO_TOAST_TITLE")
        );
        var recienInvitado = {
          avatar: null,
          nickname: null,
          email: email,
          invitacion: "NOTIFICACION_NO_LEIDA",
          estadoPedido: "INEXISTENTE",
          pedido: null
        };

        node.miembros.push(recienInvitado);
      };

      var params = {
        idGrupo: node.id,
        emailInvitado: email
      };

      const promise = nodeService.invitarUsuario(params);

      promise.then(doOk);

      return promise;
    }

    /** habilita el panel para agregar integrantes. */
    function invitarUsuario(node, callback) {
      $log.debug("Invitar miembro al nodo");

      function doOk(mail) {
        $log.debug("Se seleccionó Invitar a usuario con mail", mail);
        callInvitarUsuario(mail, node).then(() => {
          if (callback) {
            callback();
          }
        });
      }

      function doNoOk() {
        $log.debug("Se seleccionó Cancelar");
      }

      dialogCommons.prompt(
        us.translate("INV_MIEMBRO"),
        us.translate("INGRESAR_CORREO"),
        "correo@correo.com",
        us.translate("INVITAR"),
        us.translate("CANCELAR"),
        doOk,
        doNoOk
      );
    }

    function doInvitar(e) {
      const colectivo = e.detail.colectivo;
      const onOk = e.detail.callback;
      invitarUsuario(colectivo, onOk);
    }

    function doIrAHistorial(e) {
      const colectivo = e.detail;
      $state.go("catalog.userNodes.node.historicOrders", {
        nodeId: colectivo.id
      });
    }

    function doIrAComprar(e) {
      const colectivo = e.detail;

      const nodo = Object.assign(
        {
          type: agrupationTypeVAL.TYPE_NODE
        },
        colectivo
      );

      goToCatalog(nodo);
    }

    function doIrEditar(e) {
      const nodo = e.detail;
      if (!nodo) {
        return;
      }
      $state.go("catalog.userNodes.node.admin", { nodeId: nodo.id });
    }

    function doQuitarMiembro(e) {
      const miembro = e.detail.miembro;
      const colectivo = e.detail.colectivo;
      const callback = e.detail.callback;
      quitarMiembro(miembro, colectivo, callback);
    }

    function _ensambleNodo(node) {
      //popular miembros
      return new Promise((resolve, reject) => {
        const p = Promise.all([
          nodeService
            .resumenProductosPedidosConfirmados(node.id)
            .then((r) => r.data),
          nodeService
            .pedidosLite(node.id)
            .then((r) => r.data)
            .then((d) => d.list)
        ]);

        p.then((values) => {
          node.productosPedidos = values[0];
          node.pedidos = values[1];
          node.direccionDelNodo = { id: 1 }; // a dummy
          resolve(node);
        }).catch(reject);
      });
    }

    function doConfirmarPedidoColectivo(e) {
      _ensambleNodo(e.detail).then((node) => confirmNodeOrder(node));
    }

    function doExitGroup(e) {
      const colectivo = e.detail.colectivo;
      const onOk = e.detail.callback;
      exitGroup(colectivo, onOk);
    }

    // Inicialización
    function init() {
      toTop();

      window.nodeService = nodeService;

      const chasquiColectivos = document.getElementById("chasquiColectivos");
      if (chasquiColectivos) {
        nodeService.getLoggedUser = usuario_dao.getUsuario;
        nodeService.BE_BASE = URLS.be_base;
        chasquiColectivos.setService(
          nodeService,
          contextPurchaseService.getCatalogContext()
        );

        chasquiColectivos.addEventListener("onEditar", doIrEditar);
        chasquiColectivos.addEventListener("onInvitar", doInvitar);
        chasquiColectivos.addEventListener("onIrAComprar", doIrAComprar);
        chasquiColectivos.addEventListener("onQuitarMiembro", doQuitarMiembro);
        chasquiColectivos.addEventListener("onSalirGrupo", doExitGroup);
        chasquiColectivos.addEventListener("onHistorial", doIrAHistorial);
        chasquiColectivos.addEventListener(
          "onConfirmarPedidoColectivo",
          doConfirmarPedidoColectivo
        );
        chasquiColectivos.addEventListener("onDisconnected", function () {
          document
            .querySelector("body")
            .setAttribute("style", "overflow: auto");
        });
        document
          .querySelector("body")
          .setAttribute("style", "overflow: hidden");
      }
    }

    init();
  }
})();

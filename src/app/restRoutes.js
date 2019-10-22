/* global malarkey:false, moment:false */
(function() {
    'use strict';

    angular.module('chasqui').factory('REST_ROUTES', REST_ROUTES);
    
    function REST_ROUTES(URLS) {

        return {
            PRODUCTOS_X_PAG: 12,

            INTERVALO_NOTIFICACION_MIN: 10*60000,       // en segundos

            TIEMPO_MAX_CACHE : 5 * 60,                  // en segundos

            defaultLogo: "imagenes/logo_ch_login.png",

            sellers: URLS.be_rest + "client/vendedor/all",

            seller: function(sellerId){ return URLS.be_rest + "client/vendedor/" + sellerId},
            
            sellerIndividualQuestions: function(sellerId){ return URLS.be_rest + "client/vendedor/preguntasDeConsumoIndividual/" + sellerId},
            
            sellerColectiveQuestions: function(sellerId){ return URLS.be_rest + "client/vendedor/preguntasDeConsumoColectivo/" + sellerId},
            
            sellerZones: function(sellerId){ return URLS.be_rest + "client/vendedor/zonas/" + sellerId},

            catalogo: URLS.be_rest + "client/catalogo", //Para que se deduzca de la URL

            login: URLS.be_rest + "client/sso/singIn",

            resetPass: function(email) {
                return URLS.be_rest + "client/sso/resetPass/" + email;
            },

            singUp: URLS.be_rest + "client/sso/singUp",

            singUpInvitacionGCC: URLS.be_rest + "client/sso/singUp/invitation",

            categorias: function(idVendedor) {
                return URLS.be_rest + "client/categoria/all/" + idVendedor;
            },

            productores: function(idVendedor) {
                return URLS.be_rest + "client/productor/all/" + idVendedor;
            },

            // productosSinFiltro: URLS.be_rest + "client/producto/sinFiltro",

            productosSinFiltro: function(idVendedor) {
                return URLS.be_rest + "client/producto/sinFiltro";
            },

            productosByMultiplesFiltros: function(idVendedor){
                return URLS.be_rest + "client/producto/productosByMultiplesFiltros";
            },

            medallas: URLS.be_rest + "client/medalla/all",

            imagenProducto: function(idVariante) {
                return URLS.be_rest + "client/producto/images/" + idVariante;
            },

            medallasProducto: URLS.be_rest + "client/medalla/producto/all",

            medallasProductor: URLS.be_rest + "client/medalla/productor/all",

            medallaById: function(id) {

                return URLS.be_rest + "client/producto/medalla/idMedalla/" + id;

            },

            productosByCategoria: URLS.be_rest + "client/producto/byCategoria",

            productosByProductor: URLS.be_rest + "client/producto/byProductor",

            productosByMedalla: URLS.be_rest + "client/producto/byMedalla",

            productosByMedallaProductor: URLS.be_rest + "client/producto/byMedallaProductor",

            productosByQuery: URLS.be_rest + "client/producto/byQuery",

            verUsuario: URLS.be_rest + "user/adm/read",

            editUsuario: URLS.be_rest + "user/adm/edit",

            editPassword: URLS.be_rest + "user/adm/editpassword",

            editAvatar: URLS.be_rest + "user/adm/avatar",

            verDirecciones: URLS.be_rest + "user/adm/dir",

            verPuntosDeEntrega: function(nombreVendedor){
                return URLS.be_rest + 'client/vendedor/puntosDeRetiro/' + nombreVendedor;
            },

            nuevaDireccion: URLS.be_rest + "user/adm/dir",

            actualizarDireccion: URLS.be_rest + "user/adm/dir/",

            eliminarDireccion: function(idDireccion) {
                return URLS.be_rest + 'user/adm/dir/' + idDireccion;
            },

            crearPedidoIndividual: URLS.be_rest + 'user/pedido/individual',

            verPedidoIndividual: function(idVendedor) {
                return URLS.be_rest + 'user/pedido/individual/' + idVendedor;
            },

            agregarPedidoIndividual: URLS.be_rest + 'user/pedido/individual/agregar-producto',

            confirmarPedidoIndividual: URLS.be_rest + 'user/pedido/individual/confirmar',

            quitarProductoIndividual: URLS.be_rest + "user/pedido/individual/eliminar-producto",

            cancelarPedidoIndividual: function(idPedido) {
                return URLS.be_rest + "user/pedido/individual/" + idPedido;
            },

            pedidoIndividual: function(id) {
                return URLS.be_rest + 'user/pedido/individual/' + id;
            },

            filtrarPedidosConEstado: URLS.be_rest + 'user/pedido/conEstados', // agregado por favio 12-9-17

            notificacionesNoLeidas: URLS.be_rest + "user/adm/notificacion/noLeidas",

            notificacionesLeidas: function(pagina) {
                return URLS.be_rest + "user/adm/notificacion/" + pagina;
            },

            totalNotificaciones: function(){
                return URLS.be_rest + "user/adm/notificacion/total";
            },

            productosDestacadosByVendedor: function(idVendedor) {
                return URLS.be_rest + "client/producto/destacados/" + idVendedor;
            },
            

            /* Groups */

            groupsByUser: function(idVendedor) {return URLS.be_rest + 'user/gcc/all/' + idVendedor;},

            nuevoGrupo: URLS.be_rest + "user/gcc/alta/",

            cerrarGrupo: URLS.be_rest + "user/gcc/eliminarGrupo",

            editarGrupo: function(idGrupo) {return URLS.be_rest + "user/gcc/editarGCC/" + idGrupo;},

            invitarUsuarioAGrupo: URLS.be_rest + "user/gcc/invitacion",

            getMailInvitacionAlGCC: URLS.be_rest + "client/sso/obtenerMailInvitado",

            aceptarInvitacionAGrupo: URLS.be_rest + 'user/gcc/aceptar',

            rechazarInvitacionAGrupo: URLS.be_rest + 'user/gcc/rechazar',

            quitarMiembro: URLS.be_rest + "user/gcc/quitarMiembro",

            cederAdministracion: URLS.be_rest + "user/gcc/cederAdministracion",

            crearPedidoGrupal: URLS.be_rest + "user/gcc/individual",

            pedidosByUser: function(idVendedor) {return URLS.be_rest + 'user/gcc/pedidos/' + idVendedor;},

            pedidosColectivosConEstado: URLS.be_rest + "user/pedido/pedidosColectivosConEstados",

            confirmarPedidoIndividualGcc: URLS.be_rest + "user/pedido/individualEnGrupo/confirmar",

            confirmarPedidoColectivo: URLS.be_rest + "user/gcc/confirmar",


            /* Nodos */

            nodosTodos : function(idVendedor){return URLS.be_rest + 'user/nodo/all/' + idVendedor;},

            nuevoNodo: URLS.be_rest + "user/nodo/alta",

            cerrarNodo: URLS.be_rest + "user/nodo/eliminarGrupo",

            editarNodo: URLS.be_rest + "user/nodo/editarNodo",

            invitarUsuarioANodo: URLS.be_rest + "user/nodo/enviarInvitacion",

            // getMailInvitacionAlGCC: URLS.be_rest + "client/sso/obtenerMailInvitado",

            // aceptarInvitacionAGrupo: URLS.be_rest + 'user/gcc/aceptar',

            // rechazarInvitacionAGrupo: URLS.be_rest + 'user/gcc/rechazar',

            // quitarMiembro: URLS.be_rest + "user/gcc/quitarMiembro",

            // cederAdministracion: URLS.be_rest + "user/gcc/cederAdministracion",

            // crearPedidoGrupal: URLS.be_rest + "user/gcc/individual",

            // pedidosByUser: function(idVendedor) {return URLS.be_rest + 'user/gcc/pedidos/' + idVendedor;},

            // pedidosColectivosConEstado: URLS.be_rest + "user/pedido/pedidosColectivosConEstados",

            // confirmarPedidoIndividualGcc: URLS.be_rest + "user/pedido/individualEnGrupo/confirmar",

            // confirmarPedidoColectivo: URLS.be_rest + "user/gcc/confirmar",

            
            /* Otros */

            puntosDeRetiro: function(idVendedor){ return URLS.be_rest + "client/vendedor/puntosDeRetiro/" + idVendedor;},

            datosDePortada: function(nombreCortoVendedor) {return URLS.be_rest + "client/vendedor/datosPortada/" + nombreCortoVendedor;},

            //////////////////////////////////////////////////////////
            //////////////// OTRAS CONSTANTES 

            ///// contantes de mensajes de errores conocidos
            ERROR_YA_TIENE_PEDIDO: "ya posee un pedido vigente"
        }

    };

})();

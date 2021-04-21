(function() {
    'use strict';

    angular.module('chasqui').factory('REST_ROUTES', REST_ROUTES);
    
    function REST_ROUTES(URLS) {
        return {
            PRODUCTOS_X_PAG: 12,

            INTERVALO_NOTIFICACION_MIN: 10*60000,       // en segundos

            TIEMPO_MAX_CACHE : 5 * 60,                  // en segundos

            defaultLogo: "imagenes/logo_ch_login.png",

            //sellers: URLS.be_rest + "client/vendedor/all",
            sellers: `${URLS.api}vendedores?$limit=100`,

            //sellersTags: URLS.be_rest + "client/vendedor/obtenerTags",
            sellersTags: `${URLS.api}tags`,

            //sellersWithTags: URLS.be_rest + "client/vendedor/obtenerVendedoresConTags",
            sellersWithTags: (params) => `${URLS.api}vendedores?${params}`,

            seller: function(sellerId){ return URLS.be_rest + "client/vendedor/" + sellerId},
            //seller: (sellerId) => `${URLS.api}vendedores/${sellerId}`, //revisar obtenerConfiguracionVendedor()
            
            sellerIndividualQuestions: function(sellerId){ return URLS.be_rest + "client/vendedor/preguntasDeConsumoIndividual/" + sellerId},
            
            sellerColectiveQuestions: function(sellerId){ return URLS.be_rest + "client/vendedor/preguntasDeConsumoColectivo/" + sellerId},
            
            //sellerZones: function(sellerId){ return URLS.be_rest + "client/vendedor/zonas/" + sellerId},
            sellerZones: sellerId => `${URLS.api}vendedor-retiro-zonas/?id_vendedor=${sellerId}`,

            getAddressZone: URLS.be_rest + "client/vendedor/obtenerZonaDeDireccion",

            catalogo: URLS.be_rest + "client/catalogo", //Para que se deduzca de la URL

            login: URLS.be_rest + "client/sso/singIn",

            resetPass: function(email) {
                return URLS.be_rest + "client/sso/resetPass/" + email;
            },

            singUp: URLS.be_rest + "client/sso/singUp",

            singUpInvitacionGCC: URLS.be_rest + "client/sso/singUp/invitation",

            // categorias: function(idVendedor) {
            //     return URLS.be_rest + "client/categoria/all/" + idVendedor;
            // },
            categorias: (idVendedor) => `${URLS.api}categorias?id_vendedor=${idVendedor}&$select[]=id&$select[]=nombre`,

            // productores: function(idVendedor) {
            //     return URLS.be_rest + "client/productor/all/" + idVendedor;
            // },
            productores: (idVendedor) => `${URLS.api}productores?id_vendedor=${idVendedor}&$limit=100`,

            // productosSinFiltro: URLS.be_rest + "client/producto/sinFiltro",

            productosSinFiltro: function() {
                return URLS.be_rest + "client/producto/sinFiltro";
            },

            // productosByMultiplesFiltros: function(idVendedor){
            //     return URLS.be_rest + "client/producto/productosByMultiplesFiltros";
            // },
            productosByMultiplesFiltros: (params) => `${URLS.api}productos/?${params}&ocultado=false`,

            medallas: URLS.be_rest + "client/medalla/all",

            imagenProducto: function(idVariante) {
                return URLS.be_rest + "client/producto/images/" + idVariante;
            },

            //medallasProducto: URLS.be_rest + "client/medalla/producto/all",
            medallasProducto: URLS.api + "medallas",

            //medallasProductor: URLS.be_rest + "client/medalla/productor/all",
            medallasProductor: URLS.api + "medallas-productores",

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

            //nodosAbiertos: function(idVendedor){return URLS.be_rest + "client/vendedor/nodosAbiertos/" + idVendedor;},
            nodosAbiertos: (slug) => (`${URLS.api}nodos/${slug}`),

            userRequests: function(idVendedor){return URLS.be_rest + "user/nodo/obtenerSolicitudesDePertenenciaDeUsuario/" + idVendedor;},

            sendRequest: URLS.be_rest + "user/nodo/enviarSolicitudDePertenencia",

            cancelRequest: function(idSolicitud){return URLS.be_rest + "user/nodo/cancelarSolicitudDePertenencia/" + idSolicitud;},

            getNodeRequests: function(idNodo){return URLS.be_rest + "user/nodo/obtenerSolicitudesDePertenenciaANodo/" + idNodo;},

            openRequests: function(idVendedor){return URLS.be_rest + "user/nodo/solicitudesDeCreacion/" + idVendedor;},

            nodosTodos : function(idVendedor){return URLS.be_rest + 'user/nodo/all/' + idVendedor;},

            nuevoNodo: URLS.be_rest + "user/nodo/alta",

            editarSolicitud: URLS.be_rest + "user/nodo/editarSolicitudDeCreacion",

            cancelarNuevoNodo: URLS.be_rest + "user/nodo/cancelarSolicitudDeCreacion",

            cerrarNodo: URLS.be_rest + "user/nodo/eliminarNodo",

            editarNodo: URLS.be_rest + "user/nodo/editarNodo",

            invitarUsuarioANodo: URLS.be_rest + "user/nodo/enviarInvitacion",

            declineRequest: function(idSolicitud){return URLS.be_rest + "user/nodo/rechazarSolicitudDePertenencia/" + idSolicitud;},

            acceptRequest: function(idSolicitud){return URLS.be_rest + "user/nodo/aceptarSolicitudDePertenencia/" + idSolicitud;},

            declineNodeInvitation: URLS.be_rest + 'user/nodo/rechazarInvitacion',

            acceptNodeInvitation: URLS.be_rest + 'user/nodo/aceptarInvitacion',

            // getMailInvitacionAlGCC: URLS.be_rest + "client/sso/obtenerMailInvitado",

            quitarMiembroNodo: URLS.be_rest + "user/nodo/quitarMiembro",

            // cederAdministracion: URLS.be_rest + "user/gcc/cederAdministracion",

            pedidosDeLosNodos: function(idVendedor) {return URLS.be_rest + 'user/nodo/pedidos/' + idVendedor;},

            createNodePersonalOrder: URLS.be_rest + "user/nodo/individual",

            confirmNodePersonalOrder: URLS.be_rest + "user/nodo/confirmarIndividualEnNodo",

            confirmNodeOrder: URLS.be_rest + "user/nodo/confirmar",   

            // pedidosColectivosConEstado: URLS.be_rest + "user/pedido/pedidosColectivosConEstados",

            
            /* Otros */

            //puntosDeRetiro: function(idVendedor){ return URLS.be_rest + "client/vendedor/puntosDeRetiro/" + idVendedor;},
            puntosDeRetiro: (idVendedor) => `${ URLS.api }vendedor-retiro-puntos/?id_punto_de_retiro=${idVendedor}`,

            //datosDePortada: function(nombreCortoVendedor) {return URLS.be_rest + "client/vendedor/datosPortada/" + nombreCortoVendedor;},
            datosDePortada: (slug) => (`${URLS.api}vendedores?nombre_corto_vendedor=${slug}`),

            //////////////////////////////////////////////////////////
            //////////////// OTRAS CONSTANTES 

            ///// contantes de mensajes de errores conocidos
            ERROR_YA_TIENE_PEDIDO: "ya posee un pedido vigente"
        }

    };

})();

# Chasqui Front Wed Web

Capa de front end para la aplicación Chasqui.

Ver:
  - Chasqui Back End
  - Chasqui Back Offie


### Version
1.0.0
### Tech

* [AngularJS] - HTML enhanced for web apps!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [jQuery] - duh

### Installation

Chasqui requiere [Node.js](https://nodejs.org/) .

Se necesita installar Gulp

```sh
$ npm i -g gulp
```

```sh
$ git clone [git-repo-url] chasqui
$ cd chasqui
$ npm install
$ bower install
```

Para usar en entorno de desarrollo se recomienda correrlo con gulp
```sh
$ glup serve
```

Para installar en otros entornos 
```sh
$ glup build
```
El cual genera el código fuente en la carpeta /dist

Para el caso de Tomcat copiar el la carpeta /webapps .
Por ehemplo ....\apache-tomcat-8.0.29\webapps\chasqui  .
Luego http://localhost:8081/chasqui/# .

Para el caso de GlassFish copiar el contenido de la carpeta en [GlassFish]\\domains\\domain1\\docroot\\chaqui

### Entorno

Este front end consume servicios REST de la aplicaci�n de Back End. Se debe verificar que la url de los servicios sea correcta.

Para installar en otros entornos 
```sh
$ index.constants.js
--> URL_REST_BASE
```

### Todos

 - en desarrollo
 
License
----


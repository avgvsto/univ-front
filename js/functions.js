/* Funcion que encapsula todo el desarrollo */
$(function() {
    /* Variable Glogal con el nombre del proyecto. Metodo de Proyeccion */
    var UniversidadApp = {};

    /* funcion .app, dentro de esta van las funciones autoejecutables */
    (function(app) {
        app.init = function() {
            app.loader(); // carga Loading
            app.bindings(); // funcion donde se colocan las llamadas para el desarrollo
            // Complemento del Loading. app.loader
            window.onload = function() {
                $.mobile.loading('hide');
            };
        };

        //Carga del Loading
        app.loader = function() {
            $(document).bind('mobileinit', function() {
                $.mobile.loader.prototype.options.text = "Cargando - Universidad";
                $.mobile.loader.prototype.options.textVisible = true;
                $.mobile.loader.prototype.options.theme = "f";
                $.mobile.loader.prototype.options.html = "";
            });
            $.mobile.loading('show', {
                text: 'Nombre del Proyecto',
                textVisible: true,
                theme: 'c',
                html: ""
            });

            //Load scripts dependencies
            $.getScript('js/router.js', function(data, textStatus) {
                console.info("Loading Router: " + textStatus);
                $.getScript('js/utils.js', function(data, textStatus) {
                    $.getScript('js/session-manager.js', function(data, textStatus) {
                        console.info("Loading Session Manager: " + textStatus);
                        SessionManager.access_control();
                    });
                });
            });


        };

        // Dentro de la funcion Bindings van las llamadas a las funciones del desarrollo integro
        app.bindings = function() {
            //Cargo todos los eventos posibles. Importante.
            $(document).on("pagebeforeload pageload pageloadfailed pagebeforechange pagechange pagechangefailed pagebeforeshow pagebeforehide pageshow pagehide pagebeforecreate pagecreate pageinit pageremove updatelayout", function(e) {
                //console.log(e.type);
            });

            $("#unidades").on("pagebeforeshow", function(){
                app.crearFacultades();
            });

            $("#carreras").on("pagebeforeshow", function(){
                app.crearFacultades();
            });

            // Objeto pagina #carreras (Pagina 3)
            $("#carreras").on("pagebeforeshow", function(e) {
                // Se utiliza para la captura de Id 
                var url = $(this).data("url");
                var id_Unidad = url.split("=")[1];
                if (id_Unidad) {
                    app.crearCarreras(id_Unidad);
                }
            });

            //Objeto pagina #materias (pagina 4)
            $("#materias").on("pagebeforeshow", function(e) {
                var url = $(this).data("url");
                var id_Carrera = url.split("=")[1];
                if (id_Carrera) {
                    app.crearMaterias(id_Carrera);
                }
            });

            //Objeto pagina #materia (pagina 5)
            $("#materia").on("pagebeforeshow", function(e) {
                var url = $(this).data("url");
                var id_Materia = url.split("=")[1];
                if (id_Materia) {
                    app.crearMateria(id_Materia);
                }
            });
            
            //Evento submit - Login
            $("#btn-login").click(function() {
                var data = {
                    email: $("#login #email").val(),
                    password: $("#login #password").val()
                };
                SessionManager.login( data );
                
            });

            //Evento submit - Register
            $("#btn-register").click(function() {
                var data = {
                    real_name: $("#register #real-name").val(),
                    student_file: $("#register #student-file").val(),
                    email: $("#register #email").val(),
                    password: $("#register #password").val()
                };
                SessionManager.register
            });

            $("#btn-logout").click(function() {
                SessionManager.logout();
            });

        };


        /******************************** Desarrollo de Funciones */
        
        //Envía datos para el registro del usuario
        app.submitRegister = function() {
            
            $.ajax({
                url: 'http://localhost/univ/public/users',
                type: 'post',
                dataType: 'json',
                data: data
            })
            .done(function(response) {
                console.log("Registrado");
                console.log(response);
            })
            .fail(function(response) {
                console.log("Error en el registro.");
                console.log(response);
            });
        };
        
        //Envía datos para el login del usuario
        


        //Lista de las unidades academicas #unidades
        app.crearFacultades = function() {
            $.getJSON("json/unidades.json", function(data) {
                
                var listadoUnidades = '';
                $.each(data, function(index, item) {
                    listadoUnidades += '<li><a href="#carreras?id=' + item.IdUniAca + '"><h5>' + item.Nombre + '</h5></a></li>';
                });

                $('#listaUnidades').html(listadoUnidades).listview('refresh');

            });
        };

        //Lista de las carreras #carreras
        app.crearCarreras = function(id_Unidad) {
            $.getJSON('json/carreras.json', function(data) {
                var listadoCarreras = '';
                var valor_unidad = id_Unidad;
                $.each(data, function(index, item) {
                    if (item.RefIdUniAca == valor_unidad) {
                        listadoCarreras += '<li><a href="#materias?id=' + item.IdCar + '"><h5>' + item.Nombre + ' </h5></a></li>'
                    }
                });

                $('#listaCarreras').html(listadoCarreras).listview('refresh');
            });
        };

        //Lista de la pagina #materias
        app.crearMaterias = function(id_Carrera) {
            $.getJSON('json/materias.json', function(data) {
                var listadoMaterias = '';
                var valor_carrera = id_Carrera;
                $.each(data, function(index, item) {
                    if (item.IdCar == valor_carrera) {
                        listadoMaterias += '<li><a href="#materia?id=' + item.IdMat + '"><h5>' + item.Materia + ' </h5></a></li>'
                    }
                });
                $('#listaMaterias').html(listadoMaterias).listview('refresh');
                //Uso .listview porque la info de la ficha la muestro como una lista de solo lectura
            });
        };

        //Informacion de la pagina #materia
        app.crearMateria = function(id_Materia) {
            $.getJSON('json/materias.json', function(data) {
                var nombre = '';
                var ano = '';
                var semestre = '';
                var valor_materia = id_Materia;
                $.each(data, function(index, item) {
                    if (item.IdMat == valor_materia) {
                        nombre = '<p><h2>Nombre: ' + item.Materia + ' </h2></p>'
                        ano = '<h3>Año: ' + item.Ano + ' </h3>'
                        semestre = '<h3>Semestre: ' + item.Semestre + ' </h3>'
                    }
                });
                $('p#nombre').html(nombre);
                $('p#ano').html(ano);
                $('p#semestre').html(semestre);
            });

            $.getJSON('json/materia.json', function(data) {
                var listaCorrelativasCursado = '';
                var listaCorrelativasExamen = '';
                var valor_materia = id_Materia;
                $.each(data, function(index, item) {
                    if (item.IdMat == valor_materia) {
                        if (item.TipoCorrelativa == 'Cursado')
                            listaCorrelativasCursado += '<li><a href="#materia?id=' + item.RefIdMatCor + '"><h5>' + item.Materia_Correlativa + ' </h5></a></li>'
                        else
                            listaCorrelativasExamen += '<li><a href="#materia?id=' + item.RefIdMatCor + '"><h5>' + item.Materia_Correlativa + ' </h5></a></li>'
                    }
                });
                $('#listaCorrelativasCursado').html(listaCorrelativasCursado).listview('refresh');
                $('#listaCorrelativasExamen').html(listaCorrelativasExamen).listview('refresh');
                //Uso .listview porque la info de la ficha la muestro como una lista de solo lectura
            });
        };

        app.init();
    })(UniversidadApp);
});

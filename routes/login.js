var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;


var mdAutenticacion = require('../middlewares/autenticacion');

// ==========================================
//  Autenticación De Google
// ==========================================
app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });

});

// ==========================================
//  Autenticación De Google
// ==========================================
app.post('/google', (req, res) => {

    var token = req.body.token || 'XXX';


    var client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {

            if (e) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Token no válido',
                    errors: e
                });
            }


            var payload = login.getPayload();
            var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            Usuario.findOne({ email: payload.email }, (err, usuario) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al buscar usuario - login',
                        errors: err
                    });
                }

                if (usuario) {

                    if (usuario.google === false) {
                        return res.status(400).json({
                            ok: true,
                            mensaje: 'Debe de usar su autenticación normal'
                        });
                    } else {

                        usuario.password = ':)';

                        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); // 4 horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuario,
                            token: token,
                            id: usuario._id,
                            menu: obtenerMenu(usuario.role)
                        });

                    }

                    // Si el usuario no existe por correo
                } else {

                    var usuario = new Usuario();


                    usuario.nombre = payload.name;
                    usuario.email = payload.email;
                    usuario.tarjerta = payload.tarjeta;
                    usuario.telefono = payload.telefono;
                    usuario.password = ':)';
                    usuario.img = payload.picture;
                    usuario.google = true;

                    usuario.save((err, usuarioDB) => {

                        if (err) {
                            return res.status(500).json({
                                ok: true,
                                mensaje: 'Error al crear usuario - google',
                                errors: err
                            });
                        }


                        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuarioDB,
                            token: token,
                            id: usuarioDB._id,
                            menu: obtenerMenu(usuarioDB.role)
                        });

                    });

                }


            });


        });




});

// ==========================================
//  Autenticación normal
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        console.log("en autenticacion normal....");
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    })


});



function obtenerMenu(ROLE) {
    console.log("en obtener menu....");
    var menu = [{
            titulo: 'Evento Clínico',
            icono: 'mdi mdi-hospital',
            submenu: [
                //{ titulo: 'Consulta', url: '/dashboard' },
                //{ titulo: 'Seguimiento', url: '/progress' },
                //{ titulo: 'Hospitalización', url: '/graficas1' },
                //{ titulo: 'Vacunas', url: '/promesas' },
                //{ titulo: 'Paciente', url: '/pacientes' },
                //{ titulo: 'RxJs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Administración',
            icono: 'mdi mdi-hospital-building',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                // { titulo: 'Hospitales', url: '/hospitales' },
                // { titulo: 'Quirofano', url: '/hospitales' },
                // { titulo: 'Famacia', url: '/hospitales' },
                // { titulo: 'Médicos', url: '/medicos' }
            ]
        }
    ];

    console.log('ROLE', ROLE);

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' }, { titulo: 'Hospitales', url: '/hospitales' }, { titulo: 'Quirofano', url: '/quirofanos' }, { titulo: 'Famacia', url: '/farmacia' });
    }

    if (ROLE === 'MEDICO_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Paciente', url: '/pacientes' }, { titulo: 'Consulta', url: '/eventomedico/CONSULTA/0' }, { titulo: 'Seguimiento', url: '/eventomedico/SEGUIMIENTO/0' }, { titulo: 'Hospitalización', url: '/eventomedico/HOSPITALIzACION/0' }, { titulo: 'Vacunas', url: '/promesas' });
    }

    if (ROLE === 'SUPER_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Paciente', url: '/pacientes' }, { titulo: 'Consulta', url: '/eventomedico/CONSULTA/0' }, { titulo: 'Seguimiento', url: '/eventomedico/SEGUIMIENTO/0' }, { titulo: 'Hospitalización', url: '/eventomedico/HOSPITALIZACION/0' }, { titulo: 'Vacunas', url: '/promesas' });
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' }, { titulo: 'Hospitales', url: '/hospitales' }, { titulo: 'Quirofano', url: '/quirofano' }, { titulo: 'Famacia', url: '/farmacia' });
    }

    return menu;

}



module.exports = app;
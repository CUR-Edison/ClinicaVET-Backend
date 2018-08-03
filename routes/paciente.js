var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Paciente = require('../models/paciente');

// ==========================================
// Obtener todos los pacientes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Paciente.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        // .populate('hospital')
        .exec(
            (err, pacientes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando paciente',
                        errors: err
                    });
                }

                Paciente.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        pacientes: pacientes,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener pciente
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Paciente.findById(id)
        .populate('usuario', 'nombre email img')
        // .populate('hospital')
        .exec((err, paciente) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar paciente',
                    errors: err
                });
            }

            if (!paciente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El paciente con el id ' + id + ' no existe',
                    errors: { message: 'No existe un paciente con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                paciente: paciente
            });

        })


});

// ==========================================
// Actualizar Paciente
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Paciente.findById(id, (err, paciente) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar paciente',
                errors: err
            });
        }

        if (!paciente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El paciente con el id ' + id + ' no existe',
                errors: { message: 'No existe un paciente con ese ID' }
            });
        }


        paciente.nombre = body.nombre;

        paciente.historiaClinica = body.historiaClinica;
        paciente.especie = body.especie;
        paciente.raza = body.raza;
        paciente.sexo = body.sexo;
        paciente.fechaNacimiento = body.fechaNacimiento;
        paciente.microchip = body.microchip;
        paciente.color = body.color;
        paciente.senas = body.senas;

        paciente.nombrePropietario = body.nombrePropietario;
        paciente.email = body.email;
        paciente.idPropietario = body.idPropietario;
        paciente.telefono = body.telefono;
        paciente.direccion = body.direccion;

        paciente.usuario = req.usuario._id;
        paciente.hospital = body.hospital;

        paciente.save((err, pacienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar paciente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                paciente: pacienteGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo paciente
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var paciente = new Paciente({
        historiaClinica: body.historiaClinica,
        nombre: body.nombre,
        especie: body.especie,
        raza: body.raza,
        sexo: body.sexo,
        fechaNacimiento: body.fechaNacimiento,
        microchip: body.microchip,
        color: body.color,
        senas: body.senas,

        nombrePropietario: body.nombrePropietario,
        email: body.email,
        idPropietario: body.idPropietario,
        telefono: body.telefono,
        direccion: body.direccion,

        usuario: req.usuario._id,
        // hospital: body.hospital
    });

    paciente.save((err, pacienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear paciente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            paciente: pacienteGuardado
        });


    });

});


// ============================================
//   Borrar un paciente por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Paciente.findByIdAndRemove(id, (err, pacienteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar paciente',
                errors: err
            });
        }

        if (!pacienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un paciente con ese id',
                errors: { message: 'No existe un paciente con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            paciente: pacienteBorrado
        });

    });

});


module.exports = app;
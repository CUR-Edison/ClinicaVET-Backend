var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var EventoMedico = require('../models/eventomedico');

// ==========================================
// Obtener todos los eventosmedicos
// ==========================================
app.get('/', (req, res, next) => {

    console.log('en get de enventomedico sin parametro:  ' + req.param.id);

    var desde = req.query.desde || 0;
    desde = Number(desde);

    EventoMedico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email tarjeta')
        .populate('paciente')
        .exec(
            (err, eventosmedicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando eventomedico',
                        errors: err
                    });
                }

                EventoMedico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        eventosmedicos: eventosmedicos,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener eventos médicos
// ==========================================
app.get('/:id', (req, res) => {

    //console.log('en get de enventomedico:  ' + req.params.id);
    var id2 = req.params.id;

    //id = '5a8cf82554f45178c8d6c8eb';
    //console.log('2. en get de enventomedico:  ' + id);


    EventoMedico.find({ paciente: id2 })
        //EventoMedico.findById({ id })
        //EventoMedico.find()
        .where('paciente').equals(id2)
        //.populate('usuario', 'nombre email img tarjeta')
        //.populate('paciente')
        //.sort('-fecha')

    .exec((err, eventosmedicos) => {

        console.log('3. en findBy:  xxxx');

        if (err) {
            console.log('3. en findBy: 500 ');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar evento medico',
                errors: err
            });

        }

        if (!eventosmedicos) {
            console.log('3. en findBy:  400');
            return res.status(400).json({
                ok: false,
                mensaje: 'El evento medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un evento medico con ese ID' }
            });

        }

        res.status(200).json({
            ok: true,
            eventosmedicos: eventosmedicos
        });
        console.log('3. en findBy:  Ok' + eventosmedicos);

    })


});

// ==========================================
// Actualizar Evento Medico
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    EventoMedico.findById(id, (err, eventomedico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar evento medico',
                errors: err
            });
        }

        if (!eventomedico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El evento medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un evento medico con ese ID' }
            });
        }

        eventomedico.paciente = body.paciente;
        eventomedico.tipoEvento = body.tipoEvento;
        eventomedico.fecha = body.fecha;
        eventomedico.anamnesis = body.anamnesis;
        eventomedico.estadoMental = body.estadoMental;
        eventomedico.simetriaFacial = body.simetriaFacial;
        eventomedico.reflejoPupilar = body.reflejoPupilar;
        eventomedico.condicionCorporal = body.condicionCorporal;
        eventomedico.peso = body.peso;
        eventomedico.temperatura = body.temperatura;
        eventomedico.fc = body.fc;
        eventomedico.fr = body.fr;
        eventomedico.tllc = body.tllc;
        eventomedico.pc = body.peso;
        eventomedico.mmOral = body.mmOral;
        eventomedico.mmVulvar = body.mmVulvar;
        eventomedico.mmEsclerotica = body.mmEsclerotica;
        eventomedico.mmNasal = body.mmNasal;
        eventomedico.mmConjuntival = body.mmConjuntival;
        eventomedico.motilidadIntestinal = body.motilidadIntestinal;
        eventomedico.observaciones = body.observaciones;
        eventomedico.hallazgos = body.hallazgos;
        eventomedico.problemas = body.problemas;
        eventomedico.maestra = body.maestra;
        eventomedico.diagnosticoDiferencial = body.diagnosticoDiferencial;
        eventomedico.diagnosticoTrabajo = body.diagnosticoTrabajo;
        eventomedico.tratamiento = body.tratamiento;
        //eventomedico.img = body.img;
        eventomedico.usuario = req.usuario._id;

        eventomedico.save((err, eventomedicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar evento medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                eventomedico: eventomedicoGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo evento medico
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;


    var eventomedico = new EventoMedico({
        paciente: body.paciente,
        tipoEvento: body.tipoEvento,
        fecha: new Date(),
        anamnesis: body.anamnesis,
        estadoMental: body.estadoMental,
        simetriaFacial: body.simetriaFacial,
        reflejoPupilar: body.reflejoPupilar,
        condicionCorporal: body.condicionCorporal,
        peso: body.peso,
        temperatura: body.temperatura,
        fc: body.fc,
        fr: body.fr,
        tllc: body.tllc,
        pc: body.peso,
        mmOral: body.mmOral,
        mmVulvar: body.mmVulvar,
        mmEsclerotica: body.mmEsclerotica,
        mmNasal: body.mmNasal,
        mmConjuntival: body.mmConjuntival,
        motilidadIntestinal: body.motilidadIntestinal,
        observaciones: body.observaciones,
        hallazgos: body.hallazgos,
        problemas: body.problemas,
        maestra: body.maestra,
        diagnosticoDiferencial: body.diagnosticoDiferencial,
        diagnosticoTrabajo: body.diagnosticoTrabajo,
        tratamiento: body.tratamiento,
        //img: body.img,
        usuario: req.usuario._id
    });

    eventomedico.save((err, eventomedicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear evento medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            eventomedico: eventomedicoGuardado
        });


    });

});


// ============================================
//   Borrar un evento medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    EventoMedico.findByIdAndRemove(id, (err, eventomedicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar evento medico',
                errors: err
            });
        }

        if (!eventomedicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un evento medico con ese id',
                errors: { message: 'No existe un evento medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            eventomedico: eventomedicoBorrado
        });

    });

});


module.exports = app;
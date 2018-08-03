var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var tiposValidos = {
    values: ['CONSULTA', 'SEGUIMIENTO', 'HOSPITALIZACION'],
    message: '{VALUE} no es un tipo de evento médico permitido'
};


var eventomedicoSchema = new Schema({

    //paciente: { type: String, required: [true, 'Es necesario relacionar un paciente'] },
    paciente: { type: Schema.Types.ObjectId, ref: 'Paciete', required: [true, 'Es necesario relacionar un paciente'] },
    tipoEvento: { type: String, required: true, default: 'CONSULTA', enum: tiposValidos },
    fecha: { type: String, unique: true, required: false },
    anamnesis: { type: String, unique: false, required: false },
    estadoMental: { type: String, unique: false, required: false },
    simetriaFacial: { type: String, unique: false, required: false },
    reflejoPupilar: { type: String, unique: false, required: false },
    condicionCorporal: { type: String, unique: false, required: false },
    peso: { type: String, unique: false, required: false },
    temperatura: { type: String, unique: false, required: false },
    fc: { type: String, unique: false, required: false },
    fr: { type: String, unique: false, required: false },
    tllc: { type: String, unique: false, required: false },
    pc: { type: String, unique: false, required: false },
    mmOral: { type: String, unique: false, required: false },
    mmVulvar: { type: String, unique: false, required: false },
    mmEsclerotica: { type: String, unique: false, required: false },
    mmNasal: { type: String, unique: false, required: false },
    mmConjuntival: { type: String, unique: false, required: false },
    motilidadIntestinal: { type: String, unique: false, required: false },
    observaciones: { type: String, unique: false, required: false },
    hallazgos: { type: String, unique: false, required: false },
    problemas: { type: String, unique: false, required: false },
    maestra: { type: String, unique: false, required: false },
    diagnosticoDiferencial: { type: String, unique: false, required: false },
    diagnosticoTrabajo: { type: String, unique: false, required: false },
    tratamiento: { type: String, unique: false, required: false },
    img: { type: String, unique: false, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

});

eventomedicoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('EventoMedico', eventomedicoSchema);
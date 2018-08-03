var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var pacienteSchema = new Schema({
    historiaClinica: { type: String, unique: true, required: [true, 'La historia clínica es necesaria'] },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    especie: { type: String, required: false },
    raza: { type: String, required: false },
    sexo: { type: String, required: false },
    fechaNacimiento: { type: String, required: false },
    microchip: { type: String, required: false },
    color: { type: String, required: false },
    senas: { type: String, required: false },

    nombrePropietario: { type: String, required: false },
    email: { type: String, required: false },
    idPropietario: { type: String, required: false },
    telefono: { type: String, required: false },
    direccion: { type: String, required: false },

    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    // hospital: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Hospital',
    //     required: [true, 'El id hospital esun campo obligatorio ']
    // }
});


module.exports = mongoose.model('Paciente', pacienteSchema);
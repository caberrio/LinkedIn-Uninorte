var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OfferSchema = new Schema({
    Empresa: String,
    Contacto:{ type: Schema.Types.ObjectId, ref: "Users" },
    TelefonoContacto:Number,
    Descripcion:String,
    Salario:Number,
    HorasTrabajo:Number,
    Carrera:String,
});
module.exports = mongoose.model('Oferta',OfferSchema);

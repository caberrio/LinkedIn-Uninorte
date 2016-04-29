var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    Name: String,
    LastName: String,
    Email:String,
    Telefono:Number,
    User:String,
    Contrasena:String,
    Codigo:Number,
    Carrera:String,
    Semestre:Number,
    Amigos: [
    	{ type: Schema.Types.ObjectId, ref: "Users" }
    ]
});
module.exports = mongoose.model('Users', UserSchema);

const mongoose =   require('mongoose');
var moment = require('moment');

const { Schema }  =   mongoose;

const SensorSchema =  new Schema({
    name: {type: String, required: false},
    status:{type: String, require:false},
    value:{type: String, require:false},
    description: {type: String, require: false},
    date: {type: Date, default: Date.now },
    topic: {type: String, require: true}
});
module.exports=mongoose.model('Sensor', SensorSchema);
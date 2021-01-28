const mongoose =   require('mongoose');
const { Schema }  =   mongoose;

const SensorSchema =  new Schema({
    name: {type: String, required: true},
    status:{type: Number, require:true},
    value:{type: Number, require:true},
    description: {type: String, require: true},
    date: {type: Date, default: Date.now()},
    topic: {type: String, require: true}
});
module.exports=mongoose.model('Sensor', SensorSchema);
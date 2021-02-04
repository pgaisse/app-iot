const router    =   require('express').Router();
const Sensor    =   require('../models/Iot');
const {isAuthenticated} = require('../helpers/auth');
var params={};
const mqtt     =   require('mqtt');

router.get('/iot/all', async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/all-sensors',{topicos: topicos});
});


router.get('/iot/add', isAuthenticated, async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/new-sensor',{topicos: topicos});
});

router.get('/iot/all-sensors',isAuthenticated, async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/all-sensors',{topicos: topicos});
});

router.post('/iot/all-sensors', isAuthenticated, async (req, res)=>{
    const {topic}=req.body;
    const errors=[]; 
    params={topic: topic};
    if (!topic){
        errors.push({text: 'Por favor ingrese un tópico'});
    }   
    const topicos = await Sensor.distinct("topic");
    if(errors.length > 0){
        res.render('iot/all-sensors',{
            errors,
            topic,
            topicos
        });

    }
    else{
            
        const sensors = await Sensor.find({topic}).sort({$natural:-1}).limit(10).lean()
        const topicos = await Sensor.distinct("topic");
        res.render('iot/all-sensors', { sensors: sensors, topicos:topicos}) 
    
        
    
    }



});


router.get('/iot', isAuthenticated, async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/all-sensors',{topicos: topicos});
});

router.post('/iot/new-sensor', async (req,res)=>{
    const {topic,value}=req.body;
    const errors=[];
 
    if(!topic){
        errors.push({text: 'por favor revise el tópico'});
    }

    if(!value){
        errors.push({text: 'por favor revise el valor'});
    }

    if(errors.length > 0){
        res.render('iot/new-sensor',{
            errors,
            topic,
            value
    });

    }
    else{
        
        async function mqtt_p(){
            var broker='mqtt://192.168.1.83';
        
            var cliente = mqtt.connect(broker, {
                username: 'pgaisse',
                password: 'patoch' 
            });

                await cliente.on('connect', async () =>{
                await cliente.publish(topic, value)
            })
        }
        mqtt_p();
        const topicos = await Sensor.distinct("topic");        
        const newSensor   =   new Sensor({topic,value});
        //newNote.user = req.user.id;
        await newSensor.save();
        req.flash('success_msg', 'Mensaje enviado satisfactoriamente');
        res.render('iot/new-sensor',{topicos: topicos});
    }
});


router.get('/iot/all-ajax', async (req, res)=>{
  
    const topicos = await Sensor.distinct("topic");
    const sensors = await Sensor.find(params).sort({$natural:-1}).limit(1);

    res.json({sensors,topicos});
})

router.get('/iot/chart', async (req, res)=>{


})

router.get('/iot/new-sensor', async (req, res)=>{
    const topicos = await Sensor.distinct("topic");
    res.render('iot/new-sensor',{topicos: topicos});
})

module.exports  =   router;


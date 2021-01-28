const router    =   require('express').Router();
const Sensor    =   require('../models/Iot');
const {isAuthenticated} = require('../helpers/auth');
var params={};

router.get('/iot/all', (req, res)=>{
    res.render('iot/all-sensors');
});


router.get('/iot/add', isAuthenticated, (req, res)=>{
    res.render('iot/new-sensor');
});

router.get('/iot/all-sensors',isAuthenticated, (req, res)=>{
    res.render('iot/all-sensors');
});

router.post('/iot/all-sensors', isAuthenticated, async (req, res)=>{
    const {server, topic}=req.body;
    const errors=[];    
    if(errors.length > 0){
        res.render('iot/all-sensors',{
            errors,
            server,
            topic
        });

    }
    else{
        
        if(topic){
            params={topic: topic};
        }
        else{
            params={};
        }
        
        console.log(topic)
             
        await Sensor.find(params).sort({$natural:-1}).limit(10).then(documentos => {
        const contexto = {
            sensors: documentos.map(documento => {
            return {
                name: documento.name,
                description: documento.description,
                id: documento.id,
                status: documento.status,
                topic: documento.topic,
                date: documento.date,
                value: documento.value
                }   
                
            })
        }
        //console.log(contexto.sensors )
        res.render('iot/all-sensors', { sensors: contexto.sensors }) 
        })
        
    
    }



});


router.get('/iot', isAuthenticated, async (req, res)=>{
   
    res.render('iot/all-sensors');
});

router.post('/iot/new-sensor',isAuthenticated, async (req,res)=>{
    console.log(req.body);
    const {name, topic,value ,status, description}=req.body;
    const errors=[];
    if(!name){
        errors.push({text: 'por favor revise el nombre'});
    }
    if(!topic){
        errors.push({text: 'por favor revise el tópico'});
    }
    if(!status){
        errors.push({text: 'por favor revise el status'});
    }
    if(!description){
        errors.push({text: 'por favor revise la descripción'});
    }
    if(!value){
        errors.push({text: 'por favor revise la descripción'});
    }
    if(errors.length > 0){
        res.render('iot/new-sensor',{
            errors,
            name,
            value,
            status,
            description,
            topic
        });

    }
    else{
        const newSensor   =   new Sensor({name, topic,value,status,description});
        //newNote.user = req.user.id;
        //
        console.log(newSensor);
        await newSensor.save();
        req.flash('success_msg', 'Mensaje agregado satisfactoriamente');
        res.redirect('/iot');
    }
});


router.get('/iot/all-ajax', async (req, res)=>{
    await Sensor.find(params).sort({$natural:-1}).limit(1).then(documentos => {
        const contexto = {
            sensors: documentos.map(documento => {
            return {
                name: documento.name,
                description: documento.description,
                id: documento.id,
                status: documento.status,
                topic: documento.topic,
                date: documento.date,
                value: documento.value
                }   
                
            })
        }
        res.json(contexto.sensors);
    })
    
    
});

router.get('/iot/chart', async (req, res)=>{


})

module.exports  =   router;


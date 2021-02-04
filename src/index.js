const express   =   require('express');
const path      =   require('path');
const exphbs    =   require('express-handlebars');
const methodOverride = require('method-override');
const session   =   require('express-session');
const flash     =   require('connect-flash');
const Chart     =   require('chart.js');
const passport  =   require('passport');
const moment    =   require('node-moment');
///////////////////////////////////hola mundo
var     mqtt     = require('mqtt');
const Sensor    =   require('./models/Iot');
const {isAuthenticated} = require('./helpers/auth');
///////////////////////////////////deve

// Initializations
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'

}));
app.set('view engine', '.hbs');

//middleawares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'mysecretapp',
    resave:true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});
//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));
app.use(require('./routes/iot'));
//static Files

app.use(express.static(path.join(__dirname, 'public')));






//server is listenning a



async function mqtt_p(){
    var broker='mqtt://192.168.1.83';

    var client = mqtt.connect(broker, {
        username: 'pgaisse',
        password: 'patoch' 
    });
    await client.on('connect', async() =>{
        await client.subscribe('msg1', function (err) {
    console.log('ok')
        })
        await client.subscribe('msg2', function (err) {
            console.log('ok')
        })
    })
//recibir y guardar datos del arduino por medio de mqtt
    client.on('message', async function (topic, message) {
            var str=message.toString();
            var index=str.indexOf("/");
            var largo=str.length;
            value=str.substr(index+1,largo)
            var status=str.substr(0,1);
            var date=moment().format('hh:mm:ss DD/MM/YY');
            //console.log("msg",str)
            //console.log("value",value)
            //console.log("status",status)
                //console.log(moment().format('hh:mm:ss DD/MM/YY'))
                const newSensor   =  await new Sensor({topic,status,value,date});
                await newSensor.save();
   
        
          
            
          })
}

mqtt_p();
app.listen(app.get('port'), ()=>{
console.log('Server on port ',app.get('port'));

});
const express   =   require('express');
const path      =   require('path');
const exphbs    =   require('express-handlebars');
const methodOverride = require('method-override');
const session   =   require('express-session');
const flash     =   require('connect-flash');
const Chart     =   require('chart.js');
const passport  =   require('passport');
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
        await client.subscribe('#', function (err) {
    console.log('ok')
        })
    })

    client.on('message', async function (topic, message) {
            var str=message.toString();
            date=new Date();
            topic= str.substring(0,4);
            const name= str.substring(4,14); 
            const value=parseInt(str.substring(14,18));
            const status=parseInt(str.substring(18,22))
            const description=str.substring(22, str.length);
            const newSensor   =   new Sensor({name, topic, value, status, description, date});
            await newSensor.save();
            console.log(date);
            //console.log(newSensor);
    })
}

mqtt_p();
app.listen(app.get('port'), ()=>{
console.log('Server on port ',app.get('port'));

});
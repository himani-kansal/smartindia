var express=require('express');
var bodyParser=require('body-parser');
var ejs=require('ejs');
var cookieParser=require('cookie-parser');

var session=require('express-session');

var app=express();

app.use(cookieParser());
app.use(session({
	secret:'ssshh',
	resave:true,
	saveUninitialized:true
}));

var routes=require('./routes');
var db=require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.set('port',process.env.PORT || 5000);

app.use(express.static(__dirname+'/public'));

app.get('/',routes);

app.get('/api/register',db.addUser);
app.get('/api/checkaadhar',db.checkaadhar);
app.get('/api/checkhistory',db.checkhistory);

app.post('/newuser',db.addUser);
app.get('/newDoctor',db.addDoctor);

app.post('/doctorlogin',db.loginDoctor);
app.post('/userenter',db.enterUser);
app.post('/addhistory',db.addhistory);

app.get('/userprofile',db.userprofile);
app.get('/history',db.userHistory);


app.get('/userlogout',db.userlogout);
app.get('/doctorlogout',db.doctorlogout);


//app.post('/loginuser',db.loginUser);

app.get('/*',routes);


app.listen(app.get('port'),function(){
console.log("Server running on port no:-"+app.get('port'));
});
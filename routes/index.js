var express=require('express');
var app=express();
var ejs=require('ejs');
var db=require('../db');

app.set('view engine','ejs');
app.set('views',__dirname+'/../views');

app.get('/',function(req,res,next){
	if(req.session.doctid!=null && req.session.uniqueid!=null)
	{
		res.redirect('/userprofile');
	}	
	else if(req.session.doctid!=null)
	{
		res.render('useridenter');
	}
	else
	res.render('index');
});

app.get('/*',function(req,res,next){
	res.send("<h2>404 | Page not found!!</h2>");
});

module.exports=app;
var mongoose=require('mongoose');
var autoIncrement=require('mongoose-auto-increment');
var express=require('express');
var app=express();

app.set('view engine','ejs');
app.set('views',__dirname+'../views');

mongoose.connect('mongodb://evolve:evolve@ds131340.mlab.com:31340/hospitalcentraldatabase1');

var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));

db.once('open',function(){
console.log("Connected to mongoose");
});

autoIncrement.initialize(db);

var userSchema=mongoose.Schema({
	username:{
		type:String,
		required:true
	},
	aadharno:{
		type:String,
		required:true
	},
	birthdate:{
		type:String,
		required:true
	},
	bloodgroup:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	phoneno:{
		type:String,
		required:true
	},
	address:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true,
		default:'evolve'
	}

});

userSchema.plugin(autoIncrement.plugin,{
	model:'User',
	field:'uniqueid',
	unique:true,
	required:true,
	startAt:1,
	incrementBy:1
});


var User=mongoose.model('User',userSchema);

exports.addUser=function(req,res){
	
	var user=new User({
	username:req.query.name,
	aadharno:req.query.aadhar,
	birthdate:req.query.birth_date,
	bloodgroup:req.query.blood_group,
	email:req.query.email,
	phoneno:req.query.phone,
	address:req.query.address
	});

	user.save(function(err,info){
		//if(err) throw err;
		console.log('the user is saved successfully!! '+info);
		res.send(info);
	});
};

exports.checkaadhar=function(req,res){
	var aadhar=req.query.aadhar;
	User.findOne({aadharno:aadhar},function(err,info){
	if(info)
		res.send(info);
	else
		res.send("Not exist");
		

	});
};




var doctorSchema=mongoose.Schema({
	hospid:{
		type:Number
	},
	hospname:{
		type:String,
		required:true
	},
	docname:{
		type:String,
		required:true
	},
	phoneno:{
		type:String,
		required:true
	},
	patients:{
		type:Number,
		default:0
	},
	password:{
		type:String,
		required:true
	}

});


doctorSchema.plugin(autoIncrement.plugin,{
	model:'Doctor',
	field:'doctid',
	type:Number,
	required:true,
	startAt:1,
	incrementBy:1

});

doctorSchema.index({hospid:1, doctid:1},{unique:true});

var Doctor=mongoose.model('Doctor',doctorSchema);

var historyschema=mongoose.Schema({
	uniqueid:{
		type:Number
	},
	doctid:{
		type:Number
	},
	docname:{
		type:String
	},
	hospid:{
		type:Number
	},
	hospname:{
		type:String
	},
	date:{
		type:String
	},
	issue:{
		type:String
	},
	medicine:{
		type:String
	},
	food:{
		type:String
	},
	allergy:{
		type:String
	}

});

historyschema.plugin(autoIncrement.plugin,{
	model:'HHistory',
	field:'historyid',
	type:Number,
	required:true,
	startAt:1,
	incrementBy:1
});

historyschema.index({uniqueid:1, historyid:1},{unique:true});
var HHistory=mongoose.model('HHistory',historyschema);


exports.addhistory=function(req,res){

	Doctor.findOne({hospid:req.session.hospid,doctid:req.session.doctid},function(err,info){
		if(info)
		{
			
			console.log(info.docname);
		
	
	var history=new HHistory({
		uniqueid:req.session.uniqueid,
		doctid:req.session.doctid,
		docname:info.docname,
		hospid:req.session.hospid,
		hospname:info.hospname,
		issue:req.body.issue,
		medicine:req.body.medicine,
		food:req.body.food,
		allergy:req.body.allergy,
		date:req.body.date
	});
	history.save(function(err,info){
		console.log(info);
		res.redirect('/history');

	});
	}
	});
};

exports.checkhistory=function(req,res){
	var uniqueid=req.query.uniqueid;
	HHistory.find({uniqueid:uniqueid},function(err,info){
	if(info)
		{
			res.send(info);
			console.log(info);
		}
	else
		res.send("Not exist");
		

	});
};


exports.useradd=function(req,res){
	var uniqueid=req.query.uniqueid;
	User.findOne({uniqueid:uniqueid},function(err,info){
	if(info)
		{
			res.render('useridenter',{data:info});
		}

	});

};

exports.addDoctor=function(req,res){
	var doctor=new Doctor({
		hospid:1,
		hospname:'apollo',
		docname:'dr. sharma',
		phoneno:'7891223333',
		password:'ok1'
	});

	doctor.save(function(err,info){
		console.log("doctor saved");
		res.send(info);
	});

};

exports.loginDoctor=function(req,res){
	hospid=req.body.hospid;
	doctid=req.body.doctid;
	password=req.body.password;
	Doctor.findOne({hospid:hospid,doctid:doctid},function(err,doctor){
		if(doctor)
		{
			if(doctor.password==req.body.password)
				{console.log('The doctor exists');
				 req.session.doctid=doctor.doctid;
				 req.session.hospid=doctor.hospid;
				 res.render('useridenter');
				}
				else
				{
					res.redirect('/');			
				}
		}
		else
		{
			res.redirect('/');
		}
	});


};



exports.enterUser=function(req,res){
	uniqueid=req.body.uniqueid;

	User.findOne({uniqueid:uniqueid},function(err,user){
		if(user)
		{console.log(uniqueid);
			req.session.uniqueid=req.body.uniqueid;
			console.log(req.session.uniqueid);

			res.render('mainpage',{data:user});
			//localStorage.setItem("uniqueid",uniqueid);
			//console.log(localStorage.getItem("uniqueid"));
		}
	});


};
 
exports.userprofile=function(req,res){
	if(req.session.uniqueid==null)
	{
		res.render('useridenter');
	}
	uniqueid=req.session.uniqueid;
	User.findOne({uniqueid:uniqueid},function(err,user){
		if(user)
		{
			res.render('mainpage',{data:user});
		}
	});
};

exports.bloodgroup=function(req,res){
		res.render('bloodgroup');
}


exports.userHistory=function(req,res){
	
	uniqueid=req.session.uniqueid;
	HHistory.find({uniqueid:uniqueid},function(err,users){
		if(users)
		{console.log(users)
			res.render('history',{data:users});		
		}
	});
};

exports.userlogout=function(req,res){
	req.session.uniqueid=null;
	res.render('useridenter');

};

exports.doctorlogout=function(req,res){
	req.session.doctid=null;
	req.session.hospid=null;
	res.redirect('/');
};



//module.exports=User;





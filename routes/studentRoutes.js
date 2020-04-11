const express=require('express');
const studentRouter=express.Router();
const Student =require('../models/studentbio');


studentRouter.get('/',function(req,res,next){
    Student.find({}).then(function(astudent){
        res.send(astudent);
    })
    .catch(next);
});

studentRouter.post('/signup',function(req,res,next){
   
    Student.findOne({email:req.body.email}).then(function(student){
        if(student==null){
            var new_student=new Student(req.body);
            new_student.password=new_student.generateHash(new_student.password);
            Student.create(new_student).then(function(student){
            res.send({statusCode : 220 , message: "registration successful"});
            })
        }
        else{
            res.send({statusCode : 800 , message: "email_id already registered"});
            
        }
    })
    .catch(next);
  });
  
  studentRouter.post('/signin',function(req,res,next){
    
    Student.findOne({email:req.body.email}).then(function(student){
        if(student==null){
            res.send({statusCode:404 , message : "account not found"});
        }
        else{
        
            if(!student.validPassword(req.body.password)){
                res.send({statusCode:450 , message :"Wrong password"});
            }else{
                res.send({statusCode:200 , message :"login successful"});
                
            }
        }
    })
    .catch(next);
  });


module.exports=studentRouter;

const mongoose= require('mongoose');
const Schema=mongoose.Schema;
const bcrypt = require('bcrypt');
//schema
const tutorSchema=new Schema({
    firstName:{
        type : String ,
        required : [true,"name is needed"]
    } ,
    lastName:{
        type : String 
    } ,
    email:{
        type: String,
         required: [true, "email id is necessary"]
        } ,
     password:{
        type : String ,
        required : true
    } ,
    designation:{
        type : String 
    } ,
    university : {
        type : String 
    } ,
    year : {
        type : String
    } ,
    qualification : {
        type : String
    }
},
{ strict: false });

// hash the password
tutorSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
  // checking if password is valid
  tutorSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

//create mongodb model
const Tutor=mongoose.model('tutor',tutorSchema);

module.exports= Tutor;

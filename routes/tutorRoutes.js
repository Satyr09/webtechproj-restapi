const express = require("express");
const tutorRouter = express.Router();
const Tutor = require("../models/tutorbio");

tutorRouter.get("/", function (req, res, next) {
  Tutor.find({})
    .then(function (atutor) {
      res.send(atutor);
    })
    .catch(next);
});

tutorRouter.post("/signup", function (req, res, next) {
  Tutor.findOne({ email: req.body.email })
    .then(function (tutor) {
      if (tutor == null) {
        var new_tutor = new Tutor(req.body);
        new_tutor.password = new_tutor.generateHash(new_tutor.password);
        Tutor.create(new_tutor).then(function (tutor) {
          res.send({ statusCode: 220, message: "registration successful" });
        });
      } else {
        res.send({ statusCode: 800, message: "email_id already registered" });
      }
    })
    .catch(next);
});

const validateUser = (req, res, next) => {
  Tutor.findOne({ email: req.body.email })
    .then(function (tutor) {
      if (tutor == null) {
        res.send({ statusCode: 404, message: "account not found" });
      } else {
        if (!tutor.validPassword(req.body.password)) {
          res.send({ statusCode: 450, message: "Wrong password" });
        } else {
          req.user = tutor;
          next();
        }
      }
    })
    .catch(next);
}
tutorRouter.post("/signin", validateUser, (req,res,next) => {
  const jsonWebTokens = auth.createTokens(req.user);
  const response = {
    user : req.user,
    accessToken : jsonWebTokens.accessToken
  }
  res.cookie('refreshToken', jsonWebTokens.refreshToken, { maxAge: 2 * 60 * 60 * 1000 * 1000});
 // res.setHeader('Set-Cookie', `refreshToken=${jsonWebTokens.refreshToken}; maxAge=360000`);
  res.send(response);
} );

/*router.put('/article/:id',function(req,res,next){
    Article.findByIdAndUpdate({_id:req.params.id},req.body)
    .then(function(){
      Article.findOne({_id:req.params.id}).then(function(article){
        res.send(article);
      });
    });
      
  });

  router.delete('/article/:id',function(req,res,next){
    Article.findByIdAndRemove({_id:req.params.id})
    .then(function(article){
      res.send(article);
    })
    .catch(next);
  });
*/

module.exports = tutorRouter;

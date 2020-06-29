const express = require("express");
const studentRouter = express.Router();
const Student = require("../models/studentbio");
const auth = require("../auth")

studentRouter.get("/", function (req, res, next) {
  Student.find({})
    .then(function (astudent) {
      res.send(astudent);
    })
    .catch(next);
});
studentRouter.get("/:id", function (req, res, next) {
  Student.findOne({email : req.params.id})
    .then(function (student) {
      if(!student)
        res.status(404).send("User not found!")
      res.send(student);
    })
    .catch(next);
});
studentRouter.post("/signup", function (req, res, next) {
  Student.findOne({ email: req.body.email })
    .then(function (student) {
      if (student == null) {
        var new_student = new Student(req.body);
        new_student.password = new_student.generateHash(new_student.password);
        Student.create(new_student).then(function (student) {
          res.send({ statusCode: 220, message: "registration successful" });
        });
      } else {
        res.send({ statusCode: 800, message: "email_id already registered" });
      }
    })
    .catch(next);
});

const validateUser = (req, res, next) => {
  Student.findOne({ email: req.body.email })
    .then(function (student) {
      if (student == null) {
        res.send({ statusCode: 404, message: "Account not found" });
      } else {
        if (!student.validPassword(req.body.password)) {
          res.send({ statusCode: 450, message: "Incorrect password" });
        } else {
          req.user = student;
          next();
        }
      }
    })
    .catch(next);
}

studentRouter.post("/signin", validateUser , (req,res,next) => {
  const jsonWebTokens = auth.createTokens(req.user);
  const response = {
    user : req.user,
    accessToken : jsonWebTokens.accessToken
  }
  res.cookie('refreshToken', jsonWebTokens.refreshToken, { maxAge: 2 * 60 * 60 * 1000 * 1000 });
 // res.setHeader('Set-Cookie', `refreshToken=${jsonWebTokens.refreshToken};httpOnly: false; maxAge=360000`);
  res.send(response);
});

module.exports = studentRouter;

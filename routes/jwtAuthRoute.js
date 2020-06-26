const express = require("express")
const jwtAuthRouter = express.Router();
const jwtAuth = require("../jwtAuth");
const auth = require("../auth")

jwtAuthRouter.post("/refresh", (req,res,next)=>{
    try{
        const user = jwtAuth.verify(req.cookies["refreshToken"]);
        const jsonWebTokens = auth.createTokens(user);

        res.setHeader('Set-Cookie', `refreshToken=${jsonWebTokens.refreshToken}; HttpOnly`);
        res.status(200).send({accessToken:jsonWebTokens.accessToken,user})
    }catch(e){
        res.send(401).send("Unauthorized Access")
    }
})

module.exports = jwtAuthRouter;
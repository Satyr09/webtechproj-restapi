const jwtAuth = require("./jwtAuth")

const verifyAuthentication =  (req, res, next) => {
  //  console.log("VERIFYING ------------ ", req.headers , "  " )
    if(req.method == "OPTIONS")return res.status(200);
        if (req.headers && req.headers.authorization) {
            let decoded;
            try {
                if(req.headers.authorization.split(" ")[0] !== "JWT")
                    res.status(401).send("Unauthorized Access");
                const token = req.headers.authorization.split(" ")[1];
                decoded = jwtAuth.verify(token);
            } catch (e) {
                return res.status(401).send('Unauthorized Access');
            }
            req.user = decoded;
            next()
        } else {
            return res.status(401).send('Unauthorized Access');
        }
}
const createTokens = (user) => {
    const accessToken = jwtAuth.sign(user,{expiresIn:36000});
    const refreshToken = jwtAuth.sign(user,{expiresIn:360000});

    return {
        accessToken,
        refreshToken
    }
}
const auth = {
    verifyAuthentication,
    createTokens
};
module.exports = auth;
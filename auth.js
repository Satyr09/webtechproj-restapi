const jwtAuth = require("./jwtAuth")

const verifyAuthentication =  (req, res, next) => {
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
            console.log(req.headers)
            return res.status(401).send('Unauthorized Access');
        }
}
const createTokens = (user) => {
    const accessToken = jwtAuth.sign(user,{expiresIn:3600});
    const refreshToken = jwtAuth.sign(user,{expiresIn:36000});

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
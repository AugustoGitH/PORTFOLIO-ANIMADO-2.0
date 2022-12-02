const jwt = require("jsonwebtoken")
module.exports = {
    authentication_admin: async (req, res, next)=>{
        const token = req.cookies.authorizationToken
        if(!token) return res.status(401).send({message: "Acesso negado!"})
        try{
            const adminVerified = jwt.verify(token, process.env.TOKEN_SECRET)
            next()
        }
        catch(err){
            return res.status(401).send({message: "Acesso negado!"})
        }
        
    }
}
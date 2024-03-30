const jwt = require("jsonwebtoken");
const secret = "Hackathon"

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  return jwt.sign(data, secret, {
    expiresIn: '30d'
  })
}

module.exports.verify = (req, res, next) => {
  console.log(req.headers.authorization);

  let token = req.headers.authorization;

  console.log(token);

  if(typeof token == "undefined"){
    return res.send({ auth: "Failed. No Token!"});
  } else {
    token = token.slice(7, token.length);
    console.log(token);

    jwt.verify(token, secret, function(err, decodedToken){
      if(err){
        return res.send({
          auth: "Failed",
          message: err.message
        })
      } else {
        console.log(req.user)
        console.log(decodedToken)
        req.user = decodedToken
        next()
      }
    })
  }
}

module.exports.verifyAdmin = (req, res, next) => {
  
  if(req.user.isAdmin){
    next()
  } else {
    return res.send({
      auth: "Failed",
      message: "Action Forbidden"
    })
  }
}
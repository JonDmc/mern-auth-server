const jwt = require('jsonwebtoken')


const jwtTest = async () => {
    try {
        // simulate a server response when a user is logged in
        // create jwt payload
        const payload = {
            name: 'hi im a user',
            id: 'asdasdasdasddd',
            // password??? -- NO
            email: 'email@domain.com'
        }
        // sign the jwt token
        const secret = 'my secret that the token is signed with, this is like a password'
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 }) // expires in -- is how long the token is good for in minutes
        console.log(token)

        // decode the jwt -- make sure that the secret in the jwt is the same as our server's secret
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
    } catch (error) {
        console.log(error)
    }
}

jwtTest()
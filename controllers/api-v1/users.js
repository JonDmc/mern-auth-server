const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../../models')
const requiresToken = require('../requiresToken')

// POST /users/register -- CREATE a new user
router.post('/register', async (req, res) => {
    try {
        // check if the user exist already -- dont allow them to sign up again
        const userCheck = await db.User.findOne({
            email: req.body.email
        })
        if (userCheck) return res.status(409).json({ msg: 'did you forget that you already signed up with that email?' })

        // hash the pass (could validate if we wanted)
        const salt = 12
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // create a user in the db
        const newUser = await db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        // create a jwt paylaod to send back to the client
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser._id
        }
        // sign the jwt and send it (log them in)
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
        res.json({ token })

    } catch (error) {
        console.log(error)
        res.status(503).json({ msg: 'oops server error 503' })
    }
})
// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
    try {
        // try to find the user in the db that is logging in
        const foundUser = await db.User.findOne({
            email: req.body.email
        })
        // if the user is not found -- return and send back a message that the user needs to sign up
        if (!foundUser) return res.status(400).json({ msg: 'did you forget that you already signed up with that email?' })

        // check the password from the req.body against the password in the db
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        console.log(match)
        // if the provided info does not match -- send back an error message and return
        if (!match) return res.status(400).json({ msg: 'bad login credentials' })
        // create a jwt payload
        const payload = {
            name: foundUser.name,
            email: foundUser.email,
            id: foundUser.id
        }

        // sign the jwt
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 })

        // send it back
        res.json({ token })
    } catch (error) {
        console.log(error)
    }
})
//  GET /users/auth-locked -- example of checking a jwt and not serving data unless the jwt is valid
router.get('/auth-locked', requiresToken, (req, res) => {
    console.log('logged user', res.locals.user)
    res.json({ msg: 'welcome to the auth locked route, congrats on getting thru the middleware' })
})

module.exports = router
// SERVER SIDE
require('./models')
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// middlewares
app.use(cors())
app.use(express.json())

const myMiddleware = (req, res, next) => {
    console.log(`incoming request: ${req.method} - ${req.url}`)
    // move along there
    next()
}

app.use(myMiddleware)


app.get('/', (req, res) => {
    res.json({ msg: 'welcome to the user app' })
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users'))

app.listen(PORT, () => console.log(`listening to the smooth sound of port ${PORT} in the morning`))
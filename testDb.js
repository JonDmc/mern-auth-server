const db = require('./models')

const testUser = async () => {
    try {
        const newUser = await db.User.create({
            name: 'Jon',
            email: 'jon@jon.gov',
            password: 'password1234'
        })
    } catch (error) {
        console.log(error)
    }
}

testUser()
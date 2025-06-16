const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./User')


const userRegister = async (req, res) => {
    try {
        const { email, password, username, firstName, lastName } = req.body
        const userExists = await User.findOne({ email })

        if (userExists) {
            res.status(409).json({ status: "Failed", message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            firstName,
            lastName
        })

        await newUser.save()

        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h'})

        res.status(200).json({ status: "Success", message: "Registration successful", token, user: newUser })
    } catch (error) {
        console.error("Registration Error: ", error)
        res.status(400).json({ status: 'Failed', message: "Registration failed", error: error.message })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const foundUser = await User.findOne({ email })
        if (!foundUser) {
            res.status(401).json({ status: 'Failure', message: 'User email exists', })
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password)
        if (!passwordMatch) {
            res.status(401).json({ status: "Failed", message: "Invalid Password"})
        }

        const token = jwt.sign(
            {userId: foundUser._id, email: foundUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({ status: "Success", userName: foundUser.username, token })
    } catch (error) {
        console.error("Login Error: ", error)
        res.status(400).json({ status: 'Failed', message: "Login failed", error: error.message })
    }
}


module.exports = { userRegister, userLogin }
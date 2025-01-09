import JWT from "jsonwebtoken"


const userAuth = async (req, res, next) => {

    const { Token } = req.cookies

    if (!Token) {
        return res.json({ success: false, message: "No Authorized. Login Again" })
    }

    try {
        const tokenDecode = JWT.verify(Token, process.env.JWT_SECRET)

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id
        } else {
            return res.json({ success: false, message: "No Authorized. Login Again" })
        }
        next()

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export default userAuth
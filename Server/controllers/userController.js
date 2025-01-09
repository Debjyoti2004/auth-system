import userModel from "../models/userModel.js"


export const getUserData = async (req, res) => {

    try {
        const { userId } = req.body
        const user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }

        res.json({
            success: true,
            userData: {
                Name: user.name,
                IsVerified: user.isVerified,
                Email: user.email

            }
        })

    } catch (error) {
        return res.json({ success: true, message: error.message })
    }
}
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import transporter from "../config/nodeMailer.js"


export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        // Check if user already exists
        const ifUserExisting = await userModel.findOne({ email });
        if (ifUserExisting) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user in the database
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // Create the JWT token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });

        // Send the token in the cookie
        res.cookie("Token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000,
        });

        // Send Welcome Email (no OTP here)
        const mailOptions = {
            from: process.env.SENDER_EMAILID,
            to: user.email,
            subject: 'Welcome to Our Platform!',
            html: `
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Our Platform!</title>
                    <style>
                        /* General body styling */
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
        
                        /* Container */
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            padding: 40px;
                            border-radius: 12px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            animation: fadeIn 2s ease-out;
                        }
        
                        /* Header */
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .header h1 {
                            font-size: 36px;
                            color: #4e73df;
                            margin: 0;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            animation: scaleUp 0.8s ease-out;
                        }
        
                        /* Styling for the main message */
                        .message {
                            font-size: 16px;
                            line-height: 1.7;
                            color: #555555;
                            margin-bottom: 20px;
                            text-align: justify;
                            animation: fadeIn 2s ease-out;
                        }
        
                        /* Footer */
                        .footer {
                            text-align: center;
                            font-size: 14px;
                            color: #777777;
                            margin-top: 40px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .footer a {
                            color: #4e73df;
                            text-decoration: none;
                        }
        
                        .footer p {
                            margin: 5px 0;
                        }
        
                        .signature {
                            font-style: italic;
                            font-size: 16px;
                            color: #333333;
                        }
        
                        /* Button Styling (for potential CTA) */
                        .button {
                            display: inline-block;
                            background-color: #4e73df;
                            color: #ffffff;
                            padding: 12px 24px;
                            text-decoration: none;
                            font-weight: bold;
                            border-radius: 25px;
                            text-align: center;
                            margin-top: 20px;
                            transition: background-color 0.3s ease;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .button:hover {
                            background-color: #2e58b5;
                        }
        
                        /* Keyframes for animations */
                        @keyframes fadeIn {
                            0% {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
        
                        @keyframes scaleUp {
                            0% {
                                opacity: 0;
                                transform: scale(0.5);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Our Platform!</h1>
                        </div>
        
                        <div class="message">
                            <p>Hello, ${name},</p>
                            <p>Thank you for registering with us! We're excited to have you on board.</p>
                            <p>To complete your registration and verify your email address, please follow the instructions in the email sent separately.</p>
                        </div>
        
                        
        
                        <div class="footer">
                            <p>If you did not request this, please ignore this email.</p>
                            <p class="signature">Best regards, <br/>Debjyoti</p>
                            <p>For support, contact us at <a href="mailto:Debjyotishit8@gmail.com">Debjyotishit8@gmail.com</a></p>
                        </div>
                    </div>
                </body>
            </html>
            `
        };



        // Send the welcome email
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Registration successful! Please check your email for further instructions." });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are required' })
    }

    try {

        // Find the user in our database
        const user_find = await userModel.findOne({ email })
        if (!user_find) {
            return res.json({ success: false, message: 'Invalid Email' })
        }
        // Check the user password match or not
        const isPasswordMatch = await bcrypt.compare(password, user_find.password)
        if (!isPasswordMatch) {
            return res.json({ success: false, message: 'Invalid Password' })
        }

        //Create the token
        const token = jwt.sign({ id: user_find._id }, process.env.JWT_SECRET, { expiresIn: '10d' })

        // we send the token in cookie
        res.cookie("Token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 10 * 24 * 60 * 60 * 1000
        })
        return res.json({ success: true })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('Token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({ success: true, message: "Logged Out" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findOne({ _id: userId })
        if (user.isVerified) {
            res.json({ success: true, message: "Account Is Already Verified" })
        }

        // OTP 
        const OTP = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = OTP
        // OTP ExpireTime
        user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000
        // Save the data in database
        await user.save()

        // Send OTP in the Email
        const mailOptions = {
            from: process.env.SENDER_EMAILID,
            to: user.email,
            subject: 'Account Verification OTP',
            html: `
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Verification OTP</title>
                    <style>
                        /* General body styling */
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
        
                        /* Container */
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            padding: 40px;
                            border-radius: 12px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            animation: fadeIn 2s ease-out;
                        }
        
                        /* Header */
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .header h1 {
                            font-size: 36px;
                            color: #4e73df;
                            margin: 0;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            animation: scaleUp 0.8s ease-out;
                        }
        
                        /* OTP Box */
                        .otp-box {
                            font-size: 40px;
                            font-weight: bold;
                            color: #ffffff;
                            background-color: #4e73df;
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                            margin: 30px 0;
                            letter-spacing: 4px;
                            animation: bounceIn 1s ease-out;
                        }
        
                        /* Message */
                        .message {
                            font-size: 16px;
                            line-height: 1.7;
                            color: #555555;
                            margin-bottom: 20px;
                            text-align: justify;
                            animation: fadeIn 2s ease-out;
                        }
        
                        /* Button */
                        .button {
                            display: inline-block;
                            background-color: #4e73df;
                            color: #ffffff;
                            padding: 12px 24px;
                            text-decoration: none;
                            font-weight: bold;
                            border-radius: 25px;
                            text-align: center;
                            margin-top: 20px;
                            transition: background-color 0.3s ease;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .button:hover {
                            background-color: #2e58b5;
                        }
        
                        /* Footer */
                        .footer {
                            text-align: center;
                            font-size: 14px;
                            color: #777777;
                            margin-top: 40px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .footer a {
                            color: #4e73df;
                            text-decoration: none;
                        }
        
                        .footer p {
                            margin: 5px 0;
                        }
        
                        .signature {
                            font-style: italic;
                            font-size: 16px;
                            color: #333333;
                        }
        
                        /* Keyframes for animations */
                        @keyframes fadeIn {
                            0% {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
        
                        @keyframes scaleUp {
                            0% {
                                opacity: 0;
                                transform: scale(0.5);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
        
                        @keyframes bounceIn {
                            0% {
                                opacity: 0;
                                transform: scale(0.5);
                            }
                            60% {
                                opacity: 1;
                                transform: scale(1.1);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Email Verification</h1>
                        </div>
        
                        <div class="message">
                            <p>Hello,</p>
                            <p>Welcome to our platform! To complete your registration and verify your email address, please use the following One-Time Password (OTP).</p>
                            <p>Simply enter this OTP in the application to activate your account:</p>
                        </div>
        
                        <div class="otp-box">
                            ${OTP}
                        </div>
        
                        <div class="message">
                            <p><strong>Note:</strong> This OTP is valid for only 5 minutes. Please ensure to complete the verification process before it expires.</p>
                        </div>
        
                        
        
                        <div class="footer">
                            <p>If you did not request this, please ignore this email.</p>
                            <p class="signature">Best regards, <br/>Debjyoti</p>
                            <p>For support, contact us at <a href="mailto:Debjyotishit8@gmail.com">Debjyotishit8@gmail.com</a></p>
                        </div>
                    </div>
                </body>
            </html>
            `
        };




        // We send the Email 
        await transporter.sendMail(mailOptions)

        res.json({ success: true, message: "Verification OTP Sent On Email." })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// VerifyEmail
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body

    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {
        const user = await userModel.findOne({ _id: userId })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP!!" })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" })
        }

        user.isVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save()

        return res.json({ success: true, message: "Email Verified Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//Check User is Authenticated
export const isAuthenticated = async (req, res) => {
    try {
        res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Reset password OTP
export const sentResetOtp = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.json({ success: false, message: "Email Is Required" })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }
        const OTP = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = OTP
        // OTP ExpireTime
        user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000
        // Save the data in database
        await user.save()

        // Send OTP in the Email
        const mailOptions = {
            from: process.env.SENDER_EMAILID,
            to: user.email,
            subject: 'Reset Password OTP',
            html: `
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset Request</title>
                    <style>
                        /* General body styling */
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
        
                        /* Container */
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            padding: 40px;
                            border-radius: 12px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            animation: fadeIn 2s ease-out;
                        }
        
                        /* Header */
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .header h1 {
                            font-size: 36px;
                            color: #4e73df;
                            margin: 0;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            animation: scaleUp 0.8s ease-out;
                        }
        
                        /* OTP Box */
                        .otp-box {
                            font-size: 40px;
                            font-weight: bold;
                            color: #ffffff;
                            background-color: #4e73df;
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                            margin: 30px 0;
                            letter-spacing: 4px;
                            animation: bounceIn 1s ease-out;
                        }
        
                        /* Message */
                        .message {
                            font-size: 16px;
                            line-height: 1.7;
                            color: #555555;
                            margin-bottom: 20px;
                            text-align: justify;
                            animation: fadeIn 2s ease-out;
                        }
        
                        /* Button */
                        .button {
                            display: inline-block;
                            background-color: #4e73df;
                            color: #ffffff;
                            padding: 12px 24px;
                            text-decoration: none;
                            font-weight: bold;
                            border-radius: 25px;
                            text-align: center;
                            margin-top: 20px;
                            transition: background-color 0.3s ease;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .button:hover {
                            background-color: #2e58b5;
                        }
        
                        /* Footer */
                        .footer {
                            text-align: center;
                            font-size: 14px;
                            color: #777777;
                            margin-top: 40px;
                            animation: fadeIn 2s ease-out;
                        }
        
                        .footer a {
                            color: #4e73df;
                            text-decoration: none;
                        }
        
                        .footer p {
                            margin: 5px 0;
                        }
        
                        .signature {
                            font-style: italic;
                            font-size: 16px;
                            color: #333333;
                        }
        
                        /* Keyframes for animations */
                        @keyframes fadeIn {
                            0% {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
        
                        @keyframes scaleUp {
                            0% {
                                opacity: 0;
                                transform: scale(0.5);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
        
                        @keyframes bounceIn {
                            0% {
                                opacity: 0;
                                transform: scale(0.5);
                            }
                            60% {
                                opacity: 1;
                                transform: scale(1.1);
                            }
                            100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
        
                        <div class="message">
                            <p>Hello,</p>
                            <p>We have received a request to reset your password for your account. Please use the following One-Time Password (OTP) to proceed with the password reset process:</p>
                            <p>Simply enter this OTP on the application to reset your password.</p>
                        </div>
        
                        <div class="otp-box">
                            ${OTP}
                        </div>
        
                        <div class="message">
                            <p><strong>Note:</strong> This OTP is valid for only 5 minutes. Please complete the process before the OTP expires.</p>
                        </div>
                        <div class="footer">
                            <p>If you did not request this password reset, please ignore this email.</p>
                            <p class="signature">Best regards, <br/>Debjyoti</p>
                            <p>For support, contact us at <a href="mailto:Debjyotishit8@gmail.com">Debjyotishit8@gmail.com</a></p>
                        </div>
                    </div>
                </body>
            </html>
            `
        };




        // We send the Email 
        await transporter.sendMail(mailOptions)

        return res.json({ success: true, message: "OTP Send to your Email" })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Reset password 
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP and New Password are Required" })
    }

    try {

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" })
        }

        const hashed_Password = await bcrypt.hash(newPassword, 12)

        user.password = hashed_Password
        user.resetOtp = ""
        user.resetOtpExpireAt = 0

        await user.save()

        return res.json({ success: true, message: "Password has been reset Successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
} 
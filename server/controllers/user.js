import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'

export const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if (!existingUser) return res.status(404).json({ message: "Không tìm thấy user" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect) return res.status(400).json({ message: "Không thể xác thực" })

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1h
        });

        res.status(200).json({ result: existingUser, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Vui lòng cung cấp tất cả các trường bắt buộc" });
    }

    try {
        const existingUser = await User.findOne({ email })

        if (existingUser) return res.status(400).json({ message: "Người dùng đã tồn tại" })

        if (password !== confirmPassword) return res.status(400).json({ message: "Mật khẩu không khớp" })

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1h
        });

        res.status(200).json({ result, token })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}
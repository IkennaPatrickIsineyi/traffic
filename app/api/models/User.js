import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    designation: { type: String, required: true },
    fullName: { type: String, required: true },
});

const User = mongoose.models?.Users || model('Users', userSchema)

//Create admin acceount if it doesnt exist
User.find({ designation: 'admin' }).then(data => {
    if (!data?.length) {
        bcrypt.hash(process.env.SUPER_ADMIN_DEFAULT_PASSWORD, Number(process.env.SALT), (err, hash) => {
            if (err) {
                console.log('hash err', err)
            }
            else {
                const admin = new User({
                    email: process.env.SUPER_ADMIN_EMAIL,
                    password: hash,
                    fullName: 'Admin Admin',
                    designation: 'admin',
                    phone: '08124323223',
                })

                admin.save();
            }

        })
    }
})

export default User
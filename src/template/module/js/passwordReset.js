
export const passwordReset = async (req , res) => {
    try {
        const {newPassword , oldPassword} = req.body;
        if(!newPassword || !oldPassword){
            return res.status(209).json({
                message : "Provide all parameteres !!!",
                success : false
            });
        }

        const user = await User.findOne({
            email : req.user.email
        });
        if(bcrypt.compare(newPassword , user.password)){
            return res.status(200).json({
                message : "Password is already in use !!!",
                success : false
            });
        }

        user.password = bcrypt.hashSync(newPassword , 10);
        await user.save();


        return res.status(200).json({
            message : "Password changed successfully !!!",
            status : true
        })
    } catch (error) {
        return res.status(500).json({
            message : "Password reset error !!!",
            success : false
        })
    }
}

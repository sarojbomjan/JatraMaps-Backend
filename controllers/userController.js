const User = require("../models/usermodel")

// Ban user
exports.banUser = async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.userId, { isBanned: true });
      res.json({ message: `User ${req.params.userId} has been banned` });
    } catch (error) {
      res.status(500).json({ message: "Error banning user" });
    }
  };

  //UnBan user
exports.unbanUser =  async(req,res) =>{
    try{
        await User.findByIdAndUpdate(req.params.userId, {isBanned: false})
        res.json({message: `User ${req.params.userId} has been unbanned`})
    } catch(error){
        res.status(500).json({message: "Error unbanning user"})
    }
}
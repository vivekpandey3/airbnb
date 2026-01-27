const mongoose = require('mongoose');
const userSchema= mongoose.Schema({
  firstName:{
    type: String,
    required:[true,'first bane is requiired']
  },
  lastName:String,
  email:{
    type:String,
    required:[true,'email is required '],
    unique:true
  },
  password:{
    type:String,
    required: [true, 'password is required'],

  },
  userType:{
    type: String,
    enum: ['guest', 'host'],
    default: 'guest'
  }
})

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },age:{
        type: String,
        required: true
    },address:{
        type: String,
        required: true
    },cnic:{
        type: String,
        required: true
    },
    profile_url:{
        type: String,
        unique: true
    },
    profile_image:{
        data: Buffer,
        type: String,
        default:"NoImage"
    },
    cover_image:{
        data: Buffer,
        type: String,
        default: "NoImage"
    },
    friends: {
        type: [String],
        default:[]
    },
    requested_friends:{
        type: [String],
        default: []
    },
    ban_status: {
        type: Number,
        default: 0
    },
    reported_users_url:{
        type: [String],
        default: []
    },
    date:{
        type: Date,
        default: Date.now
    },
    account_type: {
        type: String,
        default: "User"
    }
});

module.exports = User = mongoose.model('user',UserSchema);
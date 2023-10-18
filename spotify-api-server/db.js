const mongoose =  require('mongoose');
const findOrCreate = require('mongoose-findorcreate');


//mongoose.connect(process.env.MONGO_DB_ATLAS, {useNewUrlParser: true});
mongoose.connect("mongodb://127.0.0.1:27017/spotify", { useNewUrlParser: true, useUnifiedTopology: true });



const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    id: String,
    accessToken: String,
    refreshToken: String
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("user", userSchema);

module.exports = {
    UserModel: User
}
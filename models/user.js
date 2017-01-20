var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	accessToken: {
		type: String,
		required: true
	},
	todos: {
		type: Array
	}
});

var User = mongoose.model("User", userSchema);
module.exports = User;


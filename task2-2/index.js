const express = require('express');
const app = express();
const userRouter = express.Router();
const uuid = require('uuid');
const Joi = require('joi');

const appArgs = process.argv.slice(2);

app.listen(3000);

if (!appArgs[0] || isNaN(appArgs[0]) || appArgs[0] < 1) {
	console.log('Limit argument is missing or wrong value. Right command: index.js {limit}');
	process.exit();
}

app.use(express.json());

let userStore = [];

const userSchema = Joi
	.object()
	.keys({
		login: Joi.string().required(),
		password: Joi.string().required().regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{6,20}$/),
		age: Joi.number().required().integer().min(4).max(130)
	});

const errorResponse = (schemaErrors) => {
	const errors = schemaErrors.map((error) => {
		let {path, message} = error;
		return {path, message};
	});
	return {
		status : 'failed',
		errors
	};
};

const validateSchema = (schema) => {
	return (req, res, next) => {
		const {error} = schema.validate(req.body, {
			abortEarly: true,
			allowUnknown: false
		});
		if (error && error.isJoi) {
			return res.status(400).json(errorResponse(error.details))
		}
		
		next();
	}
};
	
const getAutoSuggestUsers = (loginSubstring, limit) => {
	const search = new RegExp(loginSubstring , 'i');
	let users = [...userStore.filter(item => search.test(item.login) && !item.isDeleted)];
	users.sort((a, b) => (a.login > b.login) ? 1 : -1);
	return users.slice(0, limit);	
};
	
userRouter.get('/get-user/:login', function(req, res) {
	const {login} = req.params;
	const user = userStore.find(u => u.login === login);
	if (user) {
		res.json({result: "success", found_user: user});	
	} else {
		res.json({result: "user not found"});	
	}
});

userRouter.get('/get-user-like/:login', function(req, res) {
	const limit = appArgs[0];
	const {login} = req.params;
	users = getAutoSuggestUsers(login, limit);

	res.json({result: "success", data: users});
});

userRouter.get('/get-all-user', function(req, res) {
	res.json({result: "success", data: userStore});
});

userRouter.post('/add-user', validateSchema(userSchema), function(req, res) {
	const {login, password, age} = req.body;
	
	const user = {"id": uuid.v1(),
	              "login": login,
				  "password": password,
				  "age": age,
				  "isDeleted": false};
	
	userStore.push(user);
	res.json({result: "success", new_user: user});
});

userRouter.put('/remove-user/:id', function(req, res) {
	const {id} = req.params;
	let user = userStore.find(u => u.id === id);
	if (user) {
		user.isDeleted = true;
		res.json({result: "success", removed_user: user});	
	} else {
		res.json({result: "user not found"});	
	}
});

userRouter.post('/update-user', validateSchema(userSchema), function(req, res) {
	const newUser = req.body;
	const {id, login, password, age, isDeleted} = req.body;
	
	let user = userStore.find(u => u.id === id);
	if (user) {
		user.login = login;
		user.password = password;
		user.age = age;
		if (isDeleted) {
			user.isDeleted = isDeleted;
		}
		res.json({result: "success", modified_user: user});	
	} else {
		res.json({result: "user not found"});	
	}
});

app.use('/', userRouter);






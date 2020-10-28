/* Levanta o servidor MONGODB*/

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'chatbotdb';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(jsonParser);
app.use(urlencodedParser);
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/js', express.static(__dirname + '/js'));

MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
	assert.equal(null, err);
	console.log('banco de dados conectado com sucesso.');

	db = client.db(dbName);
});

app.listen(3000);
console.log('servidor rodando em: localhost:3000');

//Interface

app.get('/', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./home.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 0'});
	}
});
app.get('/home', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./home.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 0'});
	}
});
// Admin
app.get('/admin', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./admin.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 1'});
	}
});
app.post('/admin/search', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.user_name) objJSON.user_name = req.body.user_name; 
		else objJSON.user_name = false;
		if(req.body.password) objJSON.password = req.body.password; 
		else objJSON.password = false;

		findAdmin(objJSON, function(result) {
			if(result) res.send(result);
			else res.send({user_name: false, password: false});
		});
	}catch(e) {
		console.log({error: 'erro de requisição 2'});
	}
});
const findAdmin = function(objJSON, callback) {
	try {
		const collection = db.collection('admin');
		collection.findOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 3'});
	}
}
// -----
app.get('/login', urlencodedParser, function(req, res) {
	try {
		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		const data = fs.readFileSync('./login.html', 'utf8');
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 4'});
	}
});
app.get('/index', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.query.user_name) objJSON.user_name = req.query.user_name; 
		else objJSON.user_name = false;
		if(req.query.password) objJSON.password = req.query.password; 
		else objJSON.password = false;

		findUserOne(objJSON, function(result) {
			if((result)&&(result.activate==1)) {
				let code_user = Number(result.code_user);
				res.set('Content-Type', 'text/html');
				const fs = require('fs');
				let data = fs.readFileSync('./index.html', 'utf8');
				data = data.replace('[code_user]', code_user);
				data = data.replace('[code_user]', code_user);
				data = data.replace('[code_user]', code_user);
				res.send(data);	
			}else {
				res.set('Content-Type', 'text/html');
				const fs = require('fs');
				const data = fs.readFileSync('./login.html', 'utf8');
				res.send(data);
			}
		});
	}catch(e) {
		console.log({error: 'erro de requisição 5'});
	}
});
app.post('/user/search', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.user_name) objJSON.user_name = req.body.user_name; 
		else objJSON.user_name = false;
		if(req.body.password) objJSON.password = req.body.password; 
		else objJSON.password = false;

		findUserOne(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 6'});
	}
});
const findUserOne = function(objJSON, callback) {
	try {
		const collection = db.collection('user');
		collection.findOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 7'});
	}
}


// Janela do Chatbot
app.get('/chatbot', urlencodedParser, function(req, res) {
	try {
		let code_user = -1;
		if(req.query.code_user) code_user = Number(req.query.code_user);

		res.set('Content-Type', 'text/html');
		const fs = require('fs');
		let data = fs.readFileSync('./chatbot.html', 'utf8');
		data = data.replace('[code_user]', code_user);
		res.send(data);
	}catch(e) {
		console.log({error: 'erro de requisição 10'});
	}
});
//###################################################################################


app.post('/chatbot/insert', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user); else objJSON.code_user = 0;
		if(req.body.activate) objJSON.activate = Number(req.body.activate); else objJSON.activate = 1;
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current); else objJSON.code_current = cod();
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation); else objJSON.code_relation = 0;
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before); else objJSON.code_before = 0;
		if(req.body.input) objJSON.input = req.body.input; else objJSON.input = '';
		if(req.body.output) objJSON.output = req.body.output; else objJSON.output = 'Desculpe, mas não entendi.';

		insertData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 18'});
	}
});

function cod() {
	try {
		const data = new Date();
		const ano = data.getFullYear();
		const mes = data.getMonth();
		const dia = data.getDate();
		const hora = data.getHours();
		const minuto = data.getMinutes();
		const segundo = data.getSeconds();
		const milesegundos = data.getMilliseconds();
		const result = Number(parseFloat(Number(ano+''+mes+''+dia+''+hora+''+minuto+''+segundo+''+milesegundos)/2).toFixed(0));
		return result;
	}catch(e) {
		return 0;
	}
}

app.post('/chatbot/update', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
		if(req.body.input) objJSON.input = req.body.input;
		if(req.body.output) objJSON.output = req.body.output;

		updateData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 19'});
	}
});

app.post('/chatbot/delete', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
		if(req.body.input) objJSON.input = req.body.input;
		if(req.body.output) objJSON.output = req.body.output;

		deleteData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 20'});
	}
});

app.post('/chatbot/find', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.body.code_user) objJSON.code_user = Number(req.body.code_user);
		if(req.body.activate) objJSON.activate = Number(req.body.activate);
		if(req.body.code_current) objJSON.code_current = Number(req.body.code_current);
		if(req.body.code_relation) objJSON.code_relation = Number(req.body.code_relation);
		if(req.body.code_before) objJSON.code_before = Number(req.body.code_before);
		if(req.body.input) objJSON.input = req.body.input;
		if(req.body.output) objJSON.output = req.body.output;

		findData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 21'});
	}
});

const insertData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.insertOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 29'});
	}
}

const updateData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		const code_current = objJSON.code_current;
		collection.updateOne({code_current: code_current}, {$set: objJSON}, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 30'});
	}
}

const deleteData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.deleteOne(objJSON, function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 31'});
	}
}

const findData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.find(objJSON).toArray(function(err, result) {
			assert.equal(null, err);
			callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 32'});
	}
}

app.get('/chatbot/question', urlencodedParser, function(req, res) {
	try {
		let objJSON = {};
		if(req.query.code_user) objJSON.code_user = Number(req.query.code_user); else objJSON.code_user = 0;
		if(req.body.activate) objJSON.activate = Number(req.body.activate); else objJSON.activate = 1;
		if(req.query.code_before) objJSON.code_before = Number(req.query.code_before); else objJSON.code_before = 0;
		if(req.query.input) objJSON.input = req.query.input; else objJSON.input = '';

		questionData(objJSON, function(result) {
			res.send(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 33'});
	}
});

const questionData = function(objJSON, callback) {
	try {
		const collection = db.collection('chatbot');
		collection.find(objJSON).toArray(function(err, result) {
			assert.equal(null, err);
			if(result.length<=0) {
				let code_before = Number(objJSON.code_before);
				let objFind = {};
				if(code_before>0) {
					objFind = {
						code_user: Number(objJSON.code_user),
						code_relation: code_before
					};
				}else {
					objFind = {
						code_user: Number(objJSON.code_user)
					};
				}
				collection.find(objFind).toArray(function(err, result) {
					assert.equal(null, err);
					if(result.length<=0) {
						const questionUser = abreviacoes(objJSON.input);
						collection.find({code_user: Number(objJSON.code_user)}).toArray(function(err, result) {
							result = nlp(questionUser, result, Number(objJSON.code_user));
							callback(result);
						});
					}else {
						const questionUser = abreviacoes(objJSON.input);
						result = nlp(questionUser, result, Number(objJSON.code_user));
						callback(result);					
					}
				});
			}else callback(result);
		});
	}catch(e) {
		console.log({error: 'erro de requisição 34'});
	}
}

const abreviacoes = function(Input='') {
	try {
		Input = Input.toString().trim();
		let result = Input.replace(/ vc /g, 'você');
		result = result.replace(/ tb /g, 'também');
		result = result.replace(/ oq /g, 'o que');
		result = result.replace(/ dq /g, 'de que');
		result = result.replace(/ td /g, 'tudo');
		result = result.replace(/ pq /g, 'por quê');
		result.toString().trim();
		return result;
	}catch(e) {
		return Input;
		console.log({error: 'erro de requisição 35'});
	}
}

const nlp = function(question='', array=[], code_user=-1) {
	let originalQuestion = question.toString().trim();
	try {
		let findInput = 0;
		let findIndex = 0;

		let documents = getDocuments(originalQuestion, code_user);
		if(documents) {
			return [{
						"_id": "0",
						"code_user": code_user,
						"activate": 1,
						"code_current": -1,
						"code_relation": -1,
						"code_before": -1,
						"input": originalQuestion,
						"output": "Ok! Entendido."		
					}];
		}else {
			for(let i=0; i<array.length; i++) {
				question = question.toString().trim();
				let input = array[i].input.toString().trim();
				if(input.length<=0) input = array[i].output.toString().trim();
				question = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
				input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
				question = question.replace(/[^a-zA-Z0-9\s]/g, '');
				input = input.replace(/[^a-zA-Z0-9\s]/g, '');

				let tokenizationQuestion = question.split(' ');
				let tokenizationInput = input.split(' ');

				tokenizationQuestion = tokenizationQuestion.map(function(e) {
					if(e.length>3) return e.substr(0, e.length-3); else return e;
				});
				tokenizationInput = tokenizationInput.map(function(e) {
					if(e.length>3) return e.substr(0, e.length-3); else return e;
				});

				let words = 0;
				for(let x=0; x<tokenizationQuestion.length; x++) {
					if(tokenizationInput.indexOf(tokenizationQuestion[x])>=0) words++;
				}
				if(words>findInput) {
					findInput = words;
					findIndex = i;
				}
			}

			if(findInput>0) return [{
				"_id": array[findIndex]._id,
				"code_user": array[findIndex].code_user,
				"activate": array[findIndex].activate,
				"code_current": array[findIndex].code_current,
				"code_relation": array[findIndex].code_relation,
				"code_before": array[findIndex].code_before,
				"input": originalQuestion,
				"output": array[findIndex].output
			}];
			else return [{
				"_id": "0",
				"code_user": array[findIndex].code_user,
				"activate": array[findIndex].activate,
				"code_current": array[findIndex].code_current,
				"code_relation": array[findIndex].code_relation,
				"code_before": array[findIndex].code_before,
				"input": originalQuestion,
				"output": "Desculpe, mas não sei te responder."		
			}];
		}
	}catch(e) {
			return [{
				"_id": "0",
				"code_user": code_user,
				"activate": 0,
				"code_current": 0,
				"code_relation": 0,
				"code_before": 0,
				"input": originalQuestion,
				"output": "Desculpe, mas não sei te responder."		
			}];		
	}
}
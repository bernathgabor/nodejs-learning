import fs from 'fs';
const csv=require('csvtojson');
const readline = require('readline');

try{
	const rl = readline.createInterface({
		input: fs.createReadStream('../csv/input.csv'),
		crlfDelay: Infinity	
	});

	rl.on('line', (line) =>{
		var processedLine = line.trim();
		csv({noheader: true,
			headers: ['Book','Author','Amount','Price'],
				colParser:{
				"Book":"string",
				"Author":"string",
				"Amount":"omit",
				"Price":"number"
					 },
				checkType:true
			})
			.on('error',(err)=>{
				console.log('Parsing error, line: ' + processedLine, err);
			})
			.fromString(processedLine)
			.then((jsonObj)=>{
					fs.appendFileSync("./output.txt", JSON.stringify(jsonObj) + '\n', 'utf8');
			});
	});
} catch(error) {
  if (error.code === 'ENOENT') {
      console.log('Input file not found.');
  } else {
      console.log(error);
  }
} 
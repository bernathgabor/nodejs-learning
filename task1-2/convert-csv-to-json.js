var fs  = require("fs");
const csv=require('csvtojson');
try{
fs.readFileSync('./input.csv').toString().split('\n').forEach(function (line) { 
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
   	        fs.appendFileSync("./output.txt", JSON.stringify(jsonObj) + "\n");
	});
});
} catch(error) {
  if (error.code === 'ENOENT') {
      console.log('Input file not found.');
  } else {
      console.log(error);
  }
}
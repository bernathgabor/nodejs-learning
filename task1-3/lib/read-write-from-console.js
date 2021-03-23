import readline from 'readline';
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on('line', function (line) {
  var result = '';

  for (var i = line.length - 1; i >= 0; i--) {
    result = result + line[i];
  }

  console.log(result);
});
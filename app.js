var fs = require('fs'),
	pathToDict = '/usr/share/dict/american-english';

var dict = fs.readFileSync(pathToDict).toString().toLowerCase();

var inputWord = process.argv[2];

var findWord = function(index,dictionary) {
	var entry = '';
	while(dictionary[index] !== '\n') {
		entry += dictionary[index];
		index++;
	}
	return entry;
};

var findClosestMatch = function (word,dictionary) {
	var loc = dictionary.indexOf(word);
	if (loc) {
		var word = findWord(loc,dictionary);
		console.log(word);
	}
	else {
		console.log('fail');
	}
};

findClosestMatch(inputWord,dict);


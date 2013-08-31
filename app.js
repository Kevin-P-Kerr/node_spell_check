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

var spellCheck = function (word,dictionary) {
	if (wordCorrect(word,dictionary)) {
		console.log('ok');
	}
	else {
		var cm = findClosestMatch(word,dictionary);
		console.log('did you mean ' + cm + '?');
	}
};

var wordCorrect = function (word,dictionary) {
	var loc = dictionary.indexOf(word);
	var ret = false;
	if (loc) {
		var entryWord = findWord(loc,dictionary);
		if (word === entryWord) {
			ret = true;
		}
	}
	return ret;
};

var findClosestMatch = function (word,dictionary) {
	var createRoot = (function () {
		var i = word.length-1;
		return function () {
			if (i < 0 ) {
				return false;
			}
			var reg = new RegExp(word.slice(0,i), "g");
			i--;
			return reg;
		};
	};
	var fm = function () {
		var root = createRoot();
		var wm = dictionary.match(root);
		if (wm) {
			return wm;
		}
		else {
			return fm();
		}
	}
	return fm();
};
	

spellCheck(inputWord,dict);


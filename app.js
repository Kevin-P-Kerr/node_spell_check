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
	console.log('ENTRY');
	console.log(entry);
	return entry;
};

var spellCheck = function (word,dictionary) {
	if (wordCorrect(word,dictionary)) {
		console.log('ok');
	}
	else {
		console.log('word: ' + inputWord + ' not found.');
		var cm = findClosestMatch(word,dictionary);
		if (cm) {	
			console.log('did you mean ' +cm+' ?');
		}
		else {
			console.log('no close matches found');
		}
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
			var reg = new RegExp(word.slice(0,i));
			reg.length = word.slice(0,i).length;
			i--;
			return reg;
		};
	})();
	var getRecursMatch = function (reg) {
		var tmpDict = dictionary;
		var match;
		var ret = [];
		var peek;
		var currentOffset = 0;
		var Entry = function (word) {
			this.word = word;
		};
		var tmpWord;
		while (true) {
			match = tmpDict.match(reg);
			if (!match) {
				break;
			}
			tmpWord = findWord(match.index,tmpDict);
			ret.push(tmpWord);
			currentOffset += match.index;
			peek = match.index + reg.length;
			tmpDict = tmpDict.slice(peek,tmpDict.length);
		}
		return ret;
	};
	var fcm = function (matches) {
		var inputLen = inputWord.length;
		var  i = 0,
			ii = matches.length
		;
		for (; i<ii; i++) {
			if (matches[i].length === inputLen) {
				return matches[i];
			}
		}
		return false;
	};
	var fm = function () {
		var root = createRoot();
		var wm = getRecursMatch(root);
		return fcm(wm);
	};
	return fm();
};
	

spellCheck(inputWord,dict);


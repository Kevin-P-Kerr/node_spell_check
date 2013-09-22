var fs = require('fs'),
	pathToDict = '/usr/share/dict/american-english';

var dict = fs.readFileSync(pathToDict).toString().toLowerCase();

var inputWord = process.argv[2];

var formatDict = function (dictString) {
	// take a string, and split on the new line to get an array of entries
	// then put the entries into a dictionary object, sorted alphabetically
	// and then by length of world
	var dictArr = dictString.split('\n');
	var dictionary = {};
	var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
	alphabet.forEach(function (letter) {
		dictionary[letter] = {};
	});
	// for now, we only care about ascii letter--if they have diacritic marks we ignore them
	dictArr.forEach(function (entry) {
		var firstLetter = entry[0];
		if (! (firstLetter in dictionary)) {
			return;
		}
		var len = entry.length;
		if (!dictionary[firstLetter][len]) {
			dictionary[firstLetter][len] = [entry];
		}
		else {
			dictionary[firstLetter][len].push(entry);
		}
	});
	return dictionary;
};

var App = function (dictString) {
	this.dictionary = formatDict(dictString);

	this.spellCheck = function (word) {
		if (this.wordCorrect(word)) {
			console.log('ok');
		}
		else {
			console.log('word: ' + word + ' not found.');
			var cm = this.findClosestMatch(word);
			if (cm) {	
				console.log('did you mean ' +cm+' ?');
			}
			else {
				console.log('no close matches found');
			}
		}
	};

	this.findClosestMatch = function (word) {
		var findScore = function (candidate) {
			var score = 0;
			var c_as_w = candidate;
			candidate = candidate.split('');
			candidate.forEach(function (letter,index) {
				if (word[index] === letter) {
					score++;
				}
			});
			return {'score':score,word:c_as_w};
		}
		var sort = function (a,b) {
			if (a.score > b.score) {
				return -1;
			}
			return 1;
		};
		var findClosest = function (subsection) {
			var scores = [];
			subsection.forEach(function (candidate)	{
				scores.push(findScore(candidate));
			});
			scores.sort(sort);
			return scores[0].word;
		};
		var firstLetter = word[0];
		var len = word.length;
		var section = this.dictionary[firstLetter];
		var ret = false;
		if (section) {
			var subsection = section[len];
			if (subsection) {
				ret = findClosest(subsection);
			}
		}
		return ret;
	};
	
	this.wordCorrect = function (word) {
		var ret = false;
		var len = word.length;
		var firstLetter = word[0];
		var section = this.dictionary[firstLetter];
		if (section) {
			var subsection = section[len];
			if (subsection) {
				subsection.forEach(function (entry) {
					if (entry === word) {
						ret = true;
					}
				});
			}
		}
		return ret;
	};

};

var app = new App(dict);
app.spellCheck(inputWord);

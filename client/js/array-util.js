const getRange = function (fromName, toNum){
	return Array.from({ length: toNum - fromName +1},
    (unused, i) => i + fromName);
};

const getLetterRange = function(firstLetter ='A', numLetters){
const rangeStart = firstLetter.charCodeAt(0);
const rangeEnd = rangeStart+numLetters-1;
return getRange(rangeStart, rangeEnd)
		    .map(charCode =>String.fromCharCode(charCode));
};

module.exports ={
	getRange: getRange, 
	getLetterRange: getLetterRange
};
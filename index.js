/*
    Prepare for some terrible code,
    But at least it gets the job done idk.
*/

const fs = require("fs");

const OPERATORS = ["@", "^", "~"];
const REGULAR_EXPRESSION_STRING = /[@^~][*]/;

const START_TIME = Date.now();

// Get arguments
let outputFile = process.argv[4];
let combineFrom = [process.argv[2], process.argv[3]];

// Get contents
let contents = [JSON.parse(fs.readFileSync(combineFrom[0])).dependencies, JSON.parse(fs.readFileSync(combineFrom[1])).dependencies];

// Combine contents with this notation precedence:
// High ------------------- Low
// @ ^ ~ (any)
// If same precedence, favor the higher version number, however, if precedence is the same and is -1, favor the first string.
// e.g. @6.6.6 and @7.7.7 gives @7.7.7, but z13.3.7 and z42.0.0 gives z13.3.7 (im sorry)

let newContents = {};
let computedDependencies = [];

// But first, get dependencies.
for (let dependency in contents[0]) {
	newContents[dependency] = compareNotation(contents[0][dependency], contents[1][dependency], dependency);
	computedDependencies.push(dependency);
}

// Redo it, this time from contents[1]
for (let dependency in contents[1]) {
	if (computedDependencies.indexOf(dependency) > -1) {
		continue;
	}
	newContents[dependency] = compareNotation(contents[0][dependency], contents[1][dependency], dependency);
}

// Modified from https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
sortedNewContents = Object.keys(newContents)
	.sort()
	.reduce((obj, key) => {
		obj[key] = newContents[key];
		return obj;
	}, {});


// Finally, give out new strings
fs.writeFileSync(process.argv[4] ?? process.cwd()+"/DependencyCombinerOutput.json", `{"dependencies":${JSON.stringify(sortedNewContents, null,4)}}`);
console.log(`Written combined dependencies to ${process.argv[4] ?? process.cwd()+"/DependencyCombinerOutput.json"} (took ${Date.now() - START_TIME}ms)`);

function compareNotation(string1, string2, currentDependencyName) {
	// Lower = Better precedence, but -1 is worst precedence.
	let string1Precedence = string1 ? OPERATORS.indexOf(string1.charAt(0)) : -1;
	let string2Precedence = string2 ? OPERATORS.indexOf(string2.charAt(0)) : -1;

	if (string1Precedence === -1 && string1Precedence === string2Precedence) {
		console.warn(`Both strings of dependency ${currentDependencyName} have precedence of -1, either because of an unknown notation that MAY be given support later. Therefore, first string, that is ${string1Precedence} is returned. Sorry for the inconvenience!`);
		return string1;
	}

	if (string1Precedence === string2Precedence) {
		string1VersionNumber = string1.substring(1).split(".");
		string2VersionNumber = string2.substring(1).split(".");

		let currentIndex = -1;
		while ((currentIndex !== -1 || currentIndex > Math.min(string1VersionNumber, string2VersionNumber)) && string1VersionNumber[currentIndex] != string2VersionNumber[currentIndex]) {
			currentIndex++;
		}

		if (string1VersionNumber[currentIndex] > string2VersionNumber[currentIndex]) {
			return string1;
		} else {
			return string2;
		}
	} else if (string1Precedence > string2Precedence) {
		return string1;
	} else if (string1Precedence < string2Precedence) {
		return string2;
	}
}

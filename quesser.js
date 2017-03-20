var obj = {
	"surname": "Shcherban",
	"firstName": "Yaroslav",
	"age": "5"
	//"gender": "male",
};

let unprepData = [];

var headerPatterns = {
	//"firstName": ["name", "Name", "firstname"],
	"lastName": ["surname", "LASTNAME", "secondName"]
	//"gender": ["sex", "gender"]
}

var columnPatterns = {
	"gender": {
		"variants": ["male", "0", "MALE"]
	}
}

var required = ["firstName", "lastName", "gender"];
//176

var structure = {
	"firstName": undefined,
	"lastName": undefined,
	"gender": undefined
};

// get headers
var headers = Object.keys(obj); // array[] - get headers from input object

// guess headers
headers.forEach(function(val, i, arr) { // array[] - get headers from input object
	for (index in headerPatterns) { // headers from patterns
		if ( (headerPatterns[index].indexOf(val) !== -1) ) { // ["name", "Name", "firstname"].find('lastname')
			structure[index] = obj[val]; // structure["firstname"] = obj["name"]
		}
	}

	if ( structure.hasOwnProperty(val) ) { // 
		structure[val] = obj[val];
	}
});


// check required headers
let foundRequiredHeaders = 0;

required.forEach(function(val, i, arr) {
	if (( Object.keys(structure).indexOf(val) !== -1) && ( structure[val] !== undefined )) {
		foundRequiredHeaders += 1;
	}
});

if (required.length === foundRequiredHeaders) {
	console.log(structure);
} else {
	unprepData.push(structure);
}

console.log(unprepData);





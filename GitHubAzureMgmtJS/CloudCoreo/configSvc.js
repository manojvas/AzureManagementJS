'use strict';
var fs = require('fs');
module.exports = {
	get: function (){
	    return JSON.parse(fs.readFileSync('coreoazure.json', 'utf8'));
	}
};
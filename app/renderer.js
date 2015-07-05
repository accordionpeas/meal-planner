var swig = require('swig');

module.exports = {
	render: function(req, res, templateName, data){
		data = data || {};
		var template = swig.compileFile(__rootDir + '/app/views/' + templateName + '.html');
		res.end(template(data));
	}
}
'use strict';

app.Class = function (path, parent_class, constructor, properties, statics) {
	var path_parts = path.split('.');
	var curr_dir = window;
	for (var i = 0, l = path_parts.length - 1; i < l; ++i) {
		curr_dir = curr_dir[path_parts[i]];
	}

	curr_dir[path_parts[path_parts.length - 1]] = constructor;
	if (parent_class)
		constructor.prototype = new parent_class();
	else if (properties)
		constructor.prototypes = {};
	else 
		constructor.prototype = null;
	Object.extend(constructor.prototype, properties);
	Object.extend(constructor, statics);
};

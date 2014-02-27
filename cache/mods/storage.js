;KISSY.add(function(S){
	var storage;
	if (typeof window.localStorage == 'undefined'){
		var storage = {},
	        prefix = 'data-userdata',
	        doc = document,
	        attrSrc = doc.body,
	 
	        // save attributeNames to <body>'s `data-userdata` attribute
	        mark = function (key, isRemove, temp, reg) {
	 
	            attrSrc.load(prefix);
	            temp = attrSrc.getAttribute(prefix) || '';
	            reg = RegExp('\\b' + key + '\\b,?', 'i');
	 
	            var hasKey = reg.test(temp) ? 1 : 0;
	 
	            temp = isRemove ? temp.replace(reg, '') : hasKey ? temp : temp === '' ? key : temp.split(',').concat(key).join(',');
	 
	            attrSrc.setAttribute(prefix, temp);
	            attrSrc.save(prefix);
	 
	        };
	 
	    // add IE behavior support
	    attrSrc.addBehavior('#default#userData');
	 
	    storage.getItem = function (key) {
	        attrSrc.load(key);
	        return attrSrc.getAttribute(key);
	    };
	 
	    storage.setItem = function (key, value) {
	        attrSrc.setAttribute(key, value);
	        attrSrc.save(key);
	        mark(key);
	    };
	 
	    storage.removeItem = function (key) {
	        attrSrc.removeAttribute(key);
	        attrSrc.save(key);
	        mark(key, 1);
	    };
	 
	    // clear all attributes on <body> tag that using for textStorage 
	    // and clearing them from the 
	    // 'data-userdata' attribute's value of <body> tag
	    storage.clear = function () {
	 
	        attrSrc.load(prefix);
	 
	        var attrs = attrSrc.getAttribute(prefix).split(','),
	            len = attrs.length;
	 
	        if (attrs[0] === '') return;
	 
	        for (var i = 0; i < len; i++) {
	            attrSrc.removeAttribute(attrs[i]);
	            attrSrc.save(attrs[i]);
	        };
	 
	        attrSrc.setAttribute(prefix, '');
	        attrSrc.save(prefix);
	 
	    };
	}
	else {
		storage = window.localStorage;
	}
	return storage
})
var spamGuard = function() {
	var user = "leidy";
	var host = "gmail.com";
	var els = document.getElementsByClassName("emaillink");
	for (var i=0; i < els.length; i++) {
		els[i].href = "mailto:wm" + user + "@" + host;
	}
}();
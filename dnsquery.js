function genericOnClick(info, tab) {
 // console.log("item " + info.menuItemId + " was clicked");
 //console.log("\""+info.selectionText+"\"");
 //console.log("tab: " + JSON.stringify(tab));
 //get selection - comes pre-trimmed.
 var input=info.selectionText.toLowerCase()

 //validate selection
 
 var domainoripre=/([a-z0-9\-]+(\.[a-z0-9-]+)*\.([a-z]{2,}|xn\-\-[a-z0-9\.]+))|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/
 var m=domainoripre.exec(input)
 if (m){//valid
 	
 	//don't search local values
 	if (/^10\..+|^192\.168\..+|^127\..*/.test(m[0]) || /.*\.local$/.test(m[0])){
 		sarcasm=["I'm afraid I can't do that Dave", "You want to see my privates?!", 
 		  "There is no try", "Palm - meet Face"]
 		alert(sarcasm[(Math.random()*sarcasm.length).toFixed(0)])
 	}else {
 		if (m[1]){ //domain
			chrome.storage.sync.get({
				'domUrl': 'https://dnsquery.org/dnsquery/%s/ANY'
			}, function(items) {
				doSearch(items.domUrl, m[0], tab);
			});
		}
		if (m[4]){ //ip
			chrome.storage.sync.get({
				'ipUrl': 'https://dnsquery.org/reversedns/%s'
			}, function(items) {
				doSearch(items.ipUrl, m[0], tab);
			});
		}
	}
 } else {
	alert("Invalid Selection - '"+input+"'\nPlease highlight a domain or IPv4 address")
 }
}

function doSearch(searchurl, input, tab){
	newurl = searchurl.replace('%s', input)
	chrome.tabs.create({"url": newurl, 'index':tab.index+1});
}


var id = chrome.contextMenus.create({"title": "Check '%s' with Cymon", "contexts":["selection"],
                                       "onclick": genericOnClick});
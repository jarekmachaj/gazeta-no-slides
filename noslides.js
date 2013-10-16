var method = {2 : "QueryString", 3 : "Comma", 5 : "Comma"}
var pageCount = $('span.page').html() == null ? 0 :  $('span.page').html().split('/')[1];
var currentUrl = document.URL;
var pagesUrls = [];
var rootURL;

function getMethod(URL){
	var comCounter = URL.split(',').length - 1;
	return method[comCounter];
}

function getRootUrl(URL){
	if (getMethod(URL) == "QueryString"){
		var urlArr = document.URL.split('.html');
		return urlArr[0] + '.html';
	} else {
		var urlArr = document.URL.split(',');
		return urlArr[0] + ',' + urlArr[1] + ',' + urlArr[2] + '.html';
	}
}

function getPagesUrls(URL){
	var pagesAddresses = [];
	rootURL = getRootUrl(URL);

	if (getMethod(URL) == "QueryString"){
		for (var i = 0; i < pageCount; i++){
			pagesAddresses[i] = rootURL + "?i=" + i;
		}
	} else {
		var tempUrlArr = rootURL.split('.html');
		for (var i = 1; i <= pageCount; i++) {
			pagesAddresses[i] =  tempUrlArr[0] + ',,,' + i; 
		}
	}

	return pagesAddresses;
}


function getContents(URL){
	pagesUrls.length = 0;
	var pagesContents = [];
	pagesUrls = getPagesUrls(URL);
	var length = pagesUrls.length;

	var imgURL = chrome.extension.getURL("ajax-loader.gif");
	$("#gazeta_article").html('<div style="width: 200px; margin: 0 auto;" id="loaderImage"><img id="someImage" src="' + imgURL + '" /></div>');
	console.log(imgURL);

	for (var index = 0; index < length; index++){
		loadContentAndShow(pagesUrls[index], pagesContents, index);
	}
}

function loadContentAndShow(url, pagesContents, index){
	$.ajax({
        url: pagesUrls[index],
        type: 'get',
        dataType: 'html',
        async: true,
        success: function(data) {
        	console.log("iter: " + index);
        	console.log("pagesContents.length: " + pagesContents.length);
            pagesContents[index] = data;
            if(pagesContents.length >= pagesUrls.length)
            {
            	$("#gazeta_article").html("");	
				var all = $('<div style="color: black"></div>');

				for (var i = 0; i < pagesContents.length ; i++) {
					all.append(processContent(pagesContents[i]));
				}	
				$("#gazeta_article").html(all);
            }
        }
    });
}

function processContent(contentDoc){
	var gazetaImage = $($.parseHTML(contentDoc)).find("#gazeta_article_image");
	var gazetaBody = $($.parseHTML(contentDoc)).find("#gazeta_article_body");
	var content = $("<div></div>");
	content.append(gazetaImage);
	content.append(gazetaBody); 
	return content;
}


$(".navigation").prepend('<div id="loadAll" style="float: left"><a id="loadAllClick" href="javascript:void(0)">Ładuj wszystko</a></div>');
$("#loadAllClick").click(function(){
	console.log("clicked");
	getContents(document.URL);	
});

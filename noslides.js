//paging method
var method = {2 : "QueryString", 3 : "Comma", 5 : "Comma"}
var pageCount = $('span.page').html() == null ? 0 :  $('span.page').html().split('/')[1];
var currentUrl = document.URL;
var pagesUrls = [];
var pagesContents = [];
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
		pagesAddresses[0] =  tempUrlArr[0] + '.html';
		for (var i = 2; i <= pageCount; i++) {
			pagesAddresses[i-1] =  tempUrlArr[0] + ',,,' + i + '.html'; 
		}
	}

	return pagesAddresses;
}


function getContents(URL){
	pagesUrls.length = 0;	
	pagesUrls = getPagesUrls(URL);
	var length = pagesUrls.length;

	var imgURL = chrome.extension.getURL("ajax-loader.gif");
	$("#gazeta_article").html('<div style="width: 200px; margin: 0 auto;" id="loaderImage"><img id="someImage" src="' + imgURL + '" /></div>');
	console.log(imgURL);

	for (var index = 0; index < length; index++){
		loadContentAndShow(pagesUrls[index], index);
	}
}

function loadContentAndShow(url, index){
	console.log(url);
	$.ajax({
        url: pagesUrls[index],
        type: 'get',
        dataType: 'html',
        async: true,
        success: function(data) {
        	console.log("iter: " + index);
        	console.log("pagesContents.length: " + pagesContents.length);
            pagesContents[index] = data;
            console.log("Length: " + pagesContents.length);
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
	var lead = $($.parseHTML(contentDoc)).find("#gazeta_article_lead");
	var title = $($.parseHTML(contentDoc)).find(".navigation span")[0];
	var gazetaImage = $($.parseHTML(contentDoc)).find("#gazeta_article_image");
	var gazetaImage2 = $($.parseHTML(contentDoc)).find("#gazeta_article_image_new");
	var gazetaBody = $($.parseHTML(contentDoc)).find("#gazeta_article_body");
	var content = $("<div></div>");
	content.append(lead);
	content.append('<div class="slideTitle">' + (title ? title.innerHTML : "") + "</div>");
	content.append(gazetaImage);
	content.append(gazetaImage2);
	content.append(gazetaBody); 
	return content;
}


var topWrap = $("#gazeta_article_tools");
if (topWrap.length == 0)
	topWrap = $("#gazeta_article_author"); 

$(topWrap).after('<div id="loadAll"><a id="loadAllClick" class="loadButton" href="javascript:void(0)">Ładuj wszystko</a></div>');
$("#loadAllClick").click(function(){
	console.log("clicked");
	getContents(document.URL);	
});

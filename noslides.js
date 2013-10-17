//paging method
var method = { QueryString : "QueryString", Comma : "Comma"}
var pageMethod;
var pageCount = $('span.page').html() == null ? 0 :  $('span.page').html().split('/')[1];
var currentUrl = document.URL;
var pagesUrls = [];
var pagesContents = [];
var rootURL;

function getMethod(){

	if(pageMethod != undefined) return pageMethod;

	var urlToParse = "";
	if ($("a.next").length > 0)
		urlToParse = $("a.next")[0].href;
	else
		urlToParse = $("a.prev")[0].href;

	var urlArr = urlToParse.split(',');
	if(urlArr[urlArr.length - 2] == "")
		return pageMethod = method.Comma;

	return pageMethod = method.QueryString;
}

function getRootUrl(URL){
	if (getMethod() == method.QueryString){
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

	if (getMethod() == method.QueryString){
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
				$("#gazeta_article").prepend('<div id="slidesBack"><a id="slidesBackClick" class="loadButton" href="javascript:void(0)">Slajdy</a></div>');

				$("#slidesBackClick").click(function(){
					window.location.href = getRootUrl(url);
				});
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

function gazetaDetectSlides(){
	return $("div.navigation a.next").length > 0;
}

var topWrap = $("#gazeta_article_tools");
if (topWrap.length == 0)
	topWrap = $("#gazeta_article_author"); 
if (topWrap.length == 0)
	topWrap = $("a.back");

if (gazetaDetectSlides()){
	$(topWrap).after('<div id="loadAll"><a id="loadAllClick" class="loadButton" href="javascript:void(0)">Ładuj slajdy</a></div>');
	$("#loadAllClick").click(function(){
		var imgURL = chrome.extension.getURL("ajax-loader.gif");
		$('#loadAllClick').off('click');
		$("#loadAllClick").html('Ładuję...');
		console.log("clicked");
		getContents(document.URL);	
	});
}

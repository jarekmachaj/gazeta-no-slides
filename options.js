var extStatus = {On: "On", Off : "Off"};
var currStatus;

function statusChange(status){
	switch(status){
		case extStatus.On:
			currStatus = extStatus.On;
			$("#offBtnStatus").removeClass("active");
			$("#onBtnStatus").addClass("active");
			$(".alert").removeClass("alert-error").addClass("alert-success");
			$("#extStatus").html("On");
			saveOptions();
			break;
		case extStatus.Off:
			currStatus = extStatus.Off;
			$("#onBtnStatus").removeClass("active");
			$("#offBtnStatus").addClass("active");
			$(".alert").removeClass("alert-success").addClass("alert-error");
			$("#extStatus").html("Off");
			saveOptions();
			break;
	}	
}

function saveOptions() {		  
  chrome.storage.sync.set({'noSlidesExtStatus': currStatus});
}

function restoreOptions() {
  var extcurrstatus;
  chrome.storage.sync.get('noSlidesExtStatus', function(extcurrstatus){
    if (!extcurrstatus) {
        return;
    }
    statusChange(extcurrstatus.noSlidesExtStatus);
  });
}

$("#onBtnStatus").click(function(){statusChange(extStatus.On)});
$("#offBtnStatus").click(function(){statusChange(extStatus.Off)});
document.addEventListener('DOMContentLoaded', restoreOptions);
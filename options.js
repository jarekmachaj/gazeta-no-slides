var extStatus = {On: "On", Off : "Off"};
var services = ["avanti24.pl", "bryla.pl", "ciacha.net", "czterykaty.pl", "deser.pl", "domiwnetrze.pl", "domosfera.pl", "e-ogrody.pl", "edziecko.pl", "gazeta.pl", "lula.pl", "moto.pl", "namonciaku.pl", "plotek.pl", "polygamia.pl", "sport.pl", "swiatmotocykli.pl", "technologie.gazeta.pl", "tokfm.pl", "tuba.pl", "ugotuj.to", "wiadomosci.gazeta.pl", "wyborcza.biz", "wyborcza.pl", "wysokieobcasy.pl", "zczuba.pl"]
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
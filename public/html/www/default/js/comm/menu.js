
/* JavaScript content from js/comm/menu.js in folder common */
function menuControl(flag){
	if (jq("#quick_menu").css("display") == "none") {
		if(!flag){
			if(deviceInfo.os == "android" && deviceInfo.osVersion.charAt(0) == "2"){
				jq("select").attr("disabled", "disabled");
			}
			jq("#menuBg").show();
			jq(window).bind("touchmove", function(){return false;});
			jq("#quick_menu").css("top", "-247px").show();
			jq("#quick_menu").animate({top: "44px"}, {duration : 300});
		}
	}else{
		if(deviceInfo.os == "android" && deviceInfo.osVersion.charAt(0) == "2"){
			jq("select").removeAttr("disabled");
		}
		jq("#menuBg").hide();
		jq(window).unbind("touchmove");
		
		jq("#quick_menu").animate({top: "-247px"}, {duration : 300});
		setTimeout(function(){
			jq("#quick_menu").hide();
		}, 300);
	}
}

var familyMenuTop;
var familyBtnY;
var oTouch;
var oScroll;
var doubleTouchChk = new Date(1900,1,1);
function familyLink(){
//	if(deviceInfo.winHeight < jq(window).height()) deviceInfo.winHeight = jq(window).height();
//	familyMenuTop = deviceInfo.winHeight - 38;
//	jq("#family_menu").css("top", familyMenuTop);
	
	oTouch = new jindo.m.Touch("familyBtn", {
	    nMoveThreshold : 2
	});
	oTouch.attach({
		"touchStart" : function(oCustomEvent){
	        oCustomEvent.oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
	        familyBtnY = 0;
	        doubleTouchChk = new Date();
	        jq("#pop_card").hide();
	    },
	    "touchMove" : function(oCustomEvent){
	    	familyBtnY = oCustomEvent.nVectorY;
	    	var tmpFamilyMenuTop = jq("#family_menu").offset().top - jq(window).scrollTop();
	    	var tmpFamilyMenuTopY = tmpFamilyMenuTop + familyBtnY;
	    	if(familyMenuTop > tmpFamilyMenuTopY && familyMenuTop - 71 < tmpFamilyMenuTopY){
	    		jq("#family_menu").css("top", tmpFamilyMenuTopY);
	    	}
	    },
	    "touchEnd"	: function(oCustomEvent){
	    	if(familyBtnY  == 0){
	    		if (jq("#family_menu").css("top").replace("px", "") >= (familyMenuTop)) {
	    			jq("#family_menu").animate({top: familyMenuTop - 71}, {duration : 100});
	    			jq("#btnLCMW3400").css("z-index", "995");
	    		}else{
	    			jq("#family_menu").animate({top: familyMenuTop}, {duration : 100});
	    			jq("#btnLCMW3400").css("z-index", "997");
	    			if(page_pop_card)jq("#pop_card").show();
	    		}
	    	}else if(familyBtnY > 0){
	    		jq("#family_menu").animate({top: familyMenuTop}, {duration : 100});
	    		jq("#btnLCMW3400").css("z-index", "997");
	    		if(page_pop_card)jq("#pop_card").show();
	    	}else{
	    		jq("#family_menu").animate({top: familyMenuTop - 71}, {duration : 100});
	    		jq("#btnLCMW3400").css("z-index", "995");
	    	}
	    }
	});
	//하단메뉴 플리킹
	jq("#slide_tab_list").touchSlider({
		roll : false,
		view :4,
		btn_prev : jq("#slide_tab_list").parent().find(".family_btn_prev"),
		btn_next : jq("#slide_tab_list").parent().find(".family_btn_next"),
		initComplete : function (e) {
			if(jq("#slide_tab_list li").size()  <= 4) {
				jq("#slide_tab_list").parent().find(".family_btn_prev").hide();
				jq("#slide_tab_list").parent().find(".family_btn_next").hide();
			}
		},
		counter : function (e) {
			if(e.current == 1) {
				jq("#slide_tab_list").parent().find(".family_btn_prev").hide();
			}else {
				jq("#slide_tab_list").parent().find(".family_btn_prev").show();
			}
			
			if(e.current ==  e.total) {
				jq("#slide_tab_list").parent().find(".family_btn_next").hide();
			}else {
				jq("#slide_tab_list").parent().find(".family_btn_next").show();
			}
		}
	});
}

// family link open
function familyApp(mobAppNm, anPack, iosScheme, ipnDldUrl){
	if(noTouch(500)) return;
	var params = (deviceInfo.os == "android") ? [anPack,mobAppNm,"1"] : [iosScheme,ipnDldUrl,mobAppNm,"1"];
	cordova.exec(null, null, "FamilyLinkPlugin", "runApp", params);
}

// 바코드 크게 보기
function popBarcode(ccoNm, cdNo, cdImg){
	if(noTouch(500)) return;
	maxBright(false);
	
	jq("#members_card_img").attr("src", cdImg);
	jq("#members_card_nm").html(ccoNm);
	jq("#members_card_barcode").attr("src", "http://m.lottecard.co.kr/genbc?type=code128&msg=" + cdNo + "&fmt=png&height=10&mw=0.24");
	jq("#members_card_no").html(cdNo);
	jq(window).scrollTop(0);
	jq("#wrap").hide();
	jq("#pop_barcode").height(deviceInfo.winHeight).fadeIn();
	maxBright(true);
	
	popBarcodeChk(jq("#members_card_barcode").width());
}

function popBarcodeChk(tmpWidth){
	setTimeout(function(){
		if(jq("#members_card_barcode").width() > 0 && tmpWidth == jq("#members_card_barcode").width()){
			popBarcodeSet();
		}else{
			popBarcodeChk(jq("#members_card_barcode").width());
		}
	}, 10);
}

function popBarcodeSet(){
	var barcodeLeft = (jq("#members_card_barcode").width() / 2) - jq("#members_card_barcode").height();
	var barcodeNoLeft = (130 - jq("#members_card_no").width() / 2);
	jq("#members_card_barcode").css("left", "-" + barcodeLeft + "px");
	jq("#members_card_no").css("left", barcodeNoLeft + "px");
}

// 바코드 크게 보기 닫기
function popBarcodeClose(){
	maxBright(false);
	jq("#pop_barcode").fadeOut();
	setTimeout(function(){
		jq("#wrap").show();
	}, 400);
}

function barcodeImg(no){
	return "http://m.lottecard.co.kr/genbc?type=code128&msg=" + no + "&fmt=png&height=11&mw=0.18";
}

// 네비 메뉴를 연속으로 클릭시 서버를 중복 호출하는 현상 방지
function menuPage(flag, url){
	var tmpPtime = new Date();
	consoleLog("D", "menuPage url : " + url + "\nendPage : " + loginInfo.endPage);
	consoleLog("D", "menuPage tmpPtime - loginInfo.endPtime : " + tmpPtime - loginInfo.endPtime);
//	if(loginInfo.endPage != url || tmpPtime - loginInfo.endPtime > 1500){
//		loginInfo.endPtime = tmpPtime;
//		loginInfo.endPage = url;
//		commPage(flag, url);
//	}
	if((loginInfo.endPage == url && tmpPtime - loginInfo.endPtime > 1500) || (loginInfo.endPage != url && tmpPtime - loginInfo.endPtime > 500)){
		loginInfo.endPtime = tmpPtime;
		loginInfo.endPage = url;
		commPage(flag, url);
	}
}
	
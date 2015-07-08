
/* JavaScript content from js/comm/common.js in folder common */

/* JavaScript content from js/comm/common.js in folder common */

//신규오퍼 페이지 체크박스
function initOfferCheckBox(){
	jq(".offer_check").unbind("click");
	jq(".offer_check").bind("click", function(){
		if(jq(this).attr("class").match("offer_check_on")) {
			if(noTouch(100)) return;
			doubleTouchChk = new Date();
			
			jq(this).removeClass("offer_check_on");
//			jq("#allCheck").removeClass("offer_check_on");
		}else {
			if(noTouch(100)) return;
			doubleTouchChk = new Date();
			
			jq(this).addClass("offer_check_on");
//			if(jq(".chk_check").size() == jq(".offer_check_on").size()){
//				jq("#allCheck").addClass("offer_check_on");
//			}
		}
	});
}

// 체크박스 초기화
function initCheckBox(){
	jq(".check").unbind("click");
	jq(".check").bind("click", function(){
		if(jq(this).attr("class").match("check_on")) {
			if(noTouch(100)) return;
			doubleTouchChk = new Date();
			
			jq(this).removeClass("check_on");
			jq("#allCheck").removeClass("check_on");
		}else {
			if(noTouch(100)) return;
			doubleTouchChk = new Date();
			
			jq(this).addClass("check_on");
			if(jq(".chk_check").size() == jq(".check_on").size()){
				jq("#allCheck").addClass("check_on");
			}
		}
	});
}

// 체크박스 전체 선택
function allCheckBox(){
	if(jq("#allCheck").attr("class").match("check_on")) {
		jq(".check").each(function(){
			if(this.id != "allCheck"){
				jq(this).removeClass("check_on");
			}
		});
	}else{
		jq(".check").each(function(){
			if(this.id != "allCheck"){
				jq(this).removeClass("check_on");
				jq(this).addClass("check_on");
			}
		});
	}
}

// 라디오 박스 초기화
function initRadioBtn(){
	jq(".radio").unbind("click");
	jq(".radio").bind("click", function(){
		jq(".radio").removeClass("radio_on");
		jq(this).addClass("radio_on");
	});
}

// 아코디언 초기화
function initAcc(){
	jq(".list_acc li").unbind("click");
	jq(".list_acc li").bind("click", function(){
		if(jq(this).attr("class").match("on")){
			jq(this).removeClass("on");
		}else{
			jq(".list_acc_li").removeClass("on");
			jq(this).addClass("on");
		}
	});
}

// 더보기
var moreState = true;
var moreHeight = false;
function moreSetting(totalCount, callBack){
	moreState = true;
	moreHeight = false;
	unbindScroll();
	if(totalCount > pageObj.pageSize * pageObj.pageNo){
		pageObj.pageNo++;
		jq(window).bind("scroll", function(){
			if(jq("#moreBottom").offset().top < jq(window).scrollTop() + deviceInfo.winHeight && moreState){
				moreState = false;
				callBack();
			}
		});
		if(deviceInfo.winHeight > jq("#moreBottom").offset().top) {
			moreHeight = true;
			setTimeout(function(){
				callBack();
			}, 100);
		}else{
			moreHeight = false;
		}
	}
}

//
function getMaskingPhone(phone){
	
	var tmpCellNo = "";
	tmpCellNo = phone.substr(0, 3) + "-" + "****" + "-" + phone.substr(7);
	if(phone.length <= 10)
		tmpCellNo = phone.substr(0, 3) + "-" + "***" + "-" + phone.substr(6);

	return tmpCellNo;
}

function getMaskingName(name){
	
	var msName = name.substr(0, 1);
	if(name.length==4)
		msName = name.substr(0, 2);
	var mask = 1;
	if(name.length>=4)
		mask = 2;
	for(var i = 0; i < mask; i++)
		msName += "*";
	for(var i = 0; i <= name.length - msName.length; i++)
		msName += name.substr(msName.length, msName.length+1);

	return msName;
}

function DelMaskingCard(tmpCardNum){

	var cardnum = "";
 	cardnum = tmpCardNum.replace(/-/gi ,'');
 	cardnum = cardnum.replace(/[*]/gi ,'');
 	return cardnum;

}

function TrimCardNum(tmpCardNum, flag){

	var cardnum = "";
	cardnum += tmpCardNum.substring(0,4);
	cardnum += tmpCardNum.substring(tmpCardNum.length-3,tmpCardNum.length);
 	return cardnum;

}

function MatchCardNum(cardnum1, cardnum2){
	var match = false;
	match = cardnum1==cardnum2 ? true : false;
	return match;
}

function yyyymm(tmpDate){
	return tmpDate.getFullYear() + "" + zero((tmpDate.getMonth() + 1), 2);
}
function yyyymmdd(tmpDate){
	return yyyymm(tmpDate) + "" + zero(tmpDate.getDate(), 2);
}
function yyyymmddhh24miss(tmpDate){
	return yyyymmdd(tmpDate) + "" + zero(tmpDate.getHours(), 2) + "" + zero(tmpDate.getMinutes(), 2) + "" + zero(tmpDate.getSeconds(), 2);
}
function zero(n, d){
	var zero = "";
	n = "" + n;
	if(n.length < d){
		for(var i = 0; i <d - n.length; i++){
			zero += "0";
		}
	}
	return zero + n;
}

function viewImg(imgUrl){
	if(noTouch(500)) return;
	callNtv(null, null, "DevicePlugin", "viewImg", [imgUrl]);
}

var lastScroll = 0;
function unbindScroll(){
	jq(window).unbind("scroll");
	lastScroll = 0;
}
// 팝업 초기화
function initPopup(){
	jq(".sBtnPop").unbind("click");
	jq(".sBtnPop").bind("click", function(){
//		jq("#pop_title").html(jq("#pop_title_" + this.id).val());
//		jq("#pop_cont").html(jq("#pop_cont_" + this.id).val());
		jq("#pop_title").html(jq("#pop_title_" + this.id).html().replace(/\n/g, '<br>'));
		jq("#pop_cont").html(jq("#pop_cont_" + this.id).html().replace(/\n/g, '<br>'));
		backScroll(false);
		jq(".popArea").show();
		jq(".modalBg").show();
		initPopScroll();
	});
	
	jq("#pop_close").unbind("click");
	jq("#pop_close").bind("click", function(){
		jq("#pop_title").html("");
		jq("#pop_cont").html("");
		jq(".popArea").hide();
		jq(".modalBg").hide();
		backScroll(true);
	});
	jq("#popContent").css("height", deviceInfo.winHeight * 70/100);
}

// 팝업 iscroll 세팅
var popScrollObj = null;
function initPopScroll(){
	if(popScrollObj == null){
		popScrollObj = new iScroll('popContent', {
			bounce: false,
			hScrollbar: false,
			vScrollbar: false,
			hideScrollbar: false,
			useTransform: (deviceInfo.os == "ios")
		});
	}
	setTimeout(function(){
		popScrollObj.refresh();
	}, 500);
}

// 전체화면 팝업, 상세 셋팅
var tmpScrollTop = 0;
function initFullPop(btnClass, options){
	var popOptions = {
		leftBtn			: false,
		rightBtn		: false,
		footerBtn		: false,
		btnCount		: 0,
		contClass		: false,
		marginTop		: "44px",
		marginBottom	: "0px",
		btnText1		: "확인",
		btnText2		: "나중에담기",
		btnEvent1		: false,
		btnEvent2		: false,
		bgDark			: false,
		param			: false,
		maxBright		: false
	};
	for (var att in options) popOptions[att] = options[att];
	
	jq("." + btnClass).unbind("click");
	jq("." + btnClass).bind("click", function(){
		if(noTouch(500)) return;
		doubleTouchChk = new Date();
		jq("body").removeClass("bg_depth01");
		tran.showBusy();
		userInfo.first_join ? jq("#firstCpn").show() : jq("#firstCpn").hide();
		popOptions.leftBtn ? jq("#full_pop_left_btn").show() : jq("#full_pop_left_btn").hide();
		popOptions.rightBtn ? jq("#full_pop_right_btn").show() : jq("#full_pop_right_btn").hide();
		if(popOptions.btnCount < 0){
			popOptions.btnCount = 0;
		}else if(popOptions.btnCount > 2){
			popOptions.btnCount = 2;
		}
		if(popOptions.btnCount > 0) popOptions.footerBtn = true;
		
		if(popOptions.footerBtn){
			popOptions.marginBottom = "80px";
			jq("#full_pop_footer").show();
		}else{
			jq("#full_pop_footer").hide();
		}
		
		if(popOptions.contClass){
			popOptions.marginTop = "54px";
			jq("#full_pop_cont").attr("class", popOptions.contClass);
		}else{
			jq("#full_pop_cont").attr("class", "");
		}
		jq("#full_pop_cont").css({"margin-top" : popOptions.marginTop, "margin-bottom" : popOptions.marginBottom});
		jq("#popBtn1").html(popOptions.btnText1);
		jq("#popBtn2").html(popOptions.btnText2);
		popOptions.btnEvent1 ? jq("#popBtn1").removeClass("f_pop_close").attr("onclick", popOptions.btnEvent1 + "('" + ((popOptions.param) ? (this.id).split("_")[1] : "") + "')") : jq("#popBtn1").addClass("f_pop_close").attr("onclick", "");
		popOptions.btnEvent2 ? jq("#popBtn2").removeClass("f_pop_close").attr("onclick", popOptions.btnEvent2 + "()") : jq("#popBtn2").addClass("f_pop_close").attr("onclick", "");
		jq("#popBtn1, #popBtn2").show();
		if(popOptions.btnCount == 1) jq("#popBtn2").hide();
		
//		popOptions.bgDark ? jq("#full_pop, #full_pop_footer").css("background", "#464b4f") : jq("#full_pop, #full_pop_footer").css("background", "#fff");
		
		tmpScrollTop = jq(window).scrollTop();
		moreState = false;
		popState = true;
		jq("#full_pop_Title").html(jq("#pop_title_" + this.id).html());
		jq("#full_pop_cont").html(jq("#pop_cont_" + this.id).html());
		
		jq(window).scrollTop(0);
		jq("#wrap").hide();
//		popOptions.btnCount > 0 ? jq("#full_pop").fadeIn() : jq("#full_pop").show(); 
		jq("#full_pop").show();
		maxBright(popOptions.maxBright);
		setTimeout(function(){
			tran.hideBusy();
		}, 200);
		jq(".f_pop_close").unbind("click");
		jq(".f_pop_close").bind("click", function(){
			maxBright(false);
			jq("body").addClass("bg_depth01");
			popState = false;
//			if(deviceInfo.os == "ios") jq(window).scrollTop(0);
			jq("#full_pop").hide();
			jq("#wrap").show();
			if(popEventState){
				jq(".wrap_pop_event, .popBg").show();
				pageObj.popTouchSlider.resize();
				jq(window).bind("touchmove", function(){return false;});
			}
			setTimeout(function(){
//				if(deviceInfo.os != "ios") jq(window).scrollTop(tmpScrollTop);
				jq(window).scrollTop(tmpScrollTop);
				moreState = true;
			}, 10);
		});
	});
}

function popPageLoad(){
	jq("#wrap").show();
	jq("#full_pop").hide();
	moreState = true;
	goMain();
}

// 템플릿에 데이터를 바인딩
var bindData = function(temp, data) {
	for(var att in data) {
		temp = temp.split("{" + att + "}").join(data[att]);
	}
	return temp;
};

//보안키
var mapTranKey = "";	// app에 전달할 보안키 
var mapKey = "";		// server에 전달할 보안키
var mtrnCallBack = null;
function setMTransKey(callBack){
	if(deviceInfo.os == "windows") return;
	mtrnCallBack = null;
	if(callBack) mtrnCallBack = callBack;
	
	if(mapTranKey == ""){
		tran.callTran("lcmwc040", "", resultMTransKey);
	}else{
		if(mtrnCallBack) mtrnCallBack();
	}
}

function resultMTransKey(resultData){
	mapTranKey = resultData.MAP_TRAN_KEY;
	mapKey = resultData.MAP_KEY;
	if(mtrnCallBack) mtrnCallBack();
};

// 보안키패드 자동 호출 화면에서 보안키 받은 후 콜백함수로 호출
function openMtranKeypad(){
	jq("#" + pageObj.tagId).click();
};

// 보안키패드 호출
var tmpObj;
var mtrnOpenChk = false;
var passChk = false;
function openMtrnKeyboard(obj, keypadType, minLen, maxLen, minMsg, maxMsg, callBack, valChkPswd){
	if(mtrnOpenChk) return;
	afetrOpenMtrnKeyboard(obj, keypadType, minLen, maxLen, minMsg, maxMsg, callBack, valChkPswd);
}
// 특정 안드로이드 폰에서 일반 키패드가 닫히기 전에 보안키패드가 열리는 현상을 방지하기 위해 보안키패드를 호출하는 부분 분리
function afetrOpenMtrnKeyboard(obj, keypadType, minLen, maxLen, minMsg, maxMsg, callBack, valChkPswd){
	var tmpHeight = jq(window).height();
	if(tmpHeight >= deviceInfo.winHeight || deviceInfo.os == "ios" || deviceInfo.os == "windows"){
		var mtrnId = jq(obj).attr("id").replace("disp_", "");
		jq("#modalBg").show();
        if(deviceInfo.os == "ios") jq("#blank").height(300);
		jq(window).scrollTop(jq(obj).position().top - 150);
		jq(window).bind("touchmove", function(){return false;});
		jq(obj).html("");
		jq("#" + mtrnId).val("");
		jq("#tk_" + mtrnId).val("");
		mtrnOpenChk = true;
		tmpObj = obj;
		jq(tmpObj).css({"background" : "#dfdfdf", "border" : "1px solid #333"});
		
		passChk = valChkPswd;
		mtrnCallBack = null;
		if(callBack) mtrnCallBack = callBack;
		
		if(mapTranKey == ""){
			if(deviceInfo.os == "windows"){	// 로컬 테스트용
				jq("#localKey").val("");
				jq("#localKeyPad").show();
				jq("#modalBg").show();
				jq("#localKeyPad input").eq(2).attr("onclick", "localKeyPadOk()");
				jq("#localKey").focus();
			}else{
				appAlert("알림", "일시적인 오류가 발생하였으니 잠시후 재이용해주시기 바랍니다.", "확인");
				jq("#modalBg").hide();
				jq(tmpObj).css({"background" : "#f9f9f9", "border" : "1px solid #acb0b4"});
				jq(window).unbind("touchmove", function(){return false;});
                if(deviceInfo.os == "ios") jq("#blank").height(0);
				mtrnOpenChk = false;
				setMTransKey();
			}
		}else{
            
			var data =	"keydata="		+ mapTranKey + 
			";keypadType=" 	+ keypadType + 
			";maxlength=" 	+ maxLen +
			";minlength=" 	+ minLen +
			";minMsg="	 	+ minMsg +
			";maxMsg="		+ maxMsg;
			cordova.exec(null, null, "MTranskeyPlugin", "showCipherKey", ["innerCipherKeyCallBack", "endCipherKeyCallBack", data, "hideCipherKey"]);
		}
	}else{
		setTimeout(function(){
			afetrOpenMtrnKeyboard(obj, keypadType, minLen, maxLen, minMsg, maxMsg, callBack, valChkPswd);
		}, 100);
	}
}

// 특정 안드로이드 폰에서 보안키패드 위치를 잡지 못하는 현상 방지 위해 화면을 다시 정렬
function afterShowKeypad(){
	consoleLog("D", "afterShowKeypad input position : " + (jq(tmpObj).position().top - 150));
	jq(window).scrollTop(jq(tmpObj).position().top - 150);
}

// 보안키패드를 터치 할 때 마다 호출 텍스트 박스에 ● 표시 
function innerCipherKeyCallBack(keyLength){
	var mtrnId = jq(tmpObj).attr("id").replace("disp_", "");
	var str = "";
	for(var i = 0; i < keyLength; i++){
		str += "●";
	}
	jq("#disp_" + mtrnId).html(str);
//	if((deviceInfo.osVersion.match("2.3") && deviceInfo.os == "android")) jq("#pagePort").css({"height" : jq(window).height(), "overflow-y" : "hidden"});
}

// 보안키패드 입력완료
function endCipherKeyCallBack(cipherData, plainData){
	var mtrnId = jq(tmpObj).attr("id").replace("disp_", "");
	mtrnOpenChk = false;
	if(deviceInfo.os == "ios") jq("#blank").height(0);
	jq("#modalBg").hide();
	jq(tmpObj).css({"background" : "#f9f9f9", "border" : "1px solid #acb0b4"});
	jq(window).unbind("touchmove");
	jq(tmpObj).blur();
	if(passChk){
		if(checkSameString(plainData) || checkSerizeString(plainData)){
			appAlert("알림", "연속, 반복숫자는 비밀번호로 설정이 불가능 합니다.", "확인");
			jq("#" + mtrnId).val("");
			jq("#tk_" + mtrnId).val("");
			jq("#disp_" + mtrnId).html("");
			return;
		}
	}
	
	jq("#" + mtrnId).val(plainData);
	jq("#tk_" + mtrnId).val(cipherData); 
//	if((deviceInfo.osVersion.match("2.3") && deviceInfo.os == "android")) jq("#pagePort").css({"height" : "", "overflow-y" : ""});
	
	if(mtrnCallBack) mtrnCallBack();
}

// 보안키패드 close
function hideCipherKey(){
	var mtrnId = jq(tmpObj).attr("id").replace("disp_", "");
	jq("#" + mtrnId).val("");
	jq("#tk_" + mtrnId).val("");
	jq("#disp_" + mtrnId).html("");
	jq(window).unbind("touchmove");
    if(deviceInfo.os == "ios") jq("#blank").height(0);
	mtrnOpenChk = false;
	jq("#modalBg").hide();
	jq(tmpObj).css({"background" : "#f9f9f9", "border" : "1px solid #acb0b4"});
//	if((deviceInfo.osVersion.match("2.3") && deviceInfo.os == "android")) jq("#pagePort").css({"height" : "", "overflow-y" : ""});
	cordova.exec(null, null, "MTranskeyPlugin", "hideCipherKey", [""]);
}

// sns 연동
function snsFull(snsFlag, msg, imgUrlDetail, imgUrlMain, imgSize){
	if(snsFlag == "T"){
		callNtv(snsiTwSendSuccess,snsiTwSendFail,"SnsPlugin","twitterFull",["","","",msg,imgUrlDetail + "?a=1"]);
	}else if(snsFlag == "F"){
		callNtv(snsiFbSendSuccess,snsiFbSendFail,"SnsPlugin","facebookFull",["","","",msg,imgUrlDetail + "?a=1"]);
	}else{
		callNtv(null,null,"SnsPlugin","kakaotalkPost",[msg,imgUrlDetail,imgUrlMain,imgSize,"이벤트 보러가기","클러치 바로가기"]);
	}
}
function snsiTwSendSuccess(){
	appAlert("알림", "Twitter 소문내기가 성공적으로 등록 되었습니다.", "확인");
}
function snsiTwSendFail(){
	appAlert("알림", "Twitter 소문내기를 실패하였습니다. 다시 시도해주세요.", "확인");
}
function snsiFbSendSuccess(){
	appAlert("알림", "facebook 소문내기가 성공적으로 등록 되었습니다.", "확인");
}
function snsiFbSendFail(){
	appAlert("알림", "facebook 소문내기를 실패하였습니다. 다시 시도해주세요.", "확인");
}

// 안드로이드 휴대폰인증 인증번호 sms전송시 autofillin
function smsAutofill(resultData){
	jq("#rd_no").val(resultData);
}
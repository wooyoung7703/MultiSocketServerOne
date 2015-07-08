
/* JavaScript content from js/LCMW8/LCMW8000.js in folder common */
pageObj.pageTitle = "기프트카드";

pageObj.pageFunction = function(obj){
	if(deviceInfo.os != "ios"){
		pageObj.pageTitle = "기프트카드/캐시비";
		setTitle();
		jq("#cashbee").show();
		
		// 캐시비 앱 설치 여부 체크
		var packCashbee = "com.ebcard.skcashbee";
		
		if(deviceInfo.netOper.charAt(0) == "K"){
			packCashbee = "com.kt.cashbee";
		}else if(deviceInfo.netOper.charAt(0) == "L"){
			packCashbee = "com.lguplus.cashbee";
		}
		jq("#btn_cashbee").attr("onclick", "familyApp('캐시비', '" + packCashbee + "')");
		callNtv(null, null, "FamilyLinkPlugin", "isInstalledApp", ["pageObj.isInstalledAppresult", packCashbee]);
	}else{
		// 보안키 호출
		setMTransKey();
	}
};

// 캐시비 앱 설치 여부 체크 결과
pageObj.isInstalledAppresult = function(resultData){
	consoleLog("D", "isInstalledAppresult cashbee : " + resultData);
	if(resultData != "Y"){
		// 캐시비 이벤트 조회
		commPage("T", "lcmw8010", "", pageObj.resultLCMW8010);
	}else{
		// 보안키 호출
		setMTransKey();
	}
};

//캐시비 이벤트 조회 결과
pageObj.resultLCMW8010 = function(resultData){
	if(resultData.EVN_URL != ""){		// 캐시비 이벤트가 있을 경우
		jq("#btn_cashbee").attr("onclick", "webPage('" + resultData.EVN_URL + "')");
	}
	// 보안키 호출
	setMTransKey();
};

pageObj.LCMW8000 = function(){
	if(jq("#giftcard").val() == ""){ 
		appAlert("알림", "카드번호를 입력하여 주십시오.", "확인");
		return;
	}
	// 기프트 카드 조회
	var params = {
			card_no : jq("#tk_giftcard").val(),
			map_key : mapKey
	};
	commPage("T", "lcmw8000", params, pageObj.resultLCMW8000);
};

pageObj.resultLCMW8000 = function(resultData){
	if(resultData.BALANCE == ""){
		appAlert("알림", "유효하지 않은 카드 번호 입니다. 다시 입력해 주세요.", "확인");
		jq("#balance").html(0);
	}else{
		var balance = parseInt(resultData.BALANCE, 10) + "";
		jq("#balance").html(balance.toCurrency());
		jq("#giftSearch").html("확인");
	}
};

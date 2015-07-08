
/* JavaScript content from js/LCMW3/LCMW3090.js in folder common */
pageObj.pageTitle = "카드 인증";
pageObj.cardFlag = "L";
pageObj.certFlag = "L";	// 카드인증 경로 L : 로그인을 통해 진입시, R : 비밀번호 재설정을 통해 진입시

pageObj.pageFunction = function(obj){

	if(obj=="members_card_cert"){
		pageObj.param = obj;
	}else if(obj != ""){
		pageObj.param = eval("(" + obj + ")");
		pageObj.certFlag = "R";// 카드인증 경로 L : 로그인을 통해 진입시, R : 비밀번호 재설정을 통해 진입시
	}
	
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
	jq("#leftBtn").hide();
	jq("#rightBtn").hide();
	
	commPage("T", "lcmw3091", "", pageObj.resultLCMW3091);
};

//  카드 리스트 조회 결과
pageObj.resultLCMW3091 = function(resultData){
	
	var dataList = new GridControl({"row" : resultData.CARD_LIST});
	pageObj.cardList = [];
	jq("#iosSelect").html(dataList.get(0).MASKING_CDNO);

	for(var i = 0; i < dataList.getSize(); i++){
		jq("#cardList").append("<option value='" + dataList.get(i).ENCRYPT_CDNO + "'>" + dataList.get(i).MASKING_CDNO + "</option>");
		pageObj.cardList.push({CODE : dataList.get(i).ENCRYPT_CDNO, VALUE : dataList.get(i).MASKING_CDNO});
	}
	pageObj.changeCard();
	// 보안키 호출
	setMTransKey();
	
};

pageObj.LCMW3092 = function(){
	
	var tmpNum = "";
	if(pageObj.cardFlag == "L"){
		tmpNum = jq("#tk_cvcNum").val();
		if(tmpNum == ""){
			appAlert("알림", "CVC번호를 입력하세요.", "확인");
			return;
		}
	}else{
		tmpNum = jq("#tk_4dbcNum").val();
		if(tmpNum == ""){
			appAlert("알림", "4DBC번호를 입력하세요.", "확인");
			return;
		}
	}
	
	if(jq("#tk_passNum").val() == ""){
		appAlert("알림", "비밀번호를 입력하세요.", "확인");
		return;
	}
	
	var params = {
			map_key			: mapKey,
			encrypt_cdno	: jq("#cardList").val(),
			cvc 			: tmpNum,
			password 		: jq("#tk_passNum").val()
	};
	
	if(pageObj.certFlag == "R"){
		params.ci = userInfo.cst_drm_no;
		commPage("T", "lcmw3095", params, pageObj.resultLCMW3094);

	}else{
		commPage("T", "lcmw3094", params, pageObj.resultLCMW3094);
	}

};

pageObj.resultLCMW3094 = function(resultData){
	if(resultData.RESULT =="success"){
		backData.pop();
		userInfo.card_cert = "Y";
		if(pageObj.certFlag == "R"){
			if(certInfo.type=="C000"||certInfo.type=="main"){
		    	callNtv(null, null, "DevicePlugin", "saveData", ["","","","card_cert","Y"]);
				goMain();
			}else{
			commPage("P", "LCMWC410", pageObj.param, "L");
			}
		}else{
			goMain();
		}
	}else{
		appAlert("알림", resultData.MESSAGE.replace(/<br\/>/g,"\n") , "확인");
		jq("#cardNum, #cvcNum, #passNum, #rr2").val("");
		jq("#4dbcNum, #tk_4dbcNum").val("");
		jq("#tk_cardNum, #tk_cvcNum, #tk_passNum, #tk_rr2").val("");
		jq("#disp_cardNum, #disp_cvcNum, #disp_passNum, #disp_rr2").html("");
	}
};

pageObj.changeCard = function(){
	jq(".cvc, .4dbc").hide();
	if(jq("#cardList option[value=" + jq("#cardList").val() +"]").html().length < 19){
		pageObj.cardFlag = "A";
		jq(".4dbc").show();
	}else{
		pageObj.cardFlag = "L";
		jq(".cvc").show();
	}
};

pageObj.cancel = function(){
	if(pageObj.certFlag == "R"){
		appConfirm("알림", "취소하시겠습니까?\n비밀번호 재설정이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
			goMain();
		}, function(){
		});
	}else{
		appConfirm("알림", "카드인증을 하지 않으시면 클러치를 이용하실 수 없습니다.", "인증계속", "종료", function(){
		}, function(){
			callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "클러치를 종료합니다."]);
		});
	}
};

pageObj.cancelHome = function(){
	appConfirm("알림", "취소하시겠습니까?\n카드인증이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};

pageObj.nextChk = function(){
	consoleLog("D", tmpObj);
	if((jq(tmpObj).attr("id") == "disp_cvcNum" || jq(tmpObj).attr("id") == "disp_4dbcNum") && jq("#disp_passNum").html() == ""){
		jq("#disp_passNum").click();
	}
	if(jq(tmpObj).attr("id") == "disp_passNum" && jq("#disp_rr2").html() == ""){
		jq("#disp_rr2").click();
	}
};

//아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(){
	callNtv(null, null, "DevicePlugin", "selectbox", [pageObj.cardList, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	jq("#cardList").val(tmpCode);
	jq("#iosSelect").html(tmpValue);
	
	pageObj.changeCard();
};
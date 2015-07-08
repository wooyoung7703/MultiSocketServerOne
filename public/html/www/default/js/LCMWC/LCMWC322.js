
/* JavaScript content from js/LCMWC/LCMWC322.js in folder common */
pageObj.pageTitle = "SMS 서비스 신청";
pageObj.listCard = [];

pageObj.pageFunction = function(obj){
//	jq("body").addClass("bg_dark");
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
	jq("#ur_nm").html(getMaskingName(userInfo.ur_nm));
	jq("#cell_no").html(getMaskingPhone(userInfo.cell_no));//전화번호 마스킹 처리
	// SMS서비스 신청 카드 정보 조회
	commPage("T", "lcmwc321", "", pageObj.resultLCMWC321);
};

// 카드정보 조회 결과
pageObj.resultLCMWC321 = function(resultData){
	var dataList = new GridControl({"row" : resultData.CARD});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#LCMWC322_select").append("<option value='" + dataList.get(i).ENCRYPT_CDNO + "'>" + dataList.get(i).MASKING_CDNO + "</option>");
		pageObj.listCard.push({CODE : dataList.get(i).ENCRYPT_CDNO, VALUE : dataList.get(i).MASKING_CDNO});
	}
	jq(".iosSelect").html(pageObj.listCard[0].VALUE);
	initRadioBtn();
};

// 취소
pageObj.cancel = function(){
	//hwp 20131223
	appConfirm("알림", "[SMS 기본] 서비스 신청을 취소하시겠습니까?", "확인", "취소", function(){
		commPage("P", smsBackPage);
	}, function(){
	});
};

// SMS서비스 신청
pageObj.LCMWC322 = function(){
	var params = {
			enc_card_no		: jq("#LCMWC322_select").val(),
			sms_pt_stt_yn	: jq(".radio_on").html().charAt(0) == "포" ? "Y" : "N"
	};
	commPage("T", "lcmwc322", params, pageObj.resultLCMW322);
};

// SMS서비스 신청 결과
pageObj.resultLCMW322 = function(resultData){
	if(resultData.IS_SMS_JOIN == "Y"){
		userInfo.sms_join = "Y";
		commPage("P", "LCMWC323", "", "L");
	}else{
		appAlert("알림", "SMS서비스 가입에 실패했습니다.", "확인");
	}
};

pageObj.cancelHome = function(){
	appConfirm("알림", "[SMS 기본] 서비스 신청을 취소하시겠습니까?", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};

pageObj.iosSelect = function(){
	callNtv(null, null, "DevicePlugin", "selectbox", [pageObj.listCard, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	jq("#LCMWC322_select").val(tmpCode);
	jq(".iosSelect").html(tmpValue);
};

/* JavaScript content from js/LCMW3/LCMW3010.js in folder common */
pageObj.pageTitle = "현장결제 비밀번호";

pageObj.pageFunction = function(obj){
	busyState.show = true;
	pageObj.rpl_cdno = obj;
	// 보안키 호출
	pageObj.tagId = "disp_ctf_pswd";
	setMTransKey(openMtranKeypad);
};

// 비밀번호 입력
pageObj.LCMW3010 = function(){
	if(jq("#ctf_pswd").val() == ""){
		appAlert("알림", "비밀번호를 입력하세요.", "확인");
		return;
	}
	var params = {
			rpl_cdno	: pageObj.rpl_cdno,
			ctf_pswd	: jq("#tk_ctf_pswd").val(),
			map_key		: mapKey
	};
	setTimeout(function(){
		commPage("T", "lcmw3010", params, pageObj.resultLCMW3010);
	}, 500);
};

// 비밀번호 입력 결과
pageObj.resultLCMW3010 = function(resultData){
	jq("#ctf_pswd, #tk_ctf_pswd").val("");
	jq("#disp_ctf_pswd").html("");
	if(resultData.APPCARD_RESULT == "error"){
		appAlert("알림","서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.", "확인");
	}else if(resultData.APPCARD_RESULT == "success"){
		if(resultData.CD_NM == "") resultData.CD_NM = "롯데카드";
		var data =	"card_no="		+ resultData.MASKING_CDNO	+ 	// 마스킹 카드번호
					";card_name="	+ resultData.CD_NM			+	// 카드명
					";card_url="	+ resultData.CD_IMG_NM		+ 	// 카드 이미지
					";mc_name="		+								// 가맹점명 (취소시 사용)
					";pay_value="	+								// 결제금액 
					";pay_date="	+								// 결제일
					";pay_code="	+								// 결제 코드
					";valid_date="	+ "89/11"					+	// 유효기간
					";user_name="	+ getMaskingName(userInfo.ur_nm)			+	// 사용자 이름
					";sign_image="	+ resultData.ELC_SIGN_V		+ 	// sign 이미지
					";time="		+ "3"						+	// 유효시간
					";title="		+ "현장결제"				+	// 제목
					";barcode="		+ resultData.OTC			+	// OTC
					";callback="	+ "callBackAppCard"			+	// 종료시 호출
					";cbParam="		+ "LCMW3000";					// 종료 호출시 파라메터
		
            callNtv(null, null, "DevicePlugin", "showAppCardView", [data]);
	}else{
		if(resultData.PSWD_ERR_TMS){
			if(resultData.PSWD_ERR_TMS >= 5){
				jq("#disp_ctf_pswd").attr("onclick", "pageObj.mbrLock()");
				pageObj.mbrLock();
			}else if(resultData.PSWD_ERR_TMS == 1){
				appAlert("알림", "비밀번호가 일치하지 않습니다. 재입력 후 다시 시도해 주세요.", "확인"); 
			}else{
				if(resultData.PSWD_ERR_TMS == "null"){
					appAlert("알림","서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.", "확인");
				}else{
					appAlert("알림", "비밀번호 입력 " + resultData.PSWD_ERR_TMS + "회\n오류가 발생하였습니다.\n5회 오류 발생 시\n이용에 제한이 있습니다.", "확인"); 
				}
			}
		}else{
			var tmpMassage = resultData.MASSAGE.replace("사유 :", "\n사유 :");
			appAlert("알림", tmpMassage, "확인");
			pageObj.cancel();
		}
	}
};

pageObj.mbrLock = function(){
	appConfirm("알림", "5회 번호 입력 오류가 발생하였습니다. 앱카드(간편결제) 앱을 통해 고객 인증후 사용이 가능합니다. 앱카드(간편결제)로 이동하시겠습니까?", "확인", "취소", function(){
		familyApp('롯데앱카드', 'com.lcacApp', 'lotteappcard://', 'http://itunes.apple.com/kr/app/losde-aebkadeu/id688047200?mt=8');
	}, function(){
		commPage("P", "LCMW3000");
	});
};

pageObj.cancel = function(){
	jq("#leftBtn").click();
};
pageObj.nextChk = function(){
	setTimeout(function(){
		if(jq("#ctf_pswd").val() == ""){
			jq("#nextBtn").removeClass("btn_r");
		}else{
			jq("#nextBtn").addClass("btn_r");
		}
	}, 10);
};

/* JavaScript content from js/LCMWC/LCMWC300.js in folder common */
pageObj.pageTitle = "비밀번호 설정";

pageObj.pageFunction = function(obj){
//	if(deviceInfo.os == "ios") jq("#blank").height(160);
	jq("#blank").height(160);
	adobeLogSet("LCMWC300");
//	jq("body").addClass("bg_dark");
	jq("#rightBtn").attr({"onclick" : "pageObj.cancel()", "class" : "home"}).show();
	pageObj.userInfo = eval("(" + obj + ")");
	// 보안키 호출
	pageObj.tagId = "disp_loginPwd";
	setMTransKey(openMtranKeypad);
};

pageObj.LCMWC300 = function(){
	if(jq("#loginPwd").val() == "" || jq("#chkPwd").val() == ""){
		appAlert("알림", "비밀번호를 입력해주세요.", "확인");
		return;
	}
	if(jq("#loginPwd").val() != jq("#chkPwd").val()){
		appAlert("알림", "비밀번호가 일치하지 않습니다. 재입력 후 다시 시도해 주세요", "확인");
		return;
	} 
	var params = {
			mmt_tcc_co_dc			: pageObj.userInfo.mmt_tcc_codc.charAt(0),	// 이동통신회사구분코드
			cell_no					: pageObj.userInfo.cell_no,					// 휴대전화번호
			os_nm					: deviceInfo.os,							// OS명
			os_ver_v				: deviceInfo.osVersion,						// OS버전값
			term_mdl_nm				: deviceInfo.osModel,						// 단말기모델명
			cst_drm_no				: pageObj.userInfo.ci,						// 고객식별번호
			mb_cno					: pageObj.userInfo.mb_cno,					// 멤버십 고객번호
			ur_nm					: pageObj.userInfo.ur_nm,					// 사용자명
			ur_rrno1				: pageObj.userInfo.ur_rrno1,				// 사용자 주민번호
			ur_rrno2				: pageObj.userInfo.ur_rrno2,				// 사용자 주민번호
			prv_info				: pageObj.userInfo.prv_info,				// 약관(일련번호, 버전번호, 동의여부), 구분자는 ":" 
			pwd						: jq("#tk_loginPwd").val(),					// 비밀번호
			confirm_pwd				: jq("#tk_chkPwd").val(),					// 비밀번호 확인
			map_key  				: mapKey,									// 보안키패드 적용후 넣을 값
			members_cdno 			: pageObj.userInfo.members_cdno,
			members_home_post_no 	: pageObj.userInfo.members_home_post_no,
			members_home_pn_add 	: pageObj.userInfo.members_home_pn_add,
			members_home_bpsno_add 	: pageObj.userInfo.members_home_bpsno_add,
			members_mail_id 		: pageObj.userInfo.members_mail_id
	};
	commPage("T", "lcmwc300", params, pageObj.resultLCMWC300);
};

pageObj.resultLCMWC300 = function(resultData){
	mOfferData.WELCOME_OFFER_YN = resultData.WELCOME_OFFER_YN;
	mOfferData.LOTTE_WELCOME_INFO = resultData.LOTTE_WELCOME_INFO;
	mOfferData.M12_WELCOME_INFO = resultData.M12_WELCOME_INFO;
	userInfo.wallet_member	= "Y";
	userInfo.mbr_st_dc		= "A";
	userInfo.wlt_mbr_seq	= resultData.WLT_MBR_SEQ;
	userInfo.ccd_mbyn		= resultData.IS_CREDIT_CARD_MEMBER;
	userInfo.sms_join		= resultData.IS_SMS_JOIN;
	userInfo.m12_cst_drm_no = resultData.M12_CST_DRM_NO;
	userInfo.cell_no		= pageObj.userInfo.cell_no;
	userInfo.cst_drm_no		= pageObj.userInfo.ci;
	userInfo.ur_nm			= pageObj.userInfo.ur_nm;
	userInfo.mb_cno			= pageObj.userInfo.mb_cno;
	userInfo.birth_day		= pageObj.userInfo.ur_rrno1;
	userInfo.mmt_tcc_co_dc	= pageObj.userInfo.mmt_tcc_codc;
	mobileBillData.cd_cno	= resultData.CD_CNO;
    //인증데이터 추가
    userInfo.members_member = certInfo.members_member;
    userInfo.members_active = certInfo.members_active;
    userInfo.card_m_agree = certInfo.card_m_agree;
    userInfo.members_active = certInfo.members_active;

	setLoginInfo(resultData.SERVER_KEY);
	if(resultData.PREV_WALLET_MEMBER == "N"){
		userInfo.first_join = true;
	}
	var tmpSms = "";
	if(userInfo.ccd_mbyn == "Y"){		// 카드회원
		if(userInfo.sms_join != "Y"){	// 카드회원 이면서 sms고객이 아닌경우
			smsBackPage = (userInfo.first_join) ? "LCMW2000" : "LCMW0000";
			tmpSms = "sms";
		}
		
	    if(userInfo.card_cert=="Y"){
	    	callNtv(null, null, "DevicePlugin", "saveData", ["","","","card_cert","Y"]);
	    }
	    //위에서 데이터 추가후 인증정보 초기화.
	    certInfo = {};

	}else{								// only 멤버스
		tmpSms = "mem";
	}
	commPage("P", "LCMWC310", tmpSms, "Y");
};

pageObj.nextChk = function(){
	if(jq("#loginPwd").val() != "" && jq("#chkPwd").val() != ""){
		jq("#joinComplete").attr("class", "btn_r31");
	}else{
		jq("#joinComplete").attr("class", "btn_31");
	}
	if(jq("#loginPwd").val() != "" && jq("#chkPwd").val() == ""){
		jq("#disp_chkPwd").click();
	}
};

pageObj.cancel = function(){
	appConfirm("알림", "취소하시겠습니까?\n회원가입이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};
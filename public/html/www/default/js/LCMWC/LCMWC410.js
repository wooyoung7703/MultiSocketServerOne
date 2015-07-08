
/* JavaScript content from js/LCMWC/LCMWC410.js in folder common */
pageObj.pageTitle = "비밀번호 재설정";

pageObj.pageFunction = function(obj){
//	if(deviceInfo.os == "ios") jq("#blank").height(160);
	jq("#blank").height(160);
//	jq("body").addClass("bg_dark");
	jq("#rightBtn").attr({"onclick" : "pageObj.cancel()", "class" : "home"}).show();
	obj = eval("(" + obj + ")");
	pageObj.userInfo = obj;
	
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
			ci_no		: pageObj.userInfo.ci,						// 고객식별번호
			app_pwd		: jq("#tk_loginPwd").val(),					// 비밀번호 확인
			map_key  	: mapKey									// 보안키패드 적용후 넣을 값
	};
	commPage("T", "lcmwb120", params, pageObj.resultLCMWC300);
};

pageObj.resultLCMWC300 = function(resultData){
	if(resultData.PWD_CHNG_RESULT == "Y"){
		userInfo.wlt_mbr_seq	= resultData.WLT_MBR_SEQ;
		userInfo.wallet_member	= "Y";
		userInfo.mbr_st_dc		= resultData.MBR_ST_DC;
		userInfo.ccd_mbyn		= resultData.CCD_MBYN;
		userInfo.cst_drm_no		= Base64.encode(resultData.CST_DRM_NO);
		userInfo.cell_no		= resultData.CELL_NO;
		userInfo.ur_nm			= resultData.UR_NM;
		userInfo.mmt_tcc_co_dc 	= resultData.MMT_TCC_CO_DC;
		userInfo.sms_join		= resultData.SMS_J_YN;
		userInfo.mb_cno			= resultData.MB_CNO;
		userInfo.m12_cst_drm_no	= resultData.M12_CST_DRM_NO;
		
		setLoginInfo(resultData.SERVER_KEY);
		
		if(userInfo.card_cert=="Y"){
			callNtv(null, null, "DevicePlugin", "saveData", ["","","","card_cert","Y"]);
		}
		
		appAlert("알림", "비밀번호 재설정이 성공적으로 이루어졌습니다.", "확인");
		goMain();
	}else{
		appAlert("알림", "비밀번호 변경에 실패하였습니다.", "확인");
		goMain();
	}
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
	appConfirm("알림", "취소하시겠습니까?\n비밀번호 재설정이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};
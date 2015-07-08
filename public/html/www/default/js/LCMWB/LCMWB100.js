
/* JavaScript content from js/LCMWB/LCMWB100.js in folder common */
pageObj.pageTitle = "비밀번호 설정";

pageObj.pageFunction = function(obj){
//	if(deviceInfo.os == "ios") jq("#blank").height(140);
	jq("#blank").height(140);
	// 보안키 호출
	pageObj.tagId = "disp_pre_app_pwd";
	setMTransKey(openMtranKeypad);
};

pageObj.LCMWB110 = function(){
	if(jq("#pre_app_pwd").val() == "" || jq("#next_app_pwd").val() == "" || jq("#next_chk_pwd").val() == ""){
		appAlert("알림", "비밀번호를 입력해주세요.", "확인");
		return;
	}
	if(jq("#next_app_pwd").val() != jq("#next_chk_pwd").val()){
		appAlert("알림", "비밀번호가 일치하지 않습니다. 다시 입력해 주세요.", "확인");
		return;
	}
	var params = {
			pre_app_pwd		: jq("#tk_pre_app_pwd").val(),
			next_app_pwd	: jq("#tk_next_app_pwd").val(),
			map_key			: mapKey
	};
	commPage("T", "lcmwb110", params, pageObj.resultLCMWB110);
};

pageObj.resultLCMWB110 = function(resultData){
	if(resultData.PWD_CHNG_RESULT == "Y"){
		appAlert("알림", "변경이 완료되었습니다.", "확인");
		jq("#leftBtn").click();
	}else{
		appAlert("알림", "비밀번호가 일치하지 않습니다. 다시 입력해 주세요.", "확인");
	} 
};

pageObj.nextChk = function(){
	if(jq("#pre_app_pwd").val() == "" || jq("#next_app_pwd").val() == "" || jq("#next_chk_pwd").val() == ""){
		jq("#changePasswd").addClass("btn_g");
	}else{
		jq("#changePasswd").removeClass("btn_g");
	}
	if(jq("#pre_app_pwd").val() != "" && jq("#next_app_pwd").val() == ""){
		jq("#disp_next_app_pwd").click();
	}
	if(jq("#next_app_pwd").val() != "" && jq("#next_chk_pwd").val() == ""){
		jq("#disp_next_chk_pwd").click();
	}
};
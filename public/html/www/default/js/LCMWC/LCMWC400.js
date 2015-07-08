
/* JavaScript content from js/LCMWC/LCMWC400.js in folder common */
pageObj.pageTitle = "본인인증";
pageObj.noCheckCert = "";
pageObj.certStartTime;
pageObj.telecomList = [{CODE : "", VALUE : "통신사선택"}];
var telecom_Array = "";
var telecom_comm = "";

pageObj.pageFunction = function(){
//	jq("body").addClass("bg_dark");
	jq("#rightBtn").attr({"onclick" : "pageObj.cancel()", "class" : "home"}).show();
	pageObj.certInfo = {};
	
	// 정보초기화
	pageObj.certInfo.mmt_tcc_codc = "";
	pageObj.certInfo.sex_dc = "F";
	pageObj.certInfo.fgn_Gbn = "1";
	pageObj.initCertInfo();	
	
	// 약관 조회
	pageObj.LCMWC210();
	//통신사 추가
	telecom_Array = new Array('SKT', 'KT', 'LGU+', 'SKT알뜰폰', 'KT알뜰폰', 'LGU+알뜰폰');    //통신사명
    telecom_comm = new Array('SKT', 'KTF', 'LGT', 'SKM', 'KTM', 'LGM');      //통신사구분코드
	for(var i = 0; i < telecom_Array.length ; i++){
		jq("#telecom").append("<option value='" + telecom_comm[i].toString() + "'>" + telecom_Array[i].toString() + "</option>");
		pageObj.telecomList.push({CODE : i.toString(), VALUE : telecom_Array[i].toString()});
	}

};

// 정보 초기화
pageObj.initCertInfo = function(){
	clearTimeout(pageObj.setTimeObj);
	jq("#remainTime").html("");
	jq("#nextBtn").attr("class", "btn_31");
	pageObj.remainTime = 0;
	pageObj.setTimeObj = "";
	pageObj.rd_no = "";
	pageObj.certNumSendFlag = false;		// 인증번호 발송 체크
	pageObj.certNumChkFlag = false;			// 인증번호 확인 체크
	pageObj.certInfo.ur_nm = "";
	pageObj.certInfo.ur_rrno1 = "";
	pageObj.certInfo.ur_rrno2 = "";
	pageObj.certInfo.rr_gender = "";
	pageObj.certInfo.cell_no = "";
	pageObj.hs_ctf_seq = "";				// 본인인증 일련번호
	pageObj.certtype = "";					// 본인인증 업체
	pageObj.sms_pcc = "";					// 서신평 응답코드 1
	pageObj.sms_auth = "";					// 서신평 응답코드 2
	pageObj.sms_cfn = "";					// 서신평 응답코드 3
	pageObj.req_info = "";					// 서신평 응답코드 4
	pageObj.req_num = "";					// 서신평 응답코드 5
	pageObj.res_seq = "";					// 나신평 응답코드 1
	pageObj.req_seq = "";					// 나신평 응답코드 2
	pageObj.certInfo.ci = "";				// Connecting Information
	pageObj.certInfo.mb_cno = "";			// 멤버십 고객번호
	pageObj.certInfo.members_member  = ""; 	// 멤버스 회원 여부
	pageObj.certInfo.prev_wlt_mbr_seq = "";	// 이전 월렛회원 일련번호
	
	if(deviceInfo.os == "android" && autoFillin){	// 안드로이드 폰의 경우 전화번호를 가져올수 있으므로
		pageObj.certInfo.cell_no = deviceInfo.phoneNo;
		//pageObj.certInfo.mmt_tcc_codc = deviceInfo.netOper;
		jq("#cell_no").val(getMaskingPhone(pageObj.certInfo.cell_no)).attr("readonly", "readonly");

//		jq(".radio").each(function(){
//			if(jq(this).data("value") == deviceInfo.netOper){
//				jq(this).addClass("radio_on");
//			}
//			if(jq(this).data("name") == "mmt_tcc_codc"){
//				jq(this).attr("onclick", "");
//			}
//		});
	}
};

// 본인인증 약관 조회
pageObj.LCMWC210 = function(){
	commPage("T", 'lcmwc210', "", pageObj.resultLCMWC210);
};

//약관 조회 결과
pageObj.resultLCMWC210 = function(resultData){
	pageObj.provision = resultData;
	
	var tmpMmt = (pageObj.certInfo.mmt_tcc_codc == "") ? "SKT" : pageObj.certInfo.mmt_tcc_codc;
	// 인증업체 약관
	var dataList = new GridControl({"row" : eval("resultData." + tmpMmt + ".PROVISION")});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#agreeList").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
	}
	if(deviceInfo.os == "android") pageObj.chkRadio();
	// 체크박스 활성화
	initCheckBox();
};

// 인증번호 발송
pageObj.certNumSend = function(){
	if(!pageObj.certNumChkFlag)pageObj.initCertInfo();
	
	if(pageObj.agreeChk()){
		var str = pageObj.noCheckCert ? "[" + pageObj.noCheckCert + "] 에 동의하지 않았습니다." : "서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.";
		appAlert("알림", str, "확인");
		pageObj.noCheckCert = "";
		return;
	}
	jq("#ur_nm").val(jq("#ur_nm").val().trim());
	if(jq("#ur_nm").val() == ""){
		appAlert("알림", "이름을 입력해주세요.", "확인");
		return;
	}
	if(jq("#ur_rrno1").val() == "" || jq("#ur_rrno1").val().length != 8){
		appAlert("알림", "생년월일 8자리를 정확히 입력해 주십시오.(예:19940101)", "확인");
		return;
	}
	
	jq(".radio_on").each(function(){
		eval("pageObj.certInfo." + jq(this).data("name") + "='" + jq(this).data("value") + "';");
	});
	if(pageObj.certInfo.mmt_tcc_codc == ""){
		appAlert("알림", "선택 된 통신사가 없습니다. 통신사를 선택해주세요.", "확인");
		return;
	}
	if(jq("#cell_no").val() == ""){
		appAlert("알림", "전화번호가 미입력 되었습니다. 전화번호를 입력해주세요.", "확인");
		return;
	}
	if(!pageObj.certInfoChk() && pageObj.certNumChkFlag){
		appAlert("알림", "이미 인증된 번호입니다.", "확인");
		return;
	}
	
	if(pageObj.certInfo.cell_no != userInfo.cell_no){
		appAlert("알림", "설치된 앱의 정보와 \n사용자 정보가 일치 하지 않습니다. \n정보를 정확히 입력해주세요.\n사용중인 폰으로 가입하지 않은 경우에는\n앱을 삭제 후 다시 설치해주세요", "확인");
		return;
	}
	pageObj.certInfo.rr_gender = pageObj.returnRrGender();
	pageObj.certInfo.ur_nm = jq("#ur_nm").val();
	pageObj.certInfo.ur_rrno1 = jq("#ur_rrno1").val();
	if(deviceInfo.os == "android" && autoFillin)
		pageObj.certInfo.cell_no = deviceInfo.phoneNo; 
	else 
		pageObj.certInfo.cell_no = jq("#cell_no").val();
	pageObj.certInfo.ur_rrno2 = pageObj.certInfo.rr_gender + "000000";
	
	jq("#rd_no").val("");
	var params = {
			ur_nm			: pageObj.certInfo.ur_nm,
			cell_no			: pageObj.certInfo.cell_no,
			ur_rrno1		: pageObj.certInfo.ur_rrno1,
			ur_rrno2		: pageObj.certInfo.ur_rrno2,
			mmt_tcc_codc	: pageObj.certInfo.mmt_tcc_codc,
			sex_dc			: pageObj.certInfo.sex_dc,
			fgn_Gbn			: pageObj.certInfo.fgn_Gbn
	};
	consoleLog("D", JSON.stringify(params));
	
	commPage("T", "lcmwc200", params, pageObj.resultCertNumSend);
};

// 인증번호 발송 결과
pageObj.resultCertNumSend = function(resultData){
	if(resultData.PERSONCERTIFY == "success"){
		appAlert("알림", "인증번호가 발송되었습니다.", "확인");
		jq("#sendNum").html("인증번호재전송");
		
		pageObj.hs_ctf_seq = resultData.HS_CTF_SEQ;
		pageObj.certtype = resultData.CERTTYPE;
		if(resultData.CERTTYPE == "siren"){				// 서신평
			pageObj.sms_pcc = resultData.SMS_PCC;		// 서신평 응답코드 1
			pageObj.sms_auth = resultData.SMS_AUTH;		// 서신평 응답코드 2
			pageObj.sms_cfn = resultData.SMS_CFN;		// 서신평 응답코드 3
			pageObj.req_info = resultData.REQ_INFO;		// 서신평 응답코드 4
			pageObj.req_num = resultData.REQ_NUM;		// 서신평 응답코드 5
		}else{											// 나신평
			pageObj.res_seq = resultData.RES_SEQ;		// 나신평 응답코드 1
			pageObj.req_seq = resultData.REQ_SEQ;		// 나신평 응답코드 2
		}
		
		pageObj.certNumSendFlag = true;
		pageObj.certStartTime = Math.floor(new Date().getTime()/1000) + 90;
		pageObj.showCountdown();
	}else{
		appAlert("알림", resultData.MESSAGE, "확인");
	}
};

// 인증번호 확인
pageObj.certNumChk = function(){
	if(!pageObj.certNumSendFlag){
		appAlert("알림", "인증번호를 전송 후 인증번호를 입력해주세요.", "확인");
		return;
	}
	if(pageObj.agreeChk() || pageObj.certInfoChk()){
		appAlert("알림", "변경된 정보가 있습니다.\n재인증 후 다시 시도해 주세요.", "확인");
		pageObj.initCertInfo();
		return;
	}
	if(pageObj.remainTime <= 0){
		appAlert("알림", "인증번호 입력시간이 초과되었습니다. 인증번호 재전송 후 입력하시기 바랍니다.", "확인");
		pageObj.initCertInfo();
		return;
	}
	if(jq("#rd_no").val() == ""){
		appAlert("알림", "인증번호를 입력해주세요", "확인");
		return;
	}
	if(jq("#rd_no").val().length != 6){
		appAlert("알림", "인증번호를 정확히 입력해주세요", "확인");
		return;
	}
	if(pageObj.certNumChkFlag){
		appAlert("알림", "이미 인증된 번호입니다.", "확인");
		return;
	}
	var params = {
			ur_nm			: pageObj.certInfo.ur_nm,
			ur_rrno1		: pageObj.certInfo.ur_rrno1,
			ur_rrno2		: pageObj.certInfo.ur_rrno2,
			cell_no			: pageObj.certInfo.cell_no,
			mmt_tcc_codc	: pageObj.certInfo.mmt_tcc_codc,
			sex_dc			: pageObj.certInfo.sex_dc,
			fgn_Gbn			: pageObj.certInfo.fgn_Gbn,
			rd_no			: jq("#rd_no").val(),
			hs_ctf_seq		: pageObj.hs_ctf_seq,
			sms_pcc			: pageObj.sms_pcc,
			sms_auth		: pageObj.sms_auth,
			sms_cfn			: pageObj.sms_cfn,
			req_info		: pageObj.req_info,
			req_num			: pageObj.req_num,
			res_seq			: pageObj.res_seq,
			req_seq 		: pageObj.req_seq,
			map_key			: mapKey
	};
	consoleLog("D", JSON.stringify(params));
	commPage("T", "lcmwc201", params, pageObj.resultCertNumChk);
};

// 인증번호 확인 결과
pageObj.resultCertNumChk = function(resultData){
	if(resultData.PERSONCERTIFY == "success"){
		clearTimeout(pageObj.setTimeObj);
		jq("#remainTime").html("");
		toastShow("인증이 완료되었습니다.");
		jq("#btnCertOk").html("인증성공");
		pageObj.certInfo.ci					= Base64.encode(resultData.CI);
		pageObj.certInfo.prev_wlt_mbr_seq	= resultData.PREV_WLT_MBR_SEQ;
		pageObj.certInfo.mb_cno				= resultData.MB_CNO;
        pageObj.certInfo.members_member		= resultData.IS_MEMBERS_MEMBER;
        pageObj.certInfo.card_m_agree	    = resultData.IS_CREDIT_CARD_M_AGREE;
		userInfo.ccd_mbyn			    	= resultData.IS_CREDIT_CARD_MEMBER;
		pageObj.certInfo.members_active		= resultData.IS_MEMBERS_ACTIVE;
		certInfo = pageObj.certInfo;
		jq("#nextBtn").attr("class", "btn_r31");
		pageObj.certNumChkFlag = true;
		jq(".check").unbind("click");
		jq("#ur_nm, #ur_rrno1, #cell_no, #rd_no").attr("readonly", "readonly");
		jq("#sendNum, #btnCertOk, #allCheck, .radio").attr("onclick", "");
	}else{
		appAlert("알림", "인증번호가 일치 하지 않습니다.", "확인");
	}
};

// 다음
pageObj.next = function(){
	if(!pageObj.certNumChkFlag){
		appAlert("알림", "휴대전화로 인증을 완료해주세요", "확인");
		return;
	}
	if(pageObj.agreeChk() || pageObj.certInfoChk()){
		appAlert("알림", "변경된 정보가 있습니다.\n재인증 후 다시 시도해 주세요.", "확인");
		pageObj.initCertInfo();
		return;
	}
	pageObj.certInfo.prv_info = pageObj.cert_prv_info;
	if(userInfo.ccd_mbyn == "Y" && userInfo.card_cert == "N"){	// 카드회원이 카드인증을 하지 않았을 경우 카드인증 페이지로
		appConfirm("알림", "안전한 클러치 서비스 이용을 위해 카드인증을 해주세요.", "카드인증", "종료", function(){
			commPage("P", "LCMW3090", pageObj.certInfo, "L");
		}, function(){
			callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "카드인증이 완료되지 않으면 서비스 이용이 불가합니다."]);
		});
	}else{
        var swtmp = setPageNum(userInfo.ccd_mbyn,pageObj.certInfo.card_m_agree,pageObj.certInfo.members_member,pageObj.certInfo.members_active,userInfo.card_cert);

        goPageNum(swtmp,"C400");
	}
};

// 약관 동의 체크
pageObj.agreeChk = function(){
	var agreeChkBool = false;
	pageObj.cert_prv_info = "";
	pageObj.noCheckCert = "";
	
	jq("#agreeList .check").each(function(){
		if(pageObj.cert_prv_info != "") pageObj.cert_prv_info += ":";
		pageObj.cert_prv_info += jq(this).find("input").eq(0).val() + ",";
		pageObj.cert_prv_info += jq(this).find("input").eq(1).val() + ",";
		
		if(jq(this).attr("class").match("check_on")){
			pageObj.cert_prv_info += "Y,";
		}else{
			pageObj.cert_prv_info += "N,";
			if(jq(this).find("input").eq(2).val() == "Y"){
				agreeChkBool = true;
				if(pageObj.noCheckCert == "") pageObj.noCheckCert = jq(this).find("input").eq(3).val().trim();
			}
		}
		pageObj.cert_prv_info += jq(this).find("input").eq(4).val();
	});
	if(jq("#agreeList .check").size() < 2){
		agreeChkBool = true;
		pageObj.noCheckCert = false;
	}
	return agreeChkBool;
};

// 인증확인 중 정보 변경 체크
pageObj.certInfoChk = function(){
	var infoChkBool = false;
	if(pageObj.certInfo.ur_nm != jq("#ur_nm").val()) infoChkBool = true;
	if(pageObj.certInfo.ur_rrno1 != jq("#ur_rrno1").val()) infoChkBool = true;
	if(deviceInfo.os != "android" || !autoFillin){
		if(pageObj.certInfo.cell_no != jq("#cell_no").val()) infoChkBool = true;
	}
	
	jq(".radio_on").each(function(){
		if(jq(this).data("name") == "sex_dc" && pageObj.certInfo.sex_dc != jq(this).data("value")) infoChkBool = true;
		if(jq(this).data("name") == "fgn_Gbn" && pageObj.certInfo.fgn_Gbn != jq(this).data("value")) infoChkBool = true;
		if(jq(this).data("name") == "mmt_tcc_codc" && pageObj.certInfo.mmt_tcc_codc != jq(this).data("value")) infoChkBool = true;
	});
	
	return infoChkBool;
};

//인증번호 입력 시간
pageObj.showCountdown = function(){	
    var ExpireTime = pageObj.certStartTime - Math.floor(new Date().getTime()/1000);
    pageObj.remainTime = ExpireTime - 1;

    if (pageObj.remainTime >= 0){
    	var mod = ExpireTime % (24 * 3600);
        // 남은분
    	var min = Math.floor(mod / 60);
        // 남은초
    	var sec = mod % 60;

        jq("#remainTime").html("남은시간 : " + ((min > 0) ? min + "분 " : "") + sec + "초");
        pageObj.certNumChkFlag = false;
        pageObj.setTimeObj = setTimeout("pageObj.showCountdown()", 1000);
    }else{
    	jq("#remainTime").html("종료");
    	jq("#rd_no").val("");
    	appAlert("알림", "인증번호 입력시간이 초과되었습니다. 인증번호 재전송 후 입력하시기 바랍니다.", "확인");
    }
};

// 통신사별 약관 체크
pageObj.certView = function(grpId, prvSeq, prvVerNo, prvSubNm){
	if(prvSubNm.match("통신사") && pageObj.certInfo.mmt_tcc_codc == ""){
		appAlert("알림", "통신사 선택 후 약관보기가 가능합니다.", "확인");
	}else{
		LCMWC150(grpId, prvSeq, prvVerNo);
	}
};

pageObj.cancel = function(){
	appConfirm("알림", "취소하시겠습니까?\n비밀번호 재설정이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};

pageObj.chkRadio = function(obj){
	jq(obj).parent().find("label").removeClass("radio_on");
	jq(obj).addClass("radio_on");
	if(jq(obj).data("name") == "mmt_tcc_codc"){
		var dataList = new GridControl({"row" : eval("pageObj.provision." + jq(obj).data("value") + ".PROVISION")});
		for(var i = 0; i < dataList.getSize(); i++){
			jq("#agreeList tr").eq(i).find("a").attr("onclick", "pageObj.certView('" + dataList.get(i).GRP_ID + "', '" + dataList.get(i).PRV_SEQ + "', '" + dataList.get(i).PRV_VER_NO + "', '개인정보 제공 및 이용 동의')");
			jq("#agreeList tr").eq(i).find("input").eq(0).val(dataList.get(i).PRV_SEQ);
			jq("#agreeList tr").eq(i).find("input").eq(1).val(dataList.get(i).PRV_VER_NO);
			jq("#agreeList tr").eq(i).find("input").eq(4).val(dataList.get(i).GRP_ID);
		}
	}
};

pageObj.changeSelect = function(obj){

	pageObj.certInfo.mmt_tcc_codc = jq(obj).val();
	
	unbindScroll();
	jq(window).scrollTop(10);
	var dataList = new GridControl({"row" : eval("pageObj.provision." + pageObj.certInfo.mmt_tcc_codc + ".PROVISION")});
	consoleLog("D", JSON.stringify(dataList));

	for(var i = 0; i < dataList.getSize(); i++){
		jq("#agreeList tr").eq(i).find("a").attr("onclick", "pageObj.certView('" + dataList.get(i).GRP_ID + "', '" + dataList.get(i).PRV_SEQ + "', '" + dataList.get(i).PRV_VER_NO + "', '개인정보 제공 및 이용 동의')");
		jq("#agreeList tr").eq(i).find("input").eq(0).val(dataList.get(i).PRV_SEQ);
		jq("#agreeList tr").eq(i).find("input").eq(1).val(dataList.get(i).PRV_VER_NO);
		jq("#agreeList tr").eq(i).find("input").eq(4).val(dataList.get(i).GRP_ID);
	}

};

//아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(obj){
    
    callNtv(null, null, "DevicePlugin", "selectbox", [pageObj.telecomList, "pageObj.iosChangeSelect"]);
    
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){

    pageObj.certInfo.mmt_tcc_codc = telecom_comm[tmpCode];

    unbindScroll();
    jq(window).scrollTop(0);
   
    jq("#telecom").val(telecom_comm[tmpCode]);
    jq("#iosSelect").html(telecom_Array[tmpCode]);

    var dataList = new GridControl({"row" : eval("pageObj.provision." + telecom_comm[tmpCode] + ".PROVISION")});

    for(var i = 0; i < dataList.getSize(); i++){
        jq("#agreeList tr").eq(i).find("a").attr("onclick", "pageObj.certView('" + dataList.get(i).GRP_ID + "', '" + dataList.get(i).PRV_SEQ + "', '" + dataList.get(i).PRV_VER_NO + "', '개인정보 제공 및 이용 동의')");
        jq("#agreeList tr").eq(i).find("input").eq(0).val(dataList.get(i).PRV_SEQ);
        jq("#agreeList tr").eq(i).find("input").eq(1).val(dataList.get(i).PRV_VER_NO);
        jq("#agreeList tr").eq(i).find("input").eq(4).val(dataList.get(i).GRP_ID);
    }

};

pageObj.returnRrGender = function(){
	
	var rrGender;
	if(jq("#ur_rrno1").val().substr(0,4) < 2000){
		if(pageObj.certInfo.fgn_Gbn == "1"){
			if(pageObj.certInfo.sex_dc == "M"){
				rrGender = "1";
			}else{
				rrGender = "2";
			}
		}else{
			if(pageObj.certInfo.sex_dc == "M"){
				rrGender = "5";
			}else{
				rrGender = "6";
			}
		}
	}else{
		if(pageObj.certInfo.fgn_Gbn == "1"){
			if(pageObj.certInfo.sex_dc == "M"){
				rrGender = "3";
			}else{
				rrGender = "4";
			}
		}else{
			if(pageObj.certInfo.sex_dc == "M"){
				rrGender = "7";
			}else{
				rrGender = "8";
			}
		}
	}
	return rrGender;
};

/* JavaScript content from js/LCMW7/LCMW7220.js in folder common */

/* JavaScript content from js/LCMW7/LCMW7220.js in folder common */
pageObj.pageTitle = "간편신청";
pageObj.noCheckCert = "";
pageObj.telecomList = [{CODE : "", VALUE : "통신사선택"}];
var telecom_Array = "";
var telecom_comm = "";

pageObj.pageFunction = function(obj){
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
	pageObj.certInfo = {};
	pageObj.certInfo.card_nm = obj;
	
	// 정보초기화
	pageObj.certInfo.mmt_tcc_codc = "";
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
	jq("#nextBtn").addClass("btn_g");
	pageObj.remainTime = 0;
	pageObj.setTimeObj = "";
	pageObj.rd_no = "";
	pageObj.certNumSendFlag = false;		// 인증번호 발송 체크
	pageObj.certNumChkFlag = false;			// 인증번호 확인 체크
	pageObj.certInfo.ur_nm = "";
	pageObj.certInfo.ur_rrno1 = "";
	pageObj.certInfo.ur_rrno2 = "";
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
	pageObj.noCheckCert = "";				// 필수 조건에서 체크하지 않은 약관
	
	if(deviceInfo.os == "android" && autoFillin){	// 안드로이드 폰의 경우 전화번호를 가져올수 있으므로
		pageObj.certInfo.cell_no = deviceInfo.phoneNo;
		jq("#cell_no").val(getMaskingPhone(pageObj.certInfo.cell_no)).attr("readonly", "readonly");
		//pageObj.certInfo.mmt_tcc_codc = deviceInfo.netOper;
	}
};

// 본인인증 약관 조회
pageObj.LCMWC210 = function(){
	commPage("T", 'lcmwc210', "", pageObj.resultLCMWC210);
};

//약관 조회 결과
pageObj.resultLCMWC210 = function(resultData){
	pageObj.provision = resultData;
	
	// 인증업체 약관
	var dataList = new GridControl({"row" : resultData.SKT.PROVISION});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#agreeList").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
	}
	if(deviceInfo.os == "android") pageObj.chkRadio();
	// 체크박스 활성화
	initCheckBox();
	// 보안키 호출
	setMTransKey();
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
	if(jq("#ur_nm").val().trim() == ""){
		appAlert("알림", "이름을 입력해주세요.", "확인");
		return;
	}
	if(jq("#ur_rrno1").val() == "" || jq("#ur_rrno1").val().length != 6){
		appAlert("알림", "주민번호 앞자리 6자리를 정확히 입력해 주십시오.", "확인");
		return;
	}
	if(jq("#ur_rrno2").val() == ""){
		appAlert("알림", "주민번호 뒷자리 7자리를 정확히 입력해 주십시오.", "확인");
		return;
	}
	if(jq("#telecom").val() == ""){
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

	if(deviceInfo.os == "android" && autoFillin)
		pageObj.certInfo.cell_no = userInfo.cell_no; 
	else 
		pageObj.certInfo.cell_no = jq("#cell_no").val();
	
	jq("#rd_no").val("");
	var params = {
			ur_nm			: jq("#ur_nm").val().trim(),
			ur_rrno1		: jq("#ur_rrno1").val(),
			ur_rrno2		: jq("#tk_ur_rrno2").val(),
			cell_no			: pageObj.certInfo.cell_no,
			mmt_tcc_codc	: pageObj.certInfo.mmt_tcc_codc,
			map_key			: mapKey
	};
	consoleLog("D", JSON.stringify(params));

	commPage("T", "lcmw7220", params, pageObj.resultCertNumSend);
//	pageObj.resultCertNumSend();
};

// 인증번호 발송 결과
pageObj.resultCertNumSend = function(resultData){
	if(resultData.PERSONCERTIFY == "success"){
		appAlert("알림", "인증번호가 발송되었습니다.", "확인");
		jq("#sendNum").html("인증번호재전송");
		pageObj.certInfo.ur_nm = jq("#ur_nm").val();
		pageObj.certInfo.ur_rrno1 = jq("#ur_rrno1").val();
		pageObj.certInfo.ur_rrno2 = jq("#tk_ur_rrno2").val();
		if(deviceInfo.os == "android" && autoFillin)
			pageObj.certInfo.cell_no = deviceInfo.phoneNo; 
		else 
			pageObj.certInfo.cell_no = jq("#cell_no").val();
		//pageObj.certInfo.mmt_tcc_codc = jq(".radio_on").data("mmt_tcc_codc");
		pageObj.rd_no = resultData.rd_no;
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
			ur_nm			: pageObj.certInfo.ur_nm.trim(),
			ur_rrno1		: pageObj.certInfo.ur_rrno1,
			ur_rrno2		: pageObj.certInfo.ur_rrno2,
			cell_no			: pageObj.certInfo.cell_no,
			mmt_tcc_codc	: pageObj.certInfo.mmt_tcc_codc,
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
	
	commPage("T", "lcmw7221", params, pageObj.resultCertNumChk);
//	pageObj.resultCertNumChk();
};

// 인증번호 확인 결과
pageObj.resultCertNumChk = function(resultData){
	
	if(resultData.PERSONCERTIFY == "success"){
		clearTimeout(pageObj.setTimeObj);
		jq("#remainTime").html("");
		toastShow("인증이 완료되었습니다.");
		jq("#btnCertOk").html("인증성공");
		jq("#nextBtn").removeClass("btn_g");
		pageObj.certNumChkFlag = true;
		jq(".radio").unbind("click");
		jq(".check").unbind("click");
		jq("#ur_nm, #ur_rrno1, #cell_no, #rd_no").attr("readonly", "readonly");
		jq("#disp_ur_rrno2, #sendNum, #btnCertOk, #allCheck").attr("onclick", "");
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
	pageObj.LCMW7240();
};

pageObj.LCMW7240 = function(){
	var params = {
			ur_nm			: pageObj.certInfo.ur_nm,
			ur_rrno1		: pageObj.certInfo.ur_rrno1,
			ur_rrno2		: pageObj.certInfo.ur_rrno2,
			cell_no			: pageObj.certInfo.cell_no,
			cd_pd_knd_nm	: pageObj.certInfo.card_nm,
			map_key			: mapKey
	};
	commPage("T", "lcmw7240", params, pageObj.resultLCMW7240);
};

pageObj.resultLCMW7240 = function(resultData){
	if(resultData.POPULARCARD_RESULT == "success"){
		commPage("P", "LCMW7240", pageObj.certInfo, "L");
	}else{
		appAlert("알림", "카드 간편신청에 실패했습니다.\n잠시후 다시 이용해 주세요", "확인");
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
	if(pageObj.certInfo.ur_rrno2 != jq("#tk_ur_rrno2").val()) infoChkBool = true;
	if(deviceInfo.os != "android" || !autoFillin){
		if(pageObj.certInfo.cell_no != jq("#cell_no").val()) infoChkBool = true;
	}
	//if(pageObj.certInfo.mmt_tcc_codc != jq(".radio_on").data("mmt_tcc_codc")) infoChkBool = true;
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
	if(prvSubNm.match("통신사") && jq(".radio_on").data("mmt_tcc_codc") == undefined){
		appAlert("알림", "통신사 선택 후 약관보기가 가능합니다.", "확인");
	}else{
		LCMWC150(grpId, prvSeq, prvVerNo);
	}
};
pageObj.cancel = function(){
	appConfirm("알림", "취소하시겠습니까?\n간편신청이 취소되며, [카드신청]화면으로 이동됩니다.", "확인", "취소", function(){
		backData.pop();
		jq("#leftBtn").click();
	}, function(){
	});
};
pageObj.cancelHome = function(){
	appConfirm("알림", "취소하시겠습니까?\n간편신청이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};
pageObj.nextChk = function(){
	if(jq("#loginPwd").val() != "" && jq("#chkPwd").val() != ""){
		jq("#complete").attr("class", "btn_r31");
	}else{
		jq("#complete").attr("class", "btn_31");
	}
};

pageObj.rrno2 = function(){
	if(jq("#ur_rrno1").val().length == 6 && jq("#disp_ur_rrno2").html() == ""){
		jq("#ur_rrno1").blur();
//		jq("#disp_ur_rrno2").focus();
		jq("#disp_ur_rrno2").click();
	}
};

pageObj.chkRadio = function(){
	setTimeout(function(){
		var dataList = new GridControl({"row" : eval("pageObj.provision." + jq(".radio_on").data("mmt_tcc_codc") + ".PROVISION")});
		for(var i = 0; i < dataList.getSize(); i++){
			jq("#agreeList tr").eq(i).find("a").attr("onclick", "pageObj.certView('" + dataList.get(i).GRP_ID + "', '" + dataList.get(i).PRV_SEQ + "', '" + dataList.get(i).PRV_VER_NO + "', '개인정보 제공 및 이용 동의')");
			jq("#agreeList tr").eq(i).find("input").eq(0).val(dataList.get(i).PRV_SEQ);
			jq("#agreeList tr").eq(i).find("input").eq(1).val(dataList.get(i).PRV_VER_NO);
			jq("#agreeList tr").eq(i).find("input").eq(4).val(dataList.get(i).GRP_ID);
		}
	}, 50);
};
pageObj.changeSelect = function(obj){

	pageObj.certInfo.mmt_tcc_codc = jq(obj).val();
	
	unbindScroll();
	jq(window).scrollTop(10);
	var dataList = new GridControl({"row" : eval("pageObj.provision." + pageObj.certInfo.mmt_tcc_codc + ".PROVISION")});

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

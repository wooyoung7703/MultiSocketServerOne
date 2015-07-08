
/* JavaScript content from js/LCMW3/LCMW3152.js in folder common */
pageObj.pageTitle = "정보입력";
pageObj.page_size = 10;		// 도로명 검색시 페이징
pageObj.page_no = 1;		// 도로명 검색시 페이징
pageObj.homPnsq = "";		// 자택지번[3] 도로명주소일때 필수
pageObj.homNaddYn = "0";	// 자택신주소여부[1] 0:지번주소(구주소), 1:도로명주소(신주소)
pageObj.listEmail = [
                     	{CODE : "",				VALUE : "직접입력"},
                     	{CODE : "naver.com",	VALUE : "naver.com"},
                     	{CODE : "hanmail.net",	VALUE : "hanmail.net"},
                     	{CODE : "nate.com",		VALUE : "nate.com"},
                     	{CODE : "gmail.com",	VALUE : "gmail.com"},
                     	{CODE : "hotmail.com",	VALUE : "hotmail.com"},
                     	{CODE : "yahoo.co.kr",	VALUE : "yahoo.co.kr"}
                     ];
pageObj.listAdd1 = [{CODE : "", VALUE : "시도명 검색"}];
pageObj.listAdd2 = [{CODE : "", VALUE : "시군구명 검색"}];
pageObj.listYear = [];
pageObj.listMonth = [];
pageObj.listDay = [];

pageObj.pageFunction = function(obj){
	consoleLog("D", obj);
	adobeLogSet("LCMWC220");
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
	pageObj.memJoinInfo = eval("(" + obj + ")");
//	consoleLog("D", JSON.stringify(pageObj.memJoinInfo));
//	jq("body").addClass("bg_dark");
	
	if(pageObj.memJoinInfo.userInfo != ""){		// 회원가입을 통해 진입 했을 경우 입력 받은 값을 넣어준다
		userInfo.ur_nm			= pageObj.memJoinInfo.userInfo.ur_nm;
		userInfo.cst_drm_no		= pageObj.memJoinInfo.userInfo.ci;
		userInfo.birth_day		= pageObj.memJoinInfo.userInfo.ur_rrno1;
		userInfo.rr_gender		= pageObj.memJoinInfo.userInfo.rr_gender;
		userInfo.mmt_tcc_co_dc	= pageObj.memJoinInfo.userInfo.mmt_tcc_codc;
		userInfo.cell_no		= pageObj.memJoinInfo.userInfo.cell_no;
	}
	pageObj.setLayout();
	initCheckBox();

};

pageObj.setLayout = function(){
	jq("#ur_nm").html(getMaskingName(userInfo.ur_nm));
	var tmpYear = yyyymm(new Date()).substr(0, 4); 
	for(var i = 1900; i <= tmpYear; i++){
		jq("#birth_year").append("<option value='" + i + "'>" + i + "</option>");
		pageObj.listYear.push({CODE : i.toString(), VALUE : i.toString()});
	}
	for(var i = 1; i <= 12; i++){
		jq("#birth_month").append("<option value='" + i + "'>" + i + "</option>");
		pageObj.listMonth.push({CODE : i.toString(), VALUE : i.toString()});
	}
	jq("#birth_year").val(userInfo.birth_day.substr(0, 4));
	jq(".iosSelect4").html(userInfo.birth_day.substr(0, 4));
	jq("#birth_month").val(parseInt(userInfo.birth_day.substr(4, 2), 10));
	jq(".iosSelect5").html(parseInt(userInfo.birth_day.substr(4, 2), 10));
	pageObj.changeBirth();
	jq("#birth_day").val(parseInt(userInfo.birth_day.substr(6, 2), 10));
	jq(".iosSelect6").html(parseInt(userInfo.birth_day.substr(6, 2), 10));
	pageObj.birthDc = "1";
	pageObj.mafemDc = (userInfo.rr_gender % 2) ? "1" : "2";
	pageObj.frnYn = (userInfo.rr_gender > 4) ? "1" : "0";
	pageObj.dmAddDc = "002";
};
pageObj.changeBirth = function(){
	var tmpLastDate = lastDate(jq("#birth_year").val(), jq("#birth_month").val());
	jq("#birth_day").html("");
	pageObj.listDay = [];
	for(var i = 1; i <= tmpLastDate; i++){
		jq("#birth_day").append("<option value='" + i + "'>" + i + "</option>");
		pageObj.listDay.push({CODE : i.toString(), VALUE : i.toString()});
	}
};
pageObj.changeEmail = function(){
	if(jq("#select_email").val() == ""){
		jq("#email02").val("").removeAttr("readonly");
	}else{
		jq("#email02").val(jq("#select_email").val()).attr("readonly", "readonly");
	}
	jq("#email02").blur();
};

pageObj.search = function(){
	initFullPop("btnZipPop", {
		leftBtn		: true, 
		bgDark		: true,
		marginTop	: "90px"
	});
	jq(".btnZipPop").click();
	pageObj.changeZipSearch("lcmwc222");
};

pageObj.LCMWC220 = function(){
	var email = jq("#email01").val() + "@" + jq("#email02").val();
	var netOper = "9";
	if(userInfo.mmt_tcc_co_dc == "SKT"){
		netOper = "1";
	}else if(userInfo.mmt_tcc_co_dc == "KTF"){
		netOper = "2";
	}else if(userInfo.mmt_tcc_co_dc == "LGT"){
		netOper = "3";
	}else if(userInfo.mmt_tcc_co_dc == "SKM"){
		netOper = "4";
	}else if(userInfo.mmt_tcc_co_dc == "KTM"){
		netOper = "5";
	}else if(userInfo.mmt_tcc_co_dc == "LGM"){
		netOper = "6";
	}
	if(email.length > 50){
		appAlert("알림", "이메일 입력 글자 수를 초과 하였습니다. 재입력 후 다시 시도해 주세요.", "확인");
		return;
	}
    if(isEmail(email)){
        appAlert("알림", "입력하신 이메일 주소가 올바르지 않습니다. 이메일 확인 후 재 입력하여 주세요.", "확인");
        return;
    }

	// 주소 벨리 데이션 수정
	if(jq("#zip_code01").val() == ""){
		appAlert("알림", "우편번호 찾기를 해주세요.", "확인");
		return;
	}
	
	if(jq("#address02").val().trim() == "" && pageObj.homNaddYn == "0"){
		appAlert("알림", "상세주소를 입력해주세요.", "확인");
		return;
	}
	var tmpBirth = jq("#birth_year").val() + zero(jq("#birth_month").val(), 2) + zero(jq("#birth_day").val(), 2);
	consoleLog("D", pageObj.memJoinInfo.ofrAgChoYn);
	var params = {
			mlId 			: email,												// 이메일
			cstNm 			: userInfo.ur_nm,									// 한글성명
			cltUAgMyn 		: "1",													// 수집이용동의필수여부[1] 1:동의, 2:비동의
			cltUAgChoYn 	: pageObj.memJoinInfo.cltUAgChoYn,						// 수집이용동의선택여부[1] 1:동의, 2:비동의
			ofrAgMyn 		: "1",													// 제공동의필수여부[1] 1:동의, 2:비동의
			ofrAgChoYn 		: pageObj.memJoinInfo.ofrAgChoYn,						// 제공동의선택여부[1] 1:동의, 2:비동의
			bird 			: userInfo.birth_day,									// 법정생년월일[8]
			birdDc 			: "1",													// 법정생일음양구분[1] 1:양력, 2:음력
			birth			: tmpBirth,												// 생년월일
			birthDc			: pageObj.birthDc,										// 생일음양구분 1:양력, 2:음력
			mafemDc			: pageObj.mafemDc,										// 남여구분 1:남, 2:여
			frnYn			: pageObj.frnYn,										// 내외국인 0:내국인, 1:외국인
			dmAddDc			: pageObj.dmAddDc,										// 우편물수령지구분 001:직장, 002:자택 
			homPstNo 		: jq("#zip_code01").val() + jq("#zip_code02").val(),	// 자택우편번호
			homPnsq 		: pageObj.homPnsq,										// 자택지번[3] 도로명주소일때 필수
			homNaddYn		: pageObj.homNaddYn,									// 자택신주소여부[1] 0:지번주소(구주소), 1:도로명주소(신주소)
			homPnadd 		: jq("#address01").val(),								// 자택우편번호주소(현재)[60] 고객이 입력한 자택주소(지번/도로명)
			homBpsnoAdd 	: jq("#address02").val().trim(),						// 자택우편번호외주소(현재)[150] 고객이 입력한 자택주소(지번/도로명)
			homBpsnoAdd2 	: "",													// 자택대량배달처주소[100] 자택신주소여부=1일때만 setting
			homBldMgno 		: "",													// 자택건물관리번호[25] 자택신주소여부=1일때만 setting
			homPnaddBk 		: "",													// 자택우편번호주소(백업)[60] 자택신주소여부=1일때만 도로명주소에 대한 백업 지번주소
			homBpsnoAddBk	: "",													// 자택우편번호외주소(백업)[150] 자택신주소여부=1일때만 도로명주소에 대한 백업 지번주소
			offiPstNo 		: jq("#zip_code01").val() + jq("#zip_code02").val(),	// 직장우편번호
			offiPnsq 		: pageObj.homPnsq,										// 직장지번[3] 도로명주소일때 필수
			offiNaddYn		: pageObj.homNaddYn,									// 직장신주소여부[1] 0:지번주소(구주소), 1:도로명주소(신주소)
			offiPnadd 		: jq("#address01").val(),								// 직장우편번호주소(현재)[60] 고객이 입력한 직장주소(지번/도로명)
			offiBpsnoAdd 	: jq("#address02").val().trim(),						// 직장우편번호외주소(현재)[150] 고객이 입력한 직장주소(지번/도로명)
			offiBpsnoAdd2 	: "",													// 직장대량배달처주소[100] 
			offiBldMgno 	: "",													// 직장건물관리번호[25] 
			offiPnaddBk 	: "",													// 직장우편번호주소(백업)[60]
			offiBpsnoAddBk	: "",													// 직장우편번호외주소(백업)[150] 자
			tcccDc 			: netOper,												// 휴대폰통신사구분[8] 1:SKT, 2:KTF, 3:LGT, 9:ETC
			mblNo 			: userInfo.cell_no,										// 휴대폰번호[12]
			ppmCdAplpDc		: "1", 													// 선불카드신청자구분코드[1] 1:일반, 2:청소년, 3:어린이
			CI_NO			: userInfo.cst_drm_no,									// CI번호
			route			: "",													// 멤버스 카드 발급 여부 ("" : 회원가입, "MJ" : 카드발급)
			dmTakYn			: "0",													// DM수신여부 1:동의, 0:비동의
			tmTakYn			: "0",													// TM수신여부 1:동의, 0:비동의
			smsRcvYn		: "0",													// SMS수신여부 1:동의, 0:비동의
			mlRcvYn			: "0",													// EMAIL수신여부 1:동의, 0:비동의
	};
	
	if(pageObj.dmAddDc == "001"){
		params.homPstNo = "";
		params.homPnsq = ""; 	
		params.homNaddYn = "";	
		params.homPnadd = ""; 	
		params.homBpsnoAdd = "";
	}else{
		params.offiPstNo = "";
		params.offiPnsq = ""; 	
		params.offiNaddYn = "";	
		params.offiPnadd = ""; 	
		params.offiBpsnoAdd = "";
	}
	
	jq(".check_on").each(function(){
		if(this.id != "allCheck") eval("params." + jq(this).data("value_id") + "='1'"); 
	});
	
	if(pageObj.memJoinInfo.userInfo == ""){		// 멤버스 카드 발급
		params.route = "MJ";
	}
	consoleLog("D", JSON.stringify(params));
	commPage("T", "lcmwc220", params, pageObj.resultLCMWC220);
};

pageObj.resultLCMWC220 = function(resultData){
	if(pageObj.memJoinInfo.userInfo != ""){		// 회원 신규가입
		if(resultData.PC_RC == "000"){
			pageObj.memJoinInfo.userInfo.mb_cno 				= resultData.MEMBERS_CNO;
			pageObj.memJoinInfo.userInfo.members_cdno 			= resultData.MEMBERS_CDNO; 				// 멤버십 카드번호
			pageObj.memJoinInfo.userInfo.members_home_post_no	= resultData.MEMBERS_HOME_POST_NO;  	// 우편번호
			pageObj.memJoinInfo.userInfo.members_home_pn_add	= resultData.MEMBERS_HOME_PN_ADD; 		// 주소
			pageObj.memJoinInfo.userInfo.members_home_bpsno_add = resultData.MEMBERS_HOME_BPSNO_ADD;	// 주소2
			pageObj.memJoinInfo.userInfo.members_mail_id		= resultData.MEMBERS_MAIL_ID;			// E-mail
            
            if(userInfo.card_cert == "Y"){//카드인증 했으면
                commPage("P", "LCMWC300", pageObj.memJoinInfo.userInfo, "L");
            }else{
                if(userInfo.ccd_mbyn=="Y"){
                    commPage("P", "LCMW3093", certInfo, "L");
                }else{
                    commPage("P", "LCMWC300", pageObj.memJoinInfo.userInfo, "L");
                }
            }
		}else{
//			commPage("P", "LCMWC300", pageObj.memJoinInfo.userInfo, "L");
			appAlert("알림", resultData.PC_RS_MSG , "확인");
			goMain();
		}
	}else{									
		if(resultData.PC_RC == "000"){
			adobeLogSet("LCMWC221");
			if((certInfo.type="main"||certInfo.type=="C000")&&userInfo.card_cert=="N"){
				appAlertOne("알림", "L.POINT 카드가 발급되었습니다.", "확인", function(){
	            	appConfirm("알림", "안전한 클러치 서비스 이용을 위해 카드인증을 해주세요.", "카드인증", "종료", function(){
	                    commPage("P", "LCMW3090", certInfo, "L");
	            	}, function(){
	        			callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "카드인증이 완료되지 않으면 서비스 이용이 불가합니다."]);
	            	});
				});
			}else{
				appAlert("알림", "L.POINT 카드가 발급되었습니다.", "확인");
			}
		}else{
			appAlert("알림", resultData.PC_RS_MSG, "확인");
		}
        if(userInfo.card_cert == "Y"){
            commPage("P", "LCMW3100");
        }else{
            if(userInfo.ccd_mbyn=="Y"){
            }else{
                commPage("P", "LCMW3100");
            }
        }

	}

};

pageObj.cancel = function(){
	if(pageObj.memJoinInfo.userInfo != ""){		// 회원 신규가입
		appConfirm("알림", "취소하시겠습니까?\n회원가입이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
			goMain();
		}, function(){
		});
	}else{
		appConfirm("알림", "취소하시겠습니까?\n카드발급이 취소되며, [멤버십]화면으로 이동됩니다.", "확인", "취소", function(){
			commPage("P", "LCMW3100");
		}, function(){
		});
	}
};

pageObj.cancelHome = function(){
	var tmpTxt = pageObj.memJoinInfo.userInfo != "" ? "회원가입" : "카드발급";
	appConfirm("알림", "취소하시겠습니까?\n" + tmpTxt + "이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};

pageObj.LCMWC222 = function(){
	jq("#full_pop_cont .ttv_nm").blur();
	var tmpTtmNm = jq("#full_pop_cont .ttv_nm").val().replace(/(\s*)/g, "");
	if(tmpTtmNm == ""){
		appAlert("알림", "찾으시는 주소의 동(읍/면/리)을 입력하여 주세요.", "확인");
		return;
	}
	if(tmpTtmNm.length < 2){
		appAlert("알림", "두글자 이상 입력하여 주세요.", "확인");
		return;
	}
	var params = {
			ttv_nm : tmpTtmNm
	};
	commPage("T", "lcmwc222", params, pageObj.resultLCMWC222);
};
pageObj.resultLCMWC222 = function(resultData){
	jq("#full_pop_cont .list_lcmwc222 strong, #full_pop_cont .list_lcmwc222 ul").html("");
	jq("#full_pop_cont .list_lcmwc222").show();
	if(resultData.ADDR_SIZE > 0){
		jq("#full_pop_cont .list_lcmwc222 strong").html("총 " + resultData.ADDR_SIZE + "건이 검색되었습니다.");
		var dataList = new GridControl({"row" : resultData.ADDR});
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).PSNO = dataList.get(i).PSNO.substr(0, 3) + "-" + dataList.get(i).PSNO.substr(3, 3);
			dataList.get(i).ADDRSEL =	dataList.get(i).MGPO_NM + " " + 
										dataList.get(i).CCD_NM + " " + 
										dataList.get(i).TTV_NM +  
										(dataList.get(i).LI_BLD_NM == "" ? "" : " " + dataList.get(i).LI_BLD_NM);
			dataList.get(i).ADDRLIST = dataList.get(i).ADDRSEL + (dataList.get(i).PNSQ_CN == "" ? "" : " " + dataList.get(i).PNSQ_CN); 
			dataList.get(i).BLD_PNO = "";
			jq("#full_pop_cont .list_lcmwc222 ul").append(bindData(jq("#zipListTmpl").val(), dataList.get(i)));
		}
	}else{
		jq("#full_pop_cont .list_lcmwc222 strong").html("검색 결과가 없습니다.");
	}
};

pageObj.insertAddr = function(zipCode, addr, homPnsq){
	jq(".f_pop_close").click();
	pageObj.homPnsq = homPnsq;
	jq("#zip_code01").val(zipCode.split("-")[0]);
	jq("#zip_code02").val(zipCode.split("-")[1]);
	jq("#address01").val(addr.trim());
	pageObj.nextChk();
};

pageObj.changeZipSearch = function(flag){
	jq("#full_pop_cont .zip_search_nav a").each(function(){
		jq(this).attr("onclick").match(flag) ? jq(this).addClass("on") : jq(this).removeClass("on");
	});
	
	jq(".zip_search").hide();
	jq("#full_pop_cont .zip_" + flag).show();

	if(flag == "lcmwc222"){
		pageObj.homNaddYn = "0";
		jq("#full_pop_cont .ttv_nm").val("");
		jq("#full_pop_cont .list_lcmwc222").hide();
	}else{
		pageObj.homNaddYn = "1";
		jq("#full_pop_cont .select_lcmwc224").val("");
		jq("#full_pop_cont .select_lcmwc225").val("");
		jq("#full_pop_cont .select_lcmwc225").html("<option value=''>시군구명 검색</option>");
		pageObj.listAdd2 = [{CODE : "", VALUE : "시군구명 검색"}];
		jq(".iosSelect2").html("시도명 검색");
		jq(".iosSelect3").html("시군구명 검색");
		if(jq("#full_pop_cont .select_lcmwc224 option").size() < 2){
			commPage("T", "lcmwc224", "", pageObj.resultLCMWC224);
		}
	}
};

pageObj.resultLCMWC224 = function(resultData){
	var dataList = new GridControl({"row" : resultData.SIDO});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#full_pop_cont .select_lcmwc224").append("<option value='" + dataList.get(i).MGPO_C + "'>" + dataList.get(i).MGPO_NM + "</option>");
		pageObj.listAdd1.push({CODE : dataList.get(i).MGPO_C, VALUE : dataList.get(i).MGPO_NM});
	}
};

pageObj.changeLcmwc224 = function(){
	jq("#full_pop_cont .select_lcmwc225").html("<option value=''>시군구명 검색</option>");
	
	if(jq("#full_pop_cont .select_lcmwc224").val() != ""){
		var params = {
				mgpo_c	: jq("#full_pop_cont .select_lcmwc224").val()
		};
		commPage("T", "lcmwc225", params, pageObj.resultLCMWC225);
	}
};

pageObj.resultLCMWC225 = function(resultData){
	var dataList = new GridControl({"row" : resultData.GUNGU});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#full_pop_cont .select_lcmwc225").append("<option value='" + dataList.get(i).CCD_C + "'>" + dataList.get(i).CCD_NM + "</option>");
		pageObj.listAdd2.push({CODE : dataList.get(i).CCD_C, VALUE : dataList.get(i).CCD_NM});
	}
};

pageObj.LCMWC223 = function(){
	if(jq("#full_pop_cont .select_lcmwc224").val() == ""){
		appAlert("알림", "시도명을 선택해 주세요.", "확인");
		return;
	}
	if(jq("#full_pop_cont .select_lcmwc225").val() == ""){
		appAlert("알림", "시군구명을 선택해 주세요.", "확인");
		return;
	}
	var tmpTtmNm = jq("#full_pop_cont .road_nm").val().replace(/(\s*)/g, "");
	if(tmpTtmNm == ""){
		appAlert("알림", "도로명을 입력해주세요", "확인");
		return;
	}
	if(tmpTtmNm < 2){
		appAlert("알림", "도로명을 두글자 이상 입력해주세요", "확인");
		return;
	}
	pageObj.page_no = 1;
	pageObj.roadSearch();
	
};

pageObj.resultLCMWC223 = function(resultData){
	jq("#full_pop_cont .list_lcmwc223 strong, #full_pop_cont .list_lcmwc223 ul").html("");
	jq("#full_pop_cont .list_lcmwc223").show();
	if(resultData.ADDR_SIZE > 0){
		jq("#full_pop_cont .list_lcmwc223 strong").html("총 " + resultData.ADDR_SIZE + "건이 검색되었습니다.");
		var dataList = new GridControl({"row" : resultData.ADDR});
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).PSNO = dataList.get(i).PSNO.substr(0, 3) + "-" + dataList.get(i).PSNO.substr(3, 3);
			dataList.get(i).ADDRSEL =	dataList.get(i).MGPO_NM	+ " " + 
										dataList.get(i).CCD_NM	+ " " + 
										dataList.get(i).ROAD_NM + " " + 
										dataList.get(i).BLD_PNO + 
										((dataList.get(i).BLD_SDNO == "0" || dataList.get(i).BLD_SDNO == "") ? "" : "-" + dataList.get(i).BLD_SDNO) + 
										(dataList.get(i).BLD_NM == "" ? "" : " " + dataList.get(i).BLD_NM) +
										(dataList.get(i).DTL_BLD_NM == "" ? "" : " " + dataList.get(i).DTL_BLD_NM);
			dataList.get(i).ADDRLIST = dataList.get(i).ADDRSEL;
			jq("#full_pop_cont .list_lcmwc223 ul").append(bindData(jq("#zipListTmpl").val(), dataList.get(i)));
		}
		pageObj.paging(resultData.ADDR_SIZE);
		jq("#full_pop_cont .paging_lcmwc223").show();
	}else{
		jq("#full_pop_cont .list_lcmwc223 strong").html("검색 결과가 없습니다.");
	}
};

pageObj.paging = function(totalRow){
	var pageTerm = 5;
	var maxPage = Math.ceil(totalRow/pageObj.page_size);
	var startPage = Math.floor(((pageObj.page_no%pageTerm == 0) ? (pageObj.page_no-1) : pageObj.page_no)/pageTerm) * pageTerm + 1;
	var endPage = startPage + pageTerm;
	if(endPage > maxPage) endPage = maxPage + 1;
	var str = "";
	if(startPage > pageTerm){
		str += "<a onclick='pageObj.pageSearch(\"" + (startPage - 1) + "\")' class='btn_prev'>이전</a>";
	}
	for(var i = startPage; i < endPage;i++){
		if(i == pageObj.page_no){
			str += "<a class='on'>" + i + "</a>"; 
		}else{
			str += "<a onclick='pageObj.pageSearch(\"" + i + "\")'>" + i + "</a>";
		}
	}
	if(maxPage > endPage){
		str += "<a onclick='pageObj.pageSearch(\"" + (endPage) + "\")' class='btn_next'>다음</a>";
	}
	jq("#full_pop_cont .paging_lcmwc223 div").html(str);
};

pageObj.pageSearch = function(pageNo){
	pageObj.page_no = pageNo;
	pageObj.roadSearch();
};

pageObj.roadSearch = function(){
	var tmpTtmNm = jq("#full_pop_cont .road_nm").val().replace(/(\s*)/g, "");
	var params = {
			page_size	: pageObj.page_size,
			page_no		: pageObj.page_no,
			mgpo_nm		: jq("#full_pop_cont .select_lcmwc224 option:selected").html(),
			ccd_nm		: jq("#full_pop_cont .select_lcmwc225 option:selected").html(),
			road_nm		: tmpTtmNm,
			bld_pno		: jq("#full_pop_cont .bld_pno").val().trim(),
			bld_sdno	: jq("#full_pop_cont .bld_sdno").val().trim()
	};
	commPage("T", "lcmwc223", params, pageObj.resultLCMWC223);
};

pageObj.nextChk = function(){
	setTimeout(function(){
		var chk = false;
		var email = jq("#email01").val() + "@" + jq("#email02").val();
		if(email.length > 50){
			chk = true;
		}
		if(isEmail(email)){
			chk = true;
		}
		if(jq("#zip_code01").val() == ""){
			chk = true;
		}
		if(jq("#address02").val().trim() == "" && pageObj.homNaddYn == "0"){
			chk = true;
		}
		if(chk){
			jq("#nextBtn").attr("class", "btn_31");
		}else{
			jq("#nextBtn").attr("class", "btn_r31");
		}
	}, 10);
};

pageObj.iosSelect = function(flag){
	pageObj.flag = flag;
	var tmpList = pageObj.listEmail;
	if(flag == "2") tmpList = pageObj.listAdd1;
	if(flag == "3") tmpList = pageObj.listAdd2;
	if(flag == "4") tmpList = pageObj.listYear;
	if(flag == "5") tmpList = pageObj.listMonth;
	if(flag == "6") tmpList = pageObj.listDay;
	
	callNtv(null, null, "DevicePlugin", "selectbox", [tmpList, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	if(pageObj.flag == "1"){
		jq("#select_email").val(tmpCode);
		if(jq("#select_email").val() == ""){
			jq("#email02").val("").removeAttr("readonly");
		}else{
			jq("#email02").val(jq("#select_email").val()).attr("readonly", "readonly");
		}
	}else if(pageObj.flag == "2"){
		jq("#full_pop_cont .select_lcmwc224").val(tmpCode);
		jq("#full_pop_cont .select_lcmwc225").html("<option value=''>시군구명 검색</option>");
		pageObj.listAdd2 = [{CODE : "", VALUE : "시군구명 검색"}];
		jq(".iosSelect3").html("시군구명 검색");
		if(jq("#full_pop_cont .select_lcmwc224").val() != ""){
			var params = {
					mgpo_c	: jq("#full_pop_cont .select_lcmwc224").val()
			};
			commPage("T", "lcmwc225", params, pageObj.resultLCMWC225);
		}
	}else if(pageObj.flag == "3"){
		jq("#full_pop_cont .select_lcmwc225").val(tmpCode);
	}else if(pageObj.flag == "4"){
		jq("#birth_year").val(tmpCode);
		pageObj.changeBirth();
		jq(".iosSelect6").html("1");
	}else if(pageObj.flag == "5"){
		jq("#birth_month").val(tmpCode);
		pageObj.changeBirth();
		jq(".iosSelect6").html("1");
	}else{
		jq("#birth_day").val(tmpCode);
	}
	jq(".iosSelect" + pageObj.flag).html(tmpValue);
};

pageObj.changeRadio = function(vari, valu, obj){
	eval("pageObj." + vari + "='" + valu + "'");
	jq(obj).parent().find("label").removeClass("radio_on");
	jq(obj).addClass("radio_on");
};

/* JavaScript content from js/LCMW3/LCMW3120.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.pageSize = 20;
pageObj.pageNo = 1;

pageObj.pageFunction = function(obj){
	obj = eval("(" + obj + ")");
	pageObj.cdNo = obj.cdNo;
	pageObj.lotteCcoc = obj.lotteCcoc;
	var params = {
			lotte_cco_c : pageObj.lotteCcoc
	};
	// 멤버십 카드 정보 조회
	commPage("T", "lcmw3120", params, pageObj.reslutLCMW3120);
};

// 화면간 이동
pageObj.membership = function(flag){
	jq(".member_content").hide();
	jq("#membership_" + flag).show();
	jq("#membership_nav a").each(function(){
		jq(this).attr("onclick").match(flag) ? jq(this).addClass("on") : jq(this).removeClass("on");
	});
	jq("#mem_noti_list").html("");
	jq("#mem_usage_list").html("");
	maxBright(false);
	if(flag == "card"){
		maxBright(true);
	}else if(flag == "usage"){
		if(userInfo.card_m_agree=="Y"&&userInfo.ccd_mbyn=="Y"){
			pageObj.pageNo = 1;
			pageObj.LCMW3150();
		}else{
			pageObj.pageNo = 1;
			jq("#membership_" + flag).hide();
			jq("#membership_" + "membershelp").show();
			jq("#membership_nav a").each(function(){
				jq(this).attr("onclick").match('usage') ? jq(this).addClass("on") : jq(this).removeClass("on");
			});
			jq(".btn_refresh").css("display","none");
		}
		
	}else{
		pageObj.pageNo = 1;
		pageObj.LCMW3140();
	}
};

// 멤버십 카드 정보 조회 결과
pageObj.reslutLCMW3120 = function(resultData){
	// 멤버스2차개발 데이터 추가 - MB_MNDT_AG_YN, CCD_MBYN
	userInfo.card_m_agree = resultData.IS_CREDIT_CARD_M_AGREE;//멤버스 정보제공 동의
	userInfo.ccd_mbyn = resultData.IS_CREDIT_CARD_MEMBER;//신용카드 회원 여부
	pageObj.pageTitle = resultData.CCO_NM;
	setTitle();
	jq("#members_cont").html(resultData.U_GUD_CN);
	jq("#card_img").attr("src", resultData.CD_DTL_IMG_URL_NM);
	jq("#barcode_img").attr("src", barcodeImg(pageObj.cdNo));
	jq("#barcode_no").html(pageObj.cdNo);
	jq("#barcode_zoom").attr("onclick", "popBarcode('" + resultData.CCO_NM + "', '" + pageObj.cdNo + "', '" + resultData.CD_MAI_IMG_URL_NM + "')");
	maxBright(true);
	// 롯데 멤버스 포인트 조회
	pageObj.LCMW3122();
};

// 롯데 멤버스 포인트 조회
pageObj.LCMW3122 = function(){
	commPage("T", "lcmw3122", "", pageObj.resultLCMW3122);
};

// 롯데 멤버스 포인트 조회 결과
pageObj.resultLCMW3122 = function(resultData){
	// 멤버스2차개발 데이터 추가 - MB_MNDT_AG_YN, CCD_MBYN
	userInfo.card_m_agree = resultData.IS_CREDIT_CARD_M_AGREE;//멤버스 정보제공 동의
	userInfo.ccd_mbyn = resultData.IS_CREDIT_CARD_MEMBER;//신용카드 회원 여부

	if(userInfo.card_m_agree=="N"&&userInfo.ccd_mbyn=="Y"){
		jq("#able_point").html("-");
		jq("#total_point").html("-");
	}else{
		jq("#able_point").html((parseInt(resultData.ABLE_POINT, 10) + "").toCurrency());
		jq("#total_point").html((resultData.REMAIN_POINT_PLUS_MINUS == "-" ? "-" : "") + (parseInt(resultData.REMAIN_POINT, 10) + "").toCurrency());
	}
	jq("#refresh_date").html(dateComma(resultData.REFRESH_DATE) + " " + resultData.REFRESH_DATE.substr(9, 2) + ":" + resultData.REFRESH_DATE.substr(11, 2));
	
	if(userInfo.ccd_mbyn=="Y"&&userInfo.card_m_agree=="N")
		pageObj.membership('usage');
	
};

// 멤버십 공지사항 조회
pageObj.LCMW3140 = function(){
	var params = {
			page_size	: pageObj.pageSize,
			page_no 	: pageObj.pageNo,
			lotte_cco_c : pageObj.lotteCcoc
	};
	commPage("T", "lcmw3140", params, pageObj.resultLCMW3140);
};

//멤버십 공지사항 조회 결과
pageObj.resultLCMW3140 = function(resultData){
	if(resultData.NOTICE_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.NEWS});
		for(var i = 0; i < dataList.getSize(); i++){
			jq("#mem_noti_list").append(bindData(jq("#notiTmpl").val(), dataList.get(i)));
		}
		initAcc();
		// 더보기 세팅
		moreSetting(resultData.NOTICE_SIZE, pageObj.LCMW3140);
	}
};

// 멤버십 포인트 거래내역 조회
pageObj.LCMW3150 = function(){
	var params = {
			mb_cno			: userInfo.mb_cno,
			paging_r_cnt	: pageObj.pageSize,
			page_no 		: pageObj.pageNo
	};
	commPage("T", "lcmw3150", params, pageObj.resultLCMW3150);
};

pageObj.resultLCMW3150 = function(resultData){
	if(resultData.TRAN_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.TRANS});
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).TRAN_DATE = dataList.get(i).TRAN_DATE.substr(4, 2) + "." + dataList.get(i).TRAN_DATE.substr(6, 2);
			dataList.get(i).TOTAL_POINT = (parseInt(dataList.get(i).TOTAL_POINT, 10) + "").toCurrency();
			dataList.get(i).TRANS_GUBUN = dataList.get(i).TRANS_GUBUN == "사용" ? "minus" : "plus";
			dataList.get(i).MCHT_NM = dataList.get(i).MCHT_NM + (dataList.get(i).TRANS_TEXT.match("취소") ? " (취소)" : "");
			
			jq("#mem_usage_list").append(bindData(jq("#usageTmpl").val(), dataList.get(i)));
		}
		// 더보기 세팅
		var tmpSize = pageObj.pageSize * pageObj.pageNo;
		if(resultData.END_F == 2){
			tmpSize = tmpSize + 1;
		}
		moreSetting(tmpSize, pageObj.LCMW3150);
	}
};

pageObj.callPhone = function(){

	if(deviceInfo.os=="android")
		callNtv(null, null, "DevicePlugin", "callPhone", ["1588-8100", "ARS(" + " 1588-8100 " + ")로 연결합니다."]);

};

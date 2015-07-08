
/* JavaScript content from js/LCMW4/LCMW4900.js in folder common */
pageObj.pageTitle = "스마트 영수증";

pageObj.pageFunction = function(obj){
//	if(pushInfo.code != ""){	// 광고 미시청 영수증 광고시청
//		if(smart_pay.RESULT_4013.PUSH_ADB_SIZE > 0){
//			pageObj.showEvent();
//		}else{
//			pageObj.eventOffer();
//		}
//	}
	if(userInfo.sms_join == "Y"){
		pageObj.smartReceiptShow();
	}else{
		jq("#sample_receipt, #btn_ok").show();
		pageObj.eventOffer();
		pushInfo = {};
		pushInfo.code = "";
		pushInfo.param = "";

	}
	jq("#rightBtn").attr({"onclick" : "goMain()", "class" : "home"}).show();

};

pageObj.smartReceiptShow = function(){
	jq("#smart_receipt, #btn_ok").show();
	jq("#mc_nm").html(smart_pay.RESULT_4011.MC_NM);				// 가맹점 명
	jq("#mcno").html(smart_pay.RESULT_4011.MCNO);				// 가맹점 일련번호
	jq("#mc_w_tlno").html(smart_pay.RESULT_4011.MC_W_TLNO);		// 가맹점 전화
	jq("#pnadd").html(smart_pay.RESULT_4011.PNADD);				// 가맹점 주소
	jq("#aprno").html(smart_pay.RESULT_4011.APRNO);				// 승인번호
	
	// 결제 금액
	var tmpAprAm = "";
	if(smart_pay.RESULT_4011.TAPD_CDNO != "") tmpAprAm += "<em class='ico_app on' style='padding-right:20px'>앱카드</em>";	// 앱카드 결제여부
	tmpAprAm += (smart_pay.RESULT_4011.APR_CAN_YN == "Y" ? "결제취소" : (smart_pay.RESULT_4011.INT_MT == 0 ? "일시불 " : smart_pay.RESULT_4011.INT_MT + "개월 "));
	if(smart_pay.RESULT_4011.FAP_YN == "Y"){	// 해외승인 (승인번호만 보여준다)
		jq("#mcmo").hide();
		jq("#mc_w_tlno").parent().hide();
		jq("#pnadd").parent().hide();
		tmpAprAm += smart_pay.RESULT_4011.SPOT_DE_AM.toCurrency() + smart_pay.RESULT_4011.FAP_CUR_SYBL;
	}else{										// 국내승인
		tmpAprAm += smart_pay.RESULT_4011.APR_AM.toCurrency() + "원";
	}
	jq("#apr_am").html(tmpAprAm);
	
	// 결제시간
	jq("#apr_dt_ti").html(dateComma(smart_pay.RESULT_4011.APR_DT) + " " + smart_pay.RESULT_4011.APR_TI.substr(0, 2) + ":" + smart_pay.RESULT_4011.APR_TI.substr(2, 2));
	
	// 롯데포인트
	jq("#u_psb_pt").html(smart_pay.RESULT_4011.U_PSB_PT.toCurrency());		// 사용가능 포인트	
	jq("#acu_rv_pt").html(smart_pay.RESULT_4011.ACU_RV_PT.toCurrency());		// 잔여포인트
	
	if(userInfo.ccd_mbyn=="Y"&&smart_pay.RESULT_4011.MB_MNDT_AG_YN=="N"){
		jq("#mem_txt_point").show();
		jq("#u_psb_pt").html("-");		// 사용가능 포인트	
		jq("#acu_rv_pt").html("-");		// 잔여포인트
		jq("#mem_txt_point").css("border-bottom", "0px solid #e7e9eb");
	}else{
		jq("#mem_txt_point").css("border-bottom", "1px solid #e7e9eb");
	}
	
	// 혜택안내
	if(smart_pay.RESULT_4018.OFFER_APY_SIZE > 0){
		jq("#smart_benefit").show();
		var dataList = new GridControl({"row" : smart_pay.RESULT_4018.OFFER_APY_SET});
		for(var i = 0; i < dataList.getSize(); i++){
			var tmpClass1 = ""; 
			if(dataList.get(i).EVN_TC == "C"){
				tmpClass1 = "smart_benefit_cpn";
			}else if(dataList.get(i).EVN_TC == "S"){
				tmpClass1 = "smart_benefit_stp";
			}else{
				tmpClass1 = "smart_benefit_evt";
			}
			var tmpClass2 = "";
			var tmpOffer = "";
			if(dataList.get(i).FFR_TP_DC == "P"){
				tmpOffer = dataList.get(i).FFR_AM.toCurrency();
				tmpClass2 = "smart_point";
			}else if(dataList.get(i).FFR_TP_DC == "C"){
				tmpOffer = dataList.get(i).FFR_AM.toCurrency() + " 원";
			}else{
				tmpOffer = dataList.get(i).COP_CPON_PD_NM;
			}
			
			var tmpId = (dataList.get(i).EVN_TC == "S") ? dataList.get(i).EVN_ID : dataList.get(i).EVN_OJ_ID;
			var str =	"<dd class=\"both\" onclick=\"pageObj.offerDetail('" + dataList.get(i).EVN_TC + "', '" + tmpId + "')\">";
			str +=			"<span class=\"left pc02 " + tmpClass1 + "\">" + dataList.get(i).EVN_OJ_NM + "</span>";
			str +=			"<span class=\"right pc01 " + tmpClass2 + "\" style=\"padding-top:3px\">" + tmpOffer + "</span>";
			if(dataList.get(i).FFR_DSB_STC == "0"){
				str +=		"<div style=\"float: right;\">지급예정일 : " + dateComma(dataList.get(i).FFR_DSB_DTTI) + "</div>";
			}
			str +=		"</dd>";
			jq("#smart_benefit dl").append(str);
			if(jq("#smart_benefit dl dd:last").find("span").eq(0).width() + jq("#smart_benefit dl dd:last").find("span").eq(1).width() < jq("#smart_benefit dl:last").width() -50 )
			jq("#smart_benefit dl dd:last").find("span").eq(0).width(jq("#smart_benefit dl:last").width() - (jq("#smart_benefit dl dd:last").find("span").eq(1).width() + 50));
		}

	}
	
	// 스탬프 지급안내
	if(smart_pay.RESULT_4018.STMP_RV_SIZE > 0){
		jq("#smart_stamp").show();
		var dataList = new GridControl({"row" : smart_pay.RESULT_4018.STMP_RV_SET});

		for(var i = 0; i < dataList.getSize(); i++){
			var str =	"<div style=\"width:100%;margin:5px 0\" onclick=\"pageObj.offerDetail('E', '" + dataList.get(i).EVN_ID + "')\">";
			str +=			"[" + dataList.get(i).EVN_NM + "]가 적립되었습니다.";
			str +=		"</div>";
			jq("#smart_stamp").append(str);
		}
		if(smart_pay.RESULT_4018.OFFER_APY_SIZE > 0)
			jq("#smart_stamp").css("border-top-width", "0px");

	}

	// 결제 수단
	if(smart_pay.RESULT_4011.UNIT_CD_NM == "") smart_pay.RESULT_4011.UNIT_CD_NM = "롯데카드";
	jq("#cd_pd_knd_nm").html(smart_pay.RESULT_4011.CD_PD_KND_NM);			// 결제수단
	if(smart_pay.RESULT_4011.UNIT_CD_C != ""){
		jq("#smart_card_info").show();
		jq("#cd_epl_smr_cn").html(smart_pay.RESULT_4011.CD_EPL_SMR_CN);
	}
	if(userInfo.ccd_mbyn=="Y"&&userInfo.card_m_agree=="Y"){
		jq("#cm_type").css("border-top-width", "1px");
		if(smart_pay.RESULT_4018.STMP_RV_SIZE > 0)
			jq("#cm_type").css("border-top-width", "0px");
	}else{
		jq("#cm_type").css("border-top-width", "0px");
		if(smart_pay.RESULT_4018.STMP_RV_SIZE == 0)
			jq("#cm_type").css("border-top-width", "1px");
	}

	pageObj.eventOffer();
	pushInfo = {};
};

// 광고시청
pageObj.showEvent = function(){
	jq("#leftBtn, #rightBtn").hide();
	var dataList = new GridControl({"row" : smart_pay.RESULT_4013.PUSH_ADB_SET});
	pageObj.evn_exps_hr = 1;
	pageObj.pop_img_ph_nm = [];
	for(var i = 0; i < dataList.getSize(); i++){
		pageObj.pop_img_ph_nm[i] = dataList.get(i).POP_IMG_PH_NM;
		jq("#smart_event").attr("src", dataList.get(i).POP_IMG_PH_NM).attr("onclick", "pageObj.cfEvtDeatil('" + dataList.get(i).EVN_ID + "')");
		
		if(dataList.get(i).EVN_EXPS_HR > pageObj.evn_exps_hr){
			pageObj.evn_exps_hr = dataList.get(i).EVN_EXPS_HR;  
		}
		
		if(smart_pay.RESULT_4013.IS_OFFER_YN == "Y"){
			pageObj.ffr_id_s = "";
			pageObj.evn_id_s = "";
			pageObj.isu_cpon_ct_s = "";
			pageObj.progress_event_array = [];
			
			if(pageObj.ffr_id_s != "") pageObj.ffr_id_s += "|";
			pageObj.ffr_id_s += dataList.get(i).FFR_ID;
			if(pageObj.evn_id_s != "") pageObj.evn_id_s += "|";
			pageObj.evn_id_s += dataList.get(i).EVN_ID;
			if(pageObj.isu_cpon_ct_s != "") pageObj.isu_cpon_ct_s += "|";
			pageObj.isu_cpon_ct_s += dataList.get(i).ISU_CPON_CT;
			
			var tmp_event_array = {
					evn_id					: dataList.get(i).EVN_ID,
					progress_event_detail	: "[" + dataList.get(i).EVN_NM + "] " + dataList.get(i).MC_RELCO_NM
			};
			pageObj.progress_event_array.push(tmp_event_array);
		}
	}
	if(deviceInfo.winHeight < 500){
		jq(".ico_gift").css({"position" : "absolute", "bottom" : "15%", "width" : "100%", "z-index" : "1"});
		jq("#smart_cf .m02").css({"padding-top" : "60px", "z-index" : "2", "position" : "relative"});
	}
	jq("#smart_cf").show();
	jq("#smart_label").css({"left" : jq("#smart_cf").width() + "px", "display" : "block"});
	jq(window).bind("touchmove", function(){return false;});
	pushInfo.code = "";
	pushInfo.param = "";
	
	pageObj.showProgress();
	if(smart_pay.RESULT_4013.PUSH_ADB_SIZE > 1) pageObj.rollEvent();
};

// 광고시청 프로그래스바
pageObj.rate = 0;
pageObj.gift = 1;
pageObj.deg = 0;
pageObj.showProgress = function(){
	pageObj.rate += 1/pageObj.evn_exps_hr;
	pageObj.deg += 5;
	jq(".loading").css("-webkit-transform", " rotate(" + pageObj.deg + "deg)");
	
	if(pageObj.rate < 100){
		pageObj.progress = setTimeout("pageObj.showProgress()", 10);
	}else{
		pageObj.eventOffer();
	}
};

// 광고시청 이벤트 롤링
pageObj.eventCnt = "0";
pageObj.rollEvent = function(){
	pageObj.eventCnt = pageObj.eventCnt == "0" ? "1" : "0"; 
	jq("#smart_event").attr("src", pageObj.pop_img_ph_nm[pageObj.eventCnt]).attr("onclick", "pageObj.cfEvtDeatil('" + pageObj.progress_event_array[pageObj.eventCnt].evn_id + "')");
	pageObj.smartEvent = setTimeout("pageObj.rollEvent()", smart_pay.RESULT_4013.PUSH_ROLL_TIME * 1000);
};
 
// 광고시청 완료
pageObj.eventOffer = function(){
//	if(smart_pay.RESULT_4013.IS_OFFER_YN == "Y"){
//		var params = {
//				offer_cnt		: smart_pay.RESULT_4013.PUSH_ADB_SIZE,
//				ffr_id_s		: pageObj.ffr_id_s,
//				evn_id_s 		: pageObj.evn_id_s,
//				isu_cpon_ct_s	: pageObj.isu_cpon_ct_s,
//				cd_apr_seq		: smart_pay.RESULT_4011.CD_APR_SEQ,
//				apr_can_yn		: smart_pay.RESULT_4011.APR_CAN_YN
//		};
//		commPage("T", "lcmw4015", params, pageObj.resultLCMW4015);
//	}else{
		var params = {
				cd_apr_seq		: smart_pay.RESULT_4011.CD_APR_SEQ,
				apr_can_yn		: smart_pay.RESULT_4011.APR_CAN_YN
		};
		commPage("T", "lcmw4016", params, pageObj.resultLCMW4016);
//	}
};

// 광고시청 완료 결과
pageObj.resultLCMW4015 = function(resultData){
	if(resultData.EVNOFF_SET_SIZE > 0){
		var dataList1 = new GridControl({"row" : resultData.EVNOFF_SET});
		var dataList2 = new GridControl({"row" : smart_pay.RESULT_4013.PUSH_ADB_SET}); 
		for(var i = 0; i < dataList1.getSize(); i++){
			for(var j = 0; j < dataList2.getSize(); j++){
				if(dataList1.get(i).EVN_ID == dataList2.get(j).EVN_ID){
					jq("#smart_cf .m02").find("P").eq(j).html("[" + dataList2.get(j).EVN_NM + "] " + dataList2.get(j).MC_RELCO_NM);
				}
			}
		}
		jq(".ico_gift").addClass("win");
	}
	pageObj.resultLCMW4016();
};

pageObj.resultLCMW4016 = function(resultData){
	jq(".progress").remove();
	jq("#smart_cf .m02").show();
};

pageObj.showSmartReceipt = function(flag){
	if(flag){
		jq("#smart_cf").animate({left: "-" + jq("#smart_cf").width() + "px"}, {duration : 800});
		jq("#smart_label").animate({left: "0px"}, {duration : 800});
		jq(window).unbind("touchmove");
		jq("#leftBtn, #rightBtn").show();
	}else{
		jq("#leftBtn, #rightBtn").hide();
		jq(window).bind("touchmove", function(){return false;});
		jq("#smart_cf").animate({left: "0px"}, {duration : 800});
		jq("#smart_label").animate({left: jq("#smart_cf").width() + "px"}, {duration : 800});
	}
};

//카드 상세
pageObj.cardDetail = function(){
	LCMW7100(smart_pay.RESULT_4011.UNIT_CD_C);
};

//// 이벤트 상세
//pageObj.eventDetail = function(){
//	commEvnDetail(smart_pay.RESULT_4014.EVN_ID);
//};

//혜택 안내, 스탬프 상세
pageObj.offerDetail = function(evnTc, tmpId){
	if(evnTc == "C"){	// 쿠폰 상세
		commCpnDetail(tmpId);
	}else{
		commEvnDetail(tmpId);
	}
};

// 광고 시청 화면에서 이벤트 상세보기 ()
pageObj.cfEvtDeatil = function(tmpId){
	if(jq("#smart_cf .m02").css("display") != "none"){		// 광고 시청 후에 상세보기 가능	
		pageObj.evnId = tmpId;
		var params = {
				evn_id	: tmpId
		};
		commPage("T", "lcmw3320", params, pageObj.resultLCMW3320);
	}
};

// 광고 시청 화면에서 이벤트 상세보기 조회 결과
pageObj.resultLCMW3320 = function(resultData){
	consoleLog("D", "pageObj.resultLCMW3320 : " + resultData.EVN_ID);
	resultData.EVN_ID = pageObj.evnId;
	resultData.EVN_SDT = dateComma(resultData.EVN_SDT); 
	resultData.EVN_EDT = dateComma(resultData.EVN_EDT); 
	resultData.TMP_EVN_NM = resultData.EVN_NM.replace(/'/g, "\\'");
	resultData.OPEN_EVENT = "";
	if(resultDataEVN_URL != ""){
		resultData.OPEN_EVENT = "<div class=\"tc mt20\"><a onclick=\"webPage('" + resultData.EVN_URL + "');\" class=\"btn_31\">이벤트 바로가기</a></div>";
	}
	jq("#eventDetailPop").html(bindData(jq("#eventDetailTmpl").val(), resultData));
	initFullPop("evnBtnPop", {
		leftBtn		: true
	});
	jq(".evnBtnPop").click();
	jq(window).unbind("touchmove");
	jq("#full_pop_left_btn").removeClass("f_pop_close").attr("onclick", "pageObj.cfEvtDetailBack()");
};

// 광고시청 화면에서 스크롤을 잡았다 이벤트 상세에서 풀어줘야 하기 때문에 이벤트 상세 페이지를 따로 만듦
pageObj.cfEvtDetailBack = function(){
	jq(window).bind("touchmove", function(){return false;});
	jq("#full_pop_left_btn").addClass("f_pop_close").attr("onclick", "");
	jq(".f_pop_close").click();
};

pageObj.cancel = function(){
//    if(jq("#smart_cf .m02").css("display") != "none"){
//	pageObj.showSmartReceipt(true);
//    }else{
        jq("#leftBtn").click();                                                      
//    }
};

pageObj.callPhone = function(){

	if(deviceInfo.os=="android")
		callNtv(null, null, "DevicePlugin", "callPhone", ["1588-8100", "ARS(" + " 1588-8100 " + ")로 연결합니다."]);

};

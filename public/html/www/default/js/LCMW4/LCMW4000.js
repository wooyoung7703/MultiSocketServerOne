
/* JavaScript content from js/LCMW4/LCMW4000.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.approvalData = {};
pageObj.listCard = [];
pageObj.mobileBillList = null;
pageObj.mobileBill = {};

pageObj.pageFunction = function(obj){

	pageObj.newDate = yyyymm(new Date());
	pageObj.year = pageObj.newDate.substr(0,4);
	pageObj.month = parseInt(pageObj.newDate.substr(4), 10);
	pageObj.newYm = (pageObj.year * 12) + pageObj.month;
	if(smartReceiptBackData.state){		// 스마트 영수증 상세에서 돌아왔을경우 페이지를 유지
		pageObj.newDate = smartReceiptBackData.year + smartReceiptBackData.month;
		pageObj.year = pageObj.newDate.substr(0,4);
		pageObj.month = parseInt(pageObj.newDate.substr(4), 10);
	}

//	pageObj.newYm = (pageObj.year * 12) + pageObj.month;
	if(loginInfo.logined == "Y" && userInfo.ccd_mbyn == "Y"){
		jq(".payment").show();
//		pageObj.LCMW4000(pageObj.newDate);
		
		pageObj.LCMW4090(pageObj.newDate);
	}else{	// 비회원(비로그인)인 경우 달력만 조회
		pageObj.initCalendar(pageObj.year, pageObj.month);
		remocon(true);
	}
};

//결제 예정 금액 조회
pageObj.LCMW4030 = function(){
	commPage("T", "lcmw4030", "", pageObj.resultLCMW4030);
};
//결제 예정금액, 스마트 영수증 캘린더 통합조회 결과
pageObj.resultLCMW4090 = function(resultData){
	if(resultData.MOBILE_BILL_ROOT.MOBILE_BILL_SIZE > 0){
		pageObj.mobileBillList = new GridControl({"row" : resultData.MOBILE_BILL_ROOT.MOBILE_BILL_SET});
	}
	pageObj.resultLCMW4000(resultData.SMART_CALENDAR_ROOT);
};

// 결제 예정 금액 조회 결과
pageObj.resultLCMW4030 = function(resultData){
	jq(window).scrollTop(0);
	if(resultData.PAYMENT_CNT > 0){
		var dataList = new GridControl({"row" : resultData.PAYMENT_INFO});
		for(var i = 0; i < dataList.getSize(); i++){
			
			dataList.get(i).TOD_BIL_AM = dataList.get(i).TOD_BIL_AM.toCurrency();
			
			if(dataList.get(i).ACCOUNT_DC == "01"){
				if(!jq("#result_payment").html().match("신용")){
					dataList.get(i).ACCOUNT = "신용";
					jq("#result_payment").prepend(bindData(jq("#paymentDtTmpl").val(), dataList.get(i)));
				}
				dataList.get(i).TMP_BNK_NM = dataList.get(i).BNK_NM + "&nbsp;&nbsp;&nbsp;" + dataList.get(i).ACNO;
				jq("#card_01").append(bindData(jq("#paymentDdTmpl").val(), dataList.get(i)));
			}else{
				if(!jq("#result_payment").html().match("체크")){
					dataList.get(i).ACCOUNT = "체크";
					jq("#result_payment").append(bindData(jq("#paymentDtTmpl").val(), dataList.get(i)));
				}
				dataList.get(i).TMP_BNK_NM = dataList.get(i).BNK_NM + "&nbsp;&nbsp;&nbsp;" + dataList.get(i).ACNO;
				jq("#card_03").append(bindData(jq("#paymentDdTmpl").val(), dataList.get(i)));
			}
		}
		var nx_stt_dt = dataList.get(0).NX_STT_DT.substr(0, 4) + "년 " + (parseInt(dataList.get(0).NX_STT_DT.substr(4, 2), 10)) + "월 " + (parseInt(dataList.get(0).NX_STT_DT.substr(6, 2), 10)) + "일";
		jq("#result_payment").prepend("<li><dl><dt>결제예정일</dt><dd class='tr'>" + nx_stt_dt + "</dd></dl></li>");
		jq("#result_payment_div").show();
		jq("#pay_info a").attr("onclick", "pageObj.showPayment('result_payment_div')");
		jq("#pay_info a").eq(1).css({"background-color" : "#ff555a", "background-position" : "left"});
	}else{
		jq("#no_result").show();
		jq("#pay_info a").attr("onclick", "pageObj.showPayment('no_result')");
		jq("#pay_info a").eq(1).css({"background-color" : "#ff555a", "background-position" : "left"});
	}
};

pageObj.showPayment = function(tmpId){
	if(jq("#" + tmpId).css("display") == "none"){
		jq(window).scrollTop(0);
		jq("#" + tmpId).show();
		jq("#pay_info a").eq(1).css({"background-color" : "#ff555a", "background-position" : "left"});
	}else{
		jq("#pay_info a").eq(1).css({"background-color" : "#adadad", "background-position" : "right"});
		jq("#" + tmpId).hide();
	}
};

// 결제 예정금액 계좌 변경
pageObj.changeSelect = function(){
	jq("#iosSelect").html(pageObj.listCard[0].VALUE);
	jq("#tod_bil_am").html(jq("#select_payment").val().split("|")[0].toCurrency() + "원");
	pageObj.nxSttDt = jq("#select_payment").val().split("|")[1];
	jq("#select_payment").blur();
//	payDate();
	refreshPage();
};

// 캘린더 목록, 모바일 명세서 통합 조회
pageObj.LCMW4090 = function(slt_date){
	var params = {
			slt_date 	: slt_date,					// 조회 년월 ex : 201403
			cd_cno		: mobileBillData.cd_cno
	};
	commPage("T", "lcmw4090", params, pageObj.resultLCMW4090);
};

pageObj.resultLCMW = function(resultData){
	pageObj.resultLCMW4000(resultData);
};

// 캘린더 목록 조회
pageObj.LCMW4000 = function(slt_date){
	var params = {
			slt_date : slt_date		// 조회 년월 ex : 201403 
	};
	commPage("T", "lcmw4000", params, pageObj.resultLCMW4000);
};

// 캘린더 목록 조회 결과
pageObj.resultLCMW4000 = function(resultData){
	pageObj.approvalData = {};
	if(resultData.SMART_CALENDAR_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.SMART_CALENDAR_SET});
		
		for(var i = 0; i < dataList.getSize(); i++){
			var data = [
			            	dataList.get(i).APR_CNT, 																// 승인건수
			            	dataList.get(i).CAN_CNT, 																// 취소건수
			            	dataList.get(i).RCT_CHK_YN == "Y" ? true : false, 										// 영수증 확인
			            	dataList.get(i).STMP_RV_YN == "Y" ? true : false, 										// 스탬프 발생
			            	dataList.get(i).OFFER_YN == "Y" || dataList.get(i).STAMP_YN == "Y" ? true : false		// 오퍼 발생
			            ];
			
			var tmpDate = parseInt(dataList.get(i).SLT_DT_VARCHAR.substr(6), 10);
			eval("pageObj.approvalData.data" + tmpDate + "=" + "[" +  data + "]");
		}
	}
	pageObj.initCalendar(pageObj.year, pageObj.month);
};

// 달력 초기화
pageObj.initCalendar = function(r_year, r_month){
	reciept_calendar.init(r_year, r_month);
	pageObj.setMobileBill();
	remocon(true);
	// 날짜 클릭시
	jq(".calendar td").unbind("click");
	jq(".calendar td").bind("click", function() {
		
		var smartYear = reciept_calendar.year;		// 년
		var smartMonth = zero(reciept_calendar.month, 2);	// 월
		var smartDate = jq(this).data("date");		// 일
		if(smartDate){
			pageObj.smartDate = smartDate;
			smartDate = zero(smartDate, 2);
			jq("#detailDate").html(smartYear + ". " + reciept_calendar.month + ". " + jq(this).data("date") + ". " + jq("#calendar_week th:eq(" + jq(this).index() + ")").html()).show();
			jq("#detailData, #detailNoData").hide();
			jq("#receipt_detail").html("");
			
			if(jq(this).html().match("<span")){	// 상세보기 내용이 있을 경우
				smartReceiptBackData.year = smartYear;
				smartReceiptBackData.month = smartMonth;
				smartReceiptBackData.day = smartDate;
				if(jq(this).html().match("결제일")){
					var str =	"<li class='noneli mobile_bill'>" +
									"<a onclick='pageObj.detailMobileBill();'>" +
										"<strong class='tit' style='color:#333'>" + parseInt(pageObj.mobileBill.STT_DT.substr(4, 2), 10) + "월 모바일 명세서</strong>" +
										"<div class='both'>" +
											"<strong class='price left' style='color:#333'>" + pageObj.mobileBill.TOT_BIL_AM.toCurrency() + "원</strong>" +
										"</div>" +
									"</a>" +
								"</li>";
					jq("#receipt_detail").html(str);
					jq("#detailData").show();
				}
				if(jq(this).html().match("취소") || jq(this).html().match("승인")){
					// 스마트 영수증 일일 상세
					pageObj.LCMW4020(smartYear + smartMonth + smartDate);
				}else{
					jq("body").animate({scrollTop: jq("#detailDate").offset().top - 180}, 500);
					smartReceiptBackData.state = false;
				}
			}else{								// 상세보기 내용이 없을 경우
				jq("#detailNoData").show();
				jq("body").animate({scrollTop: jq("#detailDate").offset().top - 140}, 500);
			}
		}
	});
	if(smartReceiptBackData.state){		// 스마트 영수증 상세에서 돌아왔을경우 페이지를 유지
		jq("#calendarBody td").each(function(){
			if(zero(jq(this).data("date"), 2) == smartReceiptBackData.day){
				jq(this).click();
				return false;
			};
		});
	}

};

// 스마트 영수증 일일 상세
pageObj.LCMW4020 = function(slt_date){
	var params = {
			slt_date : slt_date
	};
	commPage("T", "lcmw4020", params, pageObj.resultLCMW4020);
};

// 스마트 영수증 일일 상세 결과
pageObj.resultLCMW4020 = function(resultData){
	// 멤버스2차개발 데이터 추가 - MB_MNDT_AG_YN, CCD_MBYN
	var membersData = resultData.SMART_USER_INFO;
	userInfo.card_m_agree = membersData.IS_CREDIT_CARD_M_AGREE;//멤버스 정보제공 동의
	userInfo.ccd_mbyn = membersData.IS_CREDIT_CARD_MEMBER;//신용카드 회원 여부
	
	var dataList = new GridControl({"row" : resultData.SMART_DAILY_SET});
	for(var i = 0; i < dataList.getSize(); i++){
		
		if(dataList.get(i).APR_CAN_YN == "Y"){
			dataList.get(i).INT_MT = "결제취소";
		}else{
			dataList.get(i).INT_MT = dataList.get(i).INT_MT == 0 ? "일시불" : dataList.get(i).INT_MT + "개월"; 
		}
		if(dataList.get(i).FAP_YN == "Y"){
			dataList.get(i).TMP_PRICE = dataList.get(i).SPOT_DE_AM.toCurrency() + dataList.get(i).FAP_CUR_SYBL;
		}else{
			dataList.get(i).TMP_PRICE = dataList.get(i).APR_AM.toCurrency() + "원";
		}
		dataList.get(i).APR_AM = dataList.get(i).APR_AM.toCurrency();
		jq("#receipt_detail").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		if(dataList.get(i).TAPD_CDNO_YN == "Y" && dataList.get(i).APR_CAN_YN == "N" && dataList.get(i).ORI_CAN_YN == "N"){
			jq("#receipt_detail li:last").find("a").eq(1).show();
			jq("#receipt_detail li:last").find("a").eq(0).attr("onclick", jq("#li_" + dataList.get(i).CD_APR_SEQ).attr("onclick"));
			jq("#receipt_detail li:last").attr("onclick", "");
		}
		if(dataList.get(i).TAPD_CDNO_YN == "Y") jq("#receipt_detail span:last").prepend("<em class='ico_app'>앱카드</em> ");
		if(dataList.get(i).STMP_YN == "Y" && dataList.get(i).APR_CAN_YN == "N") jq("#receipt_detail span:last").append("<em class='stamp'>stamp</em> ");
		if(dataList.get(i).OFF_YN == "Y" && dataList.get(i).APR_CAN_YN == "N") jq("#receipt_detail span:last").append("<em class='offer'>offer</em> ");
		if(dataList.get(i).RCT_VD_YN != "Y") jq("#receipt_detail li:last").addClass("unconfirm");
	}
	jq("#detailData").show();

	if(smartReceiptBackData.state){
		jq("body").scrollTop(smartReceiptBackData.scrollTop);
		smartReceiptBackData.state = false;
	}else{
		jq("body").animate({scrollTop: jq("#detailDate").offset().top - 180}, 500);
	}
};

// 이전, 다음 달 출력
pageObj.pnMonth = function(flag){
	pageObj.mobileBill = null;
	jq("#detailDate, #detailData, #detailNoData").hide();
	jq("#receipt_detail").html("");
	var tmpYear = reciept_calendar.year;
	var tmpMonth = (flag == "P") ? reciept_calendar.month - 1 : reciept_calendar.month + 1;
	var tmpPnDate = yyyymm(new Date(tmpYear , tmpMonth - 1));
	
	pageObj.year = tmpPnDate.substr(0,4);
	pageObj.month = parseInt(tmpPnDate.substr(4), 10);
	var tmpPnYm = (pageObj.year * 12) + pageObj.month;
	if(tmpPnYm <= pageObj.newYm && tmpPnYm > (pageObj.newYm - 3) && loginInfo.logined == "Y" && userInfo.ccd_mbyn == "Y"){
		pageObj.LCMW4000(tmpPnDate);
//		pageObj.LCMW4090(tmpPnDate);
	}else{
		pageObj.approvalData = {};
		pageObj.initCalendar(pageObj.year, pageObj.month);
	}
};

// 스마트 영수증 상세 보기
pageObj.chksmartReceipt = function(cdAprSeq, aprCanYn, obj){
	if(jq(obj).attr("class")){
		if(jq(obj).attr("class").match("unconfirm")){
			pushInfo.code = "04";
			pushInfo.param = cdAprSeq;
			pushInfo.aprYn = aprCanYn;
			pushInfo.realPush = "N";
		}
	}else{
		if(jq(obj).parent().attr("class").match("unconfirm")){
			pushInfo.code = "04";
			pushInfo.param = cdAprSeq;
			pushInfo.aprYn = aprCanYn;
			pushInfo.realPush = "N";
		}
	}
	smartReceiptBackData.state = true;
	smartReceiptBackData.scrollTop = jq(window).scrollTop();
	smartReceipt(cdAprSeq, aprCanYn, "LCMW4000");
};

pageObj.setMobileBill = function(){
	pageObj.mobileBill = {};
	var tmpPnYm = (pageObj.year * 12) + pageObj.month;
	if(tmpPnYm > (pageObj.newYm - 3)){
		if(pageObj.mobileBillList){
			for(var i = 0; i < pageObj.mobileBillList.getSize(); i++){
				if(pageObj.year ==  pageObj.mobileBillList.get(i).STT_DT.substr(0, 4) && zero(pageObj.month, 2) == pageObj.mobileBillList.get(i).STT_DT.substr(4, 2)){
					pageObj.mobileBill.MBRNO = pageObj.mobileBillList.get(i).MBRNO;
					pageObj.mobileBill.STT_DT = pageObj.mobileBillList.get(i).STT_DT;
					pageObj.mobileBill.LOTTE_AMEX_DC = pageObj.mobileBillList.get(i).LOTTE_AMEX_DC;
					pageObj.mobileBill.TOT_BIL_AM = pageObj.mobileBillList.get(i).TOT_BIL_AM;
				}
			}
			if(pageObj.mobileBill.STT_DT){
				jq("#calendarBody td").each(function(){
					if(zero(jq(this).data("date"), 2) == pageObj.mobileBill.STT_DT.substr(6, 2)){
						if(jq(this).html().match("<span")){
							jq(this).find(".appr").prepend("<span style='background-color:#5594ce'>결제일</span>");
						}else{
							jq(this).find("div").append("<span class='appr'><span style='background-color:#5594ce'>결제일</span></span>");
						}
					}
				});
			}
		}
	}
};

// 모바일 명세서 상세보기
pageObj.detailMobileBill = function(){
	smartReceiptBackData.state = true;
	smartReceiptBackData.scrollTop = jq(window).scrollTop();
	mobileBillData.mbrno			= pageObj.mobileBill.MBRNO;
	mobileBillData.stt_dt			= pageObj.mobileBill.STT_DT;
	mobileBillData.lotte_amex_dc	= pageObj.mobileBill.LOTTE_AMEX_DC;
	mobileBillData.bll_unit_no		= "";
	mobileBill(true);
};

//아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(){
	callNtv(null, null, "DevicePlugin", "selectbox", [pageObj.listCard, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	jq("#select_payment").val(tmpCode);
	jq("#tod_bil_am").html(jq("#select_payment").val().split("|")[0].toCurrency() + "원");
	pageObj.nxSttDt = jq("#select_payment").val().split("|")[1];
	jq("#iosSelect").html(tmpValue);
//	payDate();
};
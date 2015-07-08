
/* JavaScript content from js/LCMW4/LCMW4200.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.edit = false;
pageObj.pageSize = 1;
pageObj.pageNo = 1;

pageObj.pageFunction = function(obj){
	if(smartReceiptBackData.state){
		jq("#receipt_wrap").html(smartReceiptBackData.receipt_wrap);
		jq("body").scrollTop(smartReceiptBackData.scrollTop);
		smartReceiptBackData.state = false;
		pageObj.pageNo = smartReceiptBackData.pageNo - 1;
		jq("#" + smartReceiptBackData.tmpId).attr("onclick", "pageObj.offerDetail('" + smart_pay.RESULT_4011.CD_APR_SEQ + "', 'Y', '', '', this)");
		moreSetting(14, pageObj.LCMW4140);
	}else{
		// 오퍼지급 리스트 조회
		pageObj.LCMW4140();
	}
};

//스마트 영수증 오퍼 지급 목록 조회
pageObj.LCMW4140 = function(){
	var params = {
			page_no : pageObj.pageNo
	};
	commPage("T", "lcmw4140", params, pageObj.resultLCMW4140);
};
//스마트 영수증 오퍼 지급 목록 조회 결과
pageObj.resultLCMW4140 = function(resultData){
	if(resultData.OFFER_INFO_SIZE > 0){
		pageObj.pageNo = resultData.OFFER_INFO_PAGE_NO;
		var dataList = new GridControl({"row" : resultData.OFFER_INFO_SET});
		var tmpSMARTDATE = "";
//		var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		var week = ["일", "월", "화", "수", "목", "금", "토"];
		for(var i = 0; i < dataList.getSize(); i++){
			if(tmpSMARTDATE != dataList.get(i).OC_DT){
				tmpSMARTDATE = dataList.get(i).OC_DT;
				jq("#receipt_wrap").append("<h2 class='tit03'>" + dateComma(tmpSMARTDATE) + " " + week[(new Date(tmpSMARTDATE.substr(0, 4), parseInt(tmpSMARTDATE.substr(4, 2), 10) - 1, tmpSMARTDATE.substr(6))).getDay()] + "</h2><ul class='list01 list01_p10 news_list'></ul>");
			}
			dataList.get(i).TMP_OFFER = "";
			if(dataList.get(i).FFR_TP_DC == "P" || dataList.get(i).FFR_TP_DC == "C"){
				dataList.get(i).TMP_OFFER = dataList.get(i).FFR_AM.toCurrency() + (dataList.get(i).FFR_TP_DC == "P" ? "POINT" : "CASHBACK");
			}else{
				dataList.get(i).TMP_OFFER = dataList.get(i).COP_CPON_PD_NM;
			}
			dataList.get(i).TMP_LEFT_IMG = "images/img/event.png";
			if(dataList.get(i).EVN_TC == "S"){
				dataList.get(i).TMP_LEFT_IMG = "images/img/stamp.png";
			}else if(dataList.get(i).EVN_TC == "C"){
				dataList.get(i).TMP_LEFT_IMG = "images/img/coupon.png";
			}
			if(dataList.get(i).FFR_DSB_STC == "1"){
				dataList.get(i).OFFER_CLASS = "offer_font_g"; 
				dataList.get(i).OFFER_TEXT = "지급완료";
				dataList.get(i).OFFER_TEXT_DAY = "지급일시";
			}else{
				dataList.get(i).OFFER_CLASS = "offer_font_b";
				dataList.get(i).OFFER_TEXT = "지급예정";
				dataList.get(i).OFFER_TEXT_DAY = "지급예정일";
			}
			
			dataList.get(i).TMP_FFR_DSB_DTTI = dateComma(dataList.get(i).FFR_DSB_DTTI);
			 
			if(dataList.get(i).EVN_TC == "C"){
				dataList.get(i).TMP_ID = dataList.get(i).CPON_ID;
			}else if(dataList.get(i).EVN_TC == "S"){
				dataList.get(i).TMP_ID = dataList.get(i).EVN_ID_STMP;
			}else if(dataList.get(i).EVN_TC == "E"){
				dataList.get(i).TMP_ID = dataList.get(i).EVN_ID_EVN;
			}
			dataList.get(i).IDX = dataList.get(i).OC_DT + "" + i;
			jq("#receipt_wrap ul:last").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		}
	}else{
		pageObj.pageNo = 14;
	}
	// 더보기 세팅
	setTimeout(function(){
		moreSetting(14, pageObj.LCMW4140);
	}, 100);
	remocon(true);

	if(jq("#receipt_wrap").html() == "") jq("#receipt_wrap").html('<div style="text-align: center;padding: 20px;background: #ededed;">조회결과가 없습니다.</div>');
};

pageObj.offerDetail = function(caAprSeq, rctVdYn, tmpId, evnTc, obj){
	if(caAprSeq == ""){
		if(evnTc == "C"){
			commCpnDetail(tmpId);
		}else{
			commEvnDetail(tmpId);
		}
	}else{
		if(rctVdYn == "N"){
			pushInfo.code = "04";
			pushInfo.param = caAprSeq;
			pushInfo.aprYn = "N";
			pushInfo.realPush = "N";
		}
		smartReceiptBackData.state = true;
		smartReceiptBackData.pageNo = pageObj.pageNo;
		smartReceiptBackData.scrollTop = jq(window).scrollTop();
		smartReceiptBackData.receipt_wrap = jq("#receipt_wrap").html();
		smartReceiptBackData.tmpId = obj.id;
		smartReceipt(caAprSeq, "N", "LCMW4200");
	}
};
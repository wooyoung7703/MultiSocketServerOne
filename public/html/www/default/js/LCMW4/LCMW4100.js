
/* JavaScript content from js/LCMW4/LCMW4100.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.edit = false;
pageObj.pageSize = 1;
pageObj.pageNo = 1;

pageObj.pageFunction = function(obj){
	jq("#explain").width(deviceInfo.winWidth - 190);
	if(smartReceiptBackData.state){
		jq("#receipt_wrap").html(smartReceiptBackData.receipt_wrap);
		jq("body").scrollTop(smartReceiptBackData.scrollTop);
		smartReceiptBackData.state = false;
		pageObj.pageNo = smartReceiptBackData.pageNo - 1;
		jq("#li_" + smart_pay.RESULT_4011.CD_APR_SEQ + smart_pay.RESULT_4011.APR_CAN_YN).removeClass("unconfirm");
		moreSetting(14, pageObj.LCMW4100);
	}else{
		// 스마트 영수증 목록 조회
		pageObj.LCMW4100();
	}
};

//스마트 영수증 목록 조회
pageObj.LCMW4100 = function(){
	var params = {
			page_no : pageObj.pageNo
	};
	commPage("T", "lcmw4100", params, pageObj.resultLCMW4100);
};

//스마트 영수증 목록 조회 결과
pageObj.resultLCMW4100 = function(resultData){
	if(resultData.SMART_WEEKLY_SIZE > 0){
		pageObj.pageNo = resultData.SMART_LIST_PAGE_NO;
		var dataList = new GridControl({"row" : resultData.SMART_WEEKLY_SET});
		var tmpSMARTDATE = "";
		var week = ["일", "월", "화", "수", "목", "금", "토"];
		for(var i = 0; i < dataList.getSize(); i++){
			if(tmpSMARTDATE != dataList.get(i).APR_DT){
				tmpSMARTDATE = dataList.get(i).APR_DT;
				jq("#receipt_wrap").append("<h2 class='tit03'>" + dateComma(tmpSMARTDATE, true) + ". " + week[(new Date(tmpSMARTDATE.substr(0, 4), parseInt(tmpSMARTDATE.substr(4, 2), 10) - 1, tmpSMARTDATE.substr(6))).getDay()] + "</h2><ul class='receipt_detail'></ul>");
			}
			tmpCdAprSeq = dataList.get(i).CD_APR_SEQ;
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
			jq("#receipt_wrap ul:last-child").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
			if(dataList.get(i).TAPD_CDNO_YN == "Y" && dataList.get(i).APR_CAN_YN == "N" && dataList.get(i).ORI_CAN_YN == "N"){
				jq("#receipt_wrap li:last").append("<a onclick=\"payCancel('" + dataList.get(i).CD_APR_SEQ + "', '" + dataList.get(i).MC_NM + "', '" + dataList.get(i).APR_AM + "', 'LCMW4100');\" class=\"btn_d28 btn_small btn_cancel receipt_cancel\">승인취소</a>");
				jq("#receipt_wrap li:last").find("a").eq(0).attr("onclick", jq("#li_" + dataList.get(i).CD_APR_SEQ + dataList.get(i).APR_CAN_YN).attr("onclick"));
				jq("#receipt_wrap li:last").attr("onclick", "");
			}
			
			if(dataList.get(i).TAPD_CDNO_YN == "Y") jq("#receipt_wrap span:last").append("<em class='ico_app'>앱카드</em> ");
			if(dataList.get(i).STMP_YN == "Y" && dataList.get(i).APR_CAN_YN == "N") jq("#receipt_wrap span:last").append("<em class='stamp'>stamp</em> ");
			if(dataList.get(i).OFF_YN == "Y" && dataList.get(i).APR_CAN_YN == "N") jq("#receipt_wrap span:last").append("<em class='offer'>offer</em> ");
			if(dataList.get(i).RCT_VD_YN == "N") jq("#receipt_wrap li:last").addClass("unconfirm");
			
			pageObj.btnEdit(jq("#btn_mode").attr("onclick").match("'C'") ? 'E' : 'C');
		}
	}else{
		pageObj.pageNo = 14;
	}
	// 더보기 세팅
	setTimeout(function(){
		moreSetting(14, pageObj.LCMW4100);
	}, 100);
	remocon(true);

	if(jq("#receipt_wrap").html() == "") jq("#receipt_wrap").html('<div style="text-align: center;padding: 20px;background: #ededed;">조회결과가 없습니다.</div>');
};

pageObj.btnEdit = function(flag){
	if(flag == "E"){
		jq(".receipt_detail").addClass("remove_mode");
		jq(".receipt_control .view_type, .receipt_cancel, #explain").hide();
		jq("#btn_remove").show();
		jq("#btn_mode").attr("onclick", "pageObj.btnEdit('C')").html("취소");
		pageObj.edit = true;
	}else{
		jq(".receipt_detail").removeClass("remove_mode");
		jq(".receipt_control .view_type, .receipt_cancel, #explain").show();
		jq("#btn_remove").hide();
		jq("#btn_mode").attr("onclick", "pageObj.btnEdit('E')").html("편집");
		pageObj.edit = false;
		jq("label").each(function(){
			jq(this).removeClass("check_on");
		});
	}
};


pageObj.LCMW4110 = function(){
	pageObj.selCdAprSeq = "";
	var tmpNum = 0;
	jq(".check_on").each(function(){
		if(pageObj.selCdAprSeq != "") pageObj.selCdAprSeq += "/";
		pageObj.selCdAprSeq += this.id;
		tmpNum++;
	});
	if(pageObj.selCdAprSeq == ""){
		appAlert("알림", "삭제하려는 항목을 선택해주십시오.", "확인");
		return;
	}
	appConfirm("알림", tmpNum + "개의 스마트영수증을 삭제하시겠습니까?", "확인", "취소", function(){
		var params = {
				cd_apr_seq : pageObj.selCdAprSeq
		};
		commPage("T", "lcmw4110", params, pageObj.resultLCMW4110);
//		pageObj.resultLCMW4110({"DELETE_RESULT" : 1});
	}, function(){
	});
	
};

pageObj.resultLCMW4110 = function(resultData){
	pageObj.btnEdit("C");
	if(resultData.DELETE_RESULT > 0){
		appAlert("알림", resultData.DELETE_RESULT + "개의 스마트영수증을 삭제 했습니다.", "확인");
		var selCdAprSeqSplit = pageObj.selCdAprSeq.split("/");
		for(var i = 0; i < selCdAprSeqSplit.length;i++){
			jq("#li_" + selCdAprSeqSplit[i]).remove();
		}
		jq("#receipt_wrap ul").each(function(){
			consoleLog("D", jq(this).html());
			consoleLog("D", jq(this).find("li").size());
			consoleLog("D", jq(this).index());
			if(jq(this).find("li").size() == 0){
				jq("#receipt_wrap h2").eq(jq(this).index()).remove();
			}
		});
	}else{
		appAlert("알림", "스마트 영수증 삭제에 실패했습니다.\n잠시후 다시 이용해주세요.", "확인");
	}
};

pageObj.chkEdit = function(cdAprSeq, aprCanYn, obj){
	if(pageObj.edit){
		if(jq(obj).find("label").attr("class").match("check_on")){
			jq(obj).find("label").removeClass("check_on");
		}else {
			jq(obj).find("label").addClass("check_on");
		}
	}else{
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
		smartReceiptBackData.pageNo = pageObj.pageNo;
		smartReceiptBackData.scrollTop = jq(window).scrollTop();
		smartReceiptBackData.receipt_wrap = jq("#receipt_wrap").html();
		smartReceipt(cdAprSeq, aprCanYn, "LCMW4100");
	}
};
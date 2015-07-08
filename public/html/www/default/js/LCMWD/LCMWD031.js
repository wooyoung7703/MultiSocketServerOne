
/* JavaScript content from js/LCMWD/LCMWD031.js in folder common */
pageObj.pageTitle = "이용내역상세목록";
pageObj.pageSize = 30;
pageObj.pageNo = 1;

pageObj.pageFunction = function(obj){
	
	pageObj.resultLCMWD031(mobileBillDetailList);
};

pageObj.LCMWD031 = function(){
	mobileBillData.curpage = pageObj.pageNo;
	commPage("T", "lcmwd031", mobileBillData, pageObj.resultLCMWD031);
};

pageObj.resultLCMWD031 = function(resultData){
	var rsFree = resultData.free;
	var tmpData = {};
	tmpData.cnt = rsFree.TotalArticles;
	tmpData.tmplId = "boxSimpleOutTmpl";
	var dataList = new GridControl({"row" : resultData.grid.rsBllSpec.row});
	if(mobileBillData.bll_prt_ord_c == "10"){
		tmpData.title_text = "할부내역";
		tmpData.use_money = rsFree.B1;
		tmpData.fee_sum = rsFree.B1_1;
	}else if(mobileBillData.bll_prt_ord_c == "20"){
		tmpData.title_text = "장기카드대출(카드론)내역";
		tmpData.use_money = rsFree.B2;
		tmpData.fee_sum = rsFree.B2_1;
	}else if(mobileBillData.bll_prt_ord_c == "40"){
		tmpData.title_text = "일시불내역";
		tmpData.use_money = rsFree.B3;
		tmpData.fee_sum = rsFree.B3_1;
	}else if(mobileBillData.bll_prt_ord_c == "50"){
		tmpData.title_text = "단기카드대출(현금서비스)내역";
		tmpData.use_money = rsFree.B4;
		tmpData.fee_sum = rsFree.B4_1;
	}else if(mobileBillData.bll_prt_ord_c == "60"){
		tmpData.title_text = "수수료내역";
		tmpData.use_money = rsFree.B5;
		tmpData.fee_sum = rsFree.B5_1;
	}else if(mobileBillData.bll_prt_ord_c == "68"){
		tmpData.title_text = "일부결제금액이월약정 해지잔액내역";
		tmpData.use_money = rsFree.B6;
		tmpData.fee_sum = rsFree.B6_1;
	}else if(mobileBillData.bll_prt_ord_c == "70"){
		tmpData.title_text = "체크카드내역";
		tmpData.use_money = (mobileBillData.chk_cd_u_am_toCurrency).toNumber();
		tmpData.fee_sum = rsFree.B7_1;
	}else if(mobileBillData.bll_prt_ord_c == "0"){
		tmpData.title_text = "취소내역";
		tmpData.use_money = rsFree.B8;
		tmpData.fee_sum = rsFree.B8_1;
		tmpData.cnt = rsFree.cancelSize;
		dataList = new GridControl({"row" : resultData.grid.rsBllSpecCancle.row});
	}else if(mobileBillData.bll_prt_ord_c == "1"){
		tmpData.title_text = "해외내역";
		tmpData.use_money = rsFree.B9;
		tmpData.fee_sum = rsFree.B9_1;
		tmpData.cnt = rsFree.rsBllFrSpecSize;
		dataList = new GridControl({"row" : resultData.grid.rsBllFrSpec.row});
	}else if(mobileBillData.bll_prt_ord_c == "90"){
		tmpData.title_text = "유이자 할부 내역";
		tmpData.use_money = rsFree.B10;
		tmpData.fee_sum = rsFree.B10_1;
		tmpData.cnt = rsFree.rsBllSpecIntmtSize;
		dataList = new GridControl({"row" : resultData.grid.rsBllSpecIntmt.row});
	}else if(mobileBillData.bll_prt_ord_c == "95"){
		tmpData.title_text = "통신요금 이월내역";
		tmpData.use_money = rsFree.B11;
		tmpData.fee_sum = rsFree.B11_1;
		tmpData.tmplId = "lblTeleTitleTmpl";
		dataList = new GridControl({"row" : resultData.grid.rsBllSpecTele.row});
		tmpData.cnt = dataList.getSize();
	}else if(mobileBillData.bll_prt_ord_c == "96"){
		tmpData.title_text = "알뜰 결제 프로모션 이용내역 안내";
		tmpData.use_money = rsFree.B12;
		tmpData.fee_sum = rsFree.B12_1;
		tmpData.tmplId = "lblHappyGoalTitleTmpl";
		dataList = new GridControl({"row" : resultData.grid.rsBllSpecHappyGoal.row});
		tmpData.cnt = dataList.getSize();
		jq("#mainBoxHeder").hide();
	}
	
	tmpData.use_money_fee = String(parseInt(tmpData.fee_sum, 10) + parseInt(tmpData.use_money, 10)).toCurrency();
	tmpData.use_money = String(tmpData.use_money).toCurrency();
	tmpData.fee_sum = String(tmpData.fee_sum).toCurrency();
	
	
	jq("#boxSimpleOut").html(bindData(jq("#" + tmpData.tmplId).val(), tmpData));
	

	pageObj.resultLCMWD031List(dataList, tmpData.cnt);
};

pageObj.resultLCMWD031List = function(dataList, totalCount){
	for(var i = 0; i < dataList.getSize(); i++){
		if(mobileBillData.bll_prt_ord_c == "0" || mobileBillData.bll_prt_ord_c == "1" || mobileBillData.bll_prt_ord_c == "90" ||  mobileBillData.bll_prt_ord_c == "95" ||  mobileBillData.bll_prt_ord_c == "96"){
			dataList.get(i).use_money_fee = dataList.get(i).use_money;
		}
		dataList.get(i).INT_MT = dataList.get(i).INT_MT > 0 ? "(" + dataList.get(i).INT_MT + ")" : "";
		var tmplId = "boxSimpleListTmpl";
		if(mobileBillData.bll_prt_ord_c == "95"){
			tmplId = "mBoxSimpleListTmpl";
		}else{
			dataList.get(i).style_distinct1 = (!dataList.get(i).distinct1 || dataList.get(i).distinct1 == "")? "none" : "";
		}
		
		jq("#boxSimpleList").append(bindData(jq("#" + tmplId).val(), dataList.get(i)));
	}
	
	// 더보기 세팅
	moreSetting(totalCount, pageObj.LCMWD031);
};

pageObj.LCMWD022 = function(idx){
	mobileBillData.print_index = idx;
	commPage("T", "lcmwd022", mobileBillData, pageObj.resultLCMWD022);
};

pageObj.resultLCMWD022 = function(resultData){
	if(resultData.free.resultStatus == "success"){
		var tmplId = "detailTmpl";
		if(mobileBillData.bll_prt_ord_c == "1"){
			tmplId = "gDetailTmpl";
		}else if(mobileBillData.bll_prt_ord_c == "95"){
			tmplId = "mDetailTmpl";
		}else if(mobileBillData.bll_prt_ord_c == "96"){
			tmplId = "happyDetailTmpl";
		}
		
		resultData.free.TMP_ID = getSessionKey(3);
		jq("#billDetailPop").html(bindData(jq("#" + tmplId).val(), resultData.free));
		initFullPop("billDetail", {
			leftBtn		: true,
			rightBtn	: true
		});
		jq(".billDetail").click();
		
		if(mobileBillData.bll_prt_ord_c == "96"){
			jq(".guide_box dt a").unbind("click");
			jq(".guide_box dt a").click(function(){
				jq(this).parents("dl").toggleClass("on");
				return false;
			});
		}
	}else{
		main.commonAppAlert("알림", resultData.free.resultMsg, "확인");
	}
};
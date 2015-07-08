
/* JavaScript content from js/LCMWD/LCMWD021.js in folder common */
pageObj.pageTitle = "이용내역목록";

pageObj.pageFunction = function(obj){
	// 이용안내 세팅
	jq(".guide_box dt a").unbind("click");
	jq(".guide_box dt a").click(function(){
		jq(this).parents("dl").toggleClass("on");
		return false;
	});
	
	pageObj.LCMWD021();
};

pageObj.LCMWD021 = function(){
	var freeDt = mobileBillDetail.free;
	freeDt.CARDTOTAL = String(parseInt(freeDt.A1, 10) + parseInt(freeDt.A4, 10)).toCurrency();
	freeDt.METOTAL = String(parseInt(freeDt.A2, 10) + parseInt(freeDt.A5, 10)).toCurrency();
	freeDt.FAMTOTAL = String(parseInt(freeDt.A3, 10) + parseInt(freeDt.A6, 10)).toCurrency();
	
	freeDt.TMP_A1 = freeDt.A1.toCurrency();
	freeDt.TMP_A2 = freeDt.A2.toCurrency();
	freeDt.TMP_A3 = freeDt.A3.toCurrency();
	freeDt.TMP_A4 = freeDt.A4.toCurrency();
	freeDt.TMP_A5 = freeDt.A5.toCurrency();
	freeDt.TMP_A6 = freeDt.A6.toCurrency();
	
	freeDt.B1_SUM = String(parseInt(freeDt.B1.toNumber(), 10) + parseInt(freeDt.B1_1.toNumber(), 10)).toCurrency();
	freeDt.B2_SUM = String(parseInt(freeDt.B2.toNumber(), 10) + parseInt(freeDt.B2_1.toNumber(), 10)).toCurrency();
	freeDt.B3_SUM = String(parseInt(freeDt.B3.toNumber(), 10) + parseInt(freeDt.B3_1.toNumber(), 10)).toCurrency();
	freeDt.B4_SUM = String(parseInt(freeDt.B4.toNumber(), 10) + parseInt(freeDt.B4_1.toNumber(), 10)).toCurrency();
	freeDt.B5_SUM = String(parseInt(freeDt.B5.toNumber(), 10) + parseInt(freeDt.B5_1.toNumber(), 10)).toCurrency();
	freeDt.B6_SUM = String(parseInt(freeDt.B6.toNumber(), 10) + parseInt(freeDt.B6_1.toNumber(), 10)).toCurrency();
	freeDt.B7_SUM = String(parseInt((mobileBillData.chk_cd_u_am_toCurrency).toNumber(), 10) + parseInt(freeDt.B7_1.toNumber(), 10)).toCurrency();
	freeDt.B8_SUM = String(parseInt(freeDt.B8.toNumber(), 10) + parseInt(freeDt.B8_1.toNumber(), 10)).toCurrency();
	freeDt.B9_SUM = String(parseInt(freeDt.B9.toNumber(), 10) + parseInt(freeDt.B9_1.toNumber(), 10)).toCurrency();
	freeDt.B10_SUM = String(parseInt(freeDt.B10.toNumber(), 10) + parseInt(freeDt.B10_1.toNumber(), 10)).toCurrency();
	
	if(freeDt.B7_SUM != "0"){
		freeDt.A1 = mobileBillData.chk_cd_u_am_toCurrency;
		freeDt.A4 = freeDt.B7_1;
		freeDt.CARDTOTAL = freeDt.B7_SUM;
	}
	freeDt.card_me = freeDt.A2 == "0" ? "none" : "";
	freeDt.card_fam = freeDt.A3 == "0" ? "none" : "";
	
	jq("#boxSimpleOut").html(bindData(jq("#boxSimpleOutTmpl").val(), freeDt));
	jq("#dedailViewList").html(bindData(jq("#dedailViewListTmpl").val(), freeDt));
	
	if(freeDt.B1_YN == "N") jq("#dedailViewList li").eq(0).hide();
	if(freeDt.B2_YN == "N") jq("#dedailViewList li").eq(1).hide();
	if(freeDt.B3_YN == "N") jq("#dedailViewList li").eq(2).hide();
	if(freeDt.B4_YN == "N") jq("#dedailViewList li").eq(3).hide();
	if(freeDt.B5_YN == "N") jq("#dedailViewList li").eq(4).hide();
	if(freeDt.B6_YN == "N") jq("#dedailViewList li").eq(5).hide();
	if(freeDt.B7_YN == "N") jq("#dedailViewList li").eq(6).hide();
	if(freeDt.cancelSize == "0") jq("#dedailViewList li").eq(7).hide();
	if(freeDt.B9_YN == "N") jq("#dedailViewList li").eq(8).hide();
	if(freeDt.B10_YN == "N") jq("#dedailViewList li").eq(9).hide();
	if(freeDt.B11_YN == "N") jq("#dedailViewList li").eq(10).hide();
	if(freeDt.B12_YN == "N") jq("#dedailViewList li").eq(11).hide();
};

pageObj.LCMWD031 = function(flag){
	mobileBillData.bll_prt_ord_c = flag;
	mobileBillData.curpage = 1;
	commPage("T", "lcmwd031", mobileBillData, pageObj.resultLCMWD031);
};

pageObj.resultLCMWD031 = function(resultData){
	if(resultData.free.resultStatus == "success"){
		if(resultData.free.rsBllFrSpec == "" && resultData.free.rsBllSpec == "" && resultData.free.rsBllSpecCancle == ""){
			appAlert("알림", "이용내역이 없습니다.", "확인");
		}else{
			mobileBillDetailList = resultData;
			commPage("P", "LCMWD031", "", "Y");
		}
	}else{
		appAlert("알림", resultData.free.resultMsg, "확인");
	}
};
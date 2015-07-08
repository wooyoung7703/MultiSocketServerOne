
/* JavaScript content from js/LCMWD/LCMWD011.js in folder common */
pageObj.pageTitle = "모바일 명세서";

pageObj.pageFunction = function(obj){
	// 안드로이드 진져브래드 버젼에서 셀렉트 박스 헤더, 푸터아래에서 우선 이벤트 현상 방지
	if((deviceInfo.osVersion.match("2.3") && deviceInfo.os == "android")) disableSelect();
	// 이용안내 세팅
	jq(".guide_box dt a").unbind("click");
	jq(".guide_box dt a").click(function(){
		jq(this).parents("dl").toggleClass("on");
		return false;
	});
	
	// 모바일 명세서 조회
//	pageObj.LCMWD011();
	
	// 명세일자
	pageObj.rsblllist(mobileBillResult.grid.rsblllist);
	
	pageObj.resultLCMWD011(mobileBillResult);
};

pageObj.LCMWD011 = function(){
	commPage("T", "lcmwd011", mobileBillData, pageObj.resultLCMWD011);
};

// 모바일 명세서 조회 결과
pageObj.resultLCMWD011 = function(resultData){
	mobileBillResult = resultData;
	if(resultData.free.resultStatus == "fail"){
		appAlert("알림", resultData.free.resultMsg, "확인");
	}else{
		// 결제계좌
		pageObj.rsBllListDtl(resultData.grid.rsBllListDtl);
		
		// 이용내역
		pageObj.mobileBill(resultData);
		jq(".list_acc_li").removeClass("on");
	}
};

pageObj.rsblllist = function(rsData){
	var dataList = new GridControl({"row" : rsData.row});
	pageObj.rsList = [];
	jq("#iosSelect").html(dataList.get(0).name1);
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#rsblllist").append("<option value='" + dataList.get(i).code1 + ":" + dataList.get(i).sumTotalBll_toCurrency + "'>" + dataList.get(i).name1 + "</option>");
		pageObj.rsList.push({CODE : dataList.get(i).code1 + ":" + dataList.get(i).sumTotalBll_toCurrency, VALUE : dataList.get(i).name1});
		consoleLog("D", mobileBillData.stt_dt + " == " + dataList.get(i).code1.substr(0, 8));
		if(mobileBillData.stt_dt == dataList.get(i).code1.substr(0, 8)){
			jq("#rsblllist").val(dataList.get(i).code1 + ":" + dataList.get(i).sumTotalBll_toCurrency);
			jq("#iosSelect").html(dataList.get(i).name1);
		}
	}
};

pageObj.rsBllListDtl = function(rsData){
	var dataList = new GridControl({"row" : rsData.row});
	jq("#rsBllListDtl").html("");
	for(var i = 0; i < dataList.getSize(); i++){
		dataList.get(i).tmp_bll_unit_no = dataList.get(i).row_span == "0" ? "" 
				: 	"<td class='tc' rowspan='" + dataList.get(i).row_span + "'>" +
						"<label class='radio' style='padding: 0 20px 0 0;' data-bll_unit_no='" + dataList.get(i).bll_unit_no + "' onclick='pageObj.radioClick(\"" + dataList.get(i).bll_unit_no + "\")'>" +
					"</label></td>";
		
		dataList.get(i).tmp_sum_amt = dataList.get(i).sum_amt.toCurrency();
		jq("#rsBllListDtl").append(bindData(jq("#rsBllListDtlTmpl").val(), dataList.get(i)));
	}
	if(mobileBillData.bll_unit_no == ""){
		jq("#rsBllListDtl label").eq(0).addClass("radio_on");
	}else{
		jq(".radio").each(function(){
			consoleLog("D", "jq(this).data('bll_unit_no') == mobileBillData.bll_unit_no : " + jq(this).data("bll_unit_no") + " == " + mobileBillData.bll_unit_no);
			if(jq(this).data("bll_unit_no") == mobileBillData.bll_unit_no){
				jq(this).addClass("radio_on");
			}
		});
	} 
	initRadioBtn();
};

pageObj.mobileBill = function(rsData){
	jq("#sumTotalBll").html(jq("#rsblllist").val().split(":")[1]);
	jq("#mobileBill").html(bindData(jq("#mobileBillTmpl").val(), rsData.free));
	jq("#billDate .lb").eq(0).html(rsData.free.rsAButilSDt + " ~ " + rsData.free.rsAButilEDt);
	jq("#billDate .lb").eq(1).html(rsData.free.rsCButilSDt + " ~ " + rsData.free.rsCButilEDt);
	
	if(rsData.free.min_stt_am_toCurrency == null || rsData.free.min_stt_am_toCurrency == undefined || rsData.free.min_stt_am_toCurrency == ''){
		jq("#min_stt_am").hide();
	}
	if(rsData.free.chk_cd_u_am_toCurrency == null || rsData.free.chk_cd_u_am_toCurrency == undefined || rsData.free.chk_cd_u_am_toCurrency == ''){
		jq("#chk_cd_u").hide();
	}
	
	initAcc();
	
	var dtSel = jq("#rsblllist").val().split(":")[0];
	
	mobileBillData.chk_cd_u_am_toCurrency	= rsData.free.chk_cd_u_am_toCurrency;
	mobileBillData.bll_unit_no				= jq(".radio_on").data("bll_unit_no");
	mobileBillData.stt_dt					= dtSel.substring(0,8);
	mobileBillData.lotte_amex_dc			= dtSel.substring(8,9);
	mobileBillData.mbrno					= dtSel.substring(9,20);
	consoleLog("D", "mobileBillData : " + JSON.stringify(mobileBillData));
};

// 명세일자 변경
pageObj.changeDate = function(){
	if(mobileBillData.stt_dt != jq("#rsblllist").val().substr(0, 8)){
		var dtSel = jq("#rsblllist").val().split(":")[0];
		
		mobileBillData.stt_dt				= dtSel.substring(0,8);
		mobileBillData.lotte_amex_dc		= dtSel.substring(8,9);
		mobileBillData.mbrno				= dtSel.substring(9,20);
		mobileBillData.bll_unit_no			= "";
		pageObj.LCMWD011();
	}
};

// 결제 계좌 변경
pageObj.radioClick = function(bllUnitNo){
	setTimeout(function(){
		if(mobileBillData.bll_unit_no != bllUnitNo){
			mobileBillData.bll_unit_no = bllUnitNo;
			pageObj.LCMWD011();
		}
	}, 20);
};

pageObj.LCMWD021 = function(){
	commPage("T", "lcmwd021", mobileBillData, pageObj.resultLCMWD021);
};

pageObj.resultLCMWD021 = function(resultData){
	if(resultData.free.resultStatus == "success"){
		mobileBillDetail = resultData;
		commPage("P", "LCMWD021", "", "Y");
	}else{
		appAlert("알림", resultData.free.resultMsg, "확인");
	}
};

//아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(){
	callNtv(null, null, "DevicePlugin", "selectbox", [pageObj.rsList, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	jq("#rsblllist").val(tmpCode);
	jq("#iosSelect").html(tmpValue);
	
	pageObj.changeDate();
};
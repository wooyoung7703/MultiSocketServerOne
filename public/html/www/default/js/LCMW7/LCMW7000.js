
/* JavaScript content from js/LCMW7/LCMW7000.js in folder common */
pageObj.pageTitle = "카드신청";
pageObj.pageSize = 10;
pageObj.pageNo = 1;

pageObj.pageFunction = function(obj){
	// 카드 리스트 조회
	pageObj.LCMW7000();
};

pageObj.LCMW7000 = function(){
	var params = {
			page_size : pageObj.pageSize,
			page_no : pageObj.pageNo
	};
	commPage("T", "lcmw7000", params, pageObj.resultLCMW7000);
};

pageObj.resultLCMW7000 = function(resultData){
	if(resultData.CARDLIST_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.CARDLIST});
		for(var i = 0; i < dataList.getSize(); i++){
			jq("#popular_list").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		}
	}
//	moreSetting(resultData.CARDLIST_SIZE, pageObj.LCMW7000);
};

// 카드정보 상세 조회
pageObj.LCMW7100 = function(cardCode){
	var params = {
			unit_cd_c : cardCode
	};
	commPage("T", "lcmw7100", params, pageObj.resultLCMW7100);
};

// 카드정보 상세 조회 결과
pageObj.resultLCMW7100 = function(resultData){
	jq("#cardDetailPop").html(bindData(jq("#cardDetailTmpl").val(), resultData));
	if(userInfo.ccd_mbyn == "Y"){
		jq("#cardDetailPop").find(".btn_small").attr("onclick", "pageObj.subArs()").html("ARS신청");
	}  
	
	var dataList = new GridControl({"row" : resultData.BRANDLIST});
	var str = "";
	for(var i = 0; i < dataList.getSize(); i++){
		if(str != "") str += ", ";
		str += dataList.get(i).BRAND;
	}
	jq("#detail_ul li").eq(0).append(str);
	
	dataList = new GridControl({"row" : resultData.GDCLIST});
	str = "";
	for(var i = 0; i < dataList.getSize(); i++){
		if(str != "") str += ", ";
		str += dataList.get(i).GDC;
	}
	jq("#detail_ul li").eq(1).append(str);
	
	dataList = new GridControl({"row" : resultData.STCDLIST});
	str = "";
	for(var i = 0; i < dataList.getSize(); i++){
		if(str != "") str += ", ";
		str += dataList.get(i).STCD;
	}
	jq("#detail_ul li").eq(2).append(str);
	
	dataList = new GridControl({"row" : resultData.FRVLIST});
	for(var i = 0; i < dataList.getSize(); i++){
		dataList.get(i).TMP_FVR_CN = dataList.get(i).FVR_CN.replace(/\/images/g, "http://lottecard.co.kr/images");
		dataList.get(i).TMP_FVR_CN = dataList.get(i).TMP_FVR_CN.replace(/<img src/g, "<img style='max-width:" + (deviceInfo.winWidth * 0.85) + "px' src");
		jq("#list_acc").append(bindData(jq("#listAccTmpl").val(), dataList.get(i)));
	}
	
	initFullPop("cdBtnPop", {
		leftBtn		: true, 
		rightBtn	: true
	});
	jq(".cdBtnPop").click();
	initAcc();
};

// 카드 간편신청
pageObj.LCMW7200 = function(vt_cd_knd_nm){
	pageObj.vt_cd_knd_nm = vt_cd_knd_nm;
	
	// 카드 간편신청 이벤트 조회
	commPage("T", "lcmw7200", "", pageObj.resultLCMW7200);
};

// 카드 간편신청 이벤트 조회
pageObj.resultLCMW7200 = function(resultData){
	if(resultData.EVENT == "Y"){
		jq("#cardEventPop").html(bindData(jq("#cardEventTmpl").val(), resultData));
		
		initFullPop("evnBtnPop", {
			btnCount	: 2,
			btnText1	: "간편신청",
			btnText2	: "나중에 하기",
			btnEvent1	: "pageObj.LCMW7210",
			btnEvent2	: "pageObj.cancel"
		});
		
		jq("#full_pop").hide();
		pageObj.tmpScrollTop = tmpScrollTop;
		jq(".evnBtnPop").click();
	}else{
		pageObj.LCMW7210();
	}
};

pageObj.LCMW7210 = function(vt_cd_knd_nm){
	commPage("P", "LCMW7210", vt_cd_knd_nm, "L");
};

pageObj.cancel = function(){
	jq("#full_pop").hide();
	jq(".cdBtnPop").click();
	tmpScrollTop = pageObj.tmpScrollTop;
};

pageObj.subArs = function(){
	if(deviceInfo.os=="android"){
		callNtv(null, null, "DevicePlugin", "callPhone", ["1577-8700", "기존 고객은 ARS를 통해 카드 추가가 가능합니다. ARS(1577-8700)"]);
	}else{
		var telNo = "1577-8700";
		appConfirm("알림", "기존 고객은 ARS를 통해 카드 추가가 가능합니다. ARS(" + telNo + ") 연결하시겠습니까?", "확인", "취소", function(){
			location.href="tel:" + telNo;
		}, function(){});
	}
};
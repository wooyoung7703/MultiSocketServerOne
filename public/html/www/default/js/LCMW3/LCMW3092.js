
/* JavaScript content from js/LCMW3/LCMW3092.js in folder common */

/* JavaScript content from js/LCMW3/LCMW3092.js in folder common */
pageObj.pageTitle = "카드 인증";
pageObj.cardFlag = "L";
pageObj.bk_rrno2 = "";
pageObj.yearList = [{CODE : "", VALUE : "년"}];
pageObj.monthList = [{CODE : "", VALUE : "월"}];
pageObj.cardInfo = "";
pageObj.pageFunction = function(obj){

	pageObj.cardInfo = eval("(" + obj + ")");
	
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
	//jq("#leftBtn").hide();
	pageObj.newDate = yyyymm(new Date());
	//년,월
	pageObj.year = parseInt(pageObj.newDate.substr(0,4), 10);
	pageObj.month = parseInt(pageObj.newDate.substr(4), 10);
	//해당월수
	var totalDay = new Date(pageObj.year, pageObj.month, 1, -1).getDate();
	//유효기간 년
	for(var i = pageObj.year; i < pageObj.year + 11; i++){
        
        //년월 4자리 수정
        var yy = i.toString().substr(2,2);
        yy = pageObj.changeNum(yy,2);
        
		jq("#sel_year").append("<option value='" + yy.toString() + "'>" + yy.toString() + "</option>");
		pageObj.yearList.push({CODE : yy.toString(), VALUE : yy.toString()});
		
	}
    
	//월
	totalDay = parseInt(totalDay, 10);
	for(var i = 1; i < 12 + 1; i++){
        //년월 4자리 수정
        var yy = pageObj.changeNum(i,2);
		jq("#sel_month").append("<option value='" + yy.toString() + "'>" + yy.toString() + "</option>");
		pageObj.monthList.push({CODE : yy.toString(), VALUE : yy.toString()});
	}
    
	setMTransKey();
};

pageObj.changeSelect = function(){

	pageObj.pageNo = 1;
	unbindScroll();
	jq(window).scrollTop(10);
	jq("#sel_year, #sel_month").blur();

};



pageObj.LCMW3093 = function(){
	var tmpNum = "";
	var jString = JSON.stringify(pageObj.cardInfo);
	var pString = JSON.parse(jString);
	var enccdno = pString.card_info.split(",");
	var list_cardnum = TrimCardNum(enccdno[4]);
	var real_cardnum = TrimCardNum(jq("#cardNum").val());
	
	if(!MatchCardNum(list_cardnum, real_cardnum)){
		appAlertOne("알림", "선택하신 카드의 카드정보와 입력하신 카드정보가 다릅니다.", "확인", function(){
			commPage("T", "lcmw3090", "", pageObj.resultLCMW3090);
		});
		return;
	}
	
	if(pageObj.cardFlag == "L"){
		tmpNum = jq("#tk_cvcNum").val();
		if(tmpNum == ""){
			appAlert("알림", "CVC번호를 입력하세요.", "확인");
			return;
		}
		
	}else{
		tmpNum = jq("#tk_4dbcNum").val();
		if(tmpNum == ""){
			appAlert("알림", "4DBC번호를 입력하세요.", "확인");
			return;
		}
	}
	
	if(jq("#tk_passNum").val() == ""){
		appAlert("알림", "비밀번호를 입력하세요.", "확인");
		return;
	}
	
	if(jq("#sel_year").val() == ""||jq("#sel_month").val() == ""){
		appAlert("알림", "유효기간을 확인하세요.", "확인");
		return;
	}

	var params = {
        map_key			    : mapKey,
        encrypt_pre_cdno	: enccdno[0],
        encrypt_cdno    	: jq("#tk_cardNum").val(),
        cvc 		    	: tmpNum,
        expireDate	     	: jq("#sel_year").val()+jq("#sel_month").val(),
        password 	    	: jq("#tk_passNum").val()
	};

    consoleLog("D", JSON.stringify(params));
	commPage("T", "lcmw3096", params, pageObj.resultLCMW3096);
};

// 앞자리 한자리 일때 0+X유지
pageObj.changeNum = function(num, dec){
	var total = "";
	while(total.length < dec - num.toString().length){
		total += "0";
	}
	return total+num;
};

pageObj.resultLCMW3096 = function(resultData){
	if(resultData.RESULT =="success"){
		backData.pop();
		//commPage("P", "LCMWC300", pageObj.certInfo, "L");
		commPage("T", "lcmw3021", pageObj.cardInfo, pageObj.resultLCMW3021);
	}else{
		appAlertOne("알림", resultData.MESSAGE.replace(/<br\/>/g,"\n"), "확인", function(){
			commPage("T", "lcmw3090", "", pageObj.resultLCMW3090);
		});
		jq("#cardNum, #cvcNum, #passNum, #sel_year, #sel_month, #iosSelect1, #iosSelect2").val("");
		jq("#4dbcNum, #tk_4dbcNum").val("");
		jq("#tk_cardNum, #tk_cvcNum, #tk_passNum").val("");
		jq("#disp_cardNum, #disp_cvcNum, #disp_passNum, #disp_4dbcNum, #iosSelect1, #iosSelect2").html("");
        if(deviceInfo.os == "ios"){
            jq("#iosSelect1").html("년");
            jq("#iosSelect2").html("월");
        }

	}
};

//앱카드 추가 결과
pageObj.resultLCMW3021 = function(resultData){
	if(resultData.APPCARD_RESULT == "success"){
		appAlertOne("알림", "카드 추가가 완료되었습니다.", "확인", function(){
			callNtv(null, null, "DevicePlugin", "saveData", ["","","","card_cert","Y"]);
			userInfo.card_cert = "Y";
			var params = {
					topoffset 	    	: 44
				};
			commPage("P", "LCMW3000", params);
		});
	}else{
		appAlertOne("알림", "선택하신 카드의 카드정보와 입력하신 카드정보가 다릅니다.", "확인", function(){
			commPage("T", "lcmw3090", "", pageObj.resultLCMW3090);

		});
	}
};

//앱카드 조회
pageObj.resultLCMW3090 = function(resultData){
	// 추가할 앱카드 여부
	if(resultData.APPCARD_RESULT_SET.USER_YN == "Y"){
		pageObj.resultLCMW3020(resultData.CARD_LIST_SET);
	}
};

//앱카드 추가 가능 카드 조회 결과
pageObj.resultLCMW3020 = function(resultData){
	if(resultData.CARD_SIZE > 0){
		commPage("P", "LCMW3020", resultData.CARD_LIST, "Y");
	}else{
	}
};

pageObj.cancel = function(){
	appConfirm("알림", "취소하시겠습니까?\n카드인증이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};

pageObj.cancelHome = function(){
	appConfirm("알림", "취소하시겠습니까?\n카드인증이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};

pageObj.nextChkInBox = function(obj, min, max, msg){
	
	jq("#disp_yearNum").css({"background" : "#dfdfdf", "border" : "1px solid #333"});
	jq("#disp_yearNum").attr('contenteditable', 'true');
	jq("#disp_yearNum").click();	
//	jq("#disp_yearNum").focus();
};


pageObj.nextChk = function(){
	consoleLog("D", tmpObj);
	//카드체크 아멕스,일반카드 구분
	if(jq("#cardNum").val().length<16){
		pageObj.cardFlag = "A";
		jq(".4dbc").show();
		jq(".cvc").hide();
	}else{
		pageObj.cardFlag = "L";
		jq(".4dbc").hide();
		jq(".cvc").show();
	}
    
	if(jq("#cardNum").val().length == 16 && jq("#cvcNum").val().length == 0){//일반카드
        jq("#disp_cvcNum").click();
	}
	else if(jq("#cardNum").val().length == 15 && jq("#4dbcNum").val().length == 0){//아멕스카드
		jq("#disp_4dbcNum").click();
	}
    else if(jq("#disp_cvcNum").val().length == 3 && jq("#disp_passNum").val().length == 0){
		jq("#disp_passNum").click();
    }
    else if(jq("#disp_4dbcNum").val().length == 4 && jq("#disp_passNum").val().length == 0){
		jq("#disp_passNum").click();
    }
    
};

//아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(flag){
    
	pageObj.flag = flag;
	var tmpList = pageObj.yearList;
	if(flag == "2"){
		tmpList = pageObj.monthList;
	}
    
	callNtv(null, null, "DevicePlugin", "selectbox", [tmpList, "pageObj.iosChangeSelect"]);
    
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	pageObj.pageNo = 1;
	unbindScroll();
	jq(window).scrollTop(0);
	//jq("#newsList").html("");
	if(pageObj.flag == "1"){
		jq("#sel_year").val(tmpCode);
		jq("#iosSelect1").html(tmpValue);
	}else{
		jq("#sel_month").val(tmpCode);
		jq("#iosSelect2").html(tmpValue);
	}
	//pageObj.LCMW5000();
};
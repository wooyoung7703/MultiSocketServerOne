
/* JavaScript content from js/LCMW3/LCMW3000.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";

pageObj.pageFunction = function(obj){

	if(userInfo.wallet_member == "Y"){
		// 스탬프 페이지를 마지막으로 본 시간 load
		callNtv(null,null,"DevicePlugin","loadData",["","","pageObj.resultNewLCMW3300","newLCMW3300"]);
	}else{		// 비회원 페이지
		jq("#div_logout").show();
		remocon(true);
	}
	
};

pageObj.resultNewLCMW3300 = function(resultData){
	consoleLog("D", "resultNewLCMW3300 resultData : " + resultData);
	setTimeout(function(){		// loadData 이후 바로 서버를 호출할 경우 로딩바가 안닫히는 버그 수정위해 0.2초간 딜레이를 준다
		pageObj.newLCMW3300 = resultData;
		
		if(userInfo.ccd_mbyn == "Y"){	// 카드 회원인경우 카드결제 통합조회
			commPage("T", "lcmw3090", "", pageObj.resultLCMW3090);
		}else{							// 카드 회원이 아닌경우 (멤버스 회원) 스탬프 마지막 적립 일자 조회
			jq("#only_mem").show();
			// 스탬프 마지막 적립 일자 조회
			commPage("T", "lcmw3310", "", pageObj.resultLCMW3310);
		}
	}, 200);
};

// 앱카드 통합 조회
pageObj.resultLCMW3090 = function(resultData){
	// 스탬프 마지막 적립 일자 조회 결과
	pageObj.resultLCMW3310(resultData.LT_DT_SET);
	// 앱카드 리스트
	pageObj.resultLCMW3000(resultData.APPCARD_RESULT_SET);
	// 추가할 앱카드 여부
	if(resultData.APPCARD_RESULT_SET.USER_YN == "Y"){
		pageObj.resultLCMW3020(resultData.CARD_LIST_SET);
	}
};

// 스탬프 마지막 적립 일자 조회 결과
pageObj.resultLCMW3310 = function(resultData){
	// 스탬프 new 표시
	consoleLog("D", "resultLCMW3310 resultData.LT_CH_DTTI : " + resultData.LT_CH_DTTI);
	consoleLog("D", "> resultLCMW3310 pageObj.newLCMW3300 : " + pageObj.newLCMW3300);
	if(resultData.LT_CH_DTTI != 0 && resultData.LT_CH_DTTI > pageObj.newLCMW3300){
		jq("#newLCMW3300").show();
	}
	remocon(true);
};

// 앱카드 회원 조회 결과
pageObj.resultLCMW3000 = function(resultData){
	if(resultData.APPCARD_RESULT == "error"){
		appAlert("알림","서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.", "확인");
		return;
	}
	if(resultData.USER_YN == "Y"){	// 앱카드 회원인 경우
		pageObj.mbr_st_dc = resultData.MBR_ST_DC;
		var dataList = new GridControl({"row" : resultData.APPCARD_LIST});
		jq("#app_card_mem").show();
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).CD_NM == "") dataList.get(i).CD_NM = "롯데카드";
			if(dataList.get(i).CD_IMG_NM == "") dataList.get(i).CD_IMG_NM = "images/img/representative_card.png";
			if(dataList.get(i).SET_YN == "Y"){
				jq("#card_list").prepend(bindData(jq("#dataTmpl").val(), dataList.get(i)));
				jq("#card_span_" + dataList.get(i).CARD_CLASS_CODE).html('<em class="badge_main">주카드</em>');
			}else{
				jq("#card_list").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
			}
		}
	}else{							// 앱카드 회원이 아닌경우
		jq("#card_mem").show();
	}
};

// 앱카드 추가 가능 카드 조회 결과
pageObj.resultLCMW3020 = function(resultData){
	if(resultData.CARD_SIZE > 0){
		jq("#app_card_add").show();
		pageObj.cardList = resultData.CARD_LIST;
	}else{
		jq("#app_card_add").hide();
	}
};

// 주카드 등록 / 앱카드 등록해제
pageObj.LCMW3002 = function(url, rpl_cdno){
	var str = url == "lcmw3002" ? "[주카드]로 등록하시겠습니까?" : "등록해제 하시겠습니까?";
	
	appConfirm("알림", str, "확인", "취소", function(){
		var params = {
				rpl_cdno : rpl_cdno
		};
		commPage("T", url, params, pageObj.resultLCMW3002);
	}, function(){
	});
	
};

// 주카드 등록 / 앱카드 등록해제 결과
pageObj.resultLCMW3002 = function(resultData){
	if(resultData.APPCARD_RESULT == "success"){
		commPage('P', 'LCMW3000');
	}else{
		appAlert("알림", "카드 변경에 실패하였습니다. 잠시후 다시 시도해주세요", "확인");
	}
};

// 앱카드 결제
pageObj.payAppCard = function(rpl_cdno){
	if(pageObj.mbr_st_dc == "L"){
		appConfirm("알림", "앱카드(간편결제) 계정이 잠겨 있습니다. 앱카드(간편결제) 앱을 통해 고객 인증후 사용이 가능합니다. 앱카드(간편결제)로 이동하시겠습니까?", "확인", "취소", function(){
			familyApp('롯데앱카드', 'com.lcacApp', 'lotteappcard://', 'http://itunes.apple.com/kr/app/losde-aebkadeu/id688047200?mt=8');
		}, function(){
		});
	}else{
		commPage("P", "LCMW3010", rpl_cdno, "Y");
	}
};

// 앱카드 추가 등록
pageObj.addAppCard = function(){
	commPage("P", "LCMW3020", pageObj.cardList, "Y");
};
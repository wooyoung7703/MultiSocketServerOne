
/* JavaScript content from js/LCMW3/LCMW3100.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";

pageObj.pageFunction = function(obj){
	if(userInfo.wallet_member == "Y"){
		jq("#div_login").show();
		
		// 스탬프 페이지를 마지막으로 본 시간 load
		callNtv(null,null,"DevicePlugin","loadData",["","","pageObj.resultNewLCMW3300","newLCMW3300"]);
	}else{
		jq("#div_logout").show();
		remocon(true);
	}
	
};

pageObj.resultNewLCMW3300 = function(resultData){
	setTimeout(function(){		// loadData 이후 바로 서버를 호출할 경우 로딩바가 안닫히는 버그 수정위해 0.2초간 딜레이를 준다
		pageObj.newLCMW3300 = resultData;
		// 멤버십 카드 리스트 조회
		commPage("T", "lcmw3180", "", pageObj.resultLCMW3180);
	}, 200);
};

pageObj.resultLCMW3180 = function(resultData){
	pageObj.resultLCMW3310(resultData.LT_DT_SET);
	pageObj.resultLCMW3100(resultData.MEMBERSHIP_SET);
};

//스탬프 마지막 적립 일자 조회 결과
pageObj.resultLCMW3310 = function(resultData){
	// 스탬프 new 표시
	if(resultData.LT_CH_DTTI != 0 && resultData.LT_CH_DTTI > pageObj.newLCMW3300){
		jq("#newLCMW3300").show();
	}
};

// 카드 리스트 조회 결과
pageObj.resultLCMW3100 = function(resultData){
	remocon(true);
	if(resultData.MEMBERSHIP_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.MEMBERSHIP});
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).CDNO != ""){		// 카드 발급 된 경우 멤버스 카드
				if(dataList.get(i).LOTTE_CCO_C != "9999"){
					jq("#members_list").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
					jq("#barcode_btn_" + dataList.get(i).CDNO).show();
				}
			}
		}
		var cnt = 0;
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).CDNO != ""){		// 카드 발급 된 경우 직접등록 카드
				if(dataList.get(i).LOTTE_CCO_C == "9999"){
					cnt++;
					dataList.get(i).CD_DTL_IMG_URL_NM = "images/img/img_tem01.png";
					dataList.get(i).CD_MAI_IMG_URL_NM = "images/img/img_tem01.png";
					jq("#members_list").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
					jq("#barcode_btn_" + dataList.get(i).CDNO).show();
				}
			}
		}
		if(cnt >= 20) jq("#btnIssue").hide();
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).CDNO == "" && dataList.get(i).LOTTE_CCO_C != "9999"){		// 카드 발급이 안된경우, 직접등록 카드 제외
				jq("#members_list").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
				jq("#card_issue_" + dataList.get(i).LOTTE_CCO_C).show();
				jq("#issue_btn_" + dataList.get(i).LOTTE_CCO_C).show();
				jq("#card_detail_" + dataList.get(i).LOTTE_CCO_C + ", #strong_" + dataList.get(i).LOTTE_CCO_C).attr("onclick", "pageObj.cardIssue('" + dataList.get(i).LOTTE_CCO_C + "')");
			}
		}
	}
};

// 등록된 카드 상세
pageObj.cardDetail = function(cdKndc, cdNo, lotteCcoc){
	if(cdKndc == "L"){		// 직접등록 카드 상세
		commPage("P", "LCMW3123", cdNo, "Y");
	}else{					// 멤버스 카드 상세
		var cardInfo = {
				cdNo		: cdNo,
				lotteCcoc	: lotteCcoc
		};
		commPage("P", "LCMW3120", cardInfo, "Y");
	}
};

// 카드 발급 상세
pageObj.cardIssue = function(lotteCcoc){
	commPage("P", "LCMW3150", lotteCcoc, "Y");
};

// 카드 직접등록
pageObj.noMemCardIssue = function(){
	commPage("P", "LCMW3130", "", "Y");
};

/* JavaScript content from js/LCMW3/LCMW3020.js in folder common */
pageObj.pageTitle = "앱카드(간편결제) 추가";

pageObj.pageFunction = function(obj){
	var cardList = eval("(" + obj + ")");
	
	var dataList = new GridControl({"row" : cardList});
	for(var i = 0; i < dataList.getSize(); i++){
		if(dataList.get(i).CD_IMG_NM == "") dataList.get(i).CD_IMG_NM = "images/img/representative_card.png";
		if(dataList.get(i).CD_NM == "") dataList.get(i).CD_NM = "롯데카드";
		jq("#card_list").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		if(i==0 && dataList.getSize() >= 1)
			jq(".radio").addClass("radio_on");
	}
	//initCheckBox();
};

// 앱카드 추가
pageObj.addAppCard = function(){
	var cardInfo = "";
	jq(".radio_on").each(function(){
		if(cardInfo != "") cardInfo += ":";
		cardInfo += this.id;
	});
	if(cardInfo == ""){
		appAlert("알림", "선택된 카드가 없습니다.", "확인");
	}else{
		var params = {
				card_info : cardInfo
		};
		//commPage("T", "lcmw3021", params, pageObj.resultLCMW3021);
		commPage("P", "LCMW3092", params, "L");
	}
};

// 앱카드 추가 결과
pageObj.resultLCMW3021 = function(resultData){
	if(resultData.APPCARD_RESULT == "success"){
		appAlert("알림", "앱카드(간편결제)로 등록되었습니다.", "확인");
		commPage('P', 'LCMW3000');
	}else{
		appAlert("알림", "앱카드(간편결제) 추가 등록에 실패하였습니다. 잠시후 다시 실행해 주세요.", "확인");
	}
};

pageObj.chkRadio = function(obj){
	
	jq(".radio").removeClass("radio_on");
	jq(obj).addClass("radio_on");

};


/* JavaScript content from js/LCMW3/LCMW3130.js in folder common */
pageObj.pageTitle = "멤버십 정보입력";

pageObj.pageFunction = function(obj){
	
};

// 등록
pageObj.LCMW3130 = function(){
	if(jq("#cdnm").val() == ""){
		appAlert("알림", "카드명을 입력하세요", "확인");
		return;
	}
	
	if(jq("#cdno").val() == ""){
		appAlert("알림", "카드번호를 입력하세요", "확인");
		return;
	}
	var params = {
			ms_cd_nm	: jq("#cdnm").val(),
			lotte_cco_c	: "9999",
			cdno		: jq("#cdno").val()
	};
	commPage("T", "lcmw3130", params, pageObj.resultLCMW3130);
};

// 등록 결과
pageObj.resultLCMW3130 = function(resultData){
	if(resultData.DUPL == "N"){
		appAlert("알림", "카드등록이 완료되었습니다.", "확인");
		jq("#leftBtn").click();
	}else{
		appAlert("알림", "이미 등록된 카드번호입니다.", "확인");
	}
};
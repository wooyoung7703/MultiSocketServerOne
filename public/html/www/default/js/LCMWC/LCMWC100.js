
/* JavaScript content from js/LCMWC/LCMWC100.js in folder common */
pageObj.pageTitle = "약관동의";
pageObj.noCheckCert = "";		// 필수 조건에서 체크하지 않은 약관
var mNoticeAlertCheck = false;
var mNoticeCheckBox = false;

pageObj.pageFunction = function(obj){
	busyState.show = true; 
	jq("#family_menu, #mainNav, #leftBtn").hide();
	jq("#rightBtn").attr({"onclick" : "pageObj.cancel()", "class" : "home"}).show();
	
	// 약관 조회 
	pageObj.LCMWC110();

};

// 클러치 약관 조회
pageObj.LCMWC110 = function(){
	commPage("T", 'lcmwc110', "", pageObj.resultLCMWC110);
};

// 약관 조회 결과
pageObj.resultLCMWC110 = function(resultData){
	var dataList = new GridControl({"row" : resultData.PROVISION});
	
	for(var i = 0; i < dataList.getSize(); i++){
		var str = "";
		
//		for(var j = 1; j < dataList.get(i).MEN_DPH; j++){
//			str += "&nbsp;&nbsp;&nbsp;";
//		}
		dataList.get(i).PRV_SUB_NM = str + dataList.get(i).PRV_SUB_NM;
		jq("#agreeList").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
	}
	
	// 체크박스 활성화
	initCheckBox();
};

pageObj.next = function(){
	if(pageObj.agreeChk()){
		var str = pageObj.noCheckCert ? "[" + pageObj.noCheckCert.replace(/\&nbsp;/g, "").replace("-", "") + "] 에 동의하지 않았습니다." : "서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.";
		appAlert("알림", str, "확인");
		return;
	}else{
		if(!mNoticeAlertCheck && !mNoticeCheckBox){
			mNoticeAlertCheck = true;
			alert("공지성 알림 PUSH 미동의 시\n'스마트 영수증' 서비스를 받아보실 수 없습니다.\n\n스마트 영수증이란, SMS 가입 회원에게 무료로 제공되는 승인 알림 서비스로 승인내역 뿐 아니라, 사용 중인 카드혜택, 포인트 내역 등을 확인하실 수 있습니다.")
		} else {
			commPage("P", "LCMWC200", pageObj.prv_info, "L");
		}
	}
};

pageObj.agreeChk = function(){
	pageObj.prv_info = "";
	mNoticeCheckBox = false;
	var agreeChkBool = false;
	pageObj.noCheckCert = "";
	jq("fieldset .check").each(function(){
		if(pageObj.prv_info != "") pageObj.prv_info += ":";
		pageObj.prv_info += jq(this).find("input").eq(0).val() + ",";
		pageObj.prv_info += jq(this).find("input").eq(1).val() + ",";
		if(jq(this).attr("class").match("check_on")){
			pageObj.prv_info += "Y,";
			
			if(jq(this).find("input").eq(3).val() == "공지성 알림 PUSH")
				mNoticeCheckBox = true;
		}else{
			pageObj.prv_info += "N,";
			if(jq(this).find("input").eq(2).val() == "Y"){
				agreeChkBool = true;
				if(pageObj.noCheckCert == "") pageObj.noCheckCert = jq(this).find("input").eq(3).val().trim();
			}
		}
		pageObj.prv_info += jq(this).find("input").eq(4).val();
	});
	if(jq("fieldset .check").size() < 2){
		agreeChkBool = true;
		pageObj.noCheckCert = false;
	}
	return agreeChkBool;
};

pageObj.nextChk = function(){
	setTimeout(function(){
		if(pageObj.agreeChk()){
			jq("#nextBtn").attr("class", "btn_31");
		}else{
			jq("#nextBtn").attr("class", "btn_r31");
		}
	}, 10);
};

pageObj.cancel = function(){
	appConfirm("알림", "취소하시겠습니까?\n회원가입이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};

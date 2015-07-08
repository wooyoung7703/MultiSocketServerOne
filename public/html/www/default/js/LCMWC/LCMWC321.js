
/* JavaScript content from js/LCMWC/LCMWC321.js in folder common */
pageObj.pageTitle = "SMS 서비스 신청";
pageObj.noCheckCert = "";		// 필수 조건에서 체크하지 않은 약관

pageObj.pageFunction = function(obj){
//	jq("body").addClass("bg_dark");
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
	// 약관 조회
	pageObj.LCMWC140();
};

// SMS 약관 조회
pageObj.LCMWC140 = function(){
	commPage("T", 'lcmwc140', "", pageObj.resultLCMWC140);
};

// 약관 조회 결과
pageObj.resultLCMWC140 = function(resultData){
	var dataList = new GridControl({"row" : resultData.PROVISION});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#agreeList").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
	}
	
//	// 약관팝업 초기화
//	initFullPop("fBtnPop", {
//		btnCount	: 1,
//		contClass	: "doc_box",
//		bgDark		: true
//	});
	// 체크박스 활성화
	initCheckBox();
};

pageObj.next = function(){
	if(pageObj.agreeChk()){
		var str = pageObj.noCheckCert ? "[" + pageObj.noCheckCert + "] 에 동의하지 않았습니다." : "서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.";
		appAlert("알림", str, "확인");
		pageObj.noCheckCert = "";
		return;
	}
	commPage("P", "LCMWC322", pageObj.prv_info, "L");
};

pageObj.agreeChk = function(){
	pageObj.prv_info = "";
	var agreeChkBool = false;
	pageObj.noCheckCert = "";
	jq("fieldset .check").each(function(){
		if(pageObj.prv_info != "") pageObj.prv_info += ":";
		pageObj.prv_info += jq(this).find("input").eq(0).val() + ",";
		pageObj.prv_info += jq(this).find("input").eq(1).val() + ",";
		if(jq(this).attr("class").match("check_on")){
			pageObj.prv_info += "Y,";
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
		pageObj.agreeChk() ? jq("#nextBtn").attr("class", "btn_31") : jq("#nextBtn").attr("class", "btn_r31");
	}, 10);
};

pageObj.cancel = function(){
	//hwp 20131223
	appConfirm("알림", "[SMS 기본] 서비스 신청을 취소하시겠습니까?", "확인", "취소", function(){
		commPage("P", smsBackPage);
	}, function(){
	});
};

pageObj.cancelHome = function(){
	appConfirm("알림", "[SMS 기본] 서비스 신청을 취소하시겠습니까?", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};
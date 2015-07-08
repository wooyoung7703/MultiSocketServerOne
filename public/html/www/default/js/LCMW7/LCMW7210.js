
/* JavaScript content from js/LCMW7/LCMW7210.js in folder common */
pageObj.pageTitle = "간편신청";

pageObj.pageFunction = function(obj){
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
//	jq("body").addClass("bg_dark");
	pageObj.card_nm = obj;
	jq("#card_nm").html(obj);
	
	// 라디오 버튼 초기화
	initRadioBtn();
};

pageObj.next = function(){
	if(jq(".radio_on").html() != "동의"){
		appAlert("알림", "상담원 전화 통화 동의를 하셔야만 간편신청 진행이 가능합니다.", "확인");
		return;
	}
	commPage("P", "LCMW7220", pageObj.card_nm, "Y");
};

pageObj.nextChk = function(flag){
	if(flag){
		jq("#nextBtn").removeClass("btn_g");
	} else{
		jq("#nextBtn").addClass("btn_g");
	}
};

pageObj.cancel = function(){
	appConfirm("알림", "취소하시겠습니까?\n간편신청이 취소되며, [카드신청]화면으로 이동됩니다.", "확인", "취소", function(){
		jq("#leftBtn").click();
	}, function(){
	});
};
pageObj.cancelHome = function(){
	appConfirm("알림", "취소하시겠습니까?\n간편신청이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};
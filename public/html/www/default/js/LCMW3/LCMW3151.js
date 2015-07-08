
/* JavaScript content from js/LCMW3/LCMW3151.js in folder common */
pageObj.pageTitle = "약관동의";
pageObj.noCheckCert = "";

pageObj.pageFunction = function(obj){
	jq("#rightBtn").attr({"onclick" : "pageObj.cancelHome()", "class" : "home"}).show();
	pageObj.memJoinInfo = {};
	pageObj.memJoinInfo.userInfo = "";
	if(obj != ""){
		pageObj.memJoinInfo.userInfo = eval("(" + obj + ")");
	}
	// 약관 조회
	pageObj.LCMWC130();
};

// 멤버스 약관 조회
pageObj.LCMWC130 = function(){
	commPage("T", 'lcmwc130', "", pageObj.resultLCMWC130);
};

// 약관 조회 결과
pageObj.resultLCMWC130 = function(resultData){
	var dataList = new GridControl({"row" : resultData.PROVISION});
	for(var i = 0; i < dataList.getSize(); i++){
		dataList.get(i).idx = i;
		if(dataList.get(i).GRP_ID == "002"){
			jq("#mem_provision1").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		}else if(dataList.get(i).GRP_ID == "003"){
			jq("#mem_provision2").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		}else if(dataList.get(i).GRP_ID == "004"){
			jq("#mem_provision3").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		}
	}
	
	// 체크박스 활성화
	initCheckBox();
};

pageObj.initMemCheckBox = function(){
	jq(".check").unbind("click");
	jq(".check").bind("click", function(){
		if(jq(this).attr("class").match("check_on")) {
			if(noTouch(100)) return;
			doubleTouchChk = new Date();
			jq(this).removeClass("check_on");
			jq("#allCheck").removeClass("check_on");
			if(this.id == "mem_7" || this.id == "mem_8") jq("#mem_7, #mem_8").removeClass("check_on");
		}else {
			if(noTouch(100)) return;
			doubleTouchChk = new Date();
			jq(this).addClass("check_on");
			if(this.id == "mem_7" || this.id == "mem_8") jq("#mem_7, #mem_8").addClass("check_on");
			if(jq(".chk_check").size() == jq(".check_on").size()){
				jq("#allCheck").addClass("check_on");
			}
		}
	});
};

pageObj.next = function(){
	if(pageObj.agreeChk()){
		var str = pageObj.noCheckCert ? "[" + pageObj.noCheckCert + "] 에 동의하지 않았습니다." : "서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.";
		appAlert("알림", str, "확인");
		pageObj.noCheckCert = "";
	}else{
		commPage("P", "LCMW3152", pageObj.memJoinInfo, "L");
	}
};

pageObj.agreeChk = function(){
	var agreeChkBool = false;
	jq(".check").each(function(){
		if(this.id != "allCheck"){
			if(jq(this).attr("class").match("check_on")){
				if(this.id == "mem_2") pageObj.memJoinInfo.cltUAgChoYn	= "1";	// 수집이용동의선택여부
				if(this.id == "mem_4") pageObj.memJoinInfo.ofrAgChoYn	= "1";	// 제공동의선택여부
			}else{
				if(this.id == "mem_2") pageObj.memJoinInfo.cltUAgChoYn	= "2";	// 수집이용동의선택여부
				if(this.id == "mem_4") pageObj.memJoinInfo.ofrAgChoYn	= "2";	// 제공동의선택여부
				if(jq(this).find("input").eq(2).val() == "Y"){
					agreeChkBool = true;
					if(pageObj.noCheckCert == "") pageObj.noCheckCert = jq(this).find("input").eq(3).val().trim();
				}
			}
		}
	});
	if(jq(".check").size() < 2){
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
	}, 100);
};

pageObj.cancel = function(){
	if(pageObj.memJoinInfo.userInfo != ""){		// 회원 신규가입
		appConfirm("알림", "취소하시겠습니까?\n회원가입이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
			goMain();
		}, function(){
		});
	}else{
		appConfirm("알림", "취소하시겠습니까?\n카드발급이 취소되며, [멤버십]화면으로 이동됩니다.", "확인", "취소", function(){
			commPage("P", "LCMW3100");
		}, function(){
		});
	}
};

pageObj.cancelHome = function(){
	var tmpTxt = pageObj.memJoinInfo.userInfo != "" ? "회원가입" : "카드발급";
	appConfirm("알림", "취소하시겠습니까?\n" + tmpTxt + "이 취소되며, [메인]화면으로 이동됩니다.", "확인", "취소", function(){
		goMain();
	}, function(){
	});
};
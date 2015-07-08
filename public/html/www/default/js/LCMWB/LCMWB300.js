
/* JavaScript content from js/LCMWB/LCMWB300.js in folder common */
pageObj.pageTitle = "PUSH 알림 설정";

pageObj.pageFunction = function(obj){
	// push 알림 설정 조회
	pageObj.LCMWB300();
};

// push 알림 설정 조회
pageObj.LCMWB300 = function(){
	commPage("T", 'lcmwb300', "", pageObj.resultLCMWB300);
};

// push 알림 설정 조회 결과
pageObj.resultLCMWB300 = function(resultData){
	var dataList = new GridControl({"row" : resultData.PUSH_SET});
	var dataListProvision = new GridControl({"row" : resultData.PROVISION});
	
	for(var i = 0; i < dataList.getSize(); i++){
		dataList.get(i).GRP_ID = dataListProvision.get(i).GRP_ID;
		dataList.get(i).PRV_SEQ = dataListProvision.get(i).PRV_SEQ;
		dataList.get(i).PRV_VER_NO = dataListProvision.get(i).PRV_VER_NO;
		
		jq("#list_push").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		if(dataList.get(i).SE_V == "Y") {
			jq("#list_push li:last").find("a").eq(1).addClass("active");
		}else{
			jq("#list_push li:last").find("a").eq(2).addClass("non_active");
		}
	}
};

// push 알림 설정
pageObj.LCMWB310 = function(obj, se_dc){
	if((jq(obj).attr("class").match("active") && jq(obj).attr("class").match("on")) || (jq(obj).attr("class").match("non_active") && jq(obj).attr("class").match("off"))){
		return;
	}
	pageObj.obj = obj;
	var se_v = (jq(obj).attr("class").match("on")) ? "Y" : "N";
	
	params = {
			se_seq	: userInfo.wlt_mbr_seq,
			se_dc	: se_dc,
			se_v	: se_v
	};
	commPage("T", 'lcmwb310', params, pageObj.resultLCMWB310);
};

// 알림 설정 결과
pageObj.resultLCMWB310 = function(resultData){
	if(resultData.PUSH_SET_RESULT > 0){
//		jq("#push_" + pageObj.se_dc).toggleClass("on");
		jq(pageObj.obj).parent().find("a").eq(0).toggleClass("active");
		jq(pageObj.obj).parent().find("a").eq(1).toggleClass("non_active");
		
		if(resultData.PUSH_SET_RESULT_SV_NM == "공지성 PUSH"){
			var currDate = new Date();
			var currYear = currDate.getFullYear() ;
			var currMonth = currDate.getMonth() + 1;
			var currDate = currDate.getDate();
			var current = "롯데카드 클러치 공지성 PUSH 메시지가 ";
			
			current += currYear + "-" + currMonth + "-" + currDate;
			
			if(resultData.PUSH_SET_RESULT_SV_V == "Y"){
				current += " 수신동의 처리 되었습니다.\n수신동의 설정 시 클러치에서 발송하는 다양한 혜택 정보를 받아 보실 수 있습니다.";
			} else {
				alert("공지성 PUSH 수신거부 설정 시 스마트 영수증을 받아보실 수 없습니다.");
				current += " 수신거부 처리 되었습니다.\n법적고지 의무가 있는 필수공지사항은 수신거부와 관계 없이 발송됩니다.";
			}
			
			alert(current);
		} else if(resultData.PUSH_SET_RESULT_SV_NM == "마케팅성 PUSH"){
			var currDate = new Date();
			var currYear = currDate.getFullYear() ;
			var currMonth = currDate.getMonth() + 1;
			var currDate = currDate.getDate();
			var current = "롯데카드 클러치 마케팅성 PUSH 메시지가 ";
			
			current += currYear + "-" + currMonth + "-" + currDate;
			
			if(resultData.PUSH_SET_RESULT_SV_V == "Y")
				current += " 수신동의 처리 되었습니다.\n수신동의 설정 시 클러치에서 발송하는 다양한 혜택 정보를 받아 보실 수 있습니다.";
			else 
				current += " 수신거부 처리 되었습니다.\n법적고지 의무가 있는 필수공지사항은 수신거부와 관계 없이 발송됩니다.";
			
			alert(current);
		} 
	}else{
		appAlert("알림", "PUSH 알림 설정에 실패했습니다.\n잠시 후 다시 실행해주세요.", "확인");
	}
};

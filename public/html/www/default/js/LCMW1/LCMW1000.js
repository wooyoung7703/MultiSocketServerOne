
/* JavaScript content from js/LCMW1/LCMW1000.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.pageSize = 10;
pageObj.pageNo = 1;

// 지도 검색 (default radius : 500m, 그룹 : 전체)
pageObj.grpco_c_list = [{CODE : "", VALUE : "그룹사검색"}];
pageObj.radius = [{value : "100", text : "100m"},{value : "300", text : "300m"},{value : "500", text : "500m"}];
pageObj.default_radius = "3";
pageObj.default_location = {latitude : "37.5597133", longitude : "126.9760741"};	// default 롯데카드 본사	
pageObj.eventList = [{CODE : "", VALUE : "1"}];

pageObj.pageFunction = function(obj){

	// menu에 new 이미지 제거 후 마지막 아이디 저장
	jq("#newLCMW1000").hide();
	callNtv(null,null,"DevicePlugin","saveData",["","","","newLCMW1000", newBtn.newLCMW1000]);
    callNtv(null,null,"DevicePlugin","loadData",["","","pageObj.resultSelectEventItem","mReadEventList"]);
	// 그룹사, 이벤트 동시 조회
	pageObj.lcmw1020();

};

//그룹사, 이벤트 동시 조회
pageObj.lcmw1020 = function(){
	var params = {
			page_size	: pageObj.pageSize,
			page_no 	: pageObj.pageNo,
			grpco_c 	: ""
	};
	commPage("T", 'lcmw1020', params, pageObj.resultLCMW1020);
};

//그룹사, 이벤트 동시 조회 결과
pageObj.resultLCMW1020 = function(resultData){
	pageObj.resultLCMW1010(resultData.GRP_LIST_SET);
	pageObj.resultLCMW1000(resultData.EVN_LIST_SET);
};

// 그룹사 코드 조회 결과
pageObj.resultLCMW1010 = function(resultData){
	var dataList = new GridControl({"row" : resultData.GRP_SET});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#LCMW1_select").append("<option value='" + dataList.get(i).GRPCO_C + "'>" + dataList.get(i).GRPCO_NM + "</option>");

		// 지도 조회시 넘겨줄 data
		var tempGrpcoList = {
				CODE	: dataList.get(i).GRPCO_C,		// 그룹사 코드
				VALUE	: dataList.get(i).GRPCO_NM		// 그룹사 명
		};
		pageObj.grpco_c_list.push(tempGrpcoList);
	}
};

// 이벤트 리스트 조회
pageObj.LCMW1000 = function(){
//	busyState.hide = true;
	var params = {
			page_size	: pageObj.pageSize,
			page_no 	: pageObj.pageNo,
			grpco_c 	: jq("#LCMW1_select").val()
	};
	commPage("T", 'lcmw1000', params, pageObj.resultLCMW1000);
};

// 이벤트 리스트 조회 결과
pageObj.resultLCMW1000 = function(resultData){
	var dataList = new GridControl({"row" : resultData.EVENT_SET});
	var tmpEventWidth = jq("#event_left").width();

	for(var i = 0; i < dataList.getSize(); i++){
		dataList.get(i).TMP_EVN_SDT = dateComma(dataList.get(i).EVN_SDT);
		dataList.get(i).TMP_EVN_EDT = dateComma(dataList.get(i).EVN_EDT);
        dataList.get(i).OPEN_EVENT = "";
        if(dataList.get(i).EVN_URL != ""){
            dataList.get(i).OPEN_EVENT = "<div class=\"tc mt20\"><a onclick=\"webPage('" + dataList.get(i).EVN_URL + "');\" class=\"btn_31\">이벤트 바로가기</a></div>";
        }
        dataList.get(i).TMP_EVN_NM = dataList.get(i).EVN_NM.replace(/'/g, "\\'");
        var ratio = tmpEventWidth / dataList.get(i).MAI_IMG_SIZE_V.split("*")[0];
        var tmpEventHeight = dataList.get(i).MAI_IMG_SIZE_V.split("*")[1] * ratio;
        var str = bindData(jq("#dataTmpl").val(), dataList.get(i));
        var tmpDiv = jq("#event_left").height() <= jq("#event_right").height() ? "event_left" : "event_right";
        jq("#" + tmpDiv).append(str);
        
        jq("#img_idx" + dataList.get(i).EVN_ID).css("height", tmpEventHeight);
        
        if(dataList.get(i).EVN_ACT_CMT != "EXP")
            pageObj.addEventNew(dataList.get(i).EVN_ID);

        if(pageObj.eventList!=""){
        	for(var ii = 0; ii < Object.keys(pageObj.eventList).length; ii++){
        		var code1 = pageObj.eventList[ii].CODE;
        		var value1 = pageObj.eventList[ii].VALUE;
        		if(pageObj.eventList[ii].CODE == dataList.get(i).EVN_ID){    	       
        	        pageObj.changeBackground(dataList.get(i).EVN_ID);
        		}
        	}
        }

        if(dataList.get(i).EVN_ACT_CMT == "EXP"){
            var tmpId = "#idx" + dataList.get(i).EVN_ID;
            var str =	"<div class='event_dim' style='height:" + (jq(tmpId + " dl").height() + 2) + "px; width: " + (jq(tmpId + " dl").width() + 2) + "px;z-index:1'>";
            str +=			"<div class='event_dim_img'></div>";
            str +=		"</div>";
            str +=		"<div class='event_dim' style='height:" + (jq(tmpId + " dl").height() + 2) + "px; width: " + (jq(tmpId + " dl").width() + 2) + "px'>";
            str +=			"<div style='background:#000;width: 100%;height: 100%;opacity: 0.7;border-radius: 3px;'></div>";
            str +=		"</div>";
            jq(tmpId).prepend(str);
        }

	}

	initFullPop("fBtnPop", {
		leftBtn		: true, 
		rightBtn	: true
	});
	
	moreSetting(resultData.EVENT_SET_SIZE, pageObj.LCMW1000);
	
	if(pushInfo.code == "06" || pushInfo.code == "05"){
		pageObj.evnId = pushInfo.param;
		pushInfo.code = "";
		pushInfo.param = "";
		commEvnDetail(pageObj.evnId);
	}
	
	remocon(true);
};

//이벤트 읽음데이터 수신
pageObj.resultSelectEventItem = function(resultData){
	consoleLog("D",resultData);
	if(resultData=="0")
		return;
    pageObj.eventList = JSON.parse(resultData);

};

//이벤트에 NEW아이콘 추가
pageObj.addEventNew = function(evt_id){
    var tmpId = "#idx" + evt_id;
    var str =	"<div class='event_new' style='height:" + (jq(tmpId + " dl").height() + 2) + "px; width: " + (jq(tmpId + " dl").width() + 2) + "px;z-index:1'>";
    str +=			"<div class='event_new_img'></div>";
    str +=		"</div>";
    jq(tmpId).prepend(str);
};

pageObj.sel = function(resultData){

	var data = false;
	for(var ii = 0; ii < Object.keys(pageObj.eventList).length; ii++){
		if(pageObj.eventList[ii].CODE == resultData){
			consoleLog("D","기존에 읽은 이벤트!!!"+pageObj.eventList[ii].CODE);
			data = true;
			continue;
		}
	}
	
	consoleLog("D","여기>>>>"+Object.keys(pageObj.eventList).length);

	if(data==true||(Object.keys(pageObj.eventList).length>=1)&&data==false){
		pageObj.eventList.push({CODE : resultData, VALUE : "1"});
	    var newlist = JSON.stringify(pageObj.eventList);
	    callNtv(null,null,"DevicePlugin","saveData",["","","","mReadEventList", newlist]);
	    pageObj.changeBackground(resultData);
	}

};

pageObj.SelectData = function(resultData){
	consoleLog("D","선택 : "+resultData);

	var data = false;
	for(var ii = 0; ii < Object.keys(pageObj.eventList).length; ii++){
		if(pageObj.eventList[ii].CODE == resultData){
			data = true;
			continue;
		}
	}
	return data;
};

//NEW아이콘 숨김
pageObj.changeBackground = function(evnid){
    var tmpId = "#idx" + evnid;
    jq(tmpId+" .event_new").hide();
};
    
// 그룹사 검색
pageObj.changeGroup = function(){
	pageObj.pageNo = 1;
	unbindScroll();
	jq(window).scrollTop(0);
	jq("#event_left").html("");
	jq("#event_right").html("");
	jq("#LCMW1_select").blur();
	pageObj.LCMW1000();
};

// 위치기반 이벤트 검색
pageObj.LCMW1200 = function(){
	// 현재 위치 정보 가져오기
//	if(deviceInfo.os == "ios"){
//		appAlert("알림", "시스템 수정 중으로 조속한 시일 내에 서비스 재개하겠습니다.", "확인");
//		return;
//	}
	callNtv(null,null,"MapPlugin","myCurrentLocation",["pageObj.myLocationSuccess", pageObj.default_location]);
};

//현재 위치 정보 가져오기 결과
pageObj.myLocationSuccess = function(latitude, longitude){
	// 위치기반 이벤트 리스트 조회
	var params = {
			radius		: pageObj.radius[2].value,	// 반경 (default : 500);
			latitude	: latitude,					// 내위치 (위도)
			longitude	: longitude,				// 내위치 (경도)
			grpco_c		: "",						// 그룹코드
            		wlt_mbr_seq	: userInfo.wlt_mbr_seq,     // 멤버스회원번호
            		deviceInfo_os	: deviceInfo.os,          // 단말OS android, ios
            		deviceInfo_os_ver : deviceInfo.osVersion,// 단말OS 버전
            		login_state	: loginInfo.logined
	};
	commPage("T", "lcmw1220", params, pageObj.resultLCMW1220);
};

//위치기반 이벤트 리스트 조회 결과
pageObj.resultLCMW1220 = function(resultData){
	var data = new Array();
	if(resultData.MC_SET_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.MC_SET});
		for(var i = 0; i < dataList.getSize(); i++){
			
			var tmpData = {
					EVN_ID		: dataList.get(i).EVN_ID,									// 이벤트 ID
					EVN_EPLC	: dataList.get(i).EVN_NM,									// 이벤트 설명 내용 -> 이벤트 명
					GRPCO_C		: dataList.get(i).GRPCO_C,									// 가맹점 관계사 코드
					MC_NM		: dataList.get(i).MC_NM,									// 가맹점명
					ADDRESS		: dataList.get(i).PNADD + " " + dataList.get(i).BPSNO_ADD,	// 주소
					LTTD_V		: dataList.get(i).LTTD_V,									// 위도값
					LGTD_V		: dataList.get(i).LGTD_V									// 경도값
			};
			
			data.push(tmpData);
		}
	}
	callNtv(null,null,"MapPlugin","showMap",[pageObj.radius,pageObj.grpco_c_list,data,pageObj.default_radius,"pageObj.evnDetail"]);

};

// 지도에서 이벤트 상세 보기
pageObj.evnDetail = function(evnId){
	delay(400);
	commEvnDetail(evnId);
};

// 아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(){
	callNtv(null, null, "DevicePlugin", "selectbox", [pageObj.grpco_c_list, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	jq("#LCMW1_select").val(tmpCode);
	pageObj.pageNo = 1;
	unbindScroll();
	jq(window).scrollTop(0);
	jq("#event_left").html("");
	jq("#event_right").html("");
	jq("#iosSelect").html(tmpValue);
	
	pageObj.LCMW1000();
};
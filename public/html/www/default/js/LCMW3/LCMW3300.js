
/* JavaScript content from js/LCMW3/LCMW3300.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";

pageObj.pageFunction = function(obj){
	if(userInfo.wallet_member == "Y"){
		// 네비에 new버튼 삭제, 삭제된 시간 저장
		callNtv(null,null,"DevicePlugin","saveData",["","","","newLCMW3300",yyyymmddhh24miss(new Date())]);
		jq("#newLCMW3300").hide();
	}
	
	// 스탬프 리스트 조회
	commPage("T", "lcmw3300", "", pageObj.resultLCMW3300);
};

// 스탬프 리스트 조회 결과
pageObj.resultLCMW3300 = function(resultData){
	if(resultData.STAMP_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.STAMP});
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).EVN_SDT = dateComma(dataList.get(i).EVN_SDT);
			dataList.get(i).EVN_EDT = dateComma(dataList.get(i).EVN_EDT);
			dataList.get(i).TMP_NOW_TN = (dataList.get(i).ATTA_2TN_CT == "") ? "" : "&nbsp;&nbsp;&nbsp;(" + dataList.get(i).NOW_TN + "회차)";
			dataList.get(i).NOW_TN_CT = eval("dataList.get(i).ATTA_" + (dataList.get(i).NOW_TN == "" ? "1" : dataList.get(i).NOW_TN) + "TN_CT");
			if(dataList.get(i).PRT_TC == "G"){								// 그래프
				var tmpRate = (dataList.get(i).NOW_CT/dataList.get(i).NOW_TN_CT * 100);
				if(tmpRate > 100) tmpRate = 100;
				var tmpText = Math.floor(tmpRate) + "%"; 
				if(dataList.get(i).STMP_TC == "4"){		// 활동지수
					tmpText = "총 " + dataList.get(i).NOW_CT + "/" + dataList.get(i).NOW_TN_CT + "회";
					dataList.get(i).STMP_IMG_PH_NM = "images/img/img_activity.png";
				}
				if(dataList.get(i).END_YN == "2") tmpText = "목표달성";
				jq("#list_stamp").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
				var str =	"<span><b style='width:" + tmpRate + "%;'><img src='images/img/img_graph.png'/></b></span> " + tmpText;
				jq("#stamp_graph_" + dataList.get(i).EVN_ID).html(str);
			}else{															// 스탬프
				var imgSrc = "<img src='images/ico/ico_stamp.png'/>";
				var imgScrOn = "<img src='images/ico/ico_stamp_on.png'/>";
				if(dataList.get(i).STMP_TC == "2"){		// 교통
					imgSrc = "<img src='images/ico/ico_stamp_bus.png'/>";
					imgScrOn = "<img src='images/ico/ico_stamp_bus_on.png'/>";
					dataList.get(i).STMP_IMG_PH_NM = "images/img/img_transport.png";
				}else if(dataList.get(i).STMP_TC == "4"){
					dataList.get(i).STMP_IMG_PH_NM = "images/img/img_activity.png";
				}
				jq("#list_stamp").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
				var tmpText = dataList.get(i).NOW_CT + "/" + dataList.get(i).NOW_TN_CT + "회";
				if(dataList.get(i).END_YN == "2") tmpText = "목표달성";
				jq("#stamp_graph_" + dataList.get(i).EVN_ID).addClass("stamp_type").append(tmpText);
				for(var j = 0; j < dataList.get(i).NOW_CT; j++){
					jq("#stamp_graph_" + dataList.get(i).EVN_ID + " span").append(imgScrOn);
				}
				for(var j = 0; j < dataList.get(i).NOW_TN_CT - dataList.get(i).NOW_CT; j++){
					jq("#stamp_graph_" + dataList.get(i).EVN_ID + " span").append(imgSrc);
				}
			}
		}
	}else{
		jq("#list_stamp").html("<li class='result_blank'>현재 진행 중인 이벤트가 없습니다.</li>");
	}
	remocon(true);

};

// 스템프 상세
pageObj.stampDetail = function(evnId, stmpId, stmpTc, prtTc, tmpNowTn, nowTnCt, nowCt, bdRvLmAm){
	var params = {
			evnId		: evnId,	// 이벤트 Id
			stmpId		: stmpId,	// 스탬프 Id
			stmpTc		: stmpTc,	// 스탬프 유형 코드
			prtTc		: prtTc,	// 출력 유형 코드
			tmpNowTn	: tmpNowTn,	// 회차 표시 여부
			nowTnCt		: nowTnCt,	// 현재 회차의 달성해야할 갯수 (금액)
			nowCt		: nowCt,	// 현재 회차의 달성 갯수 (금액)
			bdRvLmAm	: bdRvLmAm	// 일별 적립제한 금액
	};
	commPage("P", "LCMW3320", params, "Y");
};
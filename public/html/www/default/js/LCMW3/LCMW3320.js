
/* JavaScript content from js/LCMW3/LCMW3320.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";

pageObj.pageFunction = function(obj){
	pageObj.stampInfo = eval("(" + obj + ")");
	
	// 스탬프 이벤트, 적립내역 통합조회
	var params = {
			evn_id	: pageObj.stampInfo.evnId,
			stmp_id	: pageObj.stampInfo.stmpId
	};
	commPage("T", "lcmw3390", params, pageObj.resultLCMW3390);
};

pageObj.resultLCMW3390 = function(resultData){
	pageObj.resultLCMW3320(resultData.STMP_EVN_SET);
	pageObj.resultLCMW3330(resultData.STMP_RV_IZ_SET);
};

// 스탬프 이벤트 상세 조회 결과
pageObj.resultLCMW3320 = function(resultData){
	pageObj.pageTitle = resultData.EVN_NM;
	setTitle();
	jq("#div_event .tit").html(resultData.EVN_NM);
	jq("#div_event small").html(dateComma(resultData.EVN_SDT) + " ~ " + dateComma(resultData.EVN_EDT));
	jq("#div_event img").attr({"src" : resultData.EVN_DTL_IMG_PH_NM, "onclick" : "viewImg('" + resultData.EVN_DTL_IMG_PH_NM + "')"});

	//바로가기 버튼 추가
	if(resultData.EVN_URL != ""){
		jq("#div_event .btn_stamp").html("<div class=\"tc mt20\"><a onclick=\"webPage('" + resultData.EVN_URL + "');\" class=\"btn_31\">이벤트 바로가기</a></div>");
	}

};

// 네비 변경
pageObj.stampDetail = function(flag){
	jq(".lcmw3220").hide();
	jq("#div_" + flag).show();
	jq("#stamp_nav a").each(function(){
		jq(this).attr("onclick").match(flag) ? jq(this).addClass("on") : jq(this).removeClass("on");
	});
};

// 스탬프 적립내역 조회 결과
pageObj.resultLCMW3330 = function(resultData){
	if(resultData.STAMP_INFO.STAMP_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.STAMP_INFO.STMP});
		var nowApyTn = "9";
		var tmpRightText = "회";
		var tmpTd = "<td>";
		for(var i = 0; i < dataList.getSize(); i++){
			if(nowApyTn != dataList.get(i).APY_TN){
				nowApyTn = dataList.get(i).APY_TN;
				dataList.get(i).TMP_APY_TN = (pageObj.stampInfo.tmpNowTn == "") ? "" : dataList.get(i).APY_TN + "회차";
				dataList.get(i).TMP_BD_RV_LM_AM = "";
				tmpTd = "<td>";
				if(pageObj.stampInfo.prtTc == "G"){			// 그래프일 경우
					tmpRightText = "원";
					tmpTd = "<td style='text-align: right;padding-right: 20px;'>";
				}
				dataList.get(i).TMP_STAMP_SIZE = "<b class='pc01'>" + 
												pageObj.stampInfo.nowCt.toCurrency() + "/" +
												(eval("dataList.get(i).ATTA_" + (dataList.get(i).APY_TN == "" ? "1" : dataList.get(i).APY_TN) + "TN_CT")).toCurrency() + 
												"</b>" + tmpRightText;
				
				if(dataList.get(i).FFR_DSB_STC == "I"){
					dataList.get(i).TMP_FFR_DSB = "진행중";
				}else if(dataList.get(i).FFR_DSB_STC == "0"){
					dataList.get(i).TMP_STAMP_SIZE = "<b class='pc01'>목표달성</b>";
					dataList.get(i).TMP_FFR_DSB = "<b class='pc01'>지급예정</b>";
				}else if(dataList.get(i).FFR_DSB_STC == "1"){
					dataList.get(i).TMP_STAMP_SIZE = "<b class='pc01'>목표달성</b>";
					dataList.get(i).TMP_FFR_DSB = dateComma(dataList.get(i).FFR_DSB_DTTI);
				}
				jq("#div_history").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
			}
			var str =	"<tr>";
			str +=			"<td class='pc02'>" + dateComma(dataList.get(i).STMP_APY_DT) + "</td>";
			if(dataList.get(i).GUBN == "1"){
				str +=		tmpTd + ("" + dataList.get(i).STMP_AQS_CT).toCurrency() + tmpRightText + "</td>";
			}else{
				str +=		tmpTd + " - " + ("" + dataList.get(i).STMP_AQS_CT).toCurrency() + tmpRightText;
				if(pageObj.stampInfo.prtTc == "G") str += "<br/>";
				str +=		" (" + dateComma(dataList.get(i).ORI_APY_DT) + ")</td>";
			}
			str +=		"</tr>";
			jq("#div_history tbody:last").append(str);
		}
	}else{
		var tmpRightText = "회";
		var tmpBdRvLmAm = "";
		if(pageObj.stampInfo.prtTc == "G"){
			tmpRightText = "원";
			tmpBdRvLmAm = "1일 적립제한 금액 : " + pageObj.stampInfo.bdRvLmAm.toCurrency() + "원";
		}
		var tmpApyTn = (pageObj.stampInfo.tmpNowTn == "") ? "" : "1회차";
		var tmpData = {
				TMP_APY_TN		: tmpApyTn,
				TMP_STAMP_SIZE	: "<b class='pc01'>0/" + ("" + pageObj.stampInfo.nowTnCt).toCurrency() + "</b>" + tmpRightText,
				TMP_FFR_DSB		: "진행중",
				TMP_BD_RV_LM_AM : tmpBdRvLmAm
		};
		jq("#div_history").append(bindData(jq("#dataTmpl").val(), tmpData));
		jq("#div_history tbody:last").append("<tr><td colspan='2' height='30px'>적립내역이 없습니다.</td></tr>");
	}
};
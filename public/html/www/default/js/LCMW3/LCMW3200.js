
/* JavaScript content from js/LCMW3/LCMW3200.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.m12MycouponLoad;

pageObj.pageFunction = function(obj){
	if(userInfo.wallet_member == "Y"){
		jq("#div_login").show();
		pageObj.cpnId = obj;
		// 스탬프 페이지를 마지막으로 본 시간 load
		callNtv(null,null,"DevicePlugin","loadData",["","","pageObj.resultNewLCMW3300","newLCMW3300"]);
	}else{
		jq("#div_logout").show();
		remocon(true);
	}
};

pageObj.resultNewLCMW3300 = function(resultData){
	setTimeout(function(){		// loadData 이후 바로 서버를 호출할 경우 로딩바가 안닫히는 버그 수정위해 0.2초간 딜레이를 준다
		pageObj.newLCMW3300 = resultData;
		// 보유쿠폰 통합 조회
		commPage("T", "lcmw2094", "", pageObj.resultLCMW2094);
	}, 200);
};

pageObj.resultLCMW2094 = function(resultData){
	pageObj.resultLCMW3310(resultData.LT_DT_SET);
	// 보유쿠폰 소팅 변경
	pageObj.pickCoupon(resultData);
};

// 보유쿠폰 소팅 변경
pageObj.pickCoupon = function(resultData){
	if(resultData.PICK_COUPON_LIST.COUPON_SET_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.PICK_COUPON_LIST.COUPON_SET});
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).CPON_STATE_CODE = "1";
			dataList.get(i).CPON_STATE = "사용가능";
			dataList.get(i).DIM = "";
			dataList.get(i).DDAY = "";
			if(dataList.get(i).CPON_TYPE == "M"){
				dataList.get(i).ORIGINAL_PRICE = dataList.get(i).ORIGINAL_PRICE.toCurrency();
				dataList.get(i).SELL_PRICE = dataList.get(i).SELL_PRICE.toCurrency();
				dataList.get(i).TMP_ORDER_DATE = dateComma(dataList.get(i).ORDER_DATE) + " " + dataList.get(i).ORDER_DATE.substr(8, 2) + ":" + dataList.get(i).ORDER_DATE.substr(10, 2);
				dataList.get(i).TMP_PERIOD_DATE = dateComma(dataList.get(i).PERIOD_DATE);
				dataList.get(i).GOODS_NAME = dataList.get(i).GOODS_NAME.replace(dataList.get(i).BRAND_NAME, "").trim();
				if(dataList.get(i).COUPON_STATUS == "R"){
//					dataList.get(i).IS_USE = (dataList.get(i).GOODS_IS_USE == "N") ? "<li style='font-weight: bold;color: #fc3d39;'><br/>본 쿠폰은 실시간 사용 처리가 되지 않습니다.<br/>쿠폰 사용 후 약 2시간 이후 사용 처리가 될 예정입니다.</li>" : "";
					if(dataList.get(i).PERIOD_DATE != ""){
						var pdYear = dataList.get(i).PERIOD_DATE.substr(0,4);
						var pdMonth = (dataList.get(i).PERIOD_DATE.substr(4,2)) - 1;
						var pdDay = dataList.get(i).PERIOD_DATE.substr(6,2);
						consoleLog("D", pdYear + " " + pdMonth + " " + pdDay);
						var dDay = Math.floor((new Date(pdYear, pdMonth, pdDay, 23, 59, 59) - new Date())/86400000);
						dataList.get(i).DDAY = "<strong class='picked_dday'>D-" + dDay + "</strong>";
					}
					jq("#list_mycoupon").append(bindData(jq("#myM12Tmpl").val(), dataList.get(i)));
					if(dataList.get(i).PERIOD_DATE == ""){
						jq("#list_mycoupon .dc_coupon_info:last").find("li").eq(3).hide();
						jq("#list_mycoupon .time_ico:last").hide();
					}
					var goodsInfo = dataList.get(i).GOODS_INFO.split("*");
					for( var j = 0; j < goodsInfo.length; j++){
						jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " ul").eq(1).append("<li><strong class='pc02'>" + goodsInfo[j] + "</li>");
					}
					jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " .members_barcord").eq(dataList.get(i).COUPON_TYPE == "MMS" ? 0 : 1).show();
					if(dataList.get(i).ORDER_DATE.substr(0, 8) >= yyyymmdd(new Date())) jq("#myM12Div_" + dataList.get(i).TR_ID + " .ico_new").show();
				}
			}else{
				dataList.get(i).FFR_AM = dataList.get(i).FFR_AM.toCurrency();
				dataList.get(i).CPON_SDT = dateComma(dataList.get(i).CPON_SDT);
				dataList.get(i).TMP_CPON_EDT = dateComma(dataList.get(i).CPON_EDT);
				dataList.get(i).TMP_CPON_APY_CND_CN = dataList.get(i).CPON_APY_CND_CN.split("<")[0];
				dataList.get(i).CMS_CPON = "none";
				dataList.get(i).MW_CPON = "none";
				(dataList.get(i).CPON_SYS_DC == "CMS") ? dataList.get(i).CMS_CPON = "block" : dataList.get(i).MW_CPON = "block";
				
                //수정데이터 추가
                if(dataList.get(i).FFR_AM == "0"){
                    //dataList.get(i).OFFER_DC = "";
                    dataList.get(i).FFR_AM = dataList.get(i).EVN_CPON_NM;
                }

				if(dataList.get(i).IS_CPON_USE != "Y" && dataList.get(i).IS_END == "N"){
					var pdYear = dataList.get(i).CPON_EDT.substr(0,4);
					var pdMonth = (dataList.get(i).CPON_EDT.substr(4,2)) - 1;
					var pdDay = dataList.get(i).CPON_EDT.substr(6,2);
					consoleLog("D", pdYear + " " + pdMonth + " " + pdDay);
					var dDay = Math.floor((new Date(pdYear, pdMonth, pdDay, 23, 59, 59) - new Date())/86400000);
					dataList.get(i).DDAY = "<strong class='picked_dday'>D-" + dDay + "</strong>";
					jq("#list_mycoupon").append(bindData(jq("#myCouponTmpl").val(), dataList.get(i)));
					if(dataList.get(i).CPON_PTIN_DTTI >= yyyymmdd(new Date())) jq("#myCpDiv_" + dataList.get(i).CPON_ID + " .ico_new").show();
				}
			}
		}
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).CPON_STATE_CODE = "2";
			dataList.get(i).CPON_STATE = "사용완료";
			dataList.get(i).DIM = "D";
			if(dataList.get(i).CPON_TYPE == "M"){
				if(dataList.get(i).COUPON_STATUS == "F"){
//					dataList.get(i).IS_USE = "";
					jq("#list_mycoupon").append(bindData(jq("#myM12Tmpl").val(), dataList.get(i)));
					if(dataList.get(i).PERIOD_DATE == ""){
						jq("#list_mycoupon .dc_coupon_info:last").find("li").eq(3).hide();
					}
					var goodsInfo = dataList.get(i).GOODS_INFO.split("*");
					for( var j = 0; j < goodsInfo.length; j++){
						jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " ul").eq(1).append("<li><strong class='pc02'>" + goodsInfo[j] + "</li>");
					}
					jq(".con:last").append("<label class='check'></label>");
					jq("#li_" + dataList.get(i).TR_ID).addClass("end");
//					jq("#myM12Div_" + dataList.get(i).TR_ID).removeAttr("class");
					jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " .members_barcord").eq(dataList.get(i).COUPON_TYPE == "MMS" ? 0 : 1).show();
//					jq("#myM12Div_" + dataList.get(i).TR_ID).find(".ico_point01").html("사용완료").show();
				}
			}else{
				if(dataList.get(i).IS_CPON_USE == "Y"){
					jq("#list_mycoupon").append(bindData(jq("#myCouponTmpl").val(), dataList.get(i)));
					jq(".con:last").append("<label class='check'></label>");
					jq("#li_" + dataList.get(i).CPON_ID).addClass("end");
					if(dataList.get(i).CD_APR_SEQ && dataList.get(i).CD_APR_SEQ != ""){
						jq("#myCpPop_" + dataList.get(i).CPON_ID).removeClass("myCouponDetail").attr("href", "javascript:pageObj.chksmartReceipt('" + dataList.get(i).CD_APR_SEQ + "', '" + dataList.get(i).APR_CNA_YN + "', '" + dataList.get(i).RCT_VD_YN + "', 'myCpPop_" + dataList.get(i).CPON_ID + "')");
					}
//					jq("#coupon_status_" + dataList.get(i).CPON_ID).html("사용완료").show();
				}
			}
		}
		
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).CPON_STATE_CODE = "3";
			dataList.get(i).CPON_STATE = "기간만료";
			if(dataList.get(i).CPON_TYPE == "M"){
				if(dataList.get(i).COUPON_STATUS != "R" && dataList.get(i).COUPON_STATUS != "F"){
//					dataList.get(i).IS_USE = "";
					jq("#list_mycoupon").append(bindData(jq("#myM12Tmpl").val(), dataList.get(i)));
					if(dataList.get(i).PERIOD_DATE == ""){
						jq("#list_mycoupon .dc_coupon_info:last").find("li").eq(3).hide();
					}
					var goodsInfo = dataList.get(i).GOODS_INFO.split("*");
					for( var j = 0; j < goodsInfo.length; j++){
						jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " ul").eq(1).append("<li><strong class='pc02'>" + goodsInfo[j] + "</li>");
					}
					jq(".con:last").append("<label class='check'></label>");
					jq("#li_" + dataList.get(i).TR_ID).addClass("end");
					jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " .members_barcord").eq(dataList.get(i).COUPON_TYPE == "MMS" ? 0 : 1).show();
//					if(dataList.get(i).COUPON_STATUS == "C"){
//						jq("#myM12Div_" + dataList.get(i).TR_ID).find(".ico_point01").html("주문취소").show();
//					}else if(dataList.get(i).COUPON_STATUS == "E"){
//						jq("#myM12Div_" + dataList.get(i).TR_ID).find(".ico_point01").html("기간만료").show();
//					}else if(dataList.get(i).COUPON_STATUS == "T"){
//						jq("#myM12Div_" + dataList.get(i).TR_ID).find(".ico_point01").html("테스트").show();
//					}else if(dataList.get(i).COUPON_STATUS == "N"){
//						jq("#myM12Div_" + dataList.get(i).TR_ID).find(".ico_point01").html("발송처리중").show();
//					}
				}
			}else{
				if(dataList.get(i).IS_CPON_USE != "Y" && dataList.get(i).IS_END == "Y"){
					jq("#list_mycoupon").append(bindData(jq("#myCouponTmpl").val(), dataList.get(i)));
					jq(".con:last").append("<label class='check'></label>");
					jq("#li_" + dataList.get(i).CPON_ID).addClass("end");
					if(dataList.get(i).CD_APR_SEQ && dataList.get(i).CD_APR_SEQ != ""){
						jq("#myCpPop_" + dataList.get(i).CPON_ID).removeClass("myCouponDetail").attr("href", "javascript:pageObj.chksmartReceipt('" + dataList.get(i).CD_APR_SEQ + "', '" + dataList.get(i).APR_CNA_YN + "', '" + dataList.get(i).RCT_VD_YN + "', 'myCpPop_" + dataList.get(i).CPON_ID + "')");
					}
//					jq("#coupon_status_" + dataList.get(i).CPON_ID).html("기간만료").show();
				}
			}
		}
		
		initFullPop("myCouponDetail", {
			btnCount	: 1
		});
		initFullPop("myM12Detail", {
			btnCount	: 1,
			btnEvent1	: "pageObj.myM12DetailOk",
			maxBright	: true
		});
		if(pageObj.cpnId){
			jq(".myM12Detail").each(function(){
				if(this.id.replace("myM12Div_", "") == pageObj.cpnId){
					jq(this).click();
				}
			});
			jq(".myCouponDetail").each(function(){
				if(this.id.replace("myCpPop_", "") == pageObj.cpnId){
					jq(this).click();
				}
			});
			pageObj.cpnId = null;
		}
		
		jq("#list_mycoupon li").size() > 0 ? jq(".my_coupon_control").show() : jq("#noCpn").show();
	}else{
		
	}
	remocon(true);
};

//스탬프 마지막 적립 일자 조회 결과
pageObj.resultLCMW3310 = function(resultData){
	// 스탬프 new 표시
	if(resultData.LT_CH_DTTI != 0 && resultData.LT_CH_DTTI > pageObj.newLCMW3300){
		jq("#newLCMW3300").show();
	}
};

//유료쿠폰 상세보기후 페이지 새로고침
pageObj.myM12DetailOk = function(){
	var m12chk = false;
	jq("#full_pop_cont .members_barcord").each(function(){
		consoleLog("D", "jq(this) : " + jq(this).css("display"));
		if(jq(this).css("display") == "block") m12chk = true;
	});
	jq(".f_pop_close").click();
	
	if(m12chk){
		setTimeout(function(){
			commPage('P', 'LCMW3200');
		}, 220);
	}
};

pageObj.btnEdit = function(flag){
	if(flag == "E"){
		jq(".list_mycoupon").addClass("remove_mode");
		jq("#btn_mode").attr("onclick", "pageObj.btnEdit('C')").html("취소");
		jq("#del_text, #btn_remove").show();
		jq("#edte_text").hide();
		jq(".my_coupon_control div").eq(0).css("width", "60%");
		jq(".list_mycoupon .check").parent().parent().attr("onclick", "pageObj.check(this)");
		jq(".myCouponDetail").unbind("click");
		jq(".myM12Detail").unbind("click");
	}else{
		jq(".list_mycoupon").removeClass("remove_mode");
		jq("#btn_mode").attr("onclick", "pageObj.btnEdit('E')").html("편집");
		jq(".list_mycoupon .check").removeClass("check_on");
		jq("#del_text, #btn_remove").hide();
		jq("#edte_text").show();
		jq(".my_coupon_control div").eq(0).css("width", "70%");
		jq(".list_mycoupon .check").parent().parent().attr("onclick", "");
		jq("#btn_all").removeClass("all");
		initFullPop("myM12Detail", {
			btnCount	: 1,
			btnEvent1	: "pageObj.myM12DetailOk"
		});
		initFullPop("myCouponDetail", {
			btnCount	: 1
		});
	}
};

pageObj.check = function(obj){
	var tmpObj = jq(obj).find(".check");
	
	if(tmpObj.attr("class").match("check_on")) {
		tmpObj.removeClass("check_on");
		jq("#btn_all").html("전체선택").attr("onclick", "pageObj.allChk(true)");
	}else {
		tmpObj.addClass("check_on");
		if(jq(".list_mycoupon .check").size() == jq(".check_on").size()){
			jq("#btn_all").html("전체해제").attr("onclick", "pageObj.allChk(false)");
		}
	}
};

pageObj.allChk = function(flag){
	if(flag){
		jq(".list_mycoupon .check").addClass("check_on");
		jq("#btn_all").html("전체해제").attr("onclick", "pageObj.allChk(false)");
	}else{
		jq(".list_mycoupon .check").removeClass("check_on");
		jq("#btn_all").html("전체선택").attr("onclick", "pageObj.allChk(true)");
	}
};

// 쿠폰 삭제
pageObj.deleteCpn = function(){
	pageObj.cpon_ids = "";
	pageObj.tr_ids = "";
	pageObj.cpnNum = 0;
	jq(".list_mycoupon .check").each(function(){
		if(jq(this).attr("class").match("check_on")){
			var tmpId = jq(this).parent().parent().attr("id");
			if(tmpId.split("_")[0] == "myCpPop"){
				if(pageObj.cpon_ids != "") pageObj.cpon_ids += "|";
				pageObj.cpon_ids += tmpId.split("_")[1];
			}else{
				if(pageObj.tr_ids != "") pageObj.tr_ids += "_";
				pageObj.tr_ids += tmpId.split("_")[1];
			}
			pageObj.cpnNum++;
		}
	});
	if(pageObj.cpon_ids == "" && pageObj.tr_ids == ""){
		appAlert("알림", "삭제하려는 쿠폰을 선택해주십시오.", "확인");
	}else{
		appConfirm("알림", pageObj.cpnNum + "개의 쿠폰을 삭제하시겠습니까?", "확인", "취소", function(){
			var params = {
					cpon_ids	: pageObj.cpon_ids,
					tr_ids		: pageObj.tr_ids
			};
			commPage("T", "lcmw2023", params, pageObj.resultLCMW2023);
		}, function(){
		});
	}
};

// 쿠폰 삭제 결과
pageObj.resultLCMW2023 = function(resultData){
	var tmpMwCnt = parseInt(resultData.DELETE_RESULT, 10);
	if(tmpMwCnt > 0){
		var tmpCponIds = pageObj.cpon_ids.split("|");
		for(var i = 0; i < tmpCponIds.length;i++){
			jq("#li_" + tmpCponIds[i]).remove();
		}
	}
	var dataList = new GridControl({"row" : resultData.M12.ITEM});
	for(var i = 0; i < dataList.getSize(); i++){
		if(dataList.get(i).STATUS_CODE == "00"){	// 성공
			jq("#li_" + dataList.get(i).TR_ID).remove();
			tmpMwCnt++;
		}
	}
	pageObj.btnEdit("C");
	if(tmpMwCnt > 0){
		if(pageObj.cpnNum == tmpMwCnt){
			appAlert("알림", tmpMwCnt + "개의 쿠폰을 삭제 했습니다.", "확인");
		}else{
			appAlert("알림", tmpMwCnt + "개의 쿠폰을 삭제하고,\n" + (pageObj.cpnNum - tmpMwCnt) + "개의 쿠폰 삭제를 실패했습니다.", "확인");
		}
	}else{
		appAlert("알림", "쿠폰 삭제에 실패했습니다.\n잠시후 다시 이용해주세요.", "확인");
	}
};

//스마트 영수증 상세 보기
pageObj.chksmartReceipt = function(cdAprSeq, aprCanYn, rctVdYn, tmpId){
	consoleLog("D", "cdAprSeq : " + cdAprSeq);
	if(jq("#btn_remove").css("display") == "none"){
		aprCanYn = (aprCanYn == "Y") ? "Y" : "N";
		pageObj.tmpId = tmpId;
		if(rctVdYn == "N"){
			pushInfo.code = "04";
			pushInfo.param = cdAprSeq;
			pushInfo.aprYn = aprCanYn;
			pushInfo.realPush = "N";
		}
		smartReceipt(cdAprSeq, aprCanYn, "LCMW3200");
	}
};

/* JavaScript content from js/LCMW3/LCMW3400.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";

pageObj.pageFunction = function(obj){
	if(userInfo.wallet_member == "Y"){
		jq("#div_login").show();
		// 바로결제 통합조회
		commPage("T", "lcmw3190", "", pageObj.resultLCMW3190);
	}else{
		jq("#div_logout").show();
		if(page_pop_card){
			jq("#pop_card").show();
		}
	}
};


// 바로결제 통합조회 결과
pageObj.resultLCMW3190 = function(resultData){
	if(resultData.APPCARD_RESULT == "error"){
		appAlert("알림","서버 접속이 지연되고 있습니다. 잠시 후 다시 실행해주세요.", "확인");
		return;
	}
	// 유료쿠폰
	var tmpCpnNum = 0;
	if(resultData.PICK_COUPON_LIST.COUPON_SET_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.PICK_COUPON_LIST.COUPON_SET});
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).COUPON_STATUS == "R"){
				tmpCpnNum++;
				dataList.get(i).SELL_PRICE = dataList.get(i).SELL_PRICE.toCurrency();
				dataList.get(i).GOODS_NAME = dataList.get(i).GOODS_NAME.replace(dataList.get(i).BRAND_NAME, "").trim();
				jq("#my_coupon").append(bindData(jq("#myM12Tmpl").val(), dataList.get(i)));
				if(dataList.get(i).ORDER_DATE.substr(0, 8) >= yyyymmdd(new Date())) jq("#myM12Div_" + dataList.get(i).TR_ID + " .ico_new").show();
			}
		}
		jq("#cpn_total").html(tmpCpnNum);
		pageObj.initFlicking(3);
	}
	if(tmpCpnNum == 0) jq("#touchSlider3").html("보유하신 할인쿠폰이 없습니다.").css({"margin-top" : "40px", "text-align" : "center"});
	// 멤버십
	var tmpMemNum = 0;
	if(resultData.MEMBERSHIP_RESULT_SET.MEMBERSHIP_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.MEMBERSHIP_RESULT_SET.MEMBERSHIP});
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).CDNO != ""){	
				tmpMemNum++;
				if(dataList.get(i).LOTTE_CCO_C == "9999"){
					dataList.get(i).CD_DTL_IMG_URL_NM = "images/img/img_tem01.png";
					dataList.get(i).CD_MAI_IMG_URL_NM = "images/img/img_tem01.png";
					dataList.get(i).MEMBERS = "";
					jq("#mem_card").append(bindData(jq("#memCardTmpl").val(), dataList.get(i)));
				}else{
					dataList.get(i).MEMBERS = "members";
					jq("#mem_card").prepend(bindData(jq("#memCardTmpl").val(), dataList.get(i)));
				}
			}
		}
		jq("#mem_card_total").html(tmpMemNum);
		pageObj.initFlicking(2);
	}
	if(tmpMemNum == 0) jq("#touchSlider2").html("등록된 카드가 없습니다.").css({"margin-top" : "40px", "text-align" : "center"});
	// 앱카드
	if(resultData.APPCARD_RESULT_SET.USER_YN == "Y"){	
		pageObj.mbr_st_dc = resultData.APPCARD_RESULT_SET.MBR_ST_DC;
		jq("#app_card_total").html(resultData.APPCARD_RESULT_SET.APPCARD_SIZE);
		var dataList = new GridControl({"row" : resultData.APPCARD_RESULT_SET.APPCARD_LIST});
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).CD_NM == "") dataList.get(i).CD_NM = "롯데카드";
			if(dataList.get(i).CD_IMG_NM == "") dataList.get(i).CD_IMG_NM = "images/img/representative_card.png";
			if(dataList.get(i).SET_YN == "Y"){
				jq("#app_card").prepend(bindData(jq("#appCardTmpl").val(), dataList.get(i)));
			}else{
				jq("#app_card").append(bindData(jq("#appCardTmpl").val(), dataList.get(i)));
			}
		}
		pageObj.initFlicking(1);
	}else{
		jq("#touchSlider1").html("등록된 카드가 없습니다.").css({"margin-top" : "40px", "text-align" : "center"});
	}
	
	pageObj.initSelect();
	if(page_pop_card){
		jq("#pop_card").show();
	}
};

// 플리킹 초기화
pageObj.initFlicking = function(flag){
	var viewCnt = flag == 3 ? 3 : 1;
	jq("#touchSlider" + flag).touchSlider({
		roll : false,
		view : viewCnt,
		btn_prev : jq("#touchSlider" + flag).parent().find(".btn_prev"),
		btn_next : jq("#touchSlider" + flag).parent().find(".btn_next"),
		initComplete : function (e) {
		},
		counter : function (e) {
			if(e.current == 1) {
				jq("#touchSlider" + flag).parent().find(".btn_prev").addClass("off");
			}else {
				jq("#touchSlider" + flag).parent().find(".btn_prev").removeClass("off");
			}
			
			if(e.current ==  e.total) {
				jq("#touchSlider" + flag).parent().find(".btn_next").addClass("off");
			}else {
				jq("#touchSlider" + flag).parent().find(".btn_next").removeClass("off");
			}
		}
	});
};

pageObj.initSelect = function(){
	jq(".app_card_radio").click(function(){
		if(pageObj.mbr_st_dc == "L"){
			appConfirm("알림", "앱카드(간편결제) 계정이 잠겨 있습니다. 앱카드(간편결제) 앱을 통해 고객 인증후 사용이 가능합니다. 앱카드(간편결제)로 이동하시겠습니까?", "확인", "취소", function(){
				familyApp('롯데앱카드', 'com.lcacApp', 'lotteappcard://', 'http://itunes.apple.com/kr/app/losde-aebkadeu/id688047200?mt=8');
			}, function(){
			});
		}else{
			var tmpId = jq(this).find(".check").attr("id"); 
			var tmpAppNum = 0;
			jq(".app_card_radio").each(function(){
				if(jq(this).find(".check").attr("id") == tmpId){
					jq(this).find(".check").toggleClass("card_check_on");
					if(jq(this).find(".check").attr("class").match("card_check_on")){
						jq(this).find(".app_card_class").css("display", "block");
						tmpAppNum = 1;
					}else{
						jq(this).find(".app_card_class").hide();
					}
				}else{
					jq(this).find(".check").removeClass("card_check_on");
					jq(this).find(".app_card_class").hide();
				}
						
//				if(jq(this).find(".check").attr("class").match("card_check_on")) 
			});
			jq("#app_card_chk").html(tmpAppNum);
			if(tmpAppNum > 0){
				jq(".members").removeClass("card_check_on").hide();
			}
			var tmpMemNum = 0;
			jq(".card_cpn_check").each(function(){
				if(jq(this).find(".check").attr("class").match("card_check_on")){
					if(jq(this).find(".check").attr("id").charAt(0) == "m"){
						tmpMemNum++;
					}
				}
			});
			jq("#mem_card_chk").html(tmpMemNum);
		}
	});
	
	jq(".card_cpn_check").click(function(){
		if(jq("#app_card_chk").html() > 0 && jq(this).find("label").attr("class").match("members")){
			appAlert("알림", "앱카드(간편결제) 결제시 롯데 멤버십 카드는 선택할 수 없습니다.", "확인");
			return;
		}
		var tmpClass = jq(this).attr("class").match("coupon") ? "cpon_check_on" : "card_check_on";
		jq(this).find(".check").toggleClass(tmpClass);
		if(jq(this).find(".check").attr("class").match(tmpClass)){
			jq(this).find(".mem_card_class, .cpn_class").css("display", "block");
		}else{
			jq(this).find(".mem_card_class, .cpn_class").hide();
		}
		
		var tmpMemNum = 0;
		var tmpCpnNum = 0;
		jq(".card_cpn_check").each(function(){
			if(jq(this).find(".check").attr("class").match("cpon_check_on")){
				tmpCpnNum++;
			}else if(jq(this).find(".check").attr("class").match("card_check_on")){
				tmpMemNum++;
			}
		});
		jq("#mem_card_chk").html(tmpMemNum);
		jq("#cpn_chk").html(tmpCpnNum);
	});
};

pageObj.LCMW3410 = function(){
	var rpl_cdno = jq(".app_label[class*=on]").attr("id");
	var mem_list = "";
	var cpn_list = "";
	jq(".card_cpn_check").each(function(){
		var tmpIdSplit = jq(this).find(".check").attr("id").split("_");
		if(tmpIdSplit[0] == "mem" && jq(this).find(".check").attr("class").match("card_check_on")){
			if(mem_list != "") mem_list += "|";
			mem_list += jq("#input_" + jq(this).find(".check").attr("id")).val();
		}
		if(tmpIdSplit[0] == "coupon" && jq(this).find(".check").attr("class").match("cpon_check_on")){
			if(cpn_list != "") cpn_list += "|";
			cpn_list += jq("#input_" + jq(this).find(".check").attr("id")).val();
		}
	});
	if(!rpl_cdno && mem_list == "" && cpn_list == ""){
		appAlert("알림", "선택된 항목이 없습니다.", "확인");
	}else{
		if(rpl_cdno){		// 결제 카드가 있을 경우
			var params = {
					rpl_cdno	: rpl_cdno.split("_")[1],
					mem_list	: mem_list,
					cpn_list	: cpn_list
			};
			commPage("P", "LCMW3410", params, "Y");
		}else{				// 결제 카드가 없을 경우
			var params = {
					rpl_cdno	: "",
					mem_list	: mem_list,
					cpn_list	: cpn_list
			};
			consoleLog("D", "params : " + JSON.stringify(params));
			commPage("P", "LCMW3420", params, "Y");
		}
	}
};
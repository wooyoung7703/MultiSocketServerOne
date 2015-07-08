
/* JavaScript content from js/LCMW0/LCMW0000.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.popupEventSet = {POPUP_EVENT_SIZE : "0"}; 
pageObj.popupType = 2;//이벤트 보여지는 형식 1:화상표만 2:화살표+포인트 3:기존
pageObj.pageFunction = function(obj){
	jq("#cleanBg").show();
	if(deviceInfo.winHeight < 480){
		jq(".main_wrap").addClass("main_wrap_ios");
		jq(".main_wrap_ios").removeClass("main_wrap").height(jq(window).height() - 44);
	}else{
		jq(".main_wrap").height(jq(window).height() - 44);
	}
	// device 정보 native 호출
	if(appFirst){
		closeIntro();
		callNtv(null, null, "DevicePlugin", "deviceInfo", ["deviceInfoResult", deviceInfo.sharePref]);
	}else{
		// 팝업이벤트 
		pageObj.LCMW0100();
	}
};

pageObj.LCMW0100 = function(){
	jq("#cleanBg").hide();
	if(pushInfo.code != "" && loginInfo.logined == "Y"){		// 푸쉬를 통해 진입
		if(pushInfo.code == "04"){						// 스마트 영수증
			smartReceipt(pushInfo.param, pushInfo.aprYn, "LCMW0000");
		}
	}else{
		if(!popReview.match("LCMW0100") && yyyymmdd(new Date()) > newBtn.LCMW0100){
			popReview += "LCMW0100,";
			pageObj.resultLCMW0100(pageObj.popupEventSet);
		}
	}
};

//이벤트 팝업 조회 결과
pageObj.resultLCMW0100 = function(resultData){ 
	pageObj.popup_event_size = resultData.POPUP_EVENT_SIZE; 
	if(resultData.POPUP_EVENT_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.POPUP_EVENT});
		
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).EVN_SDT = dateComma(dataList.get(i).EVN_SDT);
			dataList.get(i).EVN_EDT = dateComma(dataList.get(i).EVN_EDT);
			dataList.get(i).TMP_EVN_NM = dataList.get(i).EVN_NM.replace(/'/g, "\\'");
			dataList.get(i).OPEN_EVENT = "";
			if(dataList.get(i).EVN_URL != ""){
				dataList.get(i).OPEN_EVENT = "<div class=\"tc mt20\"><a onclick=\"webPage('" + dataList.get(i).EVN_URL + "');\" class=\"btn_31\">이벤트 바로가기</a></div>";
			}
			jq("#event_pop_list").append(bindData(jq("#eventPopTmpl").val(), dataList.get(i)));
		}
		pageObj.eventPopup();
	}
};

//이벤트 팝업 보기
pageObj.eventPopup = function(){
	if(deviceInfo.os == "android" && deviceInfo.osVersion.charAt(0) == "2"){
		jq("select").attr("disabled", "disabled");
	}
	jq(".wrap_pop_event, .popBg").show();
	popEventState = true;
	if(pageObj.popup_event_size > 1){
		pageObj.initFlicking();
	}else{
		jq(".img_list, .event_pop_img").height(jq(".event_pop_img").width());
		jq(".wrap_pop_event").css("top", (deviceInfo.winHeight - jq(".event_pop_img").width() - 85)/2);
		jq(window).bind("touchmove", function(){return false;});
		initCheckBox();
	}
	
	jq(".btn_area").css("height","55px");
	var top = 4;
	if(pageObj.popup_event_size > 1){
		jq(".btn_area").css("height","70px");
	}else{
		top = 2;
	}
	if(userInfo.wallet_member!="Y"){//월렛회원이 아니면 회원가입 버튼 추가
		//jq(".wrap_pop_event").css("top", (deviceInfo.winHeight - jq(".event_pop_img").width() - 100)/2);
		jq(".wrap_pop_event").css("top", (deviceInfo.winHeight - jq(".event_pop_img").width() - 85)/2-10);
		jq("#event_paging").append('<div id="members" onclick="pageObj.membersClick();" style="margin-top: '+top+'px;margin-left: -87px;position: absolute;background-image: url(images/bg/btn_dg_125_n.png);background-size: 175px 30px;font-size: 13px;height: 30px;width: 176px;line-height: 30px;background-repeat: no-repeat;color: white;left: 50%;"><h1>롯데카드클러치 회원가입</h1></div>');
	}else{
		jq(".btn_area").css("height","40px");
		jq(".wrap_pop_event").css("top", (deviceInfo.winHeight - jq(".event_pop_img").width() - 85)/2-10);
	}
	
};

pageObj.membersClick = function() {

	joinMember();
	
};

//팝업 플리킹
pageObj.initFlicking = function() {
	pageObj.popTouchSlider = jq(".img_list").touchSlider({
		roll : false,
		flexible : true,
		initComplete : function (e) {
			jq("#event_paging").html("");
			var num = 1;
			jq(".event_pop_li").each(function (i, el) {
				if((i+1) % e._view == 0) {
					if(i == 0) {
						jq("#event_paging").append('<button type="button" class="btn_page on">page' + (num++) + '</button>');
					}else {
						jq("#event_paging").append('<button type="button" class="btn_page">page' + (num++) + '</button>');
					}
				}
			});
			jq("#event_paging .btn_page").bind("click", function (e) {
				var i = jq(this).index();
				jq(".img_list").get(0).go_page(i);
			});
/*			if(pageObj.popupType==3){//기존
				jq("#event_paging").html("");
				var num = 1;
				jq(".event_pop_li").each(function (i, el) {
					if((i+1) % e._view == 0) {
						if(i == 0) {
							jq("#event_paging").append('<button type="button" class="btn_page on">page' + (num++) + '</button>');
						}else {
							jq("#event_paging").append('<button type="button" class="btn_page">page' + (num++) + '</button>');
						}
					}
				});
				jq("#event_paging .btn_page").bind("click", function (e) {
					var i = jq(this).index();
					jq(".img_list").get(0).go_page(i);
				});
			}else if(pageObj.popupType==2){//화살표+포인트
				jq("#event_paging").html("");
				var num = 1;
				jq(".event_pop_li").each(function (i, el) {
					if((i+1) % e._view == 0) {
						if(i == 0) {
							jq("#event_paging").append('<button type="button" class="left"></button>');
							jq("#event_paging").append('<button type="button" class="btn_page on">page' + (num++) + '</button>');
						}else {
							jq("#event_paging").append('<button type="button" class="btn_page">page' + (num++) + '</button>');
							if(pageObj.popup_event_size-1==i)
								jq("#event_paging").append('<button type="button" class="right on"></button>');
						}
					}
				});
				jq("#event_paging .btn_page").bind("click", function (e) {
					var i = jq(this).index();
					jq(".img_list").get(0).go_page(i);
				});
			}else if(pageObj.popupType==1){//화살표
				jq("#event_paging").html("");
				jq("#event_paging").append('<button type="button" class="left"></button>');
				jq("#event_paging .left").css("margin-right","-12px");
				jq("#event_paging").append('<button type="button" class="center on"></button>');
				jq("#event_paging .center").css("margin-right","-12px");
				jq("#event_paging").append('<button type="button" class="right"></button>');
				jq("#event_paging .right").css("margin-right","-12px");
				jq("#event_paging .btn_page").bind("click", function (e) {
					var i = jq(this).index();
					jq(".img_list").get(0).go_page(i);
				});
			}
*/		},
		counter : function (e) {
			jq("#event_paging .btn_page").removeClass("on").eq(e.current-1).addClass("on");
/*			if(pageObj.popupType==3){
				jq("#event_paging .btn_page").removeClass("on").eq(e.current-1).addClass("on");
			}else if(pageObj.popupType==2){
				
				jq("#event_paging .btn_page").removeClass("on").eq(e.current-1).addClass("on");
				if(e.current==1){
					jq("#event_paging .left").removeClass("on");
					jq("#event_paging .right").removeClass("on").addClass("on");
				}
				if(e.current>=2){
					jq("#event_paging .left").removeClass("on").addClass("on");
					jq("#event_paging .right").removeClass("on").addClass("on");
				}
				if(e.current==pageObj.popup_event_size){
					jq("#event_paging .right").removeClass("on");
					jq("#event_paging .left").removeClass("on").addClass("on");
				}
			}else if(pageObj.popupType==1){
				if(e.current==1){
					jq("#event_paging .center").removeClass("on").addClass("on");
					jq("#event_paging .right").removeClass("on");
					jq("#event_paging .left").removeClass("on");
					jq("#event_paging .center").css('background-image','url("images/btn/btn_slide_right.png")');
				}
				if(e.current>=2){
					jq("#event_paging .left").removeClass("on").addClass("on");
					jq("#event_paging .right").removeClass("on").addClass("on");
					jq("#event_paging .center").removeClass("on");
				}
				if(e.current==pageObj.popup_event_size){
					jq("#event_paging .right").removeClass("on");
					jq("#event_paging .left").removeClass("on");
					jq("#event_paging .center").css('background-image','url("images/btn/btn_slide_left.png")');
					jq("#event_paging .center").removeClass("on").addClass("on");
				}
			}
*/		}
	});
	jq(".img_list, .event_pop_img").height(jq(".event_pop_img").width());
	jq(".wrap_pop_event").css("top", (deviceInfo.winHeight - jq(".event_pop_img").width() - 85)/2);
	jq(window).bind("touchmove", function(){return false;});
	initCheckBox();
};

// 이벤트 팝업 닫기
pageObj.closePop = function(){
	if(jq("#eventPopLabel").attr("class").match("on")){		// 1일동안 다시보지 않기
		callNtv(null,null,"DevicePlugin","saveData",["","","","LCMW0100",yyyymmdd(new Date())]);
	}
	popEventState = false;
	jq(".wrap_pop_event, .popBg").hide();
	jq(window).unbind("touchmove");
	if(deviceInfo.os == "android" && deviceInfo.osVersion.charAt(0) == "2"){
		jq("select").removeAttr("disabled");
	}
};

//팝업 이벤트 상세보기
pageObj.popEvent = function(evn_id){
	jq("#event_pop_list li").removeClass("eBtnPop");
	jq("#" + evn_id).addClass("eBtnPop");
	
	initFullPop("eBtnPop", {
		leftBtn		: true
	});
	jq(".wrap_pop_event, .popBg, #modalBg").hide();
	jq(window).unbind("touchmove");
};

// 회원정보 로딩 이후 페이지 이동이 가능하게 하기 위해
pageObj.mainPage = function(flag, url){
	if(!appFirst){
		commPage(flag, url);
	}
};
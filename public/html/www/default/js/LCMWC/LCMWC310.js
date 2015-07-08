
/* JavaScript content from js/LCMWC/LCMWC310.js in folder common */
pageObj.pageTitle = "가입완료";
pageObj.type = "";
pageObj.cpon_id = "";
pageObj.cpon_name = "";
pageObj.obj = "";
pageObj.pageFunction = function(obj){
    adobeLogSet("LCMWC310");
    pageObj.obj = obj;
    jq("#leftBtn, #rightBtn").hide();
    if(mOfferData.WELCOME_OFFER_YN=="Y"){
        jq("#main").show();
    }else{
        jq("#join"+obj).show();
    }
    
    if(userInfo.ccd_mbyn == "Y") page_pop_card = false;
    loginInfo.autoLogin = "Y";
    callNtv(null, null, "DevicePlugin", "saveData", ["","","","autoLogin","Y"]);
    callNtv(null, null, "DevicePlugin", "saveData", ["","","","wallet_member","Y"]);
    
    if(mOfferData.WELCOME_OFFER_YN=="Y"){
    	if(mOfferData.M12_WELCOME_INFO!=""||mOfferData.LOTTE_WELCOME_INFO!=""){
        	var num = 0;
            jq("#smart_help").css("display","none");
            jq("#smart_img").css("display","none");
            jq("#offer_btn").show();
            jq("#new_offer").show();
            jq("#join").find(".btn_31").css({"display":"none"});
            jq("#join" + obj).css("display","none");
    		//신규가입오퍼  fffffsssssssssssssssssss               sssssssssssssssssssss
    		if(mOfferData.LOTTE_WELCOME_INFO.row!=undefined||mOfferData.LOTTE_WELCOME_INFO.row!=null){
        		var dataList = new GridControl({"row" : mOfferData.LOTTE_WELCOME_INFO.row});
            	for(var i = 0; i < dataList.getSize(); i++){
                	num = i+1;
                	jq("#offer_list").append('<li id=L'+i+'><div id=LOTTE_'+i+' class="image"><img src='+"images/img/lotte_banner"+i+'.png'+'></div></li>');	
//                	jq("#offer_list").append('<li id=L'+i+'><div id=LOTTE_'+i+' class="image"><img src='+dataList.get(i).CPON_DTL_IMG_PH_NM+'></div></li>');	
                  	jq("#offer_list").find("#LOTTE_"+i).append('<div id="offer_label"><img src="images/img/offer_label.png"></img><strong>선택 '+num+'</strong><div class="offer_check" data-name="check_dc" data-value="F" onclick="pageObj.chkOffer(this,'+"'" +1+"'"+","+"'" +dataList.get(i).CPON_ID+"'"+');"></div></div>');
                }
    		}
    		//m12신규가입오퍼
    		if(mOfferData.M12_WELCOME_INFO.M12.ITEM!=undefined||mOfferData.M12_WELCOME_INFO.M12.ITEM!=null){
        		var m12List = new GridControl({"row" : mOfferData.M12_WELCOME_INFO.M12.ITEM});
                for(var i = 0; i < m12List.getSize(); i++){
                	num = num+1;
                	jq("#offer_list").append('<li id=M'+i+'><div id=M12_'+i+' class="image"><img src='+"images/img/m12_banner"+i+'.png'+'></div></li>');	
//                	jq("#offer_list").append('<li id=M'+i+'><div id=M12_'+i+' class="image"><img src='+m12List.get(i).GOODS_IMAGE+'></div></li>');
                  	jq("#offer_list").find("#M12_"+i).append('<div id="offer_label"><img src="images/img/offer_label.png"></img><strong>선택 '+num+'</strong><div class="offer_check" data-name="check_dc" data-value="F" onclick="pageObj.chkOffer(this,'+"'" +2+"'"+","+"'" +m12List.get(i).GOODS_CODE+"'"+","+"'" +m12List.get(i).GOODS_NAME+"'"+');"></div></div>');
                }
    		}
            pageObj.initOfferCheckBox();
    	}
    }

};

//라디오 박스 초기화
pageObj.initOfferCheckBox = function(){

	jq(".offer_check").unbind("click");
	jq(".offer_check").bind("click", function(){
		jq(".offer_check").removeClass("offer_check_on");
		jq(this).addClass("offer_check_on");
	});
};

pageObj.chkOffer = function(obj,type, cpon_id, cpon_name){
//	if(jq(obj).attr("class").match("on")){
//	}else{
	jq(".offer_check").removeClass("offer_check_on");
	jq(obj).addClass("offer_check_on");
	pageObj.type = type;
	pageObj.cpon_id = cpon_id;
	pageObj.cpon_name = cpon_name;
//	}
};

pageObj.resultLCMW3000 = function(resultData){
    
	if(resultData.USER_YN == "N"){
        var URL = (stateDev) ? "http://10.25.5.102:9091" : "https://evt.lottecard.co.kr";
        URL = URL + "/get_mobile_image.jp?input=CLU";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", URL, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var objJson = eval("(" + xhr.responseText + ")");
                if(objJson.stat=="Y"){
                    //Y일경우 이벤트 팝업 띄움.
                    jq("#eventPop, .popBg").show();
                    var rate = (deviceInfo.winWidth / deviceInfo.winHeight) * 1.1;
                    jq("#eventPop").css({height : (rate * 100) + "%", top : ((1 - rate)/2 * 100) + "%"});
                    jq("#eventImgView").attr("src",objJson.url);
                    jq(window).bind("touchmove", function(){return false;});
                }else{
            		jq(window).unbind("touchmove");
            	    if(userInfo.first_join){
            	        commPage("P", "LCMW2000");
            	    }else{
            	        goMain();
            	    }
                }
            }
        };
        setTimeout(function(){
        	xhr.abort();
	        goMain();
        },3000);
	}
};

pageObj.offerOk = function(){
	if(pageObj.type==""||pageObj.cpon_id==""){
		appAlertOne("알림", "선택하신 쿠폰이 없습니다.\n쿠폰을 선택하여 주시기 바랍니다.", "확인", function(){
		});
		return;
	}
	appConfirm("알림", "선택이 완료되었습니다.\n확인버튼 클릭 시 변경이 불가합니다.\n*쿠폰(도시락 교환권)의 경우 상품\n발송을 위해 (주)엠트웰브에게\n고객님의 휴대전화번호가 제공됩니다.\n계속 하시겠습니까?", "확인", "취소", function(){
		if(pageObj.type=="1"){
			var params = {
					cpon_id	: pageObj.cpon_id
				};
			commPage("T", "lcmw2099", params, pageObj.result);
		}else{
			var params = {
					PD_CD	: pageObj.cpon_id,
					PD_NM	: pageObj.cpon_name
				};
			commPage("T", "lcmw2098", params, pageObj.result);
		}
	}, function(){
	});
};

pageObj.result = function(resultData){

	var msg = resultData.RESULT_MSG;
	if(resultData.RESULT_CODE=="success"){
		appAlertOne("알림", "선물이 발송되었습니다.\n지급된 포인트 또는 발송된 쿠폰\n(도시락 교환권)은 My-wallet\n메뉴에서 확인 가능합니다.", "확인", function(){
		    // 카드회원이면서 클러치 최초 가입시 앱카드 회원여부 조회
			if(pageObj.obj!=""){
				if(pageObj.obj=="sms"){
					jq("#smart_help").css("display","block");
		            jq("#smart_img").css("display","block");
				}
	            jq("#main").css({"display":"none"});
	            jq("#offer_btn").css({"display":"none"});
	            jq("#new_offer").css({"display":"none"});
	            jq("#join" + "").css({"display":"none"});
	            jq("#join").find(".btn_31").css({"display":"block"});
	            jq("#join" + pageObj.obj).show();
			}else{
	            jq("#main").css({"display":"none"});
	            jq("#offer_btn").css({"display":"none"});
	            jq("#new_offer").css({"display":"none"});
				jq("#smart_help").css("display","block");
	            jq("#smart_img").css("display","block");
	            jq("#join").find(".btn_31").css({"display":"block"});
	            jq("#join").css({"display":"block"});
	            jq("#join").show();
		        commPage("T", "lcmw3000", "", pageObj.resultLCMW3000);
			}
		});
	}else{
		appAlertOne("알림", msg, "확인", function(){
			if(pageObj.obj!=""){
				if(pageObj.obj=="sms"){
					jq("#smart_help").css("display","block");
		            jq("#smart_img").css("display","block");
				}
	            jq("#main").css({"display":"none"});
	            jq("#offer_btn").css({"display":"none"});
	            jq("#new_offer").css({"display":"none"});
	            jq("#join" + "").css({"display":"none"});
	            jq("#join").find(".btn_31").css({"display":"block"});
	            jq("#join" + pageObj.obj).show();
			}else{
	            jq("#main").css({"display":"none"});
	            jq("#offer_btn").css({"display":"none"});
	            jq("#new_offer").css({"display":"none"});
				jq("#smart_help").css("display","block");
	            jq("#smart_img").css("display","block");
	            jq("#join").find(".btn_31").css({"display":"block"});
	            jq("#join").css({"display":"block"});
	            jq("#join").show();
		        commPage("T", "lcmw3000", "", pageObj.resultLCMW3000);
			}
		});
	}

};

pageObj.pagecancel = function(){
  jq(window).unbind("touchmove");
  if(userInfo.first_join){
      commPage("P", "LCMW2000");
  }else{
      goMain();
  }
};

pageObj.goMain = function(){
	jq(window).unbind("touchmove");
    if(userInfo.first_join){
        commPage("P", "LCMW2000");
    }else{
        goMain();
    }
};

pageObj.cancel = function(){
//  jq(window).unbind("touchmove");
//  if(userInfo.first_join){
//      commPage("P", "LCMW2000");
//  }else{
//      goMain();
//  }
};

pageObj.eventPop = function(flag){
    jq("#eventPop, .popBg").hide();
    jq("#eventFrame").hide();
    jq(window).unbind("touchmove");
    if(flag){
        var tmpDomain = (stateDev) ? "http://10.25.5.102:9091" : "https://evt.lottecard.co.kr";
        var logEvtUrl = tmpDomain + "/joinAppcEventResult.jp?input=ad_clut";
        var appEvtUrl = (deviceInfo.os == "android") ? "market://details?id=com.lcacApp" : "https://itunes.apple.com/kr/app/id688047200";
        jq("#eventFrame").attr("src", logEvtUrl);
        WL.App.openURL(logEvtUrl, "_blank");
    }
};
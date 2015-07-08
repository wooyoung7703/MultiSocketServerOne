
/* JavaScript content from js/LCMW2/LCMW2000.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.myCouponScroll;
pageObj.selGroup = "";
pageObj.listGroup = [{CODE : "", VALUE : "검색"}];

pageObj.pageFunction = function(obj){
	busyState.hide = false;

	// 보유쿠폰 영역 UI 설정
	jq("#iscroll").css({"top" : jq(".figure img").height(), "width" : jq(".have_coupon").width()});
	jq(".have_inner").height(jq(".have_coupon").height());
	
	// 유료쿠폰 리스트 조회 - 앱 최초 실행시 m12CouponList에 결과 값을 담아 둔다 
	(m12CouponList && m12CouponList.M12.GOODS_TOTAL_COUNT > 0) ? pageObj.resultLCMW2040(m12CouponList) : pageObj.LCMW2040();
};

// 유료쿠폰 리스트 조회
pageObj.LCMW2040 = function(){
	commPage("T", "lcmw2040", "", pageObj.resultLCMW2040);
};

//유료쿠폰 리스트, 이벤트 팝업 조회 결과
pageObj.resultLCMW2096 = function(resultData){
	pageObj.popupEventSet = resultData.POPUP_EVENT_SET;
	pageObj.resultLCMW2040(resultData.M12_USR_CPON_LIST); 
};

// 유료쿠폰 리스트 조회 결과
pageObj.resultLCMW2040 = function(resultData){
	m12CouponList = resultData; 
	if(loginInfo.logined == "Y"){		// 사용자 로그인시 
		// 그룹사, 알뜰쿠폰, 보유쿠폰 통합 조회
		commPage("T", "lcmw2079", "", pageObj.resultLCMW2079);
	}else{								// 사용자가 비로그인시
		// 유료쿠폰만 노출
		pageObj.m12CouponLoad();
		// 비어있는 보유쿠폰 노출
		jq("#myCoupon").html('<li class="blank"><div class="coupon cp_blank"><div></div></div></li>');
		// 이벤트 팝업 
		pageObj.afterLoad();
	}
};

// 유료쿠폰 리스트
pageObj.m12CouponLoad = function(){
	if(m12CouponList.M12.GOODS_TOTAL_COUNT > 0){
		var m12List = new GridControl({"row" : m12CouponList.M12.ITEM});
		for(var j = 0; j < m12List.getSize(); j++){
			
			var tmpGroupNm = m12List.get(j).BRAND_NAME.replace(/(\s*)/g, "");
			if(pageObj.selGroup == "" || pageObj.selGroup == tmpGroupNm){
				var listFlag = true;
				for(var k = 0;k < pageObj.listGroup.length;k++){
					if(pageObj.listGroup[k].CODE == tmpGroupNm) listFlag = false;
				}
				if(listFlag){
					tmpGroupNm = {
							CODE	: tmpGroupNm,
							VALUE	: tmpGroupNm
					};
					pageObj.listGroup.push(tmpGroupNm);
				}
				
				m12List.get(j).SALE = Math.round((m12List.get(j).ORIGINAL_PRICE - m12List.get(j).SELL_PRICE) / m12List.get(j).ORIGINAL_PRICE * 100);
				m12List.get(j).SELL_PRICE_C = m12List.get(j).SELL_PRICE.toCurrency();
				m12List.get(j).ORIGINAL_PRICE_C = m12List.get(j).ORIGINAL_PRICE.toCurrency();
				m12List.get(j).GOODS_NAME = m12List.get(j).GOODS_NAME.replace(m12List.get(j).BRAND_NAME, "").trim();
				if(deviceInfo.os == "windows") m12List.get(j).BRAND_LOGO = "images/img/b_cp01.png";
				m12List.get(j).ARR_LABEL = m12List.get(j).FIRST_YN == "Y" ? "<img src='images/ico/ico_order.png' style='width: 35%;position: absolute;z-index: 1;'>" : "";
				var m12Str = bindData(jq("#m12Tmpl").val(), m12List.get(j));
				jq("#main_coupon_list").append(m12Str);
			}
		}
		pageObj.initPopup();
	}
	remocon(true);
};

// 그룹사 코드
pageObj.loadLCMW2030 = function(){
	for(var k = 0;k < pageObj.listGroup.length;k++){
		jq("#grp_select").append("<option value='" + pageObj.listGroup[k].CODE + "'>" + pageObj.listGroup[k].VALUE + "</option>");
	}
};

// 알뜰쿠폰 리스트
pageObj.loadLCMW2000 = function(resultData){
	if(resultData.COUPON_SET_SIZE > 0){
		pageObj.couponList = resultData.COUPON_SET;
		var dataList = new GridControl({"row" : resultData.COUPON_SET});
		for(var i = 0; i < dataList.getSize(); i++){
			var tmpGroupNm = dataList.get(i).GRPCO_C_NM.replace(/(\s*)/g, "");
			if(pageObj.selGroup == "" || pageObj.selGroup == tmpGroupNm){
				var listFlag = true;
				for(var k = 0;k < pageObj.listGroup.length;k++){
					if(pageObj.listGroup[k].CODE == tmpGroupNm) listFlag = false;
				}
				if(listFlag){
					tmpGroupNm = {
							CODE	: tmpGroupNm,
							VALUE	: tmpGroupNm
					};
					pageObj.listGroup.push(tmpGroupNm);
				}
				
				dataList.get(i).FFR_AM = dataList.get(i).FFR_AM.toCurrency();
				var str = "";
				dataList.get(i).TMP_CPON_EDT = dateCommaYymmdd(dataList.get(i).CPON_EDT);
				dataList.get(i).OFFER_DC = dataList.get(i).FFR_TP_DC == "P" ? "P" : "원";

                if(dataList.get(i).FFR_AM == "0"){
                    dataList.get(i).OFFER_DC = "";
                    dataList.get(i).FFR_AM = dataList.get(i).EVN_CPON_NM;
                }
                
                dataList.get(i).CMS_CPON = "none";
				dataList.get(i).MW_CPON = "none";
				(dataList.get(i).CPON_SYS_DC == "CMS") ? dataList.get(i).CMS_CPON = "block" : dataList.get(i).MW_CPON = "block";
				if(dataList.get(i).CPON_PICK_YN == "Y"){
					str = bindData(jq("#mainCouponPickTmpl").val(), dataList.get(i));
				}else{
					str = bindData(jq("#mainCouponTmpl").val(), dataList.get(i));
				}
				
				jq("#main_coupon_list").append(str);

                //0p일경우 CSS수정
                if(dataList.get(i).FFR_AM.toCurrency() == 0){
	                jq("#mainCp_" + dataList.get(i).CPON_ID+" strong").addClass("coupon_nopoint");
                }

				if(dataList.get(i).FFR_TP_DC == "P"){
					jq("#main_cp_div" + dataList.get(i).CPON_ID).addClass("point_cp");
				}else{
					jq("#main_cp_div" + dataList.get(i).CPON_ID).addClass("cash_cp");
				}
			}
		}
	}
	pageObj.initPopup();
};

// 유료쿠폰 상세보기후 페이지 새로고침
pageObj.myM12DetailOk = function(){
	jq(".f_pop_close").click();
	setTimeout(function(){
		commPage('P', 'LCMW2000');
	}, 220);
};

// 메인화면 팝업 초기화
pageObj.initPopup = function(){
	initFullPop("mainCouponDetail", {
		btnCount	: 2,
		btnText1	: "담기",
		btnText2	: "나중에 담기",
		btnEvent1	: "pageObj.popAddCoupon",
		param		: true
	});
	initFullPop("mainCouponDetailPick", {
		btnCount	: 1
	});
};

// - 최초 가입자는 웰컴 쿠폰을 띄어준다
pageObj.afterLoad = function(){
	// 그룹사 코드 정리
	pageObj.loadLCMW2030();
	busyState.hide = true;
	tran.hideBusy();
	remocon(true);
	
	// 최초 가입자 웰컴 쿠폰 상세보기
	if(userInfo.first_join){
		userInfo.first_join = false;
		jq(".mainCouponDetail").each(function(){
			if(jq(this).data("new_mbr_dc") == "0"){
				jq(this).click();
				return;
			}
		});
	}else{
		if(pushInfo.code == "01" || pushInfo.code == "02"){		// 쿠폰 발송
			jq(".mainCouponDetail").each(function(){			// 담기전 쿠폰
				if(this.id.split("_")[1] == pushInfo.param){
					jq(this).click();
				}
			});
			jq(".mainCouponDetailPick").each(function(){		// 담은 쿠폰
				if(this.id.split("_")[1] == pushInfo.param){
					couponDetailChk = true;
					jq(this).click();
				}
			});
			pushInfo.code = "";
			pushInfo.param = "";
			pageObj.hideBusy();
		}
	}
};

// 보유쿠폰 스크롤 초기화
pageObj.initIscroll = function(){
	setTimeout(function() {
		pageObj.myCouponScroll = new iScroll("iscroll", {
			bounce:false,
			hScroll:false,
			vScrollbar:false
		});
	}, 500);
};

// 할인쿠폰 클릭
pageObj.dcCoupon = function(tmpId){
	jq("#main_cp_dc_cp" + tmpId).toggleClass("reverse");
};

// 팝업에서 쿠폰 담기
pageObj.popAddCoupon = function(tmpCpId){
	jq(".f_pop_close").click();
	pageObj.LCMW2020(tmpCpId);
};

// 쿠폰 담기
pageObj.LCMW2020 = function(cponId){
	var newMbrDc = jq("#mainCp_" + cponId).data("new_mbr_dc");
	consoleLog("D", "new_mbr_dc : " + newMbrDc);
	pageObj.cponId = cponId;
	
	pageObj.stateCpon = (newMbrDc == 0 || newMbrDc == 3) ? "Y" : "N";   
//	pageObj.newMbrCponYn = jq("#mainCp_" + cponId).attr("title");
	
	params = {
			cpon_id			: cponId,
//			new_mbr_cpon_yn	: pageObj.newMbrCponYn
			new_mbr_cpon_yn	: pageObj.stateCpon
	};
	commPage("T", "lcmw2020", params, pageObj.resultLCMW2020);
};

// 쿠폰 담기 결과
pageObj.resultLCMW2020 = function(resultData){
	if(resultData.COUPON_PICK_RESULT > 0){
		if(resultData.NEW_MBR_CPON_YN  == "Y"){
			pageObj.ffr_dsb_chk_yn = resultData.NEW_MBR_CPON_INF.FFR_DSB_CHK_YN;
			pageObj.ffr_tp_dc = resultData.NEW_MBR_CPON_INF.FFR_TP_DC;
			pageObj.ffr_dsb_mdc = resultData.NEW_MBR_CPON_INF.FFR_DSB_MDC;
			pageObj.ffr_am = resultData.NEW_MBR_CPON_INF.FFR_AM;
		}
		pageObj.addCoupon();
	}
};

//쿠폰 추가시 에니메이션
pageObj.addCoupon = function(){
	toastShow("알뜰쿠폰을 담기가 완료되었습니다.<br/>담으신 쿠폰은 [보유쿠폰]에서 확인 하실 수 있습니다.");
	var dataList = new GridControl({"row" : pageObj.couponList});
	var tmpList = "";
	var tmpCpId = pageObj.cponId;
	for(var i = 0; i < dataList.getSize(); i++){
		if(dataList.get(i).CPON_ID == tmpCpId){
			tmpList = dataList.get(i);
		}
	}
	jq("#main_cp_em" + tmpCpId).html("<span class='my_cp'>보유쿠폰</span>");
	jq("#mainCp_" + tmpCpId).removeClass("mainCouponDetail").addClass("mainCouponDetailPick");
	jq("#pop_title_mainCp_" + tmpCpId).html("보유쿠폰 상세");
	tmpList.TMP_CPON_APY_CND_CN = tmpList.CPON_APY_CND_CN.split("<")[0]; 
	tmpList.CMS_CPON = "none";
	tmpList.MW_CPON = "none";
	(tmpList.CPON_SYS_DC == "CMS") ? tmpList.CMS_CPON = "block" : tmpList.MW_CPON = "block";
	tmpList.GRPCO_NM = tmpList.GRPCO_C_NM;
    
    if(tmpList.FFR_AM == "0"|| tmpList.OFFER_DC == ""){
        tmpList.OFFER_DC = "";
        tmpList.FFR_AM = tmpList.EVN_CPON_NM;
    }else{
        tmpList.OFFER_DC = tmpList.FFR_TP_DC == "P" ? "P" : "원";
    }

	jq("#pop_cont_mainCp_" + tmpCpId).html(bindData(jq("#imgSrcTmpl").val(), tmpList));
	pageObj.initPopup();
	
	jq(".have_coupon .new_coupon").css("bottom", "33%");
	setTimeout(function() {
		jq(".have_coupon .new_coupon").css("bottom", "50%");
	}, 2000);
	
    //0p일경우 CSS수정
    if(tmpList.FFR_AM.toCurrency() == 0){
        jq("#mainCp_" + tmpList.CPON_ID+" strong").addClass("coupon_nopoint");
    }
	pageObj.myCouponScroll.scrollTo(0, 0, 500);
	setTimeout(function(){
		jq("#myCoupon").prepend(bindData(jq("#myCouponTmpl").val(), tmpList));
		pageObj.myCouponScroll.scrollTo(0, -57);
		pageObj.myCouponScroll.scrollTo(0, 0, 1000);
		jq("#myCoupon li:first").addClass("new");
		if(tmpList.FFR_TP_DC == "P"){
			jq("#my_cp_span" + tmpCpId).html("POINT");
		}else{
			jq("#my_cp_span" + tmpCpId).html("CASHBACK");
		}
		pageObj.myCouponScroll.refresh();
		initFullPop("myCouponDetail", {
			btnCount	: 1
		});
	}, 800);
	if(pageObj.stateCpon == "Y" && pageObj.ffr_dsb_chk_yn == "Y"){
		var tmpStr = "";
		if(pageObj.ffr_dsb_mdc == "1"){
			tmpStr = "포인트가 지급되었습니다. 지급 완료된 쿠폰은 [My Wallet > 보유쿠폰]에서 확인하실 수 있습니다.";
		}else if(pageObj.ffr_dsb_mdc == "2"){
			tmpStr = "포인트 지급 예정입니다. 담은 쿠폰은 [My Wallet > 보유쿠폰]에서 확인하실 수 있습니다.";
		}else{
			tmpStr = "담은 쿠폰은 [My Wallet > 보유쿠폰]에서 확인하실 수 있습니다.";
		}
		
		setTimeout(function(){
			appConfirm("알림", tmpStr, "보유쿠폰 이동", "확인", function(){
				commPage('P', 'LCMW3200');
			}, function(){
			});
			jq("#myCoupon li").eq(1).remove();
		}, 2200);
	}
};

//할인 쿠폰몰 웹뷰 연동
pageObj.LCMW2091 = function(url){
	if(deviceInfo.os == "windows"){	// 로컬 테스트시 네이티브 호출 할수 없으므로 페이지 호출하는 테스트용 페이지 오픈
		jq("#localKey").val("LCMW");
		jq("#localKeyPad").show();
		jq("#modalBg").show();
		jq("#localKeyPad input").eq(2).attr("onclick", "localPageOpen()");
		jq("#localKey").focus();
	}else{
		pageObj.cpnMallUrl = url;
		// M12 info 변수 조회
		var params = {
				login_yn : loginInfo.logined
		};
		commPage("T", "lcmw2091", params, pageObj.resultLCMW2091);
	}
};

// M12 info 변수 조회 후 네이티브 호출
pageObj.resultLCMW2091 = function(resultData){
	callNtv(null, null, "DevicePlugin", "cooperMall", [pageObj.cpnMallUrl, "할인쿠폰몰", "pageObj.refresh", resultData.M12_ENC_USR_INFO]);
};

pageObj.refresh = function(){
	commPage("P", "LCMW2000");
};

// 그룹 검색
pageObj.changeGroup = function(){
	if(pageObj.selGroup != jq("#grp_select").val()){
		pageObj.selGroup = jq("#grp_select").val();
		jq(window).scrollTop(0);
		jq("#main_coupon_list").html("");
		jq("#grp_select").blur();
		if(loginInfo.logined == "Y"){
			pageObj.loadLCMW2000(pageObj.tmpCouponList);
		}
		pageObj.m12CouponLoad();
	}
};

// 메인화면 전용 로딩바 숨김 (인트로 화면 정리, 로딩바 정리, 대메뉴 좌우 플리킹)
pageObj.hideBusy = function(){
	remocon(true);
};

// 그룹사, 알뜰쿠폰, 보유쿠폰 통합 조회 결과
pageObj.resultLCMW2079 = function(resultData){
	pageObj.tmpCouponList = resultData.COUPON_LIST;
	pageObj.loadLCMW2000(pageObj.tmpCouponList);
	pageObj.m12CouponLoad();
	pageObj.pickCoupon(resultData);
};

// 보유쿠폰 소팅 순서 변경 (유료쿠폰, 알뜰쿠폰 섞어서 담은 순으로)
pageObj.pickCoupon = function(resultData){
	jq("#myCoupon").html("");
	if(resultData.PICK_COUPON_LIST.COUPON_SET_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.PICK_COUPON_LIST.COUPON_SET});
		
		for(var i = 0; i < dataList.getSize(); i++){
			if(dataList.get(i).CPON_TYPE == "M"){
				if(dataList.get(i).COUPON_STATUS == "R"){
					dataList.get(i).SELL_PRICE = dataList.get(i).SELL_PRICE.toCurrency();
					dataList.get(i).TMP_ORDER_DATE = dateComma(dataList.get(i).ORDER_DATE) + " " + dataList.get(i).ORDER_DATE.substr(8, 2) + ":" + dataList.get(i).ORDER_DATE.substr(10, 2);
					dataList.get(i).TMP_PERIOD_DATE = dateComma(dataList.get(i).PERIOD_DATE);
					dataList.get(i).GOODS_NAME = dataList.get(i).GOODS_NAME.replace(dataList.get(i).BRAND_NAME, "").trim();
//					dataList.get(i).IS_USE = (dataList.get(i).GOODS_IS_USE == "N") ? "<li style='font-weight: bold;color: #fc3d39;'><br/>본 쿠폰은 실시간 사용 처리가 되지 않습니다.<br/>쿠폰 사용 후 약 2시간 이후 사용 처리가 될 예정입니다.</li>" : "";
					dataList.get(i).ORIGINAL_PRICE = dataList.get(i).ORIGINAL_PRICE.toCurrency(); 
					jq("#myCoupon").append(bindData(jq("#myM12Tmpl").val(), dataList.get(i)));
					var goodsInfo = dataList.get(i).GOODS_INFO.split("*");
					for( var j = 0; j < goodsInfo.length; j++){
						jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " ul").eq(1).append("<li><strong class='pc02'>" + goodsInfo[j] + "</li>");
					}
					jq("#pop_cont_myM12Div_" + dataList.get(i).TR_ID + " .members_barcord").eq(dataList.get(i).COUPON_TYPE == "MMS" ? 0 : 1).show();
					if(dataList.get(i).ORDER_DATE.substr(0, 8) >= yyyymmdd(new Date())) jq("#myCoupon > li:last").addClass("new");
				}
			}else{
				dataList.get(i).FFR_AM = dataList.get(i).FFR_AM.toCurrency();
				dataList.get(i).TMP_CPON_APY_CND_CN = dataList.get(i).CPON_APY_CND_CN.split("<")[0]; 
				dataList.get(i).CMS_CPON = "none";
				dataList.get(i).MW_CPON = "none";
				(dataList.get(i).CPON_SYS_DC == "CMS") ? dataList.get(i).CMS_CPON = "block" : dataList.get(i).MW_CPON = "block";
				dataList.get(i).OFFER_DC = dataList.get(i).FFR_TP_DC == "P" ? "P" : "원";
                
                //수정데이터 추가
                if(dataList.get(i).FFR_AM == "0"){
                    dataList.get(i).OFFER_DC = "";
                    dataList.get(i).FFR_AM = dataList.get(i).EVN_CPON_NM;
                }

                jq("#myCoupon").append(bindData(jq("#myCouponTmpl").val(), dataList.get(i)));
                
                //0p일경우 CSS수정
                if(dataList.get(i).FFR_AM.toCurrency() == 0){
                    jq("#mainCp_" + dataList.get(i).CPON_ID+" strong").addClass("coupon_nopoint");
                }

				if(dataList.get(i).CPON_PTIN_DTTI >= yyyymmdd(new Date())) jq("#myCoupon > li:last").addClass("new");
			}
		}
	}
	
	jq("#myCoupon > li:last").addClass("last");
	jq("#myCoupon").append('<li class="blank"><div class="coupon cp_blank"><div></div></div></li>');
	initFullPop("myM12Detail", {
		btnCount	: 1,
		btnEvent1	: "pageObj.myM12DetailOk",
		maxBright	: true
	});
	initFullPop("myCouponDetail", {
		btnCount	: 1
	});
	
	// 보유쿠폰 스크롤 초기화
	pageObj.initIscroll();
	
	// 이벤트 팝업 조회
	pageObj.afterLoad();
};

//아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(){
	callNtv(null, null, "DevicePlugin", "selectbox", [pageObj.listGroup, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	if(pageObj.selGroup != tmpCode){
		pageObj.selGroup = tmpCode;
		jq(window).scrollTop(0);
		jq("#main_coupon_list").html("");
		if(loginInfo.logined == "Y"){
			pageObj.loadLCMW2000(pageObj.tmpCouponList);
		}
		jq("#iosSelect").html(tmpValue);
		pageObj.m12CouponLoad();
	}
};
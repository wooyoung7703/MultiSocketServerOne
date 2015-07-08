
/* JavaScript content from js/comm/main.js in folder common */
// 통신 클래스 INSTANCE
var tran = null;

var backData = [];

var deviceInfo = {
		sharePref			: "autoLogin,newLCMW9000,newLCMW1000,newLCMW5000,LCMW0100,wallet_member,card_cert,newAdt",	// 앱 최초 구동시 device정보 가져올 때 Preferences에 필요한 값을 가져온다
		uuid				: null,				// 앱 설치 고유 id
		os					: "",				// android, ios, ipad 구분
		osModel				: null,				// 기기모델 (ex : SHV-E120)
		osVersion			: "",				// os 버젼 (ex : android - 4.0.4 / ios - )
		netOper				: null,				// 통신사 (회원가입시 안드로이드에서 사용)
		phoneNo				: null,				// 전화번호 (회원가입시 안드로이드에서 사용)
		appVersion			: null,				// 앱 버젼 (ex : 1.0)
		usingAppLog			: false,			// adobe로그 전송중 에러나는 기종 체크를 위한 구분값
		winHeight			: null,				// 앱 최초 실행시 화면 높이값 지정 
		winWidth			: null				// 앱 최초 실행시 화면 넓이값 지정
};

var userInfo = {
		wlt_mbr_seq			: "",				// 월렛 회원번호
		wallet_member		: "N",				// 월렛 회원여부
		mbr_st_dc			: "",				// 회원상태 구분 코드 ( A : 정상, L : 잠김, X : 탈퇴 )
		ccd_mbyn			: "N",				// 카드회원 여부
		cell_no 			: "",				// 휴대전화번호
		cst_drm_no			: "",				// 고객식별번호(CI)
		m12_cst_drm_no		: "",				// 고객식별번호(CI, m12 유료쿠폰몰 호출시 암호화된 CI)
		sms_join			: "N",				// SMS 가입여부
		ur_nm				: "",				// 사용자명
		birth_day			: "",				// 생년월일
		rr_gender			: "",				// 주민번호 성별 구분 (1,3 : 남 / 2,4 : 여 -- 번호로 2000년 이후 생일자 인지 판단) 
		mmt_tcc_co_dc 		: "",				// 통신사 구분
		mb_cno				: "",				// 멤버십 고객번호
		first_join			: false,			// 최초 가입시 가입쿠폰제공 위해
		card_cert			: "N",				// 카드인증 여부
		members_member      : "",               //멤버스회원여부
		members_active      : "",               //유효카드 보유여부
		card_m_agree        : "",               //멤버스동의여부
		members_active      : ""                //카드회원여부
};

var certInfo = {};
//신규가입오퍼
var mOfferData = {
		WELCOME_OFFER_YN    : "",
		LOTTE_WELCOME_INFO  : "",
		M12_WELCOME_INFO    : ""
};

var loginInfo = {
		autoLogin			: "N",				// 자동로그인 여부
		logined				: "N",				// 로그인 상태
		endTime				: new Date(),		// 앱에서 로그인 세션 체크를 위한 마지막 event 시간
		timeOut				: 10 * 60 * 1000,	// 세션 아웃 시간 10분
//		timeOut				: 1 * 30 * 1000,	// 세션 아웃 시간 1분
		endPage				: "",				// 마지막 페이지
		endPtime			: new Date()		// 페이지 이동 마지막 시간
};

// 로그인 체크 여부 후 사용자가 마지막으로 사용한 페이지를 저장
var loginPageInfo = {
		flag				: "",
		param1				: null,
		param2				: null,
		param3				: null,
		param4				: null
};

var newBtn = {
		newLCMW9000			: 0,			// 공지사항 max_seq
		newLCMW1000			: 0,			// 이벤트 max_seq
		newLCMW5000			: 0,			// 알뜰소식 max_seq
		LCMW0100			: 0				// 인트로 이벤트 1일간 안보이기 일시
};

var pushInfo = {
		code				: "",
		param				: "",
		aprYn				: "",
		realPush			: ""
};

var busyState = {
		show				: false,
		hide				: false
};

// 제휴 쿠폰몰 리스트 (메인 화면 진입시 제휴쿠폰몰 리스트조회를 앱 실행후 한번만 하도록)
var m12CouponList = null;

// 이벤트 팝업 앱 실행시 한번만
var popReview = "";

var page_pop_card = true;

// 앱 최초 실행
function initDevice(){
	// 통신 클래스 INSTANCE 생성
	tran = new TranCtrl();
	
	// 헤더, nav 고정 영역에서 스크롤시 내용이 스크롤 되는 현상 방지
	jq("#header, #nav_menu").bind("touchmove", function(){return false;});
	
	goMain();
}

// device 정보 native 호출 결과
function deviceInfoResult(resultData){
	deviceInfo.winWidth		= jq(window).width();
	deviceInfo.winHeight	= jq(window).height();
	deviceInfo.uuid			= resultData.deviceUuid;
	deviceInfo.os			= resultData.os.toLowerCase();
	deviceInfo.osModel		= resultData.osModel;
	deviceInfo.osVersion	= resultData.osVersion;
	deviceInfo.appVersion	= resultData.appVer;
	
	if(deviceInfo.os == "android"){
		if(resultData.netOper == "" && autoFillin){
			callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "USIM카드가 인식되지 않습니다. 확인 후 다시 실행해주세요."]);
			return;
		}
		deviceInfo.netOper	= resultData.netOper;
		deviceInfo.phoneNo	= resultData.phoneNo.replace("+82", "0");
		jq("#quick_menu li").eq(1).find("span").html("기프트/캐시비");
	}else if(deviceInfo.os == "ios"){
//		if(!deviceInfo.osModel.match("iPhone") && !stateDev){
//			callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "지원하지 않는 단말기 입니다."]);
//			return;
//		}
		deviceInfo.usingAppLog = false;
		jq("#wl_ios7bar").remove();
		jq(".wl_ios7").removeClass("wl_ios7");
	}else{
		jq("#helpBtn").attr("onclick", "pageLoad('LCMWC000', '', 'L')");
		deviceInfo.netOper	= resultData.netOper;
		deviceInfo.phoneNo	= resultData.phoneNo.replace("+82", "0");
		jq("#quick_menu li").eq(1).find("span").html("기프트/캐시비");
	}
	loginInfo.autoLogin		= resultData.autoLogin;								// 자동 로그인 여부
	userInfo.wallet_member	= resultData.wallet_member == "Y" ? "Y" : "N";		// 월렛 회원 여부 (위젯, 기기 변경 가입 체크)
	userInfo.card_cert		= resultData.card_cert == "Y" ? "Y" : "N";			// 카드인증 여부
	newBtn.newLCMW9000		= resultData.newLCMW9000;;							// 공지사항 new
	newBtn.newLCMW1000		= resultData.newLCMW1000;							// 이벤트 new
	newBtn.newLCMW5000		= resultData.newLCMW5000;							// 알뜰 소식 new
	newBtn.LCMW0100			= resultData.LCMW0100;								// 이벤트 팝업 하루동안 보지 않기
	
	//특정 안드로이드 모델에서 어도비 로그 서버 전송시 오류 발생 회피(try catch로 잡히지 않는다)
	if(exceptionDeviceChk(exception_applog) || deviceInfo.os == "windows") deviceInfo.usingAppLog = false;
	consoleLog("I", "uuid : " + deviceInfo.uuid + 
				"\nosModel : " + deviceInfo.osModel + 
				"\nosVersion : " + deviceInfo.osVersion + 
				"\nappVersion : " + deviceInfo.appVersion + 
				"\nwinHeight : " + deviceInfo.winHeight + 
				"\nwinWidth : " + deviceInfo.winWidth +
				"\nloginInfo.autoLogin : " + resultData.autoLogin +
				"\nnewBtn.newLCMW9000 : " + resultData.newLCMW9000 +
				"\nnewBtn.newLCMW1000 : " + resultData.newLCMW1000 +
				"\nnewBtn.newLCMW5000 : " + resultData.newLCMW5000 +
				"\nnewBtn.LCMW0100 : " + resultData.LCMW0100
				);
//	goMain();
	// 팝업 공지사항, 최근글, 패밀리 링크 통합 조회
	commPage("T", "lcmw0190", "", resultLCMW0190);
//	commPage("T", "lcmw9020", "", resultLCMW9020);

}

var resultDataLCMW0190 = {};
function resultLCMW0190(resultData){
	pageObj.popupEventSet = resultData.POPUP_EVENT_SET;
	// 최근 글번호
	resultDataLCMW0190.RECENT_ARTICLE_INFO = resultData.RECENT_ARTICLE_INFO;
	// family link
	resultDataLCMW0190.FAMILY_INFO = resultData.FAMILY_INFO;
	// 팝업 공지사항
	resultLCMW9020(resultData.ARTICLE_INFO);
}

function resultLCMW9020(resultData){
	if(resultData.ARTICLE.ARTICLE_EXIST_YN == "Y"){			// 공지사항 유무
		if(resultData.ARTICLE.ARTICLE_BULT_P_OR == "0"){	// 시스템 공지
			callNtv(null, null, "DevicePlugin", "forcedExit", [resultData.ARTICLE.ARTICLE_TIT_NM, resultData.ARTICLE.ARTICLE_CN_V]);
		}else{												// 일반 공지
			appAlert(resultData.ARTICLE.ARTICLE_TIT_NM, resultData.ARTICLE.ARTICLE_CN_V, "확인");
//			tran.callTran("lcmw0140", "", resultLCMW0140);
			resultLCMW0140(resultDataLCMW0190.RECENT_ARTICLE_INFO);
		}
	}else{
		resultLCMW0140(resultDataLCMW0190.RECENT_ARTICLE_INFO);
//		tran.callTran("lcmw0140", "", resultLCMW0140);
	}
}

// new 버튼 조회 결과
function resultLCMW0140(resultData){
	var dataList = new GridControl({"row" : resultData.RECENT_ARTICLE});
	for(var i = 0; i < dataList.getSize(); i++){
		if(dataList.get(i).BOARD_TYPE == "EVENT"){
			if(dataList.get(i).SEQ.replace("MWEV", "") > newBtn.newLCMW1000){
				jq("#newLCMW1000").show();
				newBtn.newLCMW1000 = dataList.get(i).SEQ.replace("MWEV", "");
			}
		}else if(dataList.get(i).BOARD_TYPE == "NEWS"){
			if(dataList.get(i).SEQ > newBtn.newLCMW5000){
				jq("#newLCMW5000").show();
				newBtn.newLCMW5000 = dataList.get(i).SEQ;
			}
		}else if(dataList.get(i).BOARD_TYPE == "NOTICE"){
			if(dataList.get(i).SEQ > newBtn.newLCMW9000){
				jq("#newLCMW9000").show();
				newBtn.newLCMW9000 = dataList.get(i).SEQ;
			}
		}
	}
	if(loginInfo.autoLogin == "Y"){
		tran.callTran("lcmwc010", "", autoLoginResult);
	}else{
		tran.callTran("lcmwc100", "", userInfoResult);
	}
}

var appFirst = true;	// 푸쉬를 통해 앱이 실행될 경우 메인화면 구동중 푸쉬체크와 충돌을 막기위해 앱이 최초 구동인지를 체크
function autoLoginResult(resultData){
	if(resultData.IS_LOGIN_AUTH == "Y"){
		if(deviceInfo.os == "android" && deviceInfo.phoneNo != resultData.CELL_NO){
			consoleLog("I", "deviceInfo.phoneNo != resultData.CELL_NO");
			callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "현재 사용중인 기기의 사용자 정보가 변경되었습니다. 앱을 삭제후 다시 설치해주세요."]);
			return;
		}
		userInfo.wlt_mbr_seq	= resultData.WLT_MBR_SEQ;
		userInfo.wallet_member	= "Y";
		userInfo.mbr_st_dc		= resultData.MBR_ST_DC;
		userInfo.ccd_mbyn		= resultData.CCD_MBYN;
		userInfo.cst_drm_no		= Base64.encode(resultData.CST_DRM_NO);
		userInfo.cell_no		= resultData.CELL_NO;
		userInfo.ur_nm			= resultData.UR_NM;
		userInfo.rr_gender		= resultData.GEN;
		userInfo.birth_day		= ((userInfo.rr_gender == "3" || userInfo.rr_gender == "4" || userInfo.rr_gender == "7" || userInfo.rr_gender == "8") ? "20" : "19") + "" + resultData.BIRTH_DAY;
		userInfo.mmt_tcc_co_dc 	= resultData.MMT_TCC_CO_DC;
		userInfo.sms_join		= resultData.SMS_J_YN;
		userInfo.mb_cno			= resultData.MB_CNO;
		userInfo.m12_cst_drm_no	= resultData.M12_CST_DRM_NO;
		mobileBillData.cd_cno	= resultData.CD_CNO;
		userInfo.members_member	= resultData.IS_MEMBERS_MEMBER == "Y" ? "Y" : "N";
		userInfo.members_active	= resultData.IS_MEMBERS_ACTIVE == "Y" ? "Y" : "N";
		userInfo.card_m_agree	= resultData.IS_CREDIT_CARD_M_AGREE == "Y" ? "Y" : "N";
		userInfo.ccd_mbyn	= resultData.IS_CREDIT_CARD_MEMBER == "Y" ? "Y" : "N";

		setLoginInfo(resultData.SERVER_KEY);
		if(resultData.LOGIN_STAMP_OFFER_YN == "Y"){
			appAlert("알림", "활동지수 목표에 달성하셨습니다.", "확인");
		}
//		goMain();
		// family link
		loadFamilyLink();
		
		if(loginInfo.logined=="Y"){
			var swtmp = setPageNum(userInfo.ccd_mbyn,userInfo.card_m_agree,userInfo.members_member,userInfo.members_active,userInfo.card_cert);
			goPageNum(swtmp,"main");
		}
	}else{
		// 자동 로그인 실패시 사용자 정보조회 (로그인 없이 사용자 정보 조회)
		tran.callTran("lcmwc100", "", userInfoResult);
	}
}

function userInfoResult(resultData){
	if((userInfo.wallet_member != resultData.IS_WALLET_MEMBER) || (deviceInfo.os == "android" && deviceInfo.phoneNo != resultData.CELL_NO && resultData.IS_WALLET_MEMBER == "Y")){
		consoleLog("I", "userInfo.wallet_member != resultData.IS_WALLET_MEMBER) || (deviceInfo.os == android && deviceInfo.phoneNo != resultData.CELL_NO && resultData.IS_WALLET_MEMBER == Y");
		callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "현재 사용중인 기기의 사용자 정보가 변경되었습니다. 앱을 삭제후 다시 설치해주세요."]);
		return;
	}
	userInfo.wallet_member		= resultData.IS_WALLET_MEMBER;
	userInfo.wlt_mbr_seq		= resultData.WLT_MBR_SEQ;
	userInfo.mbr_st_dc			= resultData.MBR_ST_DC;
	userInfo.cell_no			= resultData.CELL_NO;
	userInfo.ccd_mbyn			= resultData.CCD_MBYN;
	userInfo.cst_drm_no			= Base64.encode(resultData.CST_DRM_NO);
	userInfo.ur_nm				= resultData.UR_NM;
	userInfo.rr_gender			= resultData.GEN;
	userInfo.birth_day			= ((userInfo.rr_gender == "3" || userInfo.rr_gender == "4" || userInfo.rr_gender == "7" || userInfo.rr_gender == "8") ? "20" : "19") + "" + resultData.BIRTH_DAY;
	userInfo.mmt_tcc_co_dc 		= resultData.MMT_TCC_CO_DC;
	userInfo.sms_join			= resultData.SMS_J_YN;
	mobileBillData.cd_cno		= resultData.CD_CNO;
	loadFamilyLink();
}

function loadFamilyLink(){
	if(userInfo.ccd_mbyn == "Y") page_pop_card = false;
	busyState.hide = true;
	resultFamilyLink(resultDataLCMW0190.FAMILY_INFO);
};

var familyLinkData;
var urlscheme = "";
function resultFamilyLink(resultData){
	familyLinkData = resultData;
	var dataList = new GridControl({"row" : resultData.FAMILY_SET});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#family_ul").append(bindData(jq("#mainFamilyTmpl").val(), dataList.get(i)));
		if(urlscheme != "") urlscheme += ",";
		urlscheme += (deviceInfo.os == "android") ? dataList.get(i).AROS_PKG_NM	: dataList.get(i).IPN_URI_SCHM_NM;
	}
	familyLink();
	if(deviceInfo.os == "android"){
		cordova.exec(null, null, "DevicePlugin", "widgetChk", ["resultWidget"]);
	}else if(deviceInfo.os == "ios"){
		hasPush();
	}else{
		if(appFirst){
			appFirst = false;
			busyState.show = true;
			busyState.hide = true;
			pageObj.LCMW0100();
		}else{
			goMain();
		}
	} 
}

function resultWidget(code, param){
	appFirst = false;
	if(code == "00"){			// 자동로그인이 아닌 경우
		goLogin();
	}else if(code == "01"){		// 앱카드 카드결제
		commPage("P", "LCMW3010", param, "L");
	}else if(code == "03"){		// 보유쿠폰 조회
		commPage("P", "LCMW3200", param);
	}else if(code == "04"){		// 앱카드가 없을 경우
		appAlert('알림', '본 서비스는 6/15일 오픈 예정입니다.', '확인');
		appFirst = true;
		hasPush();
//		commPage("P", "LCMW3000");
	}else if(code == "05"){		// 멤버십 카드가 없을 경우
		commPage("P", "LCMW3100", param);
	}else if(code == "99"){		// 회원가입
		joinMember();
	}else{
		appFirst = true;
		hasPush();
	}
}

function goMain(){ 
	smartReceiptBackData.state = false;
//	commPage("P", "LCMW2000");
	commPage("P", "LCMW0000");
}

function setLoginInfo(serverKey){
	if(serverKey){	// 로그인 처리
		loginInfo.logined = "Y";
		loginInfo.endTime = new Date();
		MWTranCtrl.mSessionId = serverKey;
		jq("#rightBtn").attr({"onclick" : "logout()", "class" : "logout"});
		
		// push seq set
//		initMqtt();
		setKeyCno(userInfo.mb_cno, userInfo.mb_cno);
		isPushAppSubscribe();
		
	}else{			// 로그아웃 처리
		loginInfo.logined = "N";
		MWTranCtrl.mSessionId = "";
		jq("#rightBtn").attr({"onclick" : "loginPage()", "class" : "login"});
	}
}

//화면간의 페이지 이동 처리 (WL.Page.load를 호출)
//tgt_scr : 이동할 페이지 (html)
//tgt_params : 이동할 페이지로 전달할 데이터 (option)
//backShowFlag : 페이지에서 백버튼 활성화 (Y/N)
//backFlag : back button으로 페이지를 호출했는지 여부 체크
function pageLoad(tgt_scr, tgt_params, backShowFlag, backFlag){
	remocon(false);
	if(typeof(tgt_params) == "object") tgt_params = JSON.stringify(tgt_params);
	prePageSet(tgt_scr, tgt_params, backShowFlag, backFlag);
    initLayout(tgt_scr);
	WL.Page.load("html/" + tgt_scr.substr(0, 5) + "/" + tgt_scr + ".html", {
		onComplete : function () {	
			deviceChk();
			setTitle(tgt_scr);
			pageObj.pageFunction(tgt_params);
		},
		onUnload : WL.Page.onUnload
	});
}

// 화면 이동, 데이터 로드시 회원 및 로그인 여부 체크
// flag : 회원, 로그인 체크후 실행될 function 구분 (P - pageLoad, T - tran.callTran)
// needLogin 로그인 필수 여부 (true - 로그인 필수)
function commPage(flag, param1, param2, param3, param4){
//	remocon(false);

	if(flag == "P" && moreHeight) return;
	consoleLog("D", "commPage flag : " + flag + "\nurl : " + param1 + "\nparam2 : " + param2 + "\nparam3 : " + param3 + "\nparam4 : " + param4);
	if(noTouch(500)) return;
	
	var needLogin = urlChk(loginList, param1);
	consoleLog("D", "commPage needLogin : " + needLogin);
	loginPageInfo.flag = flag;
//	loginPageInfo.needLogin = needLogin;
	loginPageInfo.param1 = param1;
	loginPageInfo.param2 = param2;
	loginPageInfo.param3 = param3;
	loginPageInfo.param4 = param4;
	consoleLog("D", "tmpTime - loginInfo.endTime : " + tmpTime - loginInfo.endTime);
	if(loginInfo.logined == "Y" && (tmpTime - loginInfo.endTime) > loginInfo.timeOut){
		loginInfo.endTime = tmpTime;
		setLoginInfo(false);
		consoleLog("D", "자동 로그인 여부 : " + loginInfo.autoLogin);
		if(loginInfo.autoLogin == "Y"){
			tran.callTran("lcmwc010", "", pageAutoLogin);
		}else{
			appAlert("알림", "세션이 종료되었습니다. 이용을 원하실 경우 재 로그인을 해주세요.", "확인");
//			pageLoad('LCMWC000', 'C', 'L');
//			pageLoad("LCMW2000");
			goMain();
		}
	}else{
		loginInfo.endTime = tmpTime;
		if(needLogin){
			if(userInfo.wallet_member == "N"){
				if(urlChk(noMemList, param1)){
					pageLoad(param1, param2, param3, param4);
				}else{
					appConfirm("알림", "회원가입이 필요한 메뉴입니다.\n회원가입 화면으로 이동하시겠습니까?", "확인", "취소", function(){
						joinMember();
					}, function(){
					});
				}
			}else{
				if(loginInfo.logined == "N" && param1 != 'LCMWB300'){
					if(userInfo.mbr_st_dc == "L"){
						appConfirm("알림", "[롯데카드 클러치]앱 계정이 잠김 상태 입니다. 본인인증 후 서비스 이용이 가능합니다. 본인인증은 [비밀번호 재설정]화면에서 가능합니다. [비밀번호 재설정] 화면으로 이동하시겠습니까?", "확인", "취소", function(){
							pageLoad("LCMWC400", "", "L");
						}, function(){
						});
					}else{
						appConfirm("알림", "로그인 후 이용하 실 수 있습니다.\n로그인 페이지로 이동하시겠습니까?", "확인", "취소", function(){
							pageLoad("LCMWC000", "C", "L");
						}, function(){
						});
					}
				}else{
					if(flag == "P"){
						pageLoad(param1, param2, param3, param4);
					}else if(flag == "T"){
						tran.callTran(param1, param2, param3, param4);
					}else{
						eval(param1 + "('" + param2 + "')");
					}
				}
			}
		}else{
			if(flag == "P"){
				pageLoad(param1, param2, param3, param4);
			}else if(flag == "T"){
				tran.callTran(param1, param2, param3, param4);
			}else{
				eval(param1 + "('" + param2 + "')");
			}
		}
	}
}

function pageAutoLogin(resultData){
	if(resultData.IS_LOGIN_AUTH == "Y"){
		setLoginInfo(resultData.SERVER_KEY);
		loginPageInfo.flag == "P" ? pageLoad(loginPageInfo.param1, loginPageInfo.param2, loginPageInfo.param3, loginPageInfo.param4) : tran.callTran(loginPageInfo.param1, loginPageInfo.param2, loginPageInfo.param3, loginPageInfo.param4);
	}else{
		consoleLog("D", "!!! 자동 로그인 실패 !!!");
		setLoginInfo(false);
		appAlert("알림", "세션이 종료되었습니다. 이용을 원하실 경우 재로그인을 해주세요", "확인");
//		pageLoad('LCMWC000', '', 'L');
//		pageLoad("LCMW2000");
		goMain();
	}
}

function loginPage(){
	menuControl(true);
	if(userInfo.wallet_member == "N"){
		appConfirm("알림", "회원가입이 필요한 메뉴입니다.\n회원가입 화면으로 이동하시겠습니까?", "확인", "취소", function(){
			joinMember();
		}, function(){
		});
	}else{
		if(userInfo.mbr_st_dc == "L"){
			appConfirm("알림", "[롯데카드 클러치]앱 계정이 잠김 상태 입니다. 본인인증 후 서비스 이용이 가능합니다. 본인인증은 [비밀번호 재설정]화면에서 가능합니다. [비밀번호 재설정] 화면으로 이동하시겠습니까?", "확인", "취소", function(){
				pageLoad("LCMWC400", "", "L");
			}, function(){
			});
		}else{
			goLogin();
		}
	}
}

function setTitle(){
	pageObj.pageTitle == "롯데카드 클러치" ? jq('#_appTitle').addClass("logo") : jq('#_appTitle').removeClass("logo");  
	jq('#_appTitle').html(pageObj.pageTitle);
}

//공통 alert창
function appAlert(title, text, btn1){
	customAlert.show(title, text, [{
		text: btn1,
		handler: function(){}
	}]);
}

//공통 alert창(one button)
function appAlertOne(title, text, btn1, func1){
	customAlert.show(title, text, [{
		text: btn1,
		handler: func1
	}]);
}

//공통 confirm창
function appConfirm(title, text, btn1, btn2, func1, func2){
	customAlert.show(title, text,[{
		text: btn2,
		handler: func2
	},{
		text: btn1,
		handler: func1
	}]);
}

// 뒤로가기 공통 처리
function prePageSet(tgt_scr, tgt_params, backShowFlag, backFlag){
	consoleLog("D", "================ 뒤로가기 페이지 정보 ===================\ntgt_scr : " + tgt_scr + "\ntgt_params : " + tgt_params + "\nbackShowFlag : " + backShowFlag + "\nbackFlag : " + backFlag + "\n================ 뒤로가기 페이지 정보 ===================");
	// 뒤로가기 버튼 클릭시 backData 제거, 메뉴 진입시 backData 추가
	(backFlag) ? backData.pop() : backData.push({showFlag:backShowFlag, url:tgt_scr, param:tgt_params});
	if(deviceInfo.winHeight < jq(window).height()) deviceInfo.winHeight = jq(window).height();
	familyMenuTop = deviceInfo.winHeight - 38;
	jq("#family_menu").css("top", familyMenuTop);
	jq("#leftBtn").show();
	jq("#helpBtn").hide();
	if(backShowFlag == "Y"){
		if(backData.length < 2) return;
		jq("#family_menu").hide();
		jq("#mainNav").hide();
		jq("#leftBtn").attr({"onclick" : "commPage('P', '" + backData[backData.length-2].url + "', '" + backData[backData.length-2].param + "', '" + backData[backData.length-2].showFlag + "', true);", "class" : "back"}).show();
		jq("#rightBtn").attr({"onclick" : "goMain()", "class" : "home"}).show();
	}else if(backShowFlag == "L"){
		jq("#family_menu").hide();
		jq("#mainNav").hide();
		jq("#leftBtn").hide();
		jq("#rightBtn").attr({"onclick" : "goMain()", "class" : "home"}).show();
		if(backData.length < 2){
			return;
		}
		jq("#leftBtn").attr({"onclick" : "commPage('P', '" + backData[backData.length-2].url + "', '" + backData[backData.length-2].param + "', '" + backData[backData.length-2].showFlag + "', true);", "class" : "back"}).hide();
	}else{
		jq("#leftBtn").attr({"onclick" : "menuControl()", "class" : "menu"}).show();
		loginInfo.logined == "N" ? jq("#rightBtn").attr({"onclick" : "loginPage()", "class" : "login"}).show() : jq("#rightBtn").attr({"onclick" : "logout()", "class" : "logout"}).show();
		jq("#helpBtn").show();
		jq("#mainNav").hide();
		backData.splice(0, backData.length-1);
		jq("#family_menu").css("top", "2000px");
		if(tgt_scr != "LCMW0000"){
			jq("#family_menu").css("top", familyMenuTop).show();
			jq("#mainNav").show();
			installedFamilyChk();
		}
	}
}

function installedFamilyChk(){
	callNtv(null, null, "FamilyLinkPlugin", "isInstalledApp", ["resultInstalledFamilyChk",urlscheme]);
}

function resultInstalledFamilyChk(resultData){
	var resultSplit = resultData.split(",");
	for(var i = 0; i < resultSplit.length; i++){
		if(resultSplit[i] == "Y"){
			jq("#family_ul li").eq(i).find("a").removeClass("dim");
		}else{
			jq("#family_ul li").eq(i).find("a").addClass("dim");
		}
	}
}

function logout(){
	menuControl(true);
	appConfirm("알림", "로그아웃 하시겠습니까?", "확인", "취소", function(){
		callNtv(null, null, "DevicePlugin", "saveData", ["","","","autoLogin","N"]);
		setLoginInfo(false);
		appAlert("알림", "로그아웃 되었습니다. 이용을 원하실 경우 재로그인 해주세요.", "확인");
		goMain();
//		pageLoad('LCMWC000', '', 'L');
	}, function(){
	});
}

function initLayout(tgt_scr){
	jq("#pop_card").hide();
	window.scrollTo(0, 0);
	unbindScroll();
	menuControl(true);
	maxBright(false);
	jq("#blank").height(0);
	// 메인 네비 체크
	jq("#mainNav a").each(function(){
		jq(this).attr("onclick").match(tgt_scr.substr(0, 5)) ? jq(this).addClass("on") : jq(this).removeClass("on");
	});
	// my wallet nav 체크
	(parseInt(tgt_scr.substr(6), 10) == 0 && tgt_scr.match("LCMW3")) ? jq("#LCMW3").show() : jq("#LCMW3").hide();   
	jq("#LCMW3 a").each(function(){
		jq(this).attr("onclick").match(tgt_scr) ? jq(this).addClass("on") : jq(this).removeClass("on");
	});
	jq("#tmpHeader").attr("id", "header");
	jq("body").addClass("bg_depth01");
	if(popEventState){
		pageObj.closePop();
	}
	if(jq("#full_pop").css("display") != "none"){
		jq(".f_pop_close").click();
	}
	
	if(jq("#leftBtn").attr("class") == "menu" && jq("#leftBtn").css("display") != "none"){
		var leftPage = "LCMW5000";
		var rightPage = "LCMW1000";
		if(tgt_scr.charAt(4) == "1"){
			leftPage = "LCMW2000";
			rightPage = "LCMW3000";
//			rightPage = "LCMW3300";
		}else if(tgt_scr.charAt(4) == "2"){
		}else if(tgt_scr.charAt(4) == "3"){
			leftPage = "LCMW1000";
			rightPage = "LCMW4000";
		}else if(tgt_scr.charAt(4) == "4"){
			leftPage = "LCMW3000";
//			leftPage = "LCMW3300";
			rightPage = "LCMW5000";
		}else if(tgt_scr.charAt(4) == "5"){
			leftPage = "LCMW4000";
			rightPage = "LCMW2000";
		}
		jq("#leftPageBtn").attr("onclick", "commPage('P', '" + leftPage + "')");
		jq("#rightPageBtn").attr("onclick", "commPage('P', '" + rightPage + "')");
	}
}

//좌우 플리킹 이벤트
function remocon(flag){
	jq("#mainContents").unbind("swipeleft").unbind("swiperight").unbind("movestart");
	jq("#blank").height(0);
	if(flag){
		popState = false;
		if(jq("#mainContents").height() < deviceInfo.winHeight){
			setTimeout(function(){
				jq("#blank").css("height", (deviceInfo.winHeight - jq("#mainContents").height() - 20) + "px") ;
			}, 500);
		}
		jq("#mainContents").on("swipeleft", function(e) {
			if(!popEventState && !popState){
				jq("#rightPageBtn").click();
			}
		}).on("swiperight", function(e) {
			if(!popEventState && !popState){
				jq("#leftPageBtn").click();
			}
		}).on("movestart", function(e) {
			if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
				e.preventDefault();
			}
		});
		
		if(page_pop_card){
			jq("#pop_card").show();
		}
	}
}

function closePopCard(){
	page_pop_card = false;
	jq("#pop_card").hide(500);
}

//통신 결과에 대한 check
function inspectResult(response, service_type, callBackFunction){
	if(response.header.isSuccess == "fail"){
		consoleLog("E", "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nresponse.header.isSuccess fail : " + response.header.header_message + "\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		tran.busy.hide();
//		jq("#cleanBg").hide();
		appAlert("알림", "서버 접속이 지연되고 있습니다.\n잠시 후 다시 실행해주세요.", "확인");
		return;
	}
	
	if(response.header.login == "X"){
		consoleLog("I", "response.header.login = X");
		callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "현재 사용중인 기기의 사용자 정보가 변경되었습니다. 앱을 삭제후 다시 설치해주세요."]);
		return;
	}
	
	try{
		callBackFunction(response.body ? response.body : response.free);
	}catch(e){
		consoleLog("E", "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\ninspectResult callBackFunction exception : " + e.message + "\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		tran.busy.hide();
//		jq("#cleanBg").hide();
//		appAlert("알림", "서버 접속이 지연되고 있습니다.\n잠시 후 다시 실행해주세요.", "확인");
	}
}

//시스템 장애 등의 에러 발생 시, Alert로 메시지를 표시
function showErrorScr(func, msg) {
	consoleLog("E", "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nerror : " + func + "\n" + msg + "\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	tran.busy.hide();
	appAlert("알림", "서버 접속이 지연되고 있습니다.\n잠시 후 다시 실행해주세요.", "확인");
	// 메인으로 이동하려 했으나 서버 장애시 서버접속 지연 메시지를 띄우고 메인화면 호출 무한 루프로 인해 메인화면으로 이동하지 않음
//	goMain();
}

// native 호출 공통 함수
function callNtv(successCallBack, failCallBack, plugin, name, params){
	consoleLog("I", "cordova.exec plugin : " + plugin);
	consoleLog("I", "cordova.exec name   : " + name);
	if(navigator.userAgent.toLowerCase().match("windows") && stateDev){	// 로컬 테스트용
		try{
			eval(plugin + "." + name + "('" + params + "')");
		}catch(e){
			alert("native 호출 불가");
			consoleLog("E", "call native error : " + e);
		}
	}else{
		cordova.exec(successCallBack, failCallBack, plugin, name, params);
	}
}

var popState = false;
var popEventState = false;
function backKeyEvent(){
	consoleLog("D", "=== backkey leftBtn :  " + jq("#leftBtn").attr("onclick"));
	consoleLog("D", "=== backkey rightBtn :  " + jq("#rightBtn").attr("onclick"));
	consoleLog("D", "loginPageInfo : " + JSON.stringify(loginPageInfo));
	var tmpTop = jq(window).scrollTop();
	setTimeout(function(){
		if(deviceInfo.osVersion.charAt(0) == "2" && tmpTop != jq(window).scrollTop()) return;

		if(jq("#pop_barcode").css("display") != "none"){
			popBarcodeClose();
		}else{
			if(popState){
				jq("#popBtn2").css("display") == "none" ? jq("#popBtn1").click() : jq("#popBtn2").click();  
			}else{
				if(popEventState){
					pageObj.closePop();
				}else{
					if(jq("#leftBtn").css("display") == "none"){
						if(pageObj.cancel){
							pageObj.cancel();
						}else{
							callNtv(null, null, "DevicePlugin", "appExit", ["롯데카드 클러치를 종료하시겠습니까?", "", "", ""]);
						}
					}else{
						if(jq("#rightBtn").attr("class").match("log")){
							if(jq("#quick_menu").css("display") != "none"){
								menuControl();
								return;
							}
							if (jq("#family_menu").css("top").replace("px", "") < familyMenuTop) {
								jq("#family_menu").animate({top: familyMenuTop}, {duration : 100});
								return;
				    		}
							if(loginPageInfo.param1 == "LCMW0000" || loginPageInfo.param1 == "lcmw0190"){
								callNtv(null, null, "DevicePlugin", "appExit", ["롯데카드 클러치를 종료하시겠습니까?", "", "", ""]);
							}else{
								goMain();
							}
						}else{
							jq("#leftBtn").click();
						}
					}
				}
			}
		}
	}, 200);
}

function getSessionKey(cnt) {
//	var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
	var chars = '0123456789';
    var uuid = "";
    for (var i = 0; i < cnt; i++) {
//		uuid += (i==4) ? "-" : chars.charAt(Math.floor( Math.random() * (36)));
		uuid +=  chars.charAt(Math.floor(Math.random() * (10)));
	}
    return uuid;
}

//function pushChk(){
//	if(loginInfo.pushChk){
//		initMqtt();
//		isPushAppSubscribe();
//		loginInfo.pushChk = false;
//	}
//}

/////////////////////////////////////////////////////////////////////////////
//fragment unload 시 fragment내에서만 사용되는 garbage object를 제거하는 공통 루틴
//각 fragment page에서는 pageObj에 모든 전역 variable, function을 등록하여야 한다.
/////////////////////////////////////////////////////////////////////////////
var pageObj = pageObj ? pageObj : {};
WL.Page.onUnload = function(){
	for(var att in pageObj){
		//eval(att + ' = null');
		eval('delete ' + att);
		delete pageObj[att];   
	}
};

/* JavaScript content from js/comm/wallet.js in folder common */
// 로그인 후 사용가능한 목록
var loginList = [
	"LCMW3000",		// 카드결제
	"LCMW3100",		// 멤버십
	"LCMW3200",		// 보유쿠폰
	"LCMW3300",		// 스탬프
	"LCMW3400",		// 통합결제
	"LCMW3320",		// 스탬프 이벤트, 적립내역 상세
	"LCMW4000",		// 스마트 영수증 캘린더
	"LCMW4100",		// 스마트 영수증 목록
	"LCMW4200",		// 오퍼뷰 목록
	"LCMWB100",		// 비밀번호 설정
	"LCMWB200",		// sns설정
	"LCMWB300",		// push 알림 설정
	"LCMW7210",		// 카드 간편신청
	
	"lcmw2000",		// 쿠폰목록
	"lcmw2010",		// 보유쿠폰 목록
	"lcmw2020",		// 쿠폰담기
	"lcmw2030",		// 알뜰쿠폰 그룹 목록 조회
	"lcmw3000",		// 카드결제 (앱카드 회원여부)
	"lcmw3002",		// 앱카드 주카드 변경
	"lcmw3003",		// 앱카드 등록 해제
	"lcmw3010",		// 앱카드 결제 비빌번호
	"lcmw3020",		// 보유카드 리스트 조회
	"lcmw3021",		// 앱카드 추가
	"lcmw3100",		// 멤버십 카드 리스트
	"lcmw3120",		// 제휴 멤버십 카드 정보
	"lcmw3121",		// 멤버십 등록 가능 리스트
	"lcmw3122",		// 롯데 멤버스 포인트 조회
	"lcmw3123",		// 비제휴 멤버십 카드정보
	"lcmw3124",		// 멤버십 직접등록 카드 삭제
	"lcmw3130",		// 멤버십 직접등록
	"lcmw3140",		// 멤버십 공지사항
	"lcmw3200",		// 보유쿠폰 리스트 조회 (전체)
//	"lcmw3300",		// 스탬프 목록 조회
	"lcmw3310",		// 스탬프 new 체크
//	"lcmw3320",		// 스탬프 이벤트 상세
	"lcmw4000",		// 스마트영수증 캘린더 목록 조회
	"lcmw4020",		// 스마트영수증 일일 상세조회
	"lcmw4100",		// 스마트영수증 목록 조회
	"lcmw4110",		// 스마트영수증 삭제
//	"lcmw7200",		// 카드 간편 신청 이벤트 조회
	"lcmw7240",		// 카드 간편 신청
	"lcmwb110",		// 설정 비밀번호 변경
//	"lcmwb300",		// 푸쉬 알림 설정 리스트
//	"lcmwb310",		// 푸쉬 알림 설정
	"lcmwd011",		// 모바일 명세서
	
	"LCMW2100"		// 제휴쿠폰몰
 ];

// 비회원 페이지 목록
var noMemList = [
	"LCMW3000",		// 카드결제
	"LCMW3100",		// 멤버십
	"LCMW3200",		// 보유쿠폰
	"LCMW3300",		// 스탬프
	"LCMW3400",		// 바로결제
	"LCMW4000"		// 스마트 영수증 캘린더
];

// 구간 암호화 사용 목록
var xecureList = [
// 	"lcmw2090"		// 바코드 복호화
 	"lcmw7220",
 	"lcmw7221",
 	"lcmw7240",
 	"lcmwc200",
 	"lcmwc201",
 	"lcmwc300",
 	"lcmw3011",
 	"lcmw3010"
];

// url 체크
function urlChk(tmpList, url){
	var result = false;
	for(var i = 0; i < tmpList.length; i++){
		if(url.match(tmpList[i])) result =  true;
	}
	return result;
}

//모바일 명세서 --------------------------------------------------------------
var mobileBillData = {
		cd_cno					: "",
		mbrno					: "",
		stt_dt					: "",
		lotte_amex_dc			: "",
		type					: "",
		page_no					: 1,
		page_rows				: 30,
		bll_prt_ord_c			: "",
		chk_cd_u_am_toCurrency	: "",
		bll_unit_no				: "",
		bll_prt_ord_c			: "",
		accno_dc				: "",
		curpage					: 1
};
var mobileBillResult = null;
var mobileBillDetail = null;
var mobileBillDetailList = null;
function mobileBill(flag){
	if(userInfo.wallet_member == "N"){
		appConfirm("알림", "회원가입이 필요한 메뉴입니다.\n회원가입 화면으로 이동하시겠습니까?", "확인", "취소", function(){
			joinMember();
		}, function(){
		});
	}else{
		if(loginInfo.logined == "Y"){
			if(userInfo.ccd_mbyn == "N"){
				appAlert("알림", "본 메뉴는 카드회원만 이용 가능합니다.", "확인");
			}else{
				if(!flag){
					mobileBillData.mbrno			= "";
					mobileBillData.stt_dt			= "";
					mobileBillData.lotte_amex_dc	= "";
					mobileBillData.bll_unit_no		= "";
				}
				commPage("T", "lcmwd011", mobileBillData, resultLCMWD011);
			}
		}else{
			appConfirm("알림", "로그인 후 이용하 실 수 있습니다.\n로그인 페이지로 이동하시겠습니까?", "확인", "취소", function(){
				pageLoad("LCMWC000", "C", "L");
			}, function(){
			});
		}
	}
}

function resultLCMWD011(resultData){
	if(resultData.free.resultStatus == "fail"){
		appAlert("알림", resultData.free.resultMsg, "확인");
		smartReceiptBackData.state = false;
//		jq("#leftBtn").click();
	}else{
		mobileBillResult = resultData;
		commPage('P', 'LCMWD011','', 'Y');
	}
}
//모바일 명세서 --------------------------------------------------------------


// 스마트 영수증 조회 ---------------------------------------------------------
var smsBackPage;
var smart_pay;
var smartReceiptBackData = {
		state		: false,
		year		: null,
		month		: null,
		day			: null,
		scrollTop	: null,
		pageNo		: null
};
function smartReceipt(cd_apr_seq, apr_can_yn, pageUrl){
	smsBackPage = pageUrl;
	var params = {
			cd_apr_seq	: cd_apr_seq,
			apr_can_yn	: apr_can_yn
	};
	
	if(pushInfo.code != ""){	// 광고 미시청 영수증
		commPage("T", "lcmw4091", params, resultSmartReceipt);
	}else{						// 광고 시청 영수증
		commPage("T", "lcmw4092", params, resultSmartReceipt);
	}
}

// 스마트 영수증 조회 결과
function resultSmartReceipt(resultData){

	var membersData = resultData.SMART_USER_INFO;
	userInfo.card_m_agree = membersData.IS_CREDIT_CARD_M_AGREE;//멤버스 정보제공 동의
	userInfo.ccd_mbyn = membersData.IS_CREDIT_CARD_MEMBER;//신용카드 회원 여부

	smart_pay = resultData;
	if(userInfo.sms_join != "Y"){
        if(pushInfo!=undefined||pushInfo!=""){
            smart_pay.RESULT_4013 = resultData;
            smart_pay.RESULT_4011 = {
                CD_APR_SEQ : pushInfo.param,
                APR_CAN_YN : pushInfo.aprYn
            };
        }
	}
	commPage("P", "LCMW4900", "", "Y");
}
//스마트 영수증 조회 ---------------------------------------------------------

// 앱카드 ------------------------------------------------------------------
// 앱카드 취소 정보 조회
function payCancel(cd_apr_seq, mc_nm, apr_am, backUrl){
	pageObj.cd_apr_seq = cd_apr_seq;
	pageObj.mc_nm = mc_nm;
	pageObj.apr_am = apr_am;
	pageObj.backUrl = backUrl;
	
	busyState.hide = false;
	var params = {
			cd_apr_seq : pageObj.cd_apr_seq
	};
	commPage("T", "lcmw4040", params, resultLCMW4040);
}

//앱카드 취소 정보 조회 결과
function resultLCMW4040 (resultData){
	pageObj.card_no		= resultData.CDNO;
	pageObj.card_name	= (resultData.VT_CD_KND_NM == "") ? "롯데카드" : resultData.VT_CD_KND_NM;
	pageObj.card_url	= resultData.CD_IMG_URL;
	pageObj.pay_date	= dateComma(resultData.DE_DT) + " " + resultData.DE_TI.substr(0, 2) + ":" + resultData.DE_TI.substr(2, 2);
	pageObj.barcode		= resultData.TAPD_CDNO;
	
	// 사인 이미지, 제휴사 코드 조회
	busyState.hide = true;
	var params = {
			card_class_code	: resultData.UNIT_CD_C		// 단위카드 코드
	};
	commPage("T", "lcmw3011", params, resultLCMW3011);
}

// 사인 이미지, 제휴사 코드 조회 결과
function resultLCMW3011(resultData){
	var data =	"card_no="		+ pageObj.card_no 						+   // 마스킹 카드번호
				";card_name="	+ pageObj.card_name						+	// 카드명
				";card_url="	+ pageObj.card_url						+   // 카드 이미지
				";mc_name="		+ pageObj.mc_nm							+   // 가맹점명
				";pay_value="	+ pageObj.apr_am						+  	// 결제금액
				";pay_date="	+ pageObj.pay_date						+	// 결제일
				";pay_code="	+											// 결제 코드
				";valid_date="	+ "89/11"                 			 	+	// 유효기간
				";user_name="	+ getMaskingName(userInfo.ur_nm)		+	// 사용자 이름
				";sign_image="	+ resultData.ELC_SIGN_V					+	// sign 이미지
				";time="		+ "0"									+	// 유효시간
				";title="		+ "결제취소"								+	// 제목
				";barcode="		+ pageObj.barcode + resultData.CCO_CD_C	+	// OTC + 제휴카드코드
				";callback="	+ "callBackAppCard"						+	// 종료시 호출
				";cbParam="		+ pageObj.backUrl;							// 종료 호출시 파라메터
	callNtv(null, null, "DevicePlugin", "showAppCardView", [data]);

}
//앱카드 ------------------------------------------------------------------

// 푸쉬 -------------------------------------------------------------------
// code 
// 01 : 쿠폰
// 02 : 만기쿠폰
// 03 : 혜택 알림
// 04 : 결제 (승인 - 스마트 영수증)
// 05 : 스탬프
// 06 : 이벤트
function runPush(data){
	if(userInfo.wallet_member == "Y"){
		pushInfo.code = data.split("|")[0];
		pushInfo.param = data.split("|")[1];
		pushInfo.realPush = "Y";
		if(data.split("|")[3]){
			if(pushInfo.code == "04") pushInfo.aprYn = data.split("|")[3];
		}else{
			if(pushInfo.code == "04") pushInfo.aprYn = data.split("|")[2];
		}
		
		// 쿠폰에 관련된 푸쉬를 받았을 경우 푸쉬를 통해 앱을 실행 시켰음을 서버로 전달
		if(pushInfo.code == "01" || pushInfo.code == "02"){
			busyState.show = false;
			var params = {
					cpon_id : pushInfo.param
			};
			tran.callTran("lcmw3210", params, function(){});
			busyState.show = true;
		}
		
		if(pushInfo.code == "06" || pushInfo.code == "05"){	// 이벤트 발생 - 이벤트는 로그인을 하지 않는다.
			commPage("P", "LCMW1000");
		}else{
			if(loginInfo.logined == "Y"){
				if(pushInfo.code == "01" || pushInfo.code == "02"){
					commPage('P', 'LCMW2000');
				}else if(pushInfo.code == "03"){			// 혜택알림
					if(pushInfo.param == "CMS"){	// CMS 혜택
						commPage('P', 'LCMW4200');
					}else{							// 알뜰 쿠폰 혜택
						commPage('P', 'LCMW4000');
					}
				}else{
					smartReceipt(pushInfo.param, pushInfo.aprYn, "LCMW0000");
				}
			}else{
				goLogin();
			}
		}
	}else{
		callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "현재 사용중인 기기의 사용자 정보가 변경되었습니다. 앱을 삭제후 다시 설치해주세요."]);
		return;
	}
}
//푸쉬 -------------------------------------------------------------------

// 공통 이벤트 상세 보기
function commEvnDetail(evnId){
	pageObj.evnId = evnId;
	var params = {
			evn_id	: evnId
	};
	commPage("T", "lcmw3320", params, resultLCMW3320);
}

// 공통 이벤트 상세 보기 결과
function resultLCMW3320(resultData){
	resultData.EVN_ID = pageObj.evnId;
	resultData.EVN_SDT = dateComma(resultData.EVN_SDT); 
	resultData.EVN_EDT = dateComma(resultData.EVN_EDT);
	resultData.TMP_EVN_NM = resultData.EVN_NM.replace(/'/g, "\\'");
	resultData.OPEN_EVENT = "";
	if(resultData.EVN_URL != ""){
		resultData.OPEN_EVENT = "<div class=\"tc mt20\"><a onclick=\"webPage('" + resultData.EVN_URL + "');\" class=\"btn_31\">이벤트 바로가기</a></div>";
	}
	jq("#eventDetailPop").html(bindData(jq("#eventDetailTmpl").val(), resultData));
	initFullPop("evnBtnPop", {
		leftBtn		: true,
		rightBtn	: true
	});
	jq(".evnBtnPop").click();
}

// 공통 쿠폰 상세 보기
function commCpnDetail(cponId){
	var params = {
			cpon_id	: cponId
	};
	commPage("T", "lcmw2060", params, resultLCMW2060);
}

// 공통 쿠폰 상세보기 결과
function resultLCMW2060(resultData){
//	resultData.EVN_ID = pageObj.evnId;
	resultData.CMS_CPON = "none";
	resultData.MW_CPON = "none";
	(resultData.CPON_SYS_DC == "CMS") ? resultData.CMS_CPON = "block" : resultData.MW_CPON = "block"; 

	jq("#eventDetailPop").html(bindData(jq("#cponDetailTmpl").val(), resultData));
	initFullPop("evnBtnPop", {
		leftBtn		: true
	});
	jq(".evnBtnPop").click();
}
// toast 팝업
function toastShow(msg){
	jq("#toast").css({"width":"", "left" : ""});
	jq("#toast").html(msg);
	var toastWidth = jq("#toast").width() + 40;
	if(toastWidth > (deviceInfo.winWidth * 80/100)){
		jq("#toast").css("width", (deviceInfo.winWidth * 80/100));
		toastWidth = jq("#toast").width() + 40;
	}
	jq("#toast").css("left", (deviceInfo.winWidth - toastWidth)/2);
	jq("#toast").fadeIn();
	setTimeout(function(){
		jq("#toast").fadeOut();
	}, 2000);
}

// 카드 상세 조회
function LCMW7100(unitCdC){
	if(unitCdC == ""){
		appAlert("알림", "선택한 카드의 상세 정보가 없습니다.", "확인");
	}else{
		var params = {
				unit_cd_c : unitCdC
		};
		commPage("T", 'lcmw7100', params, resultLCMW7100);
	}
}
// 카드 상세 조회 결과
var dataLcmw7100;
function resultLCMW7100(resultData){
	if(resultData.POPULARCARD_RESULT == "empty"){
		appAlert("알림", "선택한 카드의 상세 정보가 없습니다.", "확인");
	}else if(resultData.POPULARCARD_RESULT == "success"){
		dataLcmw7100 = resultData;
		commPage("P", "LCMW7100", "", "Y");
	}else{
		appAlert("알림", "서버 접속이 지연되고 있습니다.\n잠시 후 다시 실행해주세요.", "확인");
	}
};

// 약관 보기 조회
function LCMWC150(grpId, prvSeq, prvVerNo){
	var params = {
			grp_id		: grpId,		// 그룹ID
			prv_seq		: prvSeq,		// 약관일련번호
			prv_ver_no	: prvVerNo		// 약관버전번호
	};
	commPage("T", "lcmwc150", params, resultLCMWC150);
}

// 약관 보기 조회 결과
function resultLCMWC150(resultData){
	var tmpId = getSessionKey(3);
	resultData.PRV_SEQ = tmpId;
	resultData.PRV_CN = resultData.PRV_CN.replace(/\n/g, "<br/>");
	resultData.PRV_TIT_NM = resultData.PRV_TIT_NM.replace("- ", ""); 
	jq("#eventDetailPop").html(bindData(jq("#prvDetailTmpl").val(), resultData));
	initFullPop("evnBtnPop", {
		btnCount	: 1,
		contClass	: "doc_box",
		bgDark		: true
	});
	jq(".evnBtnPop").click();
};

// 회원가입 페이지 이동
function joinMember(){
	pageLoad("LCMWC100", "", "L");
}

// 로그인 페이지 이동
function goLogin(){
	pageLoad("LCMWC000", "", "L");
}

function goMembership(){
	joinMember();
}

function closeIntro(){
	callNtv(null, null, "DevicePlugin", "showMainpage", null);
}

function callBackAppCard(url){
	consoleLog("D", "callBackAppCard url : " + url);
	commPage("P", url);
}

var brightFlag = false;
function maxBright(flag){
	if(flag){
		brightFlag = true;
		callNtv(null, null, "DevicePlugin", "maxBrightOn", null);
	}else{
		if(brightFlag) callNtv(null, null, "DevicePlugin", "maxBrightOff", null);
		brightFlag = false;
	}
}

function cardApp(){
	if(userInfo.ccd_mbyn == "Y"){
		commPage("P", "LCMW7000", "", "Y");
	}else{
		// 카드신청 이벤트 조회
		commPage("T", "lcmw7200", "", resultLCMW7200);
	}
}

function cardApps(){
	commPage("P", "LCMW9600");
}

function resultLCMW7200(resultData){
	if(resultData.EVENT == "Y"){
		resultData.TMP_EVN_SDT = dateComma(resultData.EVN_SDT);
		resultData.TMP_EVN_EDT = dateComma(resultData.EVN_EDT);
		jq("#cardEventPop").html(bindData(jq("#cardEventTmpl").val(), resultData));
		
		initFullPop("evnBtnPop", {
			btnCount	: 1,
			btnEvent1	: "LCMW7000"
		});
		
		jq("#full_pop").hide();
		pageObj.tmpScrollTop = tmpScrollTop;
		jq(".evnBtnPop").click();
	}else{
		commPage("P", "LCMW7000", "", "Y");
	}
}

function LCMW7000(){
	jq(".f_pop_close").click();
	commPage("P", "LCMW7000", "", "Y");
}

function consoleLog(tag, text){
	if(tag == "D") tag = "DEBUG";
	if(tag == "I") tag = "INFO";
	if(tag == "E") tag = "ERROR";
	if(stateDev || tag == "E") console.log("[WEB-" + tag + "] " + text);
}

// messages.js 파일에 한글로 메세지를 정의 했을 경우 앱 최초 설치시 한글이 깨지는 현상 발생 워크라이트에서 기본제공하는 파일이 아닌 다른 파일에서 메세지 정의
var Messages = {
	loading : "롯데카드 클러치를 시작합니다.",
	rcvData : "데이터 수신 중",
	requestTimeout : "서버로부터 응답이 없습니다.",
	requestTimeoutInvokeProcedure : "서버로부터 응답이 지연되었습니다.",
	unresponsiveHost : "서버로부터 응답이 없습니다.\n통신상태를 점검하신 후 다시 시도하시기 바랍니다.",
	transactionFail : "서비스가 지연되고 있습니다.\n잠시 후 다시 시도하여 주십시오.",
	wasError : "서비스가 지연되고 있습니다.\n잠시 후 다시 시도하시기 바랍니다.",
	unexpectedError : "서비스에 불편을 드려 죄송합니다.\n잠시 후  다시 시도하여 주십시오.",
	informNotReady : "서비스 준비 중입니다.",
	informExit : "xxxx를 종료합니다.",
	exitError : "서비스에 불편을 드려 죄송합니다.\n알 수 없는 이유로 xxxx를 종료할 수 없습니다.\n수동으로 직접 종료하시기 바랍니다.",
	mTranKeyException : "보안키패드를 처리하기 위한 세션이 종료되었습니다.\n다시 한번 요청해주시기 바랍니다.",
	infoSettingSaved : "탐색범위가 설정되었습니다.",
	failtocertificate: "본인 인증을 처리하는데\n실패하였습니다."
};

WL.ClientMessages.wlclientInitFailure = "안내";
WL.ClientMessages.exitApplication = "종료";
WL.ClientMessages.reload = "재시도";
WL.ClientMessages.unexpectedError = Messages.unexpectedError;
WL.ClientMessages.requestTimeout = Messages.requestTimeout;
WL.ClientMessages.directUpdateNotificationTitle = '시스템 업데이트 안내';
WL.ClientMessages.directUpdateNotificationMessage = '클러치 서비스 이용을 위해 시스쳄 업데이트가 필요합니다. (파일 크기 {0} MB)';
WL.ClientMessages.directUpdateDownloadingMessage = '업데이트를 다운로드 하는 중 (단위 KB)';
WL.ClientMessages.directUpdateErrorTitle = '업데이트에 실패하였습니다';
WL.ClientMessages.directUpdateErrorMessageNotEnoughStorage = '기기에 충분한 공간이 없어 업데이트를 진행할 수 없습니다. (필요한 용량 = {0} MB, 사용가능한 용량 = {1} MB)';
WL.ClientMessages.directUpdateErrorMessageFailedDownloadingZipFile = '업데이트 다운로드에 실패하였습니다.';
WL.ClientMessages.directUpdateErrorMessageFailedProcessingZipFile = '업데이트 진행에 실패하였습니다.';
WL.ClientMessages.exit = '종료';
WL.ClientMessages.update = '업데이트';

WL.ClientMessages.applicationDenied = "앱 업데이트 안내";
WL.ClientMessages.close = '취소';
WL.ClientMessages.getNewVersion = "확인";
WL.ClientMessages.directUpdateNotificationTitle = '시스템 업데이트 안내';
WL.ClientMessages.directUpdateNotificationMessage = '클러치 서비스 이용을 위해 시스템 업데이트가 필요합니다. (파일 크기 {0} MB)';

// 워크라이트에서 제공하는 알럿, 컨펌창에서 안드로이드 back key를 누르면 닫히는 현상을 없애기위해 커스터마이징
_androidDialog = function() {
    this.__buttons = null;
    this.__dialog = null;

    this.__callback = function(result) {

        if (WL.Client.getEnvironment() === WL.Env.WINDOWS_PHONE || WL.Client.getEnvironment() === WL.Env.WINDOWS_PHONE_8) {
            // Nothing to do on WP, since there is no bug there
        } else if (WL.EnvProfile.isEnabled(WL.EPField.USES_CORDOVA)) {
            // Phonegap bug - native code returns button number instead of
            // button index
        	if (WL.StaticAppProps.ENVIRONMENT != WL.Environment.BLACKBERRY10){
        		result--;
        	}
            
        } else if (WL.StaticAppProps.ENVIRONMENT == WL.Environment.BLACKBERRY) {
        } else {
            customAlert.__dialog.hide();
            customAlert.__dialog = null;
        }
        
        // in case of invalid result value just clean up the array of buttons (otherwise next show will fail)
        if (result < 0 || result >= customAlert.__buttons.length) {
        	customAlert.__buttons = null;
        	customAlert.__dialog = null;
        	return;
        }

        var handler = customAlert.__buttons[result].handler;

        customAlert.__buttons = null;

        if (handler) {
            handler();
        }
    };

    var __validateButtonsObject = function(buttons, callerName) {
        if (!WL.Validators.isValidationEnabled) {
            return;
        }
        if ((!buttons) || (buttons.constructor !== Array) || (buttons.length == 0)) {
            WL.Validators.logAndThrow("Invalid argument value '" + buttons
                    + "', expected an array with button descriptors.", callerName);
        }
        for ( var i = 0; i < buttons.length; i++) {
            if (!buttons[i].text || typeof buttons[i].text !== 'string') {
                WL.Validators.logAndThrow("Invalid argument value '" + buttons
                        + "', button descriptor must contain text as string.", callerName);
            }
            if (buttons[i].handler && typeof buttons[i].handler !== 'function') {
                WL.Validators.logAndThrow("Invalid argument value '" + buttons
                        + "', button descriptor handler must be a function.", callerName);
            }
        }
    };

    /**
     * 
     * 
     * @param title
     *            The title of the dialog window
     * @param text
     *            The text in the dialog window
     * @param buttons
     *            An array of button descriptors and event handler functions.
     *            Example: [{text: "OK", handler: function() { ... }}, {text:
     *            "Cancel", handler: function() { ... }}]
     * @param option
     *            Optional. When native dialog is not available for the current
     *            environment. An object of the following form: { title: string,
     *            text: string }
     */
    this.show = function(title, text, buttons, options) {
        var wlDialogContainer = WLJSX.$('WLdialogContainer');
        if (!title && !text && wlDialogContainer) {
            WLJSX.css(wlDialogContainer, {
                display : 'block'
            });
            return;
        }
        if (customAlert.__buttons != null && WL.Client.getEnvironment() !== WL.Environment.WINDOWS8) {
            WL.Logger.error("customAlert.show() cannot be invoked while dialog is open");
            return;
        }

        WL.Validators.validateArguments([ 'string', 'string', __validateButtonsObject,
                WL.Validators.validateObjectOrNull ], arguments, 'customAlert.show');

        customAlert.__buttons = buttons;
        if (WL.EnvProfile.isEnabled(WL.EPField.USES_CORDOVA)) {
            var buttonsArray = [];
            for ( var i = 0; i < buttons.length; i++) {
            	// Phonegap uses comma as the button seperator,
                // so we can't use that. Replace commas with a similar character
                // (ascii code 130)
            	buttonsArray[i] = buttons[i].text.replace(",", "‚");
            }
            
            //For Android there is special case were dialog must be modal (no back)
            var isAndroidDirectUpdateCase = WL.StaticAppProps.ENVIRONMENT == WL.Env.ANDROID && title == WL.ClientMessages.directUpdateNotificationTitle;
            
            if (WL.StaticAppProps.ENVIRONMENT == WL.Env.WINDOWS_PHONE || WL.StaticAppProps.ENVIRONMENT == WL.Env.WINDOWS_PHONE_8 || isAndroidDirectUpdateCase) {
            	var dialogPluginFunctionName = isAndroidDirectUpdateCase ? "confirm" : "showDialog";
            	cordova.exec(function (result) { customAlert.__callback(result); }, 
            			function (err) { WL.Logger.error("customAlert.show() error in invoking callback."); }, 
            			"WLCustomDialog", dialogPluginFunctionName, [text, title, buttonsArray.join(",")]);
            } else {
            	if(deviceInfo.os == "android"){
                    cordova.exec(function (result) { customAlert.__callback(result); }, 
                			null, 
                			"WLCustomDialog", "confirm", [text, title, buttonsArray.join(",")]);
            	}else{
            		navigator.notification.confirm(text, customAlert.__callback, title, buttonsArray.join(","));
            	}

            }
        } else if (WL.StaticAppProps.ENVIRONMENT == WL.Environment.BLACKBERRY) {
            var buttonTitlesArray = new Array();
            for ( var i = 0; i < buttons.length; i++) {
                buttonTitlesArray.push(buttons[i].text);
            }
            var result = blackberry.ui.dialog.customAsk(title + "\n\n" + text, buttonTitlesArray, 0, true);
            this.__callback(result);
        } else if (WL.StaticAppProps.ENVIRONMENT == WL.Environment.WINDOWS8) {
            var messageDialog = new Windows.UI.Popups.MessageDialog(text, title);
            for (var i = 0; i< buttons.length; i += 1) {
                messageDialog.commands.append(new Windows.UI.Popups.UICommand(buttons[i].text, buttons[i].handler));
            }
            messageDialog.showAsync();
        } else {
            var dialogOptions = options || {};

            this.__dialog = new WL.Dialog("content", dialogOptions);

            var message = '<p>' + text + '</p>';
            for ( var i = 0; i < buttons.length; i++) {
                message += '<button type="button" class="dialogButton" tabIndex="' + i + '">' + buttons[i].text
                        + '</button>';
            }

            this.__dialog.setTitle(title);
            this.__dialog.setText(message);
            this.__dialog.show();
            var dialogButtons = WLJSX.$$('.dialogButton');
            for ( var i = 0; i < dialogButtons.length; i++) {
                WLJSX.bind(dialogButtons[i], 'click', function(event) {
                    customAlert.__callback(WLJSX.eventTarget(event).tabIndex);
                    return false;
                });
            }
        }
    };
};
var customAlert = new _androidDialog;
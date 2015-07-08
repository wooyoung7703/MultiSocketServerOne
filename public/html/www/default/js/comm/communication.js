
/* JavaScript content from js/comm/communication.js in folder common */
////////////////////////////////////////////////
// communication common javascript
////////////////////////////////////////////////

var MWTranCtrl = {
		mSessionId			: "",
		mAdapterID			: "lcmwAdt",
		mCommonProcedure	: "commonTran",
		mEncrypt			: true
};

//회원가입 및 로그인에 따른 변수정의
var telNo = "1588-8100";  //롯데카드 대표번호
var ccd_mbyn = "";        //카드회원여부
var card_m_agree = "";    //멤버스정보제공동의여부
var members_member = "";  //멤버스회원여부
var members_active = "";  //멥버스유효카드여부
var card_cert =  "";      //카드인증여부

TranCtrl = WLJSX.Class.create( {

	busy : null,
	
	time : null,

	initialize : function() {
		this.busy = new WL.BusyIndicator("content", {text:Messages.rcvData});
	},
	
	showBusy : function() {
		
		if(busyState.show){
			if(navigator.userAgent.toLowerCase().match("windows")){
				this.busy.show();	
			}else{
				cordova.exec(null,null,"DevicePlugin","showLoadingDialog",[]);
			}
		}
		this.time = new Date();
	},
	
	hideBusy : function() {
		if(busyState.hide){
			if(navigator.userAgent.toLowerCase().match("windows")){
				this.busy.hide();
			}else{
				cordova.exec(null,null,"DevicePlugin","hideLoadingDialog",[]);
			}
		}
		var endTime = new Date();
		consoleLog("I", ">>>>> hideBusy <<<<< 서버 소요시간 : " + (endTime - this.time) / 1000);
	},
	
	tranParams : function(params) {
		params = objectToQueryString(params);
		params += "&term_natv_no=" + deviceInfo.uuid;
		params += "&logined=" + loginInfo.logined;
		params += setRequestTimeStamp();
		return params;
	},
	// 월렛 공통 트랜잭션 처리
	// encrypt : 암호화 비 암호화 처리 (true - 암호화) 
	callTran : function(tranid, params, callBackFunction, encrypt) {
		if(MWTranCtrl.mEncrypt){
			encrypt = urlChk(xecureList, tranid);
		}else{
			encrypt = false;
		}
		
		var serverParams = {
				serverId			: tranid.substr(4, 2),
				adapterid			: MWTranCtrl.mAdapterID,
				procedureid			: MWTranCtrl.mCommonProcedure,
				tranid				: tranid,
				server_key			: MWTranCtrl.mSessionId,
				userAgent			: navigator.userAgent,
				params				: this.tranParams(params)
		};

		var clientParams = {
				callBackFunction	: callBackFunction,
				isEncrypt			: encrypt
		};
		
		this.callCommTran(serverParams, clientParams);
	},
	// 트랜잭션 처리 공통 함수
	callCommTran : function(serverParams, clientParams) {	
		this.showBusy();
		adobeLogSet(serverParams.tranid);
		// INVOKATION DATA DETAILS
		var invocationData = {
			adapter			: serverParams.adapterid,
			procedure		: serverParams.procedureid,
			parameters		: [ serverParams, clientParams ]
		};
//		delay(200);
		// INVOKE PROCEDURE
		WL.Client.invokeProcedure(invocationData, {
			onSuccess	: onTranSuccess.bind(this),
			onFailure	: onTranFail.bind(this)
		});
		
		////////////////////////////
//		bgnDate = new Date();
		////////////////////////////

		function onTranSuccess(response) {
			this.hideBusy();
			try {
				consoleLog("I", ">>>>> onTranSuccess : " + response.invocationResult.isSuccessful + " ////// " +  response.invocationResult.wl_response);
				if(response.invocationResult.isSuccessful && response.invocationResult.wl_response != undefined){
					inspectResult(response.invocationResult.wl_response, serverParams.serverId, clientParams.callBackFunction);
				} else {
					busyState.hide = true;
					this.hideBusy();
					throw new Error(Messages.transactionFail);
				}
			} catch (e) {
				busyState.hide = true;
				this.hideBusy();
				showErrorScr("onTranSuccess", e.message);
			}
		}

		function onTranFail(response) {
			busyState.hide = true;
			this.hideBusy();
			//main.appAlert('알림',Messages.unexpectedError,'확인');
			WL.Logger.debug(">>>>>>>>>>>>>> Unexpected Error occurred...");
			WL.Logger.debug(">>>>>>>>>>>>>> response.errorCode : " + response.errorCode);
			//WL.Logger.debug(">>>>>>>>>>>>>> response.errorMsg : " + response.errorMsg);
			
			/*
			 // invokeProcedure의 실패 시 응답 errorCode는 아래와 같다.
			 // 특이 케이스에 대하여 메시지를 추가하려면 아래의 케이스를 참조할 것.
			 WL.ErrorCode = {
			    UNEXPECTED_ERROR        : "UNEXPECTED_ERROR",
			    API_INVOCATION_FAILURE  : "API_INVOCATION_FAILURE",
			    USER_INSTANCE_ACCESS_VIOLATION : "USER_INSTANCE_ACCESS_VIOLATION",
			    AUTHENTICATION_REQUIRED : "AUTHENTICATION_REQUIRED",
			    DOMAIN_ACCESS_FORBIDDEN : "DOMAIN_ACCESS_FORBIDDEN",
			    APP_VERSION_ACCESS_DENIAL : "APP_VERSION_ACCESS_DENIAL",
			    
			    // Client Side Errors
			    UNRESPONSIVE_HOST   : "UNRESPONSIVE_HOST",
			    LOGIN_FAILURE       : "LOGIN_FAILURE",
			    REQUEST_TIMEOUT     : "REQUEST_TIMEOUT",
			    PROCEDURE_ERROR     : "PROCEDURE_ERROR",
			    UNSUPPORTED_VERSION : "UNSUPPORTED_VERSION",
			    UNSUPPORTED_BROWSER : "UNSUPPORTED_BROWSER",
			    DISABLED_COOKIES    : "DISABLED_COOKIES" 
			}
			  
			 */
			if(response.errorCode == WL.ErrorCode.REQUEST_TIMEOUT) {	// timeout
				showErrorScr("WL.ErrorCode.REQUEST_TIMEOUT", Messages.requestTimeoutInvokeProcedure);
//				appAlert('알림', Messages.requestTimeoutInvokeProcedure, '확인');
			} else if(response.errorCode == WL.ErrorCode.UNRESPONSIVE_HOST) {	// timeout
				showErrorScr("WL.ErrorCode.UNRESPONSIVE_HOST", Messages.unresponsiveHost);
			} else {
				showErrorScr("onTranFail", Messages.unexpectedError);
			}
		}
	}
});

function delay(gap){
	var then = new Date();
	var now = then;
	while((now - then) < gap){
		now = new Date();
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var isEnc = function(parameters) {
	///////////////////////////////////////	
	//return false;
	///////////////////////////////////////
	
	//@@FAS@@var wlParamsArr = parameters.evalJSON();
	var wlParamsArr = WLJSX.String.evalJSON(parameters);

	var clientParams = wlParamsArr[1];
	
	if(clientParams || clientParams.isEncrypt) {
		return clientParams.isEncrypt;
	} else {
		return false;
	}
};

var XecureAjaxTimeoutCheckStarted = false;
var XecureAjaxTimeoutWLRequestObj = null;
var XecureAjaxTimeoutTimer = null;

WLJSX.Ajax.WLRequest.prototype.sendRequest = function() {
	WL.Logger.debug("Request [" + this.url + "]");
    // Update the random before every request to prevent caching.
    this.options.parameters.x = Math.random();

	if(this.url.indexOf("http") == 0 && this.url.substring(this.url.length-5) == "query") {
	//@@FAS@@if(this.url.indexOf("/apps/services/api/") == 0 && this.url.substring(this.url.length-5) == "query") {

		if(isEnc(this.options.parameters.parameters)) {

			consoleLog("I", "using Xecure!!!!!!!!!!!!!");
			var reqArgs = {
					wlRequestObj : this
			};
			// 여기서 타임아웃을 걸어 주어야 한다.
			XecureAjaxTimeoutCheckStarted = true;
			XecureAjaxTimeoutWLRequestObj = this;
			XecureAjaxTimeoutTimer = setTimeout(
					   function() { // worklight보다 1초 늦게 타임아웃을 걸고 암호화 시간초과 체크한다.
						if (XecureAjaxTimeoutCheckStarted == true) {
							JobQueue.isRun = false;
							
							var transport = {};
							
							WLJSX.Ajax.WLRequest.setConnected(false);
							
							transport.responseJSON = {
								errorCode: WL.ErrorCode.REQUEST_TIMEOUT,
								errorMsg:  WL.ClientMessages.requestTimeout};
							
							XecureAjaxTimeoutWLRequestObj.options.onFailure(transport);
							
							XecureAjaxTimeoutTimer = null;
							XecureAjaxTimeoutCheckStarted = false;
							XecureAjaxTimeoutWLRequestObj = null;
						}
					}, parseInt(this.options.timeout) + 1000);
			
			//@@FAS@@XecureAjax(reqArgs, Object.toQueryString(this.options.parameters), "xencCallBack");
			//XecureAjax(reqArgs, objectToQueryString(this.options.parameters), "xencCallBack");
			XecureAjax(reqArgs, WLJSX.Object.toQueryString(this.options.parameters), "xencCallBack");

		} else {
			finalCall(this);
		}
	} else {
		finalCall(this);
	}
};

var xencCallBack = function(result) {
	//WL.Logger.debug("encResult.q : "+result.q);
	clearTimeout(XecureAjaxTimeoutTimer);
	XecureAjaxTimeoutCheckStarted = false;
	XecureAjaxTimeoutWLRequestObj = null;
	
	var wlRequestObj = result.reqArgs.wlRequestObj;
	wlRequestObj.options.parameters = "q="+result.q+"&charset=UTF-8";
	
	//console.log("wlRequestObj.options.parameters = [" + wlRequestObj.options.parameters + "]");
	
	finalCall(wlRequestObj);
	
};

var finalCall = function(wlRequestObj) {

//	wlRequestObj.options.requestHeaders = WL.CookieManager.createCookieHeaders();
//	wlRequestObj.options.requestHeaders["x-wl-app-version"] = WL.StaticAppProps.APP_VERSION;
//   
//    if (wlRequestObj.options.timeout > 0) {
//    	wlRequestObj.timeoutTimer = window.setTimeout(wlRequestObj.handleTimeout.bind(wlRequestObj), wlRequestObj.options.timeout);
//    }
//    new WLJSX.Ajax.Request(wlRequestObj.url, wlRequestObj.options);

    var shouldPostAnswers = false;
    //add headers
    if (typeof(requestHeaders) === 'undefined'){
    	wlRequestObj.options.requestHeaders = wlRequestObj.createRequestHeaders();
    } else {
    	wlRequestObj.options.requestHeaders = requestHeaders;
    }
    
    var postAnswersOptions = {};
	
	//check if we need to send the auth header in the body, becuase it is too large or the total header size is too large
    var allHeadersSize = WLJSX.Object.toJSON(wlRequestObj.options.requestHeaders).length;
    var authHeaderSize = typeof(wlRequestObj.options.requestHeaders.Authorization) === 'undefined' ? -1 : 
    	WLJSX.Object.toJSON(wlRequestObj.options.requestHeaders.Authorization).length;
    
    if ((allHeadersSize > wlRequestObj.MAX_TOTAL_HEADER_SIZE || authHeaderSize > wlRequestObj.MAX_AUTH_HEADER_SIZE) && authHeaderSize >-1 ){
    	
    	postAnswersOptions = WL.Utils.extend(postAnswersOptions, wlRequestObj.options);
        postAnswersOptions.requestHeaders = wlRequestObj.options.requestHeaders;
    	postAnswersOptions.onSuccess = wlRequestObj.onPostAnswersSuccess.bind(wlRequestObj);
    	postAnswersOptions.onFailure = wlRequestObj.onPostAnswersFailure.bind(wlRequestObj);
    	
    	postAnswersOptions.postBody = wlRequestObj.options.requestHeaders.Authorization;
    	postAnswersOptions.requestHeaders.Authorization = 'wl-authorization-in-body';
    	wlRequestObj.wlAnswers = {};
    	shouldPostAnswers = true;
    }
    
    if (typeof(wlRequestObj.options.requestHeaders.Authorization) !== 'undefined') {
        //init the wlAnswer map...
    	wlRequestObj.wlAnswers = {};
    }

	if (wlRequestObj.options.timeout > 0) {
		wlRequestObj.timeoutTimer = window.setTimeout(wlRequestObj.handleTimeout.bind(wlRequestObj), wlRequestObj.options.timeout);
    }

    if (shouldPostAnswers){
    	authenticateNewUrl = WL.Utils.createAPIRequestURL('authenticate');
    	new WLJSX.Ajax.Request(authenticateNewUrl, postAnswersOptions);
    } else {
    	new WLJSX.Ajax.Request(wlRequestObj.url, wlRequestObj.options);
    }
};


var xdecCallBack = function(result) {

	var decResult = ""+new String(result.aPlain);

	var transportAfterDecryption = result.resArgs.transport;
	transportAfterDecryption.responseText = decResult;

	//console.log("@@ FAS Test @@ transport2 : "+transportAfterDecryption);
	//console.log("@@ FAS Test @@ transport3 : "+JSON.stringify(transportAfterDecryption));

	var tranJson = transportAfterDecryption;

	try {
		//console.log("tranJson.responseText : "+tranJson.responseText);
		//console.log("tranJson.request.options.sanitizeJSON : "+tranJson.request.options.sanitizeJSON);
		//console.log("tranJson.request.isSameOrigin() : "+tranJson.request.isSameOrigin());

		transportAfterDecryption.responseJSON = WLJSX.String.evalJSON(tranJson.responseText, (tranJson.request.options.sanitizeJSON || !tranJson.request.isSameOrigin()));

	} catch (e) {
		if (!tranJson.request.options.evalJSON
			|| (tranJson.request.options.evalJSON != 'force' && (tranJson.getHeader('Content-type') || '').indexOf('application/json') < 0)
			|| WLJSX.String.isBlank(tranJson.responseText))
			transportAfterDecryption.responseJSON = null;
		else
			tranJson.request.dispatchException(e);
	}

	result.resArgs.orgOnSuccess(transportAfterDecryption);
};


WLJSX.Ajax.WLRequest.options.onCreate = function(response) {
	var request = response.request;
	//console.log("==============================================================================");
	//console.log("@@ WLJSX.Ajax.WLRequest.options.onCreate : "+JSON.stringify(request));
	//console.log("------------------------------------------------------------------------------");
	//console.log("-- request.url : "+request.url);

	if(request.url.indexOf("http") == 0 && request.url.substring(request.url.length-5) == "query") {

		request.options.postBody = WLJSX.Object.toQueryString(request.parameters);

		var orgOnSuccess = request.options.onSuccess;

		request.options.onSuccess = function(transport) {
			var responseText = transport.responseText;
			if(responseText.indexOf("/**-xecure-*/") == 0) {
				var unfilterResponseText = responseText.substring(13);
				var resArgs = {
					orgOnSuccess : orgOnSuccess
					, transport : transport
				};
				BlockDecAjax(resArgs, ""+new String(unfilterResponseText), "xdecCallBack");
			}
			else {
				orgOnSuccess(transport);
			}
		};
	}
};


WLJSX.Ajax.Response.prototype._getResponseJSON = function() {

	var options = this.request.options;

	if(this.responseText.indexOf("/**-xecure-*/") == 0) {
		return null;
	}

	try {
		return WLJSX.String.evalJSON(this.responseText, (options.sanitizeJSON || !this.request.isSameOrigin()));
	} catch (e) {
		if (!options.evalJSON
			|| (options.evalJSON != 'force' && (this.getHeader('Content-type') || '').indexOf('application/json') < 0)
			|| WLJSX.String.isBlank(this.responseText))
			return null;
		else
			this.request.dispatchException(e);
	}
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//서버에 Request 후 Response 결과가 일정시간(10-15초)이 지난 후에 없을 경우, Request를 재전송하여 
//이중처리되는 하는 문제 해결을 위해 Request 시점에 TimeStamp를 붙여 WAS에서 SESSION 관리를 통해
//해결하기 위해 만듬. 이중처리 문제는 삼성 안드로이드 계열의 스마트폰에서 발생.
var setRequestTimeStamp = function() {
	var date = new Date();
	 
	var current_time = 	"&CLIENT_TIMESTAMP="+
						date.getYear() 		+ 
						date.getMonth() 	+ 
						date.getDay() 		+ 
						date.getHours() 	+ 
						date.getMinutes() 	+ 
						date.getSeconds() 	+ 
						date.getMilliseconds();
	 
	return current_time;  
};

var nullCheck = function (tmp) {
    var chk = 1;
    if(tmp==undefined||tmp.length==0||tmp=="")
        chk = 0;
    return chk;
};

var setPageNum = function(ccd_mbyn2,card_m_agree2,members_member2,members_active2,card_cert2){
	
    ccd_mbyn = (ccd_mbyn2 == "Y" ? "Y" : "N");
    card_m_agree = (card_m_agree2 == "N" ? "N" : "Y");
    members_member = (members_member2 == "Y" ? "Y" : "N");
    members_active = (members_active2 == "Y" ? "Y" : "N");
    card_cert = (card_cert2 == "Y" ? "Y" : "N");
    
    //모든조건 충족시 메인페이지 호출
    if(ccd_mbyn=="Y"&&card_m_agree=="Y"&&members_member=="Y"&&members_active=="Y"&&card_cert=="Y")
    	return 8;

    var conpage = ccd_mbyn+card_m_agree+members_member+card_cert;//카드회원, 멤버스정보제공동의, 멤버스회원여부, 카드인증여부
    if(conpage=="YNNY"||conpage=="YNNN")        //*멤버스 정보제공 동의가 안되어 정보제공 동의로 유도   ***
        return 1;
    if(conpage=="YNYY"||conpage=="YNYN")        //*멤버스 정보제공 동의가 안되어 정보제공 동의로 유도   ***
        return 2;
    if(conpage=="YYYY")
        return 3;
    if(conpage=="YYYN")
        return 4;
    if(conpage=="YYNN"||conpage=="YYNY")
        return 5;
    if(conpage=="NNYN"||conpage=="NYYN")        //*카드회원이 아니기 때문에 카드인증여부는 N만존재     ***
        return 6;
    if(conpage=="NNNN")        //*                                        ***
        return 7;
    
};

function goPageNum(pageNum , type){

	certInfo.type = type;
	var mStrMembers = "사용 가능한 L.POINT 카드가 없습니다.\n포인트 적립을 위해 L.POINT 카드\n발급 절차를 진행합니다.";
	if(members_member=="N")
		mStrMembers = "L.POINT 회원이 아닙니다.\n포인트 적립/조회를 위해 L.POINT\n회원 가입 절차를 진행합니다.";

    switch(pageNum) {
    case 1:
        //멤버스 정보제공 동의 채널로 유도(미동의시 클러치 이용불가 안내)
        if(deviceInfo.os=="android"){
			appAlertOne("알림", "고객님께서는 현재 L.POINT\n정보제공에 동의하지 않으셔서\n클러치 서비스 이용이 불가하십니다.\n정보제공 동의 시, 즉시 이용이\n가능하오니 롯데카드 고객센터\nARS(" + telNo + ")로 문의하시기 바랍니다.", "확인", function(){
	            callNtv("successCallphone", null, "DevicePlugin", "callPhone", [telNo, "ARS(" + telNo + ")로 연결합니다."]);
        		callNtv(null, null, "DevicePlugin", "saveData", ["","","","autoLogin","N"]);
        		setLoginInfo(false);
        		goMain();
			});
        }else{
			appAlertOne("알림", "고객님께서는 현재 L.POINT\n정보제공에 동의하지 않으셔서\n클러치 서비스 이용이 불가하십니다.\n정보제공 동의 시, 즉시 이용이\n가능하오니 롯데카드 고객센터\nARS(" + telNo + ")로 문의하시기 바랍니다.", "확인", function(){
                location.href="tel:" + telNo;
        		callNtv(null, null, "DevicePlugin", "saveData", ["","","","autoLogin","N"]);
        		setLoginInfo(false);
        		goMain();
			});
        }
        break;
    case 2:
        //멤버스 정보제공 동의 채널로 유도(미동의시 클러치 이용불가 안내)
        if(deviceInfo.os=="android"){
			appAlertOne("알림", "고객님께서는 현재 L.POINT\n정보제공에 동의하지 않으셔서\n클러치 서비스 이용이 불가하십니다.\n정보제공 동의 시, 즉시 이용이\n가능하오니 롯데카드 고객센터\nARS(" + telNo + ")로 문의하시기 바랍니다.", "확인", function(){
	            callNtv("successCallphone", null, "DevicePlugin", "callPhone", [telNo, "ARS(" + telNo + ")로 연결합니다."]);
        		callNtv(null, null, "DevicePlugin", "saveData", ["","","","autoLogin","N"]);
        		setLoginInfo(false);
        		goMain();
			});
        }else{
			appAlertOne("알림", "고객님께서는 현재 L.POINT\n정보제공에 동의하지 않으셔서\n클러치 서비스 이용이 불가하십니다.\n정보제공 동의 시, 즉시 이용이\n가능하오니 롯데카드 고객센터\nARS(" + telNo + ")로 문의하시기 바랍니다.", "확인", function(){
                location.href="tel:" + telNo;
        		callNtv(null, null, "DevicePlugin", "saveData", ["","","","autoLogin","N"]);
        		setLoginInfo(false);
        		goMain();
			});
        }
        break;
    case 3:
        if(members_active=="Y"){
        	if(type=="C000"||type=="main"){
        	}else{
                commPage("P", "LCMWC300", certInfo, "L");//비밀번호 설정
        	}
        }else{//멤버스유효카드 없으면
        	if(type=="C000"||type=="main"){
                appConfirm("알림", mStrMembers, "확인", "취소", function(){
                	commPage("P", "LCMW3151", "", "L");
                }, function(){
                });
        	}else{
                commPage("P", "LCMW3151", pageObj.certInfo, "L");
        	}
        }
        break;
    case 4:
        if(members_active=="Y"){
        	if(type=="C000"||type=="main"){
    			appConfirm("알림", "안전한 클러치 서비스 이용을 위해 카드인증을 해주세요.", "카드인증", "종료", function(){
    				commPage("P", "LCMW3090", "", "L");
    			}, function(){
    				callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "카드인증이 완료되지 않으면 서비스 이용이 불가합니다."]);
    			});
        	}else{
                commPage("P", "LCMW3093", pageObj.certInfo, "L");//카드인증 이동
        	}
        }else{
        	if(type=="C000"||type=="main"){
                appConfirm("알림", mStrMembers, "확인", "취소", function(){
                	commPage("P", "LCMW3151", "", "L");
                }, function(){
                });
        	}else{
                commPage("P", "LCMW3151", pageObj.certInfo, "L");
        	}
        }
        break;
    case 5:
        //멤버스 회원가입 프로세스
    	if(type=="C000"||type=="main"){
            appConfirm("알림", mStrMembers, "확인", "취소", function(){
            	commPage("P", "LCMW3151", "", "L");
            }, function(){
            });
    	}else{
            commPage("P", "LCMW3151", pageObj.certInfo, "L");
    	}
        break;
    case 6:
        if(members_active=="Y"){
        	if(type=="C000"||type=="main"){
        	}else{
                commPage("P", "LCMWC300", pageObj.certInfo, "L");//비밀번호 설정
        	}
        }else{//멤버스유효카드 없으면
        	if(type=="C000"||type=="main"){
                appConfirm("알림", mStrMembers, "확인", "취소", function(){
                	commPage("P", "LCMW3151", "", "L");
                }, function(){
                });
        	}else{
                commPage("P", "LCMW3151", pageObj.certInfo, "L");
        	}
        }
        break;
    case 7:
        //멤버스 회원가입 프로세스
    	if(type=="C000"||type=="main"){
            appConfirm("알림", mStrMembers, "확인", "취소", function(){
            	commPage("P", "LCMW3151", "", "L");
            }, function(){
            });
    	}else{
            commPage("P", "LCMW3151", certInfo, "L");
    	}
        break;
    case 8:
    	if(type=="C000"||type=="main"){
        	if(pageObj.popupEventSet.POPUP_EVENT_SIZE==0){
            	goMain();
        	}
        }else{
        	if(type=="C400"){
                commPage("P", "LCMWC410", certInfo, "L");//비밀번호 설정
        	}else{
                commPage("P", "LCMWC300", certInfo, "L");//비밀번호 설정
        	}
        }
        break;
    case 9:
    	goMain();
    	break;
    default:
        break;
    }
    
}

function successCallphone(){
    goMain();
};


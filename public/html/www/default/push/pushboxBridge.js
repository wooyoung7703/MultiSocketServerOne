
/* JavaScript content from push/pushboxBridge.js in folder common */
/**
 * fPNS 시스템과 연동하는 기본 스크립트 정의
 * fPNSCustomizeParam Javascript 환경에 맞게 수정할수 있는 기본 파라메터들을 정의 하고 관리한다.
 */
var openPushBox = function(hasPush, page){
	alert("openPushBox\nhasPush : " + hasPush + "\npage : " + page);
	consoleLog("D", "openPushBox\nhasPush : " + hasPush + "\npage : " + page);
    if(page == null) page = "pushbox";

    param = new Object();
    param.url = "push/html/"+page+".html";
    param.callbackFunction = "pushboxCallback";
    param.AndroidClassName = 'com.financeallsolution.push.PushActivity';
    param.custparam = "CustomizeParamForNative";
    if(hasPush){
        param.newMessage = 'true';
    };
    Fpns.FasGap.startView(param);
};

var pushboxCallback = function(param){
    consoleLog("D", JSON.stringify(param));
    //mainCtrl.callFromPushBox(param);
};

var initMqtt = function () {

	var param = new Object();
	param.app_code = Fpns.MainAppCode;
	param.enabled = Fpns.CommConst.MQTT.ENABLED;
	param.host = Fpns.CommConst.MQTT.HOST;
	param.port = Fpns.CommConst.MQTT.PORT;
	param.username = Fpns.CommConst.MQTT.USERNAME;
	param.password = Fpns.CommConst.MQTT.PASSWORD;
	param.clean_session = Fpns.CommConst.MQTT.CLEAN_SESSION;
	param.use_ssl = Fpns.CommConst.MQTT.USE_SSL;
	param.lwt_topic = Fpns.CommConst.MQTT.LWT_TOPIC;
	param.lwt_msg = Fpns.CommConst.MQTT.LWT_MSG;
	param.qos = Fpns.CommConst.MQTT.QOS;
	param.result_send = Fpns.CommConst.MQTT.RESULT_SEND;
	
	// fPNS에 subscribe 등록 완료 후 MQTT클라이언트 초기화
    Fpns.FasGap.initMqttClient(null, param);
};

var setMqtt = function () {
	var param = new Object();
	param.app_code = Fpns.MainAppCode;
	
    Fpns.FasGap.setMqttClient(null, param);
};

var subscribeCallback = function(data) {
    if(data.returnVal.RESULT_CODE=='0000'){

        setMqtt();
        if(data.returnVal.DATA && data.returnVal.DATA.isFirst){
//            alert(Fpns.Messages.FIRST_LOGIN);
        }
    }

};

var pushAppSubscribeCallback = function(data) {
    if(data.returnVal.RESULT_CODE=='9105'){
    	/*
        WL.SimpleDialog.show(Fpns.Messages.ALERT_TITLE, Fpns.Messages.ALREADY_EXIST_USER,
                [
         {
             text:Fpns.Messages.ALERT_BUTTON2,
             handler: function () {}
         },
         {
            text:Fpns.Messages.ALERT_BUTTON1,
            handler: function() {
                var param = new Object();
                param.app_code = Fpns.MainAppCode;
                param.overwrite_user = "true";
                param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
                Fpns.FasGap.subscribe(subscribeCallback, param);

            }
        }
        ]);
        */
    	// 동의 확인 여부 없이 무조건 동의로 변경
        var param = new Object();
        param.app_code = Fpns.MainAppCode;
        param.overwrite_user = "true";
        param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
        Fpns.FasGap.subscribe(subscribeCallback, param);
    }else if(data.returnVal.RESULT_CODE=='0000'){
        setMqtt();
        if(data.returnVal.DATA && data.returnVal.DATA.isFirst){
            consoleLog("D", "data.returnVal.DATA.isFirst = " + data.returnVal.DATA.isFirst);
//            alert(Fpns.Messages.FIRST_LOGIN);
        }

    }else if(data.returnVal.RESULT_CODE=='9104'){
    	/*
        WL.SimpleDialog.show(Fpns.Messages.ALERT_TITLE, Fpns.Messages.ALREADY_EXIST_USER,
                [
        {
            text:Fpns.Messages.ALERT_BUTTON2,
            handler: function () {}
        },
         {
            text:Fpns.Messages.ALERT_BUTTON1,
            handler: function() {
                var param = new Object();
                param.app_code = Fpns.MainAppCode;
                param.overwrite_user = "true";
                param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
                Fpns.FasGap.subscribe(subscribeCallback, param);
            }
        }
        ]);
        */
    	// 동의 확인 여부 없이 무조건 동의로 변경
    	 var param = new Object();
         param.app_code = Fpns.MainAppCode;
         param.overwrite_user = "true";
         param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
         Fpns.FasGap.subscribe(subscribeCallback, param);
    }else{
        //alert(JSON.stringyfi(data));
    }
};

var ifOtherDevice = function(data) {
    if(data.returnVal.RESULT_CODE=='9105'){
    	/*
        WL.SimpleDialog.show(Fpns.Messages.ALERT_TITLE, Fpns.Messages.ALREADY_EXIST_USER,
                [
         {
             text:Fpns.Messages.ALERT_BUTTON2,
             handler: function () {}
         },
         {
            text:Fpns.Messages.ALERT_BUTTON1,
            handler: function() {
                var param = new Object();
                param.app_code = Fpns.MainAppCode;
                param.overwrite_user = "true";
                param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
                Fpns.FasGap.subscribe(subscribeCallback, param);
            }
        }
        ]);
        */
    	// 동의 확인 여부 없이 무조건 동의로 변경
        var param = new Object();
        param.app_code = Fpns.MainAppCode;
        param.overwrite_user = "true";
        param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
        Fpns.FasGap.subscribe(subscribeCallback, param);
    }else if(data.returnVal.RESULT_CODE=='9104'){
    	/*
        WL.SimpleDialog.show(Fpns.Messages.ALERT_TITLE, Fpns.Messages.ALREADY_EXIST_USER,
                [
        {
            text:Fpns.Messages.ALERT_BUTTON2,
            handler: function () {}
        },
         {
            text:Fpns.Messages.ALERT_BUTTON1,
            handler: function() {
                var param = new Object();
                param.app_code = Fpns.MainAppCode;
                param.overwrite_user = "true";
                param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
                Fpns.FasGap.subscribe(subscribeCallback, param);
            }
        }
        ]);
        */
    	// 동의 확인 여부 없이 무조건 동의로 변경
    	var param = new Object();
        param.app_code = Fpns.MainAppCode;
        param.overwrite_user = "true";
        param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
        Fpns.FasGap.subscribe(subscribeCallback, param);
    }
};

var isPushAppSubscribeCallback = function(data) {
    consoleLog("D", "isPushAppSubscribeCallback ");
    if(data.returnVal.DATA.VALUE=='true'){
        consoleLog("D", "isPushAppSubscribeCallback 1");
        
    }else if(data.returnVal.DATA.VALUE=='false'&&data.returnVal.DATA.isExistUser=='false'){
        consoleLog("D", "isPushAppSubscribeCallback 2");
        var param = new Object();
        param.app_code = Fpns.MainAppCode;
        param.subscribe = 'true';
        param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
        Fpns.FasGap.subscribe(pushAppSubscribeCallback, param);
    }else if(data.returnVal.DATA.VALUE=='false'){
        consoleLog("D", "isPushpushAppSubscribeCallback 3");
        var param = new Object();
        param.app_code = Fpns.MainAppCode;
        param.overwrite_user = "false";
        param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
        Fpns.FasGap.subscribe(ifOtherDevice, param);
    }
};

var isPushAppSubscribe = function () {
    var param = new Object();
    param.app_code = Fpns.MainAppCode;
    param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
    Fpns.FasGap.isSubscribe(isPushAppSubscribeCallback, param);
};



var setKeyCnoCallback = function(data) {
};

var setKeyCno = function(cno, id) {
    var param = new Object();
    param.app_code = Fpns.MainAppCode;
    param.user_id =id;
    param.cno = cno;
    param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
    Fpns.FasGap.setUserInfo(setKeyCnoCallback, param);
};

var hasPushCallback = function(data) {
    var pushParam = data.returnVal;
    consoleLog("D", "pushParam : " + pushParam);
    busyState.show = true;
	busyState.hide = true;
	if(pushParam == "false" || pushParam == "" || pushParam == null || pushParam == undefined) {
    	consoleLog("D", "hasPushCallback pushParma is false");
    	if(appFirst){
    		appFirst = false;
    		pageObj.LCMW0100();
//	    		goMain();
    	}
    }else{
    	appFirst = false;
    	jq("#cleanBg").hide();
    	/*
        if(pushParam.BIZ_DC != 'false' && pushParam.BIZ_DC  == Fpns.MainAppCode) {
            openPushBox(true);
        }

        if(pushParam["_V"] != null && pushParam["_V"] == "T") {
            openPushBox(true);
        }
    	 */
        if(pushParam["_D"] != null) {
            deliveryPushUserData(pushParam["_D"]);
        }
    }
	if(loginInfo.logined=="Y"){
		if(nullCheck(userInfo.ccd_mbyn)&&nullCheck(userInfo.card_m_agree)&&nullCheck(userInfo.members_member)&&nullCheck(userInfo.members_active)&&nullCheck(userInfo.card_cert)){
		    var swtmp = setPageNum(userInfo.ccd_mbyn,userInfo.card_m_agree,userInfo.members_member,userInfo.members_active,userInfo.card_cert);
		    goPageNum(swtmp,"main");
		}
	}
};

var hasPush = function() {
    Fpns.FasGap.hasMessage(hasPushCallback);
};

var deliveryPushUserData = function(data) {
    consoleLog("D", "----------------------------------------------------------");
    consoleLog("D", "- deliveryPushUserData : "+data);
    consoleLog("D", "----------------------------------------------------------");
    runPush(data);
};

var logMqttTopics = function () {

    var param = new Object();
    param.app_code = Fpns.MainAppCode;
    Fpns.FasGap.logMqttTopics(null, param);
};
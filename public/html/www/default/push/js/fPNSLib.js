
/* JavaScript content from push/js/fPNSLib.js in folder common */
var Fpns = Fpns ? Fpns : {};

var FPNSConst = {
    // Device 별 OS 선언
    IOS        : "ios",
    ANDROIDOS  : "android",

    // Main ID
    MAIN_ID : "FPNS",

    // Default CallBack
    DEFAULT_CALLBACK : "Fpns.FasGap.recvMsg",

    //CMD
/*
    // 사용하지 않기 때문에 주석처리
    START_VIEW       : 'startView',
    IS_SUBSCRIBED    : 'isSubscribe',
    SUBSCRIBE        : 'subscribe',
    UNSUBSCRIBE      : 'unSubscribe',
    GET_LIST         : 'getPushList',
    GET_DATA         : 'getPushData',
    DELETE_LIST      : 'deletePush',
    DELETE_ALL_LIST  : 'deleteAllPush',
    GET_NOTIFY       : 'getNotify',
    SET_NOTIFY       : 'setNotify',
    GET_PASSWORD     : 'getPassword',
    SET_PASSWORD     : 'setPassword',
    GET_PREVIEW      : 'getPreview',
    SET_PREVIEW      : 'setPreview',
    IS_LOCKED        : 'isLocked',
    REQUEST_HTTP     : 'requestHttp'
*/
};

Fpns.Const = FPNSConst;

var FpnsUtil = function() {};
FpnsUtil.prototype = {
    getDeviceOS : function() {
        var userAgent = navigator.userAgent;
        if(userAgent.indexOf('iP')>0){
            return Fpns.Const.IOS;
        }else if(userAgent.indexOf('Android')>0){
            return Fpns.Const.ANDROIDOS;
        }else{
            return undefined;
        };
    }
};
Fpns.Util = new FpnsUtil();

var FASPns = function(){
    this.os = Fpns.Util.getDeviceOS();
    this.tempCallBack = {};
};

FASPns.prototype = {
    //common function
    getFasGapObj : function(cmd, param) {
        var fasGapObj = new Object();
        fasGapObj.id = Fpns.Const.MAIN_ID;
        fasGapObj.rootcmd = 'PushBox';
        fasGapObj.cmd = cmd;

        if(param != null && param.custparam != null) {
            fasGapObj.custparam = param.custparam;
        }

        if(param)
            fasGapObj.param = param;

        return fasGapObj;
    },

    getFasGapPluginObj : function(rootcmd, cmd, param) {
        var fasGapObj = new Object();
        fasGapObj.id = Fpns.Const.MAIN_ID;
        fasGapObj.rootcmd = rootcmd;
        fasGapObj.cmd = cmd;

        if(param != null && param.custparam != null) {
            fasGapObj.custparam = param.custparam;
        }

        if(param)
            fasGapObj.param = param;

        return fasGapObj;
    },


    /*
     * 새로운 Activity 런치
     * @param Object
     * Object 내에 parameter를 담아 Activity로 전달 가능함
     * 필수 value : class full name
     * 웹뷰를 오픈 할 경우 url 전달 필요
     * ex) var params = new Object();
     *        params.iOSClassName = 'PushView.m';
     *        params.AndroidClassName = 'com.financeallsolutions.push.PushActivity';
     *     params.url = "push/html/cubbyhole.html";
     *     params.id = 'id';
     *     params.password = 'password';
     *     Fpns.FasGap.startView(params);
     * 2012.09.27 길어진
     */
    startView : function(params) {
        var fasGapObj = this.getFasGapObj('startView', params);
        this.prepareCallBack(fasGapObj, null);
        this.sendMsg(fasGapObj);
    },

    /*
     * push보관함을 닫는다.
     * @param Object
     * Object 내에 parameter를 담아 Activity로 전달 가능함
     * ex) var params = new Object();
     *     params.id = 'id';
     *     params.password = 'password';
     *     Fpns.FasGap.endView(params);
     * 2012.10.10 길어진
     */
    endView : function(params) {
        var fasGapObj = this.getFasGapObj('endView', params);
        this.sendMsg(fasGapObj);
    },


    /*
     * 열려있던 보관함을 보여준다.
     * 2012.11.05 길어진
     */
    show : function() {
        var fasGapObj = this.getFasGapObj("show");
        this.sendMsg(fasGapObj);
    },

    /*
     * push 보관함을 숨기고 보관함을 열기 전 화면을 보여준다.
     * 2012.11.05 길어진
     */
    hide : function(param) {
        var fasGapObj = this.getFasGapObj("hide", param);
        this.sendMsg(fasGapObj);
    },

    /*
     * 보관함을 열때 지정한 Native method로 param을 전달한다.
     * @param Object
     * Object 내에 parameter를 담아 Native code로 전달한다.
     * ex) var params = new Object();
     *     params.id = 'id';
     *     params.password = 'password';
     *     Fpns.FasGap.sendData(params);
     *
     *     안드로이드는 OnFpnsCallbackMsgListener를 구현한 곳으로 메시지를 전달한다.
     * 2012.11.05 길어진
     */
    sendData : function(params) {
        var fasGapObj = this.getFasGapObj('sendDataToCallback', params);
        this.sendMsg(fasGapObj);
    },

    /*
     * push 설정여부 확인
     * @param String callbackFunction
     * @param Object param
     * Object 내에 id와 appCode를 담아 전달해야함.
     * ex)  var params = new Object();
     *         param.appCode = AppCode;
     * @return String true or false
     * 2012.09.27 길어진
     */
    isSubscribe : function(cbFunc, param) {
        var fasGapObj = this.getFasGapObj('isSubscribe', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * push 등록
     * @param String cbFuncFunction
     * @param Object param
     * Object 내에 id와 appCode를 담아 전달해야함.
     * ex)  var params = new Object();
     *         param.appCode = AppCode;
     * @return String success or fail
     * 2012.09.27 길어진
     */
    subscribe : function(cbFunc, param) {
        var fasGapObj = this.getFasGapObj('subscribe', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * subecribe 완료 후 mqtt 초기화
     * callback, return 없음
     * 
     * 2013.08.26 etyoul
     */
    initMqttClient : function (cbFunction, param) {
    	var fasGapObj = this.getFasGapObj('initMqttClient', param);
        this.prepareCallBack(fasGapObj, cbFunction || new Function());
        this.sendMsg(fasGapObj);
        
    },
    /*
     * mqtt subscribe 설정
     * callback, return 없음
     * 
     * 2013.09.02 etyoul
     */
    setMqttClient : function (cbFunction, param) {
    	var fasGapObj = this.getFasGapObj('setMqttClient', param);
        this.prepareCallBack(fasGapObj, cbFunction || new Function());
        this.sendMsg(fasGapObj);
    },
    /*
     * subecribe 중인 토픽을 로그로 출력 : deviceId가 실행시마다 변경되기때문에 개발앱용으로 추가함
     * param, callback, return 없음
     * 
     * 2013.08.26 etyoul
     */
    logMqttTopics : function (cbFunction ,param) {
    	var fasGapObj = this.getFasGapObj('logMqttTopics', param);
        this.prepareCallBack(fasGapObj, cbFunction || new Function());
        this.sendMsg(fasGapObj);
        
    },
    /*
     * push 해지
     * @param String cbFuncFunction
     * @param Object param
     * Object 내에 id와 appCode를 담아 전달해야함.
     * ex)  var params = new Object();
     *         param.app_code = AppCode;
     * @return String success or fail
     * 2012.09.27 길어진
     */
    unSubscribe : function(cbFunc, param){
        var fasGapObj = this.getFasGapObj('unSubscribe', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },

    /*
     * customer number , user_id 등록
     * @param String cbFuncFunction
     * @param Object param
     * Object 내에 cno와 app_code, user_id 를 담아 전달해야함.
     * ex)  var params = new Object();
     *         param.user_id = UserId;
     *         param.cno = CNO;
     *         param.app_code = AppCode;
     * @return String success or fail
     * 2012.09.27 길어진
     */
    setUserInfo : function(cbFunc, param){
        var fasGapObj = this.getFasGapObj('setUserInfo', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },


    hasMessage : function(cbFunc, param) {
        var fasGapObj = this.getFasGapObj('hasMessage', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },


    /*
     * preview 값 리턴
     * @param String callbackFunction
     * @return String true or false
     * 2012.09.27 길어진
     */
    getPreview : function(cbFunc) {
        var fasGapObj = this.getFasGapObj('getPreview');
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * set preview
     * @param String callbackFunction
     * @param boolean value
     * @return String success or fail
     * 2012.09.27 길어진
     */
    setPreview : function(cbFunc, value) {
        var param = new Object();
        param.value = value;
        var fasGapObj = this.getFasGapObj('setPreview', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * notify 값 리턴
     * @param String callbackFunction
     * @return boolean value
     * 2012.09.27 길어진
     */
    getNotify : function(cbFunc) {
        var fasGapObj = this.getFasGapObj('getNotify');
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * set nofity
     * @param String callbackFunction
     * @param boolean value
     * @return String success or fail
     * 2012.09.27 길어진
     */
    setNotify : function(cbFunc, value) {
        var param = new Object();
        param.value = value;
        var fasGapObj = this.getFasGapObj('setNotify', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * password 리턴
     * @param String callbackFunction
     * @return String password
     * 2012.09.27 길어진
     */
    getPassword : function(cbFunc) {
        var fasGapObj = this.getFasGapObj('getPassword');
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * set password
     * @param String callbackFunction
     * @param String password
     * @return String success or fail
     * 2012.09.27 길어진
     */
    setPassword : function(cbFunc, password) {
        var param = new Object();
        param.value = password;
        var fasGapObj = this.getFasGapObj('setPassword', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },
    /*
     * 보관함 잠금여부 리턴
     * @param String callbackFunction
     * @return boolean true or false
     * 2012.09.27 길어진
     */
    isLocked : function(cbFunc) {
        var fasGapObj = this.getFasGapObj('isLocked');
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },

    requestHttp : function(cbFunc, param) {
        var fasGapObj = this.getFasGapObj('requestHttp', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },

    requestHttpForLotte : function(cbFunc, param) {
        var fasGapObj = this.getFasGapObj('requestHttpForLotte', param);
        this.prepareCallBack(fasGapObj, cbFunc);
        this.sendMsg(fasGapObj);
    },

    showDialog : function() {
        var fasGapObj = this.getFasGapPluginObj('LoadDialog','showDialog');
        this.sendMsg(fasGapObj);
    },

    hideDialog : function() {
        var fasGapObj = this.getFasGapPluginObj('LoadDialog','hideDialog');
        this.sendMsg(fasGapObj);
    },

    openBrowser : function(param) {
        var fasGapObj = this.getFasGapPluginObj('AppExec','openBrowser', param);
        this.sendMsg(fasGapObj);
    },

    /*
     * IOS 뱃지 카운트 -1
     * 2012.09.27 길어진
     */
    minusBadge : function() {
        if(this.os ==Fpns.Const.IOS){
            var fasGapObj = this.getFasGapObj('minusBadge');
            this.sendMsg(fasGapObj);
        }
    },

    sendMsg : function(fasGapObj) {
        switch (this.os) {
        case Fpns.Const.IOS:
            this.callIosNative(fasGapObj);
            break;
        case Fpns.Const.ANDROIDOS:
            this.callAndroidNative(fasGapObj);
            break;
        default:
            break;
        }
    },

    callIosNative : function(jObj) {
        //PhoneGap.exec(null, null, "FASJScriptPlugin", "nativeBridge", [Object.toJSON(jObj)]);
        try {
            //PhoneGap.exec(null, null, "FASJScriptPlugin", "nativeBridge", [JSON.stringify(jObj)]);
            FasNFIGap.exec(JSON.stringify(jObj));
        } catch(e) {
            alert('error callIosNative!!!');
        }
    },

    callAndroidNative : function(jObj) {
        fasGap.sendMsg(JSON.stringify(jObj));
    },

    recvMsg : function(jObj) {
        try {
            var recvObj = eval('('+jObj+')');
            var recvCmd = recvObj.cmd;
            if(this.tempCallBack[recvCmd] != null)
            {
                switch(typeof this.tempCallBack[recvCmd])
                {
                case "function":
                    try{
                        this.tempCallBack[recvCmd](recvObj);
                    }
                    catch(e){
                    }
                    break;
                case "string":
                    try{
                        eval(this.tempCallBack[recvCmd])(recvObj);
                    }
                    catch(e){
                    }
                    break;
                default:
                    break;
                }
            }
        } catch (e) {
            // TODO: handle exception
            console.log(e);
        }
    },

    prepareCallBack : function(fasGapObj, cbFunc) {
        var cmd = fasGapObj.cmd;

        if(cmd==undefined)
            return;

        if(!this.isNull(cbFunc)){
            this.tempCallBack[cmd] = cbFunc;

            fasGapObj.callback = Fpns.Const.DEFAULT_CALLBACK;
        }else{
            this.tempCallBack[cmd] = null;
        }
    },

    isNull : function(data) {
        return (data == null || typeof data == 'undefined')?true:false;
    }
};
Fpns.FasGap = new FASPns();

var FpnsComm = function() {
    this.tempCallback = {};
};

FpnsComm.prototype = {
    getCommObj : function(cmd, cbFunc, param) {
        var commObj = new Object();
        commObj.callback = cbFunc;
        commObj.cmd = cmd;
        commObj.url = param.url;

        switch (Fpns.CommConst.USE_TYPE) {

        case Fpns.CommConst.TYPE_AJAX:

            var arrParam = "CMD="+cmd+"&";
            for(var s in param){
                if(s!="url")
                    arrParam += s+'='+param[s]+'&';
            }

            arrParam = arrParam.substring(0, arrParam.length-1);
            commObj.param = arrParam;
            break;

        case Fpns.CommConst.TYPE_NATIVE:

            commObj.param = param;
            commObj.param.CMD = cmd;
            commObj.param.url = param.url;

            break;

        default:
            break;
        }
        return commObj;
    },

    getList : function(cbFunc, param) {
        var commObj = this.getCommObj('getList', cbFunc, param);
        this.sendRequest(commObj);
    },

    getDetail : function(cbFunc, param) {
        var commObj = this.getCommObj('getDetail', cbFunc, param);
        this.sendRequest(commObj);
    },

    deleteList :function(cbFunc, param){
        var commObj = this.getCommObj('deleteMessage', cbFunc, param);
        this.sendRequest(commObj);
    },

    getBadge :function(cbFunc, param){
        var commObj = this.getCommObj('getBadge', cbFunc, param);
        this.sendRequest(commObj);
    },

    ajaxCallback : function(result) {
        var recvCmd = result.CMD;
        var retObj = {
                id:"FPNS",
                cmd:recvCmd,
                returnVal:result
        };
        if(Fpns.Communication.tempCallback[recvCmd] != null)
        {
            switch(typeof Fpns.Communication.tempCallback[recvCmd])
            {
            case "function":
                try{
                    Fpns.Communication.tempCallback[recvCmd](retObj);
                }
                catch(e){
                }
                break;
            case "string":
                try{
                    eval(Fpns.Communication.tempCallback[recvCmd])(retObj);
                }
                catch(e){
                }
                break;
            default:
                break;
            }
        }
    },

    prepareCallback : function(commObj) {
        var cmd = commObj.cmd;
        if(cmd==undefined)
            return;
        if(!this.isNull(commObj.callback)){
            this.tempCallback[cmd] = commObj.callback;

            commObj.callback = Fpns.Communication.ajaxCallback;
        }else{
            this.tempCallback[cmd] = null;
        }
    },

    isNull : function(data) {
        return (data == null || typeof data == 'undefined')?true:false;
    },

    sendRequest :function(commObj){
        switch (Fpns.CommConst.USE_TYPE) {

        case Fpns.CommConst.TYPE_AJAX:
            this.prepareCallback(commObj);
            $j.ajax({
                type:"POST",
                url:commObj.url,
                data:commObj.param,
                success:commObj.callback,
                error:commObj.callback,
            });
            break;

        case fpnsCommConst.TYPE_NATIVE:
            Fpns.FasGap.requestHttpForLotte(commObj.callback, commObj.param);

            break;
        default:
            break;
        }
    }
};
Fpns.Communication = new FpnsComm();

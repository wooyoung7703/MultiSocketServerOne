
/* JavaScript content from js/comm/localJsPlugin.js in folder common */
/* native호출시 local PC에서 확인 할 수 있도록  */

var DevicePlugin = {};
DevicePlugin.deviceInfo = function(rawArgs){
//	var argsSplit = rawArgs.split(",");
	var params = {
			os				: "",
			deviceUuid		: "",
			osModel			: "",
			osVersionCode	: "",
			osVersion		: "",
			netOper			: "",
			phoneNo			: "",
			appVer			: "",
			appCode			: "",
			autoLogin		: "",
			newLCMW9000		: 0,
			newLCMW1000		: 0,
			newLCMW5000		: 0,
			LCMW0100		: 0,
			wallet_member	: ""
	};
	deviceInfoResult(params);
};

var saveData = {};
DevicePlugin.saveData = function(rawArgs){
	var argsSplit = rawArgs.split(",");
	eval("saveData." + argsSplit[3] + "='" + argsSplit[4] + "'");
};
DevicePlugin.loadData = function(rawArgs){
	var argsSplit = rawArgs.split(",");
	var returnData = eval("saveData." + argsSplit[3]) ? eval("saveData." + argsSplit[3]) : 0;
	eval(argsSplit[2] + "('"+ returnData +"')");
};
DevicePlugin.showMainpage = function(){
	
};
DevicePlugin.maxBrightOn = function(){
	
};
DevicePlugin.maxBrightOff = function(){
	
};
DevicePlugin.forcedExit = function(){
	loadFamilyLink();
};

var FamilyLinkPlugin = {};
FamilyLinkPlugin.isInstalledApp = function(rawArgs){
	consoleLog("D", "FamilyLinkPlugin.isInstalledApp rawArgs : " + rawArgs);
	if(rawArgs.match("pageObj")) pageObj.isInstalledAppresult("N");
};

function localKeyPadOk(){
	var localKey = jq("#localKey").val();
	var mtrnId = jq(tmpObj).attr("id").replace("disp_", "");
	var str = "";
	for(var i = 0; i < localKey.length; i++){
		str += "●";
	}
	jq("#disp_" + mtrnId).html(str);
	mtrnOpenChk = false;
	jq("#localKeyPad").hide();
	jq("#modalBg").hide();
		
	jq(window).unbind("touchmove");
	jq(tmpObj).blur();
	if(passChk){
		if(checkSameString(localKey) || checkSerizeString(localKey)){
			appAlert("알림", "연속, 반복숫자는 비밀번호로 설정이 불가능 합니다.", "확인");
			jq("#" + mtrnId).val("");
			jq("#tk_" + mtrnId).val("");
			jq("#disp_" + mtrnId).html("");
			return;
		}
	}
	
	jq("#" + mtrnId).val(localKey);
	jq("#tk_" + mtrnId).val(localKey);
	
	if(mtrnCallBack) mtrnCallBack();
}

function localKeyPadCancel(){
	jq("#localKey").val("");
	jq("#localKeyPad").hide();
	jq("#modalBg").hide();
	mtrnOpenChk = false;
}

function localPageOpen(){
	var tmpPage = jq("#localKey").val();
	localKeyPadCancel();
	pageLoad(tmpPage, '', 'Y');
}
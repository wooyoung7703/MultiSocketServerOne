
/* JavaScript content from js/LCMW9/LCMW9300.js in folder common */
pageObj.pageTitle = "서비스 소개";

pageObj.pageFunction = function(obj){
	pageObj.changePage("01");
};

pageObj.changePage = function(num){
	jq("#li01, #li02, #li03").removeClass("on");
	jq("#intro01, #intro01ios, #intro02, #intro02ios, #intro03, #intro03ios").hide();
	jq("#li" + num).addClass("on");
	if(deviceInfo.os == "ios")
	{
		jq("#intro" + num + "ios").show();
	}else{
		jq("#intro" + num).show();
	}

};

pageObj.callPhone = function(){

	if(deviceInfo.os=="android")
		callNtv(null, null, "DevicePlugin", "callPhone", ["1577-8700", "고객센터로 연결 합니다.\nARS(1577-8700)"]);
	
};

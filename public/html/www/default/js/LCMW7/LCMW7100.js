
/* JavaScript content from js/LCMW7/LCMW7100.js in folder common */
pageObj.pageTitle = "카드상세";

pageObj.pageFunction = function(obj){
	pageObj.resultLCMW7100(dataLcmw7100);
};

pageObj.resultLCMW7100= function(resultData){
	jq("#contents dt").html(resultData.VT_CD_KND_NM);
	jq("#contents img").attr("src", resultData.CD_IMG_NM2);
	var dataList = new GridControl({"row" : resultData.BRANDLIST});
	var str = "";
	for(var i = 0; i < dataList.getSize(); i++){
		if(str != "") str += ", ";
		str += dataList.get(i).BRAND;
	}
	jq("#detail_ul li").eq(0).append(str);
	
	dataList = new GridControl({"row" : resultData.GDCLIST});
	str = "";
	for(var i = 0; i < dataList.getSize(); i++){
		if(str != "") str += ", ";
		str += dataList.get(i).GDC;
	}
	jq("#detail_ul li").eq(1).append(str);
	
	dataList = new GridControl({"row" : resultData.STCDLIST});
	str = "";
	for(var i = 0; i < dataList.getSize(); i++){
		if(str != "") str += ", ";
		str += dataList.get(i).STCD;
	}
	jq("#detail_ul li").eq(2).append(str);
	
	dataList = new GridControl({"row" : resultData.FRVLIST});
	for(var i = 0; i < dataList.getSize(); i++){
		dataList.get(i).TMP_FVR_CN = dataList.get(i).FVR_CN.replace(/\/images/g, "http://lottecard.co.kr/images");
		dataList.get(i).TMP_FVR_CN = dataList.get(i).TMP_FVR_CN.replace(/<img src/g, "<img style='max-width:" + (deviceInfo.winWidth * 0.85) + "px' src");
		jq("#list_acc").append(bindData(jq("#listAccTmpl").val(), dataList.get(i)));
	}
	initAcc();
};


pageObj.subSimple = function(){
	if(jq("#full_pop").css("display") != "none"){
		jq("#full_pop").hide();
		jq("#wrap").show();
	}
	commPage("P", "LCMW7210", "", "Y");
};

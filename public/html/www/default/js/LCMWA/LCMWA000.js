
/* JavaScript content from js/LCMWA/LCMWA000.js in folder common */
pageObj.pageTitle = "Family Link";

pageObj.pageFunction = function(obj){
//	commPage("T", "lcmwa000", "", pageObj.resultLCMWA000);
	var dataList = new GridControl({"row" : familyLinkData.FAMILY_SET});
	for(var i = 0; i < dataList.getSize(); i++){
		jq("#family_link_list").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
	}
	cordova.exec(null, null, "FamilyLinkPlugin", "isInstalledApp", ["pageObj.isInstalledAppresult",urlscheme]);
};

pageObj.isInstalledAppresult = function(resultData){
	var resultSplit = resultData.split(",");
	for(var i = 0; i < resultSplit.length; i++){
		if(resultSplit[i] == "Y"){
			jq("#family_link_list li").eq(i).find("figure").removeClass("dim");
			jq("#family_link_list li").eq(i).find("a").addClass("btn_g28").html("열기");
		}else{
			jq("#family_link_list li").eq(i).find("figure").addClass("dim");
			jq("#family_link_list li").eq(i).find("a").addClass("btn_d28").html("다운로드");
		}
	}
};
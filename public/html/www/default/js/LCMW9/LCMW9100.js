
/* JavaScript content from js/LCMW9/LCMW9100.js in folder common */
pageObj.pageTitle = "";
pageObj.pageSize = 10;
pageObj.pageNo = 1;

pageObj.pageFunction = function(obj){
	jq("#newLCMW9000").hide();
	callNtv(null,null,"DevicePlugin","saveData",["","","","newLCMW9000", newBtn.newLCMW9000]);
	pageObj.pageId = obj;
	if(pageObj.pageId == "lcmw9000"){
		pageObj.pageTitle = "공지사항";
	}else if(pageObj.pageId == "lcmw9100"){
		pageObj.pageTitle = "FAQ";
	}
	setTitle();
	pageObj.loadData();
};

pageObj.loadData = function(){
	var params = {
			"page_size"	: pageObj.pageSize,
			"page_no"	: pageObj.pageNo
		};
	commPage("T", pageObj.pageId, params, pageObj.resultLoadData);
};

pageObj.resultLoadData = function(resultData){
	var dataList = new GridControl({"row" : resultData.ARTICLE});
	var str = "";
	for(var i = 0; i < dataList.getSize(); i++){
		dataList.get(i).ARTICLE_CN_V = dataList.get(i).ARTICLE_CN_V.replace(/\n/g, '<br>');
		dataList.get(i).faQ = pageObj.pageId == "lcmw9100" ? "<b style='color:red'>Q. </b>" : "";
		dataList.get(i).fAq = pageObj.pageId == "lcmw9100" ? "<b style='color:#FF6600'>Answer.</b><br/>" : "";
		str += bindData(jq("#dataTmpl").val(), dataList.get(i));
	}
	jq("#list_acc").append(str);
	initAcc();
	setTimeout(function(){
		moreSetting(resultData.ARTICLE_SIZE, pageObj.loadData);
	}, 100);
	
};

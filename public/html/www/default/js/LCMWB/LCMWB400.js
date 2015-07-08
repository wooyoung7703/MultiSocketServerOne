
/* JavaScript content from js/LCMWB/LCMWB400.js in folder common */
pageObj.pageTitle = "롯데카드 클러치 약관";

pageObj.pageFunction = function(obj){
	// 약관 조회 
	commPage("T", 'lcmwc110', "", pageObj.resultLCMWC110);
};

// 약관 조회 결과
pageObj.resultLCMWC110 = function(resultData){
	var dataList = new GridControl({"row" : resultData.PROVISION});
	
	for(var i = 0; i < dataList.getSize(); i++){
		if(dataList.get(i).PRV_SUB_NM.match("서비스")){
			jq("#agreeList").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
		}
	}
};
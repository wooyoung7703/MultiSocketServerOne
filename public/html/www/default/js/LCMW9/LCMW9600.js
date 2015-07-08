
/* JavaScript content from js/LCMW9/LCMW9600.js in folder common */
pageObj.pageTitle = "LOTTE APPS";
pageObj.backBtn = "";
pageObj.pageFunction = function(obj){
	
	jq("#contents_sub_web").html("<iframe src='http://m.lottemembers.com/app/LotteApps.html' width=\"100%\" height=\"100%\"></iframe>");
	jq("#leftBtn").hide();

};


pageObj.cancel = function(){
	jq("#leftBtn").click();
};

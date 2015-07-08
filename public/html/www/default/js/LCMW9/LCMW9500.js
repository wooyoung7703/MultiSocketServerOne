
/* JavaScript content from js/LCMW9/LCMW9500.js in folder common */
pageObj.pageTitle = "서비스 메뉴별 이용안내";

pageObj.pageFunction = function(obj){
	pageObj.changePage("01");
};

pageObj.changePage = function(num){
	jq(".menuli").removeClass("on");
	jq(".tab02_sub").hide();
	jq(".conDiv").hide();
	
	jq("#li" + num).addClass("on");
	jq("#gm" + num).show();
	if(num == "03") pageObj.changesPage("01");
};

pageObj.changesPage = function(num){
	jq(".tab02_sub").show();
	jq(".menuli").removeClass("on");
	
	jq("#li03, #sli" + num).addClass("on");
	jq(".conDiv").hide();
	jq("#gms" + num).show();
};
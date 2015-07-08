
/* JavaScript content from js/LCMWC/LCMWC323.js in folder common */
pageObj.pageTitle = "가입완료";

pageObj.pageFunction = function(obj){
//	jq("body").addClass("bg_dark");
	jq("#leftBtn, #rightBtn").hide();
};

pageObj.next = function(){
	commPage("P", smsBackPage);
};

pageObj.cancel = function(){
	commPage("P", smsBackPage);
};
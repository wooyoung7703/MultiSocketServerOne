
/* JavaScript content from js/LCMW7/LCMW7240.js in folder common */
pageObj.pageTitle = "간편신청";

pageObj.pageFunction = function(obj){
//	jq("body").addClass("bg_dark");
	pageObj.cardInfo = eval("(" + obj + ")");
	
	jq("#ur_nm").html(getMaskingName(pageObj.cardInfo.ur_nm));
	jq("#cell_no").html(getMaskingPhone(pageObj.cardInfo.cell_no));
	jq("#card_nm").html(pageObj.cardInfo.card_nm);
};

pageObj.cancel = function(){
	goMain();
};
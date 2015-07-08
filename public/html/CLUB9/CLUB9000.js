/**
 * New node file
 */
pageObj.pageFunction = function(obj){
	jq("#rightBtn").hide();
	jq("#leftBtn").attr({"onclick" : "close2()"}).show();
};
function close2(){
jq('.main_detail_wrap').hide();
}
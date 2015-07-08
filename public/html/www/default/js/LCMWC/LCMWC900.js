
/* JavaScript content from js/LCMWC/LCMWC900.js in folder common */
pageObj.pageTitle = "속도 테스트";
pageObj.pageFunction = function(obj){
};
var sstartT;
var sendT;
var stmpCnt = 0;
var sminT = 10000;
var smaxT = 0;
var tTotalT = 0;
function speedTest(){
	jq("#speedResult").html("");
	stmpCnt = 0;
	sminT = 10000;
	smaxT = 0;
	tTotalT = 0;
	speedTest1();
}
function speedTest1(){
	
	startT = new Date();
	commPage("T", "ping", "", resultSpeed);
}

function resultSpeed(resultData){
	stmpCnt++;
	var endT = new Date();
	var tmpT = endT - startT;
	tTotalT += tmpT;
	if(sminT >= tmpT) sminT = tmpT;
	if(smaxT <= tmpT) smaxT = tmpT;
	
	//console.log("===========endT=======================\n" + yyyymmddhh24miss(endT) + "\n===========endT=======================");
	//console.log(endT - startT + "\n===========total time=======================");
	
	var str = stmpCnt + "번째 테스트"; 
	str += "호출 시간 : " + yyyymmddhh24miss(startT) + "<br/>";
	str += "응답 시간 : " + yyyymmddhh24miss(endT) + "<br/>"; 
	str += "걸린 시간 : " + tmpT  + "<br/><br/>";
	
	jq("#speedResult").prepend(str);
	//console.log(str);
	if(jq("#cnt").val() > stmpCnt){
		speedTest1();
	}else{
		str = "====================================<br/>";
		str += "가장 빠른시간 : " + sminT + "<br/>"; 
		str += "가장 느린시간 : " + smaxT + "<br/>";
		str += "평균 시간 : " + (tTotalT/stmpCnt) + "<br/>";
		str += "====================================<br/><br/>";
		jq("#speedResult").prepend(str);
		//console.log(str);
	}
}
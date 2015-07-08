
/* JavaScript content from js/comm/exceptionDevice.js in folder common */

// 운영 : false, 개발 : true
var stateDev = false;
//운영 : false, 개발 : true
var stateNat = false;
// 안드로이드 auto fillin 기능 (사용 : true, 미사용 : false)
var autoFillin = true;

// 어도비 로그 서버 전송시 오류 모델
var exception_applog = ["SHV-E120"];

// 예외 발생되는 device체크
function exceptionDeviceChk(deviceArr){
	var exceptionDevice = false;
	for(var i = 0; i < deviceArr.length; i++){
		if((deviceInfo.osModel).match(deviceArr[i])) exceptionDevice =  true;
	}
	return exceptionDevice;
}

function deviceChk(){
	consoleLog("I", "deviceChk deviceInfo.os : " + deviceInfo.os);
	// 안드로이드 ICS버젼에서 인풋 박스 선택시 헤더, 푸터 영역에 올라가는 현상 방지
	if((deviceInfo.osVersion.match("4.0") && deviceInfo.os == "android")) icsInputFocus();
	// 아이폰에서 input, select box 포커스시 헤더 푸터 영역 고정 되는 현상 방지
	if(deviceInfo.os == "ios") iosInputFocus();
}

//안드로이드 ICS에서 키패드 헤더 위로 올라가는 부분 스크롤을 멈춰놓는다.
function icsInputFocus(){
	jq("input").focusin(function(){
		jq(window).scrollTop(jq(this).position().top - 150);
		jq(window).bind("touchmove", function(){
			return false;
		});
	});
	jq("input").focusout(function(){
		jq(window).unbind("touchmove");
	});
}

//아이폰에서 input, select box 포커스시 헤더 푸터 영역 고정 되는 현상 방지
function iosInputFocus(){
	jq(".aView").hide();
	jq(".iView").css("display", "block");
	jq("input").focusin(function(){
//		jq(window).scrollTop(jq(this).position().top - 150);
		jq(window).bind("touchmove", function(){
			return false;
		});
	});
	jq("input").focusout(function(){
		jq(window).unbind("touchmove");
	});
}
// 안드로이드 진져브래드 버젼에서 셀렉트 박스 헤더, 푸터아래에서 우선 이벤트 현상 방지
function disableSelect(){
	jq(window).unbind("scroll");
	jq(window).bind("scroll", function(){
		jq("select").each(function(){
			if(jq(this).offset().top < jq(window).scrollTop() + 40){
				jq(this).attr("disabled", "disabled");
			}else{
				jq(this).removeAttr("disabled");
			}
		});
	});
}

// 안드로이드 갤럭시 S4이상 버젼에서 웹뷰 화면 더블 클릭되는 현상 방지
var tmpTime;
function noTouch(term){
	var result = false;
	tmpTime = new Date();
	consoleLog("D", "noTouch term : " + (tmpTime - doubleTouchChk));
	if(tmpTime - doubleTouchChk < term) result = true;
	return result;
}

// 화면 정리
function refreshPage(){
	// 특정 아이스크림 샌드위치폰에서 결제금액 변경후 화면 변화가 없어 추가
	if((deviceInfo.osVersion.match("4.0") && deviceInfo.os == "android")){
		jq(window).scrollTop(jq(window).scrollTop() + 1);
		setTimeout(function(){
			jq(window).scrollTop(jq(window).scrollTop() - 1);
		},20);
	}
}

// 속도 테스트
var startLoadingTime;
function loadingTime(flag){
	if(flag){
		startLoadingTime = new Date();
		consoleLog("I", "===========startLoadingTime=======================\n" + yyyymmddhh24miss(startLoadingTime) + "\n===========startLoadingTime=======================");
	}else{
		consoleLog("I", "===========startLoadingTime=======================\n" + yyyymmddhh24miss(startLoadingTime) + "\n===========startLoadingTime=======================");
		var endLoadingTime = new Date();
		consoleLog("I", "===========endLoadingTime=======================\n" + yyyymmddhh24miss(endLoadingTime) + "\n===========endLoadingTime=======================");
		consoleLog("I", endLoadingTime - startLoadingTime + "\n===========total time=======================");
	}
}

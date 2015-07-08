
/* JavaScript content from js/LCMWB/LCMWB200.js in folder common */
pageObj.pageTitle = "SNS 계정 설정";

pageObj.pageFunction = function(obj){
	// twitter 연결확인
	callNtv(twitterResult,null,"SnsPlugin","twitterCheck",[]);
};

// twitter 연결 확인 결과
function twitterResult(resultData){
	if(resultData == "SUCCESS"){
		jq("#twitter_link").attr("onclick","seinTwitterDelete()");
		jq("#twitter_img").attr("src","images/ico/ico_twitter.png");
		jq("#twitter_text").html("Twitter 연결해제");
	}else{
		jq("#twitter_link").attr("onclick","seinTwitterCon()");
		jq("#twitter_img").attr("src","images/ico/ico_twitter_bw.png");
		jq("#twitter_text").html("Twitter 연결하기");
	}
	// facebook 연결확인
	callNtv(facebookResult,null,"SnsPlugin","facebookCheck",[]);
};

// facebook 연결 확인 결과
function facebookResult(resultData){
	if(resultData == "SUCCESS"){
		jq("#facebook_link").attr("onclick","seinFacebookDelete()");
		jq("#facebook_img").attr("src","images/ico/ico_facebook.png");
		jq("#facebook_text").html("Facebook 연결해제");
	}else{
		jq("#facebook_link").attr("onclick","seinFacebookCon()");
		jq("#facebook_img").attr("src","images/ico/ico_facebook_bw.png");
		jq("#facebook_text").html("Facebook 연결하기");
	}
};

// twitter 연결하기
function seinTwitterCon(){
	var params = {PAGE_CODE : "11111"};
	if(deviceInfo.os == "android"){
		callNtv(null,null,"SnsPlugin","TwitterController",["","","changeTwitter",params]);
	}else{
		WL.NativePage.show("TwitterController",changeTwitter,params);
	}
};

//twitter 연결 결과
function changeTwitter(resultData){
	var result = (deviceInfo.os == "android") ? resultData : resultData.result;
	if(result == "Y"){
		jq("#twitter_link").attr("onclick","seinTwitterDelete()");
		jq("#twitter_img").attr("src","images/ico/ico_twitter.png");
		jq("#twitter_text").html("Twitter 연결해제");
	}else{
		if(deviceInfo.os == "android"){
			jq("#twitter_link").attr("onclick","seinTwitterCon()");
			jq("#twitter_img").attr("src","images/ico/ico_twitter_bw.png");
			jq("#twitter_text").html("Twitter 연결하기");
		}else{
			appAlert("알림", "트위터 연결에 실패하였습니다.", "확인");
		}
	}
};

// twitter 연결 해제
function seinTwitterDelete(){	
	appConfirm("알림", "트위터 연결을 해제 하시겠습니까?", "확인", "취소", function(){
		callNtv(null, null, "SnsPlugin", "twitterDelete", []);
		if(deviceInfo.os == "ios"){
			jq("#twitter_link").attr("onclick","seinTwitterCon()");
			jq("#twitter_img").attr("src","images/ico/ico_twitter_bw.png");
			jq("#twitter_text").html("Twitter 연결하기");
		}
	}, function(){
	});
};


// facebook 연결하기
function seinFacebookCon(){
	var params = {PAGE_CODE : "11111"};
	if(deviceInfo.os == "android"){
		callNtv(null,null,"SnsPlugin","FaceBookController",["","","changeFacebook",params]);
	}else{
		WL.NativePage.show("FaceBookController",changeFacebook,params);
	}
};

// facebook 연결 결과
function changeFacebook(resultData){
	var result = (deviceInfo.os == "android") ? resultData : resultData.result;
	if(result == "Y"){
		jq("#facebook_link").attr("onclick","seinFacebookDelete()");
		jq("#facebook_img").attr("src","images/ico/ico_facebook.png");
		jq("#facebook_text").html("Facebook 연결해제");
	}else{
		if(deviceInfo.os == "android"){
			jq("#facebook_link").attr("onclick","seinFacebookCon()");
			jq("#facebook_img").attr("src","images/ico/ico_facebook_bw.png");
			jq("#facebook_text").html("Facebook 연결하기");
		}else{
			appAlert("알림", "페이스북 연결에 실패하였습니다.", "확인");
		}
	}
};

// facebook 연결 해제
function seinFacebookDelete(){	
	appConfirm("알림", "페이스북 연결을 해제 하시겠습니까?", "확인", "취소", function(){
		callNtv(null, null, "SnsPlugin", "facebookDelete", []);
		if(deviceInfo.os == "ios"){
			jq("#facebook_link").attr("onclick","seinFacebookCon()");
			jq("#facebook_img").attr("src","images/ico/ico_facebook_bw.png");
			jq("#facebook_text").html("Facebook 연결하기");
		}
	}, function(){
	});
};
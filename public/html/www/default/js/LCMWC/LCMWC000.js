
/* JavaScript content from js/LCMWC/LCMWC000.js in folder common */
pageObj.pageTitle = "비밀번호";
pageObj.IS_CREDIT_CARD_MEMBE = "";

pageObj.pageFunction = function(obj){
	pageObj.obj = obj;	// 로그인 이용가능 페이지 진입 시도시 obj = "C"
	
	// 체크박스 활성화
	initCheckBox();
	
	// 보안키 호출
	setMTransKey();
	
	// 로컬용 
	if(deviceInfo.os == "windows"){
		jq("#localLogin").show();
	}
};

// 계정이 잠겨있을 경우 계정을 다시 등록 할수 있도록  -- 안드로이드폰에서 컨펌창 출력시 백버튼으로 창을 없앨 수 있어 분리 해서 추가
pageObj.lockUserId = function(){
	appConfirm("알림", "비밀번호 입력 연속 5회\n오류가 발생하였습니다.\n고객 인증 후 비밀번호를\n변경해주세요.", "확인", "취소", function(){
		pageLoad("LCMWC400", "", "L");
	}, function(){
		goMain();
	});
};

// 로그인
pageObj.LCMWC000 = function(){
	jq("#changeBtn").attr("onclick", "");
	if(jq("#loginPwd").val() == ""){
		appAlert("알림", "비밀번호를 입력하세요.", "확인");
		return;
	}
	loginInfo.logined = "N";
	MWTranCtrl.mSessionId = "";
	var params = {
			app_pwd	: jq('#tk_loginPwd').val(),
			map_key	: mapKey
	};
	setTimeout(function(){
		tran.callTran("lcmwc000", params, pageObj.resultLCMWC000);
	}, 500);
};

// 로그인 결과
pageObj.resultLCMWC000 = function(resultData){
	if(resultData.IS_LOGIN_AUTH == "Y"){	// 로그인 성공
		
		adobeLogSet("LCMWC000");
		userInfo.mb_cno			= resultData.MB_CNO;
		userInfo.m12_cst_drm_no	= resultData.M12_CST_DRM_NO;
		// 활동지수 스탬프 목표 달성 체크
		if(resultData.LOGIN_STAMP_OFFER_YN == "Y"){
			appAlert("알림", "활동지수 목표에 달성하셨습니다.", "확인");
		}
		// 자동로그인 체크 
		if(jq("#autoLoginCheck").attr("class").match("check_on")){
			loginInfo.autoLogin = "Y";
			callNtv(null, null, "DevicePlugin", "saveData", ["","","","autoLogin","Y"]);
		}
		
		setLoginInfo(resultData.SERVER_KEY);
		
		if(pushInfo.code == ""){	// 일반 진입
			if(pageObj.obj == "C" && loginPageInfo.flag == "P"){	// 페이지 전환시 로그인이 필요한 페이지인경우 로그인후 전환하려는 페이지 호출
				backData.pop();
				commPage(loginPageInfo.flag, loginPageInfo.param1, loginPageInfo.param2, loginPageInfo.param3, loginPageInfo.param4);
			}else{													// 로그인 화면에서 로그인 혹은 페이지 전환 없이 로그인이 필요한 경우 로그인 후 마지막 페이지 호출
				jq("#leftBtn").click();
			}
			if(loginInfo.logined=="Y"){
			    var swtmp = setPageNum(resultData.IS_CREDIT_CARD_MEMBER,resultData.IS_CREDIT_CARD_M_AGREE,resultData.IS_MEMBERS_MEMBER,resultData.IS_MEMBERS_ACTIVE,userInfo.card_cert);
			    goPageNum(swtmp,"C000");
			}
		}else{						// 푸쉬를 통해 진입시
			if(pushInfo.code == "01" || pushInfo.code == "02"){
				commPage('P', 'LCMW2000');
			}else if(pushInfo.code == "06" || pushInfo.code == "05"){
				commPage("P", "LCMW1000");
			}else if(pushInfo.code == "03"){
				if(pushInfo.param == "CMS"){	// CMS 혜택
					commPage('P', 'LCMW4200');
				}else{							// 알뜰 쿠폰 혜택
					commPage('P', 'LCMW4000');
				}
			}else{
				goMain();
			}
		}
		
	}else{									// 로그인 실패
		jq("#changeBtn").attr("onclick", "commPage('P', 'LCMWC400', '', 'L')");
		jq("#loginPwd, #tk_loginPwd").val("");
		jq("#disp_loginPwd").html("");
		jq("#nextBtn").removeClass("btn_r");
		if(resultData.PSWD_ERR_TMS == ""){
			callNtv(null, null, "DevicePlugin", "forcedExit", ["알림", "현재 사용중인 기기의 사용자 정보가 변경되었습니다. 앱을 삭제후 다시 설치해주세요."]);
		}else if(resultData.PSWD_ERR_TMS >= 5){
			userInfo.mbr_st_dc = "L";
			jq("#changeBtn").attr("onclick", "pageObj.lockUserId()");
			pageObj.lockUserId();
		}else if(resultData.PSWD_ERR_TMS == 1){
			appAlert("알림", "비밀번호가 일치하지 않습니다. 재입력 후 다시 시도해 주세요.", "확인");
		}else{
			appAlert("알림", "비밀번호 입력 연속 " + resultData.PSWD_ERR_TMS + "회\n오류가 발생하였습니다.\n5회 오류 발생 시\n이용에 제한이 있습니다.", "확인"); 
		}
	}
};

pageObj.nextChk = function(){
	setTimeout(function(){
		if(jq("#loginPwd").val() == ""){
			jq("#nextBtn").removeClass("btn_r");
		}else{
			jq("#nextBtn").addClass("btn_r");
		}
	}, 10);
};

pageObj.cancel = function(){
//	goMain();
	jq("#leftBtn").click();
};

// 로컬 테스트용 로그인
pageObj.localLogin = function(){
	deviceInfo.uuid	= jq("#localuuid").val().trim();
	tran.callTran("lcmwc010", "", autoLoginResult);
};

/* JavaScript content from js/LCMW3/LCMW3150.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";

pageObj.pageFunction = function(obj){
	pageObj.lotte_cco_c = obj;
	jq("#btn_issue").attr("onclick", "commPage('P', 'LCMW3151', '', 'L')");
	jq("#card_img").attr("src", "images/bg/bg_sum03_3.png");
	var params = {
			lotte_cco_c : pageObj.lotte_cco_c
	};
		
	commPage("T", "lcmw3120", params, pageObj.resultLCMW3120);
};

pageObj.resultLCMW3120 = function(resultData){
	// 멤버스2차개발 데이터 추가 - MB_MNDT_AG_YN, CCD_MBYN
	var membersData = resultData.SMART_USER_INFO;
	userInfo.card_m_agree = membersData.IS_CREDIT_CARD_M_AGREE;//멤버스 정보제공 동의
	userInfo.ccd_mbyn = membersData.IS_CREDIT_CARD_MEMBER;//신용카드 회원 여부

	pageObj.pageTitle = resultData.CCO_NM;
	setTitle();
	jq("#btn_issue").attr("onclick", "commPage('P', 'LCMW3151', '', 'L')");
	jq("#card_img").attr("src", resultData.CD_DTL_IMG_URL_NM);
	jq("#contents").html(resultData.U_GUD_CN);
};

pageObj.members = function(){
	commPage('P', 'LCMW3151', '', 'L')
};
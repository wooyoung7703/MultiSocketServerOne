
/* JavaScript content from js/comm/adobeAppLog.js in folder common */
var appTitle = "롯데카드클러치";
var adobePageInfo = {
//		"lcmw1000"	:	"이벤트",
		"lcmw1020"	:	"이벤트",
		"lcmw1220"	:	"이벤트:내위치로검색",
//		"lcmw2000"	:	"알뜰쿠폰",
		"lcmw2020"	:	"알뜰쿠폰:쿠폰담기",
		"lcmw2080"	:	"알뜰쿠폰",
		"lcmw2091"	:	"알뜰쿠폰:할인쿠폰몰",
		"lcmw2095"	:	"MyWallet:보유쿠폰",
//		"lcmw3000"	:	"MyWallet:카드결제",
		"lcmw3002"	:	"MyWallet:앱카드:주카드변경",
		"lcmw3002"	:	"MyWallet:앱카드:앱카드등록해제",
		"lcmw3010"	:	"MyWallet:앱카드:앱카드결제",
		"lcmw3011"	:	"스마트영수증:앱카드결제취소",
		"lcmw3021"	:	"MyWallet:앱카드:앱카드추가",
		"lcmw3090"	:	"MyWallet:앱카드",
		"lcmw3100"	:	"MyWallet:멤버십",
		"lcmw3120"	:	"MyWallet:멤버십:멤버십상세",
		"lcmw3123"	:	"MyWallet:멤버십:직접등록카드상세",
		"lcmw3124"	:	"MyWallet:멤버십:직접등록카드삭제",
		"lcmw3130"	:	"MyWallet:멤버십:멤버십직접등록",
		"lcmw3140"	:	"MyWallet:멤버십:멤버십공지사항",
		"lcmw3150"	:	"MyWallet:멤버십:멤버십포인트거래내역",
		"lcmw3190"	:	"MyWallet:통합결제",
		"lcmw3200"	:	"MyWallet:보유쿠폰",
		"lcmw3300"	:	"MyWallet:스탬프",
		"lcmw3390"	:	"MyWallet:스탬프:스탬프적립내역이벤트상세",
//		"lcmw4000"	:	"스마트영수증:캘린더",
		"lcmw4011"	:	"영수증조회(PUSH)",
		"lcmw4012"	:	"스마트영수증:영수증조회",
		"lcmw4090"	:	"스마트영수증:캘린더",
		"lcmw4100"	:	"스마트영수증:목록조회",
		"lcmw4110"	:	"스마트영수증:영수증삭제",
		"lcmw5040"	:	"알뜰소식",
		"lcmw7000"	:	"카드신청",
		"lcmw7100"	:	"카드상세보기",
		"lcmw7240"	:	"카드간편신청",
		"lcmw8000"	:	"기프트카드잔액조회",
		"lcmw9000"	:	"고객센터:클러치공지사항",
		"lcmw9100"	:	"고객센터:FAQ",
		"lcmw9200"	:	"고객센터:서비스이용안내",
		"lcmwb110"	:	"비밀번호변경",
		"lcmwb120"	:	"비밀번호재설정",
		"lcmwb300"	:	"PUSH알림설정조회",
		"lcmwb310"	:	"PUSH알림설정",
		"lcmwc110"	:	"회원가입:약관동의",
		"lcmwc210"	:	"회원가입:본인인증",
		"lcmwc130"	:	"멤버스회원가입:약관동의",
//		"lcmwc220"	:	"멤버스회원가입:",
//		"lcmwc300"	:	"클러치회원가입",
		"lcmwc322"	:	"SMS서비스신청",
		
		"LCMWC000"	:	"로그인",
		"LCMWC220"	:	"멤버스회원가입:정보입력",
		"LCMWC221"	:	"멤버스회원가입:멤버스회원가입완료",
		"LCMWC300"	:	"회원가입:비밀번호설정",
		"LCMWC310"	:	"회원가입:클러치회원가입완료"
};
//var adobePageHist = "";
var adovePagePrev = "";
function adobeLogSet(pageId){
	var tmpPage = adobePageInfo[pageId];
	if(tmpPage == undefined || adovePagePrev == tmpPage) return;
	adovePagePrev = tmpPage;
//	adobePageHist = adobePageHist + ":" + tmpPage;
	
	var adobeTag = appTitle + ":" + tmpPage;
	if(s_catal) {
		s_catal.manageVars("clearVars");
		s_catal.pageName = adobeTag;
		if(pageId == "LCMWC000"){			// 로그인 성공
			s_catal.events = "event12";
		}else if(pageId == "lcmwc110"){		// 클러치회원가입 시도
			s_catal.events = "event10";
		}else if(pageId == "LCMWC310"){		// 클러치회원가입 완료
			s_catal.events = "event11";
		}else{
			s_catal.events = "event1";
		}
		if(userInfo.wallet_member == "Y"){
			s_catal.eVar20 = userInfo.wlt_mbr_seq;
			if(loginInfo.logined == "Y") {
				s_catal.eVar11 = "회원로그인";
			} else {
				s_catal.eVar11 = "회원비로그인";
			}
		}else{
			s_catal.eVar11 = "비회원";
		}
		// 특정폰 에서 어도비로그 오류 방지			
		if(deviceInfo.usingAppLog) void(s_catal.t());
	}
}

/* JavaScript content from js/LCMW3/LCMW3421.js in folder common */
pageObj.pageTitle = "현장결제";

pageObj.pageFunction = function(obj){
	jq("#leftBtn").attr("onclick", "commPage('P', 'LCMW3000')");
	obj = eval("(" + obj + ")");
	pageObj.barcodeInfo = obj;
	pageObj.appSet();
	maxBright(true);

};

pageObj.appSet = function(){
		jq("#barcode_app").show();
		jq("#barcode_app h2").html(pageObj.barcodeInfo.cd_nm);
		jq("#barcode_app li").eq(0).append(pageObj.barcodeInfo.masking_cdno);
		jq("#ur_nm").html(pageObj.barcodeInfo.ur_nm);
		jq("#barcode_app .right img").attr("src", "data:image/jpg;base64," + pageObj.barcodeInfo.elc_sign_v);
        jq("#barcode_app .members_barcord img").attr("src", "http://m.lottecard.co.kr/genbc?type=code128&msg=" + pageObj.barcodeInfo.otc + "&fmt=png&height=11&mw=0.18");
        var tmpOtc = pageObj.barcodeInfo.otc.substr(0, 4) + "-" + pageObj.barcodeInfo.otc.substr(4, 4) + "-" + pageObj.barcodeInfo.otc.substr(8, 4) + "-" + pageObj.barcodeInfo.otc.substr(12, 4) + "-" + pageObj.barcodeInfo.otc.substr(16);
        jq("#barcode_app .members_barcord img").attr("onclick", "popAppCardBarcode('" + pageObj.barcodeInfo.cd_nm + "', '" + pageObj.barcodeInfo.otc + "', '"+pageObj.barcodeInfo.card_url+"', '"+tmpOtc+"')");

		jq("#barcode_app .members_barcord strong").html(tmpOtc);
		pageObj.certStartTime = Math.floor(new Date().getTime()/1000) + 180;
		pageObj.showCountdown();
};

pageObj.cancel = function(){
	jq("#tmpHeader").attr("id", "header");
	jq("#leftBtn").css("display", "block");
	maxBright(false);
    popBarcodeClose();
    commPage("P", "LCMW3000");
};

//인증번호 입력 시간
pageObj.showCountdown = function(){	
    var min, mod;
    var sec = 0;
    var ExpireTime = pageObj.certStartTime - Math.floor(new Date().getTime()/1000);
    pageObj.remainTime = ExpireTime - 1;

    // 남은시간이 1초보다 클때만 보이게 하자.
    if (pageObj.remainTime >= 0){
		mod = ExpireTime % (24 * 3600);

        // 남은분
        min = Math.floor(mod / 60);

        // 남은초
        sec = mod % 60;

        // 보여줄 글자를 셋팅
        var CountText = "0" + min + ":" + (sec < 10 ? "0" + sec : sec);
        jq('#barcode_app .time span').html(CountText);
        pageObj.setTimeObj = setTimeout("pageObj.showCountdown()", 1000);
    }else{
    	appAlert("알림", "앱카드(간편결제) 결제시간이 초과 되었습니다.", "확인");
    	pageObj.cancel();
    }
};
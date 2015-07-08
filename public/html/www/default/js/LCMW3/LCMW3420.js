
/* JavaScript content from js/LCMW3/LCMW3420.js in folder common */
pageObj.pageTitle = "통합결제";

pageObj.pageFunction = function(obj){
//	jq("#header").attr("id", "tmpHeader");
//	jq("#leftBtn, #helpBtn").hide();
//	jq("#rightBtn").attr({"onclick" : "pageObj.cancel()", "class" : "btn_close"}).show();
	jq("#leftBtn").attr("onclick", "commPage('P', 'LCMW3400')");
	obj = eval("(" + obj + ")");
	pageObj.barcodeInfo = obj;
	
	pageObj.cpnSet();
	pageObj.memSet();
	pageObj.appSet();
	maxBright(true);
};

pageObj.cpnSet = function(){
	if(pageObj.barcodeInfo.cpn_list != ""){
		jq("#barcode_cpn").show();
		var splitCpnList = pageObj.barcodeInfo.cpn_list.split("|");
		for(var i = 0;i < splitCpnList.length; i++){
			var tmpData = {
					title 		: splitCpnList[i].split(",")[0],
					barcode		: splitCpnList[i].split(",")[1],
					titleImg	: splitCpnList[i].split(",")[4],
					titleClass	: "vendor"
			};
			if(splitCpnList[i].split(",")[2] == "MMS"){
				jq("#barcode_cpn").append(bindData(jq("#dataTmpl").val(), tmpData));
			}else{
				jq("#barcode_cpn").append(bindData(jq("#smsTmpl").val(), tmpData));
			}
		}
	}
};

pageObj.memSet = function(){
	if(pageObj.barcodeInfo.mem_list != ""){
		jq("#barcode_mem").show();
		consoleLog("D", "splitMemList : " +  pageObj.barcodeInfo.mem_list.split);
		var splitMemList = pageObj.barcodeInfo.mem_list.split("|");
		for(var i = 0;i < splitMemList.length; i++){
			var tmpData = {
					title 		: splitMemList[i].split(",")[0],
					barcode		: splitMemList[i].split(",")[1],
					titleImg	: splitMemList[i].split(",")[2],
					titleClass	: "card"
			};
			jq("#barcode_mem").append(bindData(jq("#dataTmpl").val(), tmpData));
			if(tmpData.barcode.length >= 12){
				jq("#barcode_mem img:last").css({"width" : "100%", "max-width": "311px"});
			}
		}
	}
};

pageObj.appSet = function(){
	if(pageObj.barcodeInfo.rpl_cdno != ""){
		jq("#barcode_app").show();
		jq("#barcode_app h2").html(pageObj.barcodeInfo.cd_nm);
		jq("#barcode_app li").eq(0).append(pageObj.barcodeInfo.masking_cdno);
		jq("#ur_nm").html(getMaskingName(pageObj.barcodeInfo.ur_nm));
		jq("#barcode_app .right img").attr("src", "data:image/jpg;base64," + pageObj.barcodeInfo.elc_sign_v);
		jq("#barcode_app .members_barcord img").attr("src", "http://m.lottecard.co.kr/genbc?type=code128&msg=" + pageObj.barcodeInfo.otc + "&fmt=png&height=11&mw=0.18");
		var tmpOtc = pageObj.barcodeInfo.otc.substr(0, 4) + "-" + pageObj.barcodeInfo.otc.substr(4, 4) + "-" + pageObj.barcodeInfo.otc.substr(8, 4) + "-" + pageObj.barcodeInfo.otc.substr(12, 4) + "-" + pageObj.barcodeInfo.otc.substr(16);
		jq("#barcode_app .members_barcord strong").html(tmpOtc);
		pageObj.certStartTime = Math.floor(new Date().getTime()/1000) + 180;
		pageObj.showCountdown();
	}
};

pageObj.cancel = function(){
	jq("#tmpHeader").attr("id", "header");
	jq("#leftBtn").css("display", "block");
	maxBright(false);
	commPage("P", "LCMW3400");
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
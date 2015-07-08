
/* JavaScript content from js/LCMW3/LCMW3123.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";

pageObj.pageFunction = function(obj){
	pageObj.cdNo = obj;
	var params = {
			cdno : pageObj.cdNo
	};
	
	// 등록 카드 정보 조회
	commPage("T", "lcmw3123", params, pageObj.reslutLCMW3123);
};

// 등록 카드 정보 조회 결과
pageObj.reslutLCMW3123 = function(resultData){
	pageObj.pageTitle = resultData.MS_CD_NM;
	setTitle();
//	jq("#card_img").attr("src", resultData.CD_DTL_IMG_URL_NM);
	jq("#barcode_img").attr("src", barcodeImg(pageObj.cdNo));
	jq("#barcode_no").html(pageObj.cdNo);
	jq("#barcode_zoom").attr("onclick", "popBarcode('" + resultData.MS_CD_NM + "', '" + pageObj.cdNo + "', 'images/img/img_tem01.png')");
	maxBright(true);
};

// 등록카드 삭제
pageObj.LCMW3124 = function(){
	appConfirm("알림", "등록하신 카드 내역이 삭제됩니다.", "확인", "취소", function(){
		var params = {
				cdno : pageObj.cdNo
		};
		// 등록 카드 삭제
		commPage("T", "lcmw3124", params, pageObj.reslutLCMW3124);
	}, function(){
	});
};

// 등록 카드 삭제 결과
pageObj.reslutLCMW3124 = function(resultData){
	if(resultData.DELETE_COUNT > 0){
		appAlert("알림", "카드가 삭제 되었습니다.", "확인");
		jq("#leftBtn").click();
	}else{
		appAlert("알림", "카드삭제에 실패하였습니다.\n잠시후 다시 이용해주세요", "확인");
	}
};
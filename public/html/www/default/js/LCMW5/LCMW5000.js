
/* JavaScript content from js/LCMW5/LCMW5000.js in folder common */
pageObj.pageTitle = "롯데카드 클러치";
pageObj.pageSize = 10;
pageObj.pageNo = 1;
pageObj.groupList = [{CODE : "", VALUE : "그룹사검색"}];
pageObj.cateList = [{CODE : "", VALUE : "관심보기"}];
pageObj.newsList = [{CODE : "", VALUE : "1"}];

pageObj.pageFunction = function(obj){
	jq("#newLCMW5000").hide();

	callNtv(null,null,"DevicePlugin","saveData",["","","","newLCMW5000", newBtn.newLCMW5000]);
    callNtv(null,null,"DevicePlugin","loadData",["","","pageObj.resultSelectItem","mReadNewsList"]);

	// 통합검색
	commPage("T", "lcmw5040", "", pageObj.resultLCMW5040);
};

pageObj.resultLCMW5040 = function(resultData){
	pageObj.resultLCMW5020(resultData);
	pageObj.resultLCMW5030(resultData);
	pageObj.resultLCMW5000(resultData);
};

// 구룹사 코드 검색 결과
pageObj.resultLCMW5020 = function(resultData){
	if(resultData.NEWS_GROUP_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.NEWS_GROUP});
		jq("#LCMW5020_select").html("<option value=''>그룹사검색</option>");
		for(var i = 0; i < dataList.getSize(); i++){
			jq("#LCMW5020_select").append("<option value='" + dataList.get(i).GRPCO_C + "'>" + dataList.get(i).GRPCO_NM + "</option>");
			pageObj.groupList.push({CODE : dataList.get(i).GRPCO_C, VALUE : dataList.get(i).GRPCO_NM});
		}
	}

};

//알뜰소식 카테고리 검색 결과
pageObj.resultLCMW5030 = function(resultData){
	if(resultData.NEWS_CATEGORY_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.NEWS_CATEGORY});
		jq("#LCMW5030_select").html("<option value=''>관심보기</option>");
		for(var i = 0; i < dataList.getSize(); i++){
			jq("#LCMW5030_select").append("<option value='" + dataList.get(i).COM_C + "'>" + dataList.get(i).COM_C_NM + "</option>");
			pageObj.cateList.push({CODE : dataList.get(i).COM_C, VALUE : dataList.get(i).COM_C_NM});
		}
	}

};

// 알뜰소식 리스트 조회
pageObj.LCMW5000 = function(){
	var params = {
			page_size	: pageObj.pageSize,
			page_no		: pageObj.pageNo,
			grpco_c		: jq("#LCMW5020_select").val(),
			cate_c		: jq("#LCMW5030_select").val()
		};
	commPage("T", 'lcmw5000', params, pageObj.resultLCMW5000);

};

// 알뜰소식 리스트 조회 결과
pageObj.resultLCMW5000 = function(resultData){
	if(resultData.NEWS_SIZE > 0){
		var dataList = new GridControl({"row" : resultData.NEWS});
		
		for(var i = 0; i < dataList.getSize(); i++){
			dataList.get(i).NEWS_BULT_SDT = dateComma(dataList.get(i).NEWS_BULT_SDT);
			jq("#newsList").append(bindData(jq("#dataTmpl").val(), dataList.get(i)));
			if(dataList.get(i).NEWS_IMG_PH_NM == "") jq("#newsList img:last").remove();
            
            pageObj.addEventNew(dataList.get(i).NEWS_NO);
            //callNtv(null,null,"DevicePlugin","loadData",["","","pageObj.resultSelectItem","NEWS_NO"+dataList.get(i).NEWS_NO]);
            if(pageObj.newsList!=""){
            	for(var ii = 0; ii < Object.keys(pageObj.newsList).length; ii++){
            		var code1 = pageObj.newsList[ii].CODE;
            		var value1 = pageObj.newsList[ii].VALUE;
            		if(pageObj.newsList[ii].CODE == dataList.get(i).NEWS_NO){    	       
            	        pageObj.changeBackground(dataList.get(i).NEWS_NO);
            		}
            	}
            }

		}
		
		initFullPop("fBtnPop", {
			leftBtn			: true, 
			rightBtn		: true,
			marginBottom	: "30px"
		});
		setTimeout(function(){
			moreSetting(resultData.NEWS_SIZE, pageObj.LCMW5000);
		}, 100);
		
	}
	remocon(true);

};

pageObj.addEventNew = function(evt_id){
    var tmpId = "#image_idx" + evt_id;
    var str =	"<div class='event_new' style='height:" + (jq(tmpId + " dl").height() + 2) + "px; width: " + (jq(tmpId + " dl").width() + 2) + "px;z-index:1'>";
    str +=			"<div class='event_new_img'></div>";
    str +=		"</div>";
    jq(tmpId).prepend(str);
};

pageObj.resultSelectItem = function(resultData){
	
	consoleLog("D",resultData);
	//초기 읽은 데이터가 없으면 리턴 시킴
	if(resultData=="0")
		return;
    pageObj.newsList = JSON.parse(resultData);

};

pageObj.changeBackground = function(evnid){
    var tmpId = "#image_idx" + evnid;
    jq(tmpId).hide();
};

pageObj.changeSelect = function(){
	pageObj.pageNo = 1;
	unbindScroll();
	jq(window).scrollTop(0);
	jq("#newsList").html("");
	jq("#LCMW5020_select, #LCMW5030_select").blur();
	pageObj.LCMW5000();
};

pageObj.sel = function(resultData){

	var data = false;
	for(var ii = 0; ii < Object.keys(pageObj.newsList).length; ii++){
		if(pageObj.newsList[ii].CODE == resultData){
			consoleLog("D","기존에 읽은 이벤트!!!"+pageObj.newsList[ii].CODE);
			data = true;
			continue;
		}
	}
	
	if(data==true||(Object.keys(pageObj.newsList).length>=1)&&data==false){
		pageObj.newsList.push({CODE : resultData, VALUE : "1"});
	    var newlist = JSON.stringify(pageObj.newsList);
	    callNtv(null,null,"DevicePlugin","saveData",["","","","mReadNewsList", newlist]);
	    pageObj.changeBackground(resultData);
	}

};

//아이폰 7.0 이상 버젼에서 반영되는 웹뷰 셀렉트 박스 네이티브로 커스터마이징
pageObj.iosSelect = function(flag){
	pageObj.flag = flag;
	var tmpList = pageObj.groupList;
	if(flag == "2"){
		tmpList = pageObj.cateList;
	}
	callNtv(null, null, "DevicePlugin", "selectbox", [tmpList, "pageObj.iosChangeSelect"]);
};

pageObj.iosChangeSelect = function(tmpCode, tmpValue){
	pageObj.pageNo = 1;
	unbindScroll();
	jq(window).scrollTop(0);
	jq("#newsList").html("");
	if(pageObj.flag == "1"){
		jq("#LCMW5020_select").val(tmpCode);
		jq("#iosSelect1").html(tmpValue);
	}else{
		jq("#LCMW5030_select").val(tmpCode);
		jq("#iosSelect2").html(tmpValue);
	}
	pageObj.LCMW5000();
};
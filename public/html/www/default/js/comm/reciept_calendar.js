
/* JavaScript content from js/comm/reciept_calendar.js in folder common */
var reciept_calendar = {
	year : 0,
	month : 0,
	init : function(year, month) {
		this.year = year;
		this.month = month;
			
		jq(".calendar tbody").html("");

		// 헤더 세팅
		jq(".calendar .title .year").text(this.year);
		jq(".calendar .title .month").text(this.month);
		
		// 달력생성
		var date = 1;
		var last_date = lastDate(this.year,  this.month);
		var dayw = getDay(this.year,  this.month, date);
		var result = pageObj.approvalData;
		var str = "";
		var calWidth = jq(".calendar th").width() + 11;
		for(var i = 0; i < 6; i++) {
			str += "<tr>";
			for(var j = 0; j < 7 ; j++) {
				if(dayw >= 7) dayw = 0;
				if(j == dayw && date <= last_date) {
					var item = "data" + date;
					if(item in result) {
						if(result[item][0] > 0 || result[item][1] > 0){
							str += "<td data-date='" + date + "' class='point'><div style='height:" + calWidth + "px;'>";
							str += "<strong>" + date + "</strong>";
							if(result[item][2]) {	
								str += "<span class='appr'>";
							}else{	
								str += "<span class='appr none_appr'>";
							}
							if(result[item][1] > 0) {
								str += "<span>취소" + result[item][1]+"</span>";	
							}
							if(result[item][0] > 0) {
								str += "<span>승인" + result[item][0]+"</span>";	
							}
							str += "</span>";
							
							//스탬프 있으면
							if(result[item][3]) {
								str += "<em class='stamp'>스탬프</em>";
							}
							//오퍼 있으면
							if(result[item][4]) {
								str += "<em class='offer'>오퍼</em>";
							}
							str += "</td>";
						}else{
							str += "<td data-date='"+date+"'><div style='height:" + calWidth + "px;'><strong>" + date + "</strong></div></td>";
						}
					}else {
						str += "<td data-date='"+date+"'><div style='height:" + calWidth + "px;'><strong>" + date + "</strong></div></td>";
					}
					date++;
					dayw++;
				}else {
					str += "<td></td>";
				}
			}
			str += "</tr>";
			if(date > last_date ) {
				break;
			}
		}
		jq("#calendarBody").html(str);
		jq("#calendarBody tr").each(function(){
			jq(this).find("td").eq(0).find("strong").css("color", "#fc3d39");
		});
//		if(jq("#select_payment option").size() > 0){
//			payDate();
//		}
	}
};

// 결제일 표시
function payDate(){
	if((pageObj.year + zero(pageObj.month, 2)) == pageObj.nxSttDt.substr(0, 6)){
		jq("#calendarBody strong").each(function(){
			var tmpDate = zero(jq(this).html(), 2);
			if(tmpDate == pageObj.nxSttDt.substr(6, 2)){
				jq(this).parent().parent().addClass("pay");
			}
		});
	}
	jq("#nx_stt_dt").html("<b class='pc01'>" + (parseInt(pageObj.nxSttDt.substr(4, 2), 10)) + "</b>월 결제예정금액");
}

// 마지막날 구하기
function lastDate(year, month) {
	var last_date;
	if(month == 2) {
		// 윤달체크
		if((year%4 == 0 && year%100 !=0 ) || year%400 ==0) {
			last_date = 29;
		}else {
			last_date = 28;
		}
	}else if(month == 1 || month == 3 || month == 5 || month==7 || month == 8 || month == 10 || month == 12) {
		last_date =  31;	
	}else {
		last_date = 30;
	}
	return last_date;
}

// 요일구하기
function getDay(year, month, date) {
	return new Date(year, (month-1), date).getDay();
}

/* JavaScript content from js/comm/commonUtil.js in folder common */
function objectToQueryString(params) {
	var str = "";
	if(typeof(params) == "object") {
		for(var att in params){
		   str += "&" + att + "=" + params[att];
		}
	}else{
		str = params;
	}
	
	return str;
}

// Grid class
GridControl = WLJSX.Class.create( {

	size : -1
	, gridDomObj : null
	
	, initialize : function(gridDomObj) {
		this.gridDomObj = gridDomObj;
		
		if(typeof(gridDomObj.row) == "string") {
			this.gridDomObj.row = [gridDomObj.row];
		}
		
		if(gridDomObj.row == undefined) this.size = 0;
		else if(this.gridDomObj.row.length == undefined) this.size = 1;
		else this.size = this.gridDomObj.row.length;
	}
	
	, getSize : function() {
		return this.size;
	}
	
	, getValue : function(idx, id) {
		if(this.size <= 0) return "";
		else if(this.size == 1) return eval("this.gridDomObj.row." + id);
		else return eval("this.gridDomObj.row["+idx+"]." + id);
	}
	
	, get : function(idx) {
		if(this.size <= 0) return null;
		else if(this.size == 1) return eval("this.gridDomObj.row");
		else return eval("this.gridDomObj.row["+idx+"]");
	}
});

//trim함수 추가
String.prototype.trim = function () { return this.replace(/^\s*|\s*$/g,"");};

//세자리콤마
String.prototype.toCurrency = function () {
	var value = this.toNumber() + '';
	var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    var n = value.replace(/,/gi, '');
    while (reg.test(n))
        n = n.replace(reg, '$1' + ',' + '$2');
    return n;
};

//날짜변환
String.prototype.toDate = function() {
	var date = null;
	
	if(this.length == 8) {
		date = new Date(this.substring(0, 4), this.substring(4, 6).toNumber() - 1, this.substring(6, 8));
	} else if(this.length == 10) {
		date = new Date(this.substring(0, 4), this.substring(5, 7).toNumber() - 1, this.substring(8, 10));
	}
	
	return date;
};

String.prototype.toNumber = function() {
	if(isNaN(this.replace(/,/g, ""))) return 0;
	return Number(this.replace(/,/g, ""));
};

String.prototype.toNewLine = function () {
	var result = this.replace(/\<\s*br\s*\/?\s*>/gi,"\n");	
	//특정 html태그 제거
	result = result.replace(/\<\s*\/?s*(strong|a|b)\s*\/?\s*\>/gi,"");
	
	return result;
};

function webPage(url) {
	appConfirm("알림", "해당 홈페이지로 이동하시면\n인터넷 브라우저 화면으로 전환됩니다.\n계속하시겠습니까?", "확인", "취소", function(){
		if(url.indexOf("http://") != 0 && url.indexOf("https://") != 0) {
			url = "http://" + url;
		}
		WL.App.openURL(url, "_blank");
	}, function(){
	});
}



//주민번호 체크로직
function chkJM(Jm1, Jm2) {
	if(Jm2 == undefined) {
		Jm2 = Jm1.substring(6, 13);
		Jm1 = Jm1.substring(0, 6);
	}
	
	var ret = false;
	var chk = 0;

	if (Jm1.length == 6 && Jm2.length == 7) {
		for ( var i = 0; i <= 5; i++)
			chk = chk + ((i % 8 + 2) * parseInt(Jm1.substring(i, i + 1)));
		for ( var i = 6; i <= 11; i++)
			chk = chk + ((i % 8 + 2) * parseInt(Jm2.substring(i - 6, i - 5)));
		chk = 11 - (chk % 11);
		chk = chk % 10;
		ret = (chk == parseInt(Jm2.substring(6, 7)));
		
		if ( ret == false ) {
			ret = isValid_ForeignerNo(Jm1 + Jm2);
		}
	}
	
	return (ret);
}

//외국인 주민번호 체크. 
function isValid_ForeignerNo(socno)
{
	var total =0;
	var parity = 0;

	var fgnNo = new Array(13);

	for(i=0;i<13;i++) fgnNo[i] = parseInt(socno.charAt(i));

	if(fgnNo[11] < 6) return false;

	if((parity = fgnNo[7]*10 + fgnNo[8])&1) return false;

	var weight = 2;

	for(i=0,total=0;i<12;i++)
	{
		var sum = fgnNo[i] * weight;
		total += sum;

		if(++weight > 9) weight=2;
	}

	if((total = 11 - (total%11)) >= 10) total -= 10;
	if((total += 2) >= 10) total -= 10;
	if(total != fgnNo[12]) return false;

	return true;
}

function isHangul(val)
{
	var len = val.length;
    for(var i=0;i < len;i++) {
 		achar = val.substring(i,i+1);
 		if(achar == " "){
 			//return false;//공백체크
 		}
 		if(!(  achar >= "!" && achar <= "}") )
 		{
 			return false;//한글입력시 return false;
 		}
 	}
 	return true;
}

//한글 입력폼 ( 공백, 숫자, 문자, 특수문자 필터링  )
function checkIDHan(userName)
{
	var id = userName.value;
	var len = id.length;
	for(var i=0;i < len;i++)
	{
		achar = id.substring(i,i+1);
		if(achar == " "){
			userName.focus();
			appAlert('입력확인','공백은 입력할 수 없습니다.','확인');
			userName.value = "";
			return false;
		}
		if(  achar >= "!" && achar <= "}" )
		{
			userName.focus();
			appAlert('입력확인','이름을 한글로 입력해 주세요.','확인');
			userName.value = "";
			return false;
		}
	}
	return true;
}

//현재일자+시간+분+초 가져오기 
function getCurrentTime() {	
	var today = new Date();

	var year 	= today.getFullYear();
	var month 	= today.getMonth() + 1;	if(month< 10) { month = "0" + month;}
	var day 	= today.getDate();	    if(day  < 10) { day   = "0" + day;  }
	var hour 	= today.getHours(); 	if(hour < 10) { hour  = "0" + hour; }
	var min  	= today.getMinutes();	if(min  < 10) { min   = "0" + min;  }
	var sec  	= today.getSeconds();   if(sec  < 10) { sec   = "0" + sec;  }
	
	return ( year + '' + month + '' + day + '' + hour + '' + min + '' + sec );
}

//한글, 숫자만 입력가능
function onlyHanNum(obj){
	var pattern = /[^ㄱ-ㅎ가-힣0-9]/g;
	if(pattern.test(jq(obj).val())){
		appAlert("알림", "한글, 숫자만 입력 가능합니다.", "확인");
		var replaced = jq(obj).val().replace(pattern,"");
		jq(obj).val(replaced);
	}
}

//한글, 영어만 입력가능
function onlyHanEn(obj){
	var pattern = /[^ㄱ-ㅎ가-힣A-Za-z ·]/g;
	if(pattern.test(jq(obj).val())){
		appAlert("알림", "이름에는 숫자나 특수기호 입력이 불가 합니다.", "확인");
		var replaced = jq(obj).val().replace(pattern,"");
		jq(obj).val(replaced);
	}
}

// 숫자만 입력 가능
function onlyNum(obj){
	var pattern = /[^0-9]/g;
	if(pattern.test(jq(obj).val())){
		appAlert("알림", "숫자만 입력 가능합니다.", "확인");
		var replaced = jq(obj).val().replace(pattern,"");
		jq(obj).val(replaced);
	}
}

// 영어, 공백만 입력 가능
function onlyEn(obj){
	var pattern = /[^a-zA-Z ]/g;
	if(pattern.test(jq(obj).val())){
		appAlert("알림", "영문명은 영문, 공백만 입력 가능합니다.", "확인");
		var replaced = jq(obj).val().replace(pattern,"");
		jq(obj).val(replaced);
	}
}

// 이메일 형식 체크
function isEmail(input) {
	var re = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	return !re.test(input);
}

// 문자 byte체크
function chkByte(obj, maxLength){
	if(jq(obj).val() || jq(obj).val() != ""){
		var objstr = jq(obj).val(); 
		var objstrlen = objstr.length; 
		var maxlen = maxLength; 
		var bytesize = 0; 
		var onechar = ""; 
		for(var i=0; i< objstrlen; i++) { 
			onechar = objstr.charAt(i); 
			if (escape(onechar).length > 4) { 
				bytesize += 2; 
			} else {  
				bytesize++;
			} 
		}
		if(bytesize > maxlen) {
			appAlert("알림", "입력 가능한 자릿수를 초과 하였습니다. 재입력 후 다시 시도해 주세요", "확인");
			jq(obj).val(jq(obj).val().substr(0, jq(obj).val().length -1 ));
		}
	}
}

// 날짜에 . 찍기
function dateComma(text, flag){
	return flag ? text.substr(0, 4) + ". " + parseInt(text.substr(4, 2), 10) + ". " + parseInt(text.substr(6, 2), 10) : text.substr(0, 4) + "." + text.substr(4, 2) + "." +text.substr(6, 2);
}

function dateCommaYymmdd(text){
	return text.substr(2, 2) + "." + text.substr(4, 2) + "." +text.substr(6, 2);
}

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this._keyStr.charAt(enc1)
					+ this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3)
					+ this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for ( var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}
		return string;
	}
};
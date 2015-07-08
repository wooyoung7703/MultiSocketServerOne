
/* JavaScript content from js/comm/passwordCheckUtil.js in folder common */
// 문자길이 
function getStrLength(tempStr){
	return trim(tempStr).length;
}

// 공백제거
function trim(str) {
	return str.replace(/\s/gi,'');
}

// 숫자인지 체크
function isDigit(str) {
	var check = /[0-9]/g;
	return check.test(str);
}

// 알파벳, 숫자, 데시(-), 언더바(_) 이외의 문자 허용안함
// 해당문자 이외의 값이 있는경우 true 반환
function isWrongChar(str) {
	var check = /[^a-zA-Z0-9-_]/g;
	return check.test(str);
}

// 비밀번호가 숫자와 문자 혼합인지 체크
// 혼합이 아닌경우 false, 혼합인경우 true
function isAlphaDigitMixed(tempStr) {
	var cntvar = 0;
	var cntString = 0;
	
	var str = trim(tempStr);
	if( str.length > 0 ) {
		for(var i = 0; i < str.length; i++) {

			if(isDigit(str.charAt(i)))
				cntvar++;
			else
				cntString++;
		}
	}
	
	if(cntvar < 1 || cntString < 1) {
		return false;
	} else {
		return true;
	}
}

// 3 자리 이상 같은 문자를 반복으로 사용하는지 체크
// 반복된 문자가있으면 1, 없으면 0
// [사용예] 
//  checkSameString("12325") => 0
//  checkSameString("12225") => 1
function checkSameString(tempStr){
	var ret = false;
	if(tempStr.length >= 3) {
		for(var i=0; i<tempStr.length-2; i++) {
			if(
				(tempStr.charAt(i) == tempStr.charAt(i+1)) &&
				(tempStr.charAt(i+1) == tempStr.charAt(i+2)) 
			)
			return true;
		}
	}
	return ret;
}

// 1234, 3210 과 같은 증가 감소규칙이 있는 입력을 사용하는지 체크
// 연속된 문자가있으면 1, 없으면 0
// 연속길이 : 4인 경우 !
// [사용예] 
//  checkSerizeString("A4321") => 1
//  checkSerizeString("12341") => 1
//  checkSerizeString("ABCD1") => 1
//  checkSerizeString("1ABCD") => 1
//  checkSerizeString("12225") => 0

function checkSerizeString(tempStr){
		var ret = false;
		if(tempStr.length >= 4) {
			for(var i=0; i<tempStr.length-3; i++) {
				if(
					(tempStr.charAt(i)*1)+1 == (tempStr.charAt(i+1)*1) &&
					(tempStr.charAt(i)*1)+2 == (tempStr.charAt(i+2)*1) &&
					(tempStr.charAt(i)*1)+3 == (tempStr.charAt(i+3)*1) ) {
					return true;
				}
				
				if(
					(tempStr.charAt(i)*1)-1 == (tempStr.charAt(i+1)*1) &&
					(tempStr.charAt(i)*1)-2 == (tempStr.charAt(i+2)*1) &&
					(tempStr.charAt(i)*1)-3 == (tempStr.charAt(i+3)*1) ) {
					return true;
				}
			}
		}
		return ret;
}

// 2468, 1357, 7531같은 증가 감소규칙이 있는 입력을 사용하는지 체크
// 연속된  문자가있으면 1, 없으면 0
// 연속길이 : 4인 경우 !
// [사용예] 
//  checkSerize2String("2468") => 1
//  checkSerize2String("1357") => 1
//  checkSerize2String("7531") => 1
//  checkSerize2String("aceg") => 1
//  checkSerize2String("12225") => 0

function checkSerize2String(tempStr){
		var ret = false;
		if(tempStr.length >= 4) {
			for(var i=0; i<tempStr.length-3; i++) {
				if(
					(tempStr.charAt(i)*1)+2 == (tempStr.charAt(i+1)*1) &&
					(tempStr.charAt(i)*1)+4 == (tempStr.charAt(i+2)*1) &&
					(tempStr.charAt(i)*1)+6 == (tempStr.charAt(i+3)*1) ) {
					return true;
				}
				
				if(
					(tempStr.charAt(i)*1)-2 == (tempStr.charAt(i+1)*1) &&
					(tempStr.charAt(i)*1)-4 == (tempStr.charAt(i+2)*1) &&
					(tempStr.charAt(i)*1)-6 == (tempStr.charAt(i+3)*1) ) {
					return true;
				}
			}
		}
		return ret;
}

//주민번호를 비밀번호에 사용했을 경우 체크
//getCheckJuminNumber(860206cho, 860206, 2071018) -> 1
//getCheckJuminNumber(123456, 333333, 0019210) -> 0
function getCheckJuminNumber(pwd1, jumin1, jumin2) {
	var jumin = jumin1 + jumin2;
	
	if(pwd.length > 0 && jumin.length > 0) {
			
			var ch1 = jumin.substring(0,1) + jumin.substring(1,2) + jumin.substring(2,3) + jumin.substring(3,4);
			var ch2 = jumin.substring(1,2) + jumin.substring(2,3) + jumin.substring(3,4) + jumin.substring(4,5);
			var ch3 = jumin.substring(2,3) + jumin.substring(3,4) + jumin.substring(4,5) + jumin.substring(5,6);
			var ch4 = jumin.substring(3,4) + jumin.substring(4,5) + jumin.substring(5,6) + jumin.substring(6,7);
			var ch5 = jumin.substring(4,5) + jumin.substring(5,6) + jumin.substring(6,7) + jumin.substring(7,8);
			var ch6 = jumin.substring(5,6) + jumin.substring(6,7) + jumin.substring(7,8) + jumin.substring(8,9);
			var ch7 = jumin.substring(6,7) + jumin.substring(7,8) + jumin.substring(8,9) + jumin.substring(9,10);
			var ch8 = jumin.substring(7,8) + jumin.substring(8,9) + jumin.substring(9,10) + jumin.substring(10,11);
			var ch9 = jumin.substring(8,9) + jumin.substring(9,10) + jumin.substring(10,11) + jumin.substring(11,12);
			var ch10 = jumin.substring(9,10) + jumin.substring(10,11) + jumin.substring(11,12) + jumin.substring(12,13);
			
			if(pwd1.indexOf(ch1) > -1 || pwd1.indexOf(ch2) > -1 || pwd1.indexOf(ch3) > -1   || 
			   pwd1.indexOf(ch4) > -1 || pwd1.indexOf(ch5) > -1 || pwd1.indexOf(ch6) > -1 ||
			   pwd1.indexOf(ch7) > -1 || pwd1.indexOf(ch8) > -1 || pwd1.indexOf(ch9) > -1 ||
			   pwd1.indexOf(ch10) > -1 ) {
			   return true;
			 }
			 else {
				return false;
			}
	}
	return 0;
}

//주민번호를 비밀번호에 사용했을 경우 체크
function getCheckJuminNumber2(pwd1, jumin) {
	if(pwd1.length > 0 && jumin.length > 0) {
			
		var ch1 = jumin.substring(0,1) + jumin.substring(1,2) + jumin.substring(2,3) + jumin.substring(3,4);
		var ch2 = jumin.substring(1,2) + jumin.substring(2,3) + jumin.substring(3,4) + jumin.substring(4,5);
		var ch3 = jumin.substring(2,3) + jumin.substring(3,4) + jumin.substring(4,5) + jumin.substring(5,6);
		var ch4 = jumin.substring(3,4) + jumin.substring(4,5) + jumin.substring(5,6) + jumin.substring(6,7);
		var ch5 = jumin.substring(4,5) + jumin.substring(5,6) + jumin.substring(6,7) + jumin.substring(7,8);
		var ch6 = jumin.substring(5,6) + jumin.substring(6,7) + jumin.substring(7,8) + jumin.substring(8,9);
		var ch7 = jumin.substring(6,7) + jumin.substring(7,8) + jumin.substring(8,9) + jumin.substring(9,10);
		var ch8 = jumin.substring(7,8) + jumin.substring(8,9) + jumin.substring(9,10) + jumin.substring(10,11);
		var ch9 = jumin.substring(8,9) + jumin.substring(9,10) + jumin.substring(10,11) + jumin.substring(11,12);
		var ch10 = jumin.substring(9,10) + jumin.substring(10,11) + jumin.substring(11,12) + jumin.substring(12,13);

		if(pwd1.indexOf(ch1) > -1 || pwd1.indexOf(ch2) > -1 || pwd1.indexOf(ch3) > -1   || 
		   pwd1.indexOf(ch4) > -1 || pwd1.indexOf(ch5) > -1 || pwd1.indexOf(ch6) > -1 ||
		   pwd1.indexOf(ch7) > -1 || pwd1.indexOf(ch8) > -1 || pwd1.indexOf(ch9) > -1 ||
		   pwd1.indexOf(ch10) > -1 ) {
			return true;
		}
		else {
			return false;
		}
	}
	return 0;
}

//전화번호를 사용했을 경우 체크
function getCheckTelNumber(pwd, data) {

	var data_length = data.length;
	var remain_num = data_length % 3;
	var loop_cnt = ( data_length - remain_num ) / 3;

	var check_char_array = new Array();
	var one, two, three, four, index_cnt = 0;
	for (var i = 0; i < loop_cnt; i++ ) {
		one   = data.substring(index_cnt, ++index_cnt);
		two   = data.substring(index_cnt, ++index_cnt);
		three = data.substring(index_cnt, ++index_cnt);
		check_char_array.push(one+two+three);
	}

	if ( remain_num > 0 ) {
		index_cnt = index_cnt - (3 - remain_num);
		one   = data.substring(index_cnt, ++index_cnt);
		two   = data.substring(index_cnt, ++index_cnt);
		three = data.substring(index_cnt, ++index_cnt);
		check_char_array.push(one+two+three);
	}

	var isContainChar = false;
	for ( var arrCnt = 0; arrCnt < check_char_array.length; arrCnt++ ) {
		if( pwd.indexOf(check_char_array[arrCnt]) > -1 ) {
			isContainChar = true;
			break;
		}
	}

	return isContainChar;
}
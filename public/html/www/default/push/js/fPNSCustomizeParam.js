
/* JavaScript content from push/js/fPNSCustomizeParam.js in folder common */
/**
 * fPNSCustomizeParam Javascript 환경에 맞게 수정할수 있는 기본 파라메터들을 정의 하고 관리한다.
 */

/**
 * 보관함에서 사용할 메인앱 코드를 설정한다.
 * 운영버젼에서는 필요없는 Const 값들을 삭제해야한다.
 */
/*
var fpnsAppCode = {
    "SMARTLOTTE"    : {       // 스마트롯데앱
        "CARD"    :"01",      // 스마트롯데앱 카드
        "MEMBERS" :"02"       // 스마트롯데앱 맴버스
    },
    "SMARTCONSUMER" : "03",   // 스마트컨슈머앱
    "MEMBERS"       : "04",   // 멤버스앱
    "APPCARD"       : "05",   // 앱카드앱
    "FPNSCLIENT"    : "99"    // FPNS테스트앱
};
*/
var fpnsAppCode = { };
fpnsAppCode["SMARTLOTTE"]         = { };    // 스마트롯데앱
fpnsAppCode["SMARTLOTTE"]["CARD"] = "01";   // 스마트롯데앱 카드
fpnsAppCode["SMARTLOTTE"]["CARD"] = "02";   // 스마트롯데앱 맴버스
fpnsAppCode["SMARTCONSUMER"]      = "03";   // 스마트컨슈머앱
fpnsAppCode["MEMBERS"]            = "04";   // 멤버스앱
fpnsAppCode["APPCARD"]            = "05";   // 앱카드앱
fpnsAppCode["WALLET"]             = "06";   // 월렛
fpnsAppCode["FPNSCLIENT"]         = "99";   // FPNS테스트앱

Fpns.MainAppCode = fpnsAppCode["WALLET"];

var pushUrl, mqttHost;
if(stateDev){	// 개발
//	pushUrl = "http://clutch.lottecard.co.kr/papp/";
//	mqttHost = ["124.243.36.161:1883", "124.243.36.162:1883"];
	
	// 구
//	pushUrl = "http://10.31.80.247:8080/";
//	mqttHost = ["10.41.15.91:1883", "10.41.15.92:1883"];
	
	// 신
	pushUrl = "http://10.25.5.102:8090/papp/";
//	pushUrl = "http://10.25.5.102:24001/";
	mqttHost = ["10.25.5.102:1883", "10.25.5.102:1883"];
}else{			// 운영
	pushUrl = "http://clutch.lottecard.co.kr/papp/";
	mqttHost = ["124.243.36.161:1883", "124.243.36.162:1883"];
}
/**
 * 보관함과 통신 모듈에 대한 정의
 * AJAX : Javascript AJAX 모듈을 이용해 보관함서버와 통신한다.
 * NATIVE : Native Client 모듈에 포함된 통신 모듈을 이용해 보관함서버와 통신한다.
 */
var fpnsCommConst = {
    TYPE_AJAX       : 'AJAX',
    TYPE_NATIVE     : 'NATIVE',

    //The developer have to choose one of type between 'AJAX' or 'NATIVE'.
    USE_TYPE       : 'NATIVE',

    // server info
    SERVER_URL_SUBSCRIBE   : pushUrl + "PSDE0010.top2",
    SERVER_URL_MESSAGE     : pushUrl + "PSDE0020.top2",

    // MQTT 설정 by etyoul
    MQTT : {
        ENABLED         : "true", // MQTT 사용여부
        // Server
        HOST			: mqttHost,
        PORT            : "",
        USERNAME        : "",
        PASSWORD        : "",
        CLEAN_SESSION   : "false", // 접속시 기존 세션을 정리할지 여부
        USE_SSL         : "false", // SSL을 사용할지 여부
        LWT_TOPIC       : "", // 디바이스가 비정상 종료시 토픽
        LWT_MSG         : "", // 디바이스가 비정상 종료시 메시지
        QOS             : "2", // quality of service : 0 ~ 2
        RESULT_SEND     : "false",
        RECONNECT		: "10", // 접속 실패시 재시도할 시간 (초)
    },
};

Fpns.CommConst = fpnsCommConst;


/**
 * Client 모듈에서 사용하는 기본 메시지 들을 정리한다.
 */
var fpnsMessages = {
    ALERT_TITLE           : '알림',
    ALERT_BUTTON1         : '동의',
    ALERT_BUTTON2         : '동의안함',
    ERROR_NETWORK         : 'con_err',
    RESULT_SUCCESS        : '0000',
    FIRST_LOGIN           : '롯데카드에서 "개인(신용)정보 수집 이용동의서"의 "선택적인 수집 이용에 관한사항"에 동의하신 고객님께 PUSH 서비스를 제공해드립니다. 알림서비스받기를 거부하시는 고객님께서는 카드 메세지Box>설정>메세지수신설정을 off로 해주시면 됩니다.',
    MEMBERS_FIRST_LOGIN   : '알림서비스 받기를 거부하시는 고객님께서는 멤버스 메세지Box>설정>메세지수신설정을 off로 해주시면 됩니다.',
    MESSAGE_NETWORK_ERR   : '네트워크 접속이 원활하지 않습니다. 잠시 후에 다시 시도해주세요',
//    ALREADY_EXIST_USER    : '이 기기로 등록된 사용자가 있습니다. 사용자를 바꾸시겠습니까?',
    ALREADY_EXIST_USER    : '회원님께서는 단말기를 변경하여 로그인하셨습니다. 이제 이 단말기로 메세지를 받고자 하시면 동의버튼을 눌러주세요. 동의하지 않으시면 기존에 사용하고 계셨던 단말기로 메세지가 전송됩니다.\n\n앞으로 이 단말기로 메세지를 받으시겠습니까?',
//    ALREADY_EXIST_DEVICE  : '이 사용자는 다른 기기에 등록되어있습니다. 기기를 교체하시겠습니까?',
    ALREADY_EXIST_DEVICE  : '회원님께서는 단말기를 변경하여 로그인하셨습니다. 이제 이 단말기로 메세지를 받고자 하시면 동의버튼을 눌러주세요. 동의하지 않으시면 기존에 사용하고 계셨던 단말기로 메세지가 전송됩니다.\n\n앞으로 이 단말기로 메세지를 받으시겠습니까?',
    NOT_ALLOWED_PUSH      : '고객님께서는 "개인(신용)정보 수집 및 이용동의서"의 "선택적 수집 이용에 관한 사항"에 동의하지 않으셨거나 당사 홈페이지에서 마케팅PUSH수신거부를 하셔서 이 화면에서 롯데카드 메세지수신설정을 하실 수 없습니다. 자세한 사항은 메세지수신설정 안내에서 확인가능합니다.',
    OPEN_BROWSER          : "인터넷 브라우저 화면으로 전환됩니다.\n계속하시겠습니까?",
    SUCCESS               : '정상 처리되었습니다.'
};

Fpns.Messages = fpnsMessages;

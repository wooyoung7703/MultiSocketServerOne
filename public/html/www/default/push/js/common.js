
/* JavaScript content from push/js/common.js in folder common */
var isLogin = false;
getParameter = function(name) {
    var search = location.href.valueOf();
    if (!search) {
        //파라미터가 하나도 없을때
        return "";
    }
    search = search.substring(search.indexOf("?")+1, search.length);;
    var data = search.split("=");
    index = search.indexOf(name);
    if (search.indexOf(name) == (-1)) {
        //해당하는 파라미터가 없을때.
        return "";
    }
    if (search.indexOf("&") == (-1)) {
        //한개의 파라미터일때.
        data = search.split("=");
        return data[1];
    } else {
        //여러개의 파라미터 일때.
        data = search.split("&"); //엠퍼센트로 자름.
        for (var i = 0; i <= data.length - 1; i++) {
            l_data = data[i].split("=");
            if (l_data[0] == name) {
                return l_data[1];
                break;
            } else
                continue;
        }
    }
};

var isTouchAble = function() {
    if(navigator.userAgent.indexOf("Android 4") != -1) {
        return true;
    }
    else {
        return false;
    }
};
var _touchAble = isTouchAble();
touchStart = (_touchAble) ? "touchstart" : "mousedown";
touchEnd   = (_touchAble) ? "click" : "click";
touchMove   = (_touchAble) ? "touchmove" : "mousemove";

var isValid = function(data) {
    if(data.returnVal!=undefined&&data.returnVal==Fpns.Messages.ERROR_NETWORK){
        return false;
    }else if(data.returnVal.RESULT_CODE!=undefined&&data.returnVal.RESULT_CODE!='0000'){
        return false;
    }else {
        return true;
    }
};

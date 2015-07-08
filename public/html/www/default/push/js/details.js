
/* JavaScript content from push/js/details.js in folder common */
var detailPage = function() {
    this.init();
//    this.title = null;
};
detailPage.prototype = {
    init : function() {
        var param = new Object();
        param.msg_id = getParameter('push_id');
        param.url = Fpns.CommConst.SERVER_URL_MESSAGE;

        Fpns.Communication.getDetail(this.getDetail, param);
    },

    getDetail : function(data) {


        var dataType = data.returnVal.DATA.MSG_DV_V;

        var decodedMsg = decodeURIComponent(data.returnVal.DATA.TXT_DTL_CN);
        for(var idx=decodedMsg.indexOf('\r\n'); idx>=0; idx=decodedMsg.indexOf('\r\n')){
            decodedMsg = decodedMsg.replace('\r\n', '<br/>');
        };
        document.getElementById('title').innerHTML = sessionStorage.getItem('title')+"<span class='period'>등록일 : "+data.returnVal.DATA.LT_CH_DTTI+"</span>";
        if(dataType=="1"||dataType=="5"){
            document.getElementById('content').innerHTML = decodedMsg;

        }else if(dataType=="2"){
            document.getElementById('imageView').setAttribute("src", decodedMsg);
            document.getElementById('imageView').style.display="block";
        }

        refreshScroll();
    },
    endView : function() {
        Fpns.FasGap.endView();
    },
    goToList : function() {
        history.go(-1);
    }
};

var detailView;
detailInit = function(isCard) {
    detailView = new detailPage();
};
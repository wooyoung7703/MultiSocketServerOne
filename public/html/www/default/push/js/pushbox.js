
/* JavaScript content from push/js/pushbox.js in folder common */
var listView = function() {
    listOnclick = null;
    this.init();
    this.title = null;
    this.msgCode = null;
};
listView.prototype = {
    init : function() {

        var isNewMessage = getParameter('newMessage');
        if(isNewMessage=='true'||isNewMessage==true||isNewMessage!=''){
            sessionStorage.setItem('msg_code', '');
            location.href = 'pushbox.html';
        }else{
            this.getData(sessionStorage.getItem('msg_code'));
            setMenuIcon(optCodeToName(sessionStorage.getItem('msg_code')));
        }

        initTouchSlider();

        //IOS에서 미리보기 설정 없애고 알림설정 DISABLE

        if(Fpns.FasGap.os==Fpns.Const.IOS){
            jQuery('#previewArticle').hide();
            jQuery('#notiLayer').show();
            jQuery('#iOSSetup').show();
            jQuery('#iOSSetup1').show();
        };
        this.prepareSetup();

        document.getElementById('subscribe').addEventListener(touchEnd, function() {
            ListView.setupBtnListener('subscribe', this);
        } );
        document.getElementById('unsubscribe').addEventListener(touchEnd, function() {
            ListView.setupBtnListener('subscribe', this);
        });
        document.getElementById('noti').addEventListener(touchEnd, function() {
            ListView.setupBtnListener('noti', this);
        });
        document.getElementById('unnoti').addEventListener(touchEnd, function() {
            ListView.setupBtnListener('noti', this);
        });
        document.getElementById('preview').addEventListener(touchEnd, function() {
            ListView.setupBtnListener('preview', this);
        });
        document.getElementById('unpreview').addEventListener(touchEnd, function() {
            ListView.setupBtnListener('preview', this);
        });
    },
    getData : function(msgCode) {
        try {
            Fpns.FasGap.showDialog();
            var param = new Object();
            param.app_code = Fpns.MainAppCode;
            if(msgCode&&msgCode!='')
                param.msg_code = msgCode;
            param.url = Fpns.CommConst.SERVER_URL_MESSAGE;
            Fpns.Communication.getList(this.setListData, param);

        } catch (e) {
            // TODO: handle exception
            console.log(e);
        }
    },
    prepareSetup : function() {
        var cardObj = new Object();
        cardObj.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
        cardObj.app_code = Fpns.MainAppCode;
        Fpns.FasGap.isSubscribe(this.prepareSetupCallback, cardObj);
        Fpns.FasGap.getPreview(this.prepareSetupCallback);
        Fpns.FasGap.getNotify(this.prepareSetupCallback);
    },
    prepareSetupCallback : function(result) {
        switch (result.cmd) {
        case "isSubscribe":
            if(result.returnVal.RESULT_CODE=='0000'){
                var isSub = result.returnVal.DATA.VALUE;
                if(isSub=='false'){
                    jQuery('#radio1').removeClass('SwitchON');
                    jQuery('#radio1').addClass('SwitchOFF');
                }else{
                    jQuery('#radio1').removeClass('SwitchOFF');
                    jQuery('#radio1').addClass('SwitchON');
                }
            }
            break;
        case "getPreview":
            var isPrev = result.returnVal;
            if(isPrev=='false'){
                jQuery('#radio2').removeClass('SwitchON');
                jQuery('#radio2').addClass('SwitchOFF');
            }else{
                jQuery('#radio2').removeClass('SwitchOFF');
                jQuery('#radio2').addClass('SwitchON');
            }
            break;
        case "getNotify":
            var isNoti = result.returnVal;
            if(isNoti=='false'){
                jQuery('#radio3').removeClass('SwitchON');
                jQuery('#radio3').addClass('SwitchOFF');
            }else{
                jQuery('#radio3').removeClass('SwitchOFF');
                jQuery('#radio3').addClass('SwitchON');
            }
            break;
        default:
            break;
        }
    },
    setupClickTime : new Date,

    setupBtnListener : function(option, obj) {
        var nowTime = new Date();
        var timeGap = nowTime - this.setupClickTime;
        if(timeGap>1000||timeGap<100){
            this.setupClickTime = nowTime;
            var isOn = jQuery(obj.parentNode).hasClass('SwitchOFF');
            if(option=='subscribe'){
                Fpns.FasGap.showDialog();
                var param = {
                        app_code : Fpns.MainAppCode,
                        url : Fpns.CommConst.SERVER_URL_SUBSCRIBE,
                };
                if(isOn){
                    Fpns.FasGap.subscribe(this.setupBtnCallback, param);
                }else{
                    Fpns.FasGap.unSubscribe(this.setupBtnCallback, param);
                }
            }else if(option=='preview'){
                Fpns.FasGap.setPreview(this.setupBtnCallback, isOn);
            }else if(option=='noti'){
                if(Fpns.FasGap.os!=Fpns.Const.IOS){
                    Fpns.FasGap.setNotify(this.setupBtnCallback, isOn);
                }
            };
        }
    },
    setupBtnCallback : function(result) {
        switch (result.cmd) {
        case "subscribe":
            Fpns.FasGap.hideDialog();
            var resultCode = result.returnVal.RESULT_CODE;
            if(result.returnVal==Fpns.Messages.ERROR_NETWORK){
                alert(Fpns.Messages.MESSAGE_NETWORK_ERR);
            }else if(resultCode=='9105'){
                if(confirm(Fpns.Messages.ALREADY_EXIST_USER)){
                    var param = new Object();
                    param.app_code = Fpns.MainAppCode;
                    param.overwrite_user = "true";
                    param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
                    Fpns.FasGap.subscribe(ListView.subscribeCallback, param);
                }
            }else if(resultCode=='9104'){
                if(confirm(Fpns.Messages.ALREADY_EXIST_DEVICE)){
                    var param = new Object();
                    param.app_code = Fpns.MainAppCode;
                    param.overwrite_user = "true";
                    param.url = Fpns.CommConst.SERVER_URL_SUBSCRIBE;
                    Fpns.FasGap.subscribe(ListView.subscribeCallback, param);
                }

            }else if(resultCode=='0000'){
                changeSubscribeBtn();
            }else if(resultCode=='9101'){
                alert("로그인 정보가 없습니다.");
            }else{
                alert(Fpns.Messages.MESSAGE_NETWORK_ERR);
            }
            break;
        case "unSubscribe":
            Fpns.FasGap.hideDialog();
            var resultCode = result.returnVal.RESULT_CODE;
            if(result.returnVal==Fpns.Messages.ERROR_NETWORK){
                alert(Fpns.Messages.MESSAGE_NETWORK_ERR);
            }else if(resultCode=='0000'){
                changeSubscribeBtn();
            }
            break;
        case "setPreview":
            if(result.returnVal!='success'){
                console.log('error!!!');
            }
            break;
        case "setNotify":
            if(result.returnVal!='success'){
                console.log('error!!!');
            }
            break;
        default:
            break;
        }
    },
    subscribeCallback : function(data) {
        Fpns.FasGap.hideDialog();
        if(data.returnVal.RESULT_CODE='0000'){
            changeSubscribeBtn();
            alert(Fpns.Messages.SUCCESS);
        }else{
            alert(Fpns.Messages.MESSAGE_NETWORK_ERR);
        }
    },
    setListData : function(data) {
        try {
            var listObj = jQuery('#PushList');
            document.getElementById('PushList').innerHTML ="";
            if (isValid(data)) {

                var listdata = data.returnVal.DATA;

                if(listdata.length>0){
                    var date = listdata[0].FW_DTTI;
                    listObj.append('<h5 class="date">'+listdata[0].FW_DTTI+'</h5>');
                    listObj.append('<div id="'+listdata[0].FW_DTTI+'"></div>');
                    for ( var i = 0; i < listdata.length; i++) {
                        if(date!=listdata[i].FW_DTTI){
                            listObj.append('<h5 class="date">'+listdata[i].FW_DTTI+'</h5>');
                            listObj.append('<div id="'+listdata[i].FW_DTTI+'"></div>');
                            date=listdata[i].FW_DTTI;
                        }

                        var listObjG1 = jQuery('#PushList #'+listdata[i].FW_DTTI+':last-child');

                        if(listdata[i].HS_CYN=='Y'){
                            listObjG1.append('<dl id="'+listdata[i].FW_SEQ+'" date = "'+listdata[i].FW_DTTI+'" ></dl>');
                        }else{
                            listObjG1.append('<dl class="unRead" id="'+listdata[i].FW_SEQ+'" date = "'+listdata[i].FW_DTTI+'"></dl>');
                        }
                        var listObjG2 = jQuery('#'+listdata[i].FW_SEQ);
                        document.getElementById(listdata[i].FW_SEQ).addEventListener(touchEnd, function() {
                            ListView.listTouchListener(this);
                        }, false);

                        var iconClass ="";
                        if(listdata[i].PUSH_MSG_C=='01'){//이벤트
                            iconClass = "iconEvent";
                        }else if(listdata[i].PUSH_MSG_C=='02'){//공지
                            iconClass = "iconNotice";
                        }else if(listdata[i].PUSH_MSG_C=='50'){//청구서
                            iconClass = "iconStatement";
                        }else if(listdata[i].PUSH_MSG_C=='60'){//고객체감만족
                            iconClass = "iconCustomers";
                        }else if(listdata[i].PUSH_MSG_C=='70'){//마케팅오퍼
                            iconClass = "iconBenefit";
                        }else if(listdata[i].PUSH_MSG_C=='80'){//쿠폰
                            iconClass = "iconCoupon";
                        }else if(listdata[i].PUSH_MSG_C=='90'){//소멸포인트
                            iconClass = "iconPoint";
                        }
                        listObjG2.append('<dt class="'+iconClass+'"></dt>');

                        var MSG_CN = decodeURIComponent(listdata[i].MSG_CN);
                        if(listdata[i].HS_CYN=='Y'){
                            listObjG2.append('<dd>'+MSG_CN+'<span class="read">읽음</span></dd>');
                        }else{
                            listObjG2.append('<dd>'+MSG_CN+'<span class="read">읽지않음</span></dd>');
                        }
                    }
                }else{
                    listObj.append('<div style="background-color:white;width:100%;height:45px;padding-top:0px;line-height:45px;position:absolute;top:0px;text-align:center;">메세지가 존재하지 않습니다.</div>');
                }
            } else if(data.returnVal.RESULT_CODE=='9101'){
                listObj.append('<div style="background-color:white;width:100%;height:45px;padding-top:0px;line-height:45px;position:absolute;top:0px;text-align:center;">메세지가 존재하지 않습니다.</div>');
            } else {
                listObj.append('<div style="background-color:white;width:100%;height:45px;padding-top:0px;line-height:45px;position:absolute;top:0px;text-align:center;">메세지가 존재하지 않습니다.</div>');
                alert(Fpns.Messages.MESSAGE_NETWORK_ERR);
            }

            refreshScroll();

        } catch (e) {
            // TODO: handle exception
            console.log(e);
        }
        Fpns.FasGap.hideDialog();
    },
    listClickTime : null,
    listTouchListener : function(dataId) {
        if(this.listClickTime ==null){
            this.listClickTime = new Date();
        };
        var nowTime = new Date();
        var timeGap = nowTime - this.listClickTime;
        if(timeGap>1000||timeGap<50){
            this.listClickTime=nowTime;
            var id = dataId.id;
            var icon = jQuery('#'+id).children('dt');
            if(icon.hasClass('iconAllDel')||icon.hasClass('iconDel')){
                if(icon.hasClass('iconAllDel')){
                    //재선택시 삭제 해제
                    icon.removeClass('iconAllDel');
                    icon.addClass('iconDel');
                }else{
                    icon.removeClass('iconDel');
                    icon.addClass('iconAllDel');
                }
            }else{
                Fpns.FasGap.showDialog();
                var param = {
                        url : Fpns.CommConst.SERVER_URL_MESSAGE,
                        msg_id : id,
                        app_code : Fpns.MainAppCode
                };
                this.listId = id;
                var titleObj = jQuery('#'+id).children('dd').clone();
                titleObj.children('span').remove();

                sessionStorage.setItem('title', titleObj.text());
                sessionStorage.setItem('date', dataId.getAttribute('date'));
                Fpns.Communication.getDetail(ListView.getDetailCallback, param);
            }

        }
    },
    listId : null,
    getDetailCallback : function(data) {
        Fpns.FasGap.hideDialog();
        var response = data.returnVal;
        var msgType = response.DATA.MSG_DV_V;

        if (isValid(data)) {

            jQuery('#'+ListView.listId).removeClass('unRead');
            jQuery('#'+ListView.listId).children('dd').children('.read').text('읽음');

            var detailMsg = decodeURIComponent(response.DATA.TXT_DTL_CN);
            // 2013.07.05 추가 - 시작
            var etc_msg_cn = '';
            var exr_fld_3_nm = '';
            var exr_fld_4_nm = '';
            if(response.DATA.ETC_MSG_CN != null) etc_msg_cn = decodeURIComponent(response.DATA.ETC_MSG_CN);
            if(response.DATA.EXR_FLD_3_NM != null) exr_fld_3_nm = decodeURIComponent(response.DATA.EXR_FLD_3_NM);
            if(response.DATA.EXR_FLD_4_NM != null) exr_fld_4_nm = decodeURIComponent(response.DATA.EXR_FLD_4_NM);
            // 2013.07.05 추가 - 끝

            if (msgType == '1' || msgType == '2' || msgType == '5') {
                location.href = "details.html?push_id=" + response.DATA.FW_SEQ;

            } else if (msgType == '3') {
                var param = {
                        url : detailMsg
                };
                if(confirm(Fpns.Messages.OPEN_BROWSER)){
                    Fpns.FasGap.openBrowser(param);
                }

            } else if (msgType == '4') {
                var resultData = {
                    AP_DC : response.DATA.AP_DC,
                    PUSH_MSG_C : response.DATA.PUSH_MSG_C,
                    TXT_DTL_CN : detailMsg,
                    // 2013.07.05 추가 - 시작
                    ETC_MSG_CN : etc_msg_cn,
                    EXR_FLD_3_NM : exr_fld_3_nm,
                    EXR_FLD_4_NM : exr_fld_4_nm
                    // 2013.07.05 추가 - 끝
                };
                Fpns.FasGap.sendData(resultData);
                Fpns.FasGap.hide();
            };
        } else {
            alert(Fpns.Messages.MESSAGE_NETWORK_ERR);
        }

    },
    deleteAll : function() {
        if(document.querySelectorAll('#PushList dt').length>0){
            jQuery('dt').removeClass('iconAllDel');
            jQuery('dt').addClass('iconDel');
        }
        this.deleteBtnListener("전체 삭제하시겠습니까?");
    },

    deleteBtnListener : function(msg) {
        var delObj = jQuery('.iconDel').parent();
        if(delObj.length==0||delObj.length<0){
            alert('선택된 항목이 없습니다.');

        }else{
            if(!msg)msg = "삭제하시겠습니까?";

            if(confirm(msg)){
                Fpns.FasGap.showDialog();
                var idArr = new Array();
                for(var i=0;i<delObj.length;i++){
                    idArr.push(delObj[i].id);
                }
                var param = {
                        app_code:Fpns.MainAppCode,
                        msg_id : idArr.join(),
                        url : Fpns.CommConst.SERVER_URL_MESSAGE
                };
                Fpns.Communication.deleteList(ListView.deleteCallbak, param);
            }else{
                jQuery('dt').removeClass('iconDel');
                jQuery('dt').addClass('iconAllDel');
            }
        }
    },
    deleteCallbak : function(data) {
        Fpns.FasGap.hideDialog();
        if(isValid(data)){
            ListView.getData(sessionStorage.getItem('msg_code'));
            if (jQuery(".PushBoxAdmin").css("display") == "none"){
                jQuery(".btnEdit").addClass("Close");
                jQuery(".PushBoxWrap > #PushBoxCnt").addClass("Close");
                jQuery(".PushBoxAdmin").show();
                jQuery("#PushMenu").hide();
                jQuery('dt').removeClass('iconDel');
                jQuery('dt').removeClass('iconAllDel');
            }else{
                jQuery(".btnEdit").removeClass("Close");
                jQuery(".PushBoxWrap > #PushBoxCnt").removeClass("Close");
                jQuery(".PushBoxAdmin").hide();
                jQuery("#PushMenu").show();
                jQuery('#PushList').removeClass('hide');
                jQuery('#PushSetup').addClass('hide');
                jQuery('dt').removeClass('iconDel');
                jQuery('dt').addClass('iconAllDel');
            }
            jQuery('dt').toggleClass('iconAllDel');
            refreshScroll();
        }else{
            alert(Fpns.Messages.MESSAGE_NETWORK_ERR);
            ListView.getData(sessionStorage.getItem('msg_code'));
        }
        refreshScroll();
    },
    optionBtnListener : function(opt, codeName) {

        setMenuIcon(codeName);
        var param = new Object();
        param.app_code = Fpns.MainAppCode;
        if (opt) {
            param.msg_code = opt;
            this.msgCode = opt;
            sessionStorage.setItem('msg_code', opt);
        } else {
            sessionStorage.setItem('msg_code', '');
            this.msgCode = null;
        }
        param.url = Fpns.CommConst.SERVER_URL_MESSAGE;
        this.getData(param.msg_code);
    },
    toggleSetup :function(){
        jQuery('#PushSetup').toggleClass('hide');
        jQuery('#PushList').toggleClass('hide');
        if(jQuery('#PushList').hasClass('hide')){
            jQuery('.btnAllDel').hide();
            jQuery('.btnDel').hide();
        }else{
            jQuery('.btnAllDel').show();
            jQuery('.btnDel').show();
        }
        refreshScroll();
    },
    showList : function(){
        jQuery('#PushSetup').addClass('hide');
        jQuery('#PushList').removeClass('hide');
        if(jQuery('dt').hasClass('iconDel')){
            jQuery('dt').removeClass('iconDel');
        }
        if(jQuery('dt').hasClass('iconAllDel')){
            jQuery('dt').removeClass('iconAllDel');
        }
        refreshScroll();
    },
    close : function() {
        Fpns.FasGap.endView();
    }
};
var ListView;
var listInit = function() {
    ListView = new listView();
};

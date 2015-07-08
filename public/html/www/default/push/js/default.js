
/* JavaScript content from push/js/default.js in folder common */

//////////////////// iscroll 생성을 위한 함수 ////////////////////
var PushBoxCnt;
function PushBoxScroll() {
    if(PushBoxCnt) {
        PushBoxCnt.destroy();
        PushBoxCnt = null;
    }

    if(!jQuery("#PushBoxCnt").hasClass("no_scroll")) {
        PushBoxCnt = new iScroll("PushBoxCnt", {
            hideScrollbar: true,
            hScroll: false,
            useTransform: false,
            onBeforeScrollStart: function (e) {
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;
                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                    e.preventDefault();
            }
        });
    }
}

function refreshScroll(){
    setTimeout(function(){
        if(PushBoxCnt) PushBoxCnt.refresh();
    },400);
}

//////////////////// iScroll 실행 ////////////////////
document.addEventListener("touchmove", function (e) { e.preventDefault(); }, false);
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function(){
        PushBoxScroll();
    },400);
}, false);

//radio checkbox custom
function setupLabel() {
    if (jQuery(".label_check input").length) {
        jQuery(".label_check").each(function(){
            jQuery(this).removeClass("c_on");
        });
        jQuery(".label_check input:checked").each(function(){
            jQuery(this).parent("label").addClass("c_on");
        });
        jQuery(".label_check input:disabled").each(function(){
            jQuery(this).parent("label").addClass("c_dsb");
        });
    };
    if (jQuery(".label_radio input").length) {
        jQuery(".label_radio").each(function(){
            jQuery(this).removeClass("r_on");
        });
        jQuery(".label_radio input:checked").each(function(){
            jQuery(this).parent("label").addClass("r_on");
        });
        jQuery(".label_radio input:disabled").each(function(){
            jQuery(this).parent("label").addClass("r_dsb");
        });
    };
};
function setupLabelTouch(){
    jQuery(".label_check, .label_radio").click(function(){
        setupLabel();
    });
    setupLabel();
}

jQuery(function(){
    initAppScreen();
});

var setTime = new Date();
function initAppScreen() {
    //lebel checkbox radio
    setupLabelTouch();
    //btnSwitch
    jQuery(".btnSwitch").each(function(){
            jQuery(this).unbind("click");
            if(this.id!='radio1'){
                //IOS일 경우 알림설정 라디오 토글 없앰
                if(!(this.id=='radio3'&&Fpns.FasGap.os==Fpns.Const.IOS)){
                    document.getElementById(this.id).addEventListener(touchEnd, function() {
                        var nowTime = new Date();
                        var timeGap = nowTime - setTime;
                        if(timeGap>1000){
                            setTime = nowTime;
                            if (jQuery(this).hasClass("SwitchON")) {
                                jQuery(this).removeClass("SwitchON");
                                jQuery(this).addClass("SwitchOFF");
                            }else{
                                jQuery(this).removeClass("SwitchOFF");
                                jQuery(this).addClass("SwitchON");
                            }
                        }
                    });

                }
            }
    });

    jQuery(".btnEdit").click(function(){

        if (jQuery(".PushBoxAdmin").css("display") == "none"){
            jQuery(this).addClass("Close");
            jQuery(".PushBoxWrap > #PushBoxCnt").addClass("Close");
            jQuery(".PushBoxAdmin").show();
            jQuery("#PushMenu").hide();
            jQuery('dt').removeClass('iconDel');
            jQuery('dt').removeClass('iconAllDel');
        }else{
            jQuery(this).removeClass("Close");
            jQuery(".PushBoxWrap > #PushBoxCnt").removeClass("Close");
            jQuery(".PushBoxAdmin").hide();
            jQuery("#PushMenu").show();
            jQuery('#PushList').removeClass('hide');
            jQuery('#PushSetup').addClass('hide');
            jQuery('dt').removeClass('iconDel');
            jQuery('dt').addClass('iconAllDel');
            jQuery('.btnAllDel').show();
            jQuery('.btnDel').show();
        }
        jQuery('dt').toggleClass('iconAllDel');
        refreshScroll();
    });
}
function changeSubscribeBtn() {
    if (jQuery('#radio1').hasClass("SwitchON")) {
        jQuery('#radio1').removeClass("SwitchON");
        jQuery('#radio1').addClass("SwitchOFF");
    }else{
        jQuery('#radio1').removeClass("SwitchOFF");
        jQuery('#radio1').addClass("SwitchON");
    }
}
prevIcon = null;
function setMenuIcon(iconName){
    var iconObj = document.querySelector('.PushBoxWrap > .PushBoxMenu #PushBoxMenu ul li a .'+iconName);
    var prevIconObj = document.querySelector('.PushBoxWrap > .PushBoxMenu #PushBoxMenu ul li a .'+prevIcon);

    var allOptionObj = document.querySelectorAll('.PushBoxWrap > .PushBoxMenu #PushBoxMenu ul li a');
    for ( var i = 0; i < allOptionObj.length; i++) {
        allOptionObj[i].className = '';
    }
    var optObj = iconObj.parentNode;
    optObj.className = 'pushMenuHiglight';

    if(prevIconObj)
        prevIconObj.style.backgroundImage = 'url(../images/'+prevIcon+'_off.png)';
    iconObj.style.backgroundImage = 'url(../images/'+iconName+'_on.png)';
    prevIcon = iconName;
}
function optCodeToName(optCode){
    switch (optCode) {
    case '01':
        return 'iconEvent';
    case '02':
        return 'iconNotice';
    case '50':
        return 'iconStatement';
    case '60':
        return 'iconCustomers';
    case '70':
        return 'iconBenefit';
    case '80':
        return 'iconCoupon';
    case '90':
        return 'iconPoint';
    default:
        return 'iconAll';
    }
}

//터치 슬라이더 init//
function initTouchSlider() {
    var menus = document.querySelectorAll('#PushBoxMenu ul li');
    var viewSize = 4;
    if(menus.length<4){
        viewSize = menus.length;
    }
    sliderOption = {
            flexible : true,
            view : viewSize,
            paging : jQuery("#PushBoxMenu").next().find(".btn_page"),
            btn_prev : jQuery("#PushBoxMenu").next().find(".btn_prev"),
            btn_next : jQuery("#PushBoxMenu").next().find(".btn_next"),
            initComplete : function (e){
                jQuery("#PushBoxMenu").next().find(".btn_page").each(function (i, el){
                    jQuery(this).text("page " + (i+1));
                });
            },
            counter : function (e){
                jQuery("#PushBoxMenu").next().find(".sliderBtn").removeClass("on").eq(e.current-1).addClass("on");
            }
    };
    //첫 화면에서 출력해야 할 아이콘이 5번째 이상 인덱스이면 sliderOption의 page를 5로 지정한다.
    if(menus.length>sliderOption.view){
        var iconSpan = document.querySelectorAll('#PushBoxMenu ul li span');
        var index = 0;
        for(var i = 0; i<iconSpan.length;i++){
            if(iconSpan[i].className==optCodeToName(sessionStorage.getItem('msg_code'))){
                index = i+1;
            }
        }
        if(index>4){
            sliderOption.page =5;
        }
    }

    //touchSlider init
    var pushBoxMenu = jQuery("#PushBoxMenu");
    pushBoxMenu.touchSlider(sliderOption);

    //메뉴가 4개 이하면 좌우 스크롤버튼을 없애고 터치이벤트를 없앤다.
    if(menus.length<5){
        pushBoxMenu.next().find(".btn_prev").hide();
        pushBoxMenu.next().find(".btn_next").hide();
        pushBoxMenu.unbind("dragstart");
        pushBoxMenu.unbind("drag");
        pushBoxMenu.unbind("dragend");
        pushBoxMenu.unbind("touchstart");
        pushBoxMenu.unbind("touchmove");
        pushBoxMenu.unbind("touchend");
    }

}
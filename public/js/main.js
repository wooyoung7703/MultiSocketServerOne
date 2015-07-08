
function pageLoad(type, page, parama){
	console.log("woo : "+type+" : "+page);
	if(page=="CLUB9000"){
		jq("#mainContents").load("html/"+page.substr(0,5)+"/"+page+".html",function(){
		    pageObj.pageFunction(parama);
	    });
	}else{
		jq("#mainNav a").each(function(){
			jq(this).attr("onclick").match(page) ? jq(this).addClass("on") : jq(this).removeClass("on");
		});

		jq("#contents_sub_web").load("html/"+page.substr(0,5)+"/"+page+".html",function(){
		    pageObj.pageFunction(parama);
	    });
	}
	if(menuOpen)
		goMenu(true);
}

function aaaaa(){
	//alert("ssss");
	pageLoad('P','CLUB1000');
}

//좌측상단 메뉴
function goMenu(obj) {
		
	if(menuOpen){
		jq("#content").animate({"left": "-=250px"}, "show");
		menuOpen = false;
	}else{
		jq("#content").animate({"left": "+=250px"}, "show");
		menuOpen = true;
	}

}
function selectItem(obj) {
	
	for(var i = 0; i < getrooms.length; i++){
		if(obj==getrooms[i].clubidx){
			pageLoad('P', 'CLUB9000', getrooms[i]);
			break;
		}
	}
}
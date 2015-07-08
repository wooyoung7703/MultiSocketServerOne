pageObj.pageFunction = function(obj){

	pageObj.mLoadRooms("s");
};

function aaaa(){
	var message = jq('#data').val();
	pageObj.sendchat(message);
}


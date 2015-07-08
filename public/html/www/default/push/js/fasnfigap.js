
/* JavaScript content from push/js/fasnfigap.js in folder common */
if (typeof FasNFIGap === "undefined") {
/*
    if (typeof (DeviceInfo) !== 'object') {
        DeviceInfo = {};
    }
*/
    FasNFIGap = {
        commandQueue : [],
        commandQueueFlushing : false,
        available : false
        //_constructors : []
    };

    // ToDo : 네이티브 호출할때 확인 할수 있는 부분을 처리해야됨
    //FasNFIGap.available = DeviceInfo.uuid != undefined;
    FasNFIGap.available = true;

    FasNFIGap.createGapBridge = function() {
        gapBridge = document.createElement("iframe");
        gapBridge.setAttribute("style", "display:none;");
        gapBridge.setAttribute("height", "0px");
        gapBridge.setAttribute("width", "0px");
        gapBridge.setAttribute("frameborder", "0");
        document.documentElement.appendChild(gapBridge);
        return gapBridge;
    };

    FasNFIGap.exec = function() {
        if (!FasNFIGap.available) {
            //alert("ERROR: Attempting to call FasNFIGap.exec()" + " before 'FasNFIGap.available = true'. Ignoring.");
            alert("에러 : 네이티브 호출하는 커맨드(FasNFIGap.exec())를 호출 할수 없음.");
            return;
        }

        var command = arguments[0];
        // ToDo : FasNFI 커맨드 파라메터 확인 로직 필요!

        FasNFIGap.commandQueue.push(command);

        if (FasNFIGap.commandQueue.length >= 1 && !FasNFIGap.commandQueueFlushing) {
            if (!FasNFIGap.gapBridge) {
                FasNFIGap.gapBridge = FasNFIGap.createGapBridge();
            }

            FasNFIGap.gapBridge.src = "gap://fasnfiready";
        }
    };

    /**
     * 네이티브에서 호출하는 메소드로써 큐에 담긴 모든 커맨드를 넘겨주고 클리어 한다.
     */
    FasNFIGap.getAndClearQueuedCommands = function() {
        json = JSON.stringify(FasNFIGap.commandQueue);
        FasNFIGap.commandQueue = [];
        return json;
    };
};
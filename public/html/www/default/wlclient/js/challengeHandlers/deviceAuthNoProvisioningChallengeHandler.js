
/* JavaScript content from wlclient/js/challengeHandlers/deviceAuthNoProvisioningChallengeHandler.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
var wl_noDeviceProvisioningChallengeHandler = WL.Client.createDeviceAuthChallengeHandler("wl_deviceNoProvisioningRealm");

wl_noDeviceProvisioningChallengeHandler.handleChallenge = function(challenge) {
    var deviceAuthSettings = {
        token : challenge.token
    };

    wl_noDeviceProvisioningChallengeHandler.getDeviceAuthDataAsync(deviceAuthSettings);
};

wl_noDeviceProvisioningChallengeHandler.onDeviceAuthDataReady = function(deviceDataJSON, deviceProvisioning) {
	var answer = {
		ID : deviceDataJSON
	};
	wl_noDeviceProvisioningChallengeHandler.submitChallengeAnswer(answer);
};

wl_noDeviceProvisioningChallengeHandler.handleFailure = function(err, request, response){
	if (err.reason == "bad token") {
		if (wl_noDeviceProvisioningChallengeHandler.numOfFailures < wl_noDeviceProvisioningChallengeHandler.MAX_NUMBER_OF_FAILURES){
			wl_noDeviceProvisioningChallengeHandler.numOfFailures++;
			request.sendRequest();
		}
		else{
			request.onFailure(response);
		}
	}
};
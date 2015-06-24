'use strict';
var fs = require('fs');
var computeManagement = require('azure-mgmt-compute');
var configSvc = require('./configSvc');

module.exports = {
	get: function (){
		var configObj = configSvc.get();
	    var subscriptionId =configObj.AzureSubscription.SubscriptionId;
	    var pem = configObj.AzureSubscription.CertFile;
		return computeManagement.createComputeManagementClient(computeManagement.createCertificateCloudCredentials({
		    subscriptionId: subscriptionId,
		    pem: fs.readFileSync(pem)
		}));
	}
};
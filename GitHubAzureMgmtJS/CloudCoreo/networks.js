var fs = require('fs');
var xml2js = require("xml2js");
var vnetManagement = require('azure-asm-network');

var configSvc = require('./configSvc');
var configObj = configSvc.get();

var vnetManagementClient = vnetManagement.createNetworkManagementClient(vnetManagement.createCertificateCloudCredentials({
  subscriptionId: configObj.AzureSubscription.SubscriptionId,
  pem: fs.readFileSync(configObj.AzureSubscription.CertFile)
}));

module.exports = {
		// Creates a Virtual network.
	createVirtualNetwork: function (affinityGroupName, vnetSiteName, vnetLocation, appSubnetName, servicesSubnetName,dbSubnetName, callback) {
		if (vnetSiteName === null || vnetSiteName === undefined) {
      throw new Error('Network SiteName cannot be null.');
      // TODO Add error handling for all the paramaters
    }
// Get the virtual network configuration xml.
vnetManagementClient.networks.getConfiguration(function (err, result) {
	if (err) {
    console.error(err);
  } else {
    // Create a new virtual network site.
    xml2js.parseString(result.configuration, function (err2, config) {
      var vnets = config.NetworkConfiguration.VirtualNetworkConfiguration[0].VirtualNetworkSites[0].VirtualNetworkSite;
       vnets.push({
        "$": {
          // AffinityGroup: affinityGroupName,
          Location: vnetLocation,
          name: vnetSiteName
        },
        // Create a object array for all subnet info and parse it out of the object.
        AddressSpace: [{
          AddressPrefix: ["10.0.0.0/8"]
        }],
        Subnets: [{
          Subnet: [
          {"$": {name: appSubnetName},AddressPrefix: ["10.0.0.0/24"]},
          {"$": {name: servicesSubnetName}, AddressPrefix: ["10.0.1.0/24"]},
          {"$": {name: dbSubnetName},AddressPrefix: ["10.0.2.0/24"]}
          ]
        }]

      });
       vnetManagementClient.networks.setConfiguration({
        configuration: (new xml2js.Builder()).buildObject(config)}, callback);
       });
   }
});
} };


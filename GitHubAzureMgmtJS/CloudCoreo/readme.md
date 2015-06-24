
## Features

Usage: node coreo {command}

Valid commands are cloudservice, vnet, vm

Available cloud service commands:
create, delete {cloudServiceName}

Available vnet commands:
create 

Available vm commands:
create 

Available storageaccount commands:
list, get {accountName}, CreateIfNotExist {accountName}, delete {accountName}



## How to Install

NODEJs should be installed before installing the following modules


npm install azure-asm-network
npm install azure-mgmt-storage
npm install azure-mgmt-compute
npm install azure-storage
npm install xml2js
```

### Authentication

This library support management certificate authentication. To authenticate the library for the REST API calls, you need to
* Have a management certificate set up in your Microsoft Azure subscription. You can do this by
  * Either uploading a certificate in the [Microsoft Azure management portal](https://manage.windowsazure.com).
  * Or use the [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli).
* Obtain the .pem file of your certificate. If you used [Microsoft Azure Xplat-CLI](https://github.com/Azure/azure-xplat-cli) to set it up. You can run ``azure account cert export`` to get the .pem file.



### Install Azure Xplat CLI

https://github.com/Azure/azure-xplat-cli#install-from-npm

Open the XPLAT CLI and then map account and subscription

to use the publish setting file method to login to your account from CLI

Type "azure account download" on you CLI. You will be prompted to login to the Azure portal and pull down your subscription details.

Save the file to a local folder.

Next command to type on your CLI is azure account import <publish setting file>. 
This command will import your settings into your local working environmnet.

In our samples, we have used a  management certificate to authenticate. 
To export the certificate to a .PEM file,  type "azure account cert export".

### Config settings
Update  the following section in the CoreoAzure.Json file on your local machine.

{
  "AzureSubscription":
  {
    "SubscriptionId": "9dbccdee-4dea-4672-a3bf-a9e8a75c32c8",
    "CertFile": "9dbccdee-4dea-4672-a3bf-a9e8a75c32c8.pem"

  }
}
############# Default sample configuration from coreo.js

* If you want to change the configuration values while testing, please update following section in the 
* coreo.js file
** TODO: Move the configuration the Config JSON file.

coreo.azure.controller.configuration = function()
{
    var config = {};

    config.serviceName = "coreoTestService01";
    config.serviceLabel = "coreoTestService01Label";
    config.serviceLocation = "South Central US";

    config.affinityGroupName = "ag01";
    config.vnetSiteName = "PVNodeTest";
    config.appSubnetName = "appsubnet";
    config.servicesSubnetName = "servicessubnet";
    config.dbSubnetName = "dbsubnet";

    config.deploymentName = "pvnodetestdeployment01";
    config.virualMachineName = "pvnodetestvm01";
    config.virtualNetworkName = config.vnetSiteName;
    config.storageAccountName = "pvnodeteststorage02";
    config.storageLocation = config.serviceLocation;
    config.storageLabel = "pvnodeteststorage01label";
    config.storageAccountType = "Standard_LRS"; //possible values are:'Standard_LRS', 'Standard_ZRS', 'Standard_GRS', and 'Standard_RAGRS'.
    config.diskContainerName = "vhds";

    return config;
};

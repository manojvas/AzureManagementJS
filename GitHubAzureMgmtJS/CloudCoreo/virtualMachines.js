'use strict';
var computeManagement = require('./computeManagement');
var configSvc = require('./configSvc');
var computeManagementClient = computeManagement.get();
var configObj = configSvc.get();
    
module.exports = {
 createDeployment: function(serviceName, deploymentName, VirtualNetworkName, virtualMachineName, storageAccountName, diskContainerName) {
      computeManagementClient.virtualMachines.createDeployment(serviceName, {
            name: deploymentName,
            deploymentSlot: "production",
            label: "deployment 01",
            VirtualNetworkName: VirtualNetworkName,
            roles: [{
              roleName: virtualMachineName,
              roleType: "PersistentVMRole",
              label: "virutal machine 01",
              oSVirtualHardDisk: {
                sourceImageName: "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-Datacenter-201502.01-en.us-127GB.vhd",
                mediaLink: "http://"+ storageAccountName + ".blob.core.windows.net/" + diskContainerName + "/" +
                  serviceName + "-" + virtualMachineName + "-" + Math.floor((Math.random()*100)+1) + ".vhd"
              },
              dataVirtualHardDisks: [],
              configurationSets: [{
                configurationSetType: "WindowsProvisioningConfiguration",
                adminUserName: "pveerath",
                adminPassword: "Gvr@Azure$NodeTest",
                computerName: virtualMachineName,
                enableAutomaticUpdates: true,
                resetPasswordOnFirstLogon: false,
                storedCertificateSettings: [],
                inputEndpoints: [],
                windowsRemoteManagement: {
                  listeners: [{
                    listenerType: "Https"
                  }]
                }
              }, {
                configurationSetType: "NetworkConfiguration",
                subnetNames: [],
                storedCertificateSettings: [],
                inputEndpoints: [{
                  localPort: 3389,
                  protocol: "tcp",
                  name: "RemoteDesktop"
                }, {
                  localPort: 5986,
                  protocol: "tcp",
                  name: "WinRmHTTPS"
                }]
              }]
            }]
          }, function (err, result) {
            if (err) {
              console.error(err);
            } else {
              console.info(result);
            }
          });
        }

};

const mongoose = require("mongoose");
const rp = require('request-promise');
const carrierSchema = require("./schemas/carrier")
const Schema = mongoose.Schema;


//mongoose.connect("mongodb://localhost/loxhub");

var Carrier = mongoose.model("Carrier", carrierSchema);

var vo = require('vo');

function* run() {
    const carrierRes = yield rp({
        uri: "http://mobile.fmcsa.dot.gov/qc/services/carriers/2136430",
        qs: {
            webKey: "5308490b2c6b87960623aa226eb682587b387a9a"
        },
        json: true
    });

    const carrierData = carrierRes.content.carrier;
    
    const docketLink = carrierRes.content.links.find((link) => link.rel === "docket numbers");
    const docketlinkUrl = docketLink.href;
    const docketRes = yield rp({
        url: docketlinkUrl,
        qs: {
            webKey: "5308490b2c6b87960623aa226eb682587b387a9a"
        },
        json: true
    });
    const docketsData = docketRes.content || [];

    const operationClassLink = carrierRes.content.links.find((link) => link.rel === "operation classification");
    const operationClassLinkUrl = operationClassLink.href;    
    const operationClassRes = yield rp({
        url: operationClassLinkUrl,
        qs: {
            webKey: "5308490b2c6b87960623aa226eb682587b387a9a"
        },
        json: true
    });
    const operationClassesData = operationClassRes.content || [];
    
    return {
        dotNumber: carrierData.dotNumber || undefined,
        legalName: carrierData.legalName || undefined,
        alternativeName: carrierData.dbaName || undefined,
        address: {
            line1: carrierData.phyStreet || undefined,
            line2: undefined,
            line3: undefined,
            city: carrierData.phyCity || undefined,
            state: carrierData.phyState || undefined,
            postalCode: carrierData.phyZipcode || undefined
        },
        phone: 
        dockets: !docketsData
            ? undefined
            : docketsData.map(d => ({
                docketNumber: d.docketNumber,
                prefix: d.prefix
            })),
        operationTypeCode: carrierData.carrierOperation.carrierOperationCode,
        operationClasses: !operationClassesData
            ? undefined
            : operationClassesData.map(c => 
                c.operationClassDesc === "Authorized For Hire" ? "AuthorizedForHire" :
                c.operationClassDesc === "Exempt For Hire" ? "ExemptForHire" :
                c.operationClassDesc === "Private" ? "Private" :
                c.operationClassDesc === "Private/Passenger Business" ? "PrivatePassengerBusiness" :
                c.operationClassDesc === "Private Passenger Non-Business" ? "PrivatePassengerNonBusiness" :
                c.operationClassDesc === "Migrant" ? "Migrant" :
                c.operationClassDesc === "U.S. Mail" ? "USMail" :
                c.operationClassDesc === "Federal Govt." ? "FederalGovt" :
                c.operationClassDesc === "State Govt." ? "StateGovt" :
                c.operationClassDesc === "Loval Govt." ? "LovalGovt" :
                c.operationClassDesc === "Indian Tribe." ? "IndianTribe" :
                c.operationClassDesc === "other classification" ? "other classification" :
                undefined
            )
        
    };
}

vo(run)((err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
})
require('dotenv').config()

const mailjet = require('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

let request;

switch (process.argv[2]) {
    case "createContact":
        //Create a Contact
        request = mailjet
            .post("contact", { 'version': 'v3' })
            .request({
                "IsExcludedFromCampaigns": "true",
                "Email": process.argv[3],
                "Name": process.argv[4]
            })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "createList":
        //Create a Contactlist
        request = mailjet
            .post("contactslist", { 'version': 'v3' })
            .request({
                "Name": process.argv[3]
            })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "addContact":
        //Add a contact to a list
        request = mailjet
            .post("listrecipient", { 'version': 'v3' })
            .request({
                "ContactAlt": process.argv[3],
                "ListID": process.argv[4]
            })
        request
            .then((result) => {
                console.log(result.body)
                //Remove possible exclusion
                request = mailjet
                    .put("contact", { 'version': 'v3' })
                    .id(process.argv[3])
                    .request({
                        "IsExcludedFromCampaigns": "false",
                    })
                request
                    .then((result) => {
                        console.log(result.body)
                    })
                    .catch((err) => {
                        console.log(err.statusCode)
                    })
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "unsubContact":
        //Unsubscribe contact
        request = mailjet
            .post("contactslist", { 'version': 'v3' })
            .id(process.argv[4])
            .action("managecontact")
            .request({
                "Action": "unsub",
                "Email": process.argv[3]
            })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "subContact":
        //Subscribe contact
        request = mailjet
            .post("contactslist", { 'version': 'v3' })
            .id(process.argv[4])
            .action("managecontact")
            .request({
                "Action": "addForce",
                "Email": process.argv[3]
            })
        request
            .then((result) => {
                console.log(result.body)
                //Remove possible exclusion
                request = mailjet
                    .put("contact", { 'version': 'v3' })
                    .id(process.argv[3])
                    .request({
                        "IsExcludedFromCampaigns": "false",
                    })
                request
                    .then((result) => {
                        console.log(result.body)
                    })
                    .catch((err) => {
                        console.log(err.statusCode)
                    })
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "excludeContact":
        //Exclude contact from all compaigns
        request = mailjet
            .put("contact", { 'version': 'v3' })
            .id(process.argv[3])
            .request({
                "IsExcludedFromCampaigns": "true",
            })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "includeContact":
        //include contact in compaigns
        request = mailjet
            .put("contact", { 'version': 'v3' })
            .id(process.argv[3])
            .request({
                "IsExcludedFromCampaigns": "false",
            })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "showContacts":
        //Show a list of all contacts
        request = mailjet
            .get("contact", { 'version': 'v3' })
            .request()
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "showContact":
        //Show a specific contact
        request = mailjet
            .get("contact", { 'version': 'v3' })
            .id(process.argv[3])
            .request()
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "showList":
        //Show a list of all contacts in a list
        request = mailjet
            .get("contact", { 'version': 'v3' })
            .request({ "ContactsList": process.argv[3] })
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    case "showLists":
        //Show a list of all lists
        request = mailjet
            .get("contactslist", { 'version': 'v3' })
            .request()
        request
            .then((result) => {
                console.log(result.body)
            })
            .catch((err) => {
                console.log(err.statusCode)
            })
        break;

    default:
        console.log(`

            =================
            Mailjet API - PoC
            =================

            Supported Commands:
            + showContacts
            + showContact [email]
            + showLists
            + showList [ListID]
            + includeContact [email]
            + excludeContact [email]
            + subContact [email] [ListID]
            + unsubContact [email] [ListID]
            + addContact [email] [ListID] 
            + createList [listname]
            + createContact [email] [name]

            Remarks:
            Once a contact is created in can be added to a list. 
            The added contact is by default subscribed.
            It can be unsubscribed while staying in the respective list.
            If a contact shouldn't receive any mails it can be excluded.
            This way the contact doesn't get marketing mails
            - regardless of the subscribed lists.

        `);
}

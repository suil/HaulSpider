var Nightmare = require('nightmare');
var vo = require('vo');
var nightmare = Nightmare({ show: true });

// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;
// var blogSchema = new Schema({
    
// });
//mongoose.connect("mongodb://localhost/loxhub");



var trucks = [];

vo(run)(function(err, result) {
    if (err) throw err;
    console.log("here");
    console.log(trucks);
});


function* run() {
    yield nightmare
        .goto("http://express.dat.com/a/secure/Logout.aspx")
        .goto('https://express.dat.com/a/secure/login.aspx?app=3sixtyexpress')
        .type('#ctl00_cphMain_txtUserName', 'dedicated2016')
        .type("#ctl00_cphMain_txtPassword", "load2016")
        .click('#ctl00_cphMain_btnSubmit')
        .wait(1000)
        .wait('#ctl00_bodyMain')
        .click("#ctl00_Navigation_hplSearch")
        .click("#ctl00_cphMain_AssetTypeToggle_lbSearchTruck")
        .wait(1000)
        .click("#ctl00_cphMain_locOrigin_txtLocationEntry")
        .insert("#ctl00_cphMain_locOrigin_txtLocationEntry")
        .wait(100)
        .type("#ctl00_cphMain_locOrigin_txtLocationEntry", "Lisle, IL")
        .wait(1000)
        .click("#ctl00_cphMain_txtOriginRadius")
        .insert("#ctl00_cphMain_txtOriginRadius")
        .wait(100)
        .type("#ctl00_cphMain_txtOriginRadius", 50)
        .wait(1000)
        .insert("#ctl00_cphMain_locDestination_txtLocationEntry")
        .wait(100)
        .type("#ctl00_cphMain_locDestination_txtLocationEntry", "Denver, CO")
        .wait(100)
        .insert("#ctl00_cphMain_txtDestinationRadius")
        .wait(100)
        .type("#ctl00_cphMain_txtDestinationRadius", 50)
        .wait(1000)
        .click("#ctl00_cphMain_btnSearch")
        .wait("#ctl00_cphMain_pnlSearchResults");

    // yield nightmare.click("#resultSet tbody tr:first-child td.cid_company a")

    // var a = yield nightmare.evaluate(function() {
        
    // })
    
    // var aa = yield nightmare.exists("#loginControls");
    // console.log("here" + aa);

    var isExistingNextPageButton = yield nightmare.exists("#ctl00_cphMain_lbNextPageTop"); 
    var isNextPageButtonDisabled = yield nightmare.exists("#ctl00_cphMain_lbNextPageTop.aspNetDisabled");

    console.log("isExistingNextPageButton: " + isExistingNextPageButton);
    console.log("isNextPageButtonDisabled: " + isNextPageButtonDisabled);

    //while (isExistingNextPageButton && !isNextPageButtonDisabled) { 
        trucks = trucks.concat(yield nightmare.evaluate(function() { 
            var rows = [];
            $("#resultSet tbody tr:first").each(function() {
                var cells = [];
                var $tr = $(this);
                $tr.find("td").each(function() {
                    var $this = $(this);
                    var text = $.trim($this.text());
                    if ($this.is(".dataCell.cid_company")) {
                        text = $this.find("a").attr("title");
                    }
                    cells.push(text);
                });
                var href = $tr.find(".cid_company a").attr("href");
                href = /javascript:openWin\('CompanyProfile','(.*)'\)/g.exec(href)[1];
                cells.push(href);
                rows.push(cells);
            });
            return rows;
        }));

        //yield nightmare.back().wait("#reviewSummary");

        // var dotNumber = yield nightmare.evaluate(function() {
        //     return $("#gi_dotnum").text();
        // });

        // truck.push(dotNumber);
        
        //yield nightmare.back().refresh().wait("#ctl00_cphMain_pnlSearchResults");
        
        yield nightmare.click("#ctl00_cphMain_lbNextPageTop")
            .wait("#ctl00_cphMain_pnlSearchResults")
            .wait(1000);

        isExistingNextPageButton = yield nightmare.exists("#ctl00_cphMain_lbNextPageTop"); 
        isNextPageButtonDisabled = yield nightmare.exists("#ctl00_cphMain_lbNextPageTop.aspNetDisabled");
    //} 
    
    
    for (var i = 0; i < trucks.length; i++) {
        yield nightmare.goto("https://express.dat.com" + trucks[i][19]).wait("#reviewSummary");
        
        //console.log(trucks[i][19])
        var dotNumber = yield nightmare.evaluate(function(href) {
            return $("#gi_dotnum a:last").text();
        }, trucks[i][19]);

        yield nightmare.wait(1000);

        trucks[i].push(dotNumber);
    }
    
    yield nightmare.end();
}
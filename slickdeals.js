var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

var trucks = [];

nightmare
  .goto("http://slickdeals.net/")
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
  .click("#ctl00_cphMain_btnSearch");

function grapSearchResults(results, done) {
    nightmare
        .wait("#ctl00_cphMain_pnlSearchResults")
        .evaluate(function () {
            var rows = [];
            $("#resultSet tr").each(function() {
                var cells = [];
                $(this).find("td").each(function() {
                    cells.push($.trim($(this).text()));
                });
                rows.push(cells);
            });
            return rows;
        })
        .then(function (rows) {
            results = results.concat(rows);
            nightmare
                .exists("#ctl00_cphMain_lbNextPageTop")
                .then(function(isExistingNextPageButton) {
                    nightmare
                        .exists("#ctl00_cphMain_lbNextPageTop.aspNetDisabled")
                        .then(function(isNextPageButtonDisabled) {
                            if (isExistingNextPageButton && !isNextPageButtonDisabled) {
                                nightmare.click("#ctl00_cphMain_lbNextPageTop");
                                grapSearchResults(results, done);
                            }
                            else {
                                done(results);
                            }
                        });
                });
        });
    return nightmare;
}

grapSearchResults([], function(results) {
    console.log(results);
    console.log(results.length);
    
    setTimeout(function() {
        nightmare.end();
    }, 100);
})


//nightmare.end();

//console.log(trucks);


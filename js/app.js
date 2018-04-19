var api = undefined;
$("#getname").hide();

OAuth.initialize('3_scpo_f6-RInRUtQ3L-8r4S2U8');
var callback = OAuth.callback('twitter');

if(callback !== undefined) {
    OAuth.callback('twitter')
        .done(function(result) {
            api = result;
            $("#getname").show();
            $("#login").hide();

            result.me()
                .done(function (response) {
                    console.log('Name: ', response.name);
                })
                .fail(function (err) {
                    console.log('pičovina vyjebaná');
                });
            result.get('/1.1/statuses/user_timeline.json')
                .done(function (response) {
                    console.log(response);
                });
            /*result.post('/1.1/statuses/update.json', {
                data: {
                    status: "Quvix je močka"
                }
            })
                .done(function (response) {
                    console.log(response);
                })*/
        })
        .fail(function (err) {

        });
} else {

}



function login() {
    OAuth.initialize('3_scpo_f6-RInRUtQ3L-8r4S2U8');
    OAuth.redirect('twitter', "http://daskcz.quvix.eu?loggined=true");
}

function getName() {
    api.me()
        .done(function (response) {
            console.log('Name: ', response.name);
        })
        .fail(function (err) {
            console.log('pičovina vyjebaná');
        });
}
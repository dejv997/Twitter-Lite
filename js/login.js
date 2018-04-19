//Callback functions
var error = function (err, response, body) {
    console.log('ERROR [%s]', err);
};
var success = function (data) {
    console.log('Data [%s]', data);
};

/*var config = {
    "consumerKey": "mU0Ujf1pt4Poar00XRlKy07gJ",
    "consumerSecret": "jPNGht2uFVQq8KQPHUmRQq4TVLfgDKqJHSFU907a56z6h6T4xQ",
    "accessToken": "316618369-OGp2PFtq27MhDJvp43TtTNuRpOcctxfiw4gEzFYF",
    "accessTokenSecret": "SGRUaY4UmKZrkyWe65StierZwi7i9REvwz0kWdctVrEXt",
    "callBackUrl": "127.0.0.1"
};*/




function login() {
    OAuth.initialize('3_scpo_f6-RInRUtQ3L-8r4S2U8');
    OAuth.redirect('twitter', "http://daskcz.quvix.eu/");
}
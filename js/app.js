const MAX_TWEET_CHARS = 280;
let lat = null;
let long = null;

$( document ).on( "pageinit", "body", function() {
    $( document ).on( "swiperight", "body", function( e ) {
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
            $( "#left-panel" ).panel( "open" );
        }
    });
    loadHomeTimeline();
    showNewTweetControl(false);
    updateTweetCharCounter();
    $('#new-tweet').attr('maxlength', MAX_TWEET_CHARS);


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
    }
});

$(document).on('pagebeforecreate', function (e) {
    $("#left-panel").panel().enhanceWithin();
    $("#right-panel").panel().enhanceWithin();

    let page = $(e.target),
        shared = page.data("share");
    console.log(page,shared);
    if (shared) {
        let header = $('[data-role="header"]', shared),
            footer = $('[data-role="footer"]', shared);
        console.log(header,footer);
        header.clone().prependTo(page);
        footer.clone().appendTo(page);
    }
});


let api = undefined;
$("#getname").hide();

OAuth.initialize('3_scpo_f6-RInRUtQ3L-8r4S2U8', {cache: true});
let callback = OAuth.callback('twitter');

if(callback !== undefined) {
    OAuth.callback('twitter')
        .done(function(result) {
            api = result;

            result.me()
                .done(function (response) {
                    console.log(response);
                    console.log('Name: ', response.name);
                    $('.profile-pic').attr('src', response.avatar);
                    $('.profile-name').text(response.name);
                    $('.profile-alias').text('@' + response.alias);
                })
                .fail(function (err) {
                    console.log('pičovina vyjebaná');
                });
            /*result.get('/1.1/statuses/user_timeline.json')
                .done(function (response) {
                    console.log(response);
                });*/
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
    login();
}

function login() {
    OAuth.redirect('twitter', "http://daskcz.quvix.eu");
}

function logout() {
    api = undefined;
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

function loadHomeTimeline() {
    let sessionTimeline = sessionStorage.getItem('timeline');

    if(sessionTimeline) {
        sessionTimeline = JSON.parse(sessionTimeline);

        let diffInMinutes = Math.round((($.now() - sessionTimeline.ts) % 86400000) % 3600000) / 60000;
        console.log(diffInMinutes);
        if(diffInMinutes > 1) {
            loadHomeTimelineAjax();
        } else {
            drawHomeTimeline(sessionTimeline.data);
        }
    } else {
        loadHomeTimelineAjax();
    }
}

function loadHomeTimelineAjax() {
    $.mobile.loading("show");
    api.get('/1.1/statuses/home_timeline.json', {
        data: {
            tweet_mode: 'extended'
        }
    })
        .done(function (response) {
            console.log(response);
            let tmp = {
                data: response,
                ts: $.now()
            };
            sessionStorage.setItem('timeline', JSON.stringify(tmp));
            $.mobile.loading("hide");
            drawHomeTimeline(tmp.data);
        })
        .fail(function (err) {
            console.log('pičovina vyjebaná');
        });
}

function drawHomeTimeline(data) {
    console.log(data);
    let timelineDiv = $('#timeline');
    timelineDiv.empty();

    for(let i = 0; i < data.length; i++) {
        let created_at = new Date(data[i].created_at);
        timelineDiv.append(
            '<div>' +
            '<img src="' + data[i].user.profile_image_url + '" class="user-img">' +
            '<span class="username">' + data[i].user.name + '</span> <small class="after-name">@' + data[i].user.screen_name + ' • ' + created_at.toLocaleDateString() + ' ' + created_at.toLocaleTimeString() + '</small>' +
            '<p>' + parseTweetFulltext(data[i]) + '</p>' +
            '</div>'
        );
        appendMedia(timelineDiv, data[i].entities.media);
        timelineDiv.append('<hr>');
    }
}

function parseTweetFulltext(data) {
    let fulltext = data.full_text;
    let media = data.entities.media;
    let urls = data.entities.urls;

    if(urls) {
        for(let i = 0; i < urls.length; i++) {
            fulltext = fulltext.replace(urls[i].url, '<a href="' + urls[i].expanded_url + '">' + urls[i].display_url + '</a>');
        }
    }

    if(media) {
        for(let i = 0; i < media.length; i++) {
            fulltext = fulltext.replace(media[i].url, '');
        }
    }

    return fulltext;
}

function appendMedia(div, media) {
    if(media) {
        for(let i = 0; i < media.length; i++) {
            div.append(
                '<img src="' + media[i].media_url + '" class="media-pic">'
            );
        }
    }

}

function showNewTweetControl(b) {
    let div = $('#new-tweet-control');
    if(b) {
        div.show();
    } else {
        if(!$('#new-tweet').val()) {
            div.hide();
        }
    }
}

function updateTweetCharCounter() {
    let charCount = $('#new-tweet').val().length;
    $('#tweet-char-counter').text((MAX_TWEET_CHARS - charCount) + ' / ' + MAX_TWEET_CHARS);

    if(charCount === 0) {
        $('#send-tweet-btn').attr("disabled", true);
    } else {
        $('#send-tweet-btn').removeAttr("disabled");
    }

}

function sendTweet() {
    if(!$('#send-tweet-btn').is(':disabled')) {
        api.post('/1.1/statuses/update.json', {
            data: {
                status: $('#new-tweet').val(),
                lat: lat,
                long: long
            }
        })
            .done(function (response) {
                console.log(response);
                swal("Tweet send!", "You are good boy!", "success");
                $('#new-tweet').val('');
                updateTweetCharCounter();
            });
    }
}

function savePosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
}
function getByEmail(email, callback) {
    // This script should retrieve a user profile from your existing database,
    // without authenticating the user.
    // It is used to check if a user exists before executing flows that do not
    // require authentication (signup and password reset).
    //
    // There are three ways this script can finish:
    // 1. A user was successfully found. The profile should be in the following
    // format: https://auth0.com/docs/user-profile/normalized.
    //     callback(null, profile);
    // 2. A user was not found
    //     callback(null);
    // 3. Something went wrong while trying to reach your database:
    //     callback(new Error("my error message"));

    var request = require("request");
    var options = {
        method: 'POST',
        url: 'https://' + configuration.AUTH0_DOMAIN + '/oauth/token',
        headers:
            { 'content-type': 'application/json' },
        body: JSON.stringify({
            "client_id": configuration.CLIENT_ID,
            "client_secret": configuration.CLIENT_SECRET,
            "grant_type": "client_credentials"
        })
    };

    request(options, function (error, response, body) {
        if (error) return callback(new Error(error));


        var token = JSON.parse(body).access_token;
        options = {
            method: 'GET',
            url: 'https://' + configuration.AUTH0_DOMAIN + '/api/connections/' + configuration.CONNECTION_NAME + '/users',
            qs: { search: email },
            headers:
            {
                'cache-control': 'no-cache',
                authorization: 'Bearer ' + token
            }
        };

        request(options, function (error, response, body) {
            if (error) return callback(new Error(error));

            var users = JSON.parse(body);
            if (users.length === 0) return callback(null);
            else return callback(null, users[0]);

        });

    });



}

function login(email, password, callback) {

    /*
     * Authentication using AD/LDAP connector
     */

    const jwt = require('jsonwebtoken');
    const request = require('request');


    /**
     * 
     * @param {*} profile 
     * Also see https://auth0.com/docs/metadata#metadata-and-custom-databases
     * You can use both user_metadata and metadata to return more metadata for this user
     */
    function mapConnectorProfile(profile) {
        return {
            user_id: profile.user_id,
            name: profile.name,
            family_name: profile.family_name,
            given_name: profile.given_name,
            nickname: profile.nickname,
            email: profile.email,
            user_metadata: {
            firstName: profile.given_name,
              lastName : profile.family_name
            },
            metadata : {

            }
        };
    }

    function validateWithConnector(email, password, cb) {
        request(
            {
                url: 'https://' + configuration.AUTH0_DOMAIN + '/oauth/ro',
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Host': configuration.CONNECTOR_DOMAIN,
                },
                rejectUnhauthorized: false,
                body: JSON.stringify({
                    client_id: configuration.CLIENT_ID,
                    username: email,
                    password: password,
                    connection: configuration.CONNECTION_NAME,
                    grant_type: "password",
                    scope: "openid profile"
                })
            },
            function (err, response, body) {
                if (err) {
                    console.log(err);
                    return cb(new Error('Unable to search user'));
                }

                if (response.statusCode === 401) {
                    return cb(new WrongUsernameOrPasswordError(email, "Invalid Credentials"));
                } else if (response.statusCode !== 200) {
                    console.log(response.statusCode);
                    return cb(new Error('Unable to search user'));
                }

                const data = JSON.parse(body);
                if (!data.id_token) return cb(new Error("Unable to retrieve profile"));

                cb(null, mapConnectorProfile(jwt.decode(data.id_token)));
            });
    }

    try {

        console.log('Validating with AD/LDAP connector');
        validateWithConnector(email, password, callback);

    } catch (exc) {
        callback(new Error('LDAP configuration incorrect'));
    }
}
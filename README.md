# ad-ldap-custom-login-with-migration


1. Create an AD LDAP Connector. Follow steps under https://auth0.com/docs/connector to create an AD LDAP Connector to your Active Directory
        - Make sure the AD LDAP connector profile mapper is setup the right way to return the attributes you require in the profile
2. Once the LDAP Connector is installed and setup. Make sure you set the LDAP_SEARCH_QUERY attribute in config.js to be able to search for a user using thier username/email.
    - An example of such a setting is "LDAP_SEARCH_QUERY": "(|(sAMAccountName={0})(mail={0})(userPrincipalName={0})(cn={0}))"
3. Make note of the Global client_id and client_secret for your Auth0 Tenant. You will find this under https://manage.auth0.com/#/tenant/advanced

4. Make note of the 2 scripts in this repository:
    - login.js
    - getUserByEmail.js

5. Create a new Database connection in Auth0 management console and make the following changes
    - Go to the "Custom Database" tab and make sure you turn the toggle for "Use my own database" on
    - Go to the "settings" tab and turn the "Import Users to Auth0" toggle on
    - Go back to the "Custom Database" tab and set the script under Login ~ login.js and set the script under Get User ~ getUserByEmail.js
    - Save each script
    - Set the rule configuration variables (https://auth0.com/docs/rules/current#use-the-configuration-object) as shown below:
        - AUTH0_DOMAIN - Your auth0 domain. Usually it is in this format -> xyz.auth0.com
        - CONNECTION_NAME - Name of the Active Directory connection you created in step 1 above
        - CLIENT_ID - The global client id you noted above at step 3
        - CLIENT_SECRET - The global client secret you noted above at step 3

6. Your custom database/datasource connection is now established and you are ready to use it for logging in and automigration of users from the AD. 
    Note, any new users that signup will be created in your auth0 database and not your AD/LDAP

# Insomnia JSON Web Signature Plugin by TL

This plugin adds a JSON web signature header to HTTP requests by using the request body as payload.

Please note: this plugin detaches the payload from the signature, as allowed by the [RFC7519](https://tools.ietf.org/html/rfc7515#appendix-F).

### Steps to configure:

1) Make sure your insomnia environment contains the following properties:
    * `REQUIRE_JWS`: this property must be set to true (not `"true"` but `true`, i.e. boolean not string), without it the plugin won't try to sign the request
    * `CERTIFICATE_ID`: your signing certificate id
    * `PRIVATE_KEY`: your signing private key. **Important:** *JSON does not allow line-breaks, so you have to replace all the private key line-breaks with the newline character, i.e. `\n`, which will restore your line-break when the string is parsed*.

2) You can install this plugin directly from the [Insomnia plugins directory](https://insomnia.rest/plugins/): look for "JWS by TrueLayer" and follow the instructions to install the plugin.

2) If you prefer installing this plugin directly from the repository, please follow the instructions here: https://support.insomnia.rest/article/26-plugins#create-a-plugin

3) Once you installed the plugin, your requests will automatically try to use it as soon as you enable it, which means the requests will fail if you do not set the env properties mentioned above.

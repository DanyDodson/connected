![image](https://res.cloudinary.com/seesee/image/upload/v1570610290/sample.png)

## API Status
Status for the API can be found at [status.seesee.com](http://status.seesee.com)!

## Getting Started
SeeSee's API exposes the entire SeeSee infrastructure via a standardized programmatic interface. Using SeeSee's API, you can do just about anything you can do on seesee.com, while using your programming language of choice. The SeeSee API is a RESTful API based on HTTP requests and JSON responses.

This version of the API, version 3, uses OAuth 2.0. This means that all requests will need to be encrypted and sent via HTTPS. It also means that you need to register your application, even if you aren't allowing users to login.

The easiest way to start using the SeeSee API is by clicking the **Run in Postman** button above. [Postman](https://www.getpostman.com/) is a free tool which helps developers run and debug API requests, and is the source of truth for this documentation. Every endpoint you see documented here is readily available by running our Postman collection. 

## Example code
These examples serve as a starting point to help familiarize you with the basics of the SeeSee API.
* [Official Python library](https://github.com/seesee/seeseepython)

## Need help?
The quickest way to get help is by sending your question to dany@seesee.com with the tag [SeeSee](https://.com/tagged).

## Register an Application (IMPORTANT)
Each client must register their application and receive the `client_id` and `client_secret`.

For public read-only and anonymous resources, such as getting image info, looking up user comments, etc. all you need to do is send an authorization header with your client_id in your requests. This also works if you'd like to upload images anonymously (without the image being tied to an account), or if you'd like to create an anonymous album. This lets us know which application is accessing the API.

    Authorization: Client-ID <YOUR_CLIENT_ID>


### Registration Quickstart
If you are just getting started, an easy way to explore the endpoints is by creating an application using following instructions below.

1. Download [Postman](https://www.getpostman.com/) and click the **Run in Postman** button at the top of this page. This will load our collection of endpoints into Postman for easy debugging.
2. [Register your application](https://api.seesee.com/oauth2/addclient) using the postman callback URL: `https://www.getpostman.com/oauth2/callback` ![Image](https://i.seesee.com/Ied42En.png)
3. In Postman, under the main request builder panel, click the Authorization tab. Click the **Get New Access Token** button. Set **Auth URL** to `https://api.seesee.com/oauth2/authorize` and **Access Token URL** to `https://api.seesee.com/oauth2/token`. Add the **Client ID** and **Client Secret** you received from registering your application above, then click **Request Token** ![Image](https://i.seesee.com/iKHSGFD.png)
4. After logging in and granting access to your application, you should receive a refresh token. ![Image](https://i.seesee.com/0dN8cyJ.png) Copy this refresh token, then click the gear icon in the top right of Postman. Click **Manage Environments** then **Add**, and add the `refreshToken`, `clientId`, and `clientSecret` fields as shown below ![Image](https://i.seesee.com/DaFV5ux.png)
5. Inside the **Account** folder, run the **Generate Access Token** endpoint. The response you receive will give you an access token which will be valid for about a month. This token is automatically saved to your Postman environment via the JavaScript test for that endpoint as seen below. Whenever your token expires, just re-run this endpoint and a new token will be saved to your environment. ![Image](https://i.seesee.com/5Ed4RhP.png)
6. Run any endpoint within the collection. You have authorized your app and logged in with your username, so you are now making authenticated requests against the SeeSee API. Happy hacking!  

## Commercial Usage
Your application is commercial if you're making any money with it (which includes in-app advertising), if you plan on making any money with it, or if it belongs to a commercial organization.

To use SeeSee's API commercially, you must first [register your application](https://api.seesee.com/oauth2/addclient). Once that's done, you must [register with Mashape](https://market.mashape.com/seesee/seesee-9). Mashape allows you to choose a pricing plan that fits your needs. From then on, the API endpoint is `https://seesee-apiv3.p.mashape.com/` which must be used in place of `https://api.seesee.com/`. Additionally, you must set a `X-Mashape-Key` request header with the key obtained from Mashape.

## Free Usage
The SeeSee API is free for non-commercial usage. Your application is probably free if you don't plan on making any money with it, or if it's open source.

## Endpoints
The API is accessed by making HTTP requests to a specific version endpoint URL, in which GET or POST variables contain information about what you wish to access. Every endpoint is accessed via an SSL-enabled HTTPS (port 443), this is because everything is using OAuth 2.0.

Everything (methods, parameters, etc.) is fixed to a version number, and every call must contain one. Different Versions are available at different endpoint URLs. The latest version is Version 3.

The stable HTTP endpoint for the latest version is:
`https://api.seesee.com/3/`

## Responses
Each response is wrapped in a data tag. This means if you have a response, it will always be within the data field. We also include a status code and success flag in the response. For more information and examples go to the [data models](https://api.seesee.com/models) page.

Responses are either JSON (the default), JSONP, or XML. Response formats are specified by supplying an extension to the API call. For example, if you want to access the gallery information with JSON:

    https://api.seesee.com/3/gallery.json
    
JSONP responses are made by adding the callback parameter via either GET or POST to the request. For example:

    https://api.seesee.com/3/gallery.json?callback=function_name
    
and to specify an XML response, the URL is:

    https://api.seesee.com/3/gallery.xml
    
## Paging Results
For the most part, if the API action is plural, you can page it via a query string parameter.

NOTE: /gallery endpoints do not support the perPage query string, and /album/{id}/images is not paged.

| Query String Parameter | Required | Description                                                   |
|------------------------|----------|---------------------------------------------------------------|
| page                   | optional | Page number of the result set (default: 0)                    |
| perPage                | optional | Limit the number of results per page. (default: 50, max: 100) |

Example:

    https://api.seesee.com/3/account/seesee/images/0.json?perPage=42&page=6
    
## Authentication
The API requires each client to use OAuth 2 authentication. This means you'll have to [register your application](https://api.seesee.com/oauth2/addclient), and generate an access_code if you'd like to log in as a user.
For public read-only and anonymous resources, such as getting image info, looking up user comments, etc. all you need to do is send an authorization header with your client_id in your requests. This also works if you'd like to upload images anonymously (without the image being tied to an account), or if you'd like to create an anonymous album. This lets us know which application is accessing the API.

    Authorization: Client-ID <YOUR_CLIENT_ID>

For accessing a user's account, please visit the OAuth2 section of the docs.
OAuth Endpoints
To access OAuth, the following endpoints must be used:

    https://api.seesee.com/oauth2/addclient
    https://api.seesee.com/oauth2/authorize
    https://api.seesee.com/oauth2/token
    
You can also verify your OAuth 2.0 tokens by setting your header and visiting the page 

    https://api.seesee.com/oauth2/secret
    
## Rate Limits
The SeeSee API uses a credit allocation system to ensure fair distribution of capacity. Each application can allow *approximately 1,250 uploads per day or approximately 12,500 requests per day*. If the daily limit is hit five times in a month, then the app will be blocked for the rest of the month. The remaining credit limit will be shown with each requests response in the `X-RateLimit-ClientRemaining` HTTP header.

We also limit each user (via their IP Address) for each application, this is to ensure that no single user is able to spam an application. This limit will simply stop the user from requesting more data for an hour. We recommend that each application takes precautions against spamming by implementing rate limiting on their own applications. Each response will also include the remaining credits for each user in the `X-RateLimit-UserLimit` HTTP header.

Each request contains rate limit information in the HTTP response headers.

| HTTP Header                 | Description                                                       |
|-----------------------------|-------------------------------------------------------------------|
| X-RateLimit-UserLimit       | Total credits that can be allocated.                              |
| X-RateLimit-UserRemaining   | Total credits available.                                          |
| X-RateLimit-UserReset       | Timestamp (unix epoch) for when the credits will be reset.        |
| X-RateLimit-ClientLimit     | Total credits that can be allocated for the application in a day. |
| X-RateLimit-ClientRemaining | Total credits remaining for the application in a day.             |

Unless otherwise noted, an API call deducts 1 credit from your allocation. However, uploads have a significantly higher computational cost on our back-end, and deduct 10 credits per call. All OAuth calls, such as refreshing tokens or authorizing users, do not deduct any credits.
You can also check the current rate limit status on your application by sending a GET request to 

    https://api.seesee.com/3/credits

Your use of the SeeSee API is also limited by the number of POST requests your IP can make across all endpoints. This limit is *1,250 POST requests per hour*. [Commercial Usage](http://api.seesee.com/#commercial) is not impacted by this limit. Each POST request will contain the following headers.

| HTTP Header                 | Description                                        |
|-----------------------------|----------------------------------------------------|
| X-Post-Rate-Limit-Limit     | Total POST credits that are allocated.             |
| X-Post-Rate-Limit-Remaining | Total POST credits available.                      |
| X-Post-Rate-Limit-Reset     | Time in seconds until your POST ratelimit is reset |

# Authorization and OAuth

## OAuth 2.0 Overview
The SeeSee API uses OAuth 2.0 for authentication. OAuth 2.0 has four steps: registration, authorization, making the request, and getting new access_tokens after the initial one expired.

* [Registration](https://api.seesee.com/oauth2/addclient) gives you your `client_id` and `client_secret`, which is then used to authorize the user to your app.
* Authorization is the process of the user saying "I would like YourSuperAwesomeImgurApp to access my data". YourSuperAwesomeImgurApp cannot access the user's account without them agreeing to it. After they agree, you will get refresh and access tokens.
    * `access_token`: is your secret key used to access the user's data. It can be thought of the user's password and username combined into one, and is used to access the user's account. It expires after 1 month.
    * `refresh_token`: is used to request new access_tokens. Since access_tokens expire after 1 month, we need a way to request new ones without going through the entire authorization step again. It does not expire.
    * `authorization_code`: is used for obtaining the the access and refresh tokens. It's purpose is to be immediately exchanged for an access_token and refresh_token.
    * Finally, after obtaining your access_token, you make your API requests by sending the Authorization header as such: 
    ```Authorization: Bearer YOUR_ACCESS_TOKEN```
    
* Registration

Each client must register their application and receive the client_id and client_secret.

For public read-only and anonymous resources, such as getting image info, looking up user comments, etc. all you need to do is send an authorization header with your client_id in your requests. This also works if you'd like to upload images anonymously (without the image being tied to an account), or if you'd like to create an anonymous album. This lets us know which application is accessing the API.

    Authorization: Client-ID YOUR_CLIENT_ID

## Authorization

> _NOTE:_ If your app is not only requesting public read-only information, then you may skip this step.

To access a user's account, the user must first authorize your application so that you can get an access token. Requesting an access token is fairly straightforward: point a browser (pop-up, or full page redirect if needed) to a URL and include a set of query string parameters.

    https://api.seesee.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=REQUESTED_RESPONSE_TYPE&state=APPLICATION_STATE
    
The user will now be able to enter their password and accept that they'd like to use your application. Once this happens, they will be redirected to your redirect URL (that you entered during registration) with the access token. You can now send the access token in the headers to access their account information.

#### Forming the authorization URL

Authorization Endpoint: `https://api.seesee.com/oauth2/authorize`

| Parameter     | Values                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|---------------|----------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| response_type | `token`, `code`, or `pin`                    | _Only `token` should be used, as the other methods have been deprecated._ Determines if SeeSee returns an access_token, authorization_code (_deprecated_), or a PIN code(_deprecated_). When using `token`, the `access_token` and `refresh_token` will be given to you in the form of query string parameters attached to your redirect URL, which the user may be able to read.                                                                                                                                          |
| client_id     | the Client ID you recieved from registration | Indicates the client that is making the request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| state         | any string                                   | This optional parameter indicates any state which may be useful to your application upon receipt of the response. SeeSee round-trips this parameter, so your application receives the same value it sent. Possible uses include redirecting the user to the correct resource in your site, nonces, and cross-site-request-forgery mitigations.                                                                                                                                                                             |

#### The `response_type` Parameter

`token`: This authorization flow will directly return the `access_token` and `refresh_token` via the redirect URL you specified during registration, in the form of hash query string parameters. Example: `http://example.com#access_token=ACCESS_TOKEN&token_type=Bearer&expires_in=3600`

The `code` and `pin` response types have been deprecated and will soon no longer be supported.

### Handling the Authorization Response

The response will be sent to the redirect URL that was specified during registration. The contents and format of the response is determined by the value of the response_type parameter.
You're able to change your applications redirect URL at any time by accessing the ['apps' section of your account settings](http://seesee.com/account/settings/apps).

#### JavaScript responses for the response_type: `token`

SeeSee returns an access token to your application if the user grants your application the permissions it requested. The access token is returned to your application in the fragment as part of the `access_token` parameter. Since a fragment (the part of the URL after the `#`) is not sent to the server, client side javascript must parse the fragment and extract the value of the `access_token` parameter.
Other parameters included in the response include `expires_in` and `token_type`. These parameters describe the lifetime of the token in seconds, and the kind of token that is being returned. If the `state` parameter was included in the request, then it is also included in the response.
An example User Agent flow response is shown below:

    https://example.com/oauthcallback#access_token=ACCESS_TOKEN&token_type=Bearer&expires_in=3600
    
Below is a JavaScript snippet that parses the response and returns the parameters to the server.

```js
// First, parse the query string
var params = {}, queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(queryString)) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}

// And send the token over to the server
var req = new XMLHttpRequest();
// consider using POST so query isn't logged
req.open('GET', 'https://' + window.location.host + '/catchtoken?' + queryString, true);

req.onreadystatechange = function (e) {
  if (req.readyState == 4) {
     if(req.status == 200){
       window.location = params['state']
   }
  else if(req.status == 400) {
        alert('There was an error processing the token.')
    }
    else {
      alert('something else other than 200 was returned')
    }
  }
};
req.send(null);
```

This code sends the parameters received on the fragment to the server using XMLHttpRequest and writes the access token to local storage in the browser. The latter is an optional step, and depends on whether or not the application requires other JavaScript code to make calls to the SeeSee API. Also note that this code sends the parameters to the token endpoint, and they are sent over an HTTPS channel.

#### Error Response

The SeeSee API returns an error if the user did not grant your application the permissions it requested. The error is returned to the application in the query string parameter error if the web server flow is used. If the user agent flow was used, then the error is returned in the fragment. If the state parameter was included in the request, it is also present in the error response.

An example error response for the web server flow is shown below:

    https://example.com/oauthcallback?error=access_denied
    
### Making your requests
Congrats! You must have the user's access_token at this point and you're ready to start making API requests to their account. All that's required for this is to set the header in your requests:

    Authorization: Bearer YOUR_ACCESS_TOKEN
    
### Refresh Tokens

If a user has authorized their account but you no longer have a valid access_token for them, then a new one can be generated by using the refresh_token.

When your application receives a refresh token, it is important to store that refresh token for future use. If your application loses the refresh token, you will have to prompt the user for their login information again.

To obtain a new access token, your application performs a POST to `https://api.seesee.com/oauth2/token`. The request must include the following parameters to use a refresh token:

| Field         | Description                                                                               |
|---------------|-------------------------------------------------------------------------------------------|
| refresh_token | The refresh token returned from the authorization code exchange                           |
| client_id     | The client_id obtained during application registration                                    |
| client_secret | The client secret obtained during application registration                                |
| grant_type    | As defined in the OAuth2 specification, this field must contain a value of: `refresh_token` |

As long as the user has not revoked the access granted to your application, the response includes a new access token. A response from such a request is shown below:

```json
{
    "access_token":"5c3118ebb73fbb275945ab340be60b610a3216d6",
    "refresh_token":"d36b474c95bb9ee54b992c7c34fffc2cc343d0a7",
    "expires_in":3600,
    "token_type":"Bearer",
    "account_username":"saponifi3d"
}
```

### More OAuth 2 help and documentation
For more information about how to use OAuth 2, please visit the great documentation from Google. At the time of writing, our OAuth 2 server is completely compatible with theirs. The documentation may be found here: https://developers.google.com/accounts/docs/OAuth2



# Performance Tips
Below are a few ways you can speed up your application's use of the SeeSee API. 

If you have any additional feature requests, please reach out on Twitter [@imgurAPI](https://twitter.com/imgurAPI)!

### ETag Support
The SeeSee API supports [ETags](http://en.wikipedia.org/wiki/HTTP_ETag), which allows the API to signal to developers whether or not data from previous queries have changed. 

Usage:
1. When fetching from the SeeSee API, the response header will include an ETag with a digest of the response data. Save this ETag value for future requests to the same route. 

    An example ETag response header: 
    
    `ETag: "a695f4e9672bf7fc7a779ac12ead684d72292506"`
1. On the next request to the same route, include a If-None-Match header in the request with the ETag from the first step. (Note: the quotations around the hash must be included) 

    An example ETag request header: 
    
    `If-None-Match: "a695f4e9672bf7fc7a779ac12ead684d72292506"`
1. If the data hasn't changed, the response status code will be *304* (Not Modified) and no data will be returned.
1. If the response data has changed since the last request, the data is returned normally with a new ETag in the response header. Save this value for future requests.

    *Note:* Although ETags help speed up your application, requests with the *If-None-Match* header will still count towards rate limits.
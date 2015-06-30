# Repotracktor
Github Api Example

With these example app you can fetch repository collaborators and forks using github api.
Additionally you can rate all of them (the data stored in mongodb). 

Application is build with:
* Marionette.js
* Require.js
* Bootstrap 3
* Express 4
* MongoDB
* [Full list of the serverside libs](package.json)
* [Full list of the clientside libs](bower.json)

To install the app:
```npm install```

To start the app you will need to provide next environment variables:
* MONGODB_URL - mongodb connect url
* GITHUB_OAUTH_SECRET - github oauth client secret
* GITHUB_OAUTH_ID - github ouath client id

Example:
```MONGODB_URL=mongodb://usr:pass@host:3000/db_name GITHUB_OAUTH_SECRET=f2fss8dg GITHUB_OAUTH_ID=123 npm start```

Github credentials can be obtained from the following link https://github.com/settings/applications/new
Unless you want to install local mongodb, you can use services of https://mongolab.com

TODO:
* Fix network performance. Build require.js modules into one file.
* Fix minor security issue. Github api requests have to be moved to server from client

Demo:
http://repotracktor-cainrus.rhcloud.com/

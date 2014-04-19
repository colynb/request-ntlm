# Request-NTLM

Module for authenticating with NTLM; An ntlm authentication wrapper for the Request module.

## Install with NPM

```
$ npm install --save-dev request-ntlm
```

## Usage

```javascript
var ntlm = require('request-ntlm');

var opts = {
  username: 'username',
  password: 'password',
  domains: 'yourdomain',
  workstation: 'workstation',
  url: 'http://example.com/path/to/resource'
};
var json = {
  // whatever object you want to submit
};
ntlm.post(opts, json, function(err, response) {
  // do something
});
```

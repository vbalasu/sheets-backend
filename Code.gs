function main() {
  Logger.log(getIdToken());
}


function getIdToken() {
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty('SA_EMAIL');
  let key = props.getProperty('SA_PRIVATE_KEY');

// Convert escaped newlines to real newlines
  key = key.replace(/\\n/g, '\n').trim();

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: email,
    sub: email,
    aud: tokenUrl,
    iat: now,
    exp: now + 3600,
    target_audience: 'https://example.com' // REQUIRED but can be anything
  };

  const encode = obj =>
    Utilities.base64EncodeWebSafe(JSON.stringify(obj)).replace(/=+$/, '');

  const unsignedJwt = encode(header) + '.' + encode(payload);
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeRsaSha256Signature(unsignedJwt, key)
  ).replace(/=+$/, '');

  const jwt = unsignedJwt + '.' + signature;

  const response = UrlFetchApp.fetch(tokenUrl, {
    method: 'post',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }
  });

  return JSON.parse(response.getContentText()).id_token;
}

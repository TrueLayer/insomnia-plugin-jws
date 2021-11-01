const tlSigning = require('truelayer-signing');

const addTlSignatureToRequest = context => {
  const jwsIsRequired = context.request.getEnvironmentVariable('REQUIRE_JWS') === true;
  if (!jwsIsRequired) {
    console.log('no signing needed because the REQUIRE_JWS environment variable is either missing or !== true');
    return;
  }

  const certificateId = context.request.getEnvironmentVariable('CERTIFICATE_ID');
  if (!certificateId) {
    throw new Error('Missing required `CERTIFICATE_ID` environment variable.');
  }

  const privateKey = context.request.getEnvironmentVariable('PRIVATE_KEY');
  if (!privateKey) {
    throw new Error('Missing required `PRIVATE_KEY` environment variable.');
  }

  let idempotencyKey = context.request.getHeader("Idempotency-Key");

  let v2Signature = tlSigning.sign({
    kid: certificateId,
    privateKeyPem: privateKey,
    method: context.request.getMethod(),
    path: new URL(context.request.getUrl()).pathname,
    body: context.request.getBodyText(),
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
  });
  context.request.setHeader('Tl-Signature', v2Signature);
}


module.exports.requestHooks = [
  addTlSignatureToRequest
];

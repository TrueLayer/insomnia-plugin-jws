const JWS = require('jws');

const createJws = (certificateId, payload, privateKey) => JWS.sign({
  header: {
    alg: 'ES512',
    kid: certificateId,
  },
  payload,
  privateKey,
});

const detachContent = jws => {
  const parts = jws.split('.');
  return `${parts[0]}..${parts[2]}`;
};

const addTlSignatureToRequest = context => {
  const payload = context.request.getBodyText();
  const jwsIsRequired = context.request.getEnvironmentVariable('REQUIRE_JWS') === true;

  if (!jwsIsRequired) {
    console.log('no signing needed because the REQUIRE_JWS environment variable is either missing or !== true');
    return;
  }

  // we only need signing for requests with a body
  if (!payload) {
    console.log('no signing needed because there is no payload');
    return false;
  }

  const certificateId = context.request.getEnvironmentVariable('CERTIFICATE_ID');

  if (!certificateId) {
    throw new Error('Missing required `CERTIFICATE_ID` environment variable.');
  }

  const privateKey = context.request.getEnvironmentVariable('PRIVATE_KEY');

  if (!privateKey) {
    throw new Error('Missing required `PRIVATE_KEY` environment variable.');
  }

  const jws = createJws(certificateId, payload, privateKey);
  const jwsWithDetachedContent = detachContent(jws);
  context.request.setHeader('X-Tl-Signature', jwsWithDetachedContent);
}

module.exports.requestHooks = [
  addTlSignatureToRequest
];
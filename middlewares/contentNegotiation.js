const yaml = require('js-yaml');
const xml2js = require('xml2js');

module.exports = (req, res, next) => {
  const originalJson = res.json;
  const originalSend = res.send;

  res.json = function(data) {
    // Only apply content negotiation for successful responses (status < 400)
    if (res.statusCode >= 400) {
      return originalJson.call(this, data);
    }

    const accept = req.headers.accept || 'application/json';

    if (accept.includes('application/xml') || accept.includes('text/xml')) {
      const builder = new xml2js.Builder({ rootName: 'response' });
      const xml = builder.buildObject(data);
      res.set('Content-Type', 'application/xml');
      return originalSend.call(this, xml);
    } else if (accept.includes('application/yaml') || accept.includes('text/yaml')) {
      const yamlStr = yaml.dump(data);
      res.set('Content-Type', 'application/yaml');
      return originalSend.call(this, yamlStr);
    } else {
      res.set('Content-Type', 'application/json');
      return originalJson.call(this, data);
    }
  };

  next();
};
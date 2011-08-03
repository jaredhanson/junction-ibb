var util = require('util');
var StanzaError = require('junction').StanzaError;


module.exports = function openParser(options) {
  options = options || {};
  
  return function openParser(stanza, next) {
    if (!stanza.is('iq')) { return next(); }
    if (stanza.type == 'result' || stanza.type == 'error') { return next(); }
    var open = stanza.getChild('open', 'http://jabber.org/protocol/ibb');
    if (!open) { return next(); }
    
    if (stanza.type != 'set') {
      return next(new StanzaError("IBB open must be an IQ-set stanza.", 'modify', 'bad-request'));
    }
    if (!open.attrs['sid']) { next(new StanzaError("Missing required 'sid' attribute.", 'modify', 'bad-request')) };
    if (!open.attrs['block-size']) { next(new StanzaError("Missing required 'block-size' attribute.", 'modify', 'bad-request')) };
    
    stanza.command = 'open';
    stanza.sid = open.attrs['sid'];
    stanza.blockSize = open.attrs['block-size'];
    stanza.stanza = open.attrs['stanza'] || 'iq';
    next();
  }
}

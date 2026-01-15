const { NFC } = require('nfc-pcsc');
const WebSocket = require('ws');

const nfc = new NFC();
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

const activeReaders = new Map();

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

nfc.on('reader', reader => {
  const name = reader.reader.name;

  if (activeReaders.has(name)) {
    console.log('Reader already registered, ignoring:', name);
    return;
  }

  console.log('Reader connected:', name);
  activeReaders.set(name, reader);

  // Enable auto-processing (default is true, but being explicit)
  reader.autoProcessing = true;

  reader.on('card', card => {
    console.log('Scanned:', card.uid);
    broadcast({ uid: card.uid, timestamp: Date.now() });
  });

  reader.on('card.off', card => {
    console.log('Card removed:', card.uid);
  });

  reader.on('end', () => {
    console.log('Reader removed:', name);
    activeReaders.delete(name);
  });

  reader.on('error', err => {
    console.error('Reader error:', err.message);
  });
});

nfc.on('error', err => console.error('NFC error:', err.message));
onconnect = e => {
    const port = e.ports[0];
    importScripts(
        'https://img1a.flixcart.com/www/linchpin/batman-returns/fingerprint/glMatrix.min.js'
    );
    // console.log('glMatrix', glMatrix);
    const obj = {
        dsfsdg: 'dsvdfb',
        dvdfdf: 'dsvdfb'
    };
    const msg = 'from Shared Worker';
    port.onmessage = e => {
        console.log(e);
        const workerResult = 'Result: ' + msg;
        port.postMessage(obj);
    };
};

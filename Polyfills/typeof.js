Object.prototype.toString.call(37).slice(8, -1).toLowerCase(); // number
Object.prototype.toString.call([]).slice(8, -1).toLowerCase(); // array
Object.prototype.toString.call({}).slice(8, -1).toLowerCase(); // object

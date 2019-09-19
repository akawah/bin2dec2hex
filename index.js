const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), 'source')));

app.listen(PORT, () => {
	console.log('Server has been started...');
});
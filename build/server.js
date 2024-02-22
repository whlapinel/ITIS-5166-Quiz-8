import express from 'express';
import { data } from './data.js';
import { insertBudgetItem } from './data.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use('/', express.static('public'));
app.get('/hello', (req, res) => {
    res.send('Hello World');
});
app.get('/api/budget', (req, res) => {
    console.log("Budget requested");
    res.json(data);
});
app.post('/api/budget', (req, res) => {
    console.log("Post request received");
    console.log(req.body);
    res.send('Post request received');
    insertBudgetItem(req.body);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

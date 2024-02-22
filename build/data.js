import mongoose from 'mongoose';
try {
    await main();
}
catch (err) {
    console.log(err);
}
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/budgetDB');
}
const hexRegEx = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        match: hexRegEx,
    }
});
const BudgetItem = mongoose.model('BudgetItem', budgetSchema);
export const data = await BudgetItem.find();
export async function insertBudgetItem(item) {
    try {
        const newItem = new BudgetItem(item);
        console.log('newItem: ' + newItem);
        await newItem.save();
    }
    catch (err) {
        console.log(err);
    }
}
// for development only
// function to replace the color property of 9 items in the database with colors from an array
// updateColors();
export async function updateColors() {
    const colors = ["#bf5f5f", "#bf9f5f", "#9fbf5f", "#5fbf5f", "#5fbf9f", "#5f9fbf", "#5f5fbf", "#9f5fbf", "#bf5f9f"];
    const items = await BudgetItem.find();
    items.map(async (item, index) => {
        item.color = colors[index];
        await item.save();
    });
}
// generate random number between -300 and 300
function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
// Usage
const randomNumber = getRandomNumber(-300, 300);
console.log(randomNumber);
// evenOutBudgets();
export async function evenOutBudgets() {
    const items = await BudgetItem.find();
    items.map(async (item, index) => {
        item.budget = 1000 + getRandomNumber(-300, 300);
        await item.save();
    });
}

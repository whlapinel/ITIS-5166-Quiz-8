import mongoose from 'mongoose';

try {
    await main()
} catch (err) {
    console.log(err)
}

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/budgetDB');
}

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
        required: true
    }
});

const BudgetItem = mongoose.model('BudgetItem', budgetSchema);

export const data = await BudgetItem.find();

export async function insertBudgetItem(item) {
    try {
        const newItem = new BudgetItem(item);
        await newItem.save();
    } catch (err) {
        console.log(err);
    }
}



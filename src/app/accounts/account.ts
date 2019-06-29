import { Transaction } from "../transactions/transaction";

export interface BankAccount {
    name: string
    _id: string
    description: string
    icon: string
    
    transactions: Transaction[];
    total: number;
}
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

const transactions = [
    {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        avatar: "https://placehold.co/100x100.png?text=OM",
        fallback: "OM",
        amount: 1999.00,
        type: "Sale",
        status: "Success"
    },
    {
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        avatar: "https://placehold.co/100x100.png?text=JL",
        fallback: "JL",
        amount: -39.00,
        type: "Expense",
        status: "Success"
    },
    {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        avatar: "https://placehold.co/100x100.png?text=IN",
        fallback: "IN",
        amount: 299.00,
        type: "Sale",
        status: "Success"
    },
    {
        name: "William Kim",
        email: "will@email.com",
        avatar: "https://placehold.co/100x100.png?text=WK",
        fallback: "WK",
        amount: -99.00,
        type: "Expense",
        status: "Pending"
    },
    {
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        avatar: "https://placehold.co/100x100.png?text=SD",
        fallback: "SD",
        amount: 39.00,
        type: "Sale",
        status: "Failed"
    },
];
  

export function RecentTransactions() {
  return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {transactions.map((transaction, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={transaction.avatar} alt="Avatar" data-ai-hint="person portrait"/>
                                <AvatarFallback>{transaction.fallback}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-0.5">
                                <p className="font-medium">{transaction.name}</p>
                                <p className="text-sm text-muted-foreground">{transaction.email}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={transaction.type === 'Sale' ? 'default' : 'secondary'}>{transaction.type}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={
                            transaction.status === 'Success' ? 'outline' : 
                            transaction.status === 'Pending' ? 'secondary' : 'destructive'
                        }>
                            {transaction.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                        {transaction.amount > 0 ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  )
}


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, Check, Wallet, ShoppingBag, Utensils, Map, Ticket, Landmark } from 'lucide-react';

interface BudgetSectionProps {
  totalBudget: number;
  totalSpent: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
  contingencyAmount: number;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({
  totalBudget,
  totalSpent,
  categories,
  contingencyAmount
}) => {
  // Calculate percentage spent
  const percentageSpent = Math.round((totalSpent / totalBudget) * 100);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];
  
  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'accommodation':
        return <Landmark className="h-4 w-4" />;
      case 'transportation':
        return <Wallet className="h-4 w-4" />;
      case 'food & dining':
        return <Utensils className="h-4 w-4" />;
      case 'activities & entrance fees':
        return <Ticket className="h-4 w-4" />;
      case 'shopping':
        return <ShoppingBag className="h-4 w-4" />;
      case 'sightseeing':
        return <Map className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-travel-dark">Budget Tracker</CardTitle>
        <CardDescription>
          Track your spending and stay within your budget.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Overview */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Budget</span>
                <span className="font-medium">{formatCurrency(totalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Spent So Far</span>
                <span className="font-medium">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Remaining</span>
                <span className="font-medium text-travel-primary">{formatCurrency(totalBudget - totalSpent)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{percentageSpent}% of budget used</span>
                <span className="text-sm text-gray-500">{formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}</span>
              </div>
              <Progress 
                value={percentageSpent} 
                className="h-2 bg-gray-100"
              />
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800">Contingency Fund</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    We recommend setting aside {formatCurrency(contingencyAmount)} for unexpected expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Budget Breakdown */}
          <div className="space-y-6">
            <h3 className="font-medium text-lg">Expense Breakdown</h3>
            
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    labelFormatter={(index) => categories[index].name}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(category.name)}
                      <span className="text-sm">{category.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                    <span className="text-xs text-gray-500">({category.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSection;

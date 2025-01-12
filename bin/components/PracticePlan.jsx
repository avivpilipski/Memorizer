import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const PracticePlan = ({ plan }) => {
    return (
        <Card className="p-6 shadow-lg bg-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-900">Your Practice Plan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                    {plan.map((day, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100"
                        >
                            <div className="font-semibold text-indigo-900">{day.date}</div>
                            <div className="text-indigo-700">
                                Practice time: {day.minutes} minutes
                            </div>
                            <div className="text-sm text-indigo-600 mt-1">
                                Focus: {day.focus}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
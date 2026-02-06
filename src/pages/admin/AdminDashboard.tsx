import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import { Loader2, Users, ShoppingBag, DollarSign, TrendingUp, Package, Tag, MessageSquare, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { subDays, format } from "date-fns";

const AdminDashboard = () => {
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: analyticsService.getDashboardStats
    });

    const { data: trendData } = useQuery({
        queryKey: ['enquiries-trend'],
        queryFn: analyticsService.getEnquiriesTrend
    });

    const { data: topCategories } = useQuery({
        queryKey: ['top-categories'],
        queryFn: analyticsService.getTopCategories
    });

    const { data: recentEnquiries } = useQuery({
        queryKey: ['recent-enquiries'],
        queryFn: analyticsService.getRecentEnquiries
    });

    if (statsLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">{stats?.activeProducts} Active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalEnquiries}</div>
                        <p className="text-xs text-muted-foreground">+{stats?.enquiriesToday} today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Activity</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.visitorsToday}</div>
                        <p className="text-xs text-muted-foreground">Page views today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Enquiries Over Time (30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => format(new Date(str), 'MMM d')}
                                    fontSize={12}
                                />
                                <YAxis allowDecimals={false} fontSize={12} />
                                <Tooltip
                                    labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                                />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Categories (By Enquiries)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCategories} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" allowDecimals={false} fontSize={12} />
                                <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Enquiries Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Enquiries</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Interest</TableHead>
                                <TableHead>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentEnquiries && recentEnquiries.length > 0 ? (
                                recentEnquiries.map((enquiry: any) => (
                                    <TableRow key={enquiry.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(enquiry.created_at), 'MMM d, h:mm a')}
                                        </TableCell>
                                        <TableCell className="font-medium">{enquiry.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs">
                                                <span>{enquiry.phone}</span>
                                                <span className="text-muted-foreground">{enquiry.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {enquiry.products?.title ? (
                                                <span className="text-primary font-medium text-xs bg-primary/10 px-2 py-1 rounded">
                                                    {enquiry.products.title}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">General</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={enquiry.message}>
                                            {enquiry.message}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No enquiries yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;

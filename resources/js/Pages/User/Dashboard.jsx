// resources/js/Pages/Dashboard.jsx

import React from 'react';
import UserLayout from '@/Layouts/UserLayout';

export default function Dashboard({ orders = [] }) {
    return (
        <UserLayout>
            <h1 className="text-2xl font-bold mb-4">Bảng điều khiển</h1>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h2>

                {orders.length === 0 ? (
                    <p>Chưa có đơn hàng nào.</p>
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã đơn</th>
                                <th className="px-4 py-2 text-left">Ngày đặt</th>
                                <th className="px-4 py-2 text-left">Tổng tiền</th>
                                <th className="px-4 py-2 text-left">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-4 py-2">{order.code}</td>
                                    <td className="px-4 py-2">{order.date}</td>
                                    <td className="px-4 py-2">{order.total}₫</td>
                                    <td className="px-4 py-2">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </UserLayout>
    );
}

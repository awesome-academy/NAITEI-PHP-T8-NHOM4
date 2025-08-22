import UserLayout from '@/Layouts/UserLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, CheckCircleIcon, TruckIcon, MapPinIcon, CreditCardIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const statusConfig = {
    completed: { style: 'bg-green-50 text-green-700 ring-1 ring-green-600/20', icon: CheckCircleIcon },
    shipped: { style: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20', icon: TruckIcon },
    processing: { style: 'bg-yellow-50 text-yellow-800 ring-1 ring-yellow-600/20', icon: ClockIcon },
    canceled: { style: 'bg-red-50 text-red-700 ring-1 ring-red-600/20', icon: XCircleIcon },
    pending: { style: 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20', icon: ClockIcon },
};

const sampleShippingAddress = {
    name: 'SUN ASTERISK',
    address_line_1: '123 Main Street',
    address_line_2: 'Apartment 4B',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'United States',
};

const samplePaymentMethod = {
    details: 'Visa ending in 4242',
};

export default function OrderDetail({ auth, order }) {
    const [isCancelling, setIsCancelling] = useState(false);
    const StatusIcon = statusConfig[order.status]?.icon || ClockIcon;
    
    const subtotal = order.order_details.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingFee = 15.00;
    const freeShip = -15.00;

    const handleCancelOrder = () => {
        if (confirm('Are you sure you want to cancel this order?')) {
            setIsCancelling(true);
            router.post(route('orders.cancel', order.id), {}, {
                onFinish: () => setIsCancelling(false),
                onSuccess: () => {
                    // Redirect back to order history
                    router.visit(route('orders.history'));
                }
            });
        }
    };

    return (
        <UserLayout auth={auth}>
            <Head title={`Order #${order.id} - Flatlogic`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link 
                                    href={route('orders.history')} 
                                    className="flex items-center gap-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    Back to Orders
                                </Link>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                        Order #{order.id}
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                
                                <div className="mt-4 sm:mt-0">
                                    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1.5 text-sm font-medium capitalize ${statusConfig[order.status]?.style || 'bg-gray-100 text-gray-800'}`}>
                                        <StatusIcon className="h-4 w-4" />
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Products */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Products List */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h2>
                                    <div className="space-y-6">
                                        {order.order_details.map((item) => (
                                            <div key={item.id} className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img 
                                                        // SỬA LẠI: Dùng decodeURIComponent để giải mã đường dẫn và xóa /storage/
                                                        src={item.product.images.length > 0 ? `/${decodeURIComponent(item.product.images[0].image_path)}` : 'https://via.placeholder.com/150'} 
                                                        alt={item.product.name} 
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-medium text-gray-900 line-clamp-2">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary & Info */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-gray-900">${shippingFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Free Ship</span>
                                            <span className="text-gray-900">${freeShip.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-base font-semibold text-gray-900">Total</span>
                                                <span className="text-lg font-bold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Cancel Button for Pending Orders */}
                                    {order.status === 'pending' && (
                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={handleCancelOrder}
                                                disabled={isCancelling}
                                                className="w-full inline-flex items-center justify-center gap-x-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <XCircleIcon className="h-4 w-4" />
                                                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                            </button>
                                            <p className="mt-2 text-xs text-gray-500 text-center">
                                                You can only cancel orders with "Pending" status
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                        <h2 className="text-lg font-semibold text-gray-900">Shipping From</h2>
                                    </div>
                                    <address className="text-sm text-gray-600 not-italic space-y-1">
                                        <div className="font-medium text-gray-900">{sampleShippingAddress.name}</div>
                                        <div>{sampleShippingAddress.address_line_1}</div>
                                        {sampleShippingAddress.address_line_2 && (
                                            <div>{sampleShippingAddress.address_line_2}</div>
                                        )}
                                        <div>
                                            {sampleShippingAddress.city}, {sampleShippingAddress.state} {sampleShippingAddress.zip_code}
                                        </div>
                                        <div>{sampleShippingAddress.country}</div>
                                    </address>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                                    </div>
                                    <p className="text-sm text-gray-600">{samplePaymentMethod.details}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
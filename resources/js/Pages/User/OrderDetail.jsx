import UserLayout from '@/Layouts/UserLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, CheckCircleIcon, TruckIcon, MapPinIcon, CreditCardIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const sampleOrder = {
    id: 'ORD-001',
    date: 'August 18, 2025',
    status: 'Delivered',
    total: '250.00',
    subtotal: '200.00',
    shipping: '15.00',
    tax: '35.00',
    shipping_address: {
        name: 'John Doe',
        address_line_1: '123 Main Street',
        address_line_2: 'Apartment 4B',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'United States',
    },
    payment_method: 'Visa ending in 4242',
    products: [
        { 
            id: 1, 
            name: 'Modern Wooden Chair', 
            price: '150.00', 
            quantity: 1, 
            image: 'https://i.etsystatic.com/39548686/r/il/f2787c/6113398578/il_570xN.6113398578_8myn.jpg' 
        },
        { 
            id: 2, 
            name: 'Badminton Racket', 
            price: '50.00', 
            quantity: 1, 
            image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSv58OO8dnTtkq-fITAgEbdzDVqPvrX44v2yj98oASa_Gp92xRyacJ31iaWvyACW7IPBRNtKj4HgF1PBtUVfZQ5xw6JFCFSn4-_nM4EP3iYHY3HUAJ_X471tg' 
        },
    ],
};

const statusConfig = {
    Delivered: { style: 'bg-green-50 text-green-700 ring-1 ring-green-600/20', icon: CheckCircleIcon },
    Shipped: { style: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20', icon: TruckIcon },
    Processing: { style: 'bg-yellow-50 text-yellow-800 ring-1 ring-yellow-600/20', icon: ClockIcon },
    Cancelled: { style: 'bg-red-50 text-red-700 ring-1 ring-red-600/20', icon: XCircleIcon },
};

export default function OrderDetail({ auth, order = sampleOrder }) {
    const StatusIcon = statusConfig[order.status]?.icon || CheckCircleIcon;
    
    return (
        <UserLayout auth={auth}>
            <Head title={`Order ${order.id} - Flatlogic`} />

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
                                        Order {order.id}
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                
                                <div className="mt-4 sm:mt-0">
                                    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusConfig[order.status]?.style || 'bg-gray-100 text-gray-800'}`}>
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
                                        {order.products.map((product) => (
                                            <div key={product.id} className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-medium text-gray-900 line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Quantity: {product.quantity}
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                                        ${(parseFloat(product.price) * product.quantity).toFixed(2)}
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
                                            <span className="text-gray-900">${order.subtotal}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-gray-900">${order.shipping}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="text-gray-900">${order.tax}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-base font-semibold text-gray-900">Total</span>
                                                <span className="text-lg font-bold text-gray-900">${order.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                        <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                                    </div>
                                    <address className="text-sm text-gray-600 not-italic space-y-1">
                                        <div className="font-medium text-gray-900">{order.shipping_address.name}</div>
                                        <div>{order.shipping_address.address_line_1}</div>
                                        {order.shipping_address.address_line_2 && (
                                            <div>{order.shipping_address.address_line_2}</div>
                                        )}
                                        <div>
                                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
                                        </div>
                                        <div>{order.shipping_address.country}</div>
                                    </address>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                                        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                                    </div>
                                    <p className="text-sm text-gray-600">{order.payment_method}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
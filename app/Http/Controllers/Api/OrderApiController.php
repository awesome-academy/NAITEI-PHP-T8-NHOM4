<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\OrderDetailController;
use App\Http\Requests\Admin\StoreOrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderStatusChangedMail;

/**
 * @OA\Tag(
 *     name="Orders",
 *     description="API Endpoints for managing orders"
 * )
 */
class OrderApiController extends Controller
{
    protected $orderDetailController;

    public function __construct(OrderDetailController $orderDetailController)
    {
        $this->orderDetailController = $orderDetailController;
    }

    /**
     * @OA\Get(
     *     path="/api/admin/orders",
     *     operationId="getAdminOrdersList",
     *     tags={"Orders"},
     *     summary="[Admin] Get list of all orders",
     *     description="Returns a paginated list of all orders with filtering and sorting capabilities.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="search", in="query", description="Search by order ID, customer name or email", @OA\Schema(type="string")),
     *     @OA\Parameter(name="status", in="query", description="Filter by order status", @OA\Schema(type="string", enum={"pending", "processing", "completed", "canceled"})),
     *     @OA\Parameter(name="sort", in="query", description="Field to sort by", @OA\Schema(type="string", enum={"id", "total_amount", "status", "created_at"})),
     *     @OA\Parameter(name="direction", in="query", description="Sort direction", @OA\Schema(type="string", enum={"asc", "desc"})),
     *     @OA\Response(response=200, description="Successful operation", @OA\JsonContent(type="object", @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Order")))),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Order::class);

        $query = Order::with(['user:id,username,email', 'orderDetails']);

        if ($request->has('search') && $request->search) {
            $query->where('id', 'like', '%' . $request->search . '%')
                ->orWhereHas('user', function ($q) use ($request) {
                    $q->where('username', 'like', '%' . $request->search . '%')
                        ->orWhere('email', 'like', '%' . $request->search . '%');
                });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $allowedSortFields = ['id', 'total_amount', 'status', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $orders = $query->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/orders/{id}",
     *     operationId="getAdminOrderById",
     *     tags={"Orders"},
     *     summary="[Admin] Get a single order by ID",
     *     description="Returns detailed information for a specific order, including order items and user info.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID of the order", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Successful operation", @OA\JsonContent(ref="#/components/schemas/Order")),
     *     @OA\Response(response=404, description="Order not found")
     * )
     */
    public function show(Order $order): JsonResponse
    {
        $this->authorize('view', $order);
        $order->load(['user', 'orderDetails.product']);
        return response()->json($order);
    }

    /**
     * @OA\Post(
     *     path="/api/admin/orders",
     *     operationId="createAdminOrder",
     *     tags={"Orders"},
     *     summary="[Admin] Create a new order",
     *     description="Creates a new order for a specified user with a list of products.",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"user_id", "items"},
     *             @OA\Property(property="user_id", type="integer", example=2),
     *             @OA\Property(property="items", type="array", @OA\Items(
     *                 type="object",
     *                 required={"product_id", "quantity"},
     *                 @OA\Property(property="product_id", type="integer", example=5),
     *                 @OA\Property(property="quantity", type="integer", example=1)
     *             ))
     *         )
     *     ),
     *     @OA\Response(response=201, description="Order created successfully", @OA\JsonContent(ref="#/components/schemas/Order")),
     *     @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $this->authorize('create', Order::class);

        $stockValidation = $this->validateStock($request->items);
        if ($stockValidation !== true) {
            return $stockValidation;
        }

        $order = DB::transaction(function () use ($request) {
            $order = Order::create([
                'user_id' => $request->user_id,
                'total_amount' => 0,
                'status' => 'pending',
            ]);

            $totalAmount = 0;
            foreach ($request->items as $item) {
                $this->orderDetailController->store($item['product_id'], $order, $item['quantity']);
                $product = Product::find($item['product_id']);
                $totalAmount += $product->price * $item['quantity'];
            }

            $order->update(['total_amount' => $totalAmount]);
            return $order;
        });

        return response()->json($order->load('orderDetails'), 201);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/orders/{id}/status",
     *     operationId="updateOrderStatus",
     *     tags={"Orders"},
     *     summary="[Admin] Update an order's status",
     *     description="Updates the status of a specific order and handles stock restoration on cancellation.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(required={"status"}, @OA\Property(property="status", type="string", enum={"pending", "processing", "completed", "canceled"}))),
     *     @OA\Response(response=200, description="Status updated successfully", @OA\JsonContent(ref="#/components/schemas/Order")),
     *     @OA\Response(response=422, description="Validation error or invalid status transition")
     * )
     */
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $this->authorize('update', $order);

        $oldStatus = $order->status;
        $newStatus = $request->input('status');

        if (in_array($oldStatus, ['completed', 'canceled'])) {
            return response()->json(['message' => 'Cannot update order with status: ' . $oldStatus], 422);
        }

        $statusProgression = [
            'pending' => ['processing', 'canceled'],
            'processing' => ['completed', 'canceled'],
        ];

        if (!in_array($newStatus, $statusProgression[$oldStatus] ?? [])) {
            return response()->json(['message' => "Cannot change status from '{$oldStatus}' to '{$newStatus}'."], 422);
        }

        DB::transaction(function () use ($order, $newStatus, $oldStatus) {
            if ($newStatus === 'canceled' && $oldStatus !== 'canceled') {
                $this->orderDetailController->restoreStockForOrder($order);
            }
            $order->update(['status' => $newStatus]);
        });

        if ($order->user && $order->wasChanged('status')) {
            Mail::to($order->user->email)->send(new OrderStatusChangedMail($order));
        }

        return response()->json($order);
    }

    private function validateStock($items)
    {
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product || $product->stock_quantity < $item['quantity']) {
                return response()->json([
                    'message' => 'Validation Error',
                    'errors' => ['items' => "Insufficient stock for {$product->name}. Available: {$product->stock_quantity}"]
                ], 422);
            }
        }
        return true;
    }
}

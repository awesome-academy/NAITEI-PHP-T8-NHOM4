<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Product;
use App\Models\Image;
use App\Models\OrderDetail;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackRequest;
use App\Http\Requests\DeleteFeedbackImageRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Lấy các order_details từ đơn hàng đã hoàn thành và chưa có feedback
        $unratedOrderDetails = DB::table('order_details')
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->leftJoin('feedbacks', 'order_details.id', '=', 'feedbacks.order_detail_id')
            ->where('orders.user_id', $user->id)
            ->where('orders.status', 'completed')
            ->whereNull('feedbacks.id') // Chưa có feedback
            ->select(
                'order_details.id as order_detail_id',
                'order_details.quantity',
                'products.id as product_id',
                'products.name as product_name',
                'products.price',
                'orders.created_at as order_date'
            )
            ->get();

        // Lấy hình ảnh cho các sản phẩm chưa đánh giá
        foreach ($unratedOrderDetails as $orderDetail) {
            $orderDetail->image_path = $this->getProductImage($orderDetail->product_id);
        }

        // Lấy các feedback đã tạo với thông tin order_detail và product
        $ratedFeedbacks = DB::table('feedbacks')
            ->join('order_details', 'feedbacks.order_detail_id', '=', 'order_details.id')
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('orders.user_id', $user->id)
            ->select(
                'feedbacks.*',
                'order_details.quantity',
                'products.id as product_id',
                'products.name as product_name',
                'products.price',
                'orders.created_at as order_date'
            )
            ->orderBy('feedbacks.created_at', 'desc')
            ->get();

        // Thêm hình ảnh cho các sản phẩm đã đánh giá và hình ảnh feedback
        foreach ($ratedFeedbacks as $feedback) {
            $feedback->image_path = $this->getProductImage($feedback->product_id);
            
            // Lấy hình ảnh feedback
            $feedbackImages = DB::table('images')
                ->where('image_type', 'feedback')
                ->where('path_id', $feedback->id) 
                ->select('id', 'image_path', 'alt_text')
                ->get();
            $feedback->feedback_images = $feedbackImages;
        }

        return Inertia::render('User/Feedbacks', [
            'unratedOrderDetails' => $unratedOrderDetails,
            'ratedFeedbacks' => $ratedFeedbacks,
        ]);
    }

    public function store(StoreFeedbackRequest $request)
    {
        $user = Auth::user();

        // Lấy validated data từ request
        $validatedData = $request->validated();

        // Kiểm tra xem order_detail này có thuộc về user không
        $orderDetail = OrderDetail::with('order')->find($validatedData['order_detail_id']);
        if (!$orderDetail || $orderDetail->order->user_id !== $user->id) {
            return back()->withErrors(['message' => 'Order not found.']);
        }

        // Kiểm tra xem đơn hàng đã hoàn thành chưa
        if ($orderDetail->order->status !== 'completed') {
            return back()->withErrors(['message' => 'You can only review products from completed orders.']);
        }

        // Kiểm tra xem đã đánh giá chưa
        $existingFeedback = Feedback::where('order_detail_id', $validatedData['order_detail_id'])->first();
        if ($existingFeedback) {
            return back()->withErrors(['message' => 'You have already reviewed this product.']);
        }

        // Tạo feedback mới
        $feedback = Feedback::create([
            'order_detail_id' => $validatedData['order_detail_id'],
            'rating' => $validatedData['rating'],
            'feedback' => $validatedData['feedback'] ?? null,
        ]);

        // Xử lý upload hình ảnh feedback nếu có
        if ($request->hasFile('feedback_images')) {
            $imageController = new ImageController();
            $imageController->storeImages(
                'feedback',
                $feedback->id, 
                $request->file('feedback_images'),
                'feedbacks',
                'Feedback'
            );
        }

        return back()->with('success', 'Thank you for your review!');
    }

    public function update(UpdateFeedbackRequest $request, Feedback $feedback)
    {
        // Kiểm tra quyền sở hữu thông qua order_detail
        $orderDetail = $feedback->orderDetail()->with('order')->first();
        if (!$orderDetail || $orderDetail->order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Lấy validated data từ request
        $validatedData = $request->validated();

        // Cập nhật feedback
        $feedback->update([
            'rating' => $validatedData['rating'],
            'feedback' => $validatedData['feedback'] ?? null,
        ]);

        $imageController = new ImageController();

        // Xóa hình ảnh được chỉ định
        if (isset($validatedData['remove_image_ids']) && is_array($validatedData['remove_image_ids'])) {
            foreach ($validatedData['remove_image_ids'] as $imageId) {
                $imageController->destroyImage($imageId);
            }
        }

        // Thêm hình ảnh mới nếu có
        if ($request->hasFile('feedback_images')) {
            $imageController->storeImages(
                'feedback',
                $feedback->id,
                $request->file('feedback_images'),
                'feedbacks',
                'Feedback'
            );
        }

        return back()->with('success', 'Review has been updated!');
    }

    public function destroy(Feedback $feedback)
    {
        // Kiểm tra quyền sở hữu thông qua order_detail
        $orderDetail = $feedback->orderDetail()->with('order')->first();
        if (!$orderDetail || $orderDetail->order->user_id !== Auth::id()) {
            abort(403);
        }

        // Xóa tất cả hình ảnh của feedback trước khi xóa feedback
        $imageController = new ImageController();
        $imageController->destroyImages('feedback', $feedback->id);

        $feedback->delete();

        return back()->with('success', 'Review has been deleted!');
    }

    public function destroyImage(DeleteFeedbackImageRequest $request)
    {
        // Lấy validated data từ request
        $validatedData = $request->validated();

        // Kiểm tra quyền sở hữu của hình ảnh thông qua feedback
        $image = Image::find($validatedData['image_id']);
        if (!$image || $image->image_type !== 'feedback') {
            return back()->withErrors(['message' => 'Image not found.']);
        }

        $feedback = Feedback::find($image->path_id);
        if (!$feedback) {
            return back()->withErrors(['message' => 'Feedback not found.']);
        }

        $orderDetail = $feedback->orderDetail()->with('order')->first();
        if (!$orderDetail || $orderDetail->order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Xóa hình ảnh
        $imageController = new ImageController();
        $imageController->destroyImage($validatedData['image_id']);

        return back()->with('success', 'Image deleted successfully!');
    }

    private function getProductImage($productId)
    {
        // Tìm ảnh trong database
        $productImage = DB::table('images')
            ->where('path_id', $productId)
            ->where('image_type', 'product')
            ->first();
        
        if ($productImage) {
            return '/' . $productImage->image_path;
        }
        
        // Fallback: tìm ảnh đầu tiên trong thư mục
        $productImagePath = public_path('images/Products/' . $productId);
        if (is_dir($productImagePath)) {
            $files = array_diff(scandir($productImagePath), array('.', '..'));
            if (!empty($files)) {
                $firstImage = reset($files);
                return '/images/Products/' . $productId . '/' . $firstImage;
            }
        }
        
        // Default placeholder
        return '/images/placeholder.svg';
    }
}

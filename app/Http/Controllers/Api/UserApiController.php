<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ImageController;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

/**
 * @OA\Tag(
 *     name="Admin Users",
 *     description="API Endpoints for managing users in Admin Panel"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class UserApiController extends Controller
{
    protected $imageController;

    public function __construct(ImageController $imageController)
    {
        $this->imageController = $imageController;
    }

    /**
     * @OA\Get(
     *     path="/api/admin/users",
     *     summary="List users",
     *     tags={"Admin Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="search", in="query", description="Search by username, email, fname, lname", @OA\Schema(type="string")),
     *     @OA\Parameter(name="role", in="query", description="Filter by role names (comma separated)", @OA\Schema(type="string")),
     *     @OA\Parameter(name="sort", in="query", description="Sort field", @OA\Schema(type="string")),
     *     @OA\Parameter(name="direction", in="query", description="Sort direction (asc|desc)", @OA\Schema(type="string")),
     *     @OA\Parameter(name="per_page", in="query", description="Items per page (5,10,25,50,100)", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="List of users")
     * )
     */
    public function index(Request $request)
    {
        $query = User::with('role');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('username', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('fname', 'like', '%' . $request->search . '%')
                  ->orWhere('lname', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('role')) {
            $roleNames = explode(',', $request->role);
            $query->whereHas('role', function ($q) use ($roleNames) {
                $q->whereIn('name', $roleNames);
            });
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $allowedSortFields = ['id', 'username', 'email', 'fname', 'lname', 'created_at'];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }

        $perPage = in_array($request->get('per_page', 10), [5, 10, 25, 50, 100]) ? $request->get('per_page') : 10;

        $users = $query->paginate($perPage);

        return response()->json($users);
    }

    /**
     * @OA\Post(
     *     path="/api/admin/users",
     *     summary="Create user",
     *     tags={"Admin Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username","fname","lname","email","password","role_id"},
     *             @OA\Property(property="username", type="string"),
     *             @OA\Property(property="fname", type="string"),
     *             @OA\Property(property="lname", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="role_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=201, description="User created successfully")
     * )
     */
    public function store(StoreUserRequest $request)
    {
        $userData = $request->only(['username', 'fname', 'lname', 'email', 'role_id']);
        $userData['password'] = Hash::make($request->password);

        $user = User::create($userData);

        if ($request->hasFile('avatar')) {
            $this->imageController->storeImages('user', $user->id, [$request->file('avatar')], 'users', $user->username);
        }

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/users/{id}",
     *     summary="Get user detail",
     *     tags={"Admin Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User detail")
     * )
     */
    public function show(User $user)
    {
        $user->load(['role', 'images']);
        return response()->json($user);
    }

    /**
     * @OA\Put(
     *     path="/api/admin/users/{id}",
     *     summary="Update user",
     *     tags={"Admin Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="username", type="string"),
     *             @OA\Property(property="fname", type="string"),
     *             @OA\Property(property="lname", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="role_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(response=200, description="User updated successfully")
     * )
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $userData = $request->only(['username', 'fname', 'lname', 'email', 'role_id']);

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        if ($request->hasFile('avatar')) {
            $this->imageController->storeImages('user', $user->id, [$request->file('avatar')], 'users', $user->username);
        }

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/users/{id}",
     *     summary="Delete user",
     *     tags={"Admin Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User deleted successfully")
     * )
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'You cannot delete your own account.'], 403);
        }

        $this->imageController->destroyImages('user', $user->id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/users/{userId}/images/{imageId}",
     *     summary="Delete user image",
     *     tags={"Admin Users"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="userId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="imageId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Image deleted successfully")
     * )
     */
    public function destroyUserImage($userId, $imageId)
    {
        return $this->imageController->destroyImage($imageId);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ImageController;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $imageController;

    public function __construct(ImageController $imageController)
    {
        $this->imageController = $imageController;
    }
    
    // User CRUD Methods
    public function index(Request $request)
    {
        $user = User::with('role')->find(auth()->id());
        
        // Lấy tất cả roles để hiển thị trong filter dropdown
        $roles = Role::orderBy('name')->get();
        
        $query = User::with('role');
        
        // Tìm kiếm theo username hoặc email
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('username', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('fname', 'like', '%' . $request->search . '%')
                  ->orWhere('lname', 'like', '%' . $request->search . '%');
            });
        }
        
        // Lọc theo roles
        if ($request->has('role') && $request->role) {
            $roleNames = explode(',', $request->role);
            $query->whereHas('role', function ($q) use ($roleNames) {
                $q->whereIn('name', $roleNames);
            });
        }

        // Xử lý sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        // Validate sort fields
        $allowedSortFields = ['id', 'username', 'email', 'fname', 'lname', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->latest();
        }
        
        // Xử lý phân trang
        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;
        
        $users = $query->paginate($perPage)->appends($request->query());

        return Inertia::render('Admin/Users/Index', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'users' => [
                'data' => collect($users->items())->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'email' => $user->email,
                        'fname' => $user->fname,
                        'lname' => $user->lname,
                        'full_name' => $user->fname . ' ' . $user->lname,
                        'role' => $user->role ? $user->role->name : 'User',
                        'avatar' => $user->images()->where('image_type', 'user')->first()
                            ? asset($user->images()->where('image_type', 'user')->first()->image_path)
                            : null,
                        'created_at' => $user->created_at->format('Y-m-d')
                    ];
                }),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
                'path' => $users->path(),
            ],
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
                'sort' => $request->sort,
                'direction' => $request->direction,
            ],
            'roles' => $roles
        ]);
    }

    public function create()
    {
        $user = User::with('role')->find(auth()->id());
        $roles = Role::all();

        return Inertia::render('Admin/Users/Create', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role' => $user->role ? $user->role->name : 'User'
                ]
            ],
            'roles' => $roles
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $userData = $request->only(['username', 'fname', 'lname', 'email', 'role_id']);
        $userData['password'] = Hash::make($request->password);
        
        $user = User::create($userData);

        // Handle avatar upload using ImageController generic method
        if ($request->hasFile('avatar')) {
            $this->imageController->storeImages('user', $user->id, [$request->file('avatar')], 'users', $user->username);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        $authUser = User::with('role')->find(auth()->id());
        $user->load(['role', 'images']);

        return Inertia::render('Admin/Users/Show', [
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'username' => $authUser->username,
                    'email' => $authUser->email,
                    'role' => $authUser->role ? $authUser->role->name : 'User'
                ]
            ],
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'fname' => $user->fname,
                'lname' => $user->lname,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'role' => $user->role,
                'images' => $user->images,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    public function edit(User $user)
    {
        $authUser = User::with('role')->find(auth()->id());
        $roles = Role::all();
        $user->load(['role', 'images']);

        return Inertia::render('Admin/Users/Edit', [
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'username' => $authUser->username,
                    'email' => $authUser->email,
                    'role' => $authUser->role ? $authUser->role->name : 'User'
                ]
            ],
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'fname' => $user->fname,
                'lname' => $user->lname,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'role' => $user->role,
                'images' => $user->images,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'roles' => $roles
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $userData = $request->only(['username', 'fname', 'lname', 'email', 'role_id']);
        
        // Only update password if provided
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }
        
        $user->update($userData);

        // Handle new avatar upload using ImageController generic method
        if ($request->hasFile('avatar')) {
            $this->imageController->storeImages('user', $user->id, [$request->file('avatar')], 'users', $user->username);
        }

        return redirect()->route('admin.users.show', $user->id)
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        // Prevent deleting current user
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        // Delete all user images using ImageController
        $this->imageController->destroyImages('user', $user->id);
        
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function destroyUserImage($userId, $imageId)
    {
        return $this->imageController->destroyImage($imageId);
    }
}

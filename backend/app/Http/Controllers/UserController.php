<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function users(Request $request)
    {
        $users = User::query()
            ->when($request->search, fn($q) => $q->where(fn($w) => $w
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
            ))
            ->when(in_array($request->sortBy, ['id','name','email','created_at']), 
                fn($q) => $q->orderBy($request->sortBy, $request->sortOrder ?? 'asc')
            )
            ->paginate(8);

        return response()->json([
            'status' => true,
            'data' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ]
        ]);
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;


class ContactController extends Controller
{

    public function index(Request $request)
    {
        $contacts = Contact::query()
            ->when($request->search, fn($q) => $q->where(fn($w) => $w
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
                ->orWhere('subject', 'like', "%{$request->search}%")
            ))
            ->when(in_array($request->sortBy, ['id','name','email','subject','created_at']), 
                fn($q) => $q->orderBy($request->sortBy, $request->sortOrder ?? 'desc')
            )
            ->latest()
            ->paginate(10);

        return response()->json($contacts);
    }
    
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'number'  => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $contact
        ]);
    }


    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function changeLang(Request $request)
    {
        $locale = $request->input('lang');
        if (in_array($locale, config('app.locales'))) {
            Session::put('lang', $locale);
        }
        return redirect()->back();
    }
}

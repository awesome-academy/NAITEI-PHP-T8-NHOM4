<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function changeLang($lang)
    {
        // validate against allowed locales
        if (in_array($lang, config('app.locales', ['en', 'vi']))) {
            Session::put('lang', $lang);
        }

        return redirect()->back();
    }
}


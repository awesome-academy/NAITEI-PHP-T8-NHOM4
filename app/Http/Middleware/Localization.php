<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\App;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedLocales = config('app.locales', ['en']);
	    $sessionLocale = Session::get('lang');
	    if ($sessionLocale && in_array($sessionLocale, $allowedLocales)) {
	        App::setLocale($sessionLocale);
        }
        return $next($request);
    }
}

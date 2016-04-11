<?php namespace App\Http\Middleware;

use Closure;
use JWTAuth;

class IsAdmin
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $user = JWTAuth::parseToken()->toUser();
        if ($user->role_id === 1) {
            return $next($request);
        }
        return response()->json("permision denied", 403);
    }

}

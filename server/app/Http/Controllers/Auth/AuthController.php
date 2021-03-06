<?php namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Auth;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Handle a login request to the application.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function postLogin(Request $request)
    {
        try
        {
            $this->validate($request, [
                'email' => 'required|email|max:255', 'password' => 'required',
            ]);

        } catch (HttpResponseException $e) {
            return response()->json([
                'error' => [
                    'message' => $request->all(),
                    'status_code' => IlluminateResponse::HTTP_BAD_REQUEST,
                ]],
                IlluminateResponse::HTTP_BAD_REQUEST,
                $headers = []
            );
        }

        $credentials = $this->getCredentials($request);
        try
        {
            // attempt to verify the credentials and create a token for the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['message' => $request->all(), 'error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        // all good so return the token
        $user = User::where('email', $request->only('email'))->first();
        $userrole = $user->role->title;
        $username = $user->username;
        $token = JWTAuth::fromUser($user);
        return response()->json(['token' => $token]);
    }

    public function refreshToken(Request $request)
    {
        $token = JWTAuth::getToken();
        $newToken = JWTAuth::refresh($token);
        return response()->json(['token' => $newToken]);
    }

    public function testlogin(Request $request)
    {
        $credentials = $this->getCredentials($request);
        if (Auth::attempt($credentials)) {
            // 认证通过...
            //$user = Auth::user();
            $user = $request->user();
            return response()->json(['username' => $user->username]);
            //return response()->json(['token' => $token]);
        }
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array
     */
    protected function getCredentials(Request $request)
    {
        return $request->only('email', 'password');
    }
}

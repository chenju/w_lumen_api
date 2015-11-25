<?php namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller {
	/**
	 * Handle a login request to the application.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return \Illuminate\Http\Response
	 */
	public function postLogin(Request $request) {

		/*$v = Validator::make($request, [
			'email' => 'required|unique|max:255',
			'password' => 'required',
			]);

			if ($v->fails()) {
			return response()->json([
			'error' => [
			'message' => $request->all(),
			'status_code' => IlluminateResponse::HTTP_BAD_REQUEST,
			]],
			IlluminateResponse::HTTP_BAD_REQUEST,
			$headers = ['Access-Control-Allow-Origin' => 'http://www.develope.com']
			);
		*/

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
		//$v = $request->$input;
		//$v = json_decode($v, true);
		try
		{
			// attempt to verify the credentials and create a token for the user
			if (!$token = JWTAuth::attempt($credentials)) {
				return response()->json(['error' => 'invalid_credentials'], 401);
			}
		} catch (JWTException $e) {
			// something went wrong whilst attempting to encode the token
			return response()->json(['error' => 'could_not_create_token'], 500);
		}
		// all good so return the token
		return response()->json(['token' => compact('token'), 'name' => 'darkwing', 'userRole' => 'admin']);
	}
	/**
	 * Get the needed authorization credentials from the request.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @return array
	 */
	protected function getCredentials(Request $request) {
		return $request->only('email', 'password');
	}
}
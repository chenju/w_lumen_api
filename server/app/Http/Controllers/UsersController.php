<?php namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use JWTAuth;
use League\Fractal\Manager;

class UsersController extends ApiController
{

    protected $current;
    public function __construct()
    {
        $token = JWTAuth::getToken();
        $this->current = JWTAuth::toUser($token);
    }

    protected function create_unique()
    {
        $data = $_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']
        . time() . rand();
        return sha1($data);
        //return md5(time().$data);
        //return $data;
    }

    public function getUserList(Manager $fractal) //, UserTransformer $UserTransformer)

    {
        //$data = User::where('email', $this->current->email)->first();
        //if ($data->role == 'admin') {
        $users = User::all();
        $user = User::where('email', $this->current->email)->first();
        //return $user->toArray();
        //$item = new Item($user);
        //$data = $fractal->createData($item)->toArray();
        //return $data;
        //return (new $UserTransformer)->transform($user);
        //}
    }

    public function getUser($id)
    {

        $data = User::where('email', $this->current->email)->first();
        $user = array('name' => $data->name, 'email' => $data->email, 'id' => $data->id,
        );
        return $this->respondWithCORS($user);
    }

    public function store(Request $request)
    {

    }

    public function update($userId, Request $request)
    {

        $data = User::where('email', $this->current->email)->first();
        if ($data->role == 'admin' or $data->id == $userId) {

            $user = User::find($userId);
            $user->name = $request->name;
            if (!$request->password == '') {$user->password = $request->password;}
            if ($data->role == 'admin') {$user->role = $request->role;}
            $user->save();
            return 'update';
        }

    }

    public function destroy($issueId)
    {

    }

}

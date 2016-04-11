<?php namespace App\Http\Controllers;

use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use App\transformers\UserTransformer;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response as IlluminateResponse;
use JWTAuth;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use League\Fractal\Serializer\ArraySerializer;

class UsersController extends ApiController
{

    protected $current;
    protected $statusCode = IlluminateResponse::HTTP_OK;
    protected $user;
    protected $user_gestion;
    protected $role_gestion;

    public function __construct(UserRepository $user_gestion, RoleRepository $role_gestion)
    {

        $this->role_gestion = $role_gestion;
        $this->user_gestion = $user_gestion;

        $this->middleware('admin', ['except' => ['show']]);

    }

    public function getStatusCode()
    {
        return $this->statusCode;
    }

    public function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function respond($data, $headers = [])
    {
        return response()->json($data, $this->getStatusCode(), $headers);
    }

    protected function create_unique()
    {
        $data = $_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']
        . time() . rand();
        return sha1($data);
        //return md5(time().$data);
        //return $data;
    }

    public function index(Manager $fractal, UserTransformer $UserTransformer)
    {
        return $this->indexSort('total', $fractal, $UserTransformer);
    }

    public function indexSort($role, $fractal, $UserTransformer)
    {

        //$counts = $this->user_gestion->counts();
        $users = $this->user_gestion->index(4, $role);
        $fractal->setSerializer(new ArraySerializer());
        $collection = new Collection($users, $UserTransformer);
        $data = $fractal->createData($collection)->toArray();
        //$links = $users->render();
        //$roles = $this->role_gestion->all();
        return $this->respond($data['data']);

    }

    public function getUserList(Manager $fractal, UserTransformer $UserTransformer)
    {
        if ($this->current->role_id == 1) {
            $users = User::all();
            $collection = new Collection($users, $UserTransformer);
            $data = $fractal->createData($collection)->toArray();
            $counts = $this->user_gestion->counts();
            //return $this->respond($counts);
            return $this->respond($data['data']);
        } else {
            $this->setStatusCode(IlluminateResponse::HTTP_FORBIDDEN);
            return $this->respond("pemission_");
        }
    }

    public function show($userId, Manager $fractal, UserTransformer $UserTransformer, User $user)
    {
        $ccuser = JWTAuth::parseToken()->toUser();
        if ($ccuser->role->slug === "admin" || $ccuser->id === intval($userId)) {

            $fractal->setSerializer(new ArraySerializer());
            $cuser = $user->findOrFail($userId);
            $item = new Item($cuser, $UserTransformer);
            $data = $fractal->createData($item)->toArray();

        } else {
            $this->setStatusCode(IlluminateResponse::HTTP_FORBIDDEN);
            $data = 'permision_denied';
        }

        //return $this->respond($data['data']);
        return $this->respond($data);
    }

    public function store(Request $request)
    {

        $this->user->name = $request->get('name');
        $this->user->name = $request->get('email');
        $this->user->name = $request->get('password');
        //$user->save()

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

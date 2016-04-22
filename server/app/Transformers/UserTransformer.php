<?php namespace App\Transformers;

use App\User;
use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{

    protected $defaultIncludes = [
        //'role',
    ];

    public function transform(User $user)
    {
        return [
            'id' => $user->id,
            'name' => $user->username,
            'email' => $user->email,
            'role_id'=>$user->role_id,
            //'password'=>$user->password
        ];
    }
    public function includeRole(User $user)
    {
        $role = $user->role;
        $data = $this->item($role, new RoleTransformer);
        return $data;
    }
}

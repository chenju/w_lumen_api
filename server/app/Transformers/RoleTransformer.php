<?php namespace App\Transformers;

use App\models\Role;
use League\Fractal\TransformerAbstract;

class RoleTransformer extends TransformerAbstract
{
    public function transform(Role $role)
    {
        return
            [$role->title];
    }
}

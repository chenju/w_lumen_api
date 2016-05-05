<?php
namespace App\Filters;

use Czim\Filter\FilterData;

class UserData extends FilterData
{
    protected $rules = [
        'name' => 'string|max:255',
        'users' => 'array|each:exists,users,id',
    ];

    protected $defaults = [
        'name' => null,
        'users' => [],
    ];
}

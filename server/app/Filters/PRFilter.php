<?php
namespace App\Filters;

class PRFilter
{
    //protected $table = 'users';

    //protected $filterDataClass = UserData::class;

    /*protected function strategies()
    {
    return [
    // Loosy string match
    'name' => new ParameterFilters\SimpleString($this->table),
    // Exact string match
    //'ean'      => new ParameterFilters\SimpleString($this->table, null, true),
    // simple integer column id matches
    'users' => new ParameterFilters\SimpleInteger($this->table, 'id'),
    //'brands'   => new ParameterFilters\SimpleInteger($this->table, 'brand_id'),
    ];

    // Note that 'categories' is not present here,
    // so it will have to be handled in the applyParameter method.
    }

    /**
     * @param string          $name
     * @param mixed           $value
     * @param EloquentBuilder $query
     */
    /*protected function applyParameter($name, $value, $query)
{
/*switch ($name) {

// Categories requires a special implementation, it needs to join a pivot table.
// This could have also been implemented as a custom ParameterFilter class,
// but adding it to the applyParameter method works too.

case 'categories':

// The addJoin method will let the Filter add the join statements to the
// query builder when all filter parameters are applied.
// If you were to call addJoin with the same ('category_product') key name
// again, it would only be added to the query once.

$this->addJoin('category_product', [
'category_product',
'category_product.product_id', '=', 'products.id',
]);

$query->whereIn('category_product.product_category_id', $value)
->distinct(); // Might have multiple matches per product
return;
}

// fallback to default: throws exception for unhandled filter parameter
parent::applyParameter($name, $value, $query);
}*/

}

<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
 */
define('ROUTE_BASE', '/20150927/lumen/public');

$app->get('/', function () use ($app) {
	return $app->welcome();
});

$app->get(ROUTE_BASE . '/test', function () use ($app) {
	return $app->welcome();
});

$app->group(['prefix' => 'issues', 'middleware' => 'jwt.auth'], function ($app) {
	//$app->post('/', 'App\Http\Controllers\ProjectsController@store');
	//$app->put('/{projectId}', 'App\Http\Controllers\ProjectsController@update');
	//$app->delete('/{projectId}', 'App\Http\Controllers\ProjectsController@destroy');
	$app->get('/', 'App\Http\Controllers\IssuesController@index');
});
// index, show这些则不需要
$app->group(['prefix' => 'projects'], function ($app) {

	//$app->get('/{projectId}', 'App\Http\Controllers\ProjectsController@show');
});
//$app->get('test', 'App\Http\Controllers\IssuesController@index');
$app->post('auth/login', 'App\Http\Controllers\Auth\AuthController@postLogin');
/*
$app->group(['middleware' => 'cors'], function ($app) {
$app->get('auth/login', 'App\Http\Controllers\Auth\AuthController@postLogin');
});
 */
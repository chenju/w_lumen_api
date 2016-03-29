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

/*$app->group(['prefix' => 'posts', 'middleware' => 'jwt.auth'], function ($app) {
//$app->options('/', 'App\Http\Controllers\IssuesController@getRss');
$app->get('/', 'App\Http\Controllers\IssuesController@getRss');
});*/

$app->group(['prefix' => 'posts', 'middleware' => ['cors', 'jwt.auth']], function ($app) {
	$app->get('/', 'App\Http\Controllers\IssuesController@getRss');
});

$app->group(['prefix' => 'issues', 'middleware' => 'jwt.auth'], function ($app) {
	$app->post('/', 'App\Http\Controllers\IssuesController@store');
	$app->put('/{issueId}', 'App\Http\Controllers\IssuesController@update');
	$app->delete('/{issueId}', 'App\Http\Controllers\IssuesController@destroy');
	$app->get('/', 'App\Http\Controllers\IssuesController@getFileList');
	$app->get('/{issueId}', 'App\Http\Controllers\IssuesController@viewFile');
});

$app->group(['prefix' => 'users', 'middleware' => ['cors', 'jwt.auth']], function ($app) {
	$app->get('/', 'App\Http\Controllers\UsersController@getUserList');
	$app->get('/{userId}', 'App\Http\Controllers\UsersController@show');
	//$app->put('/{userId}', 'App\Http\Controllers\UsersController@update');
	//$app->get('/list', 'App\Http\Controllers\UsersController@getUserList');

});
// index, show这些则不需要
//$app->group(['prefix' => 'users'], function ($app) {
//$app->get('/', 'App\Http\Controllers\UsersController@getUserList');
//$app->get('/{projectId}', 'App\Http\Controllers\ProjectsController@show');
//});
//$app->get('test', 'App\Http\Controllers\IssuesController@index');
//$app->post('auth/login', ['middleware' => 'cors'], 'App\Http\Controllers\Auth\AuthController@postLogin');

$app->group(['middleware' => 'cors'], function ($app) {

	$app->post('auth/login', 'App\Http\Controllers\Auth\AuthController@postLogin');
});

$app->group(['middleware' => ['cors', 'jwt.refresh']], function ($app) {
	$app->post('auth/refresh', [
		'as' => 'auth.refresh',
		'uses' => 'App\Http\Controllers\Auth\AuthController@refreshToken',
	]);

	//$app->get('auth/refresh', 'App\Http\Controllers\Auth\AuthController@refreshToken');
});

//$app->get('/auth/refresh', 'App\Http\Controllers\Auth\AuthController@refreshToken');

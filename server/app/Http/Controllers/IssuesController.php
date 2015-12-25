<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use JWTAuth;
use League\Fractal\Manager;

class IssuesController extends ApiController {

	protected $issues;
	function __construct() {

		$exists = Storage::disk('local')->exists('data/main.json');
		//var_dump($exists);
		if ($exists) {

			$issues = Storage::get('data/main.json');
			$this->data = $issues;

		} else {

			$this->data = 'none';

		}
	}

	protected function create_unique() {
		$data = $_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']
		. time() . rand();
		return sha1($data);
		//return md5(time().$data);
		//return $data;
	}

	public function getFileList(Manager $fractal) {

		$collection = json_decode($this->data);
		$data = $collection->issueList;
		//$data = $fractal->createData($collection)->toArray();
		return $this->respondWithCORS($data);
	}

	public function viewFile($issueId) {

		$url = 'data/' . $issueId . '/data.json';
		$issue = Storage::disk('local')->get($url);
		$data = json_decode($issue);
		return $this->respondWithCORS($data);

	}

	public function store(Request $request) {

		$token = JWTAuth::getToken();
		$user = JWTAuth::toUser($token);
		$title = $request->get('title');
		$id = $this->create_unique();

		if (!($this->data == 'none')) {
			$collection = json_decode($this->data);
		} else {
			//$collection = {'issueList' => array()};
			return 'aaa';
		}
		//$data = $collection->issueList;
		$item = array('id' => $id, 'creator' => $user->name, 'updaeTime' => date("Y/m/d h:i:s", time()), 'issueTitle' => $title);
		$data = $collection->issueList;
		//return $data;
		array_push($collection->issueList, $item);
		Storage::put('data/main.json', json_encode($collection));

		Storage::makeDirectory('data/' . $id);

		$url = 'data/' . $id . '/data.json';
		$data = $request->all();
		$data = json_decode(json_encode($data));
		$data->id = $id;
		if (!Storage::exists($url)) {
			Storage::put($url, json_encode($data));
		}
	}

	public function update($issueId, Request $request) {

		$url = 'data/' . $issueId . '/data.json';
		$data = $request->all();

		$title = $request->get('title');
		$token = JWTAuth::getToken();
		$user = JWTAuth::toUser($token);
		if (Storage::exists($url)) {
			Storage::put($url, json_encode($data));
		}
		$collection = json_decode($this->data);
		$data = $collection->issueList;
		while (list($key, $val) = each($data)) {

			if ($val->id == $issueId) {
				$val->creator = $user->name;
				$val->updaeTime = date("Y/m/d h:i:s", time());
				$val->issueTitle = $title;
				$collection->issueList = $data;
				Storage::put('data/main.json', json_encode($collection));
				return 'updated';
			}
			//if (in_array("1", $val)) {
			//return 'find';
			//}
		}
		//$item = array('id' => $issueId, 'creator' => $user->name, 'updaeTime' => date("Y/m/d h:i:s", time()), 'issueTitle' => $title);
		//array_push($data, $item);
		//$collection->issueList = $data;
		//Storage::put('data/main.json', json_encode($collection));
		//Storage::put($url, json_decode($url));
		//return $this->respondOk('Project was updated');
		//return $data;
		//return $request;

	}

	public function destroy($issueId) {
		$url = 'data/' . $issueId . '/data.json';
		if (Storage::exists($url)) {
			Storage::delete($url);
		}
		return $this->respondOk('Project was deleted');
	}

}
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

			$this->data = 'NO ISSUES';

		}
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

	public function store($issueId, Request $request) {
		$url = 'data/' . $issueId . '/data.json';
		$data = $request->all();
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
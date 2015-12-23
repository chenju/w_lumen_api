<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

	public function store(Request $request) {
		echo $request;
	}

	public function update($issueId, Request $request) {

		$url = 'data/' . $issueId . '/data.json';
		$data = $request->all();
		if (Storage::exists($url)) {
			Storage::put($url, json_encode($data));
		}
		//Storage::put($url, json_decode($url));
		return $this->respondOk('Project was updated');
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
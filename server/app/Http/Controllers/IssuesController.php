<?php namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

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

	public function index() {

		$data = $this->data;
		return $data;

	}

	public function getFileList() {

		$files = Storage::files('/');
		return response()->json($files);

	}

	public function viewFile() {
		/*$name = 'main.json';
	return response()->make(Storage::disk('local')->get($name), 200, [
	'Content-Type' => Storage::disk('local')->mimeType($name),
	'Content-Disposition' => 'inline; ' . $name,
	]);*/

	}

}
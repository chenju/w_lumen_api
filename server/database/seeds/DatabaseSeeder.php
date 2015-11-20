<?php
use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {

		//
		Model::unguard();

		$this->call('UserTableSeeder');

		Model::reguard();
	}
}

class UserTableSeeder extends Seeder {

	public function run() {
		//DB::table('users')->delete();

		User::create(['email' => 'darkw1ng@gmail.com',
			'name' => 'darkw1ng',
			'password' => Hash::make('secret'),
		]);
	}
}
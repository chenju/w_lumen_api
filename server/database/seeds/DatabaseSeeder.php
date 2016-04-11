<?php
use App\Models\Role;
use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        //
        Model::unguard();

        $this->call('UserTableSeeder');

        Model::reguard();
    }
}

class UserTableSeeder extends Seeder
{

    public function run()
    {
        //DB::table('users')->delete();
        //DB::table('roles')->delete();

        Role::create([
            'title' => 'Administrator',
            'slug' => 'admin',
        ]);
        Role::create([
            'title' => 'Redactor',
            'slug' => 'redac',
        ]);
        Role::create([
            'title' => 'User',
            'slug' => 'user',
        ]);

        User::create([
            'email' => 'darkw1ng@gmail.com',
            'username' => 'darkw1ng',
            'password' => Hash::make('secret'),
            'role_id' => 1,
            'confirmed' => true,
        ]);

        User::create([
            'username' => 'GreatRedactor',
            'email' => 'redac@la.fr',
            'password' => bcrypt('redac'),
            'seen' => true,
            'role_id' => 2,
            'valid' => true,
            'confirmed' => true,
        ]);

        User::create([
            'username' => 'Slacker',
            'email' => 'slacker@la.fr',
            'password' => bcrypt('slacker'),
            'role_id' => 3,
            'confirmed' => true,
        ]);
    }
}

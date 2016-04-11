<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsersTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('users')) {
            Schema::drop('users'); //
        }

        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('username', 30)->unique();
            $table->string('email')->unique();
            $table->string('password', 60);
            $table->integer('role_id')->unsigned();
            $table->boolean('seen')->default(false);
            $table->boolean('valid')->default(false);
            $table->boolean('confirmed')->default(false);
            $table->string('confirmation_code')->nullable();
            $table->timestamps();
            $table->rememberToken();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }

}

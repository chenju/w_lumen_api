<?php
require("toro.php");
require("ExpiredException.php");
require("SignatureInvalidException.php");
require("BeforeValidException.php");
require("JWT.php");
use \Firebase\JWT\JWT;

//$jwt = JWT::encode($token, $key);
setcookie('auth', 'true', time()-3600, '/', '',0,0);


function get_issues(){
   $filename = "data.json";
   $json_string = file_get_contents($filename);
   $obj=json_decode($json_string,true); 
   if (!is_array($obj)) die('no successful'); 
   header("Content-type:text/html;charset=UTF-8");
   $issues = array();//定义新数组
   foreach($obj['issues'] as $a){
   $issues[]=array('id' => $a['id'], 
               'title' => $a['title'],
               'time' => $a['time']);
 }
   //echo iconv("GB2312","UTF-8",'中文');
//print_r($obj); 
//$titles = array_column($obj['issues'], 'title','id');
//$titles = ['abc','abd','abe'];
   return json_encode($issues);
};

function get_uplimages(){

   $filename = "uplimg.json";
   $json_string = file_get_contents($filename);
   $obj=json_decode($json_string,true); 
   if (!is_array($obj)) die('no successful'); 
   header("Content-type:text/html;charset=UTF-8");
   return $obj;
}

global $authorized;
$authorized= false;
function get_issue($id){
   $filename = "data.json";
   $json_string = file_get_contents($filename);
   $obj=json_decode($json_string,true); 
   if (!is_array($obj)) die('no successful'); 
   header("Content-type:text/html;charset=UTF-8");
   $issue = array();
   foreach($obj['issues'] as $a){
   	 if($a['id']==$id){
   	 	$issue = $a;
   	 };
   }
   //global $authorized;
   //setcookie ('auth','');
   //setCookie("auth",'true');
   //setcookie('auth', 'true', time()+3600, '/', '',0,0);
   $headers = apache_request_headers();

   /*foreach ($headers as $header => $value) {
    echo "$header: $value <br />\n";
   }*/
   //return json_encode($issue);
   return ($headers['Authorization']=="true")?json_encode($issue):header('HTTP/1.0 401 Unauthorized');
   //return $auth? $_SERVER:header('HTTP/1.0 401 Unauthorized');
}


class IssuesHandler {
    function get() {
      //setcookie('auth', 'true', time()+3600, '/', '',0,0);
      echo get_issues();
    }
};

class IssueHandler {
    function get($id) {
      print_r (get_issue($id));
    }
};

class EditIssueHandler {
    function get($id) {
      print_r (get_issue($id));
    }
};

class LoginHandler {
    function post(){
      //print_r ('{"token":true}');

      $params = json_decode(file_get_contents('php://input'),true);
      $username =$params['username'];
      //global $authorized;
      //setCookie('auth','true',);
      //setcookie('auth', 'true', time()+3600, '/', '',0,0);
      //$authorized=true;
      $key = "example_key";
      $token = array(
        "iss" => $username,
        "aud" => "http://example.com",
        "iat" => 1356999524
      );
      $jwt = JWT::encode($token, $key);
      $decoded = JWT::decode($jwt, $key, array('HS256'));
      //$authorized=$_COOKIE['auth'];
   
      echo $username;
    }
};

class UpLoadImageHandler{
    function post(){
    $imglist=get_uplimages();
    if (!empty( $_FILES ) ) {
    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    //$uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    $uploadPath=  "..\img". DIRECTORY_SEPARATOR .$_FILES[ 'file' ][ 'name' ];
    move_uploaded_file( $tempPath, $uploadPath );
    $answer = array( 'answer' => $uploadPath );
    array_push($imglist,$uploadPath);
    file_put_contents('uplimg.json', json_encode($imglist));
    $json = json_encode( $answer );
    echo $json;
    } else {
        echo 'No files';
      }

  }
};

class uldilHandler {
    function get() {
      echo json_encode(get_uplimages());
    }
};

ToroHook::add("401", function() {
    echo "Not found";
});

Toro::serve(array(
    "/" => "IssuesHandler",
    "/issue/:alpha" => "IssueHandler",
    "/edit/:alpha" => "EditIssueHandler",
    "/rest/authentication"=>"LoginHandler",
    "/rest/uploadimage"=>"UpLoadImageHandler",
    "/rest/uploaded/imglist"=>"uldilHandler"
    //,"/article/:alpha/comment" => "CommentHandler"
));


?>
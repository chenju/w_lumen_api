<?php
require("toro.php");


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
   //return json_encode($issues);
}


class HelloHandler {
    function get() {
      echo "Hello, world";
    }
}
Toro::serve(array(
    "/" => "HelloHandler"
));


?>
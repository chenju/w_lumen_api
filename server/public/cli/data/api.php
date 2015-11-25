<?php
//$id= $_GET["ID"];
require("../lib/toro.php");
//if($id)
$filename = "data.json";
$json_string = file_get_contents($filename); 
//$json_string = utf8_encode($json_string); 
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
echo json_encode($issues);
?>
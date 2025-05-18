<?php
$conexion = new mysqli("localhost","root","","nutriapp");

if($conexion){
    //echo"Hay conexion";
}else{
    echo "no hay conexion";
}
?>
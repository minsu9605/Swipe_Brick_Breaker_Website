<?php
    session_start();
    include "conn_db.php";
    $con = mysqli_connect("localhost", "user1", "12345", "sample");
        
    if (isset($_SESSION["userid"])) {
        $id = $_SESSION["userid"];
        $point_sql = "select point from members where id='$id'";
        $result = mysqli_query($con, $point_sql);
        $row = mysqli_fetch_array($result);
        $point = $row['point'];
        
        $new_point = $_GET['score'];    //자바스크립트에서 ajax로 GET방식으로 score 송신
        
        if ((int)$new_point > $point){
            $regist_day = date("Y-m-d");
            $sql = "update members set point='$new_point', regist_day='$regist_day' where id='$id'";
            mysqli_query($con, $sql);
        }
        mysqli_close($con);
        echo "
                <script> 
                    location.href = 'swipe.php'; 
                </script>
            ";
    }
?>


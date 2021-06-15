<?php
    //session_start()
    if (isset($_SESSION["userid"])) {
        $userid = $_SESSION["userid"];
        $username = $_SESSION["username"];
        
        $rank = 1;
        $con = mysqli_connect("localhost", "user1", "12345", "sample");
        $sql = "select * from members where id='$userid'";
        $result = mysqli_query($con, $sql);
        $row = mysqli_fetch_array($result);
    
        $regist_day = $row["regist_day"];
        $point = $row["point"];
        
        mysqli_close($con);
        
        $logged = $username."(".$userid.")님의 최고점수 : ";
?>
        <ul>
            <li>
                <span><?=$logged?></span>
                <span><?=$point?></span>
            </li>
            <span style ="margin-top: 8px; margin-left: 15px;"><?="업데이트 날짜 : ".$regist_day?></span>
        </ul>
<?php 
    }

    else {
        echo "로그인 혹은 회원가입 후 점수를 볼 수 있습니다!!";
    }
        
?>

    
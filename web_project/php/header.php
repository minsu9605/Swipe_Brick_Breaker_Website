<?php
    session_start();
    if (isset($_SESSION["userid"])) $userid = $_SESSION["userid"];
    else $userid = "";
    if (isset($_SESSION["username"])) $username = $_SESSION["username"];
    else $username = "";
    if (isset($_SESSION["userlevel"])) $userlevel = $_SESSION["userlevel"];
    else $userlevel = "";
    //if (isset($_SESSION["userpoint"])) $userpoint = $_SESSION["userpoint"];
    //else $userpoint = "";
?>

        <div id="top">

            <a href="index.php">
              <img src="./img/top_logo.PNG" style="width:150px; height:90px; margin-bottom: 50px; margin-left:70px;"></a>

            <ul id="top_menu">
<?php
    if(!$userid) {
?>
                <li><a href="register.php">회원 가입</a> </li>
                <li> | </li>
                <li><a href="login.php">로그인</a></li>
<?php
    } else {
                $logged = $username."(".$userid.")님";
?>
                <li><?=$logged?> </li>
                <li> | </li>
                <li><a href="logout.php">로그아웃</a> </li>
                <li> | </li>
                <li><a href="member_modify_form.php">개인 정보 수정</a></li>
<?php
    }
?>
            </ul>
        </div>
        <div id="menu_bar">
            <ul>
                <li><a href="index.php">
                  <img src="./img/home_menu.PNG" style="width:45px; height:15px; margin-bottom: 4px; margin-left:100px;"> </a></li>
                <li><a href="swipe.php">
                  <img src="./img/game_menu.PNG" style="width:90px; height:25px; margin-left:10px;"></a></li>
                <li><a href="board_score.php"><img src="./img/score_menu.PNG" style="width:80px; height:25px; margin-left:10px;"></a></li>
                <li><a href="board_list.php">
                <img src="./img/board_menu.PNG" style="width:60px; height:21px; margin-bottom: 3px; margin-left:10px;"></a></li>
            </ul>
        </div>

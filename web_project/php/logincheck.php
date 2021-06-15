<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<?php
session_start ();
// 세션을 사용하기 위해 초기화

/* email, password가 post로 안넘어오면 exit*/
if(!isset($_POST['email']) || !isset($_POST['password'])) exit;

$id = $_POST['email'];
$pass = $_POST['password'];

/* email, password가 공백이면 exit*/
if ( ($id=='') || ($pass=='') ) {
  echo "<script>alert('아이디 또는 패스워드를 입력하여 주세요.');history.back();</script>";
  exit;
}

/* db연결 */
include "conn_db.php";

$sql = "select * from members where id='$id'";
$result = mysqli_query($con, $sql);

$num_match = mysqli_num_rows($result);

if(!$num_match)
{
 echo("
       <script>
         window.alert('등록되지 않은 아이디입니다!')
         history.go(-1)
       </script>
     ");
}
else
{
    $row = mysqli_fetch_array($result);
    $db_pass = $row["pass"];

    mysqli_close($con);

    if($pass != $db_pass)
    {

       echo("
          <script>
            window.alert('비밀번호가 틀립니다!')
            history.go(-1)
          </script>
       ");
       exit;
    }
    else
    {
        session_start();
        $_SESSION["userid"] = $row["id"];
        $_SESSION["username"] = $row["name"];
        $_SESSION["userlevel"] = $row["level"];
        $_SESSION["userpoint"] = $row["point"];

        echo("
          <script>
            location.href = 'index.php';
          </script>
        ");
    }
 }


?>

</html>

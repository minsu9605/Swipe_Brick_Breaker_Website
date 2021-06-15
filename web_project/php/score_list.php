<div id="main_img_bar">
    <img src="./img/main_img.PNG" style="height:230; margin-top: 10px;">
</div>
<div id="main_content">
    <div id="latest">
        <h4>최근 포인트 랭킹(7일)</h4>
        <ul>
<!-- 최근 랭킹 표시하기 -->
<?php
    date_default_timezone_set('Asia/Seoul');

    //$con = mysqli_connect("localhost", "user1", "12345", "sample");
    include "conn_db.php";

    $rank = 1;
    $sql = "select * from members order by point desc limit 5";
    $result = mysqli_query($con, $sql);

    if (!$result)
        echo "회원 DB 테이블(members)이 생성 전이거나 아직 가입된 회원이 없습니다!";
    else
    {
        $timenow = date("Y-m-d");
        $str_now = strtotime($timenow."-7 days");   //현재 날짜의 7일전 날짜

        while( $row = mysqli_fetch_array($result) )
        {
            if ($str_now <= strtotime($row["regist_day"])) {    //현재 날짜에서 7일전까지 업데이트 된 점수 표현
                $name  = $row["name"];
                $regist_day = $row["regist_day"];
                $point = $row["point"];
                $name = mb_substr($name, 0, 1)." * ".mb_substr($name, 2, 1);

?>
                <li>
                    <span><?=$rank?></span>
                    <span><?=$name?></span>
                    <span><?=$regist_day?></span>
                    <span><?=$point?></span>
                </li>
<?php
                $rank++;
            }
        }
    }

    //mysqli_close($con);
?>

            </div>
            <div id="point_rank">
                <h4>포인트 랭킹</h4>
                <ul>
<!-- 포인트 랭킹 표시하기 -->
<?php
    $rank = 1;
    $sql = "select * from members order by point desc limit 5";
    $result = mysqli_query($con, $sql);

    if (!$result)
        echo "회원 DB 테이블(members)이 생성 전이거나 아직 가입된 회원이 없습니다!";
    else
    {
        while( $row = mysqli_fetch_array($result) )
        {
            $name  = $row["name"];
            $regist_day = $row["regist_day"];
            $point = $row["point"];
            $name = mb_substr($name, 0, 1)." * ".mb_substr($name, 2, 1);
?>
                <li>
                    <span><?=$rank?></span>
                    <span><?=$name?></span>
                    <span><?=$regist_day?></span>
                    <span><?=$point?></span>
                </li>
<?php
            $rank++;
        }
    }

    mysqli_close($con);
?>
            </div>
</div>
                </ul>
            </div>
        </div>

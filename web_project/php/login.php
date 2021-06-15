<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>로그인</title>
<link rel="stylesheet" type="text/css" href="./css/index_set.css">
<link rel="stylesheet" type="text/css" href="./css/login.css">
<script type="text/javascript" src="./js/login.js"></script>
</head>
<body>
	<header>
    	<?php include "header.php";?>
    </header>
    <div id ="login_title">
      <h1>  <p align=center>로그인</p> </h1>
    </div>

    <div id = "login_box">
      <!-- 로그인 버튼 클릭시 post형식으로 logincheck.php로 넘긴다. id, pass 검사하는 php파일 -->
      <form method='post' action='logincheck.php'>
          <table align=center border=0 cellspacing=0 width=500 bordercolordark=white bordercolorlight=#999999> <!-- table생성 -->
              <tr> <!-- table 1행 생성 -->
                  <td class="topline" width=150>  <!-- table 1행1열 생성 -->
                      <p align=center>아이디 </p>
                  </td>
                  <td class="topline" width=200> <!-- table 1행2열 생성 -->
                      <input type="text" name="email" style="height:25px">
                  </td>

                  <td class="buttonline" rowspan="2" align=center>  <!-- table 3열 생성, 열2개를 합침 -->
                      <button type="submit" style="height:100px; width:130px">로그인</button>
                  </td>

              </tr>

              <tr> <!-- table 2행 생성 -->
                  <td class="botline" width=150>  <!-- table 2행1열 생성 -->
                      <p align=center>비밀번호</p>
                  </td>

                  <td class="botline" width=200> <!-- table 2행2열 생성 -->
                      <input type="password" name="password" style="height:25px">
                  </td>

              </tr>

              <tr><!-- table 3행 생성 -->
                 <td colspan=3 align=center height=50> <!-- table 3행 1,2,3열 합쳐서 ㅐㅇ성 -->
                    <!-- 회원가입 버튼클릭ㅣ register.php호출 -->
                    <a href="register.php" target="_self" style="text-decoration:none">회원가입 하시겠습니까?</p>
                 </td>
              </tr>
          </table>
      </form>
    </div>
	<footer>
    	<?php include "footer.php";?>
    </footer>
</body>
</html>

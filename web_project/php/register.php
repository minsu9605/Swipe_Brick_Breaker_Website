<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>회원가입</title>
<link rel="stylesheet" type="text/css" href="./css/index_set.css">
<link rel="stylesheet" type="text/css" href="./css/member.css">
<script>
   function check_input()
   {
      if (!document.register.id.value) {
          alert("아이디를 입력하세요!");
          document.register.id.focus();
          return;
      }

      if (!document.register.pass.value) {
          alert("비밀번호를 입력하세요!");
          document.register.pass.focus();
          return;
      }

      if (!document.register.pass_confirm.value) {
          alert("비밀번호확인을 입력하세요!");
          document.register.pass_confirm.focus();
          return;
      }

      if (!document.register.name.value) {
          alert("이름을 입력하세요!");
          document.register.name.focus();
          return;
      }

      if (!document.register.email1.value) {
          alert("이메일 주소를 입력하세요!");
          document.register.email1.focus();
          return;
      }

      if (!document.register.email2.value) {
          alert("이메일 주소를 입력하세요!");
          document.register.email2.focus();
          return;
      }

      if (document.register.pass.value !=
            document.register.pass_confirm.value) {
          alert("비밀번호가 일치하지 않습니다.\n다시 입력해 주세요!");
          document.register.pass.focus();
          document.register.pass.select();
          return;
      }

      document.register.submit();
   }

   function reset_form() {
      document.register.id.value = "";
      document.register.pass.value = "";
      document.register.pass_confirm.value = "";
      document.register.name.value = "";
      document.register.email1.value = "";
      document.register.email2.value = "";
      document.register.id.focus();
      return;
   }

   function check_id() {
     window.open("member_check_id.php?id=" + document.register.id.value,
         "IDcheck", "left=700,top=300,width=350,height=200,scrollbars=no,resizable=yes");
   }
</script>
</head>
<body>
	<header>
    	<?php include "header.php";?>
    </header>
	<section>
		<div id="main_img_bar">
            <img src="./img/main_img.png">
        </div>
        <div id="main_content">
      		<div id="join_box">
          	<form  name="register" method="post" action="member_insert.php">
			    <h2>회원 가입</h2>
    		    	<div class="form id">
				        <div class="col1">아이디</div>
				        <div class="col2">
							<input type="text" name="id">

				       </div>
			       	</div>

                <div class = "jungcheck_box">
                <a href="#"><input type="button" value="중복확인" onclick="check_id()"></a>
                </div>

			       	<div class="clear"></div>

			       	<div class="form">
				        <div class="col1">비밀번호</div>
				        <div class="col2">
							<input type="password" name="pass">
				        </div>
			       	</div>
			       	<div class="clear"></div>
			       	<div class="form">
				        <div class="col1">비밀번호 확인</div>
				        <div class="col2">
							<input type="password" name="pass_confirm">
				        </div>
			       	</div>
			       	<div class="clear"></div>
			       	<div class="form">
				        <div class="col1">이름</div>
				        <div class="col2">
							<input type="text" name="name">
				        </div>
			       	</div>
			       	<div class="clear"></div>
			       	<div class="form email">
				        <div class="col1">이메일</div>
				        <div class="col2">
							<input type="text" name="email1">@<input type="text" name="email2">
				        </div>
			       	</div>
			       	<div class="clear"></div>
			       	<div class="bottom_line"> </div>
			       	<div class="buttons">
	                	<img style="cursor:pointer" src="./img/button_regist.gif" height="25px" onclick="check_input()">&nbsp;
                  		<img id="reset_button" style="cursor:pointer" src="./img/button_reset.gif"
                  			onclick="reset_form()">
	           		</div>
           	</form>
        	</div> <!-- join_box -->
        </div> <!-- main_content -->
	</section>
	<footer>
    	<?php include "footer.php";?>
    </footer>
</body>
</html>

   function check_input()
   {
      if (!document.register.pass.value)
      {
          alert("비밀번호를 입력하세요!");
          document.register.pass.focus();
          return;
      }

      if (!document.register.pass_confirm.value)
      {
          alert("비밀번호확인을 입력하세요!");
          document.register.pass_confirm.focus();
          return;
      }

      if (!document.register.name.value)
      {
          alert("이름을 입력하세요!");
          document.register.name.focus();
          return;
      }

      if (!document.register.email1.value)
      {
          alert("이메일 주소를 입력하세요!");
          document.register.email1.focus();
          return;
      }

      if (!document.register.email2.value)
      {
          alert("이메일 주소를 입력하세요!");
          document.register.email2.focus();
          return;
      }

      if (document.register.pass.value !=
            document.register.pass_confirm.value)
      {
          alert("비밀번호가 일치하지 않습니다.\n다시 입력해 주세요!");
          document.register.pass.focus();
          document.register.pass.select();
          return;
      }

      document.register.submit();
   }

   function reset_form()
   {
      document.register.id.value = "";
      document.register.pass.value = "";
      document.register.pass_confirm.value = "";
      document.register.name.value = "";
      document.register.email1.value = "";
      document.register.email2.value = "";

      document.register.id.focus();

      return;
   }

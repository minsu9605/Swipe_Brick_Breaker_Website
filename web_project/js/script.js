(() => {
	//let은 변수 재선언X, 재할당O, const는 변수 재선언X, 재할당X
	const canvas= document.getElementById("canvas");
	const ctx= canvas.getContext('2d');
	let turn= 1;
	let W= canvas.width;       //450px
	let H= canvas.height;      //450px

	/* canvas default setting */
	ctx.setLineDash([5, 5]);	//점선 길이5, 간격5 설정
	ctx.strokeStyle= "#A5DDF9";	//하늘색
	ctx.lineCap= 'round';		//선 테두리 round형
	ctx.lineWidth= 2;		//선 두께 2

	/* canvas default setting */
	const Block_width= W/6; 	//block width
	const Block_height= H/9; 	//block height

	let Move_cnt= 0;		// mousemove cnt (예상경로 움직이는데 사용됨)
	let Shootcnt= 0; 		// 날아가고있는 공의 개수
	let mousestate= 0; 	// 0= defualt 1= mousedown 2= mousemove 3= mouseup
	let Ball_Add= 0; 	// 추가해야되는 공 cnt
	let px= 0, py= 0; 		// 예상경로 line
	let tx= 0, ty= 0; 		// 예상경로 ball

	let Balls= []; 		// Ball array
	let Blocks= []; 		// 블록 array
	let AddBalls= []; 		// 추가되는 공 array
	let fb;
	let fbid= null; 		// 바닥에 닿은 첫번째 공의 idx
	let tg, ax, ay, over, B; 	// GetPath, DrawPath
	let Iscallback= false;
	let Isend= false;

    const break_audio = document.getElementById("break");
    const clear_audio = document.getElementById("clear");
    const addball_audio = document.getElementById("addball");
    const shoot_audio = document.getElementById("shoot");
    const end_audio = document.getElementById("end");

	/* object */
	class ball {
		//class 초기화
		constructor (x, y){
			this.radius= 10; 		// 반지름
			this.x= x? x: W /2; 		// x 좌표 값(삼항 연산자 x가 참이면 x를, 아니면 W/2반환)
			this.y= y? y: H-10; 		// y 좌표 값
			this.dx= 0; 		// 1 FPS당 움직이는 X 값
			this.dy= 0; 		// 1 FPS당 움직이는 Y 값
			this.isShoot= false; 		// 날아가고 있는지
			this.opacity= 1;		//불투명
		}

		//공 그리는 함수
		draw (c= `rgba(75, 188, 244, ${this.opacity || 1})`, x= this.x, y= this.y){
			ctx.save();
			ctx.beginPath();

			// ctx.fillStyle= "rgba(75, 188, 244, 0.5";
			ctx.fillStyle= c;
			ctx.arc(x, y, this.radius, 0, 2*Math.PI, false);
			ctx.fill();

			ctx.closePath();
			ctx.restore();
		}

		//공의 이동경로 계산
		update (){
			this.x+= this.dx;
			this.y+= this.dy;

			//x좌표가 캔버스 영역에 도달 했을때
			if(this.x+this.radius>=canvas.width || this.x<=this.radius){
				this.x= this.x+this.radius>=canvas.width? canvas.width-this.radius: this.radius;
				this.dx = -this.dx;	//움직이는 x좌표값 -로 변환
			}
			//y좌표가 캔버스 영역에 도달했을때
			if(this.y+this.radius>=canvas.height || this.y<=this.radius){
				this.y= this.y+this.radius>=canvas.height? canvas.height-this.radius: this.radius;
				this.dy = -this.dy;	//움직이는 y좌표값 -로 변환
			}

			//블록 충돌 여부 확인
			for(var i=0, len= Blocks.length; i<len; i++){
				//블록이 없을때 통과
				if(Blocks[i] == undefined)
					continue;
				let b= Blocks[i];
				let pointX = getPoint(this.x, b.X_min, b.X_max);
				let pointY = getPoint(this.y, b.Y_min, b.Y_max);
				if(Checkdistance(this.x, this.y, pointX, pointY)){
					let nx = this.x - pointX;  //공과 꼭짓점 사이 x
					let ny = this.y - pointY;  //공과 꼭짓점 사이 y
					let len = Math.sqrt(nx * nx + ny * ny); // 공과 꼭짓점 사이 거리

					//공이 꼭짓점에 맞았을때
					if(len < this.radius && ( pointX == b.X_min || pointX == b.X_max) && ( pointY == b.Y_min || pointY == b.Y_max)) {
                        				console.log("corner");
						//공과 꼭짓점 사이 각에 대한 코사인값 혹은 단위벡터
						nx /= len;
						ny /= len;
						let vector_nxy = this.dx * nx + this.dy * ny;     //현재 공의 x, y방향에 대한 내적

                        //이동 방향뿐 아니라 이동량까지 재설정
						this.dx = this.dx - 2 * vector_nxy * nx;
						this.dy = this.dy - 2 * vector_nxy * ny;
						//y방향 이동량이 너무 적을 시 좀 더 많게 설정(난이도조절용)
                        if(Math.abs(this.dy) < 0.3)
							this.dy+= this.dy<0? -0.5: 0.5;
					}
					else{
						if(pointX == b.X_max || pointX == b.X_min) { 	// 공이 좌우 모서리에 맞았을때
							this.x= pointX==b.X_max? pointX+10: pointX-10;	//좌측 모서리이면 -, 우측 모서리이면 +
							this.dx*=-1;		//방향 바꾸기
						}
						if(pointY == b.Y_max || pointY == b.Y_min){	// 공이 상하 모서리에 맞았을때
							this.y= pointY==b.Y_max? pointY+10: pointY-10;
							this.dy*=-1;
						}
					}

					b.cnt--;
					if(b.cnt<=0){
                        break_audio.play();
						Blocks.splice(i, 1)		//충돌판정으로 cnt 값이 0이 되면 해당 배열(블록) 삭제
                    }
				}
			}

			//공 추가블록 충돌 여부
			for(var i=0, len= AddBalls.length; i<len; i++){
				//공 추가블록이 없을때
				if(AddBalls[i] == undefined)
					continue;
				var A= AddBalls[i];
				//공 추가블록의 가운데 x, y좌표
				var pointX= A.l * Block_width + (Block_width/2);
				var pointY= A.t * Block_height + (Block_height/2);

				//충돌 판정시 공 추가블록 없애기 + 공 추가갯수 카운트
				if(Checkdistance(this.x, this.y, pointX, pointY, A.radius+this.radius)){
                    addball_audio.play();
					AddBalls.splice(i, 1);
					Ball_Add++;
				}
			}

			//날아가고 있으면 false, 바닥에 도달시 true
			if(this.y+this.radius>=canvas.height){
				return true;
			}
			return false;
		}
	}
	class Block {
        		//Block 클래스 초기화
		constructor (option){
			this.w= W/6;
			this.h= H/9;
			this.l= option.l;        //행
			this.t= option.t;        //열

			this.X_min= this.l*this.w+1;
			this.Y_min= this.t*this.h+1;
			this.X_max= this.X_min+this.w-2;
			this.Y_max= this.Y_min+this.h-2;
			this.cnt= option.cnt;
		}

		draw (){
			ctx.save();
			ctx.beginPath();

			//구간 따라 색상 나누기
			if(this.cnt<=5){
				ctx.fillStyle= "#F5DCB4";
				ctx.fillRect(this.l*this.w+1, this.t*this.h+1, this.w-2, this.h-2);      //좌표값+1; 폭, 너비-2는 블록간 간격을 나타내기 위함
			}
			else if((this.cnt>5) && (this.cnt<=10)){
				ctx.fillStyle= "#F5BE96";
				ctx.fillRect(this.l*this.w+1, this.t*this.h+1, this.w-2, this.h-2);
			}
			else if((this.cnt>10) && (this.cnt<=15)){
				ctx.fillStyle= "#F5A078";
				ctx.fillRect(this.l*this.w+1, this.t*this.h+1, this.w-2, this.h-2);
			}
			else if((this.cnt>15) && (this.cnt<=20)){
				ctx.fillStyle= "#F5825A";
				ctx.fillRect(this.l*this.w+1, this.t*this.h+1, this.w-2, this.h-2);
			}
			else {
				ctx.fillStyle= "#F5643C";
				ctx.fillRect(this.l*this.w+1, this.t*this.h+1, this.w-2, this.h-2);
			}

			ctx.fillStyle= "#fff";   //흰색
			ctx.font = "bold 20px sans-serif";   //sans-serif폰트 bold체 20포인트
			ctx.textAlign = "center";
            			ctx.textBaseline = "middle";
			ctx.fillText(this.cnt, this.l*this.w + this.w/2, this.t*this.h + this.h/2);   //this.cnt값을 블록 가운데에 표시
			ctx.closePath();
			ctx.restore();
		};
	}
	class AddBall {
		constructor (option){
			this.radius= 15;
			this.l= option.l;	//열
			this.t= option.t;	//행
		}
		draw (){      //radio 버튼 모양으로 만듦
			ctx.save();
			ctx.strokeStyle= "#69db7c";      //연두색
			ctx.fillStyle= "#69db7c";
			ctx.setLineDash([]);
			ctx.lineWidth= 3;
			ctx.lineDashOffset= 0;

		            //바깥쪽 원
			ctx.beginPath();
			ctx.arc(this.l*Block_width+(Block_width/2), this.t*Block_height+(Block_height/2), this.radius, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.closePath();

            		//안쪽 원
			ctx.beginPath();
			ctx.arc(this.l*Block_width+(Block_width/2), this.t*Block_height+(Block_height/2), 9, 0, Math.PI*2);
			ctx.fill();
			ctx.closePath();

			ctx.restore();
		};
	}

	/* //object */
	/* function */
	const Checkdistance= (x1, y1, x2, y2, distance = 10) => distance >= Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)); 	// 두 점 사이의 거리를 비교, default값으로 distance = 10인 이유는 공의 반지름이 10이기 때문
	const GetPointFromDegree= (x, y, degree, len= 15) => new Object({x: x + Math.cos(degree*(Math.PI/180))*len, y: y + Math.sin(degree*(Math.PI/180))*len }); // 각도를 통해 새로운 위치 가져옴
	const GetDegree= (x1, x2, y1, y2) => Math.atan2(x1 - x2, y1 - y2) * 180 / Math.PI; // 점 두개로 각도 구함
	const getPoint= (v, min, max) =>{ 		//  pointX, pointY 정의
		if(v <= min || v >= max)
			return Math.abs(max-v) < Math.abs(min-v)? max: min;
		return v;
	}
	const display= () =>{ 		// display function
		clear(); 			// 캔버스 초기화

		//각 요소(블록, 공추가블록, 공) 그리기
		Blocks.forEach(element =>{
			if(element) element.draw();
		});
		AddBalls.forEach(element =>{
			if(element) element.draw();
		})
		if(Iscallback){
			Balls.forEach(element =>{
				if(element) element.draw();
			});
		}
		else{
			if(mousestate === 2){ // 공을 날렸으면
				Balls.forEach(element =>{
					if(element) element.draw();
				});
			}
			else{ // 공이 바닥에 있을때
				fb.draw();
			}
		}
		if(mousestate === 1)
			DrawPath(Move_cnt); // 공 날릴려고 마우스 누르면 경로 그리기
		if(Isend) return end();
		requestAnimationFrame(() =>{
			setTimeout(display, 1000/120);   //120프레임
		});
	}
	const clear= () => ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas clear
	const GetPath= (lx, ly) =>{ // get path
		//ly*= -1;
		for(var i=0, len= Balls.length; i<len; i++){
			Balls[i].dx= lx;
			Balls[i].dy= ly;
		}
		ax= fb.x, ay= fb.y;
		over= false, B= false;

		//공이 캔버스 벽에 닿을때까지 반복
		while( (ax + fb.radius <= W || ax >= 0) || (ay + fb.radius <= canvas.height || ay >= 0) ){
			ax+= lx;
			ay+= ly;
			if(!over){ 		// 벽에 닿았는지 확인해서 공(예상경로)의 위치 갱신
				if(ax + fb.radius >= W || ax <= fb.radius){
					ax= ax + fb.radius >= W?  W - fb.radius: fb.radius;
					over= true;
				}
				if(ay + fb.radius >= H || ay <= fb.radius){
					ay= ay + fb.radius >= H? H - fb.radius: fb.radius;
					over= true;
				}
				if(over){
					px= ax;
					py= ay;
				}
			}
			if(!B){ 		// 블록에 닿았는지 확인해서 공(예상경로)의 위치 갱신
				if(over){
					tx= ax;
					ty= ay;
					break;
				}
				for(var i=0, len= Blocks.length; i<len; i++){
					let b= Blocks[i];
					let pointX= getPoint(ax, b.X_min, b.X_max);
					let pointY= getPoint(ay, b.Y_min, b.Y_max);
					if(Checkdistance(ax, ay, pointX, pointY)){
						if(pointY == b.Y_max && (b.X_min < ax && ax > b.X_max)){
							ay= b.Y_max + 10;		//밑면에 닿았을때 y좌표 +10
						}
						else if(pointX == b.X_max && (ay > b.Y_min && b.Y_max > ay)){
							ax= b.X_max + 10;		//우측면에 닿았을때 x좌표 +10
						}
						else if(pointX == b.X_min && (ay > b.Y_min && b.Y_max > ay))
							ax= b.X_min - 10;		//좌측면에 닿았을때 x좌표 -10
						tx= ax;
						ty= ay;
						B= true;
						break;
					}
				}
			}
			if(over && B) break;
		}
		Move_cnt++;
	}
	const DrawPath= c =>{ 		// 예상경로와 충돌위치 그리기
		if( mousestate % 2 === 0 || Move_cnt != c) 	// 방향이 다르거나 마우스클릭이 안돼있으면 return
			return;

		//예상경로
		ctx.beginPath();
		ctx.moveTo(fb.x, fb.y);
		ctx.lineTo(px, py);
		ctx.stroke();
		ctx.closePath();
		ctx.lineDashOffset -= 1;

		//예상 충돌위치
		fb.draw("#7cd3ff", tx, ty);
	}
	const eve= () =>{
		canvas.addEventListener("mousedown", onMouseDown);	//캔버스상에서만 마우스 클릭
		canvas.addEventListener("mousemove", onMouseMove);	//마우스 클릭 상태 유지하면서 이동
		canvas.addEventListener("mouseup", onMouseUp);	//마우스 클릭 해제
	}
	const onMouseDown= e =>{
		if((e.button==0) && (mousestate === 2 || Iscallback)) return; // mouseup 한 상태이면

		if(e.button == 0){
			mousestate= 1; // mousedown 한 상태
			onMouse(e);
		}
	}
	const onMouseMove= e =>{
		if((e.button==0) && mousestate === 1) onMouse(e, 1); // mousedown 한 상태이면
	}
	const onMouseUp= async e =>{		//공이 날아다니는 모션을 위해 비동기 선언
		if((e.button==0) && mousestate == 1){ // if mousedown
			mousestate= 2; 	// mouseup
			ctx.lineDashOffset= 0; 	// 예상 경로 초기화
			Shootcnt= Balls.length; // ball 개수만큼 Shootcnt 설정
			Ball_update(); // 공 업데이트
			let degree= GetDegree(fb.x + fb.dx, fb.x, fb.y - fb.dy, fb.y);
			degree= degree<0? -270-(degree): 90-(degree);
			let point= GetPointFromDegree(fb.x, fb.y, degree, 10);	
			let tick= Math.floor(Math.abs(point.x - fb.x))+Math.floor(Math.abs(fb.y-point.y));
			for(var i=0; i<Balls.length; i++){
				let s= await balls_shoot(i, tick);	//공이 다 날아갈때까지 일시정지
			}
			console.log(Balls.map(v => v.opacity));
			turn++;
		}
	}
	const onMouse= (e) =>{		// mousedown, mousemove event
		//캔버스의 좌측상단 꼭짓점이 (0,0) 기준
		pos= {
			x: e.pageX-document.getElementById("app").getBoundingClientRect().left,
			y: e.pageY-document.getElementById("app").getBoundingClientRect().top
		};
		let degree= GetDegree(pos.x, fb.x, pos.y, fb.y); 	// 마우스 클릭하고 있는 위치와 바닥에 있는 공과의 각도계산
		//console.log(degree)
		let min_angle= 15; // 좌우 최소 각도
		if(Math.abs(degree)<90+min_angle){ // 공과 마우스 커서 사이 각도가 105도 미만이면 최솟값으로 변경
			let point=  degree>0? GetPointFromDegree(fb.x, fb.y, -min_angle, 3): GetPointFromDegree(fb.x, fb.y, -180+min_angle, 3);	//바닥에 있는 공의 좌표를 원점으로 양쪽 바닥에서 15도로 고정
			GetPath( (point.x - fb.x), (point.y - fb.y));
			return;
		}
		degree= degree<0? -270-(degree): 90-(degree);		//y축의 기준이 아래방향이므로 위의 방향으로 전환
		let point= GetPointFromDegree(fb.x, fb.y, degree, 3);
		GetPath( (point.x - fb.x), (point.y - fb.y));
	}
	const Ball_update= () =>{
		if(Blocks.length == 0 && AddBalls.length == 0 && Balls[fbid]){
            console.log(Balls[fbid])
            clear_audio.play();
			return smoothCallback(0);
		}

		for(var i=0, len= Balls.length; i<len; i++){
			if(!Balls[i].isShoot)
                continue;
			if(Balls[i].update()){
				Balls[i].isShoot= false;
				if(Balls.length == Shootcnt){
					fbid= i;
				}
				Shootcnt--;
				if(Shootcnt === 0){
					mousestate= 0;
					return callback();
				}
			}
		}
		setTimeout(function (){
			return Ball_update();
		}, 1000/120);
	}

	const smoothCallback= n =>{        //블록, 공추가 블록까지 다 깨뜨리면 빠르게 넘기기 단. 바닥에 공이 하나 도달해야함
		if(n>=120){           //약 1초(120프레임(Hz)*120=1s)
			Shootcnt= 0;
			mousestate= 0;
			for(var i=0, len= Balls.length; i<len; i++){
				Balls[i].x= Balls[fbid].x;
				Balls[i].y= Balls[fbid].y;
				Balls[i].opacity= 1;
			}
			return callback();
			return;
		}
		for(var i=0, len= Balls.length; i<len; i++){
			if(!Balls[i].isShoot)
				continue;
			if(Balls[i].update()){
				Balls[i].isShoot= false;
				Balls[i].opacity= 1;
				Shootcnt--;
				if(Shootcnt === 0){		//바닥의 공이 다 날아갔을때
					mousestate= 0;
					return callback();
				}
			}
			else{
				Balls[i].opacity-= 0.01;
			}
		}
		setTimeout(function (){
			return smoothCallback(n+1);
		}, 1000/120);
	}

	const callback= async () =>{ 		// 공 날라갔다가 돌아왔을때
		Iscallback= true;

		Blocks= Blocks.map(e =>{		//화면에 표시되어있는 블록 다음층으로 옮기기
			if(e.opacity != 1) e.opacity= 1;
			e.t++;
			e.Y_min+= e.h;
			e.Y_max+= e.h;
			return e;
		});
		AddBalls= AddBalls.map(e =>{	//화면에 표시되어있는 공추가블록 다음층으로 옮기기
			e.t++;
			return e;
		})

        //바닥에 도달시 제거 후 자동으로 공 추가
        if (AddBalls[0] != undefined){
            if (AddBalls.find(e => e.t == 8)){
                AddBalls.splice(0, 1);
                Ball_Add++;
            }
        }
        /*
        if (AddBalls[0] != undefined){
            if (AddBalls[0].t == 8){
                AddBalls.splice(0, 1);
                Ball_Add++;
            }
        }*/

		/* //block, addball update */
		/* block cnt */
		let cnt= 0;
		let getrandomcnt= Math.floor(Math.random()*(9))+1;   //1~9까지 랜덤
		if(turn < 10){
			cnt= Math.floor(Math.random()*2)+1 == 1? 1: 2;   //1, 2 랜덤 대입
		}
        else if(turn < 20){
            cnt= Math.floor(Math.random()*2)+2 == 2? 2: 3;   //2, 3 랜덤 대입
        }
        else if(turn < 30){         //2~4 랜덤 대입
            if(getrandomcnt<=3){
                cnt= Math.floor(turn/10);
            }
            else if(getrandomcnt<=6){
				cnt= 1+Math.floor(turn/10);
			}
            else{
				cnt= 2+Math.floor(turn/10);
            }
        }
        else{                       //3~5 랜덤 대입
            if(getrandomcnt<=3){
				cnt= 1+(Math.floor(turn/10) > 2? 2: Math.floor(turn/10));
			}
            else if(getrandomcnt<=6){
				cnt= 2+(Math.floor(turn/10) > 2? 2: Math.floor(turn/10));
			}
            else{
				cnt= 3+(Math.floor(turn/10) > 2? 2: Math.floor(turn/10));
			}
		}

        //블록 및 공추가블록 추가
		var bl= [];	//블록과 공추가블록이 겹치지 않게 하기위한 매개배열변수
		for(var i=0; i<cnt; i++){
			let l= Math.floor(Math.random()*6);  //0~5까지 랜덤(소수점 내림)

			if(bl.includes(l)){
				i--;
			}
            else{
				bl.push(l);
				Blocks.push(new Block({l: l, t: 1, cnt: turn}));    //turn<10이면 블록 개수 1~2 랜덤. 10<=turn<20이면 2~3랜덤, 20<=turn<30이면 2~4랜덤, turn>=30이면 3~5랜덤
			}
		}

		function recursive(){         //공추가 블록 생성
			let l= Math.floor(Math.random()*6);  //0~5까지 랜덤
			if(bl.includes(l)){      //공추가 블록과 블록의 중첩 없애기
				recursive();
			}
            else{
				AddBalls.push(new AddBall({l: l, t: 1}));
			}
		}
		recursive();

        //바닥의 공 추가 생성
		for(var i=0; i<Ball_Add; i++){
			Balls.push(new ball(Balls[fbid].x, Balls[fbid].y));
		}
		Ball_Add= 0;  //추가하는 공 초기화
        console.log(Ball_Add)
		if(Blocks.find(e => e.t == 8)){
            end_audio.play();
            end();
            return add_button();  //블록이 바닥에 닿을시 게임 종료
        }
        await Ball_Gather();        //공모으기

		/* //ball */
        document.querySelector(".score").innerText= turn;   //점수=현재 턴
        document.querySelector(".b").innerText= Balls.length;   //현재 공=공 배열의 길이
        Blocks= Blocks.map(v =>{` `
            if(v.opacity != 1) v.opacity= 1;
            return v;
        });
        Iscallback= false;
        fbid= null;
	}

    const balls_shoot= (i, t) =>{
		return new Promise( (res, rej)=> {	//promise 끝날때까지 async된 함수 내부에서 await로 대기
            if(i == 0) shoot_audio.play();
			Balls[i].isShoot= true;
			setTimeout(() =>{
				return res(i);
			}, 1000 / 120 * t);
		});
	}

	const Ball_Gather= () =>{ // 공 모으는 애니메이션
		let distance= [];
		let cnt= 30;
		for(var i=0, len= Balls.length; i<len; i++){
			Balls[i].y= Balls[fbid].y;
			let dis= fbid == i? 0: (Balls[fbid].x - Balls[i].x) / cnt;   //1프레임에 움직이는 x값
			distance.push( dis );
		}
		return new Promise(res =>{    //바닥의 깔린 공 모으기
			function recursive (n){
				for(var i=0, len= Balls.length; i<len; i++){
					Balls[i].x+= distance[i];
				}
				setTimeout( () =>{      //30번 반복 = 약 0.25초
					if(n < cnt){
						recursive(n+1);
					}
                    else{
						for(var i=0, len= Balls.length; i<len; i++){
							Balls[i].x= Balls[fbid].x;
						}
						res(true);
					}
				}, 1000 / 120);
			}
			recursive(0);
		})
	}
	const end= () => {     // 게임 끝났을때 캔버스 상의 마우스 event제거
		Isend= true;
		canvas.removeEventListener("mousedown", onMouseDown);
		canvas.removeEventListener("mousemove", onMouseMove);
		canvas.removeEventListener("mouseup", onMouseUp);

        ctx.beginPath();
        ctx.fillStyle= "rgba(0, 0, 0, 0.3)";
		ctx.fillRect(0, 0, W, H);
        ctx.closePath();

        ctx.font = "40px 'Arial Black', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "Black";
        ctx.fillText( "최종 점수: "+(turn-1) , 225, 120 );
    };

    const add_button = () =>{       //end후 다시시작 버튼
        var obj = document.createElement('button');     //button 태그 만들기
        obj.setAttribute('type', 'button');
        obj.setAttribute('onClick', 'location.href="swipe_update.php"');
        obj.setAttribute('style', 'position: absolute; z-index: 2; left: 175px; bottom: 175px; width: 100px; height: 100px;');

        var img = document.createElement('img');        //button태그 내 이미지 넣기
        img.setAttribute('src', 'img/restart.png');
        img.setAttribute('alt', '다시 시작하기');
        img.setAttribute('style', 'width: 100%; height: 100%;');

        obj.appendChild(img);
        document.getElementById("app").appendChild(obj);    //id=app 내 버튼태그 생성

        document.querySelector('button').addEventListener('click', function(e){
            httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', '../php/swipe_update.php?score='+(turn-1), true);
            httpRequest.onreadystatechange = function() {
                location.href="swipe.php";
            }
            //httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            httpRequest.send();
        });
    }

	window.onload= () =>{
        	//블록, 공추가블록 랜덤 생성
        	let block_raw1 = Math.floor(Math.random()*6);
        	let block_raw2 = Math.floor(Math.random()*6);
        	let AddBall_raw = Math.floor(Math.random()*6);

        	while ((block_raw1 == block_raw2) || (AddBall_raw == block_raw1) || (AddBall_raw == block_raw2)) {
            	if (block_raw1 == block_raw2){
                		block_raw2 = Math.floor(Math.random()*6);
            	}
            	else {
                		AddBall_raw = Math.floor(Math.random()*6);
            	}
        	}

		Balls.push(new ball());
		Blocks.push(new Block({l: block_raw1, t: 1, cnt: turn}));
		Blocks.push(new Block({l: block_raw2, t: 1, cnt: turn}));
		AddBalls.push(new AddBall({l: AddBall_raw, t: 1}));
		fb= Balls[0];
		eve();
		display();
	}
})();

/*
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}
*/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


TitlePage = {};
TitlePage.planePos = [[0,411],[6,412],[18,413],[25,414],[32,415],[37,416],[40,417],[43,418],
[48,419],[51,420],[53,421],[57,422],[59,423],[62,424],[65,425],[67,426],
[69,427],[71,428],[73,429],[75,430],[79,432],[83,435],[87,437],[89,439],
[95,443],[98,445],[101,448],[104,452],[107,454],[110,457],[112,460],[115,463],
[117,466],[120,470],[122,473],[124,476],[126,479],[127,481],[133,490],[135,493],
[138,498],[139,500],[140,502],[142,505],[143,507],[145,510],[146,512],[148,515],
[149,517],[151,520],[153,524],[155,527],[157,531],[159,534],[161,538],[163,542],
[164,544],[165,546],[167,549],[168,551],[173,560],[175,564],[210,636],[220,655],
[223,660],[224,663],[228,670],[229,672],[233,680],[246,705],[253,719],[255,726],
[255,732],[254,736],[253,739],[252,742],[249,748],[248,750],[246,753],[243,757],
[240,760],[238,762],[235,766],[232,770],[230,773],[229,775],[227,779],[227,785],
[228,789],[231,792],[233,794],[240,797],[243,798],[247,799],[252,800],[257,801],
[262,802],[270,803],[278,804],[288,805],[297,806],[308,807],[319,808],[342,809],
[403,810],[474,811],[674,811],[747,810],[999,810],[1334,810],[1440,810]];

TitlePage.title = document.getElementById('titlePage');
TitlePage.plane = document.createElement('img');
TitlePage.text = document.createElement('img');

TitlePage.strokes = [];

TitlePage.pngSize = [751,1334];
TitlePage.textSize = [117,349,462];
TitlePage.planeSize = [256,130];

TitlePage.textPos = [316,238];

TitlePage.strokesPath = 'img/strokes/';
TitlePage.strokesPic = [
	'one,70%,0,80%(T,450;L,390).png',
	'two,80%,30,70%(T,490;L,396).png',
	'three,70%,15,50%(T,516;L,377).png',
	'four,50%,-20,30%(T,538;L,400).png',
	'five,50%,30,45%(T,542;L,357).png',
	'six,45%,0,10%(T,579;L,382).png'
]
TitlePage.strokesRegExp = /(.+),(\d+)%,(.+),(\d+)%\(T,(\d+);L,(\d+)\)\.png/i;
TitlePage.strokesPos = [
[321,238],[353,243],[386,323],
[334,418],[325,381],[399,308]
];
TitlePage.strokesTargetPos = [
[389,539],[396,580],[378,603],
[400,626],[357,630],[382,667]
];
TitlePage.strokesSize = [
[18,56],[14,37],[5,35],
[22,82],[41,41],[21,73]
];


TitlePage.active = false;

TitlePage.setup = function(){
	this.active = true;
	this.setupPosInfo();
	this.createStrokes();
	this.setupTextData();
	this.setupPlaneData();
	this.setupMoveData();
	this.setupPlaneConfig();
	requestAnimFrame(this.update.bind(this));
	//alert("requestAnimationFrame4");
}
TitlePage.setupPosInfo = function(){
	this.posScale = this.title.offsetWidth/this.pngSize[0];
	this.setupTitleTextPosInfo();
	this.setupPlanePosInfo();
	this.setupStrokesPosInfo();
}
TitlePage.setupTitleTextPosInfo = function(){
	var rate = this.textSize[1]/this.textSize[0];

	this.textSize[0] = (this.textSize[0]/this.pngSize[0]);
	this.textSize[1] = (this.textSize[1]/this.pngSize[1]);
	this.textSize[2] = (this.textSize[2]/this.pngSize[1]);//this.textSize[0]*rate;

	this.textPos[0] = (this.textPos[0]/this.pngSize[0]);
	this.textPos[1] = (this.textPos[1]/this.pngSize[1]);
}
TitlePage.setupPlanePosInfo = function(){
	var rate = this.planeSize[1]/this.planeSize[0];

	this.planeSize[0] = this.title.offsetWidth*0.3;
	this.planeSize[1] = this.planeSize[0]*rate;

	for(var i=0;i<this.planePos.length;i++){
		this.planePos[i][0] *= this.posScale;
		this.planePos[i][1] *= this.posScale;
	}
}
TitlePage.setupStrokesPosInfo = function(){
	this.strokesParams = [];
	for(var i=0;i<this.strokesPic.length;i++){
		var rate = this.strokesSize[i][1]/this.strokesSize[i][0];
		var data = this.strokesParams[i] = {};
		
		data.fx = this.strokesPos[i][0]/this.pngSize[0];
		data.fy = this.strokesPos[i][1]/this.pngSize[1];
		data.fw = this.strokesSize[i][0]/this.pngSize[0];
		data.fh = this.strokesSize[i][1]/this.pngSize[1];

		if(this.strokesPic[i].match(this.strokesRegExp)){
			data.targetScale = Number(RegExp.$2)/100;
			data.targetAngle = Number(RegExp.$3)/180*Math.PI;
			data.targetOpacity = Number(RegExp.$4)/100;
			data.targetX = (this.strokesTargetPos[i][0]-this.strokesPos[i][0])/this.strokesSize[i][0];
			data.targetY = (this.strokesTargetPos[i][1]-this.strokesPos[i][1])/this.strokesSize[i][1];
		};

		data.x = 0;//data.fx;
		data.y = 0;//data.fy;
		data.opacity = 1;
		data.angle = Math.random()*Math.PI;
		data.realAngle = 0;
		data.scale = 1;
	}
}
TitlePage.createStrokes = function(){
	for(var i=0;i<this.strokesParams.length;i++){
		var data = this.strokesParams[i];
		var img = document.createElement('img');
		img.src = this.strokesPath+this.strokesPic[i];
		img.className = 'stroke';
		img.style.top = data.fy*100+'%';
		img.style.left = data.fx*100+'%';
		img.style.width = data.fw*100+'%';
		img.style.height = data.fh*100+'%';
		this.title.appendChild(img);
		this.strokes[i] = img;
	}
}
TitlePage.setupTextData = function(){
	this.text.src = 'img/titleText.png'; 
	this.text.id = 'titleText';
	this.text.style.top = this.textPos[1]*100+'%';
	this.text.style.left = this.textPos[0]*100+'%';
	this.text.style.width = this.textSize[0]*100+'%';
	this.text.style.height = this.textSize[1]*100+'%';
	document.body.appendChild(this.text);
}
TitlePage.setupNewTextData = function(){
	this.text.src = 'img/titleText2.png'; 
	this.text.onload = function(){
		this.text.style.height = this.textSize[2]*100+'%';
		this.strokes.forEach(function(stroke){
			stroke.style.display = 'none';
		})
	}.bind(this);
	/**/
}
TitlePage.setupPlaneData = function(){
	this.plane.src = 'img/plane.png'; 
	this.plane.id = 'plane';
	this.title.appendChild(this.plane);
}
TitlePage.setupMoveData = function(){
	this.flyCount = 0;
	this.planeSpeed = 0.02;
	this.planeFrequency = 10;
	this.stopPos = 90;

	this.currentPos = 0;
	this.planeAngle = 0;
	this.absAngle = 0;
	this.planeScale = 0.25;
	this.x = this.planePos[this.currentPos][0];
	this.y = this.planePos[this.currentPos][1];
}
TitlePage.setupPlaneConfig = function(){
	this.plane.onclick = function(){
		this.stopPos = this.planePos.length;
	}.bind(this);
}

TitlePage.switchContentLayer = function(){
	this.nextLayer = true;
	this.setupNewTextData();
	this.hideTitleLayer();
	//this.title.removeChild(this.text);
	ContentPage.setup(this.text);
}
TitlePage.hideTitleLayer = function(){
	this.title.style.animationName = 'hide-titlePage';
	this.title.style.animationDuration = '0.8s';
	this.title.style.animationFillMode = 'both';
	this.title.style.animationTimingFunction = 'linear';
	this.title.style.animationIterationCount = '1';
}

TitlePage.needNextPoint = function(){
	var tx = this.planePos[this.currentPos+1][0];
	var ty = this.planePos[this.currentPos+1][1];
	return (tx-this.x)*(tx-this.x)+
		(ty-this.y)*(ty-this.y)<=0.1;
}
TitlePage.getAngle = function(id){
	if(id<this.planePos.length-1){
		var dx = this.planePos[id+1][0]-this.planePos[id][0];
		var dy = this.planePos[id+1][1]-this.planePos[id][1];
		if(dx==0&&dy==0) return undefined;
		if(dx==0) return dy > 0 ? Math.PI/2 : -Math.PI/2;
		if(dx>0) return Math.atan(dy/dx);
		return Math.atan(dy/dx)+Math.PI;
	}else return undefined;
}
TitlePage.getCurrentAngle = function(){
	return this.getAngle(this.currentPos);
}
TitlePage.updateFlyPosition = function(){
	if(this.currentPos>=this.planePos.length-1) return;
	if(this.needNextPoint()) this.currentPos++;
	this.absAngle = this.getCurrentAngle() || this.planeAngle;
	this.x += this.planeSpeed*Math.cos(this.absAngle);
	this.y += this.planeSpeed*Math.sin(this.absAngle);
}
TitlePage.updateFlyParams = function(){
	this.planeAngle += (this.absAngle-this.planeAngle)/6;
	if(this.planeScale<1.25) this.planeScale += (1.25-0.25)/75;
	if(this.currentPos >= this.stopPos) this.planeFrequency *= 24/25;
	else this.planeFrequency += (300-this.planeFrequency)/33;
	if(this.planeFrequency<10){
		if(!this.ry) this.ry = this.y;
		this.y = this.ry + 5*Math.sin(this.flyCount++/15);
	}
	if(this.planeFrequency<1) this.planeFrequency = 0;
}
TitlePage.updatePosition = function(){
	var fx = (this.x-this.planeSize[0])/this.planeSize[0];
	var fy = (this.y-this.planeSize[1]/2)/this.planeSize[1];

	this.plane.style.transform = 'translate('+fx*100+'%,'+fy*100+'%) rotate('+
		this.planeAngle+'rad) scale('+this.planeScale+')';
	if(this.x>=this.title.offsetWidth && !this.nextLayer) 
		this.switchContentLayer();
}



TitlePage.strokeNeedNextPoint = function(id){
	var data = this.strokesParams[id];
	return (data.tx-data.x)*(data.tx-data.x)+
		(data.ty-data.y)*(data.ty-data.y)<=0.5;
}

TitlePage.updateStrokeDropData = function(id){
	var data = this.strokesParams[id];
	/*
	data.x += (Math.random()*4-1)/100;
	data.y += (Math.random()*5)/100;
	data.realAngle += (data.angle-data.realAngle)/100;
	data.opacity -= (Math.random()*4-1)/500;
	*/
	/*
	console.info("===========");
	console.info(data.x);
	console.info(data.targetX);
	console.info(data.targetX-data.x);*/
	var speedRate = 66;
	data.x += (data.targetX-data.x)/speedRate;
	data.y += (data.targetY-data.y)/speedRate;
	data.opacity += (data.targetOpacity-data.opacity)/speedRate;
	data.realAngle += (data.targetAngle-data.realAngle)/speedRate;
	data.scale += (data.targetScale-data.scale)/speedRate;
}
TitlePage.updateStrokeDropPosition = function(id){
	var data = this.strokesParams[id];
	var ele = this.strokes[id];
	ele.style.opacity = data.opacity;
	//alert("updateStrokeDropPosition:"+id);
	ele.style.transform = 'translate('+data.x*100+'%,'+data.y*100+'%)rotate('+
		data.realAngle+'rad) scale('+data.scale+')';
	//alert("updateStrokeDropPositionEnd:"+id);
}
TitlePage.updateStrokesDrop = function(){
	for(var i=0;i<this.strokesParams.length;i++){
		this.updateStrokeDropData(i);
		this.updateStrokeDropPosition(i);
	}
}
TitlePage.update = function(){
	//alert("update1");
	if(!this.active) return;
	//alert(this.currentPos);
	this.updateFlyParams();
	for(var i=0;i<this.planeFrequency;i++) 
		this.updateFlyPosition();
	this.updatePosition();
	if(this.currentPos>=10)this.updateStrokesDrop();
	//alert(this.currentPos);
	requestAnimFrame(this.update.bind(this));
	//alert("update2");
}

//alert("TitlePage");
TitlePage.setup();
//alert("TitlePage");
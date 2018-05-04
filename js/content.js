
ContentPage = {};



ContentPage.content = document.getElementById('contentPage');
ContentPage.bird = document.createElement('img');

ContentPage.cards = [];

ContentPage.pngSize = [751,1334];
ContentPage.birdTop = 408;

ContentPage.cardsPath = 'img/cards/';
ContentPage.cardsPic = [
	'activity one(T,578;L,108).png',
	'activity two(T,506;L,202).png',
	'activity three(T,519;L,292).png',
	'activity four(T,514;L,595).png',
	'activity five(T,495;L,500).png',
	'activity six(T,471;L,585).png'
]
ContentPage.cardsPos = [
[108,658],[202,684],[292,697],
[395,689],[500,673],[585,648]
];
ContentPage.cardsSize = [
[68,258],[75,252],[70,228],
[75,247],[70,211],[71,189]
];

ContentPage.active = false;

ContentPage.setup = function(text){
	this.text = text;
	this.active = true;
	this.createBirdDiv();
	this.setupBirdInfo();
	this.setupTextData();
	this.setupBirdData();
	this.setupMoveData();
	this.setupCardsData();
	requestAnimationFrame(this.update.bind(this));
}
ContentPage.setupTextData = function(){
	this.text.style.animationName = 'titleText-upMove';
	this.text.style.animationDuration = '1s';
	this.text.style.animationFillMode = 'both';
	this.text.style.animationTimingFunction = 'linear';
	this.text.style.animationIterationCount = '1';
	//this.content.appendChild(this.text);
}
ContentPage.createBirdDiv = function(){
	this.birdDiv = document.createElement('div');
	this.birdDiv.id = 'birdDiv';
	this.content.appendChild(this.birdDiv);
}
ContentPage.setupBirdInfo = function(){
	this.birdTop = (this.birdTop/this.pngSize[1]);
}
ContentPage.setupBirdData = function(){
	this.bird.src = 'img/birdPic.png'; 
	this.bird.id = 'bird';
	this.bird.style.top = this.birdTop*100+'%';
	this.birdDiv.appendChild(this.bird);
}
ContentPage.setupMoveData = function(){
	this.birdCount = 0;
}
ContentPage.setupCardsData = function(){
	this.setupCardsPosInfo();
	this.createCards();
}
ContentPage.setupCardsPosInfo = function(){
	this.cardsParams = [];
	for(var i=0;i<this.cardsPic.length;i++){
		var rate = this.cardsSize[i][0]/this.cardsSize[i][1];
		this.cardsParams[i] = {};
		this.cardsParams[i].fx = this.cardsPos[i][0]/this.pngSize[0];
		this.cardsParams[i].fy = this.cardsPos[i][1]/this.pngSize[1];
		this.cardsParams[i].fw = this.cardsSize[i][0]/this.pngSize[0];
		this.cardsParams[i].fh = this.cardsSize[i][1]/this.pngSize[1];
		//this.cardsParams[i].fw = this.cardsParams[i].fh*rate;
		//this.cardsParams[i].fh = this.cardsParams[i].fw*rate;

		this.cardsParams[i].x = 0;//this.strokesParams[i].fx;
		this.cardsParams[i].y = 0;//this.strokesParams[i].fy;
		this.cardsParams[i].dir = Math.round(Math.random()*2)==0?-1:1;
		this.cardsParams[i].angle = this.cardsParams[i].dir*(Math.random()*Math.PI/36+Math.PI/24);
		this.cardsParams[i].realAngle = 0;
	}
}
ContentPage.createCards = function(){
	for(var i=0;i<this.cardsParams.length;i++){
		var data = this.cardsParams[i];
		var img = document.createElement('img');
		img.src = this.cardsPath+this.cardsPic[i];
		img.className = 'card';
		img.style.top = data.fy*100+'%';
		img.style.left = data.fx*100+'%';
		img.style.width = data.fw*100+'%';
		img.style.height = data.fh*100+'%';
		this.birdDiv.appendChild(img);
		this.cards[i] = img;
	}
}
ContentPage.updateBirdAni = function(){
	var y = 0.6*Math.sin(this.birdCount++/20);
	this.birdDiv.style.transform = 'translate(0,'+y+'%)';
}

ContentPage.cardNeedNextAngle = function(id){
	var data = this.cardsParams[id];
	return Math.abs(data.angle-data.realAngle)<=0.1;
}

ContentPage.updateCardAni = function(id){
	var data = this.cardsParams[id];
	if(this.cardNeedNextAngle(id)){
		data.dir = -data.dir;
		data.angle = data.dir*(Math.random()*Math.PI/48+Math.PI/24);
	}
	data.realAngle += (data.angle-data.realAngle)/100;
}
ContentPage.updateCardPosition = function(id){
	var data = this.cardsParams[id];
	var ele = ContentPage.cards[id];
	ele.style.transform = 'rotate('+data.realAngle+'rad)';
	//ele.style.transform = 'translate('+data.fx*100+'%,'+data.fy*100+'%) rotate('+data.realAngle+'rad) scale('++')';
}
ContentPage.updateCardsAni = function(){
	for(var i=0;i<this.cardsParams.length;i++){
		this.updateCardAni(i);
		this.updateCardPosition(i);
	}
}
ContentPage.update = function(){
	if(!this.active) return;
	this.updateBirdAni();
	this.updateCardsAni();
	requestAnimationFrame(this.update.bind(this));
}
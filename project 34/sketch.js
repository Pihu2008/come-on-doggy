//Create variables here
var dog, foodS, foodStock, dogImg, happyDogImg, database;
var feed, addFood, fedTime, lastFed, foodObj;
var bedroom, washroom, garden;
var readGameState, changeGameState;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
bedroom = loadImage("images/bedroom.png");
washroom = loadImage("images/washroom.png");
garden = loadImage("images/garden.png");
}

function setup() {

  database = firebase.database();
  createCanvas(1000, 400);
  foodObj = new Food();
  foodStock = database.ref('food');
    foodStock.on("value",readStock);
  dog = createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;
    feed = createButton(" Feed the Dog ");
    feed.position(800, 95);
    feed.mousePressed(feedDog);
    addFood = createButton(" Add Food ");
    addFood.position(900,95);
    addFood.mousePressed(addFoods);
    readGameState = database.ref('gameState');
    readGameState.on("value",function(data){
      gameState = data.val();
    });
    
}


function draw() {  
background(46, 139, 87);
fedTime = database.ref('feedTime');
fedTime.on("value",function(data){
  lastFed = data.val();
});
fill(255,255,254);
  textSize(40);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 50,40);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",50,80);
   }else{
     text("Last Feed : "+ lastFed + " AM", 50,40);
   }
   currentTime=hour();
   if(currentTime==(lastFed+1)){
update("playing");
foodObj.garden();
  }else if(currentTime==lastFed+2){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
  }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}
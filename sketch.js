var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var mode = null;
var controls = null;

var engine;

//width and length of table play area
var tableW = 750;
var tableL = tableW / 2;

//top left position of table play area
var tablePosX = 100;
var tablePosY = 120;

//ball diameter
var ballDia = tableW / 36;

//pocket diameter
var pocketSize = ballDia * 1.5;

//baulk line position and length
var baulkW = tableW/5 + tablePosX;
var baulkL = tablePosY + tableL - 10;

//centre of table on baulk line
var markCtrX = baulkW;
var markCtrY = (tablePosY + baulkL + 10)/2; 

//var for cueball
var cueBall;

var redBalls = [];
var colouredBalls = [];
var cueBallPst = [];
var pockets = [];
var walls = [];

var originalCueBallPosition = {x: baulkW - 25, y: tablePosY + tableL/2 + 30};

var colouredBallsPositions = [{x: 3 * (tablePosX + tableW)/4, y: markCtrY},
                            {x: 9 * (tablePosX + tableW)/10, y: markCtrY},
                            {x: (tablePosX + tableW)/2 + 50, y: markCtrY},
                            {x: markCtrX, y: markCtrY - tableW/12.5},
                            {x: markCtrX, y: markCtrY + tableW/12.5},
                            {x: baulkW, y: tablePosY + tableL/2}];

function preload(){
	//preload the song
	sound1 = loadSound('assets/hipsybeats-stomp.mp3');
}

function setup()
{
    createCanvas(1000, 600);
    engine = Engine.create();
    engine.world.gravity.y = 0;

    setupWalls();
    setupCueBall();
    mode1RedBalls();
    mode1ColouredBalls();

    pockets = 
        [
            createVector(tablePosX + 10, tablePosY + 10),
            createVector(tablePosX + tableW - 10, tablePosY + 10),
            createVector(tablePosX + 10, tablePosY + tableL - 10),
            createVector(tablePosX + tableW - 10, tablePosY + tableL - 10),
            createVector(tablePosX + tableW / 2, tablePosY + 10),
            createVector(tablePosX + tableW / 2, tablePosY + tableL - 10)
        ];
}

function draw()
{
    background(69, 69, 69);
    Engine.update(engine);

    drawTable();
    drawPockets();
    drawTableMarkings();
    drawWalls();
    drawCueBall();
    forceLine();
    cueStick();
    drawMode1RedBalls();
    drawMode1ColouredBalls();
    checkPocketCollisions();
    musicMenu();
}

//sets up the cueBall
function setupCueBall()
{
    cueBall = Bodies.circle(baulkW - 25, tablePosY + tableL/2 + 30, ballDia/2, {restitution: 0.2, friction: 13});

    World.add(engine.world, [cueBall]);  
    cueBallPst.push(cueBall);
}

//text display of title and music prompt
function musicMenu()
{
    fill(255);
    textSize(40);
    text('Welcome to Snookerdoodle!', 250, 50);

    textSize(20);
    text('press 1 for some jams while you play :D', 320, 80);
}

//draw codes for all coloured balls
function drawMode1ColouredBalls()
{
    if(pinkBall) 
    {
        fill(255, 171, 171);
        drawVertices(pinkBall.vertices);
    }

    if(blackBall) 
    {
        fill(30);
        drawVertices(blackBall.vertices);
    }

    if(blueBall) 
    {
        fill(64, 137, 255);
        drawVertices(blueBall.vertices);
    }

    if(greenBall) 
    {
        fill(5, 173, 11);
        drawVertices(greenBall.vertices);
    }

    if(yellowBall) 
    {
        fill(237, 237, 40);
        drawVertices(yellowBall.vertices);
    }

    if(brownBall) 
    {
        fill(110, 80, 8);
        drawVertices(brownBall.vertices);
    }
}

//sets up coloured balls
function mode1ColouredBalls()
{ 
    pinkBall = Bodies.circle(3 * (tablePosX + tableW)/4, markCtrY, ballDia/2, {restitution: 1, friction: 1.7})
    colouredBalls.push(pinkBall);

    World.add(engine.world, pinkBall);

    blackBall = Bodies.circle(9 * (tablePosX + tableW)/10, markCtrY, ballDia/2, {restitution: 1, friction: 1.7})
    colouredBalls.push(blackBall);
    
    World.add(engine.world, blackBall);

    blueBall = Bodies.circle((tablePosX + tableW)/2 + 50, markCtrY, ballDia/2, {restitution: 1, friction: 1.7})
    colouredBalls.push(blueBall);
    
    World.add(engine.world, blueBall);

    greenBall = Bodies.circle(markCtrX, markCtrY - tableW/12.5, ballDia/2, {restitution: 1, friction: 1.7})
    colouredBalls.push(greenBall);
    
    World.add(engine.world, greenBall);

    yellowBall = Bodies.circle(markCtrX, markCtrY + tableW/12.5, ballDia/2, {restitution: 1, friction: 1.7})
    
    World.add(engine.world, yellowBall);

    brownBall = Bodies.circle(baulkW, tablePosY + tableL/2, ballDia/2, {restitution: 1, friction: 1.7})
    colouredBalls.push(brownBall);
    
    World.add(engine.world, brownBall);
}

//draw codes for all red balls
function drawMode1RedBalls()
{
    noStroke();

    //red balls
    fill(173, 40, 0);
    for(var i = 0 ; i < redBalls.length ; i++)
    {
        drawVertices(redBalls[i].vertices);
    }
}

//sets up red balls
function mode1RedBalls()
{
    for(var i = 0 ; i < 5 ; i++)
    {
        for(var j = 0 ; j <= i ; j++)
        {
            var redBall = Bodies.circle((3 * (tablePosX + tableW)/4) - (j * 18) + 90, 
            markCtrY + (i * 20 - j * 10) - (2 * ballDia) + 2, 
            ballDia/2, {restitution: 0.9, friction: 2});

            redBalls.push(redBall);
        }
    }

    World.add(engine.world, redBalls);
}

//draw codes for table walls
function drawWalls()
{
    noStroke();
    fill(33, 97, 50);
    for(var i = 0 ; i < walls.length ; i++)
    {
        drawVertices(walls[i].vertices);
    }
}

//sets up table walls
function setupWalls()
{
    noStroke();
    //top walls
    var wall1 = Bodies.fromVertices(tableL + tablePosX - 179, tablePosY + 11, [{x: tablePosX + 23, y: tableL - tablePosX * 2.5 - 5}, 
                                                                            {x: tablePosX + tableW/2 - 13, y: tableL - tablePosX * 2.5 - 5},
                                                                            {x: tablePosX + tableW/2 - 21, y: tableL - tablePosX * 2.5 + 18},
                                                                            {x: tablePosX + 45, y: tableL - tablePosX * 2.5 + 18}], 
                                                                            {isStatic: true, restitution: 0.6,});
    var wall2 = Bodies.fromVertices(tableL + tablePosX + 179, tablePosY + 11, [{x: tablePosX + 13 + tableW/2, y: tableL - tablePosX * 2.5 - 5},
                                                                            {x: tablePosX + tableW - 23, y: tableL - tablePosX * 2.5 - 5},
                                                                            {x: tablePosX + tableW - 45, y: tableL - tablePosX * 2.5 + 18},
                                                                            {x: tablePosX + 21 + tableW/2, y: tableL - tablePosX * 2.5 + 18}], 
                                                                            {isStatic: true, restitution: 0.6,});
    //bottom walls
    var wall3 = Bodies.fromVertices(tableL + tablePosX - 179, tableL + tablePosY - 11, [{x: tablePosX + 23, y: tableL * 2 - tablePosX * 2.5 - 5},
                                                                            {x: tablePosX + tableW/2 - 13, y: tableL * 2 - tablePosX * 2.5 - 5},
                                                                            {x: tablePosX + tableW/2 - 21, y: tableL * 2 - tablePosX * 2.5 - 28},
                                                                            {x: tablePosX + 45, y: tableL * 2 - tablePosX * 2.5 - 28}], 
                                                                            {isStatic: true, restitution: 0.6,});
    var wall4 = Bodies.fromVertices(tableL + tablePosX + 179, tableL + tablePosY - 11, [{x: tablePosX + 13 + tableW/2, y: tableL * 2 - tablePosX * 2.5 - 5},
                                                                                    {x: tablePosX + tableW - 23, y: tableL * 2 - tablePosX * 2.5 - 5},
                                                                                    {x: tablePosX + tableW - 45, y: tableL * 2 - tablePosX * 2.5 - 28},
                                                                                    {x: tablePosX + 21 + tableW/2, y: tableL * 2 - tablePosX * 2.5 - 28}], 
                                                                                    {isStatic: true, restitution: 0.6,});
    //side walls
    var wall5 = Bodies.fromVertices(tablePosX + 11, tableL - tablePosX/2 - 17, [{x: tablePosX, y: tableL - tablePosX * 2.25 - 7},
                                                                            {x: tablePosX + 22.5, y: tableL - tablePosX * 2.25 + 15},
                                                                            {x: tablePosX + 22.5, y: tableL + tablePosX - 24},
                                                                            {x: tablePosX, y: tableL + tablePosX - 2}], 
                                                                            {isStatic: true, restitution: 0.6,});
    var wall6 = Bodies.fromVertices(tableW + tablePosX - 11, tableL - tablePosX/2 - 17, [{x: tablePosX + tableW, y: tableL - tablePosX * 2.25 - 7},
                                                                            {x: tablePosX - 22.5 + tableW, y: tableL - tablePosX * 2.25 + 15},
                                                                            {x: tablePosX - 22.5 + tableW, y: tableL + tablePosX - 24},
                                                                            {x: tablePosX + tableW, y: tableL + tablePosX - 2}], 
                                                                            {isStatic: true, restitution: 0.6,});
    walls.push(wall1);
    walls.push(wall2);
    walls.push(wall3);
    walls.push(wall4);
    walls.push(wall5);
    walls.push(wall6);

    World.add(engine.world, [wall1, wall2, wall3, wall4, wall5, wall6]);
}

//draw codes for table markings
function drawTableMarkings()
{
    //baulk line
    stroke(222, 222, 222);
    strokeWeight(3);
    line(baulkW, tablePosY + 10, baulkW, baulkL);

    //D zone
    noFill();
    arc(markCtrX, markCtrY, tableW/12.5 * 2, tableW/12.5 * 2, HALF_PI, -HALF_PI);

    //cueball / brown ball mark
    ellipse(markCtrX, markCtrY, 5);

    //pink ball zone
    ellipse(3 * (tablePosX + tableW)/4, markCtrY, 6);
}

//draw codes for table
function drawTable()
{
    noStroke();

    //table wood
    fill(59, 42, 2);
    rect(tablePosX - 30, tablePosY - 25 , tableW + 60, tableL + 50, 20);

    //table play area
    fill(24, 77, 38);
    rect(tablePosX, tablePosY, tableW, tableL, 10);
}

//draw codes for pockets
function drawPockets()
{
    fill(0)
    noStroke();

    //corner pockets
    circle(tablePosX + 10, tablePosY + 10, pocketSize);
    circle(tablePosX + tableW - 10, tablePosY + 10, pocketSize);
    circle(tablePosX + 10, tablePosY + tableL - 10, pocketSize);
    circle(tablePosX + tableW - 10, tablePosY + tableL - 10, pocketSize);

    //middle pockets
    circle(tablePosX + tableW/2, tablePosY + 10, pocketSize);
    circle(tablePosX + tableW/2, tablePosY + tableL - 10, pocketSize);
}

//draw codes for cueball
function drawCueBall()
{
    noStroke();
    fill(255);
    drawVertices(cueBall.vertices);
}

//draw codes for the force line
function forceLine()
{
    stroke(255);
    strokeWeight(3);

    cueLine = false;

    //start and end coordinates of forceline
    var startX = mouseX;
    var startY = mouseY;
    var endX = cueBall.position.x;
    var endY = cueBall.position.y;

    if(mouseIsPressed)
    {
        cueLine = true;
        //where force is coming from
        line(startX, startY, endX, endY);
    } 
    else 
    {
        cueLine = false;
    }
}

//draw codes for the cuestick
function cueStick()
{
    ballLine = false; 

    //start and end coordinates of ball direction
    var startX = mouseX;
    var startY = mouseY;
    var endX = cueBall.position.x;
    var endY = cueBall.position.y;

    // Calculate the midpoint of the first line
    var midX = (startX + endX) / 2;
    var midY = (startY + endY) / 2;

    // Calculate the destination coordinates for the second line (2x length)
    var destX = cueBall.position.x + 5 * (cueBall.position.x - midX);
    var destY = cueBall.position.y + 5 * (cueBall.position.y - midY);

    if(mouseIsPressed)
    {
        ballLine = true;
        // Where ball is going towards (2x length)
        line(cueBall.position.x, cueBall.position.y, destX, destY);
    } 
    else 
    {
        ballLine = false;
    }
}

//code for mouse interaction with cuestick and force line
function cueBallMouse()
{
    var force = 7000;
    var forceX = (cueBall.position.x - mouseX)/force;
    var forceY = (cueBall.position.y - mouseY)/force;
    var appliedForce = {x: forceX, y: forceY};
    print(forceX, forceY);
    print(mouseX, mouseY);

    Body.applyForce(cueBall, {x: cueBall.position.x, y: cueBall.position.y}, appliedForce);
}

function keyPressed()
{
    console.log(key)
	if(key = '1' && (sound1.isPlaying())) 
    {
        sound1.stop();
    }
    else if(key = '1')
    {
        sound1.loop();
    }
}

function mouseClicked()
{
    cueBallMouse();
}

function collisionDetection()
{
    for(var i = 0 ; i < redBalls.length ; i++)
    {
        var c = Matter.Collision.collides(cueBall.cueBall, redBalls[i]);

        if(c != null)
        {
            print('collide with ball index ' + i);
        }
    }
}

//code to check whether any balls go into the pockets and removes them (red balls) or places them back in their original positions (cueball and coloured balls)
function checkPocketCollisions()
{
    //for original redBalls
    for(var i = redBalls.length - 1; i >= 0; i--) 
    {
        for(var j = 0; j < pockets.length; j++) 
        {
            if(isRedBallInPocket(redBalls[i], pockets[j])) 
            {
                console.log('red pocketed')
                World.remove(engine.world, redBalls[i]);
                redBalls.splice(i, 1);
                break;  //break out of the inner loop since the ball is in one pocket only
            }
        }
    }

    //for original colouredBalls
    for (var i = colouredBalls.length - 1; i >= 0; i--) 
    {
        for (var j = 0; j < pockets.length; j++) {
            if (isColouredBallInPocket(colouredBalls[i], pockets[j])) {
                // Reset the position of the colored ball to its starting position
                if(i == 0)
                {   
                    //returns pink ball to orig position
                
                    console.log('pink pocketed');
                }
                else if(i == 1)
                {
                    //returns black ball to orig position
                    
                    console.log('black pocketed');
                }
                else if(i == 2)
                {
                    //returns blue ball to orig position
                
                    console.log('blue pocketed');
                }
                else if(i == 3)
                {
                    //returns green ball to orig position
            
                    console.log('green pocketed');
                }
                else if(i == 4)
                {
                    //returns yellow ball to orig position
                  
                    console.log('yellow pocketed');
                }
                else if(i == 5)
                {
                    //returns brown ball to orig position
                
                    console.log('brown pocketed');
                }

                Body.setPosition(colouredBalls[i], colouredBallsPositions[i]);
                Body.setVelocity(colouredBalls[i], { x: 0, y: 0 });

                break;
            }
        }
    }
   
    //for cueBall
    for (var j = 0; j < pockets.length; j++) 
    {
        if (isCueBallInPocket(cueBallPst[0], pockets[j])) 
        {
            console.log('cueball pocketed');

            // Reset the position of the cue ball to its starting position
            Body.setPosition(cueBallPst[0], originalCueBallPosition);
            Body.setVelocity(cueBallPst[0], { x: 0, y: 0 });

            break;
        }
    }
}

//parameters for checking red ball
function isRedBallInPocket(redBall, pocket) 
{
    var distance = dist(redBall.position.x, redBall.position.y, pocket.x, pocket.y);
    return distance < pocketSize / 2;
}

//parameters for checking coloured ball
function isColouredBallInPocket(colouredBall, pocket) 
{
    var distance = dist(colouredBall.position.x, colouredBall.position.y, pocket.x, pocket.y);
    return distance < pocketSize / 2;
}

//parameters for checking cueball
function isCueBallInPocket(cueBall, pocket)
{
    var distance = dist(cueBall.position.x, cueBall.position.y, pocket.x, pocket.y);
    return distance < pocketSize / 2;
}

//////// DO NOT WRITE BELOW HERE //////////
function drawVertices(vertices)
{
    beginShape();
    for(var i = 0 ; i < vertices.length ; i++)
    {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}
                            
//inilize variables
const ROUND_NUM=2
const relaxTime=60000;
const breathNum=6;
const fontSize=35;
const fontStr=fontSize+'px Calibri';
const Wmargin=50;//5px margin
const Hmargin=50;//5px margin
const BUTTON_FONT='Arial'
var stage;
var mainCV;
var startPage,endPage;
var SUBJ_ID

//var cir
//////////////////////param definition/////////
var page
var timerRectCmd;
var timerRect;
var filter;
//////////////////////

//FILE

var subjFileEntry=null;
var subjFileWriter=null;
var subjFileName;
var fileSetupDone;


function loadSounds()
{
  createjs.Sound.registerSound("assets/click2.wav", "hit");
  createjs.Sound.registerSound("assets/error.wav", "wrong");
  createjs.Sound.registerSound("assets/success-norm.wav", "right");
  createjs.Sound.registerSound("assets/timeout.wav", "timeout");


}
  function createButton(shape, width,height){
    shape.graphics.beginStroke("black").setStrokeStyle(1).f("lightGray").drawRoundRect(0,0,width,height, 15);
    return shape
}
/////////////////////////////////



  function onStartClicked(e){
    SUBJ_ID=document.getElementById("subjID").value
    if(isNaN(SUBJ_ID)){
      alert('Enter a valid number for subject ID.')
      return;
    }
    SUBJ_ID= +SUBJ_ID;
    subjFileName=SUBJ_ID+'_breath.txt';
    createFile();
  }
function afterFileSetup(){
  //alert('after file setup with value: '+ fileSetupDone)
  if (fileSetupDone==false){
    var r = confirm("Do you want to continue without saving?");
    if(r==false){
      return;
    }
    else {
      startPage.clear();
      //setTimeout(function(){trial=new Trial(0);},10)
      setTimeout(function(){page=new Page();},10)
      return;
    }
  }
  //createjs.Sound.play("hit");

  startPage.clear();
  saveSubjInfo();
  setTimeout(function(){page=new Page();},10)
}

class Page{
  constructor(){
    createjs.Ticker.addEventListener("tick", handleTick);

//top button

//    this.but1=new createjs.Shape();
//    this.text1=new createjs.Text("", "30px "+BUTTON_FONT, "#002b2b");
//    this.but1=createButton(this.but1,250,80)
//
//    this.topButX=mainCV.width/2-150/2;
//    this.toptButY=mainCV.height/3;
//   this.topTextX=mainCV.width/3//-this.but1.getBounds().width/2;
    this.topTextY=50;
  //low button

//      this.but2=new createjs.Shape();
//  this.text2=new createjs.Text("", "30px "+BUTTON_FONT, "#002b2b");
//  this.but2=createButton(this.but2,250,80)
//  this.lowButX=mainCV.width/2-150/2;
//  this.lowButY=mainCV.height/3+200;
//  this.lowTextX=mainCV.width/2-this.text2.getBounds().width/2;
//  this.lowTextY=this.lowButY+60/4.5;

  //center text
  this.centerText=new createjs.Text("Finished", "30px "+BUTTON_FONT, "black");
  this.centerTextY=mainCV.height/3-this.centerText.getBounds().height/2;
  this.centerText.x=mainCV.width/2-this.centerText.getBounds().width/2;
  this.centerText.y=this.centerTextY;
  //circle!
    timerRect=new createjs.Shape();
      this.cirR1=50;
      this.cirR2=250;
      timerRect.r=this.cirR1;
    //  timerRectCmd= timerRect.graphics.beginFill('lightblue').drawCircle(mainCV.width/2,mainCV.height/2,timerRect.r).command;
     timerRectCmd= timerRect.graphics.beginRadialGradientFill(['lightblue', 'blue'],[0,1],mainCV.width/2,mainCV.height/2,0,mainCV.width/2,mainCV.height/2,this.cirR2).drawCircle(mainCV.width/2,mainCV.height/2,timerRect.r).command;
      timerRectCmd.radius=timerRect.r;
    //color filter
    //filter = new createjs.ColorFilter(1,0,0,1); //green&blue = 0, only red and alpha stay
  //  timerRect.filters = [filter];

this.round=0;
this.passedBreath=0;
      this.play();
  }
  play(){
    this.centerText.text='Tap to start';
      this.centerText.x=Page.textCenterX(this.centerText);
    stage.addChild(this.centerText);
      mainCV.addEventListener('click',RelaxPhase, false);
    stage.update();

  }

  static textCenterX(txtShape){
      return mainCV.width/2-txtShape.getBounds().width/2;
  }

}
function handleTick(event) {
  stage.update();
    // Actions carried out each tick (aka frame)
    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
    }
}

function RelaxPhase(){
  mainCV.removeEventListener('click',RelaxPhase, false);
    if(page.round==ROUND_NUM){
      stage.removeAllChildren();
      page.centerText.y=page.centerTextY
        finishGame();
        return;
    }
    var str='';
    str=str+'Round: '+ page.round+'\n';
    str=str+'Relax: '+Date.now()+'\n';
    appendToFile(new Blob([str],{ type: 'text/plain' }))
    stage.addChild(page.centerText);
    page.round=page.round+1;
      page.centerText.text='Relax';
      page.centerText.x=Page.textCenterX(page.centerText);
     stage.update();
    setTimeout(guidedPhase, relaxTime);
  }

function guidedPhase(){
  createjs.Sound.play("timeout");
   var str='';
   str=str+'Guided: '+ Date.now()+'\n';
   appendToFile(new Blob([str],{ type: 'text/plain' }))
    page.passedBreath=0;
    stage.removeAllChildren();
    stage.addChild(timerRect);
    stage.addChild(page.centerText)
    inhale();
          //.addEventListener("change", drawTimer)
}
function inhale(){

  if(page.passedBreath>=breathNum){
    stage.removeAllChildren();
    page.centerText.y=page.centerTextY;
    RelaxPhase();
    return;
  }
  page.passedBreath++;
    page.centerText.text='Breath in'
    page.centerText.x=Page.textCenterX(page.centerText);
    page.centerText.y=page.topTextY

    createjs.Tween.get(timerRectCmd,{ useTicks:false})
    .to({radius: page.cirR2},4000,createjs.Ease.quadInOut ).call(exhale)
}
function exhale(){
  page.centerText.text='Breath out'
  page.centerText.x=Page.textCenterX(page.centerText);
  page.centerText.y=page.topTextY

  createjs.Tween.get(timerRectCmd,{ useTicks:false})
  .to({radius: page.cirR1},6000, createjs.Ease.quadInOut ).call(inhale);

  //createjs.Tween.get(filter)
  //  .to({redMultiplier:0, greenMultiplier:1 }, 5000);
}

class StartPage{
  constructor(){
    this.startBut=new createjs.Shape();
    this.startText=new createjs.Text("Start", "20px "+BUTTON_FONT, "#002b2b");
    this.startBut=createButton(this.startBut,150,60)
    this.startBut.x=mainCV.width/2-150/2;
    this.startBut.y=mainCV.height*2/3;
    this.startText.x=mainCV.width/2-this.startText.getBounds().width/2;
    this.startText.y=this.startBut.y+60/4.5;
    //alert("just started!")
    this.startBut.addEventListener("click",onStartClicked,true);

    this.domElement = new createjs.DOMElement(document.getElementById('myForm'));
    this.domElement.x = mainCV.width/2-100;
    this.domElement.y = 100;
    fileSetupDone=null;
  }
   addToStage(){
      stage.addChild(this.domElement);
      stage.addChild(this.startBut);
      stage.addChild(this.startText);
      this.domElement.htmlElement.style.visibility = "visible";
      stage.update();
    }
    clear(){
      this.startBut.removeEventListener("click",onStartClicked,true);
      stage.removeAllChildren();
      //this.domElement.htmlElement.style.visibility = "hidden";
      this.domElement.visible=false;
      stage.update();
    }
}
class EndPage{
  constructor(){
    this.gameOverText=new createjs.Text("Finished", "30px "+BUTTON_FONT, "black");
      this.gameOverText.x=mainCV.width/2-this.gameOverText.getBounds().width/2;
      this.gameOverText.y=mainCV.height/3-this.gameOverText.getBounds().height/2;
      this.againText=new createjs.Text("Play again", "20px "+BUTTON_FONT, "#002b2b");
      this.againText.x=mainCV.width/2-this.againText.getBounds().width/2;
      this.againText.y=this.gameOverText.y+120;
      this.againRect=new createjs.Shape();
      this.againRect=createButton(this.againRect,150,60)
      this.againRect.x=mainCV.width/2-150/2;
      this.againRect.y=this.againText.y-60/4.5;

      this.shareText=new createjs.Text("Share Results", "20px "+BUTTON_FONT, "#002b2b");
      this.shareText.x=mainCV.width/2-this.shareText.getBounds().width/2;
      this.shareText.y=this.againText.y+120;
      this.shareRect=new createjs.Shape();
      this.shareRect=createButton(this.shareRect,150,60)
      this.shareRect.x=mainCV.width/2-150/2;
      this.shareRect.y=this.shareText.y-60/4.5;

  }
 addToStage(){
    stage.addChild(this.gameOverText);
    //stage.addChild(this.againRect);
    //stage.addChild(this.againText)

    stage.addChild(this.shareRect);
    stage.addChild(this.shareText)
    //this.againRect.addEventListener("click",playAgain);
    this.shareRect.addEventListener("click",fileShare);
    stage.update();
  }
}

function startGame(){

  screen.orientation.lock("portrait");
  loadSounds();
  mainCV =document.getElementById('mainCV')
  stage = new createjs.Stage(mainCV);
  stage.canvas.height =window.innerHeight;
  stage.canvas.width=window.innerWidth;
  startPage=new StartPage();
  startPage.addToStage();
}

function finishGame(){
  var str='';
  str=str+'Finished: '+Date.now()+'\n';
  appendToFile(new Blob([str],{ type: 'text/plain' }))
  stage.removeAllChildren();
  stage.update();
endPage= new EndPage()
endPage.addToStage();
fileShare();
//emailRes();
}
function playAgain(e){
  createjs.Sound.play("hit");
  endPage.againRect.removeEventListener("click",playAgain);
  stage.removeAllChildren();
  stage.update();
  setTimeout(onRestart,10);

}
function onRestart(){
  startPage=new StartPage();
    startPage.addToStage();
}
////////////////////////////////////////////////
//
document.addEventListener("deviceready", onDeviceReady, false);
    // device APIs are available
    //
    function onDeviceReady() {
        // Empty
        startGame()

    }
////////////////FILE new

function createFile(){
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}
function gotFS(fileSystem) {
  //  alert(" got file system! root is "+fileSystem.root)
    fileSystem.root.getFile(subjFileName, {create: true, exclusive: false}, gotFileEntry, fail);
}
function gotFileEntry(fileEntry) {
    subjFileEntry= fileEntry.createWriter(gotFileWriter, fail);
  //  alert("got file entry")
}
function gotFileWriter(writer) {
    subjFileWriter=writer;
    fileSetupDone=true;
    afterFileSetup();
}
function fail(error) {
       alert("Not able to save to file. Error: "+error.code);
       fileSetupDone=false;
       afterFileSetup();
}
////////////////////////////
function fileExists(){
  try {
              subjFileWriter.seek(subjFileWriter.length);
          }
  catch (e) {
              return false;
          }
  return true;

}
function appendToFile(dataObj){
    //alert('starting to write..')
    if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }
        subjFileWriter.onwriteend = function() {
            //alert("Successful file write...");
        };
    subjFileWriter.write(dataObj);
}


function saveSubjInfo(){
  str='';
  str=str+'Subj_id: '+ SUBJ_ID+'\n';
  str= str+new Date().toJSON()+'\n';
  var personalData= new Blob([str], { type: 'text/plain' });
  appendToFile(personalData);
}

//file sharing
// this is the complete list of currently supported params you can pass to the plugin (all optional)
function emailRes(){
  window.plugin.email.isServiceAvailable(
    function (isAvailable) {
        alert('is available')
    }
);
    cordova.plugins.email.open({
      to:          'ss3767@cornell.edu', // email addresses for TO field
    //  cc:          Array, // email addresses for CC field
    //  bcc:         Array, // email addresses for BCC field
      attachments: 'app://Documents/'+subjFileName, // file paths or base64 data streams
      subject:    'd2 test data file (SUBJECT: '+SUBJ_ID+')', // subject of the email
      body:       ' ', // email body (for HTML, set isHtml to true)
  }, callback, scope);

}
function fileShare(){
  var options = {
  message: 'share data', // not supported on some apps (Facebook, Instagram)
  subject: 'd2 Test iPad data', // fi. for email
  files: [cordova.file.documentsDirectory+subjFileName], // an array of filenames either locally or remotely
  };

  var onSuccess = function(result) {
  //  alert("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    //alert("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  };

  var onError = function(msg) {
    alert("Sharing failed with message: " + msg);
  };

  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

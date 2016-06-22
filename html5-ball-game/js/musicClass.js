/*一个音乐播放控制的类，需要尽早new出一个对象，保证在音乐播放之前所有音乐已经载入完毕，且在建立该对象时音乐数目尽量少，够用即可*/

function MusicClass(musicInfList){
     this.musicInfList=musicInfList;      
	 this.inputMusic();
}

MusicClass.prototype.inputMusic=function(){
     var l=this.musicInfList.length;
	 for(var i=0;i<l;i+=4)
	 {
        document.write("<audio id="+this.musicInfList[i+1]+" loop='loop' > ");
		document.write("<source src="+this.musicInfList[i+2]+" type='audio/mpeg'>");
		document.write("<source src="+this.musicInfList[i+3]+" type='audio/ogg'>");
		document.write("</audio>");
	 }
};

MusicClass.prototype.play=function(musicName,currentTime,volume){
     var l=this.musicInfList.length;
	 
	 for(var i=0;i<l;i++)
	 {
	    if(musicName==this.musicInfList[i]);
		{
		   var slectMusic=document.getElementById(this.musicInfList[i+1]);
		   slectMusic.currentTime=currentTime;     //将时间调到0，以便重新播放
		   slectMusic.volume =volume;       //音量调节，最大为1
		   slectMusic.play();
		 
		}//if name
	 }//for i
};

MusicClass.prototype.pause=function(musicName){
     var l=this.musicInfList.length;
	 for(var i=0;i<l;i++)
	 {
	    if(musicName==this.musicInfList[i]);
		{
		   this.presentMusic=document.getElementById(this.musicInfList[i+1]);
		   this.presentMusicmusic.pause();
		}
	 }
};

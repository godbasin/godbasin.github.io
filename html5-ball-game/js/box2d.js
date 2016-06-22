
﻿
var b2Settings=Class.create();b2Settings.prototype={initialize:function(){}}
b2Settings.USHRT_MAX=0x0000ffff;b2Settings.b2_pi=Math.PI;b2Settings.b2_massUnitsPerKilogram=1.0;b2Settings.b2_timeUnitsPerSecond=1.0;b2Settings.b2_lengthUnitsPerMeter=30.0;b2Settings.b2_maxManifoldPoints=2;b2Settings.b2_maxShapesPerBody=64;b2Settings.b2_maxPolyVertices=8;b2Settings.b2_maxProxies=1024;b2Settings.b2_maxPairs=8*b2Settings.b2_maxProxies;b2Settings.b2_linearSlop=0.005*b2Settings.b2_lengthUnitsPerMeter;b2Settings.b2_angularSlop=2.0/180.0*b2Settings.b2_pi;b2Settings.b2_velocityThreshold=1.0*b2Settings.b2_lengthUnitsPerMeter/b2Settings.b2_timeUnitsPerSecond;b2Settings.b2_maxLinearCorrection=0.2*b2Settings.b2_lengthUnitsPerMeter;b2Settings.b2_maxAngularCorrection=8.0/180.0*b2Settings.b2_pi;b2Settings.b2_contactBaumgarte=0.2;b2Settings.b2_timeToSleep=0.5*b2Settings.b2_timeUnitsPerSecond;b2Settings.b2_linearSleepTolerance=0.01*b2Settings.b2_lengthUnitsPerMeter/b2Settings.b2_timeUnitsPerSecond;b2Settings.b2_angularSleepTolerance=2.0/180.0/b2Settings.b2_timeUnitsPerSecond;b2Settings.b2Assert=function(a)
{if(!a){var nullVec;nullVec.x++;}};﻿
var b2Vec2=Class.create();b2Vec2.prototype={initialize:function(x_,y_){this.x=x_;this.y=y_;},SetZero:function(){this.x=0.0;this.y=0.0;},Set:function(x_,y_){this.x=x_;this.y=y_;},SetV:function(v){this.x=v.x;this.y=v.y;},Negative:function(){return new b2Vec2(-this.x,-this.y);},Copy:function(){return new b2Vec2(this.x,this.y);},Add:function(v)
{this.x+=v.x;this.y+=v.y;},Subtract:function(v)
{this.x-=v.x;this.y-=v.y;},Multiply:function(a)
{this.x*=a;this.y*=a;},MulM:function(A)
{var tX=this.x;this.x=A.col1.x*tX+A.col2.x*this.y;this.y=A.col1.y*tX+A.col2.y*this.y;},MulTM:function(A)
{var tX=b2Math.b2Dot(this,A.col1);this.y=b2Math.b2Dot(this,A.col2);this.x=tX;},CrossVF:function(s)
{var tX=this.x;this.x=s*this.y;this.y=-s*tX;},CrossFV:function(s)
{var tX=this.x;this.x=-s*this.y;this.y=s*tX;},MinV:function(b)
{this.x=this.x<b.x?this.x:b.x;this.y=this.y<b.y?this.y:b.y;},MaxV:function(b)
{this.x=this.x>b.x?this.x:b.x;this.y=this.y>b.y?this.y:b.y;},Abs:function()
{this.x=Math.abs(this.x);this.y=Math.abs(this.y);},Length:function()
{return Math.sqrt(this.x*this.x+this.y*this.y);},Normalize:function()
{var length=this.Length();if(length<Number.MIN_VALUE)
{return 0.0;}
var invLength=1.0/length;this.x*=invLength;this.y*=invLength;return length;},IsValid:function()
{return b2Math.b2IsValid(this.x)&&b2Math.b2IsValid(this.y);},clone:function(){return new b2Vec2(this.x,this.y);},
set:function(v){this.x=v.x;this.y=v.y;return this;},
add:function(v){this.x+=v.x;this.y+=v.y;return this;},
sub:function(v){this.x-=v.x;this.y-=v.y;return this;},
dot:function(v){return this.x*v.x+this.y*v.y;},
projection:function(v){return v.clone().norm().scale(this.clone().dot(v)/v.length());},
length:function(){return Math.sqrt(this.x*this.x+this.y*this.y);},
distance:function(v){var xx=this.x-v.x;var yy=this.y-v.y;return Math.sqrt(xx*xx+yy*yy);},
distance2:function(v){var xx=this.x-v.x;var yy=this.y-v.y;return xx*xx+yy*yy;},
theta:function(){return Math.atan2(this.y,this.x);},
thetaTo:function(vec){var v=this.clone().norm();var w=vec.clone().norm();return Math.acos(v.dot(w));},
thetaTo2:function(vec){return Math.atan2(vec.y,vec.x)-Math.atan2(this.y,this.x);},
norm:function(){var len=this.length();if(len==0)return this;this.x/=len;this.y/=len;return this;},
rotate:function(a){
var ca=Math.cos(a);var sa=Math.sin(a);
with(this){var rx=x*ca-y*sa;var ry=x*sa+y*ca;x=rx;y=ry;}
return this;},
invert:function(){this.x=-this.x;this.y=-this.y;return this;},
scale:function(s){this.x*=s;this.y*=s;return this;},x:null,y:null};b2Vec2.Make=function(x_,y_)
{return new b2Vec2(x_,y_);};﻿
var b2Mat22=Class.create();b2Mat22.prototype={initialize:function(angle,c1,c2)
{if(angle==null)angle=0;this.col1=new b2Vec2();this.col2=new b2Vec2();if(c1!=null&&c2!=null){this.col1.SetV(c1);this.col2.SetV(c2);}
else{var c=Math.cos(angle);var s=Math.sin(angle);this.col1.x=c;this.col2.x=-s;this.col1.y=s;this.col2.y=c;}},Set:function(angle)
{var c=Math.cos(angle);var s=Math.sin(angle);this.col1.x=c;this.col2.x=-s;this.col1.y=s;this.col2.y=c;},SetVV:function(c1,c2)
{this.col1.SetV(c1);this.col2.SetV(c2);},Copy:function(){return new b2Mat22(0,this.col1,this.col2);},SetM:function(m)
{this.col1.SetV(m.col1);this.col2.SetV(m.col2);},AddM:function(m)
{this.col1.x+=m.col1.x;this.col1.y+=m.col1.y;this.col2.x+=m.col2.x;this.col2.y+=m.col2.y;},SetIdentity:function()
{this.col1.x=1.0;this.col2.x=0.0;this.col1.y=0.0;this.col2.y=1.0;},SetZero:function()
{this.col1.x=0.0;this.col2.x=0.0;this.col1.y=0.0;this.col2.y=0.0;},Invert:function(out)
{var a=this.col1.x;var b=this.col2.x;var c=this.col1.y;var d=this.col2.y;var det=a*d-b*c;det=1.0/det;out.col1.x=det*d;out.col2.x=-det*b;out.col1.y=-det*c;out.col2.y=det*a;return out;},Solve:function(out,bX,bY)
{var a11=this.col1.x;var a12=this.col2.x;var a21=this.col1.y;var a22=this.col2.y;var det=a11*a22-a12*a21;det=1.0/det;out.x=det*(a22*bX-a12*bY);out.y=det*(a11*bY-a21*bX);return out;},Abs:function()
{this.col1.Abs();this.col2.Abs();},col1:new b2Vec2(),col2:new b2Vec2()};﻿
var b2Math=Class.create();b2Math.prototype={initialize:function(){}}
b2Math.b2IsValid=function(x)
{return isFinite(x);};b2Math.b2Dot=function(a,b)
{return a.x*b.x+a.y*b.y;};b2Math.b2CrossVV=function(a,b)
{return a.x*b.y-a.y*b.x;};b2Math.b2CrossVF=function(a,s)
{var v=new b2Vec2(s*a.y,-s*a.x);return v;};b2Math.b2CrossFV=function(s,a)
{var v=new b2Vec2(-s*a.y,s*a.x);return v;};b2Math.b2MulMV=function(A,v)
{var u=new b2Vec2(A.col1.x*v.x+A.col2.x*v.y,A.col1.y*v.x+A.col2.y*v.y);return u;};b2Math.b2MulTMV=function(A,v)
{var u=new b2Vec2(b2Math.b2Dot(v,A.col1),b2Math.b2Dot(v,A.col2));return u;};b2Math.AddVV=function(a,b)
{var v=new b2Vec2(a.x+b.x,a.y+b.y);return v;};b2Math.SubtractVV=function(a,b)
{var v=new b2Vec2(a.x-b.x,a.y-b.y);return v;};b2Math.MulFV=function(s,a)
{var v=new b2Vec2(s*a.x,s*a.y);return v;};b2Math.AddMM=function(A,B)
{var C=new b2Mat22(0,b2Math.AddVV(A.col1,B.col1),b2Math.AddVV(A.col2,B.col2));return C;};b2Math.b2MulMM=function(A,B)
{var C=new b2Mat22(0,b2Math.b2MulMV(A,B.col1),b2Math.b2MulMV(A,B.col2));return C;};b2Math.b2MulTMM=function(A,B)
{var c1=new b2Vec2(b2Math.b2Dot(A.col1,B.col1),b2Math.b2Dot(A.col2,B.col1));var c2=new b2Vec2(b2Math.b2Dot(A.col1,B.col2),b2Math.b2Dot(A.col2,B.col2));var C=new b2Mat22(0,c1,c2);return C;};b2Math.b2Abs=function(a)
{return a>0.0?a:-a;};b2Math.b2AbsV=function(a)
{var b=new b2Vec2(b2Math.b2Abs(a.x),b2Math.b2Abs(a.y));return b;};b2Math.b2AbsM=function(A)
{var B=new b2Mat22(0,b2Math.b2AbsV(A.col1),b2Math.b2AbsV(A.col2));return B;};b2Math.b2Min=function(a,b)
{return a<b?a:b;};b2Math.b2MinV=function(a,b)
{var c=new b2Vec2(b2Math.b2Min(a.x,b.x),b2Math.b2Min(a.y,b.y));return c;};b2Math.b2Max=function(a,b)
{return a>b?a:b;};b2Math.b2MaxV=function(a,b)
{var c=new b2Vec2(b2Math.b2Max(a.x,b.x),b2Math.b2Max(a.y,b.y));return c;};b2Math.b2Clamp=function(a,low,high)
{return b2Math.b2Max(low,b2Math.b2Min(a,high));};b2Math.b2ClampV=function(a,low,high)
{return b2Math.b2MaxV(low,b2Math.b2MinV(a,high));};b2Math.b2Swap=function(a,b)
{var tmp=a[0];a[0]=b[0];b[0]=tmp;};b2Math.b2Random=function()
{return Math.random()*2-1;};b2Math.b2NextPowerOfTwo=function(x)
{x|=(x>>1)&0x7FFFFFFF;x|=(x>>2)&0x3FFFFFFF;x|=(x>>4)&0x0FFFFFFF;x|=(x>>8)&0x00FFFFFF;x|=(x>>16)&0x0000FFFF;return x+1;};b2Math.b2IsPowerOfTwo=function(x)
{var result=x>0&&(x&(x-1))==0;return result;};b2Math.tempVec2=new b2Vec2();b2Math.tempVec3=new b2Vec2();b2Math.tempVec4=new b2Vec2();b2Math.tempVec5=new b2Vec2();b2Math.tempMat=new b2Mat22();﻿
var b2AABB=Class.create();b2AABB.prototype={IsValid:function(){var dX=this.maxVertex.x;var dY=this.maxVertex.y;dX=this.maxVertex.x;dY=this.maxVertex.y;dX-=this.minVertex.x;dY-=this.minVertex.y;var valid=dX>=0.0&&dY>=0.0;valid=valid&&this.minVertex.IsValid()&&this.maxVertex.IsValid();return valid;},minVertex:new b2Vec2(),maxVertex:new b2Vec2(),initialize:function(){this.minVertex=new b2Vec2();this.maxVertex=new b2Vec2();}};﻿
var b2Bound=Class.create();b2Bound.prototype={IsLower:function(){return(this.value&1)==0;},IsUpper:function(){return(this.value&1)==1;},Swap:function(b){var tempValue=this.value;var tempProxyId=this.proxyId;var tempStabbingCount=this.stabbingCount;this.value=b.value;this.proxyId=b.proxyId;this.stabbingCount=b.stabbingCount;b.value=tempValue;b.proxyId=tempProxyId;b.stabbingCount=tempStabbingCount;},value:0,proxyId:0,stabbingCount:0,initialize:function(){}}
﻿
var b2BoundValues=Class.create();b2BoundValues.prototype={lowerValues:[0,0],upperValues:[0,0],initialize:function(){this.lowerValues=[0,0];this.upperValues=[0,0];}}
﻿
var b2Pair=Class.create();b2Pair.prototype={SetBuffered:function(){this.status|=b2Pair.e_pairBuffered;},ClearBuffered:function(){this.status&=~b2Pair.e_pairBuffered;},IsBuffered:function(){return(this.status&b2Pair.e_pairBuffered)==b2Pair.e_pairBuffered;},SetRemoved:function(){this.status|=b2Pair.e_pairRemoved;},ClearRemoved:function(){this.status&=~b2Pair.e_pairRemoved;},IsRemoved:function(){return(this.status&b2Pair.e_pairRemoved)==b2Pair.e_pairRemoved;},SetFinal:function(){this.status|=b2Pair.e_pairFinal;},IsFinal:function(){return(this.status&b2Pair.e_pairFinal)==b2Pair.e_pairFinal;},userData:null,proxyId1:0,proxyId2:0,next:0,status:0,initialize:function(){}};b2Pair.b2_nullPair=b2Settings.USHRT_MAX;b2Pair.b2_nullProxy=b2Settings.USHRT_MAX;b2Pair.b2_tableCapacity=b2Settings.b2_maxPairs;b2Pair.b2_tableMask=b2Pair.b2_tableCapacity-1;b2Pair.e_pairBuffered=0x0001;b2Pair.e_pairRemoved=0x0002;b2Pair.e_pairFinal=0x0004;﻿
var b2PairCallback=Class.create();b2PairCallback.prototype={PairAdded:function(proxyUserData1,proxyUserData2){return null},PairRemoved:function(proxyUserData1,proxyUserData2,pairUserData){},initialize:function(){}};﻿
var b2BufferedPair=Class.create();b2BufferedPair.prototype={proxyId1:0,proxyId2:0,initialize:function(){}}
﻿
var b2PairManager=Class.create();b2PairManager.prototype={initialize:function(){var i=0;this.m_hashTable=new Array(b2Pair.b2_tableCapacity);for(i=0;i<b2Pair.b2_tableCapacity;++i)
{this.m_hashTable[i]=b2Pair.b2_nullPair;}
this.m_pairs=new Array(b2Settings.b2_maxPairs);for(i=0;i<b2Settings.b2_maxPairs;++i)
{this.m_pairs[i]=new b2Pair();}
this.m_pairBuffer=new Array(b2Settings.b2_maxPairs);for(i=0;i<b2Settings.b2_maxPairs;++i)
{this.m_pairBuffer[i]=new b2BufferedPair();}
for(i=0;i<b2Settings.b2_maxPairs;++i)
{this.m_pairs[i].proxyId1=b2Pair.b2_nullProxy;this.m_pairs[i].proxyId2=b2Pair.b2_nullProxy;this.m_pairs[i].userData=null;this.m_pairs[i].status=0;this.m_pairs[i].next=(i+1);}
this.m_pairs[b2Settings.b2_maxPairs-1].next=b2Pair.b2_nullPair;this.m_pairCount=0;},Initialize:function(broadPhase,callback){this.m_broadPhase=broadPhase;this.m_callback=callback;},AddBufferedPair:function(proxyId1,proxyId2){var pair=this.AddPair(proxyId1,proxyId2);if(pair.IsBuffered()==false)
{pair.SetBuffered();this.m_pairBuffer[this.m_pairBufferCount].proxyId1=pair.proxyId1;this.m_pairBuffer[this.m_pairBufferCount].proxyId2=pair.proxyId2;++this.m_pairBufferCount;}
pair.ClearRemoved();if(b2BroadPhase.s_validate)
{this.ValidateBuffer();}},RemoveBufferedPair:function(proxyId1,proxyId2){var pair=this.Find(proxyId1,proxyId2);if(pair==null)
{return;}
if(pair.IsBuffered()==false)
{pair.SetBuffered();this.m_pairBuffer[this.m_pairBufferCount].proxyId1=pair.proxyId1;this.m_pairBuffer[this.m_pairBufferCount].proxyId2=pair.proxyId2;++this.m_pairBufferCount;}
pair.SetRemoved();if(b2BroadPhase.s_validate)
{this.ValidateBuffer();}},Commit:function(){var i=0;var removeCount=0;var proxies=this.m_broadPhase.m_proxyPool;for(i=0;i<this.m_pairBufferCount;++i)
{var pair=this.Find(this.m_pairBuffer[i].proxyId1,this.m_pairBuffer[i].proxyId2);pair.ClearBuffered();var proxy1=proxies[pair.proxyId1];var proxy2=proxies[pair.proxyId2];if(pair.IsRemoved())
{if(pair.IsFinal()==true)
{this.m_callback.PairRemoved(proxy1.userData,proxy2.userData,pair.userData);}
this.m_pairBuffer[removeCount].proxyId1=pair.proxyId1;this.m_pairBuffer[removeCount].proxyId2=pair.proxyId2;++removeCount;}
else
{if(pair.IsFinal()==false)
{pair.userData=this.m_callback.PairAdded(proxy1.userData,proxy2.userData);pair.SetFinal();}}}
for(i=0;i<removeCount;++i)
{this.RemovePair(this.m_pairBuffer[i].proxyId1,this.m_pairBuffer[i].proxyId2);}
this.m_pairBufferCount=0;if(b2BroadPhase.s_validate)
{this.ValidateTable();}},AddPair:function(proxyId1,proxyId2){if(proxyId1>proxyId2){var temp=proxyId1;proxyId1=proxyId2;proxyId2=temp;}
var hash=b2PairManager.Hash(proxyId1,proxyId2)&b2Pair.b2_tableMask;var pair=pair=this.FindHash(proxyId1,proxyId2,hash);if(pair!=null)
{return pair;}
var pIndex=this.m_freePair;pair=this.m_pairs[pIndex];this.m_freePair=pair.next;pair.proxyId1=proxyId1;pair.proxyId2=proxyId2;pair.status=0;pair.userData=null;pair.next=this.m_hashTable[hash];this.m_hashTable[hash]=pIndex;++this.m_pairCount;return pair;},RemovePair:function(proxyId1,proxyId2){if(proxyId1>proxyId2){var temp=proxyId1;proxyId1=proxyId2;proxyId2=temp;}
var hash=b2PairManager.Hash(proxyId1,proxyId2)&b2Pair.b2_tableMask;var node=this.m_hashTable[hash];var pNode=null;while(node!=b2Pair.b2_nullPair)
{if(b2PairManager.Equals(this.m_pairs[node],proxyId1,proxyId2))
{var index=node;if(pNode){pNode.next=this.m_pairs[node].next;}
else{this.m_hashTable[hash]=this.m_pairs[node].next;}
var pair=this.m_pairs[index];var userData=pair.userData;pair.next=this.m_freePair;pair.proxyId1=b2Pair.b2_nullProxy;pair.proxyId2=b2Pair.b2_nullProxy;pair.userData=null;pair.status=0;this.m_freePair=index;--this.m_pairCount;return userData;}
else
{pNode=this.m_pairs[node];node=pNode.next;}}
return null;},Find:function(proxyId1,proxyId2){if(proxyId1>proxyId2){var temp=proxyId1;proxyId1=proxyId2;proxyId2=temp;}
var hash=b2PairManager.Hash(proxyId1,proxyId2)&b2Pair.b2_tableMask;return this.FindHash(proxyId1,proxyId2,hash);},FindHash:function(proxyId1,proxyId2,hash){var index=this.m_hashTable[hash];while(index!=b2Pair.b2_nullPair&&b2PairManager.Equals(this.m_pairs[index],proxyId1,proxyId2)==false)
{index=this.m_pairs[index].next;}
if(index==b2Pair.b2_nullPair)
{return null;}
return this.m_pairs[index];},ValidateBuffer:function(){},ValidateTable:function(){},m_broadPhase:null,m_callback:null,m_pairs:null,m_freePair:0,m_pairCount:0,m_pairBuffer:null,m_pairBufferCount:0,m_hashTable:null};b2PairManager.Hash=function(proxyId1,proxyId2)
{var key=((proxyId2<<16)&0xffff0000)|proxyId1;key=~key+((key<<15)&0xFFFF8000);key=key^((key>>12)&0x000fffff);key=key+((key<<2)&0xFFFFFFFC);key=key^((key>>4)&0x0fffffff);key=key*2057;key=key^((key>>16)&0x0000ffff);return key;};b2PairManager.Equals=function(pair,proxyId1,proxyId2)
{return(pair.proxyId1==proxyId1&&pair.proxyId2==proxyId2);};b2PairManager.EqualsPair=function(pair1,pair2)
{return pair1.proxyId1==pair2.proxyId1&&pair1.proxyId2==pair2.proxyId2;};﻿
var b2BroadPhase=Class.create();b2BroadPhase.prototype={initialize:function(worldAABB,callback){this.m_pairManager=new b2PairManager();this.m_proxyPool=new Array(b2Settings.b2_maxPairs);this.m_bounds=new Array(2*b2Settings.b2_maxProxies);this.m_queryResults=new Array(b2Settings.b2_maxProxies);this.m_quantizationFactor=new b2Vec2();var i=0;this.m_pairManager.Initialize(this,callback);this.m_worldAABB=worldAABB;this.m_proxyCount=0;for(i=0;i<b2Settings.b2_maxProxies;i++){this.m_queryResults[i]=0;}
this.m_bounds=new Array(2);for(i=0;i<2;i++){this.m_bounds[i]=new Array(2*b2Settings.b2_maxProxies);for(var j=0;j<2*b2Settings.b2_maxProxies;j++){this.m_bounds[i][j]=new b2Bound();}}
var dX=worldAABB.maxVertex.x;var dY=worldAABB.maxVertex.y;dX-=worldAABB.minVertex.x;dY-=worldAABB.minVertex.y;this.m_quantizationFactor.x=b2Settings.USHRT_MAX/dX;this.m_quantizationFactor.y=b2Settings.USHRT_MAX/dY;var tProxy;for(i=0;i<b2Settings.b2_maxProxies-1;++i)
{tProxy=new b2Proxy();this.m_proxyPool[i]=tProxy;tProxy.SetNext(i+1);tProxy.timeStamp=0;tProxy.overlapCount=b2BroadPhase.b2_invalid;tProxy.userData=null;}
tProxy=new b2Proxy();this.m_proxyPool[b2Settings.b2_maxProxies-1]=tProxy;tProxy.SetNext(b2Pair.b2_nullProxy);tProxy.timeStamp=0;tProxy.overlapCount=b2BroadPhase.b2_invalid;tProxy.userData=null;this.m_freeProxy=0;this.m_timeStamp=1;this.m_queryResultCount=0;},InRange:function(aabb){var dX;var dY;var d2X;var d2Y;dX=aabb.minVertex.x;dY=aabb.minVertex.y;dX-=this.m_worldAABB.maxVertex.x;dY-=this.m_worldAABB.maxVertex.y;d2X=this.m_worldAABB.minVertex.x;d2Y=this.m_worldAABB.minVertex.y;d2X-=aabb.maxVertex.x;d2Y-=aabb.maxVertex.y;dX=b2Math.b2Max(dX,d2X);dY=b2Math.b2Max(dY,d2Y);return b2Math.b2Max(dX,dY)<0.0;},GetProxy:function(proxyId){if(proxyId==b2Pair.b2_nullProxy||this.m_proxyPool[proxyId].IsValid()==false)
{return null;}
return this.m_proxyPool[proxyId];},CreateProxy:function(aabb,userData){var index=0;var proxy;var proxyId=this.m_freeProxy;proxy=this.m_proxyPool[proxyId];this.m_freeProxy=proxy.GetNext();proxy.overlapCount=0;proxy.userData=userData;var boundCount=2*this.m_proxyCount;var lowerValues=new Array();var upperValues=new Array();this.ComputeBounds(lowerValues,upperValues,aabb);for(var axis=0;axis<2;++axis)
{var bounds=this.m_bounds[axis];var lowerIndex=0;var upperIndex=0;var lowerIndexOut=[lowerIndex];var upperIndexOut=[upperIndex];this.Query(lowerIndexOut,upperIndexOut,lowerValues[axis],upperValues[axis],bounds,boundCount,axis);lowerIndex=lowerIndexOut[0];upperIndex=upperIndexOut[0];var tArr=new Array();var j=0;var tEnd=boundCount-upperIndex
var tBound1;var tBound2;for(j=0;j<tEnd;j++){tArr[j]=new b2Bound();tBound1=tArr[j];tBound2=bounds[upperIndex+j];tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
tEnd=tArr.length;var tIndex=upperIndex+2;for(j=0;j<tEnd;j++){tBound2=tArr[j];tBound1=bounds[tIndex+j]
tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
tArr=new Array();tEnd=upperIndex-lowerIndex;for(j=0;j<tEnd;j++){tArr[j]=new b2Bound();tBound1=tArr[j];tBound2=bounds[lowerIndex+j];tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
tEnd=tArr.length;tIndex=lowerIndex+1;for(j=0;j<tEnd;j++){tBound2=tArr[j];tBound1=bounds[tIndex+j]
tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
++upperIndex;bounds[lowerIndex].value=lowerValues[axis];bounds[lowerIndex].proxyId=proxyId;bounds[upperIndex].value=upperValues[axis];bounds[upperIndex].proxyId=proxyId;bounds[lowerIndex].stabbingCount=lowerIndex==0?0:bounds[lowerIndex-1].stabbingCount;bounds[upperIndex].stabbingCount=bounds[upperIndex-1].stabbingCount;for(index=lowerIndex;index<upperIndex;++index)
{bounds[index].stabbingCount++;}
for(index=lowerIndex;index<boundCount+2;++index)
{var proxy2=this.m_proxyPool[bounds[index].proxyId];if(bounds[index].IsLower())
{proxy2.lowerBounds[axis]=index;}
else
{proxy2.upperBounds[axis]=index;}}}
++this.m_proxyCount;for(var i=0;i<this.m_queryResultCount;++i)
{this.m_pairManager.AddBufferedPair(proxyId,this.m_queryResults[i]);}
this.m_pairManager.Commit();this.m_queryResultCount=0;this.IncrementTimeStamp();return proxyId;},DestroyProxy:function(proxyId){var proxy=this.m_proxyPool[proxyId];var boundCount=2*this.m_proxyCount;for(var axis=0;axis<2;++axis)
{var bounds=this.m_bounds[axis];var lowerIndex=proxy.lowerBounds[axis];var upperIndex=proxy.upperBounds[axis];var lowerValue=bounds[lowerIndex].value;var upperValue=bounds[upperIndex].value;var tArr=new Array();var j=0;var tEnd=upperIndex-lowerIndex-1;var tBound1;var tBound2;for(j=0;j<tEnd;j++){tArr[j]=new b2Bound();tBound1=tArr[j];tBound2=bounds[lowerIndex+1+j];tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
tEnd=tArr.length;var tIndex=lowerIndex;for(j=0;j<tEnd;j++){tBound2=tArr[j];tBound1=bounds[tIndex+j]
tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
tArr=new Array();tEnd=boundCount-upperIndex-1;for(j=0;j<tEnd;j++){tArr[j]=new b2Bound();tBound1=tArr[j];tBound2=bounds[upperIndex+1+j];tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
tEnd=tArr.length;tIndex=upperIndex-1;for(j=0;j<tEnd;j++){tBound2=tArr[j];tBound1=bounds[tIndex+j]
tBound1.value=tBound2.value;tBound1.proxyId=tBound2.proxyId;tBound1.stabbingCount=tBound2.stabbingCount;}
tEnd=boundCount-2;for(var index=lowerIndex;index<tEnd;++index)
{var proxy2=this.m_proxyPool[bounds[index].proxyId];if(bounds[index].IsLower())
{proxy2.lowerBounds[axis]=index;}
else
{proxy2.upperBounds[axis]=index;}}
tEnd=upperIndex-1;for(var index2=lowerIndex;index2<tEnd;++index2)
{bounds[index2].stabbingCount--;}
this.Query([0],[0],lowerValue,upperValue,bounds,boundCount-2,axis);}
for(var i=0;i<this.m_queryResultCount;++i)
{this.m_pairManager.RemoveBufferedPair(proxyId,this.m_queryResults[i]);}
this.m_pairManager.Commit();this.m_queryResultCount=0;this.IncrementTimeStamp();proxy.userData=null;proxy.overlapCount=b2BroadPhase.b2_invalid;proxy.lowerBounds[0]=b2BroadPhase.b2_invalid;proxy.lowerBounds[1]=b2BroadPhase.b2_invalid;proxy.upperBounds[0]=b2BroadPhase.b2_invalid;proxy.upperBounds[1]=b2BroadPhase.b2_invalid;proxy.SetNext(this.m_freeProxy);this.m_freeProxy=proxyId;--this.m_proxyCount;},MoveProxy:function(proxyId,aabb){var axis=0;var index=0;var bound;var prevBound
var nextBound
var nextProxyId=0;var nextProxy;if(proxyId==b2Pair.b2_nullProxy||b2Settings.b2_maxProxies<=proxyId)
{return;}
if(aabb.IsValid()==false)
{return;}
var boundCount=2*this.m_proxyCount;var proxy=this.m_proxyPool[proxyId];var newValues=new b2BoundValues();this.ComputeBounds(newValues.lowerValues,newValues.upperValues,aabb);var oldValues=new b2BoundValues();for(axis=0;axis<2;++axis)
{oldValues.lowerValues[axis]=this.m_bounds[axis][proxy.lowerBounds[axis]].value;oldValues.upperValues[axis]=this.m_bounds[axis][proxy.upperBounds[axis]].value;}
for(axis=0;axis<2;++axis)
{var bounds=this.m_bounds[axis];var lowerIndex=proxy.lowerBounds[axis];var upperIndex=proxy.upperBounds[axis];var lowerValue=newValues.lowerValues[axis];var upperValue=newValues.upperValues[axis];var deltaLower=lowerValue-bounds[lowerIndex].value;var deltaUpper=upperValue-bounds[upperIndex].value;bounds[lowerIndex].value=lowerValue;bounds[upperIndex].value=upperValue;if(deltaLower<0)
{index=lowerIndex;while(index>0&&lowerValue<bounds[index-1].value)
{bound=bounds[index];prevBound=bounds[index-1];var prevProxyId=prevBound.proxyId;var prevProxy=this.m_proxyPool[prevBound.proxyId];prevBound.stabbingCount++;if(prevBound.IsUpper()==true)
{if(this.TestOverlap(newValues,prevProxy))
{this.m_pairManager.AddBufferedPair(proxyId,prevProxyId);}
prevProxy.upperBounds[axis]++;bound.stabbingCount++;}
else
{prevProxy.lowerBounds[axis]++;bound.stabbingCount--;}
proxy.lowerBounds[axis]--;bound.Swap(prevBound);--index;}}
if(deltaUpper>0)
{index=upperIndex;while(index<boundCount-1&&bounds[index+1].value<=upperValue)
{bound=bounds[index];nextBound=bounds[index+1];nextProxyId=nextBound.proxyId;nextProxy=this.m_proxyPool[nextProxyId];nextBound.stabbingCount++;if(nextBound.IsLower()==true)
{if(this.TestOverlap(newValues,nextProxy))
{this.m_pairManager.AddBufferedPair(proxyId,nextProxyId);}
nextProxy.lowerBounds[axis]--;bound.stabbingCount++;}
else
{nextProxy.upperBounds[axis]--;bound.stabbingCount--;}
proxy.upperBounds[axis]++;bound.Swap(nextBound);index++;}}
if(deltaLower>0)
{index=lowerIndex;while(index<boundCount-1&&bounds[index+1].value<=lowerValue)
{bound=bounds[index];nextBound=bounds[index+1];nextProxyId=nextBound.proxyId;nextProxy=this.m_proxyPool[nextProxyId];nextBound.stabbingCount--;if(nextBound.IsUpper())
{if(this.TestOverlap(oldValues,nextProxy))
{this.m_pairManager.RemoveBufferedPair(proxyId,nextProxyId);}
nextProxy.upperBounds[axis]--;bound.stabbingCount--;}
else
{nextProxy.lowerBounds[axis]--;bound.stabbingCount++;}
proxy.lowerBounds[axis]++;bound.Swap(nextBound);index++;}}
if(deltaUpper<0)
{index=upperIndex;while(index>0&&upperValue<bounds[index-1].value)
{bound=bounds[index];prevBound=bounds[index-1];prevProxyId=prevBound.proxyId;prevProxy=this.m_proxyPool[prevProxyId];prevBound.stabbingCount--;if(prevBound.IsLower()==true)
{if(this.TestOverlap(oldValues,prevProxy))
{this.m_pairManager.RemoveBufferedPair(proxyId,prevProxyId);}
prevProxy.lowerBounds[axis]++;bound.stabbingCount--;}
else
{prevProxy.upperBounds[axis]++;bound.stabbingCount++;}
proxy.upperBounds[axis]--;bound.Swap(prevBound);index--;}}}},Commit:function(){this.m_pairManager.Commit();},QueryAABB:function(aabb,userData,maxCount){var lowerValues=new Array();var upperValues=new Array();this.ComputeBounds(lowerValues,upperValues,aabb);var lowerIndex=0;var upperIndex=0;var lowerIndexOut=[lowerIndex];var upperIndexOut=[upperIndex];this.Query(lowerIndexOut,upperIndexOut,lowerValues[0],upperValues[0],this.m_bounds[0],2*this.m_proxyCount,0);this.Query(lowerIndexOut,upperIndexOut,lowerValues[1],upperValues[1],this.m_bounds[1],2*this.m_proxyCount,1);var count=0;for(var i=0;i<this.m_queryResultCount&&count<maxCount;++i,++count)
{var proxy=this.m_proxyPool[this.m_queryResults[i]];userData[i]=proxy.userData;}
this.m_queryResultCount=0;this.IncrementTimeStamp();return count;},Validate:function(){var pair;var proxy1;var proxy2;var overlap;for(var axis=0;axis<2;++axis)
{var bounds=this.m_bounds[axis];var boundCount=2*this.m_proxyCount;var stabbingCount=0;for(var i=0;i<boundCount;++i)
{var bound=bounds[i];if(bound.IsLower()==true)
{stabbingCount++;}
else
{stabbingCount--;}}}},ComputeBounds:function(lowerValues,upperValues,aabb)
{var minVertexX=aabb.minVertex.x;var minVertexY=aabb.minVertex.y;minVertexX=b2Math.b2Min(minVertexX,this.m_worldAABB.maxVertex.x);minVertexY=b2Math.b2Min(minVertexY,this.m_worldAABB.maxVertex.y);minVertexX=b2Math.b2Max(minVertexX,this.m_worldAABB.minVertex.x);minVertexY=b2Math.b2Max(minVertexY,this.m_worldAABB.minVertex.y);var maxVertexX=aabb.maxVertex.x;var maxVertexY=aabb.maxVertex.y;maxVertexX=b2Math.b2Min(maxVertexX,this.m_worldAABB.maxVertex.x);maxVertexY=b2Math.b2Min(maxVertexY,this.m_worldAABB.maxVertex.y);maxVertexX=b2Math.b2Max(maxVertexX,this.m_worldAABB.minVertex.x);maxVertexY=b2Math.b2Max(maxVertexY,this.m_worldAABB.minVertex.y);lowerValues[0]=(this.m_quantizationFactor.x*(minVertexX-this.m_worldAABB.minVertex.x))&(b2Settings.USHRT_MAX-1);upperValues[0]=((this.m_quantizationFactor.x*(maxVertexX-this.m_worldAABB.minVertex.x))&0x0000ffff)|1;lowerValues[1]=(this.m_quantizationFactor.y*(minVertexY-this.m_worldAABB.minVertex.y))&(b2Settings.USHRT_MAX-1);upperValues[1]=((this.m_quantizationFactor.y*(maxVertexY-this.m_worldAABB.minVertex.y))&0x0000ffff)|1;},TestOverlapValidate:function(p1,p2){for(var axis=0;axis<2;++axis)
{var bounds=this.m_bounds[axis];if(bounds[p1.lowerBounds[axis]].value>bounds[p2.upperBounds[axis]].value)
return false;if(bounds[p1.upperBounds[axis]].value<bounds[p2.lowerBounds[axis]].value)
return false;}
return true;},TestOverlap:function(b,p)
{for(var axis=0;axis<2;++axis)
{var bounds=this.m_bounds[axis];if(b.lowerValues[axis]>bounds[p.upperBounds[axis]].value)
return false;if(b.upperValues[axis]<bounds[p.lowerBounds[axis]].value)
return false;}
return true;},Query:function(lowerQueryOut,upperQueryOut,lowerValue,upperValue,bounds,boundCount,axis){var lowerQuery=b2BroadPhase.BinarySearch(bounds,boundCount,lowerValue);var upperQuery=b2BroadPhase.BinarySearch(bounds,boundCount,upperValue);for(var j=lowerQuery;j<upperQuery;++j)
{if(bounds[j].IsLower())
{this.IncrementOverlapCount(bounds[j].proxyId);}}
if(lowerQuery>0)
{var i=lowerQuery-1;var s=bounds[i].stabbingCount;while(s)
{if(bounds[i].IsLower())
{var proxy=this.m_proxyPool[bounds[i].proxyId];if(lowerQuery<=proxy.upperBounds[axis])
{this.IncrementOverlapCount(bounds[i].proxyId);--s;}}
--i;}}
lowerQueryOut[0]=lowerQuery;upperQueryOut[0]=upperQuery;},IncrementOverlapCount:function(proxyId){var proxy=this.m_proxyPool[proxyId];if(proxy.timeStamp<this.m_timeStamp)
{proxy.timeStamp=this.m_timeStamp;proxy.overlapCount=1;}
else
{proxy.overlapCount=2;this.m_queryResults[this.m_queryResultCount]=proxyId;++this.m_queryResultCount;}},IncrementTimeStamp:function(){if(this.m_timeStamp==b2Settings.USHRT_MAX)
{for(var i=0;i<b2Settings.b2_maxProxies;++i)
{this.m_proxyPool[i].timeStamp=0;}
this.m_timeStamp=1;}
else
{++this.m_timeStamp;}},m_pairManager:new b2PairManager(),m_proxyPool:new Array(b2Settings.b2_maxPairs),m_freeProxy:0,m_bounds:new Array(2*b2Settings.b2_maxProxies),m_queryResults:new Array(b2Settings.b2_maxProxies),m_queryResultCount:0,m_worldAABB:null,m_quantizationFactor:new b2Vec2(),m_proxyCount:0,m_timeStamp:0};b2BroadPhase.s_validate=false;b2BroadPhase.b2_invalid=b2Settings.USHRT_MAX;b2BroadPhase.b2_nullEdge=b2Settings.USHRT_MAX;b2BroadPhase.BinarySearch=function(bounds,count,value)
{var low=0;var high=count-1;while(low<=high)
{var mid=Math.floor((low+high)/2);if(bounds[mid].value>value)
{high=mid-1;}
else if(bounds[mid].value<value)
{low=mid+1;}
else
{return(mid);}}
return(low);};﻿
var b2Collision=Class.create();b2Collision.prototype={initialize:function(){}}
b2Collision.b2_nullFeature=0x000000ff;b2Collision.ClipSegmentToLine=function(vOut,vIn,normal,offset)
{var numOut=0;var vIn0=vIn[0].v;var vIn1=vIn[1].v;var distance0=b2Math.b2Dot(normal,vIn[0].v)-offset;var distance1=b2Math.b2Dot(normal,vIn[1].v)-offset;if(distance0<=0.0)vOut[numOut++]=vIn[0];if(distance1<=0.0)vOut[numOut++]=vIn[1];if(distance0*distance1<0.0)
{var interp=distance0/(distance0-distance1);var tVec=vOut[numOut].v;tVec.x=vIn0.x+interp*(vIn1.x-vIn0.x);tVec.y=vIn0.y+interp*(vIn1.y-vIn0.y);if(distance0>0.0)
{vOut[numOut].id=vIn[0].id;}
else
{vOut[numOut].id=vIn[1].id;}
++numOut;}
return numOut;};b2Collision.EdgeSeparation=function(poly1,edge1,poly2)
{var vert1s=poly1.m_vertices;var count2=poly2.m_vertexCount;var vert2s=poly2.m_vertices;var normalX=poly1.m_normals[edge1].x;var normalY=poly1.m_normals[edge1].y;var tX=normalX;var tMat=poly1.m_R;normalX=tMat.col1.x*tX+tMat.col2.x*normalY;normalY=tMat.col1.y*tX+tMat.col2.y*normalY;var normalLocal2X=normalX;var normalLocal2Y=normalY;tMat=poly2.m_R;tX=normalLocal2X*tMat.col1.x+normalLocal2Y*tMat.col1.y;normalLocal2Y=normalLocal2X*tMat.col2.x+normalLocal2Y*tMat.col2.y;normalLocal2X=tX;var vertexIndex2=0;var minDot=Number.MAX_VALUE;for(var i=0;i<count2;++i)
{var tVec=vert2s[i];var dot=tVec.x*normalLocal2X+tVec.y*normalLocal2Y;if(dot<minDot)
{minDot=dot;vertexIndex2=i;}}
tMat=poly1.m_R;var v1X=poly1.m_position.x+(tMat.col1.x*vert1s[edge1].x+tMat.col2.x*vert1s[edge1].y)
var v1Y=poly1.m_position.y+(tMat.col1.y*vert1s[edge1].x+tMat.col2.y*vert1s[edge1].y)
tMat=poly2.m_R;var v2X=poly2.m_position.x+(tMat.col1.x*vert2s[vertexIndex2].x+tMat.col2.x*vert2s[vertexIndex2].y)
var v2Y=poly2.m_position.y+(tMat.col1.y*vert2s[vertexIndex2].x+tMat.col2.y*vert2s[vertexIndex2].y)
v2X-=v1X;v2Y-=v1Y;var separation=v2X*normalX+v2Y*normalY;return separation;};b2Collision.FindMaxSeparation=function(edgeIndex,poly1,poly2,conservative)
{var count1=poly1.m_vertexCount;var dX=poly2.m_position.x-poly1.m_position.x;var dY=poly2.m_position.y-poly1.m_position.y;var dLocal1X=(dX*poly1.m_R.col1.x+dY*poly1.m_R.col1.y);var dLocal1Y=(dX*poly1.m_R.col2.x+dY*poly1.m_R.col2.y);var edge=0;var maxDot=-Number.MAX_VALUE;for(var i=0;i<count1;++i)
{var dot=(poly1.m_normals[i].x*dLocal1X+poly1.m_normals[i].y*dLocal1Y);if(dot>maxDot)
{maxDot=dot;edge=i;}}
var s=b2Collision.EdgeSeparation(poly1,edge,poly2);if(s>0.0&&conservative==false)
{return s;}
var prevEdge=edge-1>=0?edge-1:count1-1;var sPrev=b2Collision.EdgeSeparation(poly1,prevEdge,poly2);if(sPrev>0.0&&conservative==false)
{return sPrev;}
var nextEdge=edge+1<count1?edge+1:0;var sNext=b2Collision.EdgeSeparation(poly1,nextEdge,poly2);if(sNext>0.0&&conservative==false)
{return sNext;}
var bestEdge=0;var bestSeparation;var increment=0;if(sPrev>s&&sPrev>sNext)
{increment=-1;bestEdge=prevEdge;bestSeparation=sPrev;}
else if(sNext>s)
{increment=1;bestEdge=nextEdge;bestSeparation=sNext;}
else
{edgeIndex[0]=edge;return s;}
while(true)
{if(increment==-1)
edge=bestEdge-1>=0?bestEdge-1:count1-1;else
edge=bestEdge+1<count1?bestEdge+1:0;s=b2Collision.EdgeSeparation(poly1,edge,poly2);if(s>0.0&&conservative==false)
{return s;}
if(s>bestSeparation)
{bestEdge=edge;bestSeparation=s;}
else
{break;}}
edgeIndex[0]=bestEdge;return bestSeparation;};b2Collision.FindIncidentEdge=function(c,poly1,edge1,poly2)
{var count1=poly1.m_vertexCount;var vert1s=poly1.m_vertices;var count2=poly2.m_vertexCount;var vert2s=poly2.m_vertices;var vertex11=edge1;var vertex12=edge1+1==count1?0:edge1+1;var tVec=vert1s[vertex12];var normal1Local1X=tVec.x;var normal1Local1Y=tVec.y;tVec=vert1s[vertex11];normal1Local1X-=tVec.x;normal1Local1Y-=tVec.y;var tX=normal1Local1X;normal1Local1X=normal1Local1Y;normal1Local1Y=-tX;var invLength=1.0/Math.sqrt(normal1Local1X*normal1Local1X+normal1Local1Y*normal1Local1Y);normal1Local1X*=invLength;normal1Local1Y*=invLength;var normal1X=normal1Local1X;var normal1Y=normal1Local1Y;tX=normal1X;var tMat=poly1.m_R;normal1X=tMat.col1.x*tX+tMat.col2.x*normal1Y;normal1Y=tMat.col1.y*tX+tMat.col2.y*normal1Y;var normal1Local2X=normal1X;var normal1Local2Y=normal1Y;tMat=poly2.m_R;tX=normal1Local2X*tMat.col1.x+normal1Local2Y*tMat.col1.y;normal1Local2Y=normal1Local2X*tMat.col2.x+normal1Local2Y*tMat.col2.y;normal1Local2X=tX;var vertex21=0;var vertex22=0;var minDot=Number.MAX_VALUE;for(var i=0;i<count2;++i)
{var i1=i;var i2=i+1<count2?i+1:0;tVec=vert2s[i2];var normal2Local2X=tVec.x;var normal2Local2Y=tVec.y;tVec=vert2s[i1];normal2Local2X-=tVec.x;normal2Local2Y-=tVec.y;tX=normal2Local2X;normal2Local2X=normal2Local2Y;normal2Local2Y=-tX;invLength=1.0/Math.sqrt(normal2Local2X*normal2Local2X+normal2Local2Y*normal2Local2Y);normal2Local2X*=invLength;normal2Local2Y*=invLength;var dot=normal2Local2X*normal1Local2X+normal2Local2Y*normal1Local2Y;if(dot<minDot)
{minDot=dot;vertex21=i1;vertex22=i2;}}
var tClip;tClip=c[0];tVec=tClip.v;tVec.SetV(vert2s[vertex21]);tVec.MulM(poly2.m_R);tVec.Add(poly2.m_position);tClip.id.features.referenceFace=edge1;tClip.id.features.incidentEdge=vertex21;tClip.id.features.incidentVertex=vertex21;tClip=c[1];tVec=tClip.v;tVec.SetV(vert2s[vertex22]);tVec.MulM(poly2.m_R);tVec.Add(poly2.m_position);tClip.id.features.referenceFace=edge1;tClip.id.features.incidentEdge=vertex21;tClip.id.features.incidentVertex=vertex22;};b2Collision.b2CollidePolyTempVec=new b2Vec2();b2Collision.b2CollidePoly=function(manifold,polyA,polyB,conservative)
{manifold.pointCount=0;var edgeA=0;var edgeAOut=[edgeA];var separationA=b2Collision.FindMaxSeparation(edgeAOut,polyA,polyB,conservative);edgeA=edgeAOut[0];if(separationA>0.0&&conservative==false)
return;var edgeB=0;var edgeBOut=[edgeB];var separationB=b2Collision.FindMaxSeparation(edgeBOut,polyB,polyA,conservative);edgeB=edgeBOut[0];if(separationB>0.0&&conservative==false)
return;var poly1;var poly2;var edge1=0;var flip=0;var k_relativeTol=0.98;var k_absoluteTol=0.001;if(separationB>k_relativeTol*separationA+k_absoluteTol)
{poly1=polyB;poly2=polyA;edge1=edgeB;flip=1;}
else
{poly1=polyA;poly2=polyB;edge1=edgeA;flip=0;}
var incidentEdge=[new ClipVertex(),new ClipVertex()];b2Collision.FindIncidentEdge(incidentEdge,poly1,edge1,poly2);var count1=poly1.m_vertexCount;var vert1s=poly1.m_vertices;var v11=vert1s[edge1];var v12=edge1+1<count1?vert1s[edge1+1]:vert1s[0];var dvX=v12.x-v11.x;var dvY=v12.y-v11.y;var sideNormalX=v12.x-v11.x;var sideNormalY=v12.y-v11.y;var tX=sideNormalX;var tMat=poly1.m_R;sideNormalX=tMat.col1.x*tX+tMat.col2.x*sideNormalY;sideNormalY=tMat.col1.y*tX+tMat.col2.y*sideNormalY;var invLength=1.0/Math.sqrt(sideNormalX*sideNormalX+sideNormalY*sideNormalY);sideNormalX*=invLength;sideNormalY*=invLength;var frontNormalX=sideNormalX;var frontNormalY=sideNormalY;tX=frontNormalX;frontNormalX=frontNormalY;frontNormalY=-tX;var v11X=v11.x;var v11Y=v11.y;tX=v11X;tMat=poly1.m_R;v11X=tMat.col1.x*tX+tMat.col2.x*v11Y;v11Y=tMat.col1.y*tX+tMat.col2.y*v11Y;v11X+=poly1.m_position.x;v11Y+=poly1.m_position.y;var v12X=v12.x;var v12Y=v12.y;tX=v12X;tMat=poly1.m_R;v12X=tMat.col1.x*tX+tMat.col2.x*v12Y;v12Y=tMat.col1.y*tX+tMat.col2.y*v12Y;v12X+=poly1.m_position.x;v12Y+=poly1.m_position.y;var frontOffset=frontNormalX*v11X+frontNormalY*v11Y;var sideOffset1=-(sideNormalX*v11X+sideNormalY*v11Y);var sideOffset2=sideNormalX*v12X+sideNormalY*v12Y;var clipPoints1=[new ClipVertex(),new ClipVertex()];var clipPoints2=[new ClipVertex(),new ClipVertex()];var np=0;b2Collision.b2CollidePolyTempVec.Set(-sideNormalX,-sideNormalY);np=b2Collision.ClipSegmentToLine(clipPoints1,incidentEdge,b2Collision.b2CollidePolyTempVec,sideOffset1);if(np<2)
return;b2Collision.b2CollidePolyTempVec.Set(sideNormalX,sideNormalY);np=b2Collision.ClipSegmentToLine(clipPoints2,clipPoints1,b2Collision.b2CollidePolyTempVec,sideOffset2);if(np<2)
return;if(flip){manifold.normal.Set(-frontNormalX,-frontNormalY);}
else{manifold.normal.Set(frontNormalX,frontNormalY);}
var pointCount=0;for(var i=0;i<b2Settings.b2_maxManifoldPoints;++i)
{var tVec=clipPoints2[i].v;var separation=(frontNormalX*tVec.x+frontNormalY*tVec.y)-frontOffset;if(separation<=0.0||conservative==true)
{var cp=manifold.points[pointCount];cp.separation=separation;cp.position.SetV(clipPoints2[i].v);cp.id.Set(clipPoints2[i].id);cp.id.features.flip=flip;++pointCount;}}
manifold.pointCount=pointCount;};b2Collision.b2CollideCircle=function(manifold,circle1,circle2,conservative)
{manifold.pointCount=0;var dX=circle2.m_position.x-circle1.m_position.x;var dY=circle2.m_position.y-circle1.m_position.y;var distSqr=dX*dX+dY*dY;var radiusSum=circle1.m_radius+circle2.m_radius;if(distSqr>radiusSum*radiusSum&&conservative==false)
{return;}
var separation;if(distSqr<Number.MIN_VALUE)
{separation=-radiusSum;manifold.normal.Set(0.0,1.0);}
else
{var dist=Math.sqrt(distSqr);separation=dist-radiusSum;var a=1.0/dist;manifold.normal.x=a*dX;manifold.normal.y=a*dY;}
manifold.pointCount=1;var tPoint=manifold.points[0];tPoint.id.set_key(0);tPoint.separation=separation;tPoint.position.x=circle2.m_position.x-(circle2.m_radius*manifold.normal.x);tPoint.position.y=circle2.m_position.y-(circle2.m_radius*manifold.normal.y);};b2Collision.b2CollidePolyAndCircle=function(manifold,poly,circle,conservative)
{manifold.pointCount=0;var tPoint;var dX;var dY;var xLocalX=circle.m_position.x-poly.m_position.x;var xLocalY=circle.m_position.y-poly.m_position.y;var tMat=poly.m_R;var tX=xLocalX*tMat.col1.x+xLocalY*tMat.col1.y;xLocalY=xLocalX*tMat.col2.x+xLocalY*tMat.col2.y;xLocalX=tX;var dist;var normalIndex=0;var separation=-Number.MAX_VALUE;var radius=circle.m_radius;for(var i=0;i<poly.m_vertexCount;++i)
{var s=poly.m_normals[i].x*(xLocalX-poly.m_vertices[i].x)+poly.m_normals[i].y*(xLocalY-poly.m_vertices[i].y);if(s>radius)
{return;}
if(s>separation)
{separation=s;normalIndex=i;}}
if(separation<Number.MIN_VALUE)
{manifold.pointCount=1;var tVec=poly.m_normals[normalIndex];manifold.normal.x=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y;manifold.normal.y=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y;tPoint=manifold.points[0];tPoint.id.features.incidentEdge=normalIndex;tPoint.id.features.incidentVertex=b2Collision.b2_nullFeature;tPoint.id.features.referenceFace=b2Collision.b2_nullFeature;tPoint.id.features.flip=0;tPoint.position.x=circle.m_position.x-radius*manifold.normal.x;tPoint.position.y=circle.m_position.y-radius*manifold.normal.y;tPoint.separation=separation-radius;return;}
var vertIndex1=normalIndex;var vertIndex2=vertIndex1+1<poly.m_vertexCount?vertIndex1+1:0;var eX=poly.m_vertices[vertIndex2].x-poly.m_vertices[vertIndex1].x;var eY=poly.m_vertices[vertIndex2].y-poly.m_vertices[vertIndex1].y;var length=Math.sqrt(eX*eX+eY*eY);eX/=length;eY/=length;if(length<Number.MIN_VALUE)
{dX=xLocalX-poly.m_vertices[vertIndex1].x;dY=xLocalY-poly.m_vertices[vertIndex1].y;dist=Math.sqrt(dX*dX+dY*dY);dX/=dist;dY/=dist;if(dist>radius)
{return;}
manifold.pointCount=1;manifold.normal.Set(tMat.col1.x*dX+tMat.col2.x*dY,tMat.col1.y*dX+tMat.col2.y*dY);tPoint=manifold.points[0];tPoint.id.features.incidentEdge=b2Collision.b2_nullFeature;tPoint.id.features.incidentVertex=vertIndex1;tPoint.id.features.referenceFace=b2Collision.b2_nullFeature;tPoint.id.features.flip=0;tPoint.position.x=circle.m_position.x-radius*manifold.normal.x;tPoint.position.y=circle.m_position.y-radius*manifold.normal.y;tPoint.separation=dist-radius;return;}
var u=(xLocalX-poly.m_vertices[vertIndex1].x)*eX+(xLocalY-poly.m_vertices[vertIndex1].y)*eY;tPoint=manifold.points[0];tPoint.id.features.incidentEdge=b2Collision.b2_nullFeature;tPoint.id.features.incidentVertex=b2Collision.b2_nullFeature;tPoint.id.features.referenceFace=b2Collision.b2_nullFeature;tPoint.id.features.flip=0;var pX,pY;if(u<=0.0)
{pX=poly.m_vertices[vertIndex1].x;pY=poly.m_vertices[vertIndex1].y;tPoint.id.features.incidentVertex=vertIndex1;}
else if(u>=length)
{pX=poly.m_vertices[vertIndex2].x;pY=poly.m_vertices[vertIndex2].y;tPoint.id.features.incidentVertex=vertIndex2;}
else
{pX=eX*u+poly.m_vertices[vertIndex1].x;pY=eY*u+poly.m_vertices[vertIndex1].y;tPoint.id.features.incidentEdge=vertIndex1;}
dX=xLocalX-pX;dY=xLocalY-pY;dist=Math.sqrt(dX*dX+dY*dY);dX/=dist;dY/=dist;if(dist>radius)
{return;}
manifold.pointCount=1;manifold.normal.Set(tMat.col1.x*dX+tMat.col2.x*dY,tMat.col1.y*dX+tMat.col2.y*dY);tPoint.position.x=circle.m_position.x-radius*manifold.normal.x;tPoint.position.y=circle.m_position.y-radius*manifold.normal.y;tPoint.separation=dist-radius;};b2Collision.b2TestOverlap=function(a,b)
{var t1=b.minVertex;var t2=a.maxVertex;var d1X=t1.x-t2.x;var d1Y=t1.y-t2.y;t1=a.minVertex;t2=b.maxVertex;var d2X=t1.x-t2.x;var d2Y=t1.y-t2.y;if(d1X>0.0||d1Y>0.0)
return false;if(d2X>0.0||d2Y>0.0)
return false;return true;};﻿
var Features=Class.create();Features.prototype={set_referenceFace:function(value){this._referenceFace=value;this._m_id._key=(this._m_id._key&0xffffff00)|(this._referenceFace&0x000000ff)},get_referenceFace:function(){return this._referenceFace;},_referenceFace:0,set_incidentEdge:function(value){this._incidentEdge=value;this._m_id._key=(this._m_id._key&0xffff00ff)|((this._incidentEdge<<8)&0x0000ff00)},get_incidentEdge:function(){return this._incidentEdge;},_incidentEdge:0,set_incidentVertex:function(value){this._incidentVertex=value;this._m_id._key=(this._m_id._key&0xff00ffff)|((this._incidentVertex<<16)&0x00ff0000)},get_incidentVertex:function(){return this._incidentVertex;},_incidentVertex:0,set_flip:function(value){this._flip=value;this._m_id._key=(this._m_id._key&0x00ffffff)|((this._flip<<24)&0xff000000)},get_flip:function(){return this._flip;},_flip:0,_m_id:null,initialize:function(){}};﻿
var b2ContactID=Class.create();b2ContactID.prototype={initialize:function(){this.features=new Features();this.features._m_id=this;},Set:function(id){this.set_key(id._key);},Copy:function(){var id=new b2ContactID();id.set_key(this._key);return id;},get_key:function(){return this._key;},set_key:function(value){this._key=value;this.features._referenceFace=this._key&0x000000ff;this.features._incidentEdge=((this._key&0x0000ff00)>>8)&0x000000ff;this.features._incidentVertex=((this._key&0x00ff0000)>>16)&0x000000ff;this.features._flip=((this._key&0xff000000)>>24)&0x000000ff;},features:new Features(),_key:0};﻿
var b2ContactPoint=Class.create();b2ContactPoint.prototype={position:new b2Vec2(),separation:null,normalImpulse:null,tangentImpulse:null,id:new b2ContactID(),initialize:function(){this.position=new b2Vec2();this.id=new b2ContactID();}};var b2Distance=Class.create();b2Distance.prototype={initialize:function(){}};b2Distance.ProcessTwo=function(p1Out,p2Out,p1s,p2s,points)
{var rX=-points[1].x;var rY=-points[1].y;var dX=points[0].x-points[1].x;var dY=points[0].y-points[1].y;var length=Math.sqrt(dX*dX+dY*dY);dX/=length;dY/=length;var lambda=rX*dX+rY*dY;if(lambda<=0.0||length<Number.MIN_VALUE)
{p1Out.SetV(p1s[1]);p2Out.SetV(p2s[1]);p1s[0].SetV(p1s[1]);p2s[0].SetV(p2s[1]);points[0].SetV(points[1]);return 1;}
lambda/=length;p1Out.x=p1s[1].x+lambda*(p1s[0].x-p1s[1].x);p1Out.y=p1s[1].y+lambda*(p1s[0].y-p1s[1].y);p2Out.x=p2s[1].x+lambda*(p2s[0].x-p2s[1].x);p2Out.y=p2s[1].y+lambda*(p2s[0].y-p2s[1].y);return 2;};b2Distance.ProcessThree=function(p1Out,p2Out,p1s,p2s,points)
{var aX=points[0].x;var aY=points[0].y;var bX=points[1].x;var bY=points[1].y;var cX=points[2].x;var cY=points[2].y;var abX=bX-aX;var abY=bY-aY;var acX=cX-aX;var acY=cY-aY;var bcX=cX-bX;var bcY=cY-bY;var sn=-(aX*abX+aY*abY);var sd=(bX*abX+bY*abY);var tn=-(aX*acX+aY*acY);var td=(cX*acX+cY*acY);var un=-(bX*bcX+bY*bcY);var ud=(cX*bcX+cY*bcY);if(td<=0.0&&ud<=0.0)
{p1Out.SetV(p1s[2]);p2Out.SetV(p2s[2]);p1s[0].SetV(p1s[2]);p2s[0].SetV(p2s[2]);points[0].SetV(points[2]);return 1;}
var n=abX*acY-abY*acX;var vc=n*(aX*bY-aY*bX);var va=n*(bX*cY-bY*cX);if(va<=0.0&&un>=0.0&&ud>=0.0)
{var lambda=un/(un+ud);p1Out.x=p1s[1].x+lambda*(p1s[2].x-p1s[1].x);p1Out.y=p1s[1].y+lambda*(p1s[2].y-p1s[1].y);p2Out.x=p2s[1].x+lambda*(p2s[2].x-p2s[1].x);p2Out.y=p2s[1].y+lambda*(p2s[2].y-p2s[1].y);p1s[0].SetV(p1s[2]);p2s[0].SetV(p2s[2]);points[0].SetV(points[2]);return 2;}
var vb=n*(cX*aY-cY*aX);if(vb<=0.0&&tn>=0.0&&td>=0.0)
{var lambda=tn/(tn+td);p1Out.x=p1s[0].x+lambda*(p1s[2].x-p1s[0].x);p1Out.y=p1s[0].y+lambda*(p1s[2].y-p1s[0].y);p2Out.x=p2s[0].x+lambda*(p2s[2].x-p2s[0].x);p2Out.y=p2s[0].y+lambda*(p2s[2].y-p2s[0].y);p1s[1].SetV(p1s[2]);p2s[1].SetV(p2s[2]);points[1].SetV(points[2]);return 2;}
var denom=va+vb+vc;denom=1.0/denom;var u=va*denom;var v=vb*denom;var w=1.0-u-v;p1Out.x=u*p1s[0].x+v*p1s[1].x+w*p1s[2].x;p1Out.y=u*p1s[0].y+v*p1s[1].y+w*p1s[2].y;p2Out.x=u*p2s[0].x+v*p2s[1].x+w*p2s[2].x;p2Out.y=u*p2s[0].y+v*p2s[1].y+w*p2s[2].y;return 3;};b2Distance.InPoinsts=function(w,points,pointCount)
{for(var i=0;i<pointCount;++i)
{if(w.x==points[i].x&&w.y==points[i].y)
{return true;}}
return false;};b2Distance.Distance=function(p1Out,p2Out,shape1,shape2)
{var p1s=new Array(3);var p2s=new Array(3);var points=new Array(3);var pointCount=0;p1Out.SetV(shape1.m_position);p2Out.SetV(shape2.m_position);var vSqr=0.0;var maxIterations=20;for(var iter=0;iter<maxIterations;++iter)
{var vX=p2Out.x-p1Out.x;var vY=p2Out.y-p1Out.y;var w1=shape1.Support(vX,vY);var w2=shape2.Support(-vX,-vY);vSqr=(vX*vX+vY*vY);var wX=w2.x-w1.x;var wY=w2.y-w1.y;var vw=(vX*wX+vY*wY);if(vSqr-b2Dot(vX*wX+vY*wY)<=0.01*vSqr)
{if(pointCount==0)
{p1Out.SetV(w1);p2Out.SetV(w2);}
b2Distance.g_GJK_Iterations=iter;return Math.sqrt(vSqr);}
switch(pointCount)
{case 0:p1s[0].SetV(w1);p2s[0].SetV(w2);points[0]=w;p1Out.SetV(p1s[0]);p2Out.SetV(p2s[0]);++pointCount;break;case 1:p1s[1].SetV(w1);p2s[1].SetV(w2);points[1].x=wX;points[1].y=wY;pointCount=b2Distance.ProcessTwo(p1Out,p2Out,p1s,p2s,points);break;case 2:p1s[2].SetV(w1);p2s[2].SetV(w2);points[2].x=wX;points[2].y=wY;pointCount=b2Distance.ProcessThree(p1Out,p2Out,p1s,p2s,points);break;}
if(pointCount==3)
{b2Distance.g_GJK_Iterations=iter;return 0.0;}
var maxSqr=-Number.MAX_VALUE;for(var i=0;i<pointCount;++i)
{maxSqr=b2Math.b2Max(maxSqr,(points[i].x*points[i].x+points[i].y*points[i].y));}
if(pointCount==3||vSqr<=100.0*Number.MIN_VALUE*maxSqr)
{b2Distance.g_GJK_Iterations=iter;return Math.sqrt(vSqr);}}
b2Distance.g_GJK_Iterations=maxIterations;return Math.sqrt(vSqr);};b2Distance.g_GJK_Iterations=0;﻿
var b2Manifold=Class.create();b2Manifold.prototype={initialize:function(){this.points=new Array(b2Settings.b2_maxManifoldPoints);for(var i=0;i<b2Settings.b2_maxManifoldPoints;i++){this.points[i]=new b2ContactPoint();}
this.normal=new b2Vec2();},points:null,normal:null,pointCount:0};﻿
var b2OBB=Class.create();b2OBB.prototype={R:new b2Mat22(),center:new b2Vec2(),extents:new b2Vec2(),initialize:function(){this.R=new b2Mat22();this.center=new b2Vec2();this.extents=new b2Vec2();}};﻿
var b2Proxy=Class.create();b2Proxy.prototype={GetNext:function(){return this.lowerBounds[0];},SetNext:function(next){this.lowerBounds[0]=next;},IsValid:function(){return this.overlapCount!=b2BroadPhase.b2_invalid;},lowerBounds:[(0),(0)],upperBounds:[(0),(0)],overlapCount:0,timeStamp:0,userData:null,initialize:function(){this.lowerBounds=[(0),(0)];this.upperBounds=[(0),(0)];}}
﻿
var ClipVertex=Class.create();ClipVertex.prototype={v:new b2Vec2(),id:new b2ContactID(),initialize:function(){this.v=new b2Vec2();this.id=new b2ContactID();}};var b2Shape=Class.create();b2Shape.prototype={TestPoint:function(p){return false},GetUserData:function(){return this.m_userData;},GetType:function(){return this.m_type;},GetBody:function(){return this.m_body;},GetPosition:function(){return this.m_position;},GetRotationMatrix:function(){return this.m_R;},ResetProxy:function(broadPhase){},GetNext:function(){return this.m_next;},initialize:function(def,body){this.m_R=new b2Mat22();this.m_position=new b2Vec2();this.m_userData=def.userData;this.m_friction=def.friction;this.m_restitution=def.restitution;this.m_body=body;this.m_proxyId=b2Pair.b2_nullProxy;this.m_maxRadius=0.0;this.m_categoryBits=def.categoryBits;this.m_maskBits=def.maskBits;this.m_groupIndex=def.groupIndex;},DestroyProxy:function()
{if(this.m_proxyId!=b2Pair.b2_nullProxy)
{this.m_body.m_world.m_broadPhase.DestroyProxy(this.m_proxyId);this.m_proxyId=b2Pair.b2_nullProxy;}},Synchronize:function(position1,R1,position2,R2){},QuickSync:function(position,R){},Support:function(dX,dY,out){},GetMaxRadius:function(){return this.m_maxRadius;},m_next:null,m_R:new b2Mat22(),m_position:new b2Vec2(),m_type:0,m_userData:null,m_body:null,m_friction:null,m_restitution:null,m_maxRadius:null,m_proxyId:0,m_categoryBits:0,m_maskBits:0,m_groupIndex:0};b2Shape.Create=function(def,body,center){switch(def.type)
{case b2Shape.e_circleShape:{return new b2CircleShape(def,body,center);}
case b2Shape.e_boxShape:case b2Shape.e_polyShape:{return new b2PolyShape(def,body,center);}}
return null;};b2Shape.Destroy=function(shape)
{if(shape.m_proxyId!=b2Pair.b2_nullProxy)
shape.m_body.m_world.m_broadPhase.DestroyProxy(shape.m_proxyId);};b2Shape.e_unknownShape=-1;b2Shape.e_circleShape=0;b2Shape.e_boxShape=1;b2Shape.e_polyShape=2;b2Shape.e_meshShape=3;b2Shape.e_shapeTypeCount=4;b2Shape.PolyMass=function(massData,vs,count,rho)
{var center=new b2Vec2();center.SetZero();var area=0.0;var I=0.0;var pRef=new b2Vec2(0.0,0.0);var inv3=1.0/3.0;for(var i=0;i<count;++i)
{var p1=pRef;var p2=vs[i];var p3=i+1<count?vs[i+1]:vs[0];var e1=b2Math.SubtractVV(p2,p1);var e2=b2Math.SubtractVV(p3,p1);var D=b2Math.b2CrossVV(e1,e2);var triangleArea=0.5*D;area+=triangleArea;var tVec=new b2Vec2();tVec.SetV(p1);tVec.Add(p2);tVec.Add(p3);tVec.Multiply(inv3*triangleArea);center.Add(tVec);var px=p1.x;var py=p1.y;var ex1=e1.x;var ey1=e1.y;var ex2=e2.x;var ey2=e2.y;var intx2=inv3*(0.25*(ex1*ex1+ex2*ex1+ex2*ex2)+(px*ex1+px*ex2))+0.5*px*px;var inty2=inv3*(0.25*(ey1*ey1+ey2*ey1+ey2*ey2)+(py*ey1+py*ey2))+0.5*py*py;I+=D*(intx2+inty2);}
massData.mass=rho*area;center.Multiply(1.0/area);massData.center=center;I=rho*(I-area*b2Math.b2Dot(center,center));massData.I=I;};b2Shape.PolyCentroid=function(vs,count,out)
{var cX=0.0;var cY=0.0;var area=0.0;var pRefX=0.0;var pRefY=0.0;var inv3=1.0/3.0;for(var i=0;i<count;++i)
{var p1X=pRefX;var p1Y=pRefY;var p2X=vs[i].x;var p2Y=vs[i].y;var p3X=i+1<count?vs[i+1].x:vs[0].x;var p3Y=i+1<count?vs[i+1].y:vs[0].y;var e1X=p2X-p1X;var e1Y=p2Y-p1Y;var e2X=p3X-p1X;var e2Y=p3Y-p1Y;var D=(e1X*e2Y-e1Y*e2X);var triangleArea=0.5*D;area+=triangleArea;cX+=triangleArea*inv3*(p1X+p2X+p3X);cY+=triangleArea*inv3*(p1Y+p2Y+p3Y);}
cX*=1.0/area;cY*=1.0/area;out.Set(cX,cY);};﻿
var b2ShapeDef=Class.create();b2ShapeDef.prototype={initialize:function()
{this.type=b2Shape.e_unknownShape;this.userData=null;this.localPosition=new b2Vec2(0.0,0.0);this.localRotation=0.0;this.friction=0.2;this.restitution=0.0;this.density=0.0;this.categoryBits=0x0001;this.maskBits=0xFFFF;this.groupIndex=0;},ComputeMass:function(massData)
{massData.center=new b2Vec2(0.0,0.0)
if(this.density==0.0)
{massData.mass=0.0;massData.center.Set(0.0,0.0);massData.I=0.0;};switch(this.type)
{case b2Shape.e_circleShape:{var circle=this;massData.mass=this.density*b2Settings.b2_pi*circle.radius*circle.radius;massData.center.Set(0.0,0.0);massData.I=0.5*(massData.mass)*circle.radius*circle.radius;}
break;case b2Shape.e_boxShape:{var box=this;massData.mass=4.0*this.density*box.extents.x*box.extents.y;massData.center.Set(0.0,0.0);massData.I=massData.mass/3.0*b2Math.b2Dot(box.extents,box.extents);}
break;case b2Shape.e_polyShape:{var poly=this;b2Shape.PolyMass(massData,poly.vertices,poly.vertexCount,this.density);}
break;default:massData.mass=0.0;massData.center.Set(0.0,0.0);massData.I=0.0;break;}},type:0,userData:null,localPosition:null,localRotation:null,friction:null,restitution:null,density:null,categoryBits:0,maskBits:0,groupIndex:0};﻿
var b2BoxDef=Class.create();Object.extend(b2BoxDef.prototype,b2ShapeDef.prototype);Object.extend(b2BoxDef.prototype,{initialize:function()
{this.type=b2Shape.e_unknownShape;this.userData=null;this.localPosition=new b2Vec2(0.0,0.0);this.localRotation=0.0;this.friction=0.2;this.restitution=0.0;this.density=0.0;this.categoryBits=0x0001;this.maskBits=0xFFFF;this.groupIndex=0;this.type=b2Shape.e_boxShape;this.extents=new b2Vec2(1.0,1.0);},extents:null});﻿
var b2CircleDef=Class.create();Object.extend(b2CircleDef.prototype,b2ShapeDef.prototype);Object.extend(b2CircleDef.prototype,{initialize:function()
{this.type=b2Shape.e_unknownShape;this.userData=null;this.localPosition=new b2Vec2(0.0,0.0);this.localRotation=0.0;this.friction=0.2;this.restitution=0.0;this.density=0.0;this.categoryBits=0x0001;this.maskBits=0xFFFF;this.groupIndex=0;this.type=b2Shape.e_circleShape;this.radius=1.0;},radius:null});var b2CircleShape=Class.create();Object.extend(b2CircleShape.prototype,b2Shape.prototype);Object.extend(b2CircleShape.prototype,{TestPoint:function(p){var d=new b2Vec2();d.SetV(p);d.Subtract(this.m_position);return b2Math.b2Dot(d,d)<=this.m_radius*this.m_radius;},initialize:function(def,body,localCenter){this.m_R=new b2Mat22();this.m_position=new b2Vec2();this.m_userData=def.userData;this.m_friction=def.friction;this.m_restitution=def.restitution;this.m_body=body;this.m_proxyId=b2Pair.b2_nullProxy;this.m_maxRadius=0.0;this.m_categoryBits=def.categoryBits;this.m_maskBits=def.maskBits;this.m_groupIndex=def.groupIndex;this.m_localPosition=new b2Vec2();var circle=def;this.m_localPosition.Set(def.localPosition.x-localCenter.x,def.localPosition.y-localCenter.y);this.m_type=b2Shape.e_circleShape;this.m_radius=circle.radius;this.m_R.SetM(this.m_body.m_R);var rX=this.m_R.col1.x*this.m_localPosition.x+this.m_R.col2.x*this.m_localPosition.y;var rY=this.m_R.col1.y*this.m_localPosition.x+this.m_R.col2.y*this.m_localPosition.y;this.m_position.x=this.m_body.m_position.x+rX;this.m_position.y=this.m_body.m_position.y+rY;this.m_maxRadius=Math.sqrt(rX*rX+rY*rY)+this.m_radius;var aabb=new b2AABB();aabb.minVertex.Set(this.m_position.x-this.m_radius,this.m_position.y-this.m_radius);aabb.maxVertex.Set(this.m_position.x+this.m_radius,this.m_position.y+this.m_radius);var broadPhase=this.m_body.m_world.m_broadPhase;if(broadPhase.InRange(aabb))
{this.m_proxyId=broadPhase.CreateProxy(aabb,this);}
else
{this.m_proxyId=b2Pair.b2_nullProxy;}
if(this.m_proxyId==b2Pair.b2_nullProxy)
{this.m_body.Freeze();}},Synchronize:function(position1,R1,position2,R2){this.m_R.SetM(R2);this.m_position.x=(R2.col1.x*this.m_localPosition.x+R2.col2.x*this.m_localPosition.y)+position2.x;this.m_position.y=(R2.col1.y*this.m_localPosition.x+R2.col2.y*this.m_localPosition.y)+position2.y;if(this.m_proxyId==b2Pair.b2_nullProxy)
{return;}
var p1X=position1.x+(R1.col1.x*this.m_localPosition.x+R1.col2.x*this.m_localPosition.y);var p1Y=position1.y+(R1.col1.y*this.m_localPosition.x+R1.col2.y*this.m_localPosition.y);var lowerX=Math.min(p1X,this.m_position.x);var lowerY=Math.min(p1Y,this.m_position.y);var upperX=Math.max(p1X,this.m_position.x);var upperY=Math.max(p1Y,this.m_position.y);var aabb=new b2AABB();aabb.minVertex.Set(lowerX-this.m_radius,lowerY-this.m_radius);aabb.maxVertex.Set(upperX+this.m_radius,upperY+this.m_radius);var broadPhase=this.m_body.m_world.m_broadPhase;if(broadPhase.InRange(aabb))
{broadPhase.MoveProxy(this.m_proxyId,aabb);}
else
{this.m_body.Freeze();}},QuickSync:function(position,R){this.m_R.SetM(R);this.m_position.x=(R.col1.x*this.m_localPosition.x+R.col2.x*this.m_localPosition.y)+position.x;this.m_position.y=(R.col1.y*this.m_localPosition.x+R.col2.y*this.m_localPosition.y)+position.y;},ResetProxy:function(broadPhase)
{if(this.m_proxyId==b2Pair.b2_nullProxy)
{return;}
var proxy=broadPhase.GetProxy(this.m_proxyId);broadPhase.DestroyProxy(this.m_proxyId);proxy=null;var aabb=new b2AABB();aabb.minVertex.Set(this.m_position.x-this.m_radius,this.m_position.y-this.m_radius);aabb.maxVertex.Set(this.m_position.x+this.m_radius,this.m_position.y+this.m_radius);if(broadPhase.InRange(aabb))
{this.m_proxyId=broadPhase.CreateProxy(aabb,this);}
else
{this.m_proxyId=b2Pair.b2_nullProxy;}
if(this.m_proxyId==b2Pair.b2_nullProxy)
{this.m_body.Freeze();}},Support:function(dX,dY,out)
{var len=Math.sqrt(dX*dX+dY*dY);dX/=len;dY/=len;out.Set(this.m_position.x+this.m_radius*dX,this.m_position.y+this.m_radius*dY);},m_localPosition:new b2Vec2(),m_radius:null});﻿
var b2MassData=Class.create();b2MassData.prototype={mass:0.0,center:new b2Vec2(0,0),I:0.0,initialize:function(){this.center=new b2Vec2(0,0);}}
﻿
var b2PolyDef=Class.create();Object.extend(b2PolyDef.prototype,b2ShapeDef.prototype);Object.extend(b2PolyDef.prototype,{initialize:function()
{this.type=b2Shape.e_unknownShape;this.userData=null;this.localPosition=new b2Vec2(0.0,0.0);this.localRotation=0.0;this.friction=0.2;this.restitution=0.0;this.density=0.0;this.categoryBits=0x0001;this.maskBits=0xFFFF;this.groupIndex=0;this.vertices=new Array(b2Settings.b2_maxPolyVertices);this.type=b2Shape.e_polyShape;this.vertexCount=0;for(var i=0;i<b2Settings.b2_maxPolyVertices;i++){this.vertices[i]=new b2Vec2();}},vertices:new Array(b2Settings.b2_maxPolyVertices),vertexCount:0});var b2PolyShape=Class.create();Object.extend(b2PolyShape.prototype,b2Shape.prototype);Object.extend(b2PolyShape.prototype,{TestPoint:function(p){var pLocal=new b2Vec2();pLocal.SetV(p);pLocal.Subtract(this.m_position);pLocal.MulTM(this.m_R);for(var i=0;i<this.m_vertexCount;++i)
{var tVec=new b2Vec2();tVec.SetV(pLocal);tVec.Subtract(this.m_vertices[i]);var dot=b2Math.b2Dot(this.m_normals[i],tVec);if(dot>0.0)
{return false;}}
return true;},initialize:function(def,body,newOrigin){this.m_R=new b2Mat22();this.m_position=new b2Vec2();this.m_userData=def.userData;this.m_friction=def.friction;this.m_restitution=def.restitution;this.m_body=body;this.m_proxyId=b2Pair.b2_nullProxy;this.m_maxRadius=0.0;this.m_categoryBits=def.categoryBits;this.m_maskBits=def.maskBits;this.m_groupIndex=def.groupIndex;this.syncAABB=new b2AABB();this.syncMat=new b2Mat22();this.m_localCentroid=new b2Vec2();this.m_localOBB=new b2OBB();var i=0;var hX;var hY;var tVec;var aabb=new b2AABB();this.m_vertices=new Array(b2Settings.b2_maxPolyVertices);this.m_coreVertices=new Array(b2Settings.b2_maxPolyVertices);this.m_normals=new Array(b2Settings.b2_maxPolyVertices);this.m_type=b2Shape.e_polyShape;var localR=new b2Mat22(def.localRotation);if(def.type==b2Shape.e_boxShape)
{this.m_localCentroid.x=def.localPosition.x-newOrigin.x;this.m_localCentroid.y=def.localPosition.y-newOrigin.y;var box=def;this.m_vertexCount=4;hX=box.extents.x;hY=box.extents.y;var hcX=Math.max(0.0,hX-2.0*b2Settings.b2_linearSlop);var hcY=Math.max(0.0,hY-2.0*b2Settings.b2_linearSlop);tVec=this.m_vertices[0]=new b2Vec2();tVec.x=localR.col1.x*hX+localR.col2.x*hY;tVec.y=localR.col1.y*hX+localR.col2.y*hY;tVec=this.m_vertices[1]=new b2Vec2();tVec.x=localR.col1.x*-hX+localR.col2.x*hY;tVec.y=localR.col1.y*-hX+localR.col2.y*hY;tVec=this.m_vertices[2]=new b2Vec2();tVec.x=localR.col1.x*-hX+localR.col2.x*-hY;tVec.y=localR.col1.y*-hX+localR.col2.y*-hY;tVec=this.m_vertices[3]=new b2Vec2();tVec.x=localR.col1.x*hX+localR.col2.x*-hY;tVec.y=localR.col1.y*hX+localR.col2.y*-hY;tVec=this.m_coreVertices[0]=new b2Vec2();tVec.x=localR.col1.x*hcX+localR.col2.x*hcY;tVec.y=localR.col1.y*hcX+localR.col2.y*hcY;tVec=this.m_coreVertices[1]=new b2Vec2();tVec.x=localR.col1.x*-hcX+localR.col2.x*hcY;tVec.y=localR.col1.y*-hcX+localR.col2.y*hcY;tVec=this.m_coreVertices[2]=new b2Vec2();tVec.x=localR.col1.x*-hcX+localR.col2.x*-hcY;tVec.y=localR.col1.y*-hcX+localR.col2.y*-hcY;tVec=this.m_coreVertices[3]=new b2Vec2();tVec.x=localR.col1.x*hcX+localR.col2.x*-hcY;tVec.y=localR.col1.y*hcX+localR.col2.y*-hcY;}
else
{var poly=def;this.m_vertexCount=poly.vertexCount;b2Shape.PolyCentroid(poly.vertices,poly.vertexCount,b2PolyShape.tempVec);var centroidX=b2PolyShape.tempVec.x;var centroidY=b2PolyShape.tempVec.y;this.m_localCentroid.x=def.localPosition.x+(localR.col1.x*centroidX+localR.col2.x*centroidY)-newOrigin.x;this.m_localCentroid.y=def.localPosition.y+(localR.col1.y*centroidX+localR.col2.y*centroidY)-newOrigin.y;for(i=0;i<this.m_vertexCount;++i)
{this.m_vertices[i]=new b2Vec2();this.m_coreVertices[i]=new b2Vec2();hX=poly.vertices[i].x-centroidX;hY=poly.vertices[i].y-centroidY;this.m_vertices[i].x=localR.col1.x*hX+localR.col2.x*hY;this.m_vertices[i].y=localR.col1.y*hX+localR.col2.y*hY;var uX=this.m_vertices[i].x;var uY=this.m_vertices[i].y;var length=Math.sqrt(uX*uX+uY*uY);if(length>Number.MIN_VALUE)
{uX*=1.0/length;uY*=1.0/length;}
this.m_coreVertices[i].x=this.m_vertices[i].x-2.0*b2Settings.b2_linearSlop*uX;this.m_coreVertices[i].y=this.m_vertices[i].y-2.0*b2Settings.b2_linearSlop*uY;}}
var minVertexX=Number.MAX_VALUE;var minVertexY=Number.MAX_VALUE;var maxVertexX=-Number.MAX_VALUE;var maxVertexY=-Number.MAX_VALUE;this.m_maxRadius=0.0;for(i=0;i<this.m_vertexCount;++i)
{var v=this.m_vertices[i];minVertexX=Math.min(minVertexX,v.x);minVertexY=Math.min(minVertexY,v.y);maxVertexX=Math.max(maxVertexX,v.x);maxVertexY=Math.max(maxVertexY,v.y);this.m_maxRadius=Math.max(this.m_maxRadius,v.Length());}
this.m_localOBB.R.SetIdentity();this.m_localOBB.center.Set((minVertexX+maxVertexX)*0.5,(minVertexY+maxVertexY)*0.5);this.m_localOBB.extents.Set((maxVertexX-minVertexX)*0.5,(maxVertexY-minVertexY)*0.5);var i1=0;var i2=0;for(i=0;i<this.m_vertexCount;++i)
{this.m_normals[i]=new b2Vec2();i1=i;i2=i+1<this.m_vertexCount?i+1:0;this.m_normals[i].x=this.m_vertices[i2].y-this.m_vertices[i1].y;this.m_normals[i].y=-(this.m_vertices[i2].x-this.m_vertices[i1].x);this.m_normals[i].Normalize();}
for(i=0;i<this.m_vertexCount;++i)
{i1=i;i2=i+1<this.m_vertexCount?i+1:0;}
this.m_R.SetM(this.m_body.m_R);this.m_position.x=this.m_body.m_position.x+(this.m_R.col1.x*this.m_localCentroid.x+this.m_R.col2.x*this.m_localCentroid.y);this.m_position.y=this.m_body.m_position.y+(this.m_R.col1.y*this.m_localCentroid.x+this.m_R.col2.y*this.m_localCentroid.y);b2PolyShape.tAbsR.col1.x=this.m_R.col1.x*this.m_localOBB.R.col1.x+this.m_R.col2.x*this.m_localOBB.R.col1.y;b2PolyShape.tAbsR.col1.y=this.m_R.col1.y*this.m_localOBB.R.col1.x+this.m_R.col2.y*this.m_localOBB.R.col1.y;b2PolyShape.tAbsR.col2.x=this.m_R.col1.x*this.m_localOBB.R.col2.x+this.m_R.col2.x*this.m_localOBB.R.col2.y;b2PolyShape.tAbsR.col2.y=this.m_R.col1.y*this.m_localOBB.R.col2.x+this.m_R.col2.y*this.m_localOBB.R.col2.y;b2PolyShape.tAbsR.Abs()
hX=b2PolyShape.tAbsR.col1.x*this.m_localOBB.extents.x+b2PolyShape.tAbsR.col2.x*this.m_localOBB.extents.y;hY=b2PolyShape.tAbsR.col1.y*this.m_localOBB.extents.x+b2PolyShape.tAbsR.col2.y*this.m_localOBB.extents.y;var positionX=this.m_position.x+(this.m_R.col1.x*this.m_localOBB.center.x+this.m_R.col2.x*this.m_localOBB.center.y);var positionY=this.m_position.y+(this.m_R.col1.y*this.m_localOBB.center.x+this.m_R.col2.y*this.m_localOBB.center.y);aabb.minVertex.x=positionX-hX;aabb.minVertex.y=positionY-hY;aabb.maxVertex.x=positionX+hX;aabb.maxVertex.y=positionY+hY;var broadPhase=this.m_body.m_world.m_broadPhase;if(broadPhase.InRange(aabb))
{this.m_proxyId=broadPhase.CreateProxy(aabb,this);}
else
{this.m_proxyId=b2Pair.b2_nullProxy;}
if(this.m_proxyId==b2Pair.b2_nullProxy)
{this.m_body.Freeze();}},syncAABB:new b2AABB(),syncMat:new b2Mat22(),Synchronize:function(position1,R1,position2,R2){this.m_R.SetM(R2);this.m_position.x=this.m_body.m_position.x+(R2.col1.x*this.m_localCentroid.x+R2.col2.x*this.m_localCentroid.y);this.m_position.y=this.m_body.m_position.y+(R2.col1.y*this.m_localCentroid.x+R2.col2.y*this.m_localCentroid.y);if(this.m_proxyId==b2Pair.b2_nullProxy)
{return;}
var hX;var hY;var v1=R1.col1;var v2=R1.col2;var v3=this.m_localOBB.R.col1;var v4=this.m_localOBB.R.col2;this.syncMat.col1.x=v1.x*v3.x+v2.x*v3.y;this.syncMat.col1.y=v1.y*v3.x+v2.y*v3.y;this.syncMat.col2.x=v1.x*v4.x+v2.x*v4.y;this.syncMat.col2.y=v1.y*v4.x+v2.y*v4.y;this.syncMat.Abs();hX=this.m_localCentroid.x+this.m_localOBB.center.x;hY=this.m_localCentroid.y+this.m_localOBB.center.y;var centerX=position1.x+(R1.col1.x*hX+R1.col2.x*hY);var centerY=position1.y+(R1.col1.y*hX+R1.col2.y*hY);hX=this.syncMat.col1.x*this.m_localOBB.extents.x+this.syncMat.col2.x*this.m_localOBB.extents.y;hY=this.syncMat.col1.y*this.m_localOBB.extents.x+this.syncMat.col2.y*this.m_localOBB.extents.y;this.syncAABB.minVertex.x=centerX-hX;this.syncAABB.minVertex.y=centerY-hY;this.syncAABB.maxVertex.x=centerX+hX;this.syncAABB.maxVertex.y=centerY+hY;v1=R2.col1;v2=R2.col2;v3=this.m_localOBB.R.col1;v4=this.m_localOBB.R.col2;this.syncMat.col1.x=v1.x*v3.x+v2.x*v3.y;this.syncMat.col1.y=v1.y*v3.x+v2.y*v3.y;this.syncMat.col2.x=v1.x*v4.x+v2.x*v4.y;this.syncMat.col2.y=v1.y*v4.x+v2.y*v4.y;this.syncMat.Abs();hX=this.m_localCentroid.x+this.m_localOBB.center.x;hY=this.m_localCentroid.y+this.m_localOBB.center.y;centerX=position2.x+(R2.col1.x*hX+R2.col2.x*hY);centerY=position2.y+(R2.col1.y*hX+R2.col2.y*hY);hX=this.syncMat.col1.x*this.m_localOBB.extents.x+this.syncMat.col2.x*this.m_localOBB.extents.y;hY=this.syncMat.col1.y*this.m_localOBB.extents.x+this.syncMat.col2.y*this.m_localOBB.extents.y;this.syncAABB.minVertex.x=Math.min(this.syncAABB.minVertex.x,centerX-hX);this.syncAABB.minVertex.y=Math.min(this.syncAABB.minVertex.y,centerY-hY);this.syncAABB.maxVertex.x=Math.max(this.syncAABB.maxVertex.x,centerX+hX);this.syncAABB.maxVertex.y=Math.max(this.syncAABB.maxVertex.y,centerY+hY);var broadPhase=this.m_body.m_world.m_broadPhase;if(broadPhase.InRange(this.syncAABB))
{broadPhase.MoveProxy(this.m_proxyId,this.syncAABB);}
else
{this.m_body.Freeze();}},QuickSync:function(position,R){this.m_R.SetM(R);this.m_position.x=position.x+(R.col1.x*this.m_localCentroid.x+R.col2.x*this.m_localCentroid.y);this.m_position.y=position.y+(R.col1.y*this.m_localCentroid.x+R.col2.y*this.m_localCentroid.y);},ResetProxy:function(broadPhase){if(this.m_proxyId==b2Pair.b2_nullProxy)
{return;}
var proxy=broadPhase.GetProxy(this.m_proxyId);broadPhase.DestroyProxy(this.m_proxyId);proxy=null;var R=b2Math.b2MulMM(this.m_R,this.m_localOBB.R);var absR=b2Math.b2AbsM(R);var h=b2Math.b2MulMV(absR,this.m_localOBB.extents);var position=b2Math.b2MulMV(this.m_R,this.m_localOBB.center);position.Add(this.m_position);var aabb=new b2AABB();aabb.minVertex.SetV(position);aabb.minVertex.Subtract(h);aabb.maxVertex.SetV(position);aabb.maxVertex.Add(h);if(broadPhase.InRange(aabb))
{this.m_proxyId=broadPhase.CreateProxy(aabb,this);}
else
{this.m_proxyId=b2Pair.b2_nullProxy;}
if(this.m_proxyId==b2Pair.b2_nullProxy)
{this.m_body.Freeze();}},Support:function(dX,dY,out)
{var dLocalX=(dX*this.m_R.col1.x+dY*this.m_R.col1.y);var dLocalY=(dX*this.m_R.col2.x+dY*this.m_R.col2.y);var bestIndex=0;var bestValue=(this.m_coreVertices[0].x*dLocalX+this.m_coreVertices[0].y*dLocalY);for(var i=1;i<this.m_vertexCount;++i)
{var value=(this.m_coreVertices[i].x*dLocalX+this.m_coreVertices[i].y*dLocalY);if(value>bestValue)
{bestIndex=i;bestValue=value;}}
out.Set(this.m_position.x+(this.m_R.col1.x*this.m_coreVertices[bestIndex].x+this.m_R.col2.x*this.m_coreVertices[bestIndex].y),this.m_position.y+(this.m_R.col1.y*this.m_coreVertices[bestIndex].x+this.m_R.col2.y*this.m_coreVertices[bestIndex].y));},m_localCentroid:new b2Vec2(),m_localOBB:new b2OBB(),m_vertices:null,m_coreVertices:null,m_vertexCount:0,m_normals:null});b2PolyShape.tempVec=new b2Vec2();b2PolyShape.tAbsR=new b2Mat22();﻿
var b2Body=Class.create();b2Body.prototype={SetOriginPosition:function(position,rotation){if(this.IsFrozen())
{return;}
this.m_rotation=rotation;this.m_R.Set(this.m_rotation);this.m_position=b2Math.AddVV(position,b2Math.b2MulMV(this.m_R,this.m_center));this.m_position0.SetV(this.m_position);this.m_rotation0=this.m_rotation;for(var s=this.m_shapeList;s!=null;s=s.m_next)
{s.Synchronize(this.m_position,this.m_R,this.m_position,this.m_R);}
this.m_world.m_broadPhase.Commit();},GetOriginPosition:function(){return b2Math.SubtractVV(this.m_position,b2Math.b2MulMV(this.m_R,this.m_center));},SetCenterPosition:function(position,rotation){if(this.IsFrozen())
{return;}
this.m_rotation=rotation;this.m_R.Set(this.m_rotation);this.m_position.SetV(position);this.m_position0.SetV(this.m_position);this.m_rotation0=this.m_rotation;for(var s=this.m_shapeList;s!=null;s=s.m_next)
{s.Synchronize(this.m_position,this.m_R,this.m_position,this.m_R);}
this.m_world.m_broadPhase.Commit();},GetCenterPosition:function(){return this.m_position;},GetRotation:function(){return this.m_rotation;},GetRotationMatrix:function(){return this.m_R;},SetLinearVelocity:function(v){this.m_linearVelocity.SetV(v);},GetLinearVelocity:function(){return this.m_linearVelocity;},SetAngularVelocity:function(w){this.m_angularVelocity=w;},GetAngularVelocity:function(){return this.m_angularVelocity;},ApplyForce:function(force,point)
{if(this.IsSleeping()==false)
{this.m_force.Add(force);this.m_torque+=b2Math.b2CrossVV(b2Math.SubtractVV(point,this.m_position),force);}},ApplyTorque:function(torque)
{if(this.IsSleeping()==false)
{this.m_torque+=torque;}},ApplyImpulse:function(impulse,point)
{if(this.IsSleeping()==false)
{this.m_linearVelocity.Add(b2Math.MulFV(this.m_invMass,impulse));this.m_angularVelocity+=(this.m_invI*b2Math.b2CrossVV(b2Math.SubtractVV(point,this.m_position),impulse));}},GetMass:function(){return this.m_mass;},GetInertia:function(){return this.m_I;},GetWorldPoint:function(localPoint){return b2Math.AddVV(this.m_position,b2Math.b2MulMV(this.m_R,localPoint));},GetWorldVector:function(localVector){return b2Math.b2MulMV(this.m_R,localVector);},GetLocalPoint:function(worldPoint){return b2Math.b2MulTMV(this.m_R,b2Math.SubtractVV(worldPoint,this.m_position));},GetLocalVector:function(worldVector){return b2Math.b2MulTMV(this.m_R,worldVector);},IsStatic:function(){return(this.m_flags&b2Body.e_staticFlag)==b2Body.e_staticFlag;},IsFrozen:function()
{return(this.m_flags&b2Body.e_frozenFlag)==b2Body.e_frozenFlag;},IsSleeping:function(){return(this.m_flags&b2Body.e_sleepFlag)==b2Body.e_sleepFlag;},AllowSleeping:function(flag)
{if(flag)
{this.m_flags|=b2Body.e_allowSleepFlag;}
else
{this.m_flags&=~b2Body.e_allowSleepFlag;this.WakeUp();}},WakeUp:function(){this.m_flags&=~b2Body.e_sleepFlag;this.m_sleepTime=0.0;},GetShapeList:function(){return this.m_shapeList;},GetContactList:function()
{return this.m_contactList;},GetJointList:function()
{return this.m_jointList;},GetNext:function(){return this.m_next;},GetUserData:function(){return this.m_userData;},initialize:function(bd,world){this.sMat0=new b2Mat22();this.m_position=new b2Vec2();this.m_R=new b2Mat22(0);this.m_position0=new b2Vec2();var i=0;var sd;var massData;this.m_flags=0;this.m_position.SetV(bd.position);this.m_rotation=bd.rotation;this.m_R.Set(this.m_rotation);this.m_position0.SetV(this.m_position);this.m_rotation0=this.m_rotation;this.m_world=world;this.m_linearDamping=b2Math.b2Clamp(1.0-bd.linearDamping,0.0,1.0);this.m_angularDamping=b2Math.b2Clamp(1.0-bd.angularDamping,0.0,1.0);this.m_force=new b2Vec2(0.0,0.0);this.m_torque=0.0;this.m_mass=0.0;var massDatas=new Array(b2Settings.b2_maxShapesPerBody);for(i=0;i<b2Settings.b2_maxShapesPerBody;i++){massDatas[i]=new b2MassData();}
this.m_shapeCount=0;this.m_center=new b2Vec2(0.0,0.0);for(i=0;i<b2Settings.b2_maxShapesPerBody;++i)
{sd=bd.shapes[i];if(sd==null)break;massData=massDatas[i];sd.ComputeMass(massData);this.m_mass+=massData.mass;this.m_center.x+=massData.mass*(sd.localPosition.x+massData.center.x);this.m_center.y+=massData.mass*(sd.localPosition.y+massData.center.y);++this.m_shapeCount;}
if(this.m_mass>0.0)
{this.m_center.Multiply(1.0/this.m_mass);this.m_position.Add(b2Math.b2MulMV(this.m_R,this.m_center));}
else
{this.m_flags|=b2Body.e_staticFlag;}
this.m_I=0.0;for(i=0;i<this.m_shapeCount;++i)
{sd=bd.shapes[i];massData=massDatas[i];this.m_I+=massData.I;var r=b2Math.SubtractVV(b2Math.AddVV(sd.localPosition,massData.center),this.m_center);this.m_I+=massData.mass*b2Math.b2Dot(r,r);}
if(this.m_mass>0.0)
{this.m_invMass=1.0/this.m_mass;}
else
{this.m_invMass=0.0;}
if(this.m_I>0.0&&bd.preventRotation==false)
{this.m_invI=1.0/this.m_I;}
else
{this.m_I=0.0;this.m_invI=0.0;}
this.m_linearVelocity=b2Math.AddVV(bd.linearVelocity,b2Math.b2CrossFV(bd.angularVelocity,this.m_center));this.m_angularVelocity=bd.angularVelocity;this.m_jointList=null;this.m_contactList=null;this.m_prev=null;this.m_next=null;this.m_shapeList=null;for(i=0;i<this.m_shapeCount;++i)
{sd=bd.shapes[i];var shape=b2Shape.Create(sd,this,this.m_center);shape.m_next=this.m_shapeList;this.m_shapeList=shape;}
this.m_sleepTime=0.0;if(bd.allowSleep)
{this.m_flags|=b2Body.e_allowSleepFlag;}
if(bd.isSleeping)
{this.m_flags|=b2Body.e_sleepFlag;}
if((this.m_flags&b2Body.e_sleepFlag)||this.m_invMass==0.0)
{this.m_linearVelocity.Set(0.0,0.0);this.m_angularVelocity=0.0;}
this.m_userData=bd.userData;},Destroy:function(){var s=this.m_shapeList;while(s)
{var s0=s;s=s.m_next;b2Shape.Destroy(s0);}},sMat0:new b2Mat22(),SynchronizeShapes:function(){this.sMat0.Set(this.m_rotation0);for(var s=this.m_shapeList;s!=null;s=s.m_next)
{s.Synchronize(this.m_position0,this.sMat0,this.m_position,this.m_R);}},QuickSyncShapes:function(){for(var s=this.m_shapeList;s!=null;s=s.m_next)
{s.QuickSync(this.m_position,this.m_R);}},IsConnected:function(other){for(var jn=this.m_jointList;jn!=null;jn=jn.next)
{if(jn.other==other)
return jn.joint.m_collideConnected==false;}
return false;},Freeze:function(){this.m_flags|=b2Body.e_frozenFlag;this.m_linearVelocity.SetZero();this.m_angularVelocity=0.0;for(var s=this.m_shapeList;s!=null;s=s.m_next)
{s.DestroyProxy();}},m_flags:0,m_position:new b2Vec2(),m_rotation:null,m_R:new b2Mat22(0),m_position0:new b2Vec2(),m_rotation0:null,m_linearVelocity:null,m_angularVelocity:null,m_force:null,m_torque:null,m_center:null,m_world:null,m_prev:null,m_next:null,m_shapeList:null,m_shapeCount:0,m_jointList:null,m_contactList:null,m_mass:null,m_invMass:null,m_I:null,m_invI:null,m_linearDamping:null,m_angularDamping:null,m_sleepTime:null,m_userData:null};b2Body.e_staticFlag=0x0001;b2Body.e_frozenFlag=0x0002;b2Body.e_islandFlag=0x0004;b2Body.e_sleepFlag=0x0008;b2Body.e_allowSleepFlag=0x0010;b2Body.e_destroyFlag=0x0020;﻿
var b2BodyDef=Class.create();b2BodyDef.prototype={initialize:function()
{this.shapes=new Array();this.userData=null;for(var i=0;i<b2Settings.b2_maxShapesPerBody;i++){this.shapes[i]=null;}
this.position=new b2Vec2(0.0,0.0);this.rotation=0.0;this.linearVelocity=new b2Vec2(0.0,0.0);this.angularVelocity=0.0;this.linearDamping=0.0;this.angularDamping=0.0;this.allowSleep=true;this.isSleeping=false;this.preventRotation=false;},userData:null,shapes:new Array(),position:null,rotation:null,linearVelocity:null,angularVelocity:null,linearDamping:null,angularDamping:null,allowSleep:null,isSleeping:null,preventRotation:null,AddShape:function(shape)
{for(var i=0;i<b2Settings.b2_maxShapesPerBody;++i)
{if(this.shapes[i]==null)
{this.shapes[i]=shape;break;}}}};﻿
var b2CollisionFilter=Class.create();b2CollisionFilter.prototype={ShouldCollide:function(shape1,shape2){if(shape1.m_groupIndex==shape2.m_groupIndex&&shape1.m_groupIndex!=0)
{return shape1.m_groupIndex>0;}
var collide=(shape1.m_maskBits&shape2.m_categoryBits)!=0&&(shape1.m_categoryBits&shape2.m_maskBits)!=0;return collide;},initialize:function(){}};b2CollisionFilter.b2_defaultFilter=new b2CollisionFilter;﻿
var b2Island=Class.create();b2Island.prototype={initialize:function(bodyCapacity,contactCapacity,jointCapacity,allocator)
{var i=0;this.m_bodyCapacity=bodyCapacity;this.m_contactCapacity=contactCapacity;this.m_jointCapacity=jointCapacity;this.m_bodyCount=0;this.m_contactCount=0;this.m_jointCount=0;this.m_bodies=new Array(bodyCapacity);for(i=0;i<bodyCapacity;i++)
this.m_bodies[i]=null;this.m_contacts=new Array(contactCapacity);for(i=0;i<contactCapacity;i++)
this.m_contacts[i]=null;this.m_joints=new Array(jointCapacity);for(i=0;i<jointCapacity;i++)
this.m_joints[i]=null;this.m_allocator=allocator;},Clear:function()
{this.m_bodyCount=0;this.m_contactCount=0;this.m_jointCount=0;},Solve:function(step,gravity)
{var i=0;var b;for(i=0;i<this.m_bodyCount;++i)
{b=this.m_bodies[i];if(b.m_invMass==0.0)
continue;b.m_linearVelocity.Add(b2Math.MulFV(step.dt,b2Math.AddVV(gravity,b2Math.MulFV(b.m_invMass,b.m_force))));b.m_angularVelocity+=step.dt*b.m_invI*b.m_torque;b.m_linearVelocity.Multiply(b.m_linearDamping);b.m_angularVelocity*=b.m_angularDamping;b.m_position0.SetV(b.m_position);b.m_rotation0=b.m_rotation;}
var contactSolver=new b2ContactSolver(this.m_contacts,this.m_contactCount,this.m_allocator);contactSolver.PreSolve();for(i=0;i<this.m_jointCount;++i)
{this.m_joints[i].PrepareVelocitySolver();}
for(i=0;i<step.iterations;++i)
{contactSolver.SolveVelocityConstraints();for(var j=0;j<this.m_jointCount;++j)
{this.m_joints[j].SolveVelocityConstraints(step);}}
for(i=0;i<this.m_bodyCount;++i)
{b=this.m_bodies[i];if(b.m_invMass==0.0)
continue;b.m_position.x+=step.dt*b.m_linearVelocity.x;b.m_position.y+=step.dt*b.m_linearVelocity.y;b.m_rotation+=step.dt*b.m_angularVelocity;b.m_R.Set(b.m_rotation);}
for(i=0;i<this.m_jointCount;++i)
{this.m_joints[i].PreparePositionSolver();}
if(b2World.s_enablePositionCorrection)
{for(b2Island.m_positionIterationCount=0;b2Island.m_positionIterationCount<step.iterations;++b2Island.m_positionIterationCount)
{var contactsOkay=contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);var jointsOkay=true;for(i=0;i<this.m_jointCount;++i)
{var jointOkay=this.m_joints[i].SolvePositionConstraints();jointsOkay=jointsOkay&&jointOkay;}
if(contactsOkay&&jointsOkay)
{break;}}}
contactSolver.PostSolve();for(i=0;i<this.m_bodyCount;++i)
{b=this.m_bodies[i];if(b.m_invMass==0.0)
continue;b.m_R.Set(b.m_rotation);b.SynchronizeShapes();b.m_force.Set(0.0,0.0);b.m_torque=0.0;}},UpdateSleep:function(dt)
{var i=0;var b;var minSleepTime=Number.MAX_VALUE;var linTolSqr=b2Settings.b2_linearSleepTolerance*b2Settings.b2_linearSleepTolerance;var angTolSqr=b2Settings.b2_angularSleepTolerance*b2Settings.b2_angularSleepTolerance;for(i=0;i<this.m_bodyCount;++i)
{b=this.m_bodies[i];if(b.m_invMass==0.0)
{continue;}
if((b.m_flags&b2Body.e_allowSleepFlag)==0)
{b.m_sleepTime=0.0;minSleepTime=0.0;}
if((b.m_flags&b2Body.e_allowSleepFlag)==0||b.m_angularVelocity*b.m_angularVelocity>angTolSqr||b2Math.b2Dot(b.m_linearVelocity,b.m_linearVelocity)>linTolSqr)
{b.m_sleepTime=0.0;minSleepTime=0.0;}
else
{b.m_sleepTime+=dt;minSleepTime=b2Math.b2Min(minSleepTime,b.m_sleepTime);}}
if(minSleepTime>=b2Settings.b2_timeToSleep)
{for(i=0;i<this.m_bodyCount;++i)
{b=this.m_bodies[i];b.m_flags|=b2Body.e_sleepFlag;}}},AddBody:function(body)
{this.m_bodies[this.m_bodyCount++]=body;},AddContact:function(contact)
{this.m_contacts[this.m_contactCount++]=contact;},AddJoint:function(joint)
{this.m_joints[this.m_jointCount++]=joint;},m_allocator:null,m_bodies:null,m_contacts:null,m_joints:null,m_bodyCount:0,m_jointCount:0,m_contactCount:0,m_bodyCapacity:0,m_contactCapacity:0,m_jointCapacity:0,m_positionError:null};b2Island.m_positionIterationCount=0;﻿
var b2TimeStep=Class.create();b2TimeStep.prototype={dt:null,inv_dt:null,iterations:0,initialize:function(){}};﻿
var b2ContactNode=Class.create();b2ContactNode.prototype={other:null,contact:null,prev:null,next:null,initialize:function(){}};﻿
var b2Contact=Class.create();b2Contact.prototype={GetManifolds:function(){return null},GetManifoldCount:function()
{return this.m_manifoldCount;},GetNext:function(){return this.m_next;},GetShape1:function(){return this.m_shape1;},GetShape2:function(){return this.m_shape2;},initialize:function(s1,s2)
{this.m_node1=new b2ContactNode();this.m_node2=new b2ContactNode();this.m_flags=0;if(!s1||!s2){this.m_shape1=null;this.m_shape2=null;return;}
this.m_shape1=s1;this.m_shape2=s2;this.m_manifoldCount=0;this.m_friction=Math.sqrt(this.m_shape1.m_friction*this.m_shape2.m_friction);this.m_restitution=b2Math.b2Max(this.m_shape1.m_restitution,this.m_shape2.m_restitution);this.m_prev=null;this.m_next=null;this.m_node1.contact=null;this.m_node1.prev=null;this.m_node1.next=null;this.m_node1.other=null;this.m_node2.contact=null;this.m_node2.prev=null;this.m_node2.next=null;this.m_node2.other=null;},Evaluate:function(){},m_flags:0,m_prev:null,m_next:null,m_node1:new b2ContactNode(),m_node2:new b2ContactNode(),m_shape1:null,m_shape2:null,m_manifoldCount:0,m_friction:null,m_restitution:null};b2Contact.e_islandFlag=0x0001;b2Contact.e_destroyFlag=0x0002;b2Contact.AddType=function(createFcn,destroyFcn,type1,type2)
{b2Contact.s_registers[type1][type2].createFcn=createFcn;b2Contact.s_registers[type1][type2].destroyFcn=destroyFcn;b2Contact.s_registers[type1][type2].primary=true;if(type1!=type2)
{b2Contact.s_registers[type2][type1].createFcn=createFcn;b2Contact.s_registers[type2][type1].destroyFcn=destroyFcn;b2Contact.s_registers[type2][type1].primary=false;}};b2Contact.InitializeRegisters=function(){b2Contact.s_registers=new Array(b2Shape.e_shapeTypeCount);for(var i=0;i<b2Shape.e_shapeTypeCount;i++){b2Contact.s_registers[i]=new Array(b2Shape.e_shapeTypeCount);for(var j=0;j<b2Shape.e_shapeTypeCount;j++){b2Contact.s_registers[i][j]=new b2ContactRegister();}}
b2Contact.AddType(b2CircleContact.Create,b2CircleContact.Destroy,b2Shape.e_circleShape,b2Shape.e_circleShape);b2Contact.AddType(b2PolyAndCircleContact.Create,b2PolyAndCircleContact.Destroy,b2Shape.e_polyShape,b2Shape.e_circleShape);b2Contact.AddType(b2PolyContact.Create,b2PolyContact.Destroy,b2Shape.e_polyShape,b2Shape.e_polyShape);};b2Contact.Create=function(shape1,shape2,allocator){if(b2Contact.s_initialized==false)
{b2Contact.InitializeRegisters();b2Contact.s_initialized=true;}
var type1=shape1.m_type;var type2=shape2.m_type;var createFcn=b2Contact.s_registers[type1][type2].createFcn;if(createFcn)
{if(b2Contact.s_registers[type1][type2].primary)
{return createFcn(shape1,shape2,allocator);}
else
{var c=createFcn(shape2,shape1,allocator);for(var i=0;i<c.GetManifoldCount();++i)
{var m=c.GetManifolds()[i];m.normal=m.normal.Negative();}
return c;}}
else
{return null;}};b2Contact.Destroy=function(contact,allocator){if(contact.GetManifoldCount()>0)
{contact.m_shape1.m_body.WakeUp();contact.m_shape2.m_body.WakeUp();}
var type1=contact.m_shape1.m_type;var type2=contact.m_shape2.m_type;var destroyFcn=b2Contact.s_registers[type1][type2].destroyFcn;destroyFcn(contact,allocator);};b2Contact.s_registers=null;b2Contact.s_initialized=false;﻿
var b2ContactConstraint=Class.create();b2ContactConstraint.prototype={initialize:function(){this.normal=new b2Vec2();this.points=new Array(b2Settings.b2_maxManifoldPoints);for(var i=0;i<b2Settings.b2_maxManifoldPoints;i++){this.points[i]=new b2ContactConstraintPoint();}},points:null,normal:new b2Vec2(),manifold:null,body1:null,body2:null,friction:null,restitution:null,pointCount:0};﻿
var b2ContactConstraintPoint=Class.create();b2ContactConstraintPoint.prototype={localAnchor1:new b2Vec2(),localAnchor2:new b2Vec2(),normalImpulse:null,tangentImpulse:null,positionImpulse:null,normalMass:null,tangentMass:null,separation:null,velocityBias:null,initialize:function(){this.localAnchor1=new b2Vec2();this.localAnchor2=new b2Vec2();}};﻿
var b2ContactRegister=Class.create();b2ContactRegister.prototype={createFcn:null,destroyFcn:null,primary:null,initialize:function(){}};﻿
var b2ContactSolver=Class.create();b2ContactSolver.prototype={initialize:function(contacts,contactCount,allocator){this.m_constraints=new Array();this.m_allocator=allocator;var i=0;var tVec;var tMat;this.m_constraintCount=0;for(i=0;i<contactCount;++i)
{this.m_constraintCount+=contacts[i].GetManifoldCount();}
for(i=0;i<this.m_constraintCount;i++){this.m_constraints[i]=new b2ContactConstraint();}
var count=0;for(i=0;i<contactCount;++i)
{var contact=contacts[i];var b1=contact.m_shape1.m_body;var b2=contact.m_shape2.m_body;var manifoldCount=contact.GetManifoldCount();var manifolds=contact.GetManifolds();var friction=contact.m_friction;var restitution=contact.m_restitution;var v1X=b1.m_linearVelocity.x;var v1Y=b1.m_linearVelocity.y;var v2X=b2.m_linearVelocity.x;var v2Y=b2.m_linearVelocity.y;var w1=b1.m_angularVelocity;var w2=b2.m_angularVelocity;for(var j=0;j<manifoldCount;++j)
{var manifold=manifolds[j];var normalX=manifold.normal.x;var normalY=manifold.normal.y;var c=this.m_constraints[count];c.body1=b1;c.body2=b2;c.manifold=manifold;c.normal.x=normalX;c.normal.y=normalY;c.pointCount=manifold.pointCount;c.friction=friction;c.restitution=restitution;for(var k=0;k<c.pointCount;++k)
{var cp=manifold.points[k];var ccp=c.points[k];ccp.normalImpulse=cp.normalImpulse;ccp.tangentImpulse=cp.tangentImpulse;ccp.separation=cp.separation;var r1X=cp.position.x-b1.m_position.x;var r1Y=cp.position.y-b1.m_position.y;var r2X=cp.position.x-b2.m_position.x;var r2Y=cp.position.y-b2.m_position.y;tVec=ccp.localAnchor1;tMat=b1.m_R;tVec.x=r1X*tMat.col1.x+r1Y*tMat.col1.y;tVec.y=r1X*tMat.col2.x+r1Y*tMat.col2.y;tVec=ccp.localAnchor2;tMat=b2.m_R;tVec.x=r2X*tMat.col1.x+r2Y*tMat.col1.y;tVec.y=r2X*tMat.col2.x+r2Y*tMat.col2.y;var r1Sqr=r1X*r1X+r1Y*r1Y;var r2Sqr=r2X*r2X+r2Y*r2Y;var rn1=r1X*normalX+r1Y*normalY;var rn2=r2X*normalX+r2Y*normalY;var kNormal=b1.m_invMass+b2.m_invMass;kNormal+=b1.m_invI*(r1Sqr-rn1*rn1)+b2.m_invI*(r2Sqr-rn2*rn2);ccp.normalMass=1.0/kNormal;var tangentX=normalY
var tangentY=-normalX;var rt1=r1X*tangentX+r1Y*tangentY;var rt2=r2X*tangentX+r2Y*tangentY;var kTangent=b1.m_invMass+b2.m_invMass;kTangent+=b1.m_invI*(r1Sqr-rt1*rt1)+b2.m_invI*(r2Sqr-rt2*rt2);ccp.tangentMass=1.0/kTangent;ccp.velocityBias=0.0;if(ccp.separation>0.0)
{ccp.velocityBias=-60.0*ccp.separation;}
var tX=v2X+(-w2*r2Y)-v1X-(-w1*r1Y);var tY=v2Y+(w2*r2X)-v1Y-(w1*r1X);var vRel=c.normal.x*tX+c.normal.y*tY;if(vRel<-b2Settings.b2_velocityThreshold)
{ccp.velocityBias+=-c.restitution*vRel;}}
++count;}}},PreSolve:function(){var tVec;var tVec2;var tMat;for(var i=0;i<this.m_constraintCount;++i)
{var c=this.m_constraints[i];var b1=c.body1;var b2=c.body2;var invMass1=b1.m_invMass;var invI1=b1.m_invI;var invMass2=b2.m_invMass;var invI2=b2.m_invI;var normalX=c.normal.x;var normalY=c.normal.y;var tangentX=normalY;var tangentY=-normalX;var j=0;var tCount=0;if(b2World.s_enableWarmStarting)
{tCount=c.pointCount;for(j=0;j<tCount;++j)
{var ccp=c.points[j];var PX=ccp.normalImpulse*normalX+ccp.tangentImpulse*tangentX;var PY=ccp.normalImpulse*normalY+ccp.tangentImpulse*tangentY;tMat=b1.m_R;tVec=ccp.localAnchor1;var r1X=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y;var r1Y=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y;tMat=b2.m_R;tVec=ccp.localAnchor2;var r2X=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y;var r2Y=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y;b1.m_angularVelocity-=invI1*(r1X*PY-r1Y*PX);b1.m_linearVelocity.x-=invMass1*PX;b1.m_linearVelocity.y-=invMass1*PY;b2.m_angularVelocity+=invI2*(r2X*PY-r2Y*PX);b2.m_linearVelocity.x+=invMass2*PX;b2.m_linearVelocity.y+=invMass2*PY;ccp.positionImpulse=0.0;}}
else{tCount=c.pointCount;for(j=0;j<tCount;++j)
{var ccp2=c.points[j];ccp2.normalImpulse=0.0;ccp2.tangentImpulse=0.0;ccp2.positionImpulse=0.0;}}}},SolveVelocityConstraints:function(){var j=0;var ccp;var r1X;var r1Y;var r2X;var r2Y;var dvX;var dvY;var lambda;var newImpulse;var PX;var PY;var tMat;var tVec;for(var i=0;i<this.m_constraintCount;++i)
{var c=this.m_constraints[i];var b1=c.body1;var b2=c.body2;var b1_angularVelocity=b1.m_angularVelocity;var b1_linearVelocity=b1.m_linearVelocity;var b2_angularVelocity=b2.m_angularVelocity;var b2_linearVelocity=b2.m_linearVelocity;var invMass1=b1.m_invMass;var invI1=b1.m_invI;var invMass2=b2.m_invMass;var invI2=b2.m_invI;var normalX=c.normal.x;var normalY=c.normal.y;var tangentX=normalY;var tangentY=-normalX;var tCount=c.pointCount;for(j=0;j<tCount;++j)
{ccp=c.points[j];tMat=b1.m_R;tVec=ccp.localAnchor1;r1X=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y
r1Y=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y
tMat=b2.m_R;tVec=ccp.localAnchor2;r2X=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y
r2Y=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y
dvX=b2_linearVelocity.x+(-b2_angularVelocity*r2Y)-b1_linearVelocity.x-(-b1_angularVelocity*r1Y);dvY=b2_linearVelocity.y+(b2_angularVelocity*r2X)-b1_linearVelocity.y-(b1_angularVelocity*r1X);var vn=dvX*normalX+dvY*normalY;lambda=-ccp.normalMass*(vn-ccp.velocityBias);newImpulse=b2Math.b2Max(ccp.normalImpulse+lambda,0.0);lambda=newImpulse-ccp.normalImpulse;PX=lambda*normalX;PY=lambda*normalY;b1_linearVelocity.x-=invMass1*PX;b1_linearVelocity.y-=invMass1*PY;b1_angularVelocity-=invI1*(r1X*PY-r1Y*PX);b2_linearVelocity.x+=invMass2*PX;b2_linearVelocity.y+=invMass2*PY;b2_angularVelocity+=invI2*(r2X*PY-r2Y*PX);ccp.normalImpulse=newImpulse;dvX=b2_linearVelocity.x+(-b2_angularVelocity*r2Y)-b1_linearVelocity.x-(-b1_angularVelocity*r1Y);dvY=b2_linearVelocity.y+(b2_angularVelocity*r2X)-b1_linearVelocity.y-(b1_angularVelocity*r1X);var vt=dvX*tangentX+dvY*tangentY;lambda=ccp.tangentMass*(-vt);var maxFriction=c.friction*ccp.normalImpulse;newImpulse=b2Math.b2Clamp(ccp.tangentImpulse+lambda,-maxFriction,maxFriction);lambda=newImpulse-ccp.tangentImpulse;PX=lambda*tangentX;PY=lambda*tangentY;b1_linearVelocity.x-=invMass1*PX;b1_linearVelocity.y-=invMass1*PY;b1_angularVelocity-=invI1*(r1X*PY-r1Y*PX);b2_linearVelocity.x+=invMass2*PX;b2_linearVelocity.y+=invMass2*PY;b2_angularVelocity+=invI2*(r2X*PY-r2Y*PX);ccp.tangentImpulse=newImpulse;}
b1.m_angularVelocity=b1_angularVelocity;b2.m_angularVelocity=b2_angularVelocity;}},SolvePositionConstraints:function(beta){var minSeparation=0.0;var tMat;var tVec;for(var i=0;i<this.m_constraintCount;++i)
{var c=this.m_constraints[i];var b1=c.body1;var b2=c.body2;var b1_position=b1.m_position;var b1_rotation=b1.m_rotation;var b2_position=b2.m_position;var b2_rotation=b2.m_rotation;var invMass1=b1.m_invMass;var invI1=b1.m_invI;var invMass2=b2.m_invMass;var invI2=b2.m_invI;var normalX=c.normal.x;var normalY=c.normal.y;var tangentX=normalY;var tangentY=-normalX;var tCount=c.pointCount;for(var j=0;j<tCount;++j)
{var ccp=c.points[j];tMat=b1.m_R;tVec=ccp.localAnchor1;var r1X=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y
var r1Y=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y
tMat=b2.m_R;tVec=ccp.localAnchor2;var r2X=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y
var r2Y=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y
var p1X=b1_position.x+r1X;var p1Y=b1_position.y+r1Y;var p2X=b2_position.x+r2X;var p2Y=b2_position.y+r2Y;var dpX=p2X-p1X;var dpY=p2Y-p1Y;var separation=(dpX*normalX+dpY*normalY)+ccp.separation;minSeparation=b2Math.b2Min(minSeparation,separation);var C=beta*b2Math.b2Clamp(separation+b2Settings.b2_linearSlop,-b2Settings.b2_maxLinearCorrection,0.0);var dImpulse=-ccp.normalMass*C;var impulse0=ccp.positionImpulse;ccp.positionImpulse=b2Math.b2Max(impulse0+dImpulse,0.0);dImpulse=ccp.positionImpulse-impulse0;var impulseX=dImpulse*normalX;var impulseY=dImpulse*normalY;b1_position.x-=invMass1*impulseX;b1_position.y-=invMass1*impulseY;b1_rotation-=invI1*(r1X*impulseY-r1Y*impulseX);b1.m_R.Set(b1_rotation);b2_position.x+=invMass2*impulseX;b2_position.y+=invMass2*impulseY;b2_rotation+=invI2*(r2X*impulseY-r2Y*impulseX);b2.m_R.Set(b2_rotation);}
b1.m_rotation=b1_rotation;b2.m_rotation=b2_rotation;}
return minSeparation>=-b2Settings.b2_linearSlop;},PostSolve:function(){for(var i=0;i<this.m_constraintCount;++i)
{var c=this.m_constraints[i];var m=c.manifold;for(var j=0;j<c.pointCount;++j)
{var mPoint=m.points[j];var cPoint=c.points[j];mPoint.normalImpulse=cPoint.normalImpulse;mPoint.tangentImpulse=cPoint.tangentImpulse;}}},m_allocator:null,m_constraints:new Array(),m_constraintCount:0};﻿
var b2CircleContact=Class.create();Object.extend(b2CircleContact.prototype,b2Contact.prototype);Object.extend(b2CircleContact.prototype,{initialize:function(s1,s2){this.m_node1=new b2ContactNode();this.m_node2=new b2ContactNode();this.m_flags=0;if(!s1||!s2){this.m_shape1=null;this.m_shape2=null;return;}
this.m_shape1=s1;this.m_shape2=s2;this.m_manifoldCount=0;this.m_friction=Math.sqrt(this.m_shape1.m_friction*this.m_shape2.m_friction);this.m_restitution=b2Math.b2Max(this.m_shape1.m_restitution,this.m_shape2.m_restitution);this.m_prev=null;this.m_next=null;this.m_node1.contact=null;this.m_node1.prev=null;this.m_node1.next=null;this.m_node1.other=null;this.m_node2.contact=null;this.m_node2.prev=null;this.m_node2.next=null;this.m_node2.other=null;this.m_manifold=[new b2Manifold()];this.m_manifold[0].pointCount=0;this.m_manifold[0].points[0].normalImpulse=0.0;this.m_manifold[0].points[0].tangentImpulse=0.0;},Evaluate:function(){b2Collision.b2CollideCircle(this.m_manifold[0],this.m_shape1,this.m_shape2,false);if(this.m_manifold[0].pointCount>0)
{this.m_manifoldCount=1;}
else
{this.m_manifoldCount=0;}},GetManifolds:function()
{return this.m_manifold;},m_manifold:[new b2Manifold()]});b2CircleContact.Create=function(shape1,shape2,allocator){return new b2CircleContact(shape1,shape2);};b2CircleContact.Destroy=function(contact,allocator){};﻿
var b2Conservative=Class.create();b2Conservative.prototype={initialize:function(){}}
b2Conservative.R1=new b2Mat22();b2Conservative.R2=new b2Mat22();b2Conservative.x1=new b2Vec2();b2Conservative.x2=new b2Vec2();b2Conservative.Conservative=function(shape1,shape2){var body1=shape1.GetBody();var body2=shape2.GetBody();var v1X=body1.m_position.x-body1.m_position0.x;var v1Y=body1.m_position.y-body1.m_position0.y;var omega1=body1.m_rotation-body1.m_rotation0;var v2X=body2.m_position.x-body2.m_position0.x;var v2Y=body2.m_position.y-body2.m_position0.y;var omega2=body2.m_rotation-body2.m_rotation0;var r1=shape1.GetMaxRadius();var r2=shape2.GetMaxRadius();var p1StartX=body1.m_position0.x;var p1StartY=body1.m_position0.y;var a1Start=body1.m_rotation0;var p2StartX=body2.m_position0.x;var p2StartY=body2.m_position0.y;var a2Start=body2.m_rotation0;var p1X=p1StartX;var p1Y=p1StartY;var a1=a1Start;var p2X=p2StartX;var p2Y=p2StartY;var a2=a2Start;b2Conservative.R1.Set(a1);b2Conservative.R2.Set(a2);shape1.QuickSync(p1,b2Conservative.R1);shape2.QuickSync(p2,b2Conservative.R2);var s1=0.0;var maxIterations=10;var dX;var dY;var invRelativeVelocity=0.0;var hit=true;for(var iter=0;iter<maxIterations;++iter)
{var distance=b2Distance.Distance(b2Conservative.x1,b2Conservative.x2,shape1,shape2);if(distance<b2Settings.b2_linearSlop)
{if(iter==0)
{hit=false;}
else
{hit=true;}
break;}
if(iter==0)
{dX=b2Conservative.x2.x-b2Conservative.x1.x;dY=b2Conservative.x2.y-b2Conservative.x1.y;var dLen=Math.sqrt(dX*dX+dY*dY);var relativeVelocity=(dX*(v1X-v2X)+dY*(v1Y-v2Y))+Math.abs(omega1)*r1+Math.abs(omega2)*r2;if(Math.abs(relativeVelocity)<Number.MIN_VALUE)
{hit=false;break;}
invRelativeVelocity=1.0/relativeVelocity;}
var ds=distance*invRelativeVelocity;var s2=s1+ds;if(s2<0.0||1.0<s2)
{hit=false;break;}
if(s2<(1.0+100.0*Number.MIN_VALUE)*s1)
{hit=true;break;}
s1=s2;p1X=p1StartX+s1*v1.x;p1Y=p1StartY+s1*v1.y;a1=a1Start+s1*omega1;p2X=p2StartX+s1*v2.x;p2Y=p2StartY+s1*v2.y;a2=a2Start+s1*omega2;b2Conservative.R1.Set(a1);b2Conservative.R2.Set(a2);shape1.QuickSync(p1,b2Conservative.R1);shape2.QuickSync(p2,b2Conservative.R2);}
if(hit)
{dX=b2Conservative.x2.x-b2Conservative.x1.x;dY=b2Conservative.x2.y-b2Conservative.x1.y;var length=Math.sqrt(dX*dX+dY*dY);if(length>FLT_EPSILON)
{d*=b2_linearSlop/length;}
if(body1.IsStatic())
{body1.m_position.x=p1X;body1.m_position.y=p1Y;}
else
{body1.m_position.x=p1X-dX;body1.m_position.y=p1Y-dY;}
body1.m_rotation=a1;body1.m_R.Set(a1);body1.QuickSyncShapes();if(body2.IsStatic())
{body2.m_position.x=p2X;body2.m_position.y=p2Y;}
else
{body2.m_position.x=p2X+dX;body2.m_position.y=p2Y+dY;}
body2.m_position.x=p2X+dX;body2.m_position.y=p2Y+dY;body2.m_rotation=a2;body2.m_R.Set(a2);body2.QuickSyncShapes();return true;}
shape1.QuickSync(body1.m_position,body1.m_R);shape2.QuickSync(body2.m_position,body2.m_R);return false;};﻿
var b2NullContact=Class.create();Object.extend(b2NullContact.prototype,b2Contact.prototype);Object.extend(b2NullContact.prototype,{initialize:function(s1,s2){this.m_node1=new b2ContactNode();this.m_node2=new b2ContactNode();this.m_flags=0;if(!s1||!s2){this.m_shape1=null;this.m_shape2=null;return;}
this.m_shape1=s1;this.m_shape2=s2;this.m_manifoldCount=0;this.m_friction=Math.sqrt(this.m_shape1.m_friction*this.m_shape2.m_friction);this.m_restitution=b2Math.b2Max(this.m_shape1.m_restitution,this.m_shape2.m_restitution);this.m_prev=null;this.m_next=null;this.m_node1.contact=null;this.m_node1.prev=null;this.m_node1.next=null;this.m_node1.other=null;this.m_node2.contact=null;this.m_node2.prev=null;this.m_node2.next=null;this.m_node2.other=null;},Evaluate:function(){},GetManifolds:function(){return null;}});﻿
var b2PolyAndCircleContact=Class.create();Object.extend(b2PolyAndCircleContact.prototype,b2Contact.prototype);Object.extend(b2PolyAndCircleContact.prototype,{initialize:function(s1,s2){this.m_node1=new b2ContactNode();this.m_node2=new b2ContactNode();this.m_flags=0;if(!s1||!s2){this.m_shape1=null;this.m_shape2=null;return;}
this.m_shape1=s1;this.m_shape2=s2;this.m_manifoldCount=0;this.m_friction=Math.sqrt(this.m_shape1.m_friction*this.m_shape2.m_friction);this.m_restitution=b2Math.b2Max(this.m_shape1.m_restitution,this.m_shape2.m_restitution);this.m_prev=null;this.m_next=null;this.m_node1.contact=null;this.m_node1.prev=null;this.m_node1.next=null;this.m_node1.other=null;this.m_node2.contact=null;this.m_node2.prev=null;this.m_node2.next=null;this.m_node2.other=null;this.m_manifold=[new b2Manifold()];b2Settings.b2Assert(this.m_shape1.m_type==b2Shape.e_polyShape);b2Settings.b2Assert(this.m_shape2.m_type==b2Shape.e_circleShape);this.m_manifold[0].pointCount=0;this.m_manifold[0].points[0].normalImpulse=0.0;this.m_manifold[0].points[0].tangentImpulse=0.0;},Evaluate:function(){b2Collision.b2CollidePolyAndCircle(this.m_manifold[0],this.m_shape1,this.m_shape2,false);if(this.m_manifold[0].pointCount>0)
{this.m_manifoldCount=1;}
else
{this.m_manifoldCount=0;}},GetManifolds:function()
{return this.m_manifold;},m_manifold:[new b2Manifold()]})
b2PolyAndCircleContact.Create=function(shape1,shape2,allocator){return new b2PolyAndCircleContact(shape1,shape2);};b2PolyAndCircleContact.Destroy=function(contact,allocator){};﻿
var b2PolyContact=Class.create();Object.extend(b2PolyContact.prototype,b2Contact.prototype);Object.extend(b2PolyContact.prototype,{initialize:function(s1,s2){this.m_node1=new b2ContactNode();this.m_node2=new b2ContactNode();this.m_flags=0;if(!s1||!s2){this.m_shape1=null;this.m_shape2=null;return;}
this.m_shape1=s1;this.m_shape2=s2;this.m_manifoldCount=0;this.m_friction=Math.sqrt(this.m_shape1.m_friction*this.m_shape2.m_friction);this.m_restitution=b2Math.b2Max(this.m_shape1.m_restitution,this.m_shape2.m_restitution);this.m_prev=null;this.m_next=null;this.m_node1.contact=null;this.m_node1.prev=null;this.m_node1.next=null;this.m_node1.other=null;this.m_node2.contact=null;this.m_node2.prev=null;this.m_node2.next=null;this.m_node2.other=null;this.m0=new b2Manifold();this.m_manifold=[new b2Manifold()];this.m_manifold[0].pointCount=0;},m0:new b2Manifold(),Evaluate:function(){var tMani=this.m_manifold[0];var tPoints=this.m0.points;for(var k=0;k<tMani.pointCount;k++){var tPoint=tPoints[k];var tPoint0=tMani.points[k];tPoint.normalImpulse=tPoint0.normalImpulse;tPoint.tangentImpulse=tPoint0.tangentImpulse;tPoint.id=tPoint0.id.Copy();}
this.m0.pointCount=tMani.pointCount;b2Collision.b2CollidePoly(tMani,this.m_shape1,this.m_shape2,false);if(tMani.pointCount>0)
{var match=[false,false];for(var i=0;i<tMani.pointCount;++i)
{var cp=tMani.points[i];cp.normalImpulse=0.0;cp.tangentImpulse=0.0;var idKey=cp.id.key;for(var j=0;j<this.m0.pointCount;++j)
{if(match[j]==true)
continue;var cp0=this.m0.points[j];var id0=cp0.id;if(id0.key==idKey)
{match[j]=true;cp.normalImpulse=cp0.normalImpulse;cp.tangentImpulse=cp0.tangentImpulse;break;}}}
this.m_manifoldCount=1;}
else
{this.m_manifoldCount=0;}},GetManifolds:function()
{return this.m_manifold;},m_manifold:[new b2Manifold()]});b2PolyContact.Create=function(shape1,shape2,allocator){return new b2PolyContact(shape1,shape2);};b2PolyContact.Destroy=function(contact,allocator){};﻿
var b2ContactManager=Class.create();Object.extend(b2ContactManager.prototype,b2PairCallback.prototype);Object.extend(b2ContactManager.prototype,{initialize:function(){this.m_nullContact=new b2NullContact();this.m_world=null;this.m_destroyImmediate=false;},PairAdded:function(proxyUserData1,proxyUserData2){var shape1=proxyUserData1;var shape2=proxyUserData2;var body1=shape1.m_body;var body2=shape2.m_body;if(body1.IsStatic()&&body2.IsStatic())
{return this.m_nullContact;}
if(shape1.m_body==shape2.m_body)
{return this.m_nullContact;}
if(body2.IsConnected(body1))
{return this.m_nullContact;}
if(this.m_world.m_filter!=null&&this.m_world.m_filter.ShouldCollide(shape1,shape2)==false)
{return this.m_nullContact;}
if(body2.m_invMass==0.0)
{var tempShape=shape1;shape1=shape2;shape2=tempShape;var tempBody=body1;body1=body2;body2=tempBody;}
var contact=b2Contact.Create(shape1,shape2,this.m_world.m_blockAllocator);if(contact==null)
{return this.m_nullContact;}
else
{contact.m_prev=null;contact.m_next=this.m_world.m_contactList;if(this.m_world.m_contactList!=null)
{this.m_world.m_contactList.m_prev=contact;}
this.m_world.m_contactList=contact;this.m_world.m_contactCount++;}
return contact;},PairRemoved:function(proxyUserData1,proxyUserData2,pairUserData){if(pairUserData==null)
{return;}
var c=pairUserData;if(c!=this.m_nullContact)
{if(this.m_destroyImmediate==true)
{this.DestroyContact(c);c=null;}
else
{c.m_flags|=b2Contact.e_destroyFlag;}}},DestroyContact:function(c)
{if(c.m_prev)
{c.m_prev.m_next=c.m_next;}
if(c.m_next)
{c.m_next.m_prev=c.m_prev;}
if(c==this.m_world.m_contactList)
{this.m_world.m_contactList=c.m_next;}
if(c.GetManifoldCount()>0)
{var body1=c.m_shape1.m_body;var body2=c.m_shape2.m_body;var node1=c.m_node1;var node2=c.m_node2;body1.WakeUp();body2.WakeUp();if(node1.prev)
{node1.prev.next=node1.next;}
if(node1.next)
{node1.next.prev=node1.prev;}
if(node1==body1.m_contactList)
{body1.m_contactList=node1.next;}
node1.prev=null;node1.next=null;if(node2.prev)
{node2.prev.next=node2.next;}
if(node2.next)
{node2.next.prev=node2.prev;}
if(node2==body2.m_contactList)
{body2.m_contactList=node2.next;}
node2.prev=null;node2.next=null;}
b2Contact.Destroy(c,this.m_world.m_blockAllocator);--this.m_world.m_contactCount;},CleanContactList:function()
{var c=this.m_world.m_contactList;while(c!=null)
{var c0=c;c=c.m_next;if(c0.m_flags&b2Contact.e_destroyFlag)
{this.DestroyContact(c0);c0=null;}}},Collide:function()
{var body1;var body2;var node1;var node2;for(var c=this.m_world.m_contactList;c!=null;c=c.m_next)
{if(c.m_shape1.m_body.IsSleeping()&&c.m_shape2.m_body.IsSleeping())
{continue;}
var oldCount=c.GetManifoldCount();c.Evaluate();var newCount=c.GetManifoldCount();if(oldCount==0&&newCount>0)
{body1=c.m_shape1.m_body;body2=c.m_shape2.m_body;node1=c.m_node1;node2=c.m_node2;node1.contact=c;node1.other=body2;node1.prev=null;node1.next=body1.m_contactList;if(node1.next!=null)
{node1.next.prev=c.m_node1;}
body1.m_contactList=c.m_node1;node2.contact=c;node2.other=body1;node2.prev=null;node2.next=body2.m_contactList;if(node2.next!=null)
{node2.next.prev=node2;}
body2.m_contactList=node2;}
else if(oldCount>0&&newCount==0)
{body1=c.m_shape1.m_body;body2=c.m_shape2.m_body;node1=c.m_node1;node2=c.m_node2;if(node1.prev)
{node1.prev.next=node1.next;}
if(node1.next)
{node1.next.prev=node1.prev;}
if(node1==body1.m_contactList)
{body1.m_contactList=node1.next;}
node1.prev=null;node1.next=null;if(node2.prev)
{node2.prev.next=node2.next;}
if(node2.next)
{node2.next.prev=node2.prev;}
if(node2==body2.m_contactList)
{body2.m_contactList=node2.next;}
node2.prev=null;node2.next=null;}}},m_world:null,m_nullContact:new b2NullContact(),m_destroyImmediate:null});﻿
var b2World=Class.create();b2World.prototype={initialize:function(worldAABB,gravity,doSleep){this.step=new b2TimeStep();this.m_contactManager=new b2ContactManager();this.m_listener=null;this.m_filter=b2CollisionFilter.b2_defaultFilter;this.m_bodyList=null;this.m_contactList=null;this.m_jointList=null;this.m_bodyCount=0;this.m_contactCount=0;this.m_jointCount=0;this.m_bodyDestroyList=null;this.m_allowSleep=doSleep;this.m_gravity=gravity;this.m_contactManager.m_world=this;this.m_broadPhase=new b2BroadPhase(worldAABB,this.m_contactManager);var bd=new b2BodyDef();this.m_groundBody=this.CreateBody(bd);},SetListener:function(listener){this.m_listener=listener;},SetFilter:function(filter){this.m_filter=filter;},CreateBody:function(def){var b=new b2Body(def,this);b.m_prev=null;b.m_next=this.m_bodyList;if(this.m_bodyList)
{this.m_bodyList.m_prev=b;}
this.m_bodyList=b;++this.m_bodyCount;return b;},DestroyBody:function(b)
{if(b.m_flags&b2Body.e_destroyFlag)
{return;}
if(b.m_prev)
{b.m_prev.m_next=b.m_next;}
if(b.m_next)
{b.m_next.m_prev=b.m_prev;}
if(b==this.m_bodyList)
{this.m_bodyList=b.m_next;}
b.m_flags|=b2Body.e_destroyFlag;--this.m_bodyCount;b.m_prev=null;b.m_next=this.m_bodyDestroyList;this.m_bodyDestroyList=b;},CleanBodyList:function()
{this.m_contactManager.m_destroyImmediate=true;var b=this.m_bodyDestroyList;while(b)
{var b0=b;b=b.m_next;var jn=b0.m_jointList;while(jn)
{var jn0=jn;jn=jn.next;if(this.m_listener)
{this.m_listener.NotifyJointDestroyed(jn0.joint);}
this.DestroyJoint(jn0.joint);}
b0.Destroy();}
this.m_bodyDestroyList=null;this.m_contactManager.m_destroyImmediate=false;},CreateJoint:function(def){var j=b2Joint.Create(def,this.m_blockAllocator);j.m_prev=null;j.m_next=this.m_jointList;if(this.m_jointList)
{this.m_jointList.m_prev=j;}
this.m_jointList=j;++this.m_jointCount;j.m_node1.joint=j;j.m_node1.other=j.m_body2;j.m_node1.prev=null;j.m_node1.next=j.m_body1.m_jointList;if(j.m_body1.m_jointList)j.m_body1.m_jointList.prev=j.m_node1;j.m_body1.m_jointList=j.m_node1;j.m_node2.joint=j;j.m_node2.other=j.m_body1;j.m_node2.prev=null;j.m_node2.next=j.m_body2.m_jointList;if(j.m_body2.m_jointList)j.m_body2.m_jointList.prev=j.m_node2;j.m_body2.m_jointList=j.m_node2;if(def.collideConnected==false)
{var b=def.body1.m_shapeCount<def.body2.m_shapeCount?def.body1:def.body2;for(var s=b.m_shapeList;s;s=s.m_next)
{s.ResetProxy(this.m_broadPhase);}}
return j;},DestroyJoint:function(j)
{var collideConnected=j.m_collideConnected;if(j.m_prev)
{j.m_prev.m_next=j.m_next;}
if(j.m_next)
{j.m_next.m_prev=j.m_prev;}
if(j==this.m_jointList)
{this.m_jointList=j.m_next;}
var body1=j.m_body1;var body2=j.m_body2;body1.WakeUp();body2.WakeUp();if(j.m_node1.prev)
{j.m_node1.prev.next=j.m_node1.next;}
if(j.m_node1.next)
{j.m_node1.next.prev=j.m_node1.prev;}
if(j.m_node1==body1.m_jointList)
{body1.m_jointList=j.m_node1.next;}
j.m_node1.prev=null;j.m_node1.next=null;if(j.m_node2.prev)
{j.m_node2.prev.next=j.m_node2.next;}
if(j.m_node2.next)
{j.m_node2.next.prev=j.m_node2.prev;}
if(j.m_node2==body2.m_jointList)
{body2.m_jointList=j.m_node2.next;}
j.m_node2.prev=null;j.m_node2.next=null;b2Joint.Destroy(j,this.m_blockAllocator);--this.m_jointCount;if(collideConnected==false)
{var b=body1.m_shapeCount<body2.m_shapeCount?body1:body2;for(var s=b.m_shapeList;s;s=s.m_next)
{s.ResetProxy(this.m_broadPhase);}}},GetGroundBody:function(){return this.m_groundBody;},step:new b2TimeStep(),Step:function(dt,iterations){var b;var other;this.step.dt=dt;this.step.iterations=iterations;if(dt>0.0)
{this.step.inv_dt=1.0/dt;}
else
{this.step.inv_dt=0.0;}
this.m_positionIterationCount=0;this.m_contactManager.CleanContactList();this.CleanBodyList();this.m_contactManager.Collide();var island=new b2Island(this.m_bodyCount,this.m_contactCount,this.m_jointCount,this.m_stackAllocator);for(b=this.m_bodyList;b!=null;b=b.m_next)
{b.m_flags&=~b2Body.e_islandFlag;}
for(var c=this.m_contactList;c!=null;c=c.m_next)
{c.m_flags&=~b2Contact.e_islandFlag;}
for(var j=this.m_jointList;j!=null;j=j.m_next)
{j.m_islandFlag=false;}
var stackSize=this.m_bodyCount;var stack=new Array(this.m_bodyCount);for(var k=0;k<this.m_bodyCount;k++)
stack[k]=null;for(var seed=this.m_bodyList;seed!=null;seed=seed.m_next)
{if(seed.m_flags&(b2Body.e_staticFlag|b2Body.e_islandFlag|b2Body.e_sleepFlag|b2Body.e_frozenFlag))
{continue;}
island.Clear();var stackCount=0;stack[stackCount++]=seed;seed.m_flags|=b2Body.e_islandFlag;;while(stackCount>0)
{b=stack[--stackCount];island.AddBody(b);b.m_flags&=~b2Body.e_sleepFlag;if(b.m_flags&b2Body.e_staticFlag)
{continue;}
for(var cn=b.m_contactList;cn!=null;cn=cn.next)
{if(cn.contact.m_flags&b2Contact.e_islandFlag)
{continue;}
island.AddContact(cn.contact);cn.contact.m_flags|=b2Contact.e_islandFlag;other=cn.other;if(other.m_flags&b2Body.e_islandFlag)
{continue;}
stack[stackCount++]=other;other.m_flags|=b2Body.e_islandFlag;}
for(var jn=b.m_jointList;jn!=null;jn=jn.next)
{if(jn.joint.m_islandFlag==true)
{continue;}
island.AddJoint(jn.joint);jn.joint.m_islandFlag=true;other=jn.other;if(other.m_flags&b2Body.e_islandFlag)
{continue;}
stack[stackCount++]=other;other.m_flags|=b2Body.e_islandFlag;}}
island.Solve(this.step,this.m_gravity);this.m_positionIterationCount=b2Math.b2Max(this.m_positionIterationCount,b2Island.m_positionIterationCount);if(this.m_allowSleep)
{island.UpdateSleep(dt);}
for(var i=0;i<island.m_bodyCount;++i)
{b=island.m_bodies[i];if(b.m_flags&b2Body.e_staticFlag)
{b.m_flags&=~b2Body.e_islandFlag;}
if(b.IsFrozen()&&this.m_listener)
{var response=this.m_listener.NotifyBoundaryViolated(b);if(response==b2WorldListener.b2_destroyBody)
{this.DestroyBody(b);b=null;island.m_bodies[i]=null;}}}}
this.m_broadPhase.Commit();},Query:function(aabb,shapes,maxCount){var results=new Array();var count=this.m_broadPhase.QueryAABB(aabb,results,maxCount);for(var i=0;i<count;++i)
{shapes[i]=results[i];}
return count;},GetBodyList:function(){return this.m_bodyList;},GetJointList:function(){return this.m_jointList;},GetContactList:function(){return this.m_contactList;},m_blockAllocator:null,m_stackAllocator:null,m_broadPhase:null,m_contactManager:new b2ContactManager(),m_bodyList:null,m_contactList:null,m_jointList:null,m_bodyCount:0,m_contactCount:0,m_jointCount:0,m_bodyDestroyList:null,m_gravity:null,m_allowSleep:null,m_groundBody:null,m_listener:null,m_filter:null,m_positionIterationCount:0};b2World.s_enablePositionCorrection=1;b2World.s_enableWarmStarting=1;﻿
var b2WorldListener=Class.create();b2WorldListener.prototype={NotifyJointDestroyed:function(joint){},NotifyBoundaryViolated:function(body)
{return b2WorldListener.b2_freezeBody;},initialize:function(){}};b2WorldListener.b2_freezeBody=0;b2WorldListener.b2_destroyBody=1;﻿
var b2JointNode=Class.create();b2JointNode.prototype={other:null,joint:null,prev:null,next:null,initialize:function(){}}
﻿
var b2Joint=Class.create();b2Joint.prototype={GetType:function(){return this.m_type;},GetAnchor1:function(){return null},GetAnchor2:function(){return null},GetReactionForce:function(invTimeStep){return null},GetReactionTorque:function(invTimeStep){return 0.0},GetBody1:function()
{return this.m_body1;},GetBody2:function()
{return this.m_body2;},GetNext:function(){return this.m_next;},GetUserData:function(){return this.m_userData;},initialize:function(def){this.m_node1=new b2JointNode();this.m_node2=new b2JointNode();this.m_type=def.type;this.m_prev=null;this.m_next=null;this.m_body1=def.body1;this.m_body2=def.body2;this.m_collideConnected=def.collideConnected;this.m_islandFlag=false;this.m_userData=def.userData;},PrepareVelocitySolver:function(){},SolveVelocityConstraints:function(step){},PreparePositionSolver:function(){},SolvePositionConstraints:function(){return false},m_type:0,m_prev:null,m_next:null,m_node1:new b2JointNode(),m_node2:new b2JointNode(),m_body1:null,m_body2:null,m_islandFlag:null,m_collideConnected:null,m_userData:null};b2Joint.Create=function(def,allocator){var joint=null;switch(def.type)
{case b2Joint.e_distanceJoint:{joint=new b2DistanceJoint(def);}
break;case b2Joint.e_mouseJoint:{joint=new b2MouseJoint(def);}
break;case b2Joint.e_prismaticJoint:{joint=new b2PrismaticJoint(def);}
break;case b2Joint.e_revoluteJoint:{joint=new b2RevoluteJoint(def);}
break;case b2Joint.e_pulleyJoint:{joint=new b2PulleyJoint(def);}
break;case b2Joint.e_gearJoint:{joint=new b2GearJoint(def);}
break;default:break;}
return joint;};b2Joint.Destroy=function(joint,allocator){};b2Joint.e_unknownJoint=0;b2Joint.e_revoluteJoint=1;b2Joint.e_prismaticJoint=2;b2Joint.e_distanceJoint=3;b2Joint.e_pulleyJoint=4;b2Joint.e_mouseJoint=5;b2Joint.e_gearJoint=6;b2Joint.e_inactiveLimit=0;b2Joint.e_atLowerLimit=1;b2Joint.e_atUpperLimit=2;b2Joint.e_equalLimits=3;﻿
var b2JointDef=Class.create();b2JointDef.prototype={initialize:function()
{this.type=b2Joint.e_unknownJoint;this.userData=null;this.body1=null;this.body2=null;this.collideConnected=false;},type:0,userData:null,body1:null,body2:null,collideConnected:null}
﻿
var b2DistanceJoint=Class.create();Object.extend(b2DistanceJoint.prototype,b2Joint.prototype);Object.extend(b2DistanceJoint.prototype,{initialize:function(def){this.m_node1=new b2JointNode();this.m_node2=new b2JointNode();this.m_type=def.type;this.m_prev=null;this.m_next=null;this.m_body1=def.body1;this.m_body2=def.body2;this.m_collideConnected=def.collideConnected;this.m_islandFlag=false;this.m_userData=def.userData;this.m_localAnchor1=new b2Vec2();this.m_localAnchor2=new b2Vec2();this.m_u=new b2Vec2();var tMat;var tX;var tY;tMat=this.m_body1.m_R;tX=def.anchorPoint1.x-this.m_body1.m_position.x;tY=def.anchorPoint1.y-this.m_body1.m_position.y;this.m_localAnchor1.x=tX*tMat.col1.x+tY*tMat.col1.y;this.m_localAnchor1.y=tX*tMat.col2.x+tY*tMat.col2.y;tMat=this.m_body2.m_R;tX=def.anchorPoint2.x-this.m_body2.m_position.x;tY=def.anchorPoint2.y-this.m_body2.m_position.y;this.m_localAnchor2.x=tX*tMat.col1.x+tY*tMat.col1.y;this.m_localAnchor2.y=tX*tMat.col2.x+tY*tMat.col2.y;tX=def.anchorPoint2.x-def.anchorPoint1.x;tY=def.anchorPoint2.y-def.anchorPoint1.y;this.m_length=Math.sqrt(tX*tX+tY*tY);this.m_impulse=0.0;},PrepareVelocitySolver:function(){var tMat;tMat=this.m_body1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=this.m_body2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;this.m_u.x=this.m_body2.m_position.x+r2X-this.m_body1.m_position.x-r1X;this.m_u.y=this.m_body2.m_position.y+r2Y-this.m_body1.m_position.y-r1Y;var length=Math.sqrt(this.m_u.x*this.m_u.x+this.m_u.y*this.m_u.y);if(length>b2Settings.b2_linearSlop)
{this.m_u.Multiply(1.0/length);}
else
{this.m_u.SetZero();}
var cr1u=(r1X*this.m_u.y-r1Y*this.m_u.x);var cr2u=(r2X*this.m_u.y-r2Y*this.m_u.x);this.m_mass=this.m_body1.m_invMass+this.m_body1.m_invI*cr1u*cr1u+this.m_body2.m_invMass+this.m_body2.m_invI*cr2u*cr2u;this.m_mass=1.0/this.m_mass;if(b2World.s_enableWarmStarting)
{var PX=this.m_impulse*this.m_u.x;var PY=this.m_impulse*this.m_u.y;this.m_body1.m_linearVelocity.x-=this.m_body1.m_invMass*PX;this.m_body1.m_linearVelocity.y-=this.m_body1.m_invMass*PY;this.m_body1.m_angularVelocity-=this.m_body1.m_invI*(r1X*PY-r1Y*PX);this.m_body2.m_linearVelocity.x+=this.m_body2.m_invMass*PX;this.m_body2.m_linearVelocity.y+=this.m_body2.m_invMass*PY;this.m_body2.m_angularVelocity+=this.m_body2.m_invI*(r2X*PY-r2Y*PX);}
else
{this.m_impulse=0.0;}},SolveVelocityConstraints:function(step){var tMat;tMat=this.m_body1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=this.m_body2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var v1X=this.m_body1.m_linearVelocity.x+(-this.m_body1.m_angularVelocity*r1Y);var v1Y=this.m_body1.m_linearVelocity.y+(this.m_body1.m_angularVelocity*r1X);var v2X=this.m_body2.m_linearVelocity.x+(-this.m_body2.m_angularVelocity*r2Y);var v2Y=this.m_body2.m_linearVelocity.y+(this.m_body2.m_angularVelocity*r2X);var Cdot=(this.m_u.x*(v2X-v1X)+this.m_u.y*(v2Y-v1Y));var impulse=-this.m_mass*Cdot;this.m_impulse+=impulse;var PX=impulse*this.m_u.x;var PY=impulse*this.m_u.y;this.m_body1.m_linearVelocity.x-=this.m_body1.m_invMass*PX;this.m_body1.m_linearVelocity.y-=this.m_body1.m_invMass*PY;this.m_body1.m_angularVelocity-=this.m_body1.m_invI*(r1X*PY-r1Y*PX);this.m_body2.m_linearVelocity.x+=this.m_body2.m_invMass*PX;this.m_body2.m_linearVelocity.y+=this.m_body2.m_invMass*PY;this.m_body2.m_angularVelocity+=this.m_body2.m_invI*(r2X*PY-r2Y*PX);},SolvePositionConstraints:function(){var tMat;tMat=this.m_body1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=this.m_body2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var dX=this.m_body2.m_position.x+r2X-this.m_body1.m_position.x-r1X;var dY=this.m_body2.m_position.y+r2Y-this.m_body1.m_position.y-r1Y;var length=Math.sqrt(dX*dX+dY*dY);dX/=length;dY/=length;var C=length-this.m_length;C=b2Math.b2Clamp(C,-b2Settings.b2_maxLinearCorrection,b2Settings.b2_maxLinearCorrection);var impulse=-this.m_mass*C;this.m_u.Set(dX,dY);var PX=impulse*this.m_u.x;var PY=impulse*this.m_u.y;this.m_body1.m_position.x-=this.m_body1.m_invMass*PX;this.m_body1.m_position.y-=this.m_body1.m_invMass*PY;this.m_body1.m_rotation-=this.m_body1.m_invI*(r1X*PY-r1Y*PX);this.m_body2.m_position.x+=this.m_body2.m_invMass*PX;this.m_body2.m_position.y+=this.m_body2.m_invMass*PY;this.m_body2.m_rotation+=this.m_body2.m_invI*(r2X*PY-r2Y*PX);this.m_body1.m_R.Set(this.m_body1.m_rotation);this.m_body2.m_R.Set(this.m_body2.m_rotation);return b2Math.b2Abs(C)<b2Settings.b2_linearSlop;},GetAnchor1:function(){return b2Math.AddVV(this.m_body1.m_position,b2Math.b2MulMV(this.m_body1.m_R,this.m_localAnchor1));},GetAnchor2:function(){return b2Math.AddVV(this.m_body2.m_position,b2Math.b2MulMV(this.m_body2.m_R,this.m_localAnchor2));},GetReactionForce:function(invTimeStep)
{var F=new b2Vec2();F.SetV(this.m_u);F.Multiply(this.m_impulse*invTimeStep);return F;},GetReactionTorque:function(invTimeStep)
{return 0.0;},m_localAnchor1:new b2Vec2(),m_localAnchor2:new b2Vec2(),m_u:new b2Vec2(),m_impulse:null,m_mass:null,m_length:null});﻿
var b2DistanceJointDef=Class.create();Object.extend(b2DistanceJointDef.prototype,b2JointDef.prototype);Object.extend(b2DistanceJointDef.prototype,{initialize:function()
{this.type=b2Joint.e_unknownJoint;this.userData=null;this.body1=null;this.body2=null;this.collideConnected=false;this.anchorPoint1=new b2Vec2();this.anchorPoint2=new b2Vec2();this.type=b2Joint.e_distanceJoint;},anchorPoint1:new b2Vec2(),anchorPoint2:new b2Vec2()});﻿
var b2Jacobian=Class.create();b2Jacobian.prototype={linear1:new b2Vec2(),angular1:null,linear2:new b2Vec2(),angular2:null,SetZero:function(){this.linear1.SetZero();this.angular1=0.0;this.linear2.SetZero();this.angular2=0.0;},Set:function(x1,a1,x2,a2){this.linear1.SetV(x1);this.angular1=a1;this.linear2.SetV(x2);this.angular2=a2;},Compute:function(x1,a1,x2,a2){return(this.linear1.x*x1.x+this.linear1.y*x1.y)+this.angular1*a1+(this.linear2.x*x2.x+this.linear2.y*x2.y)+this.angular2*a2;},initialize:function(){this.linear1=new b2Vec2();this.linear2=new b2Vec2();}};﻿
var b2GearJoint=Class.create();Object.extend(b2GearJoint.prototype,b2Joint.prototype);Object.extend(b2GearJoint.prototype,{GetAnchor1:function(){var tMat=this.m_body1.m_R;return new b2Vec2(this.m_body1.m_position.x+(tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y),this.m_body1.m_position.y+(tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y));},GetAnchor2:function(){var tMat=this.m_body2.m_R;return new b2Vec2(this.m_body2.m_position.x+(tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y),this.m_body2.m_position.y+(tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y));},GetReactionForce:function(invTimeStep){return new b2Vec2();},GetReactionTorque:function(invTimeStep){return 0.0;},GetRatio:function(){return this.m_ratio;},initialize:function(def){this.m_node1=new b2JointNode();this.m_node2=new b2JointNode();this.m_type=def.type;this.m_prev=null;this.m_next=null;this.m_body1=def.body1;this.m_body2=def.body2;this.m_collideConnected=def.collideConnected;this.m_islandFlag=false;this.m_userData=def.userData;this.m_groundAnchor1=new b2Vec2();this.m_groundAnchor2=new b2Vec2();this.m_localAnchor1=new b2Vec2();this.m_localAnchor2=new b2Vec2();this.m_J=new b2Jacobian();this.m_revolute1=null;this.m_prismatic1=null;this.m_revolute2=null;this.m_prismatic2=null;var coordinate1;var coordinate2;this.m_ground1=def.joint1.m_body1;this.m_body1=def.joint1.m_body2;if(def.joint1.m_type==b2Joint.e_revoluteJoint)
{this.m_revolute1=def.joint1;this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);coordinate1=this.m_revolute1.GetJointAngle();}
else
{this.m_prismatic1=def.joint1;this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);coordinate1=this.m_prismatic1.GetJointTranslation();}
this.m_ground2=def.joint2.m_body1;this.m_body2=def.joint2.m_body2;if(def.joint2.m_type==b2Joint.e_revoluteJoint)
{this.m_revolute2=def.joint2;this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);coordinate2=this.m_revolute2.GetJointAngle();}
else
{this.m_prismatic2=def.joint2;this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);coordinate2=this.m_prismatic2.GetJointTranslation();}
this.m_ratio=def.ratio;this.m_constant=coordinate1+this.m_ratio*coordinate2;this.m_impulse=0.0;},PrepareVelocitySolver:function(){var g1=this.m_ground1;var g2=this.m_ground2;var b1=this.m_body1;var b2=this.m_body2;var ugX;var ugY;var rX;var rY;var tMat;var tVec;var crug;var K=0.0;this.m_J.SetZero();if(this.m_revolute1)
{this.m_J.angular1=-1.0;K+=b1.m_invI;}
else
{tMat=g1.m_R;tVec=this.m_prismatic1.m_localXAxis1;ugX=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y;ugY=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y;tMat=b1.m_R;rX=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;rY=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;crug=rX*ugY-rY*ugX;this.m_J.linear1.Set(-ugX,-ugY);this.m_J.angular1=-crug;K+=b1.m_invMass+b1.m_invI*crug*crug;}
if(this.m_revolute2)
{this.m_J.angular2=-this.m_ratio;K+=this.m_ratio*this.m_ratio*b2.m_invI;}
else
{tMat=g2.m_R;tVec=this.m_prismatic2.m_localXAxis1;ugX=tMat.col1.x*tVec.x+tMat.col2.x*tVec.y;ugY=tMat.col1.y*tVec.x+tMat.col2.y*tVec.y;tMat=b2.m_R;rX=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;rY=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;crug=rX*ugY-rY*ugX;this.m_J.linear2.Set(-this.m_ratio*ugX,-this.m_ratio*ugY);this.m_J.angular2=-this.m_ratio*crug;K+=this.m_ratio*this.m_ratio*(b2.m_invMass+b2.m_invI*crug*crug);}
this.m_mass=1.0/K;b1.m_linearVelocity.x+=b1.m_invMass*this.m_impulse*this.m_J.linear1.x;b1.m_linearVelocity.y+=b1.m_invMass*this.m_impulse*this.m_J.linear1.y;b1.m_angularVelocity+=b1.m_invI*this.m_impulse*this.m_J.angular1;b2.m_linearVelocity.x+=b2.m_invMass*this.m_impulse*this.m_J.linear2.x;b2.m_linearVelocity.y+=b2.m_invMass*this.m_impulse*this.m_J.linear2.y;b2.m_angularVelocity+=b2.m_invI*this.m_impulse*this.m_J.angular2;},SolveVelocityConstraints:function(step){var b1=this.m_body1;var b2=this.m_body2;var Cdot=this.m_J.Compute(b1.m_linearVelocity,b1.m_angularVelocity,b2.m_linearVelocity,b2.m_angularVelocity);var impulse=-this.m_mass*Cdot;this.m_impulse+=impulse;b1.m_linearVelocity.x+=b1.m_invMass*impulse*this.m_J.linear1.x;b1.m_linearVelocity.y+=b1.m_invMass*impulse*this.m_J.linear1.y;b1.m_angularVelocity+=b1.m_invI*impulse*this.m_J.angular1;b2.m_linearVelocity.x+=b2.m_invMass*impulse*this.m_J.linear2.x;b2.m_linearVelocity.y+=b2.m_invMass*impulse*this.m_J.linear2.y;b2.m_angularVelocity+=b2.m_invI*impulse*this.m_J.angular2;},SolvePositionConstraints:function(){var linearError=0.0;var b1=this.m_body1;var b2=this.m_body2;var coordinate1;var coordinate2;if(this.m_revolute1)
{coordinate1=this.m_revolute1.GetJointAngle();}
else
{coordinate1=this.m_prismatic1.GetJointTranslation();}
if(this.m_revolute2)
{coordinate2=this.m_revolute2.GetJointAngle();}
else
{coordinate2=this.m_prismatic2.GetJointTranslation();}
var C=this.m_constant-(coordinate1+this.m_ratio*coordinate2);var impulse=-this.m_mass*C;b1.m_position.x+=b1.m_invMass*impulse*this.m_J.linear1.x;b1.m_position.y+=b1.m_invMass*impulse*this.m_J.linear1.y;b1.m_rotation+=b1.m_invI*impulse*this.m_J.angular1;b2.m_position.x+=b2.m_invMass*impulse*this.m_J.linear2.x;b2.m_position.y+=b2.m_invMass*impulse*this.m_J.linear2.y;b2.m_rotation+=b2.m_invI*impulse*this.m_J.angular2;b1.m_R.Set(b1.m_rotation);b2.m_R.Set(b2.m_rotation);return linearError<b2Settings.b2_linearSlop;},m_ground1:null,m_ground2:null,m_revolute1:null,m_prismatic1:null,m_revolute2:null,m_prismatic2:null,m_groundAnchor1:new b2Vec2(),m_groundAnchor2:new b2Vec2(),m_localAnchor1:new b2Vec2(),m_localAnchor2:new b2Vec2(),m_J:new b2Jacobian(),m_constant:null,m_ratio:null,m_mass:null,m_impulse:null});﻿
var b2GearJointDef=Class.create();Object.extend(b2GearJointDef.prototype,b2JointDef.prototype);Object.extend(b2GearJointDef.prototype,{initialize:function()
{this.type=b2Joint.e_gearJoint;this.joint1=null;this.joint2=null;this.ratio=1.0;},joint1:null,joint2:null,ratio:null});﻿
var b2MouseJoint=Class.create();Object.extend(b2MouseJoint.prototype,b2Joint.prototype);Object.extend(b2MouseJoint.prototype,{GetAnchor1:function(){return this.m_target;},GetAnchor2:function(){var tVec=b2Math.b2MulMV(this.m_body2.m_R,this.m_localAnchor);tVec.Add(this.m_body2.m_position);return tVec;},GetReactionForce:function(invTimeStep)
{var F=new b2Vec2();F.SetV(this.m_impulse);F.Multiply(invTimeStep);return F;},GetReactionTorque:function(invTimeStep)
{return 0.0;},SetTarget:function(target){this.m_body2.WakeUp();this.m_target=target;},initialize:function(def){this.m_node1=new b2JointNode();this.m_node2=new b2JointNode();this.m_type=def.type;this.m_prev=null;this.m_next=null;this.m_body1=def.body1;this.m_body2=def.body2;this.m_collideConnected=def.collideConnected;this.m_islandFlag=false;this.m_userData=def.userData;this.K=new b2Mat22();this.K1=new b2Mat22();this.K2=new b2Mat22();this.m_localAnchor=new b2Vec2();this.m_target=new b2Vec2();this.m_impulse=new b2Vec2();this.m_ptpMass=new b2Mat22();this.m_C=new b2Vec2();this.m_target.SetV(def.target);var tX=this.m_target.x-this.m_body2.m_position.x;var tY=this.m_target.y-this.m_body2.m_position.y;this.m_localAnchor.x=(tX*this.m_body2.m_R.col1.x+tY*this.m_body2.m_R.col1.y);this.m_localAnchor.y=(tX*this.m_body2.m_R.col2.x+tY*this.m_body2.m_R.col2.y);this.m_maxForce=def.maxForce;this.m_impulse.SetZero();var mass=this.m_body2.m_mass;var omega=2.0*b2Settings.b2_pi*def.frequencyHz;var d=2.0*mass*def.dampingRatio*omega;var k=mass*omega*omega;this.m_gamma=1.0/(d+def.timeStep*k);this.m_beta=def.timeStep*k/(d+def.timeStep*k);},K:new b2Mat22(),K1:new b2Mat22(),K2:new b2Mat22(),PrepareVelocitySolver:function(){var b=this.m_body2;var tMat;tMat=b.m_R;var rX=tMat.col1.x*this.m_localAnchor.x+tMat.col2.x*this.m_localAnchor.y;var rY=tMat.col1.y*this.m_localAnchor.x+tMat.col2.y*this.m_localAnchor.y;var invMass=b.m_invMass;var invI=b.m_invI;this.K1.col1.x=invMass;this.K1.col2.x=0.0;this.K1.col1.y=0.0;this.K1.col2.y=invMass;this.K2.col1.x=invI*rY*rY;this.K2.col2.x=-invI*rX*rY;this.K2.col1.y=-invI*rX*rY;this.K2.col2.y=invI*rX*rX;this.K.SetM(this.K1);this.K.AddM(this.K2);this.K.col1.x+=this.m_gamma;this.K.col2.y+=this.m_gamma;this.K.Invert(this.m_ptpMass);this.m_C.x=b.m_position.x+rX-this.m_target.x;this.m_C.y=b.m_position.y+rY-this.m_target.y;b.m_angularVelocity*=0.98;var PX=this.m_impulse.x;var PY=this.m_impulse.y;b.m_linearVelocity.x+=invMass*PX;b.m_linearVelocity.y+=invMass*PY;b.m_angularVelocity+=invI*(rX*PY-rY*PX);},SolveVelocityConstraints:function(step){var body=this.m_body2;var tMat;tMat=body.m_R;var rX=tMat.col1.x*this.m_localAnchor.x+tMat.col2.x*this.m_localAnchor.y;var rY=tMat.col1.y*this.m_localAnchor.x+tMat.col2.y*this.m_localAnchor.y;var CdotX=body.m_linearVelocity.x+(-body.m_angularVelocity*rY);var CdotY=body.m_linearVelocity.y+(body.m_angularVelocity*rX);tMat=this.m_ptpMass;var tX=CdotX+(this.m_beta*step.inv_dt)*this.m_C.x+this.m_gamma*this.m_impulse.x;var tY=CdotY+(this.m_beta*step.inv_dt)*this.m_C.y+this.m_gamma*this.m_impulse.y;var impulseX=-(tMat.col1.x*tX+tMat.col2.x*tY);var impulseY=-(tMat.col1.y*tX+tMat.col2.y*tY);var oldImpulseX=this.m_impulse.x;var oldImpulseY=this.m_impulse.y;this.m_impulse.x+=impulseX;this.m_impulse.y+=impulseY;var length=this.m_impulse.Length();if(length>step.dt*this.m_maxForce)
{this.m_impulse.Multiply(step.dt*this.m_maxForce/length);}
impulseX=this.m_impulse.x-oldImpulseX;impulseY=this.m_impulse.y-oldImpulseY;body.m_linearVelocity.x+=body.m_invMass*impulseX;body.m_linearVelocity.y+=body.m_invMass*impulseY;body.m_angularVelocity+=body.m_invI*(rX*impulseY-rY*impulseX);},SolvePositionConstraints:function(){return true;},m_localAnchor:new b2Vec2(),m_target:new b2Vec2(),m_impulse:new b2Vec2(),m_ptpMass:new b2Mat22(),m_C:new b2Vec2(),m_maxForce:null,m_beta:null,m_gamma:null});﻿
var b2MouseJointDef=Class.create();Object.extend(b2MouseJointDef.prototype,b2JointDef.prototype);Object.extend(b2MouseJointDef.prototype,{initialize:function()
{this.type=b2Joint.e_unknownJoint;this.userData=null;this.body1=null;this.body2=null;this.collideConnected=false;this.target=new b2Vec2();this.type=b2Joint.e_mouseJoint;this.maxForce=0.0;this.frequencyHz=5.0;this.dampingRatio=0.7;this.timeStep=1.0/60.0;},target:new b2Vec2(),maxForce:null,frequencyHz:null,dampingRatio:null,timeStep:null});﻿
var b2PrismaticJoint=Class.create();Object.extend(b2PrismaticJoint.prototype,b2Joint.prototype);Object.extend(b2PrismaticJoint.prototype,{GetAnchor1:function(){var b1=this.m_body1;var tVec=new b2Vec2();tVec.SetV(this.m_localAnchor1);tVec.MulM(b1.m_R);tVec.Add(b1.m_position);return tVec;},GetAnchor2:function(){var b2=this.m_body2;var tVec=new b2Vec2();tVec.SetV(this.m_localAnchor2);tVec.MulM(b2.m_R);tVec.Add(b2.m_position);return tVec;},GetJointTranslation:function(){var b1=this.m_body1;var b2=this.m_body2;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var p1X=b1.m_position.x+r1X;var p1Y=b1.m_position.y+r1Y;var p2X=b2.m_position.x+r2X;var p2Y=b2.m_position.y+r2Y;var dX=p2X-p1X;var dY=p2Y-p1Y;tMat=b1.m_R;var ax1X=tMat.col1.x*this.m_localXAxis1.x+tMat.col2.x*this.m_localXAxis1.y;var ax1Y=tMat.col1.y*this.m_localXAxis1.x+tMat.col2.y*this.m_localXAxis1.y;var translation=ax1X*dX+ax1Y*dY;return translation;},GetJointSpeed:function(){var b1=this.m_body1;var b2=this.m_body2;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var p1X=b1.m_position.x+r1X;var p1Y=b1.m_position.y+r1Y;var p2X=b2.m_position.x+r2X;var p2Y=b2.m_position.y+r2Y;var dX=p2X-p1X;var dY=p2Y-p1Y;tMat=b1.m_R;var ax1X=tMat.col1.x*this.m_localXAxis1.x+tMat.col2.x*this.m_localXAxis1.y;var ax1Y=tMat.col1.y*this.m_localXAxis1.x+tMat.col2.y*this.m_localXAxis1.y;var v1=b1.m_linearVelocity;var v2=b2.m_linearVelocity;var w1=b1.m_angularVelocity;var w2=b2.m_angularVelocity;var speed=(dX*(-w1*ax1Y)+dY*(w1*ax1X))+(ax1X*(((v2.x+(-w2*r2Y))-v1.x)-(-w1*r1Y))+ax1Y*(((v2.y+(w2*r2X))-v1.y)-(w1*r1X)));return speed;},GetMotorForce:function(invTimeStep){return invTimeStep*this.m_motorImpulse;},SetMotorSpeed:function(speed)
{this.m_motorSpeed=speed;},SetMotorForce:function(force)
{this.m_maxMotorForce=force;},GetReactionForce:function(invTimeStep)
{var tImp=invTimeStep*this.m_limitImpulse;var tMat;tMat=this.m_body1.m_R;var ax1X=tImp*(tMat.col1.x*this.m_localXAxis1.x+tMat.col2.x*this.m_localXAxis1.y);var ax1Y=tImp*(tMat.col1.y*this.m_localXAxis1.x+tMat.col2.y*this.m_localXAxis1.y);var ay1X=tImp*(tMat.col1.x*this.m_localYAxis1.x+tMat.col2.x*this.m_localYAxis1.y);var ay1Y=tImp*(tMat.col1.y*this.m_localYAxis1.x+tMat.col2.y*this.m_localYAxis1.y);return new b2Vec2(ax1X+ay1X,ax1Y+ay1Y);},GetReactionTorque:function(invTimeStep)
{return invTimeStep*this.m_angularImpulse;},initialize:function(def){this.m_node1=new b2JointNode();this.m_node2=new b2JointNode();this.m_type=def.type;this.m_prev=null;this.m_next=null;this.m_body1=def.body1;this.m_body2=def.body2;this.m_collideConnected=def.collideConnected;this.m_islandFlag=false;this.m_userData=def.userData;this.m_localAnchor1=new b2Vec2();this.m_localAnchor2=new b2Vec2();this.m_localXAxis1=new b2Vec2();this.m_localYAxis1=new b2Vec2();this.m_linearJacobian=new b2Jacobian();this.m_motorJacobian=new b2Jacobian();var tMat;var tX;var tY;tMat=this.m_body1.m_R;tX=(def.anchorPoint.x-this.m_body1.m_position.x);tY=(def.anchorPoint.y-this.m_body1.m_position.y);this.m_localAnchor1.Set((tX*tMat.col1.x+tY*tMat.col1.y),(tX*tMat.col2.x+tY*tMat.col2.y));tMat=this.m_body2.m_R;tX=(def.anchorPoint.x-this.m_body2.m_position.x);tY=(def.anchorPoint.y-this.m_body2.m_position.y);this.m_localAnchor2.Set((tX*tMat.col1.x+tY*tMat.col1.y),(tX*tMat.col2.x+tY*tMat.col2.y));tMat=this.m_body1.m_R;tX=def.axis.x;tY=def.axis.y;this.m_localXAxis1.Set((tX*tMat.col1.x+tY*tMat.col1.y),(tX*tMat.col2.x+tY*tMat.col2.y));this.m_localYAxis1.x=-this.m_localXAxis1.y;this.m_localYAxis1.y=this.m_localXAxis1.x;this.m_initialAngle=this.m_body2.m_rotation-this.m_body1.m_rotation;this.m_linearJacobian.SetZero();this.m_linearMass=0.0;this.m_linearImpulse=0.0;this.m_angularMass=0.0;this.m_angularImpulse=0.0;this.m_motorJacobian.SetZero();this.m_motorMass=0.0;this.m_motorImpulse=0.0;this.m_limitImpulse=0.0;this.m_limitPositionImpulse=0.0;this.m_lowerTranslation=def.lowerTranslation;this.m_upperTranslation=def.upperTranslation;this.m_maxMotorForce=def.motorForce;this.m_motorSpeed=def.motorSpeed;this.m_enableLimit=def.enableLimit;this.m_enableMotor=def.enableMotor;},PrepareVelocitySolver:function(){var b1=this.m_body1;var b2=this.m_body2;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var invMass1=b1.m_invMass;var invMass2=b2.m_invMass;var invI1=b1.m_invI;var invI2=b2.m_invI;tMat=b1.m_R;var ay1X=tMat.col1.x*this.m_localYAxis1.x+tMat.col2.x*this.m_localYAxis1.y;var ay1Y=tMat.col1.y*this.m_localYAxis1.x+tMat.col2.y*this.m_localYAxis1.y;var eX=b2.m_position.x+r2X-b1.m_position.x;var eY=b2.m_position.y+r2Y-b1.m_position.y;this.m_linearJacobian.linear1.x=-ay1X;this.m_linearJacobian.linear1.y=-ay1Y;this.m_linearJacobian.linear2.x=ay1X;this.m_linearJacobian.linear2.y=ay1Y;this.m_linearJacobian.angular1=-(eX*ay1Y-eY*ay1X);this.m_linearJacobian.angular2=r2X*ay1Y-r2Y*ay1X;this.m_linearMass=invMass1+invI1*this.m_linearJacobian.angular1*this.m_linearJacobian.angular1+
invMass2+invI2*this.m_linearJacobian.angular2*this.m_linearJacobian.angular2;this.m_linearMass=1.0/this.m_linearMass;this.m_angularMass=1.0/(invI1+invI2);if(this.m_enableLimit||this.m_enableMotor)
{tMat=b1.m_R;var ax1X=tMat.col1.x*this.m_localXAxis1.x+tMat.col2.x*this.m_localXAxis1.y;var ax1Y=tMat.col1.y*this.m_localXAxis1.x+tMat.col2.y*this.m_localXAxis1.y;this.m_motorJacobian.linear1.x=-ax1X;this.m_motorJacobian.linear1.y=-ax1Y;this.m_motorJacobian.linear2.x=ax1X;this.m_motorJacobian.linear2.y=ax1Y;this.m_motorJacobian.angular1=-(eX*ax1Y-eY*ax1X);this.m_motorJacobian.angular2=r2X*ax1Y-r2Y*ax1X;this.m_motorMass=invMass1+invI1*this.m_motorJacobian.angular1*this.m_motorJacobian.angular1+
invMass2+invI2*this.m_motorJacobian.angular2*this.m_motorJacobian.angular2;this.m_motorMass=1.0/this.m_motorMass;if(this.m_enableLimit)
{var dX=eX-r1X;var dY=eY-r1Y;var jointTranslation=ax1X*dX+ax1Y*dY;if(b2Math.b2Abs(this.m_upperTranslation-this.m_lowerTranslation)<2.0*b2Settings.b2_linearSlop)
{this.m_limitState=b2Joint.e_equalLimits;}
else if(jointTranslation<=this.m_lowerTranslation)
{if(this.m_limitState!=b2Joint.e_atLowerLimit)
{this.m_limitImpulse=0.0;}
this.m_limitState=b2Joint.e_atLowerLimit;}
else if(jointTranslation>=this.m_upperTranslation)
{if(this.m_limitState!=b2Joint.e_atUpperLimit)
{this.m_limitImpulse=0.0;}
this.m_limitState=b2Joint.e_atUpperLimit;}
else
{this.m_limitState=b2Joint.e_inactiveLimit;this.m_limitImpulse=0.0;}}}
if(this.m_enableMotor==false)
{this.m_motorImpulse=0.0;}
if(this.m_enableLimit==false)
{this.m_limitImpulse=0.0;}
if(b2World.s_enableWarmStarting)
{var P1X=this.m_linearImpulse*this.m_linearJacobian.linear1.x+(this.m_motorImpulse+this.m_limitImpulse)*this.m_motorJacobian.linear1.x;var P1Y=this.m_linearImpulse*this.m_linearJacobian.linear1.y+(this.m_motorImpulse+this.m_limitImpulse)*this.m_motorJacobian.linear1.y;var P2X=this.m_linearImpulse*this.m_linearJacobian.linear2.x+(this.m_motorImpulse+this.m_limitImpulse)*this.m_motorJacobian.linear2.x;var P2Y=this.m_linearImpulse*this.m_linearJacobian.linear2.y+(this.m_motorImpulse+this.m_limitImpulse)*this.m_motorJacobian.linear2.y;var L1=this.m_linearImpulse*this.m_linearJacobian.angular1-this.m_angularImpulse+(this.m_motorImpulse+this.m_limitImpulse)*this.m_motorJacobian.angular1;var L2=this.m_linearImpulse*this.m_linearJacobian.angular2+this.m_angularImpulse+(this.m_motorImpulse+this.m_limitImpulse)*this.m_motorJacobian.angular2;b1.m_linearVelocity.x+=invMass1*P1X;b1.m_linearVelocity.y+=invMass1*P1Y;b1.m_angularVelocity+=invI1*L1;b2.m_linearVelocity.x+=invMass2*P2X;b2.m_linearVelocity.y+=invMass2*P2Y;b2.m_angularVelocity+=invI2*L2;}
else
{this.m_linearImpulse=0.0;this.m_angularImpulse=0.0;this.m_limitImpulse=0.0;this.m_motorImpulse=0.0;}
this.m_limitPositionImpulse=0.0;},SolveVelocityConstraints:function(step){var b1=this.m_body1;var b2=this.m_body2;var invMass1=b1.m_invMass;var invMass2=b2.m_invMass;var invI1=b1.m_invI;var invI2=b2.m_invI;var oldLimitImpulse;var linearCdot=this.m_linearJacobian.Compute(b1.m_linearVelocity,b1.m_angularVelocity,b2.m_linearVelocity,b2.m_angularVelocity);var linearImpulse=-this.m_linearMass*linearCdot;this.m_linearImpulse+=linearImpulse;b1.m_linearVelocity.x+=(invMass1*linearImpulse)*this.m_linearJacobian.linear1.x;b1.m_linearVelocity.y+=(invMass1*linearImpulse)*this.m_linearJacobian.linear1.y;b1.m_angularVelocity+=invI1*linearImpulse*this.m_linearJacobian.angular1;b2.m_linearVelocity.x+=(invMass2*linearImpulse)*this.m_linearJacobian.linear2.x;b2.m_linearVelocity.y+=(invMass2*linearImpulse)*this.m_linearJacobian.linear2.y;b2.m_angularVelocity+=invI2*linearImpulse*this.m_linearJacobian.angular2;var angularCdot=b2.m_angularVelocity-b1.m_angularVelocity;var angularImpulse=-this.m_angularMass*angularCdot;this.m_angularImpulse+=angularImpulse;b1.m_angularVelocity-=invI1*angularImpulse;b2.m_angularVelocity+=invI2*angularImpulse;if(this.m_enableMotor&&this.m_limitState!=b2Joint.e_equalLimits)
{var motorCdot=this.m_motorJacobian.Compute(b1.m_linearVelocity,b1.m_angularVelocity,b2.m_linearVelocity,b2.m_angularVelocity)-this.m_motorSpeed;var motorImpulse=-this.m_motorMass*motorCdot;var oldMotorImpulse=this.m_motorImpulse;this.m_motorImpulse=b2Math.b2Clamp(this.m_motorImpulse+motorImpulse,-step.dt*this.m_maxMotorForce,step.dt*this.m_maxMotorForce);motorImpulse=this.m_motorImpulse-oldMotorImpulse;b1.m_linearVelocity.x+=(invMass1*motorImpulse)*this.m_motorJacobian.linear1.x;b1.m_linearVelocity.y+=(invMass1*motorImpulse)*this.m_motorJacobian.linear1.y;b1.m_angularVelocity+=invI1*motorImpulse*this.m_motorJacobian.angular1;b2.m_linearVelocity.x+=(invMass2*motorImpulse)*this.m_motorJacobian.linear2.x;b2.m_linearVelocity.y+=(invMass2*motorImpulse)*this.m_motorJacobian.linear2.y;b2.m_angularVelocity+=invI2*motorImpulse*this.m_motorJacobian.angular2;}
if(this.m_enableLimit&&this.m_limitState!=b2Joint.e_inactiveLimit)
{var limitCdot=this.m_motorJacobian.Compute(b1.m_linearVelocity,b1.m_angularVelocity,b2.m_linearVelocity,b2.m_angularVelocity);var limitImpulse=-this.m_motorMass*limitCdot;if(this.m_limitState==b2Joint.e_equalLimits)
{this.m_limitImpulse+=limitImpulse;}
else if(this.m_limitState==b2Joint.e_atLowerLimit)
{oldLimitImpulse=this.m_limitImpulse;this.m_limitImpulse=b2Math.b2Max(this.m_limitImpulse+limitImpulse,0.0);limitImpulse=this.m_limitImpulse-oldLimitImpulse;}
else if(this.m_limitState==b2Joint.e_atUpperLimit)
{oldLimitImpulse=this.m_limitImpulse;this.m_limitImpulse=b2Math.b2Min(this.m_limitImpulse+limitImpulse,0.0);limitImpulse=this.m_limitImpulse-oldLimitImpulse;}
b1.m_linearVelocity.x+=(invMass1*limitImpulse)*this.m_motorJacobian.linear1.x;b1.m_linearVelocity.y+=(invMass1*limitImpulse)*this.m_motorJacobian.linear1.y;b1.m_angularVelocity+=invI1*limitImpulse*this.m_motorJacobian.angular1;b2.m_linearVelocity.x+=(invMass2*limitImpulse)*this.m_motorJacobian.linear2.x;b2.m_linearVelocity.y+=(invMass2*limitImpulse)*this.m_motorJacobian.linear2.y;b2.m_angularVelocity+=invI2*limitImpulse*this.m_motorJacobian.angular2;}},SolvePositionConstraints:function(){var limitC;var oldLimitImpulse;var b1=this.m_body1;var b2=this.m_body2;var invMass1=b1.m_invMass;var invMass2=b2.m_invMass;var invI1=b1.m_invI;var invI2=b2.m_invI;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var p1X=b1.m_position.x+r1X;var p1Y=b1.m_position.y+r1Y;var p2X=b2.m_position.x+r2X;var p2Y=b2.m_position.y+r2Y;var dX=p2X-p1X;var dY=p2Y-p1Y;tMat=b1.m_R;var ay1X=tMat.col1.x*this.m_localYAxis1.x+tMat.col2.x*this.m_localYAxis1.y;var ay1Y=tMat.col1.y*this.m_localYAxis1.x+tMat.col2.y*this.m_localYAxis1.y;var linearC=ay1X*dX+ay1Y*dY;linearC=b2Math.b2Clamp(linearC,-b2Settings.b2_maxLinearCorrection,b2Settings.b2_maxLinearCorrection);var linearImpulse=-this.m_linearMass*linearC;b1.m_position.x+=(invMass1*linearImpulse)*this.m_linearJacobian.linear1.x;b1.m_position.y+=(invMass1*linearImpulse)*this.m_linearJacobian.linear1.y;b1.m_rotation+=invI1*linearImpulse*this.m_linearJacobian.angular1;b2.m_position.x+=(invMass2*linearImpulse)*this.m_linearJacobian.linear2.x;b2.m_position.y+=(invMass2*linearImpulse)*this.m_linearJacobian.linear2.y;b2.m_rotation+=invI2*linearImpulse*this.m_linearJacobian.angular2;var positionError=b2Math.b2Abs(linearC);var angularC=b2.m_rotation-b1.m_rotation-this.m_initialAngle;angularC=b2Math.b2Clamp(angularC,-b2Settings.b2_maxAngularCorrection,b2Settings.b2_maxAngularCorrection);var angularImpulse=-this.m_angularMass*angularC;b1.m_rotation-=b1.m_invI*angularImpulse;b1.m_R.Set(b1.m_rotation);b2.m_rotation+=b2.m_invI*angularImpulse;b2.m_R.Set(b2.m_rotation);var angularError=b2Math.b2Abs(angularC);if(this.m_enableLimit&&this.m_limitState!=b2Joint.e_inactiveLimit)
{tMat=b1.m_R;r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;p1X=b1.m_position.x+r1X;p1Y=b1.m_position.y+r1Y;p2X=b2.m_position.x+r2X;p2Y=b2.m_position.y+r2Y;dX=p2X-p1X;dY=p2Y-p1Y;tMat=b1.m_R;var ax1X=tMat.col1.x*this.m_localXAxis1.x+tMat.col2.x*this.m_localXAxis1.y;var ax1Y=tMat.col1.y*this.m_localXAxis1.x+tMat.col2.y*this.m_localXAxis1.y;var translation=(ax1X*dX+ax1Y*dY);var limitImpulse=0.0;if(this.m_limitState==b2Joint.e_equalLimits)
{limitC=b2Math.b2Clamp(translation,-b2Settings.b2_maxLinearCorrection,b2Settings.b2_maxLinearCorrection);limitImpulse=-this.m_motorMass*limitC;positionError=b2Math.b2Max(positionError,b2Math.b2Abs(angularC));}
else if(this.m_limitState==b2Joint.e_atLowerLimit)
{limitC=translation-this.m_lowerTranslation;positionError=b2Math.b2Max(positionError,-limitC);limitC=b2Math.b2Clamp(limitC+b2Settings.b2_linearSlop,-b2Settings.b2_maxLinearCorrection,0.0);limitImpulse=-this.m_motorMass*limitC;oldLimitImpulse=this.m_limitPositionImpulse;this.m_limitPositionImpulse=b2Math.b2Max(this.m_limitPositionImpulse+limitImpulse,0.0);limitImpulse=this.m_limitPositionImpulse-oldLimitImpulse;}
else if(this.m_limitState==b2Joint.e_atUpperLimit)
{limitC=translation-this.m_upperTranslation;positionError=b2Math.b2Max(positionError,limitC);limitC=b2Math.b2Clamp(limitC-b2Settings.b2_linearSlop,0.0,b2Settings.b2_maxLinearCorrection);limitImpulse=-this.m_motorMass*limitC;oldLimitImpulse=this.m_limitPositionImpulse;this.m_limitPositionImpulse=b2Math.b2Min(this.m_limitPositionImpulse+limitImpulse,0.0);limitImpulse=this.m_limitPositionImpulse-oldLimitImpulse;}
b1.m_position.x+=(invMass1*limitImpulse)*this.m_motorJacobian.linear1.x;b1.m_position.y+=(invMass1*limitImpulse)*this.m_motorJacobian.linear1.y;b1.m_rotation+=invI1*limitImpulse*this.m_motorJacobian.angular1;b1.m_R.Set(b1.m_rotation);b2.m_position.x+=(invMass2*limitImpulse)*this.m_motorJacobian.linear2.x;b2.m_position.y+=(invMass2*limitImpulse)*this.m_motorJacobian.linear2.y;b2.m_rotation+=invI2*limitImpulse*this.m_motorJacobian.angular2;b2.m_R.Set(b2.m_rotation);}
return positionError<=b2Settings.b2_linearSlop&&angularError<=b2Settings.b2_angularSlop;},m_localAnchor1:new b2Vec2(),m_localAnchor2:new b2Vec2(),m_localXAxis1:new b2Vec2(),m_localYAxis1:new b2Vec2(),m_initialAngle:null,m_linearJacobian:new b2Jacobian(),m_linearMass:null,m_linearImpulse:null,m_angularMass:null,m_angularImpulse:null,m_motorJacobian:new b2Jacobian(),m_motorMass:null,m_motorImpulse:null,m_limitImpulse:null,m_limitPositionImpulse:null,m_lowerTranslation:null,m_upperTranslation:null,m_maxMotorForce:null,m_motorSpeed:null,m_enableLimit:null,m_enableMotor:null,m_limitState:0});﻿
var b2PrismaticJointDef=Class.create();Object.extend(b2PrismaticJointDef.prototype,b2JointDef.prototype);Object.extend(b2PrismaticJointDef.prototype,{initialize:function()
{this.type=b2Joint.e_unknownJoint;this.userData=null;this.body1=null;this.body2=null;this.collideConnected=false;this.type=b2Joint.e_prismaticJoint;this.anchorPoint=new b2Vec2(0.0,0.0);this.axis=new b2Vec2(0.0,0.0);this.lowerTranslation=0.0;this.upperTranslation=0.0;this.motorForce=0.0;this.motorSpeed=0.0;this.enableLimit=false;this.enableMotor=false;},anchorPoint:null,axis:null,lowerTranslation:null,upperTranslation:null,motorForce:null,motorSpeed:null,enableLimit:null,enableMotor:null});﻿
var b2PulleyJoint=Class.create();Object.extend(b2PulleyJoint.prototype,b2Joint.prototype);Object.extend(b2PulleyJoint.prototype,{GetAnchor1:function(){var tMat=this.m_body1.m_R;return new b2Vec2(this.m_body1.m_position.x+(tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y),this.m_body1.m_position.y+(tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y));},GetAnchor2:function(){var tMat=this.m_body2.m_R;return new b2Vec2(this.m_body2.m_position.x+(tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y),this.m_body2.m_position.y+(tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y));},GetGroundPoint1:function(){return new b2Vec2(this.m_ground.m_position.x+this.m_groundAnchor1.x,this.m_ground.m_position.y+this.m_groundAnchor1.y);},GetGroundPoint2:function(){return new b2Vec2(this.m_ground.m_position.x+this.m_groundAnchor2.x,this.m_ground.m_position.y+this.m_groundAnchor2.y);},GetReactionForce:function(invTimeStep){return new b2Vec2();},GetReactionTorque:function(invTimeStep){return 0.0;},GetLength1:function(){var tMat;tMat=this.m_body1.m_R;var pX=this.m_body1.m_position.x+(tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y);var pY=this.m_body1.m_position.y+(tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y);var dX=pX-(this.m_ground.m_position.x+this.m_groundAnchor1.x);var dY=pY-(this.m_ground.m_position.y+this.m_groundAnchor1.y);return Math.sqrt(dX*dX+dY*dY);},GetLength2:function(){var tMat;tMat=this.m_body2.m_R;var pX=this.m_body2.m_position.x+(tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y);var pY=this.m_body2.m_position.y+(tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y);var dX=pX-(this.m_ground.m_position.x+this.m_groundAnchor2.x);var dY=pY-(this.m_ground.m_position.y+this.m_groundAnchor2.y);return Math.sqrt(dX*dX+dY*dY);},GetRatio:function(){return this.m_ratio;},initialize:function(def){this.m_node1=new b2JointNode();this.m_node2=new b2JointNode();this.m_type=def.type;this.m_prev=null;this.m_next=null;this.m_body1=def.body1;this.m_body2=def.body2;this.m_collideConnected=def.collideConnected;this.m_islandFlag=false;this.m_userData=def.userData;this.m_groundAnchor1=new b2Vec2();this.m_groundAnchor2=new b2Vec2();this.m_localAnchor1=new b2Vec2();this.m_localAnchor2=new b2Vec2();this.m_u1=new b2Vec2();this.m_u2=new b2Vec2();var tMat;var tX;var tY;this.m_ground=this.m_body1.m_world.m_groundBody;this.m_groundAnchor1.x=def.groundPoint1.x-this.m_ground.m_position.x;this.m_groundAnchor1.y=def.groundPoint1.y-this.m_ground.m_position.y;this.m_groundAnchor2.x=def.groundPoint2.x-this.m_ground.m_position.x;this.m_groundAnchor2.y=def.groundPoint2.y-this.m_ground.m_position.y;tMat=this.m_body1.m_R;tX=def.anchorPoint1.x-this.m_body1.m_position.x;tY=def.anchorPoint1.y-this.m_body1.m_position.y;this.m_localAnchor1.x=tX*tMat.col1.x+tY*tMat.col1.y;this.m_localAnchor1.y=tX*tMat.col2.x+tY*tMat.col2.y;tMat=this.m_body2.m_R;tX=def.anchorPoint2.x-this.m_body2.m_position.x;tY=def.anchorPoint2.y-this.m_body2.m_position.y;this.m_localAnchor2.x=tX*tMat.col1.x+tY*tMat.col1.y;this.m_localAnchor2.y=tX*tMat.col2.x+tY*tMat.col2.y;this.m_ratio=def.ratio;tX=def.groundPoint1.x-def.anchorPoint1.x;tY=def.groundPoint1.y-def.anchorPoint1.y;var d1Len=Math.sqrt(tX*tX+tY*tY);tX=def.groundPoint2.x-def.anchorPoint2.x;tY=def.groundPoint2.y-def.anchorPoint2.y;var d2Len=Math.sqrt(tX*tX+tY*tY);var length1=b2Math.b2Max(0.5*b2PulleyJoint.b2_minPulleyLength,d1Len);var length2=b2Math.b2Max(0.5*b2PulleyJoint.b2_minPulleyLength,d2Len);this.m_constant=length1+this.m_ratio*length2;this.m_maxLength1=b2Math.b2Clamp(def.maxLength1,length1,this.m_constant-this.m_ratio*b2PulleyJoint.b2_minPulleyLength);this.m_maxLength2=b2Math.b2Clamp(def.maxLength2,length2,(this.m_constant-b2PulleyJoint.b2_minPulleyLength)/this.m_ratio);this.m_pulleyImpulse=0.0;this.m_limitImpulse1=0.0;this.m_limitImpulse2=0.0;},PrepareVelocitySolver:function(){var b1=this.m_body1;var b2=this.m_body2;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var p1X=b1.m_position.x+r1X;var p1Y=b1.m_position.y+r1Y;var p2X=b2.m_position.x+r2X;var p2Y=b2.m_position.y+r2Y;var s1X=this.m_ground.m_position.x+this.m_groundAnchor1.x;var s1Y=this.m_ground.m_position.y+this.m_groundAnchor1.y;var s2X=this.m_ground.m_position.x+this.m_groundAnchor2.x;var s2Y=this.m_ground.m_position.y+this.m_groundAnchor2.y;this.m_u1.Set(p1X-s1X,p1Y-s1Y);this.m_u2.Set(p2X-s2X,p2Y-s2Y);var length1=this.m_u1.Length();var length2=this.m_u2.Length();if(length1>b2Settings.b2_linearSlop)
{this.m_u1.Multiply(1.0/length1);}
else
{this.m_u1.SetZero();}
if(length2>b2Settings.b2_linearSlop)
{this.m_u2.Multiply(1.0/length2);}
else
{this.m_u2.SetZero();}
if(length1<this.m_maxLength1)
{this.m_limitState1=b2Joint.e_inactiveLimit;this.m_limitImpulse1=0.0;}
else
{this.m_limitState1=b2Joint.e_atUpperLimit;this.m_limitPositionImpulse1=0.0;}
if(length2<this.m_maxLength2)
{this.m_limitState2=b2Joint.e_inactiveLimit;this.m_limitImpulse2=0.0;}
else
{this.m_limitState2=b2Joint.e_atUpperLimit;this.m_limitPositionImpulse2=0.0;}
var cr1u1=r1X*this.m_u1.y-r1Y*this.m_u1.x;var cr2u2=r2X*this.m_u2.y-r2Y*this.m_u2.x;this.m_limitMass1=b1.m_invMass+b1.m_invI*cr1u1*cr1u1;this.m_limitMass2=b2.m_invMass+b2.m_invI*cr2u2*cr2u2;this.m_pulleyMass=this.m_limitMass1+this.m_ratio*this.m_ratio*this.m_limitMass2;this.m_limitMass1=1.0/this.m_limitMass1;this.m_limitMass2=1.0/this.m_limitMass2;this.m_pulleyMass=1.0/this.m_pulleyMass;var P1X=(-this.m_pulleyImpulse-this.m_limitImpulse1)*this.m_u1.x;var P1Y=(-this.m_pulleyImpulse-this.m_limitImpulse1)*this.m_u1.y;var P2X=(-this.m_ratio*this.m_pulleyImpulse-this.m_limitImpulse2)*this.m_u2.x;var P2Y=(-this.m_ratio*this.m_pulleyImpulse-this.m_limitImpulse2)*this.m_u2.y;b1.m_linearVelocity.x+=b1.m_invMass*P1X;b1.m_linearVelocity.y+=b1.m_invMass*P1Y;b1.m_angularVelocity+=b1.m_invI*(r1X*P1Y-r1Y*P1X);b2.m_linearVelocity.x+=b2.m_invMass*P2X;b2.m_linearVelocity.y+=b2.m_invMass*P2Y;b2.m_angularVelocity+=b2.m_invI*(r2X*P2Y-r2Y*P2X);},SolveVelocityConstraints:function(step){var b1=this.m_body1;var b2=this.m_body2;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var v1X;var v1Y;var v2X;var v2Y;var P1X;var P1Y;var P2X;var P2Y;var Cdot;var impulse;var oldLimitImpulse;v1X=b1.m_linearVelocity.x+(-b1.m_angularVelocity*r1Y);v1Y=b1.m_linearVelocity.y+(b1.m_angularVelocity*r1X);v2X=b2.m_linearVelocity.x+(-b2.m_angularVelocity*r2Y);v2Y=b2.m_linearVelocity.y+(b2.m_angularVelocity*r2X);Cdot=-(this.m_u1.x*v1X+this.m_u1.y*v1Y)-this.m_ratio*(this.m_u2.x*v2X+this.m_u2.y*v2Y);impulse=-this.m_pulleyMass*Cdot;this.m_pulleyImpulse+=impulse;P1X=-impulse*this.m_u1.x;P1Y=-impulse*this.m_u1.y;P2X=-this.m_ratio*impulse*this.m_u2.x;P2Y=-this.m_ratio*impulse*this.m_u2.y;b1.m_linearVelocity.x+=b1.m_invMass*P1X;b1.m_linearVelocity.y+=b1.m_invMass*P1Y;b1.m_angularVelocity+=b1.m_invI*(r1X*P1Y-r1Y*P1X);b2.m_linearVelocity.x+=b2.m_invMass*P2X;b2.m_linearVelocity.y+=b2.m_invMass*P2Y;b2.m_angularVelocity+=b2.m_invI*(r2X*P2Y-r2Y*P2X);if(this.m_limitState1==b2Joint.e_atUpperLimit)
{v1X=b1.m_linearVelocity.x+(-b1.m_angularVelocity*r1Y);v1Y=b1.m_linearVelocity.y+(b1.m_angularVelocity*r1X);Cdot=-(this.m_u1.x*v1X+this.m_u1.y*v1Y);impulse=-this.m_limitMass1*Cdot;oldLimitImpulse=this.m_limitImpulse1;this.m_limitImpulse1=b2Math.b2Max(0.0,this.m_limitImpulse1+impulse);impulse=this.m_limitImpulse1-oldLimitImpulse;P1X=-impulse*this.m_u1.x;P1Y=-impulse*this.m_u1.y;b1.m_linearVelocity.x+=b1.m_invMass*P1X;b1.m_linearVelocity.y+=b1.m_invMass*P1Y;b1.m_angularVelocity+=b1.m_invI*(r1X*P1Y-r1Y*P1X);}
if(this.m_limitState2==b2Joint.e_atUpperLimit)
{v2X=b2.m_linearVelocity.x+(-b2.m_angularVelocity*r2Y);v2Y=b2.m_linearVelocity.y+(b2.m_angularVelocity*r2X);Cdot=-(this.m_u2.x*v2X+this.m_u2.y*v2Y);impulse=-this.m_limitMass2*Cdot;oldLimitImpulse=this.m_limitImpulse2;this.m_limitImpulse2=b2Math.b2Max(0.0,this.m_limitImpulse2+impulse);impulse=this.m_limitImpulse2-oldLimitImpulse;P2X=-impulse*this.m_u2.x;P2Y=-impulse*this.m_u2.y;b2.m_linearVelocity.x+=b2.m_invMass*P2X;b2.m_linearVelocity.y+=b2.m_invMass*P2Y;b2.m_angularVelocity+=b2.m_invI*(r2X*P2Y-r2Y*P2X);}},SolvePositionConstraints:function(){var b1=this.m_body1;var b2=this.m_body2;var tMat;var s1X=this.m_ground.m_position.x+this.m_groundAnchor1.x;var s1Y=this.m_ground.m_position.y+this.m_groundAnchor1.y;var s2X=this.m_ground.m_position.x+this.m_groundAnchor2.x;var s2Y=this.m_ground.m_position.y+this.m_groundAnchor2.y;var r1X;var r1Y;var r2X;var r2Y;var p1X;var p1Y;var p2X;var p2Y;var length1;var length2;var C;var impulse;var oldLimitPositionImpulse;var linearError=0.0;{tMat=b1.m_R;r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;p1X=b1.m_position.x+r1X;p1Y=b1.m_position.y+r1Y;p2X=b2.m_position.x+r2X;p2Y=b2.m_position.y+r2Y;this.m_u1.Set(p1X-s1X,p1Y-s1Y);this.m_u2.Set(p2X-s2X,p2Y-s2Y);length1=this.m_u1.Length();length2=this.m_u2.Length();if(length1>b2Settings.b2_linearSlop)
{this.m_u1.Multiply(1.0/length1);}
else
{this.m_u1.SetZero();}
if(length2>b2Settings.b2_linearSlop)
{this.m_u2.Multiply(1.0/length2);}
else
{this.m_u2.SetZero();}
C=this.m_constant-length1-this.m_ratio*length2;linearError=b2Math.b2Max(linearError,Math.abs(C));C=b2Math.b2Clamp(C,-b2Settings.b2_maxLinearCorrection,b2Settings.b2_maxLinearCorrection);impulse=-this.m_pulleyMass*C;p1X=-impulse*this.m_u1.x;p1Y=-impulse*this.m_u1.y;p2X=-this.m_ratio*impulse*this.m_u2.x;p2Y=-this.m_ratio*impulse*this.m_u2.y;b1.m_position.x+=b1.m_invMass*p1X;b1.m_position.y+=b1.m_invMass*p1Y;b1.m_rotation+=b1.m_invI*(r1X*p1Y-r1Y*p1X);b2.m_position.x+=b2.m_invMass*p2X;b2.m_position.y+=b2.m_invMass*p2Y;b2.m_rotation+=b2.m_invI*(r2X*p2Y-r2Y*p2X);b1.m_R.Set(b1.m_rotation);b2.m_R.Set(b2.m_rotation);}
if(this.m_limitState1==b2Joint.e_atUpperLimit)
{tMat=b1.m_R;r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;p1X=b1.m_position.x+r1X;p1Y=b1.m_position.y+r1Y;this.m_u1.Set(p1X-s1X,p1Y-s1Y);length1=this.m_u1.Length();if(length1>b2Settings.b2_linearSlop)
{this.m_u1.x*=1.0/length1;this.m_u1.y*=1.0/length1;}
else
{this.m_u1.SetZero();}
C=this.m_maxLength1-length1;linearError=b2Math.b2Max(linearError,-C);C=b2Math.b2Clamp(C+b2Settings.b2_linearSlop,-b2Settings.b2_maxLinearCorrection,0.0);impulse=-this.m_limitMass1*C;oldLimitPositionImpulse=this.m_limitPositionImpulse1;this.m_limitPositionImpulse1=b2Math.b2Max(0.0,this.m_limitPositionImpulse1+impulse);impulse=this.m_limitPositionImpulse1-oldLimitPositionImpulse;p1X=-impulse*this.m_u1.x;p1Y=-impulse*this.m_u1.y;b1.m_position.x+=b1.m_invMass*p1X;b1.m_position.y+=b1.m_invMass*p1Y;b1.m_rotation+=b1.m_invI*(r1X*p1Y-r1Y*p1X);b1.m_R.Set(b1.m_rotation);}
if(this.m_limitState2==b2Joint.e_atUpperLimit)
{tMat=b2.m_R;r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;p2X=b2.m_position.x+r2X;p2Y=b2.m_position.y+r2Y;this.m_u2.Set(p2X-s2X,p2Y-s2Y);length2=this.m_u2.Length();if(length2>b2Settings.b2_linearSlop)
{this.m_u2.x*=1.0/length2;this.m_u2.y*=1.0/length2;}
else
{this.m_u2.SetZero();}
C=this.m_maxLength2-length2;linearError=b2Math.b2Max(linearError,-C);C=b2Math.b2Clamp(C+b2Settings.b2_linearSlop,-b2Settings.b2_maxLinearCorrection,0.0);impulse=-this.m_limitMass2*C;oldLimitPositionImpulse=this.m_limitPositionImpulse2;this.m_limitPositionImpulse2=b2Math.b2Max(0.0,this.m_limitPositionImpulse2+impulse);impulse=this.m_limitPositionImpulse2-oldLimitPositionImpulse;p2X=-impulse*this.m_u2.x;p2Y=-impulse*this.m_u2.y;b2.m_position.x+=b2.m_invMass*p2X;b2.m_position.y+=b2.m_invMass*p2Y;b2.m_rotation+=b2.m_invI*(r2X*p2Y-r2Y*p2X);b2.m_R.Set(b2.m_rotation);}
return linearError<b2Settings.b2_linearSlop;},m_ground:null,m_groundAnchor1:new b2Vec2(),m_groundAnchor2:new b2Vec2(),m_localAnchor1:new b2Vec2(),m_localAnchor2:new b2Vec2(),m_u1:new b2Vec2(),m_u2:new b2Vec2(),m_constant:null,m_ratio:null,m_maxLength1:null,m_maxLength2:null,m_pulleyMass:null,m_limitMass1:null,m_limitMass2:null,m_pulleyImpulse:null,m_limitImpulse1:null,m_limitImpulse2:null,m_limitPositionImpulse1:null,m_limitPositionImpulse2:null,m_limitState1:0,m_limitState2:0});b2PulleyJoint.b2_minPulleyLength=b2Settings.b2_lengthUnitsPerMeter;﻿
var b2PulleyJointDef=Class.create();Object.extend(b2PulleyJointDef.prototype,b2JointDef.prototype);Object.extend(b2PulleyJointDef.prototype,{initialize:function()
{this.type=b2Joint.e_unknownJoint;this.userData=null;this.body1=null;this.body2=null;this.collideConnected=false;this.groundPoint1=new b2Vec2();this.groundPoint2=new b2Vec2();this.anchorPoint1=new b2Vec2();this.anchorPoint2=new b2Vec2();this.type=b2Joint.e_pulleyJoint;this.groundPoint1.Set(-1.0,1.0);this.groundPoint2.Set(1.0,1.0);this.anchorPoint1.Set(-1.0,0.0);this.anchorPoint2.Set(1.0,0.0);this.maxLength1=0.5*b2PulleyJoint.b2_minPulleyLength;this.maxLength2=0.5*b2PulleyJoint.b2_minPulleyLength;this.ratio=1.0;this.collideConnected=true;},groundPoint1:new b2Vec2(),groundPoint2:new b2Vec2(),anchorPoint1:new b2Vec2(),anchorPoint2:new b2Vec2(),maxLength1:null,maxLength2:null,ratio:null});﻿
var b2RevoluteJoint=Class.create();Object.extend(b2RevoluteJoint.prototype,b2Joint.prototype);Object.extend(b2RevoluteJoint.prototype,{GetAnchor1:function(){var tMat=this.m_body1.m_R;return new b2Vec2(this.m_body1.m_position.x+(tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y),this.m_body1.m_position.y+(tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y));},GetAnchor2:function(){var tMat=this.m_body2.m_R;return new b2Vec2(this.m_body2.m_position.x+(tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y),this.m_body2.m_position.y+(tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y));},GetJointAngle:function(){return this.m_body2.m_rotation-this.m_body1.m_rotation;},GetJointSpeed:function(){return this.m_body2.m_angularVelocity-this.m_body1.m_angularVelocity;},GetMotorTorque:function(invTimeStep){return invTimeStep*this.m_motorImpulse;},SetMotorSpeed:function(speed)
{this.m_motorSpeed=speed;},SetMotorTorque:function(torque)
{this.m_maxMotorTorque=torque;},GetReactionForce:function(invTimeStep)
{var tVec=this.m_ptpImpulse.Copy();tVec.Multiply(invTimeStep);return tVec;},GetReactionTorque:function(invTimeStep)
{return invTimeStep*this.m_limitImpulse;},initialize:function(def){this.m_node1=new b2JointNode();this.m_node2=new b2JointNode();this.m_type=def.type;this.m_prev=null;this.m_next=null;this.m_body1=def.body1;this.m_body2=def.body2;this.m_collideConnected=def.collideConnected;this.m_islandFlag=false;this.m_userData=def.userData;this.K=new b2Mat22();this.K1=new b2Mat22();this.K2=new b2Mat22();this.K3=new b2Mat22();this.m_localAnchor1=new b2Vec2();this.m_localAnchor2=new b2Vec2();this.m_ptpImpulse=new b2Vec2();this.m_ptpMass=new b2Mat22();var tMat;var tX;var tY;tMat=this.m_body1.m_R;tX=def.anchorPoint.x-this.m_body1.m_position.x;tY=def.anchorPoint.y-this.m_body1.m_position.y;this.m_localAnchor1.x=tX*tMat.col1.x+tY*tMat.col1.y;this.m_localAnchor1.y=tX*tMat.col2.x+tY*tMat.col2.y;tMat=this.m_body2.m_R;tX=def.anchorPoint.x-this.m_body2.m_position.x;tY=def.anchorPoint.y-this.m_body2.m_position.y;this.m_localAnchor2.x=tX*tMat.col1.x+tY*tMat.col1.y;this.m_localAnchor2.y=tX*tMat.col2.x+tY*tMat.col2.y;this.m_intialAngle=this.m_body2.m_rotation-this.m_body1.m_rotation;this.m_ptpImpulse.Set(0.0,0.0);this.m_motorImpulse=0.0;this.m_limitImpulse=0.0;this.m_limitPositionImpulse=0.0;this.m_lowerAngle=def.lowerAngle;this.m_upperAngle=def.upperAngle;this.m_maxMotorTorque=def.motorTorque;this.m_motorSpeed=def.motorSpeed;this.m_enableLimit=def.enableLimit;this.m_enableMotor=def.enableMotor;},K:new b2Mat22(),K1:new b2Mat22(),K2:new b2Mat22(),K3:new b2Mat22(),PrepareVelocitySolver:function(){var b1=this.m_body1;var b2=this.m_body2;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var invMass1=b1.m_invMass;var invMass2=b2.m_invMass;var invI1=b1.m_invI;var invI2=b2.m_invI;this.K1.col1.x=invMass1+invMass2;this.K1.col2.x=0.0;this.K1.col1.y=0.0;this.K1.col2.y=invMass1+invMass2;this.K2.col1.x=invI1*r1Y*r1Y;this.K2.col2.x=-invI1*r1X*r1Y;this.K2.col1.y=-invI1*r1X*r1Y;this.K2.col2.y=invI1*r1X*r1X;this.K3.col1.x=invI2*r2Y*r2Y;this.K3.col2.x=-invI2*r2X*r2Y;this.K3.col1.y=-invI2*r2X*r2Y;this.K3.col2.y=invI2*r2X*r2X;this.K.SetM(this.K1);this.K.AddM(this.K2);this.K.AddM(this.K3);this.K.Invert(this.m_ptpMass);this.m_motorMass=1.0/(invI1+invI2);if(this.m_enableMotor==false)
{this.m_motorImpulse=0.0;}
if(this.m_enableLimit)
{var jointAngle=b2.m_rotation-b1.m_rotation-this.m_intialAngle;if(b2Math.b2Abs(this.m_upperAngle-this.m_lowerAngle)<2.0*b2Settings.b2_angularSlop)
{this.m_limitState=b2Joint.e_equalLimits;}
else if(jointAngle<=this.m_lowerAngle)
{if(this.m_limitState!=b2Joint.e_atLowerLimit)
{this.m_limitImpulse=0.0;}
this.m_limitState=b2Joint.e_atLowerLimit;}
else if(jointAngle>=this.m_upperAngle)
{if(this.m_limitState!=b2Joint.e_atUpperLimit)
{this.m_limitImpulse=0.0;}
this.m_limitState=b2Joint.e_atUpperLimit;}
else
{this.m_limitState=b2Joint.e_inactiveLimit;this.m_limitImpulse=0.0;}}
else
{this.m_limitImpulse=0.0;}
if(b2World.s_enableWarmStarting)
{b1.m_linearVelocity.x-=invMass1*this.m_ptpImpulse.x;b1.m_linearVelocity.y-=invMass1*this.m_ptpImpulse.y;b1.m_angularVelocity-=invI1*((r1X*this.m_ptpImpulse.y-r1Y*this.m_ptpImpulse.x)+this.m_motorImpulse+this.m_limitImpulse);b2.m_linearVelocity.x+=invMass2*this.m_ptpImpulse.x;b2.m_linearVelocity.y+=invMass2*this.m_ptpImpulse.y;b2.m_angularVelocity+=invI2*((r2X*this.m_ptpImpulse.y-r2Y*this.m_ptpImpulse.x)+this.m_motorImpulse+this.m_limitImpulse);}
else{this.m_ptpImpulse.SetZero();this.m_motorImpulse=0.0;this.m_limitImpulse=0.0;}
this.m_limitPositionImpulse=0.0;},SolveVelocityConstraints:function(step){var b1=this.m_body1;var b2=this.m_body2;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var oldLimitImpulse;var ptpCdotX=b2.m_linearVelocity.x+(-b2.m_angularVelocity*r2Y)-b1.m_linearVelocity.x-(-b1.m_angularVelocity*r1Y);var ptpCdotY=b2.m_linearVelocity.y+(b2.m_angularVelocity*r2X)-b1.m_linearVelocity.y-(b1.m_angularVelocity*r1X);var ptpImpulseX=-(this.m_ptpMass.col1.x*ptpCdotX+this.m_ptpMass.col2.x*ptpCdotY);var ptpImpulseY=-(this.m_ptpMass.col1.y*ptpCdotX+this.m_ptpMass.col2.y*ptpCdotY);this.m_ptpImpulse.x+=ptpImpulseX;this.m_ptpImpulse.y+=ptpImpulseY;b1.m_linearVelocity.x-=b1.m_invMass*ptpImpulseX;b1.m_linearVelocity.y-=b1.m_invMass*ptpImpulseY;b1.m_angularVelocity-=b1.m_invI*(r1X*ptpImpulseY-r1Y*ptpImpulseX);b2.m_linearVelocity.x+=b2.m_invMass*ptpImpulseX;b2.m_linearVelocity.y+=b2.m_invMass*ptpImpulseY;b2.m_angularVelocity+=b2.m_invI*(r2X*ptpImpulseY-r2Y*ptpImpulseX);if(this.m_enableMotor&&this.m_limitState!=b2Joint.e_equalLimits)
{var motorCdot=b2.m_angularVelocity-b1.m_angularVelocity-this.m_motorSpeed;var motorImpulse=-this.m_motorMass*motorCdot;var oldMotorImpulse=this.m_motorImpulse;this.m_motorImpulse=b2Math.b2Clamp(this.m_motorImpulse+motorImpulse,-step.dt*this.m_maxMotorTorque,step.dt*this.m_maxMotorTorque);motorImpulse=this.m_motorImpulse-oldMotorImpulse;b1.m_angularVelocity-=b1.m_invI*motorImpulse;b2.m_angularVelocity+=b2.m_invI*motorImpulse;}
if(this.m_enableLimit&&this.m_limitState!=b2Joint.e_inactiveLimit)
{var limitCdot=b2.m_angularVelocity-b1.m_angularVelocity;var limitImpulse=-this.m_motorMass*limitCdot;if(this.m_limitState==b2Joint.e_equalLimits)
{this.m_limitImpulse+=limitImpulse;}
else if(this.m_limitState==b2Joint.e_atLowerLimit)
{oldLimitImpulse=this.m_limitImpulse;this.m_limitImpulse=b2Math.b2Max(this.m_limitImpulse+limitImpulse,0.0);limitImpulse=this.m_limitImpulse-oldLimitImpulse;}
else if(this.m_limitState==b2Joint.e_atUpperLimit)
{oldLimitImpulse=this.m_limitImpulse;this.m_limitImpulse=b2Math.b2Min(this.m_limitImpulse+limitImpulse,0.0);limitImpulse=this.m_limitImpulse-oldLimitImpulse;}
b1.m_angularVelocity-=b1.m_invI*limitImpulse;b2.m_angularVelocity+=b2.m_invI*limitImpulse;}},SolvePositionConstraints:function(){var oldLimitImpulse;var limitC;var b1=this.m_body1;var b2=this.m_body2;var positionError=0.0;var tMat;tMat=b1.m_R;var r1X=tMat.col1.x*this.m_localAnchor1.x+tMat.col2.x*this.m_localAnchor1.y;var r1Y=tMat.col1.y*this.m_localAnchor1.x+tMat.col2.y*this.m_localAnchor1.y;tMat=b2.m_R;var r2X=tMat.col1.x*this.m_localAnchor2.x+tMat.col2.x*this.m_localAnchor2.y;var r2Y=tMat.col1.y*this.m_localAnchor2.x+tMat.col2.y*this.m_localAnchor2.y;var p1X=b1.m_position.x+r1X;var p1Y=b1.m_position.y+r1Y;var p2X=b2.m_position.x+r2X;var p2Y=b2.m_position.y+r2Y;var ptpCX=p2X-p1X;var ptpCY=p2Y-p1Y;positionError=Math.sqrt(ptpCX*ptpCX+ptpCY*ptpCY);var invMass1=b1.m_invMass;var invMass2=b2.m_invMass;var invI1=b1.m_invI;var invI2=b2.m_invI;this.K1.col1.x=invMass1+invMass2;this.K1.col2.x=0.0;this.K1.col1.y=0.0;this.K1.col2.y=invMass1+invMass2;this.K2.col1.x=invI1*r1Y*r1Y;this.K2.col2.x=-invI1*r1X*r1Y;this.K2.col1.y=-invI1*r1X*r1Y;this.K2.col2.y=invI1*r1X*r1X;this.K3.col1.x=invI2*r2Y*r2Y;this.K3.col2.x=-invI2*r2X*r2Y;this.K3.col1.y=-invI2*r2X*r2Y;this.K3.col2.y=invI2*r2X*r2X;this.K.SetM(this.K1);this.K.AddM(this.K2);this.K.AddM(this.K3);this.K.Solve(b2RevoluteJoint.tImpulse,-ptpCX,-ptpCY);var impulseX=b2RevoluteJoint.tImpulse.x;var impulseY=b2RevoluteJoint.tImpulse.y;b1.m_position.x-=b1.m_invMass*impulseX;b1.m_position.y-=b1.m_invMass*impulseY;b1.m_rotation-=b1.m_invI*(r1X*impulseY-r1Y*impulseX);b1.m_R.Set(b1.m_rotation);b2.m_position.x+=b2.m_invMass*impulseX;b2.m_position.y+=b2.m_invMass*impulseY;b2.m_rotation+=b2.m_invI*(r2X*impulseY-r2Y*impulseX);b2.m_R.Set(b2.m_rotation);var angularError=0.0;if(this.m_enableLimit&&this.m_limitState!=b2Joint.e_inactiveLimit)
{var angle=b2.m_rotation-b1.m_rotation-this.m_intialAngle;var limitImpulse=0.0;if(this.m_limitState==b2Joint.e_equalLimits)
{limitC=b2Math.b2Clamp(angle,-b2Settings.b2_maxAngularCorrection,b2Settings.b2_maxAngularCorrection);limitImpulse=-this.m_motorMass*limitC;angularError=b2Math.b2Abs(limitC);}
else if(this.m_limitState==b2Joint.e_atLowerLimit)
{limitC=angle-this.m_lowerAngle;angularError=b2Math.b2Max(0.0,-limitC);limitC=b2Math.b2Clamp(limitC+b2Settings.b2_angularSlop,-b2Settings.b2_maxAngularCorrection,0.0);limitImpulse=-this.m_motorMass*limitC;oldLimitImpulse=this.m_limitPositionImpulse;this.m_limitPositionImpulse=b2Math.b2Max(this.m_limitPositionImpulse+limitImpulse,0.0);limitImpulse=this.m_limitPositionImpulse-oldLimitImpulse;}
else if(this.m_limitState==b2Joint.e_atUpperLimit)
{limitC=angle-this.m_upperAngle;angularError=b2Math.b2Max(0.0,limitC);limitC=b2Math.b2Clamp(limitC-b2Settings.b2_angularSlop,0.0,b2Settings.b2_maxAngularCorrection);limitImpulse=-this.m_motorMass*limitC;oldLimitImpulse=this.m_limitPositionImpulse;this.m_limitPositionImpulse=b2Math.b2Min(this.m_limitPositionImpulse+limitImpulse,0.0);limitImpulse=this.m_limitPositionImpulse-oldLimitImpulse;}
b1.m_rotation-=b1.m_invI*limitImpulse;b1.m_R.Set(b1.m_rotation);b2.m_rotation+=b2.m_invI*limitImpulse;b2.m_R.Set(b2.m_rotation);}
return positionError<=b2Settings.b2_linearSlop&&angularError<=b2Settings.b2_angularSlop;},m_localAnchor1:new b2Vec2(),m_localAnchor2:new b2Vec2(),m_ptpImpulse:new b2Vec2(),m_motorImpulse:null,m_limitImpulse:null,m_limitPositionImpulse:null,m_ptpMass:new b2Mat22(),m_motorMass:null,m_intialAngle:null,m_lowerAngle:null,m_upperAngle:null,m_maxMotorTorque:null,m_motorSpeed:null,m_enableLimit:null,m_enableMotor:null,m_limitState:0});b2RevoluteJoint.tImpulse=new b2Vec2();﻿
var b2RevoluteJointDef=Class.create();Object.extend(b2RevoluteJointDef.prototype,b2JointDef.prototype);Object.extend(b2RevoluteJointDef.prototype,{initialize:function()
{this.type=b2Joint.e_unknownJoint;this.userData=null;this.body1=null;this.body2=null;this.collideConnected=false;this.type=b2Joint.e_revoluteJoint;this.anchorPoint=new b2Vec2(0.0,0.0);this.lowerAngle=0.0;this.upperAngle=0.0;this.motorTorque=0.0;this.motorSpeed=0.0;this.enableLimit=false;this.enableMotor=false;},anchorPoint:null,lowerAngle:null,upperAngle:null,motorTorque:null,motorSpeed:null,enableLimit:null,enableMotor:null});

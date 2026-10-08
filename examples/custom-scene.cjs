// 中文：从这里开始写时间驱动场景。English: start a time-driven scene here.
const clamp=x=>Math.max(0,Math.min(1,x));
module.exports={
  duration:6,width:1920,height:1080,
  render(ctx,t){
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    ctx.fillStyle='#efede5';ctx.fillRect(0,0,1920,1080);
    const u=1-Math.pow(1-clamp(t/1.2),4),radius=90+35*Math.sin(t*2);
    ctx.beginPath();ctx.arc(1680,540,radius,0,Math.PI*2);ctx.fillStyle='#f16b46';ctx.fill();
    ctx.font='180px Anton';ctx.fillStyle='#191918';ctx.fillText('YOUR NEXT IDEA',100,600+(1-u)*300);
    ctx.font='30px sans-serif';ctx.fillStyle='#6f6e65';ctx.fillText('把想法变成动作 / Turn your idea into motion',110,730);
  }
};

'use strict';
const catalog = [
{id:'original',name:'經典原味',en:'Original',category:'經典系列',price:320,rating:'4.9',reviews:'1,236',badge:'人氣推薦',diet:['低糖配方','高纖維','無添加','純素可食']},
{id:'nuts',name:'蜂蜜堅果',en:'Honey Pecan',category:'堅果系列',price:360,rating:'4.8',reviews:'982',diet:['高纖維','無添加']},
{id:'chocolate',name:'可可脆穀',en:'Chocolate Crunch',category:'巧克力系列',price:360,rating:'4.8',reviews:'756',diet:['高纖維','純素可食']},
{id:'berry',name:'莓果風味',en:'Strawberry & Blueberry',category:'莓果系列',price:360,rating:'4.9',reviews:'629',badge:'新品上市',diet:['低糖配方','高纖維','純素可食']}
];
const categories=[['original','經典穀物','經典原味・百搭美味','經典系列'],['chocolate','巧克力風味','香濃可可・大人系選擇','巧克力系列'],['berry','莓果風味','酸甜果香・清爽口感','莓果系列'],['nuts','堅果風味','多種堅果・營養滿分','堅果系列'],['seeds','籽實風味','多元穀籽・更有飽足感','籽實系列']];
const series=['全部商品','經典系列','堅果系列','莓果系列','巧克力系列','籽實系列'];
const $=s=>document.querySelector(s);
let selected='全部商品';
let cart=[];
const quantities={};
const weight=()=>Number($('input[name="weight"]:checked').value);
const price=(p,w)=>w===1000?Math.round(p.price*2.6):p.price;
$('#series-tabs').innerHTML=series.map(s=>'<button type="button" data-series="'+s+'">'+s+'</button>').join('');
$('#category-grid').innerHTML=categories.map(c=>'<button class="category" type="button" data-series="'+c[3]+'"><img src="images/category-'+c[0]+'.png" alt="" loading="lazy"><b>'+c[1]+'</b><small>'+c[2]+'</small></button>').join('');
$('#flavor-filters').innerHTML=catalog.map(p=>'<label><input type="checkbox" name="flavor" value="'+p.id+'">'+p.name+'</label>').join('');
function render(){
 document.querySelectorAll('#series-tabs button').forEach(b=>{const active=b.dataset.series===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 const flavors=[...document.querySelectorAll('[name="flavor"]:checked')].map(x=>x.value);
 const diets=[...document.querySelectorAll('[name="diet"]:checked')].map(x=>x.value);
 const query=$('#search').value.trim().toLowerCase();
 let list=catalog.filter(p=>(selected==='全部商品'||p.category===selected)&&(!flavors.length||flavors.includes(p.id))&&diets.every(d=>p.diet.includes(d))&&[p.name,p.en,p.category].join(' ').toLowerCase().includes(query));
 if($('#sort').value==='price-up') list.sort((a,b)=>a.price-b.price);
 if($('#sort').value==='price-down') list.sort((a,b)=>b.price-a.price);
 $('#result-count').textContent='共 '+list.length+' 項商品';
 $('#empty-state').hidden=list.length>0;
 $('#products').innerHTML=list.map(p=>'<article class="product">'+(p.badge?'<span class="badge '+(p.id==='berry'?'new':'')+'">'+p.badge+'</span>':'')+'<img src="images/'+p.id+'.png" alt="'+p.name+'全穀物包裝"><h3>'+p.name+'</h3><p class="translation">'+p.en+'</p><div class="rating"><span>★ '+p.rating+'</span> ('+p.reviews+')</div><p class="price"><b>TWD '+price(p,weight())+'</b> / '+(weight()===1000?'1 kg':'350g')+'</p><div class="quantity"><button data-minus="'+p.id+'" aria-label="減少'+p.name+'數量">−</button><output aria-label="商品數量">'+(quantities[p.id]||1)+'</output><button data-plus="'+p.id+'" aria-label="增加'+p.name+'數量">＋</button></div><button class="btn olive add-button" data-add="'+p.id+'">♧ 加入購物車</button></article>').join('');
}
function renderCart(){
 $('#cart-count').textContent=cart.reduce((s,c)=>s+c.qty,0);
 const container=$('#cart-items');container.replaceChildren();
 if(!cart.length)container.textContent='購物車還是空的，探索你的日常美味吧。';
 cart.forEach((c,index)=>{
 const p=catalog.find(p=>p.id===c.id);
 const row=document.createElement('div');row.className='cart-row';
 row.innerHTML='<img src="images/'+p.id+'.png" alt=""><div><b>'+p.name+'</b><small>'+c.weight+' g × '+c.qty+'</small><small>TWD '+price(p,c.weight)*c.qty+'</small></div><button data-remove="'+index+'">移除</button>';
 container.append(row);
 });
 $('#cart-total').textContent='商品合計 TWD '+cart.reduce((s,c)=>s+price(catalog.find(p=>p.id===c.id),c.weight)*c.qty,0);
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.series){selected=b.dataset.series;render();if(b.classList.contains('category'))$('#shop').scrollIntoView({behavior:'smooth'});}
 if(b.dataset.plus){quantities[b.dataset.plus]=Math.min(99,(quantities[b.dataset.plus]||1)+1);render();}
 if(b.dataset.minus){quantities[b.dataset.minus]=Math.max(1,(quantities[b.dataset.minus]||1)-1);render();}
 if(b.dataset.add){const id=b.dataset.add,w=weight(),qty=quantities[id]||1;const item=cart.find(c=>c.id===id&&c.weight===w);if(item)item.qty+=qty;else cart.push({id,weight:w,qty});renderCart();bootstrap.Toast.getOrCreateInstance($('#cart-toast')).show();}
 if(b.dataset.remove!==undefined){cart.splice(Number(b.dataset.remove),1);renderCart();}
});
document.querySelectorAll('.filters input').forEach(i=>i.addEventListener('change',render));
$('#sort').addEventListener('change',render);$('#search').addEventListener('input',render);
function clearFilters(){selected='全部商品';document.querySelectorAll('.filters input[type="checkbox"]').forEach(i=>i.checked=false);$('input[name="weight"][value="350"]').checked=true;$('#search').value='';$('#sort').value='popular';render();}
$('#clear-filter').addEventListener('click',clearFilters);$('#all-series').addEventListener('click',clearFilters);
render();renderCart();

const BURGER_IMG='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85';
(async()=>{
 const grid=document.querySelector('#grid'),search=document.querySelector('#search'),sort=document.querySelector('#sort'),count=document.querySelector('#count');
 const burgers=await fetch('burgers.json').then(r=>r.json());
 const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 function render(){
  const q=search.value.trim().toLowerCase();
  let list=burgers.filter(b=>(b.name+' '+b.badge+' '+b.desc).toLowerCase().includes(q));
  if(sort.value==='price-low')list.sort((a,b)=>a.price-b.price);
  if(sort.value==='price-high')list.sort((a,b)=>b.price-a.price);
  count.textContent=`Showing ${list.length} burger${list.length===1?'':'s'}`;
  grid.innerHTML=list.length?list.map(b=>`<a class="card" href="burger.html?id=${encodeURIComponent(b.id)}"><div class="card-img"><img src="${BURGER_IMG}" alt="${esc(b.name)}"><span class="badge">${esc(b.badge)}</span></div><div class="card-body"><div class="title-row"><h2>${esc(b.name)}</h2><span class="price">$${b.price}</span></div><p>${esc(b.desc)}</p><div class="card-action">View Details →</div></div></a>`).join(''):'<div class="empty">No burgers found.</div>';
 }
 search.addEventListener('input',render);sort.addEventListener('change',render);document.querySelector('#mobileMenu')?.addEventListener('click',()=>search.focus());render();
})().catch(()=>document.querySelector('#grid').innerHTML='<div class="empty">Menu could not load.</div>');
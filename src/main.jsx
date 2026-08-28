import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, ArrowUpRight, ChevronRight, Flame, Instagram, Mail, MapPin, Menu, Search, ShoppingBag, X } from "lucide-react";
import "./styles.css";

const burgers = [
  { id:"aj-cheese-burger", name:"AJ Cheese Burger", price:14, badge:"Classic", desc:"Smashed beef patty, grilled onions, American cheese, pickles, ketchup and mustard sauce on a soft milk bun.", ingredients:["Smashed beef patty","Grilled onions","American cheese","Pickles","Ketchup","Mustard sauce","Soft milk bun"] },
  { id:"aj-chicken-burger", name:"AJ Chicken Burger", price:16, badge:"Chicken", desc:"Chicken patty, shredded mixed cheese, lettuce, chilli and mayo on a soft milk bun.", ingredients:["Chicken patty","Mixed cheese","Lettuce","Chilli","Mayo","Soft milk bun"] },
  { id:"aj-special", name:"AJ Special", price:16, badge:"Signature", desc:"Smashed beef patty, American cheese, caramelised onions, pickles, lettuce, tomato and AJ’s special sauce on a soft milk bun.", ingredients:["Smashed beef patty","American cheese","Caramelised onions","Pickles","Lettuce","Tomato","AJ’s special sauce","Soft milk bun"] },
  { id:"aj-whop-whop", name:"AJ Whop Whop", price:16, badge:"Double Cheese", desc:"Smashed beef patty, double American cheese, raw onions, lettuce, tomato, ketchup and mayo on a soft milk bun.", ingredients:["Smashed beef patty","Double American cheese","Raw onions","Lettuce","Tomato","Ketchup","Mayo","Soft milk bun"] },
  { id:"aj-wagyu", name:"AJ Wagyu", price:18, badge:"Premium", desc:"Wagyu patty, American cheese, grilled onions, tomato, lettuce, beetroot and AJ’s special sauce on a soft milk bun.", ingredients:["Wagyu patty","American cheese","Grilled onions","Tomato","Lettuce","Beetroot","AJ’s special sauce","Soft milk bun"] },
  { id:"aj-tower", name:"AJ Tower", price:18, badge:"Double", desc:"Two smashed beef patties, lettuce, tomato, American cheese, pickles and AJ’s special sauce on a soft milk bun.", ingredients:["2 smashed beef patties","Lettuce","Tomato","American cheese","Pickles","AJ’s special sauce","Soft milk bun"] },
  { id:"the-abd", name:"The A.B.D", price:18, badge:"Spicy", desc:"Smashed beef patty, American cheese, jalapeños, onion, lettuce, tomato, BBQ sauce and mayo on a soft milk bun.", ingredients:["Smashed beef patty","American cheese","Jalapeños","Onion","Lettuce","Tomato","BBQ sauce","Mayo","Soft milk bun"] },
  { id:"aj-bunless", name:"AJ Bunless", price:18, badge:"Low Carb", desc:"Choice of two smashed beef or chicken patties, American cheese, lettuce, tomato, pickles, sunny-side-up egg and AJ’s special sauce.", ingredients:["Choice of beef or chicken","American cheese","Lettuce","Tomato","Pickles","Sunny-side-up egg","AJ’s special sauce"] }
];

const nav = [
  ["Burgers","#/"],
  ["Our Story","#/story"],
  ["Quality","#/quality"],
  ["Contact","#/contact"]
];

const orderLinks = [
  ["Uber Eats","https://www.ubereats.com/au/store/aj-burgers/sHkTeYksRNeA1PGfFcbQrQ"],
  ["DoorDash","https://www.doordash.com/store/aj-burgers-liverpool-sefton-29595025/37105560/"]
];

function routeFromHash(){
  const raw = location.hash.replace(/^#\/?/,"");
  if(!raw) return {page:"home"};
  if(raw.startsWith("burger/")) return {page:"burger", id:raw.split("/")[1]};
  if(raw === "story") return {page:"story"};
  if(raw === "quality") return {page:"quality"};
  if(raw === "contact") return {page:"contact"};
  return {page:"home"};
}

function App(){
  const [route,setRoute] = useState(routeFromHash());
  const [menuOpen,setMenuOpen] = useState(false);
  const [orderOpen,setOrderOpen] = useState(false);
  useEffect(()=>{
    const onHash=()=>{ setRoute(routeFromHash()); setMenuOpen(false); window.scrollTo({top:0,behavior:"smooth"}); };
    addEventListener("hashchange",onHash);
    return ()=>removeEventListener("hashchange",onHash);
  },[]);

  return <div className="site-shell">
    <Header route={route} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOrder={()=>setOrderOpen(true)} />
    <main>
      {route.page === "home" && <Home />}
      {route.page === "burger" && <BurgerDetail id={route.id} />}
      {route.page === "story" && <Story />}
      {route.page === "quality" && <Quality />}
      {route.page === "contact" && <Contact />}
    </main>
    <Footer onOrder={()=>setOrderOpen(true)} />
    <div className="mobile-order"><button onClick={()=>setOrderOpen(true)}>Order now <ShoppingBag size={17}/></button></div>
    {orderOpen && <OrderModal onClose={()=>setOrderOpen(false)} />}
  </div>;
}

function Header({route,menuOpen,setMenuOpen,onOrder}){
  const active = route.page === "home" || route.page === "burger" ? "#/" : `#/${route.page}`;
  return <>
    <header className="header">
      <a className="brand" href="#/" aria-label="AJ Burger home"><img src="/logo.png" alt="AJ Burger" /></a>
      <nav className="desktop-nav">{nav.map(([label,href])=><a key={href} className={active===href?"active":""} href={href}>{label}</a>)}</nav>
      <button className="order-button header-order" onClick={onOrder}>Order now <ShoppingBag size={16}/></button>
      <button className="menu-toggle" onClick={()=>setMenuOpen(v=>!v)} aria-label="Menu">{menuOpen?<X/>:<Menu/>}</button>
    </header>
    {menuOpen && <nav className="mobile-nav">{nav.map(([label,href])=><a key={href} href={href}>{label}<ArrowUpRight size={15}/></a>)}<button className="order-button" onClick={onOrder}>Order now <ShoppingBag size={16}/></button></nav>}
  </>;
}

function Home(){
  const [query,setQuery]=useState("");
  const [sort,setSort]=useState("featured");
  const visible=useMemo(()=>{
    const q=query.trim().toLowerCase();
    let arr=burgers.filter(b=>(b.name+" "+b.badge+" "+b.desc).toLowerCase().includes(q));
    if(sort==="low") arr=[...arr].sort((a,b)=>a.price-b.price);
    if(sort==="high") arr=[...arr].sort((a,b)=>b.price-a.price);
    return arr;
  },[query,sort]);
  return <>
    <section className="hero">
      <div className="paint left"/><div className="paint right"/>
      <p>Made <b>fresh.</b> Smashed to <b>perfection.</b></p>
      <h1>Burgers</h1><div className="underline"/>
    </section>
    <section className="menu-section">
      <div className="controls">
        <label className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search burgers..." /></label>
        <label className="sort"><span>Sort by:</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price low to high</option><option value="high">Price high to low</option></select></label>
      </div>
      <div className="mobile-meta"><span>Our menu</span><span>{visible.length} stacks</span></div>
      <div className="burger-grid">
        {visible.map((b,i)=><a href={`#/burger/${b.id}`} className="burger-card" key={b.id} style={{animationDelay:`${i*45}ms`}}>
          <div className="image-wrap"><img src="/burger.png" alt={b.name}/><span className="badge">{b.badge}</span></div>
          <div className="card-body"><div className="title-row"><h2>{b.name}</h2><span>${b.price}</span></div><p>{b.desc}</p><span className="details">View details <ArrowUpRight size={14}/></span></div>
        </a>)}
      </div>
      {!visible.length && <div className="empty">No burgers match that search.</div>}
    </section>
  </>;
}

function BurgerDetail({id}){
  const b=burgers.find(x=>x.id===id)||burgers[0];
  return <section className="detail-page">
    <a className="back" href="#/"><ArrowLeft size={17}/> Back to burgers</a>
    <div className="detail-grid">
      <div><div className="detail-photo"><img src="/burger.png" alt={b.name}/></div><div className="thumbs">{[1,2,3,4].map(n=><button key={n}><img src="/burger.png" alt=""/></button>)}</div></div>
      <article className="detail-copy"><p className="kicker">{b.badge}</p><h1>{b.name}</h1><div className="detail-price">${b.price}</div><p className="detail-desc">{b.desc}</p><div className="ingredients"><h3>What’s inside</h3>{b.ingredients.map(x=><div key={x}><span>✦</span>{x}</div>)}</div><a className="order-button detail-button" href="#/">Choose another burger</a></article>
    </div>
  </section>;
}

function Story(){ return <section className="content-page"><PageHero kicker="The AJ way" title="Our story" lede="Big flavour, built from the ground up."/><div className="story-grid"><aside><span>01</span><Flame/><p>Made fresh.<br/>Served loud.</p></aside><article><p className="lead">AJ Burger started with a simple idea: make the kind of burger you crave before you even see the menu.</p><p>Every stack is smashed fresh, layered with bold toppings, and served without the fuss. We keep the process direct: good ingredients, a hot grill, a soft bun, and enough texture in every bite to make the napkins worth it.</p><a className="text-link" href="#/">See the menu <ArrowUpRight size={14}/></a></article></div></section> }

function Quality(){ return <section className="content-page"><PageHero kicker="No shortcuts" title="Quality first" lede="Good burgers begin with ingredients you can stand behind."/><div className="quality-grid">{[["01","Fresh ingredients","Fresh, carefully selected ingredients across the menu."],["02","Hot grill","Smashed and seared for the crust and texture AJ Burger is built around."],["03","Made to order","Each stack is prepared for the order and served hot."]].map(([n,t,d])=><article key={n}><span className="number">{n}</span><Flame/><h2>{t}</h2><p>{d}</p></article>)}</div></section> }

function Contact(){ return <section className="content-page"><PageHero kicker="Talk to us" title="Contact" lede="Questions, feedback or a serious burger craving?"/><div className="contact-grid"><a href="mailto:ajburgers21@gmail.com"><Mail/><div><small>Email</small><strong>ajburgers21@gmail.com</strong></div></a><div><MapPin/><div><small>Location</small><strong>Sefton, NSW</strong></div></div><a href="https://www.instagram.com/ajburgers_/" target="_blank" rel="noreferrer"><Instagram/><div><small>Instagram</small><strong>@ajburgers_</strong></div></a></div></section> }

function PageHero({kicker,title,lede}){ return <div className="page-hero"><p>{kicker}</p><h1>{title}</h1><span>{lede}</span></div> }

function Footer({onOrder}){ return <footer><Flame/><p><b>Fresh ingredients.</b> Bold flavours. True satisfaction.</p><div><a href="#/story">Our story</a><a href="#/quality">Quality</a><a href="#/contact">Contact</a><button onClick={onOrder}>Order online <ArrowUpRight size={13}/></button></div></footer> }

function OrderModal({onClose}){ return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose}><X/></button><Flame className="modal-flame"/><p className="kicker">Choose your counter</p><h2>Order AJ Burger</h2><p>Pick your delivery partner and we’ll send you straight to the menu.</p>{orderLinks.map(([label,url])=><a className="provider" href={url} target="_blank" rel="noreferrer" key={label}><span><b>{label}</b><small>Delivery & pickup</small></span><ChevronRight/></a>)}</div></div> }

createRoot(document.getElementById("root")).render(<App/>);

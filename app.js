const DB_KEY = "humaira_collection_db_v1";
const CART_KEY = "humaira_collection_cart_v1";

const fallbackProducts = [
  {id:"p001",name:"Premium Ladies Kurti",sku:"HC-KUR-001",category:"Women",mrp:1500,price:1200,stock:15,image:"",featured:true,newArrival:true,flashSale:true,preorder:false,active:true},
  {id:"p002",name:"Elegant Hand Bag",sku:"HC-BAG-001",category:"Bags",mrp:1200,price:950,stock:8,image:"",featured:true,newArrival:false,flashSale:true,preorder:false,active:true},
  {id:"p003",name:"Classic Fashion Shoes",sku:"HC-SHO-001",category:"Shoes",mrp:2200,price:1690,stock:12,image:"",featured:true,newArrival:true,flashSale:false,preorder:false,active:true},
  {id:"p004",name:"Luxury Beauty Set",sku:"HC-BEA-001",category:"Beauty",mrp:1800,price:1350,stock:5,image:"",featured:true,newArrival:true,flashSale:true,preorder:false,active:true},
  {id:"p005",name:"Premium Jewellery Set",sku:"HC-JWL-001",category:"Jewellery",mrp:2500,price:1990,stock:7,image:"",featured:false,newArrival:true,flashSale:false,preorder:false,active:true},
  {id:"p006",name:"Silk Fashion Scarf",sku:"HC-SCF-001",category:"Accessories",mrp:900,price:690,stock:20,image:"",featured:false,newArrival:false,flashSale:false,preorder:false,active:true},
  {id:"p007",name:"Designer Dress",sku:"HC-DRS-001",category:"Women",mrp:3200,price:2490,stock:9,image:"",featured:true,newArrival:true,flashSale:true,preorder:false,active:true},
  {id:"p008",name:"Pre-order Premium Gown",sku:"HC-GWN-001",category:"Women",mrp:4500,price:3690,stock:0,image:"",featured:true,newArrival:true,flashSale:false,preorder:true,active:true}
];

const categories = [
  ["Women","👗"],["Bags","👜"],["Shoes","👠"],["Beauty","💄"],["Jewellery","💍"],["Accessories","🧣"]
];

function db(){
  try{
    const saved = JSON.parse(localStorage.getItem(DB_KEY));
    if(saved?.products) return saved;
  }catch(e){}
  const data = {products:fallbackProducts, orders:[]};
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  return data;
}
function saveDB(data){localStorage.setItem(DB_KEY, JSON.stringify(data))}
function cart(){try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return []}}
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c)); renderCart()}
function money(n){return "৳"+Number(n||0).toLocaleString("en-BD")}
function discount(p){return p.mrp>0?Math.round((p.mrp-p.price)/p.mrp*100):0}
function toast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}

function productCard(p){
  const tag=p.preorder?"PRE-ORDER":p.flashSale?"⚡ FLASH SALE":discount(p)+"% OFF";
  const visual=p.image?`<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">`:`<span>${iconFor(p.category)}</span>`;
  const unavailable=!p.preorder && p.stock<=0;
  return `<article class="product">
    <div class="product-img">${visual}<span class="tag">${tag}</span><button class="wish" data-wish="${p.id}">♡</button></div>
    <div class="product-info">
      <div class="product-title">${escapeHtml(p.name)}</div>
      <div class="price"><strong>${money(p.price)}</strong><span class="mrp">${money(p.mrp)}</span><span class="discount">${discount(p)}% OFF</span></div>
      <div class="product-foot"><span class="stock">${p.preorder?"Pre-order available":unavailable?"Out of Stock":p.stock+" in stock"}</span><button class="add" ${unavailable?"disabled":""} data-add="${p.id}">${p.preorder?"Pre-order":"Add to Cart"}</button></div>
    </div>
  </article>`;
}
function iconFor(c){return ({Women:"👗",Bags:"👜",Shoes:"👠",Beauty:"💄",Jewellery:"💍",Accessories:"🧣"})[c]||"🛍️"}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function renderProducts(list,id){
  const el=document.getElementById(id);if(!el)return;
  el.innerHTML=list.length?list.map(productCard).join(""):"<p>No products found.</p>";
}
function renderCategories(){
  const el=document.getElementById("categoryGrid");if(!el)return;
  el.innerHTML=categories.map(([n,i])=>`<button class="category" data-category="${n}"><div class="cat-icon">${i}</div><strong>${n}</strong></button>`).join("");
}

function renderCart(){
  const items=cart(), data=db(), box=document.getElementById("cartItems");
  if(!box)return;
  document.getElementById("cartCount").textContent=items.reduce((a,b)=>a+b.qty,0);
  box.innerHTML=items.length?items.map(i=>{
    const p=data.products.find(x=>x.id===i.id); if(!p)return "";
    return `<div class="cart-item"><div class="thumb">${iconFor(p.category)}</div><div style="flex:1"><strong>${escapeHtml(p.name)}</strong><div>${money(p.price)} × ${i.qty}</div><div class="qty"><button data-dec="${p.id}">−</button><span>${i.qty}</span><button data-inc="${p.id}">+</button><button data-remove="${p.id}">🗑</button></div></div></div>`;
  }).join(""):"<p>Your cart is empty.</p>";
  const subtotal=items.reduce((sum,i)=>{const p=data.products.find(x=>x.id===i.id);return sum+(p?p.price*i.qty:0)},0);
  document.getElementById("cartSubtotal").textContent=money(subtotal);
  document.getElementById("cartTotal").textContent=money(subtotal+(items.length?80:0));
}

function addToCart(id){
  const data=db(),p=data.products.find(x=>x.id===id);if(!p)return;
  const c=cart(), found=c.find(x=>x.id===id);
  if(found)found.qty++;else c.push({id,qty:1});
  saveCart(c);toast(p.name+" added to cart");
}
function changeQty(id,delta){
  const c=cart(),item=c.find(x=>x.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)saveCart(c.filter(x=>x.id!==id));else saveCart(c);
}
function removeCart(id){saveCart(cart().filter(x=>x.id!==id))}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("drawerBackdrop").classList.remove("hidden");renderCart()}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("drawerBackdrop").classList.add("hidden")}

document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");if(add){addToCart(add.dataset.add);return}
  const inc=e.target.closest("[data-inc]");if(inc){changeQty(inc.dataset.inc,1);return}
  const dec=e.target.closest("[data-dec]");if(dec){changeQty(dec.dataset.dec,-1);return}
  const rem=e.target.closest("[data-remove]");if(rem){removeCart(rem.dataset.remove);return}
  const cat=e.target.closest("[data-category]");if(cat){
    const list=db().products.filter(p=>p.active&&p.category===cat.dataset.category);
    renderProducts(list,"productGrid");document.getElementById("resultInfo").textContent=list.length+" products";
    location.hash="products";
  }
  const wish=e.target.closest("[data-wish]");if(wish)toast("Added to wishlist");
});

document.addEventListener("DOMContentLoaded",()=>{
  renderCategories();
  const active=db().products.filter(p=>p.active);
  renderProducts(active.filter(p=>p.featured),"productGrid");
  renderProducts(active.filter(p=>p.flashSale),"flashGrid");
  renderProducts(active.filter(p=>p.preorder),"preorderGrid");
  document.getElementById("offerGrid").innerHTML=`<div class="offer"><h3>Up to 50% OFF</h3><p>Limited-time fashion deals.</p><a class="btn" href="#products">Shop Sale</a></div><div class="offer dark"><h3>Pre-order Collection</h3><p>Reserve upcoming products before arrival.</p><a class="btn" href="#preorder">Pre-order Now</a></div>`;
  document.getElementById("searchInput").addEventListener("input",e=>{
    const q=e.target.value.toLowerCase().trim();
    const list=active.filter(p=>p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q));
    renderProducts(list,"productGrid");document.getElementById("resultInfo").textContent=q?list.length+" products":"";
  });
  document.getElementById("cartBtn").onclick=openCart;
  document.getElementById("closeCart").onclick=closeCart;
  document.getElementById("drawerBackdrop").onclick=closeCart;
  document.getElementById("wishlistBtn").onclick=()=>toast("Wishlist opened");
  document.getElementById("profileBtn").onclick=()=>toast("Login/Register is backend-ready");
  document.getElementById("checkoutBtn").onclick=()=>toast("Connect checkout API/payment gateway for production");
  renderCart();
});

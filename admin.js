const DB_KEY="humaira_collection_db_v1";
const fallbackOrders=[
 {id:"HC-2026-00025",customer:"Rahim Ahmed",total:3450,payment:"COD",paymentStatus:"Pending",status:"Pending"},
 {id:"HC-2026-00024",customer:"Sumaiya Akter",total:2800,payment:"Online",paymentStatus:"Paid",status:"Processing"},
 {id:"HC-2026-00023",customer:"Karim Hasan",total:1950,payment:"COD",paymentStatus:"Pending",status:"Shipped"}
];
function getDB(){try{const d=JSON.parse(localStorage.getItem(DB_KEY));if(d?.products)return d}catch(e){}return {products:[],orders:[]}}
function saveDB(d){localStorage.setItem(DB_KEY,JSON.stringify(d))}
function money(n){return "৳"+Number(n||0).toLocaleString("en-BD")}
function disc(m,p){return m?Math.round((m-p)/m*100):0}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function icon(c){return ({Women:"👗",Bags:"👜",Shoes:"👠",Beauty:"💄",Jewellery:"💍",Accessories:"🧣"})[c]||"🛍️"}

function render(){
 const d=getDB(), products=d.products||[];
 document.getElementById("statProducts").textContent=products.length;
 document.getElementById("statActive").textContent=products.filter(p=>p.active).length;
 const orders=d.orders?.length?d.orders:fallbackOrders;
 document.getElementById("statOrders").textContent=orders.length;
 document.getElementById("statSales").textContent=money(orders.reduce((a,o)=>a+Number(o.total||0),0));
 renderProducts(products);renderOrders(orders);
}
function renderProducts(products){
 const q=(document.getElementById("adminSearch").value||"").toLowerCase();
 const list=products.filter(p=>(p.name+" "+p.sku+" "+p.category).toLowerCase().includes(q));
 document.getElementById("adminProductTable").innerHTML=list.map(p=>`
 <tr><td><strong>${icon(p.category)} ${esc(p.name)}</strong><br><small>${esc(p.sku)}</small></td>
 <td>${esc(p.category)}</td><td>${money(p.price)} <small>${disc(p.mrp,p.price)}% off</small></td>
 <td>${p.preorder?"Pre-order":p.stock}</td><td><span class="status">${p.active?"Active":"Inactive"}</span></td>
 <td><button class="action" data-edit="${p.id}">✏️</button><button class="action" data-delete="${p.id}">🗑️</button></td></tr>`).join("");
}
function renderOrders(orders){
 document.getElementById("orderTable").innerHTML=orders.map(o=>`<tr><td><strong>${o.id}</strong></td><td>${esc(o.customer)}</td><td>${money(o.total)}</td><td>${o.payment}</td><td><span class="status">${o.status}</span></td></tr>`).join("");
}
function openModal(product){
 document.getElementById("productModal").classList.remove("hidden");
 document.getElementById("modalTitle").textContent=product?"Edit Product":"Add Product";
 document.getElementById("productId").value=product?.id||"";
 document.getElementById("name").value=product?.name||"";
 document.getElementById("sku").value=product?.sku||"";
 document.getElementById("category").innerHTML=["Women","Bags","Shoes","Beauty","Jewellery","Accessories"].map(x=>`<option ${x===product?.category?"selected":""}>${x}</option>`).join("");
 document.getElementById("mrp").value=product?.mrp??"";
 document.getElementById("price").value=product?.price??"";
 document.getElementById("stock").value=product?.stock??0;
 document.getElementById("image").value=product?.image||"";
 document.getElementById("arrival").value=product?.arrival||"";
 document.getElementById("description").value=product?.description||"";
 ["featured","newArrival","flashSale","preorder","active"].forEach(id=>document.getElementById(id).checked=product?!!product[id]:(id==="active"));
 updateDiscount();
}
function closeModal(){document.getElementById("productModal").classList.add("hidden")}
function updateDiscount(){
 const m=Number(document.getElementById("mrp").value),p=Number(document.getElementById("price").value);
 document.getElementById("discountPreview").textContent=`Discount: ${disc(m,p)}%`;
}
document.addEventListener("DOMContentLoaded",()=>{
 render();
 document.getElementById("addProductBtn").onclick=()=>openModal();
 document.getElementById("closeModal").onclick=closeModal;
 ["mrp","price"].forEach(id=>document.getElementById(id).addEventListener("input",updateDiscount));
 document.getElementById("adminSearch").addEventListener("input",render);
 document.getElementById("productForm").addEventListener("submit",e=>{
   e.preventDefault();
   const d=getDB(), id=document.getElementById("productId").value||"p"+Date.now();
   const mrp=Number(document.getElementById("mrp").value),price=Number(document.getElementById("price").value);
   if(price>mrp){alert("Selling Price cannot be greater than MRP.");return}
   const p={id,name:document.getElementById("name").value.trim(),sku:document.getElementById("sku").value.trim(),category:document.getElementById("category").value,mrp,price,stock:Number(document.getElementById("stock").value),image:document.getElementById("image").value.trim(),arrival:document.getElementById("arrival").value,description:document.getElementById("description").value,featured:document.getElementById("featured").checked,newArrival:document.getElementById("newArrival").checked,flashSale:document.getElementById("flashSale").checked,preorder:document.getElementById("preorder").checked,active:document.getElementById("active").checked};
   const idx=d.products.findIndex(x=>x.id===id);if(idx>=0)d.products[idx]=p;else d.products.push(p);
   saveDB(d);closeModal();render();
 });
 document.addEventListener("click",e=>{
   const edit=e.target.closest("[data-edit]");if(edit){const p=getDB().products.find(x=>x.id===edit.dataset.edit);openModal(p)}
   const del=e.target.closest("[data-delete]");if(del){
     const d=getDB(),p=d.products.find(x=>x.id===del.dataset.delete);
     if(confirm(`Delete "${p?.name}"?`)){d.products=d.products.filter(x=>x.id!==del.dataset.delete);saveDB(d);render()}
   }
 });
});

// =====================================================
// DRAGON PALACE — Restaurant Chinois a Emporter
// Google Apps Script — Un seul fichier a deployer
// =====================================================

var CONFIG = {
  NOM: "Dragon Palace",
  SOUS_TITRE: "Cuisine Chinoise - A Emporter",
  TEL: "04 72 00 00 00",
  ADRESSE: "12 rue de la Paix, Lyon",
  MOT_DE_PASSE: "resto2026",
  COULEUR: "#c0392b",
  COULEUR2: "#f39c12"
};

var MENU = [
  { id:"ne1", cat:"Entrees",   nom:"Nems au porc (x3)",        prix:5.50,  emoji:"🥟" },
  { id:"ne2", cat:"Entrees",   nom:"Nems aux crevettes (x3)",  prix:6.00,  emoji:"🥟" },
  { id:"ne3", cat:"Entrees",   nom:"Raviolis vapeur (x6)",     prix:7.00,  emoji:"🥟" },
  { id:"ne4", cat:"Entrees",   nom:"Soupe wonton",             prix:6.50,  emoji:"🍜" },
  { id:"ne5", cat:"Entrees",   nom:"Soupe pekino ise",         prix:5.50,  emoji:"🍜" },
  { id:"ne6", cat:"Entrees",   nom:"Salade de concombre",      prix:4.50,  emoji:"🥗" },
  { id:"pc1", cat:"Poulet",    nom:"Poulet aigre-doux",        prix:10.50, emoji:"🍗" },
  { id:"pc2", cat:"Poulet",    nom:"Poulet general Tao",       prix:11.00, emoji:"🍗" },
  { id:"pc3", cat:"Poulet",    nom:"Poulet au citron",         prix:10.50, emoji:"🍗" },
  { id:"pc4", cat:"Poulet",    nom:"Poulet kung pao",          prix:11.50, emoji:"🌶️" },
  { id:"pc5", cat:"Poulet",    nom:"Poulet saute aux legumes", prix:10.00, emoji:"🥦" },
  { id:"bo1", cat:"Boeuf",     nom:"Boeuf aux oignons",        prix:12.50, emoji:"🥩" },
  { id:"bo2", cat:"Boeuf",     nom:"Boeuf a la citronnelle",   prix:13.00, emoji:"🥩" },
  { id:"bo3", cat:"Boeuf",     nom:"Boeuf au brocoli",         prix:12.50, emoji:"🥦" },
  { id:"bo4", cat:"Boeuf",     nom:"Boeuf mongolien",          prix:13.50, emoji:"🥩" },
  { id:"po1", cat:"Porc",      nom:"Porc laque",               prix:12.00, emoji:"🐷" },
  { id:"po2", cat:"Porc",      nom:"Porc au caramel",          prix:11.50, emoji:"🍬" },
  { id:"po3", cat:"Porc",      nom:"Travers de porc (x4)",     prix:13.00, emoji:"🍖" },
  { id:"me1", cat:"Mer",       nom:"Crevettes vapeur",         prix:14.50, emoji:"🦐" },
  { id:"me2", cat:"Mer",       nom:"Crevettes sautees epicees",prix:15.00, emoji:"🌶️" },
  { id:"me3", cat:"Mer",       nom:"Saumon teriyaki",          prix:15.50, emoji:"🐟" },
  { id:"me4", cat:"Mer",       nom:"Calamars sautes",          prix:13.50, emoji:"🦑" },
  { id:"ve1", cat:"Vege",      nom:"Tofu mapo",                prix:9.50,  emoji:"🌱" },
  { id:"ve2", cat:"Vege",      nom:"Legumes sautes wok",       prix:9.00,  emoji:"🥦" },
  { id:"ve3", cat:"Vege",      nom:"Aubergines a l ail",       prix:9.50,  emoji:"🍆" },
  { id:"rn1", cat:"Riz",       nom:"Riz blanc",                prix:2.50,  emoji:"🍚" },
  { id:"rn2", cat:"Riz",       nom:"Riz cantonais",            prix:4.50,  emoji:"🍳" },
  { id:"rn3", cat:"Riz",       nom:"Riz frit poulet",          prix:8.50,  emoji:"🍗" },
  { id:"rn4", cat:"Riz",       nom:"Nouilles sautees legumes", prix:8.00,  emoji:"🍜" },
  { id:"rn5", cat:"Riz",       nom:"Nouilles sautees poulet",  prix:9.50,  emoji:"🍜" },
  { id:"de1", cat:"Desserts",  nom:"Beignets bananes",         prix:5.50,  emoji:"🍌" },
  { id:"de2", cat:"Desserts",  nom:"Beignets pommes",          prix:5.50,  emoji:"🍎" },
  { id:"de3", cat:"Desserts",  nom:"Glace au sesame",          prix:4.50,  emoji:"🍨" },
  { id:"de4", cat:"Desserts",  nom:"Creme de mangue",          prix:5.00,  emoji:"🥭" },
  { id:"de5", cat:"Desserts",  nom:"Fortune cookies (x3)",     prix:3.00,  emoji:"🥠" },
  { id:"bv1", cat:"Boissons",  nom:"The au jasmin",            prix:2.50,  emoji:"🍵" },
  { id:"bv2", cat:"Boissons",  nom:"The vert glace",           prix:3.00,  emoji:"🧋" },
  { id:"bv3", cat:"Boissons",  nom:"Bubble tea taro",          prix:5.00,  emoji:"🧋" },
  { id:"bv4", cat:"Boissons",  nom:"Coca-Cola",                prix:2.50,  emoji:"🥤" },
  { id:"bv5", cat:"Boissons",  nom:"Eau minerale",             prix:1.50,  emoji:"💧" }
];

// =====================================================
// POINT ENTREE
// =====================================================

function doGet(e) {
  var action = (e.parameter.action || "menu");
  if (action === "commande") return passerCommande(e);
  if (action === "cuisine") return showCuisine(e);
  if (action === "majstatut") return majStatut(e);
  if (action === "admin") return showAdmin(e);
  if (action === "data_commandes") return dataCommandes(e);
  return showMenu(e);
}

// =====================================================
// INIT SHEETS
// =====================================================

function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("Commandes")) {
    var ws = ss.insertSheet("Commandes");
    ws.getRange(1,1,1,8).setValues([["ID","Heure","Client","Articles","Total EUR","Statut","Date","Notes"]]);
    ws.getRange(1,1,1,8).setFontWeight("bold").setBackground("#c0392b").setFontColor("#ffffff");
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Commandes");
  if (!ws) { initSheets(); ws = ss.getSheetByName("Commandes"); }
  return ws;
}

function genId() {
  return Math.floor(Math.random() * 900) + 100;
}

// =====================================================
// PASSER UNE COMMANDE
// =====================================================

function passerCommande(e) {
  var client = e.parameter.client || "Client";
  var itemsStr = e.parameter.items || "";
  var total = parseFloat(e.parameter.total || "0");

  var ws = getSheet();
  var id = genId();
  var heure = Utilities.formatDate(new Date(), "Europe/Paris", "HH:mm");
  var date = Utilities.formatDate(new Date(), "Europe/Paris", "dd/MM/yyyy");

  ws.appendRow([id, heure, client, itemsStr, total, "En attente", date, ""]);

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0d0705;color:#fdf6ec;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}";
  html += ".box{text-align:center;max-width:360px;width:100%}.big{font-size:72px;margin-bottom:16px}.num{font-size:56px;font-weight:900;color:#f39c12;margin-bottom:8px}.nom{font-size:20px;font-weight:700;margin-bottom:8px}.msg{font-size:14px;color:rgba(253,246,236,0.5);margin-bottom:32px;line-height:1.5}";
  html += ".btn{display:block;width:100%;padding:15px;border-radius:14px;border:none;background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;font-size:16px;font-weight:800;cursor:pointer;text-decoration:none;text-align:center}</style></head>";
  html += "<body><div class='box'><div class='big'>🥡</div><div class='num'>N° " + String(id).padStart(3,"0") + "</div>";
  html += "<div class='nom'>" + client + "</div>";
  html += "<div class='msg'>Votre commande est en preparation.<br>Merci de votre confiance !</div>";
  var url = ScriptApp.getService().getUrl();
  html += "<a class='btn' href='" + url + "'>Nouvelle commande</a></div></body></html>";

  return HtmlService.createHtmlOutput(html).setTitle("Commande confirmee").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PAGE MENU CLIENT
// =====================================================

function showMenu(e) {
  var url = ScriptApp.getService().getUrl();
  var cats = [];
  MENU.forEach(function(p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });

  var menuJson = JSON.stringify(MENU);
  var configJson = JSON.stringify(CONFIG);

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1'>";
  html += "<title>🏮 " + CONFIG.NOM + "</title>";
  html += "<link href='https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap' rel='stylesheet'>";
  html += "<style>";
  html += "*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}";
  html += "body{font-family:'Nunito',sans-serif;background:#0d0705;color:#fdf6ec;height:100vh;overflow:hidden;display:flex;flex-direction:column}";
  html += "#header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(30,15,10,0.97);border-bottom:1px solid rgba(243,156,18,0.15);flex-shrink:0}";
  html += ".h-titre{font-size:17px;font-weight:800;color:#f39c12}";
  html += "#btn-panier{position:relative;width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center}";
  html += "#badge{position:absolute;top:-2px;right:-2px;background:#f39c12;color:#0d0705;border-radius:50%;width:18px;height:18px;font-size:11px;font-weight:900;display:none;align-items:center;justify-content:center}";
  html += "#cats{display:flex;gap:8px;padding:10px 16px;overflow-x:auto;flex-shrink:0;border-bottom:1px solid rgba(243,156,18,0.1)}";
  html += ".cat-btn{padding:7px 14px;border-radius:20px;border:1px solid rgba(243,156,18,0.2);background:transparent;color:rgba(253,246,236,0.55);font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all 0.15s}";
  html += ".cat-btn.actif{background:linear-gradient(135deg,#c0392b,#e74c3c);border-color:#e74c3c;color:#fff}";
  html += "#liste{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px}";
  html += ".plat{display:flex;align-items:center;gap:12px;background:rgba(30,15,10,0.85);border:1px solid rgba(243,156,18,0.1);border-radius:14px;padding:12px 14px}";
  html += ".p-emoji{font-size:32px;flex-shrink:0}";
  html += ".p-info{flex:1;min-width:0}";
  html += ".p-nom{font-size:15px;font-weight:700;margin-bottom:4px}";
  html += ".p-prix{font-size:15px;font-weight:800;color:#f39c12}";
  html += ".btn-add{width:36px;height:36px;border-radius:50%;border:none;background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;font-size:22px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700}";
  html += ".qte-ctrl{display:flex;align-items:center;gap:6px;flex-shrink:0}";
  html += ".btn-qte{width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(243,156,18,0.4);background:transparent;color:#f39c12;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:inherit}";
  html += ".qte-n{font-size:16px;font-weight:800;min-width:20px;text-align:center}";
  html += "#footer{padding:12px 16px;background:rgba(13,7,5,0.97);border-top:1px solid rgba(243,156,18,0.15);flex-shrink:0;display:none}";
  html += "#footer-total{display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px;color:rgba(253,246,236,0.7)}";
  html += "#footer-prix{font-size:20px;font-weight:900;color:#f39c12}";
  html += ".btn-rouge{width:100%;padding:15px;border-radius:14px;border:none;background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit}";
  html += "#ecran-panier{display:none;flex-direction:column;height:100vh;background:#0d0705}";
  html += "#ecran-nom{display:none;flex-direction:column;height:100vh;background:#0d0705;align-items:center;justify-content:center;padding:24px}";
  html += ".nom-box{text-align:center;width:100%;max-width:380px}";
  html += ".nom-titre{font-size:26px;font-weight:900;margin-bottom:8px}";
  html += ".nom-sous{font-size:14px;color:rgba(253,246,236,0.45);margin-bottom:28px}";
  html += "#input-nom{width:100%;padding:16px;border-radius:14px;border:2px solid rgba(243,156,18,0.3);background:rgba(30,15,10,0.9);color:#fdf6ec;font-size:18px;font-weight:700;font-family:inherit;outline:none;margin-bottom:20px;text-align:center}";
  html += ".pan-item{display:flex;align-items:center;gap:12px;background:rgba(30,15,10,0.85);border:1px solid rgba(243,156,18,0.1);border-radius:14px;padding:12px 14px}";
  html += ".pan-info{flex:1}.pan-nom{font-size:14px;font-weight:700;margin-bottom:2px}.pan-prix{font-size:15px;font-weight:800;color:#f39c12}";
  html += ".empty{text-align:center;color:rgba(253,246,236,0.3);font-size:16px;margin-top:60px}";
  html += "::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(243,156,18,0.2);border-radius:2px}";
  html += "</style></head><body>";

  // ECRAN MENU
  html += "<div id='ecran-menu' style='display:flex;flex-direction:column;height:100vh'>";
  html += "<div id='header'><div class='h-titre'>🏮 " + CONFIG.NOM + "</div>";
  html += "<button id='btn-panier' onclick='voirPanier()'>🛒<span id='badge'></span></button></div>";
  html += "<div id='cats'>";
  cats.forEach(function(cat) {
    html += "<button class='cat-btn' onclick='filtrer(this,\"" + cat + "\")'>" + cat + "</button>";
  });
  html += "</div><div id='liste'></div>";
  html += "<div id='footer'><div id='footer-total'><span id='footer-items'>0 article</span><span id='footer-prix'>0.00 EUR</span></div>";
  html += "<button class='btn-rouge' onclick='voirPanier()'>Voir le panier</button></div></div>";

  // ECRAN PANIER
  html += "<div id='ecran-panier'>";
  html += "<div id='header'><button style='font-size:14px;color:rgba(253,246,236,0.6);background:none;border:none;cursor:pointer;padding:4px 8px' onclick='retourMenu()'>← Menu</button>";
  html += "<div class='h-titre'>🛒 Mon Panier</div><div style='width:60px'></div></div>";
  html += "<div id='liste-panier' style='flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px'></div>";
  html += "<div style='padding:12px 16px;background:rgba(13,7,5,0.97);border-top:1px solid rgba(243,156,18,0.15)'>";
  html += "<div style='display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px;color:rgba(253,246,236,0.7)'><span>Total</span><span id='pan-total' style='font-size:20px;font-weight:900;color:#f39c12'>0.00 EUR</span></div>";
  html += "<button class='btn-rouge' onclick='allerNom()'>Continuer →</button></div></div>";

  // ECRAN NOM
  html += "<div id='ecran-nom'><div class='nom-box'>";
  html += "<div style='font-size:48px;margin-bottom:16px'>📝</div>";
  html += "<div class='nom-titre'>Votre prenom</div>";
  html += "<div class='nom-sous'>Pour appeler votre commande</div>";
  html += "<input id='input-nom' type='text' placeholder='Ex: Marie, Thomas...' />";
  html += "<button class='btn-rouge' onclick='validerCommande()' id='btn-valider'>Valider la commande</button>";
  html += "</div></div>";

  // JAVASCRIPT
  html += "<script>";
  html += "var MENU=" + menuJson + ";";
  html += "var catActive=null;";
  html += "var panier={};";

  html += "function init(){";
  html += "  var cats=document.querySelectorAll('.cat-btn');";
  html += "  if(cats.length>0){cats[0].click();}";
  html += "}";

  html += "function filtrer(btn,cat){";
  html += "  catActive=cat;";
  html += "  document.querySelectorAll('.cat-btn').forEach(function(b){b.classList.remove('actif');});";
  html += "  btn.classList.add('actif');";
  html += "  afficherPlats(cat);";
  html += "}";

  html += "function afficherPlats(cat){";
  html += "  var liste=document.getElementById('liste');";
  html += "  var html='';";
  html += "  var plats=MENU.filter(function(p){return p.cat===cat;});";
  html += "  plats.forEach(function(p){";
  html += "    var q=panier[p.id]?panier[p.id].qte:0;";
  html += "    html+='<div class=\"plat\">';";
  html += "    html+='<div class=\"p-emoji\">'+p.emoji+'</div>';";
  html += "    html+='<div class=\"p-info\"><div class=\"p-nom\">'+p.nom+'</div><div class=\"p-prix\">'+p.prix.toFixed(2)+' EUR</div></div>';";
  html += "    if(q>0){";
  html += "      html+='<div class=\"qte-ctrl\">';";
  html += "      html+='<button class=\"btn-qte\" onclick=\"modQte(\\'' + p.id + '\\',-1)\">−</button>';";
  html += "      html+='<span class=\"qte-n\">'+q+'</span>';";
  html += "      html+='<button class=\"btn-qte\" onclick=\"modQte(\\'' + p.id + '\\',1)\">+</button>';";
  html += "      html+='</div>';";
  html += "    } else {";
  html += "      html+='<button class=\"btn-add\" onclick=\"ajouterAuPanier(\\'' + p.id + '\\')\" >+</button>';";
  html += "    }";
  html += "    html+='</div>';";
  html += "  });";
  html += "  liste.innerHTML=html||'<div class=\"empty\">Aucun plat dans cette categorie</div>';";
  html += "}";

  html += "function ajouterAuPanier(id){";
  html += "  var p=MENU.find(function(x){return x.id===id;});";
  html += "  if(!p)return;";
  html += "  if(panier[id]){panier[id].qte++;}else{panier[id]={nom:p.nom,prix:p.prix,emoji:p.emoji,qte:1};}";
  html += "  majFooter();afficherPlats(catActive);";
  html += "}";

  html += "function modQte(id,delta){";
  html += "  if(!panier[id])return;";
  html += "  panier[id].qte+=delta;";
  html += "  if(panier[id].qte<=0)delete panier[id];";
  html += "  majFooter();afficherPlats(catActive);";
  html += "}";

  html += "function majFooter(){";
  html += "  var total=0;var nb=0;";
  html += "  Object.values(panier).forEach(function(i){total+=i.prix*i.qte;nb+=i.qte;});";
  html += "  document.getElementById('footer-items').textContent=nb+' article'+(nb>1?'s':'');";
  html += "  document.getElementById('footer-prix').textContent=total.toFixed(2)+' EUR';";
  html += "  document.getElementById('footer').style.display=nb>0?'block':'none';";
  html += "  var badge=document.getElementById('badge');";
  html += "  if(nb>0){badge.style.display='flex';badge.textContent=nb;}else{badge.style.display='none';}";
  html += "}";

  html += "function voirPanier(){";
  html += "  document.getElementById('ecran-menu').style.display='none';";
  html += "  document.getElementById('ecran-panier').style.display='flex';";
  html += "  afficherListePanier();";
  html += "}";

  html += "function afficherListePanier(){";
  html += "  var div=document.getElementById('liste-panier');";
  html += "  var html='';var total=0;";
  html += "  Object.entries(panier).forEach(function(e){";
  html += "    var id=e[0];var i=e[1];";
  html += "    total+=i.prix*i.qte;";
  html += "    html+='<div class=\"pan-item\">';";
  html += "    html+='<div style=\"font-size:28px\">'+i.emoji+'</div>';";
  html += "    html+='<div class=\"pan-info\"><div class=\"pan-nom\">'+i.nom+'</div><div class=\"pan-prix\">'+(i.prix*i.qte).toFixed(2)+' EUR</div></div>';";
  html += "    html+='<div class=\"qte-ctrl\">';";
  html += "    html+='<button class=\"btn-qte\" onclick=\"modQtePan(\\'' + id + '\\',-1)\">−</button>';";
  html += "    html+='<span class=\"qte-n\">'+i.qte+'</span>';";
  html += "    html+='<button class=\"btn-qte\" onclick=\"modQtePan(\\'' + id + '\\',1)\">+</button>';";
  html += "    html+='</div></div>';";
  html += "  });";
  html += "  div.innerHTML=html||'<div class=\"empty\">Panier vide</div>';";
  html += "  document.getElementById('pan-total').textContent=total.toFixed(2)+' EUR';";
  html += "}";

  html += "function modQtePan(id,delta){modQte(id,delta);afficherListePanier();majFooter();}";

  html += "function retourMenu(){";
  html += "  document.getElementById('ecran-panier').style.display='none';";
  html += "  document.getElementById('ecran-menu').style.display='flex';";
  html += "}";

  html += "function allerNom(){";
  html += "  if(Object.keys(panier).length===0)return;";
  html += "  document.getElementById('ecran-panier').style.display='none';";
  html += "  document.getElementById('ecran-nom').style.display='flex';";
  html += "}";

  html += "function validerCommande(){";
  html += "  var nom=document.getElementById('input-nom').value.trim();";
  html += "  if(!nom)return;";
  html += "  var items=[];var total=0;";
  html += "  Object.entries(panier).forEach(function(e){";
  html += "    var i=e[1];";
  html += "    items.push(i.emoji+' '+i.nom+' x'+i.qte);";
  html += "    total+=i.prix*i.qte;";
  html += "  });";
  html += "  var url='" + url + "?action=commande&client='+encodeURIComponent(nom)+'&items='+encodeURIComponent(items.join(' | '))+'&total='+total.toFixed(2);";
  html += "  window.location.href=url;";
  html += "}";

  html += "window.onload=init;";
  html += "</script></body></html>";

  return HtmlService.createHtmlOutput(html).setTitle(CONFIG.NOM).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PAGE CUISINE
// =====================================================

function showCuisine(e) {
  var url = ScriptApp.getService().getUrl();
  var ws = getSheet();
  var data = ws.getDataRange().getValues();
  var commandes = [];
  for (var i = 1; i < data.length; i++) {
    commandes.push({
      id: data[i][0],
      heure: data[i][1],
      client: data[i][2],
      articles: data[i][3],
      total: data[i][4],
      statut: data[i][5],
      row: i + 1
    });
  }
  commandes.reverse();

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<title>Cuisine — " + CONFIG.NOM + "</title>";
  html += "<link href='https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap' rel='stylesheet'>";
  html += "<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Nunito',sans-serif;background:#0d0705;color:#fdf6ec;display:flex;flex-direction:column;height:100vh;overflow:hidden}";
  html += "#header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(30,15,10,0.97);border-bottom:1px solid rgba(243,156,18,0.15);flex-shrink:0}";
  html += ".h-titre{font-size:17px;font-weight:800;color:#f39c12}";
  html += ".btn-back{font-size:14px;color:rgba(253,246,236,0.6);background:none;border:none;cursor:pointer;padding:4px 8px;font-family:inherit}";
  html += "#scroll{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:12px}";
  html += ".cmd{border-radius:16px;border:1px solid;padding:14px 16px}";
  html += ".cmd-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}";
  html += ".cmd-num{font-size:18px;font-weight:900;color:#f39c12}";
  html += ".cmd-nom{flex:1;font-size:16px;font-weight:700}";
  html += ".cmd-badge{font-size:11px;font-weight:700;border:1px solid;border-radius:8px;padding:3px 10px}";
  html += ".cmd-heure{font-size:12px;color:rgba(253,246,236,0.4);margin-bottom:8px}";
  html += ".cmd-articles{font-size:13px;color:rgba(253,246,236,0.65);line-height:1.7;margin-bottom:12px}";
  html += ".btn-action{width:100%;padding:11px;border-radius:10px;border:1px solid;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;background:transparent}";
  html += ".empty{text-align:center;color:rgba(253,246,236,0.3);font-size:16px;margin-top:60px}";
  html += "::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(243,156,18,0.2);border-radius:2px}";
  html += "</style></head><body>";
  html += "<div id='header'><a href='" + url + "' class='btn-back'>← Menu</a><div class='h-titre'>🍳 Cuisine</div><div style='width:60px'></div></div>";
  html += "<div id='scroll'>";

  if (commandes.length === 0) {
    html += "<div class='empty'>Aucune commande pour l instant</div>";
  }

  commandes.forEach(function(cmd) {
    if (cmd.statut === "Livre") return;
    var col = cmd.statut === "En attente" ? "#e67e22" : cmd.statut === "En preparation" ? "#3498db" : "#27ae60";
    var prochainStatut = cmd.statut === "En attente" ? "En preparation" : cmd.statut === "En preparation" ? "Pret" : "Livre";
    var btnLabel = cmd.statut === "En attente" ? "Demarrer" : cmd.statut === "En preparation" ? "Marquer pret" : "Livre";
    html += "<div class='cmd' style='border-color:" + col + "40;background:" + col + "12'>";
    html += "<div class='cmd-top'><div class='cmd-num'>N deg " + String(cmd.id).padStart(3,"0") + "</div>";
    html += "<div class='cmd-nom'>" + cmd.client + "</div>";
    html += "<div class='cmd-badge' style='color:" + col + ";border-color:" + col + "50'>" + cmd.statut + "</div></div>";
    html += "<div class='cmd-heure'>" + cmd.heure + " · " + parseFloat(cmd.total).toFixed(2) + " EUR</div>";
    html += "<div class='cmd-articles'>" + (cmd.articles || "").split(" | ").join("<br>") + "</div>";
    html += "<a href='" + url + "?action=majstatut&row=" + cmd.row + "&statut=" + encodeURIComponent(prochainStatut) + "&from=cuisine' class='btn-action' style='color:" + col + ";border-color:" + col + "50;text-align:center;text-decoration:none;display:block'>▶ " + btnLabel + "</a>";
    html += "</div>";
  });

  html += "</div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle("Cuisine").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// MAJ STATUT
// =====================================================

function majStatut(e) {
  var row = parseInt(e.parameter.row);
  var statut = e.parameter.statut;
  var from = e.parameter.from || "cuisine";
  var ws = getSheet();
  ws.getRange(row, 6).setValue(statut);
  var url = ScriptApp.getService().getUrl();
  var redirect = from === "admin" ? url + "?action=admin&pwd=" + CONFIG.MOT_DE_PASSE : url + "?action=cuisine";
  var html = "<html><head><meta http-equiv='refresh' content='0;url=" + redirect + "'></head><body>Redirection...</body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PAGE ADMIN
// =====================================================

function showAdmin(e) {
  var pwd = e.parameter.pwd || "";
  var url = ScriptApp.getService().getUrl();

  if (pwd !== CONFIG.MOT_DE_PASSE) {
    var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
    html += "<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0d0705;color:#fdf6ec;display:flex;align-items:center;justify-content:center;height:100vh;padding:24px}";
    html += ".box{text-align:center;width:100%;max-width:340px}.titre{font-size:24px;font-weight:900;margin-bottom:8px}.sous{font-size:14px;color:rgba(253,246,236,0.45);margin-bottom:28px}";
    html += "input{width:100%;padding:14px;border-radius:12px;border:2px solid rgba(243,156,18,0.3);background:rgba(30,15,10,0.9);color:#fdf6ec;font-size:16px;text-align:center;margin-bottom:16px;outline:none}";
    html += ".btn{width:100%;padding:14px;border-radius:12px;border:none;background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;font-size:15px;font-weight:800;cursor:pointer}</style></head>";
    html += "<body><div class='box'><div style='font-size:48px;margin-bottom:16px'>🔒</div><div class='titre'>Espace Manager</div><div class='sous'>Entrez le mot de passe</div>";
    html += "<form method='GET' action='" + url + "'><input type='hidden' name='action' value='admin'><input type='password' name='pwd' placeholder='Mot de passe' autofocus /><button class='btn' type='submit'>Entrer →</button></form>";
    html += "</div></body></html>";
    return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  var ws = getSheet();
  var data = ws.getDataRange().getValues();
  var commandes = [];
  var totalCA = 0;
  var nbLivrees = 0;

  for (var i = 1; i < data.length; i++) {
    var cmd = { id:data[i][0], heure:data[i][1], client:data[i][2], articles:data[i][3], total:parseFloat(data[i][4])||0, statut:data[i][5], row:i+1 };
    commandes.push(cmd);
    if (cmd.statut === "Livre") { totalCA += cmd.total; nbLivrees++; }
  }
  commandes.reverse();

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<title>Manager — " + CONFIG.NOM + "</title>";
  html += "<link href='https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap' rel='stylesheet'>";
  html += "<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Nunito',sans-serif;background:#0d0705;color:#fdf6ec;display:flex;flex-direction:column;height:100vh;overflow:hidden}";
  html += "#header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(30,15,10,0.97);border-bottom:1px solid rgba(243,156,18,0.15);flex-shrink:0}";
  html += ".h-titre{font-size:17px;font-weight:800;color:#f39c12}";
  html += ".btn-back{font-size:14px;color:rgba(253,246,236,0.6);background:none;border:none;cursor:pointer;padding:4px 8px;text-decoration:none}";
  html += "#scroll{flex:1;overflow-y:auto;padding:14px 16px}";
  html += ".kpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}";
  html += ".kpi{background:rgba(30,15,10,0.9);border:1px solid rgba(243,156,18,0.12);border-radius:14px;padding:14px;text-align:center}";
  html += ".kpi-val{font-size:22px;font-weight:900;color:#f39c12;margin-bottom:4px}";
  html += ".kpi-label{font-size:11px;color:rgba(253,246,236,0.45);text-transform:uppercase;letter-spacing:0.05em}";
  html += ".section-titre{font-size:13px;font-weight:800;color:rgba(253,246,236,0.5);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;margin-top:18px}";
  html += ".cmd{background:rgba(30,15,10,0.85);border:1px solid rgba(243,156,18,0.1);border-radius:14px;padding:12px 14px;margin-bottom:10px}";
  html += ".cmd-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}";
  html += ".cmd-num{font-size:16px;font-weight:900;color:#f39c12}";
  html += ".cmd-nom{flex:1;font-size:15px;font-weight:700}";
  html += ".cmd-badge{font-size:11px;font-weight:700;border:1px solid;border-radius:8px;padding:2px 8px}";
  html += ".cmd-meta{font-size:12px;color:rgba(253,246,236,0.4);margin-bottom:6px}";
  html += ".cmd-articles{font-size:12px;color:rgba(253,246,236,0.55);line-height:1.6;margin-bottom:8px}";
  html += ".btn-action{display:inline-block;padding:7px 14px;border-radius:8px;border:1px solid;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;background:transparent;text-decoration:none;text-align:center}";
  html += ".empty{text-align:center;color:rgba(253,246,236,0.3);font-size:16px;margin-top:40px}";
  html += "::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(243,156,18,0.2);border-radius:2px}";
  html += "</style></head><body>";

  html += "<div id='header'><a href='" + url + "' class='btn-back'>← Menu</a><div class='h-titre'>📊 Manager</div><div style='width:60px'></div></div>";
  html += "<div id='scroll'>";

  var panier = nbLivrees > 0 ? totalCA / nbLivrees : 0;
  html += "<div class='kpi-grid'>";
  html += "<div class='kpi' style='grid-column:span 2'><div class='kpi-val'>" + totalCA.toFixed(2) + " EUR</div><div class='kpi-label'>Chiffre d affaires</div></div>";
  html += "<div class='kpi'><div class='kpi-val'>" + commandes.length + "</div><div class='kpi-label'>Commandes total</div></div>";
  html += "<div class='kpi'><div class='kpi-val' style='color:#27ae60'>" + nbLivrees + "</div><div class='kpi-label'>Livrees</div></div>";
  html += "<div class='kpi'><div class='kpi-val' style='color:#e67e22'>" + (commandes.length - nbLivrees) + "</div><div class='kpi-label'>En cours</div></div>";
  html += "<div class='kpi'><div class='kpi-val' style='color:#3498db'>" + panier.toFixed(2) + " EUR</div><div class='kpi-label'>Panier moyen</div></div>";
  html += "</div>";

  html += "<div class='section-titre'>Toutes les commandes</div>";

  if (commandes.length === 0) {
    html += "<div class='empty'>Aucune commande</div>";
  }

  commandes.forEach(function(cmd) {
    var colMap = { "En attente":"#e67e22", "En preparation":"#3498db", "Pret":"#27ae60", "Livre":"rgba(253,246,236,0.3)" };
    var col = colMap[cmd.statut] || "#e67e22";
    html += "<div class='cmd'><div class='cmd-top'>";
    html += "<div class='cmd-num'>N deg " + String(cmd.id).padStart(3,"0") + "</div>";
    html += "<div class='cmd-nom'>" + cmd.client + "</div>";
    html += "<div class='cmd-badge' style='color:" + col + ";border-color:" + col + "50'>" + cmd.statut + "</div></div>";
    html += "<div class='cmd-meta'>" + cmd.heure + " · " + cmd.total.toFixed(2) + " EUR</div>";
    html += "<div class='cmd-articles'>" + (cmd.articles || "").split(" | ").join("<br>") + "</div>";
    if (cmd.statut !== "Livre") {
      var prochainStatut = cmd.statut === "En attente" ? "En preparation" : cmd.statut === "En preparation" ? "Pret" : "Livre";
      var btnLabel = cmd.statut === "En attente" ? "Demarrer" : cmd.statut === "En preparation" ? "Pret !" : "Livre";
      html += "<a href='" + url + "?action=majstatut&row=" + cmd.row + "&statut=" + encodeURIComponent(prochainStatut) + "&from=admin&pwd=" + CONFIG.MOT_DE_PASSE + "' class='btn-action' style='color:" + col + ";border-color:" + col + "50'>" + btnLabel + "</a>";
    }
    html += "</div>";
  });

  html += "</div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle("Manager").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function dataCommandes(e) {
  var ws = getSheet();
  var data = ws.getDataRange().getValues();
  var commandes = [];
  for (var i = 1; i < data.length; i++) {
    commandes.push({ id:data[i][0], heure:data[i][1], client:data[i][2], articles:data[i][3], total:data[i][4], statut:data[i][5] });
  }
  return ContentService.createTextOutput(JSON.stringify(commandes)).setMimeType(ContentService.MimeType.JSON);
}

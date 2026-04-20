let nextId = 4;
  let modeEdition = false;

  let produits = [
    { id: 1, titre: 'Huile Extra Vierge 500ml', description: 'Pressée à froid, goût fruité et délicat avec des notes d\'amande douce.', prix: 45, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop' },
    { id: 2, titre: 'Huile Premium 1L',         description: 'Première pression, acidité < 0.3%, certifiée bio. Idéale pour cuisiner et assaisonner.', prix: 85, image: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=500&auto=format&fit=crop' },
    { id: 3, titre: 'Coffret Dégustation',      description: '3 bouteilles de variétés différentes : Picholine, Menara et Haouzia. Idéal cadeau.', prix: 120, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop' }
  ];

  let panier = [];

  function naviguer(page, lien) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
    document.getElementById('page-' + page).classList.add('active');
    if (lien) lien.classList.add('active')
    window.scrollTo(0, 0);
    if (page === 'produits') afficherProduits();
    return false;
  }

  function afficherProduits() {
    let liste = document.getElementById('liste-produits');
    liste.innerHTML = '';
    produits.forEach(function(p) {
      let carte = document.createElement('div');
      carte.className = 'produit-card';
      carte.innerHTML =
        '<div class="produit-img-wrap">' +
          '<img class="produit-img" src="' + p.image + '" alt="' + p.titre + '" onerror="this.src=\'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500\'"/>' +
        '</div>' +
        '<div class="produit-body">' +
          '<div class="produit-prix">' + p.prix + ' MAD</div>' +
          '<div class="produit-titre">' + p.titre + '</div>' +
          '<div class="produit-desc">' + p.description + '</div>' +
          '<div class="produit-actions">' +
            '<button class="btn-panier-add" onclick="ajouterAuPanier(' + p.id + ')">Ajouter au panier</button>' +
            '<button class="btn-edit" onclick="ouvrirModification(' + p.id + ')" title="Modifier">✎</button>' +
            '<button class="btn-del" onclick="supprimerProduit(' + p.id + ')" title="Supprimer">✕</button>' +
          '</div>' +
        '</div>';
      liste.appendChild(carte);
    });
  }

  function ajouterProduit(data) {
    data.id = nextId++;
    produits.push(data);
    afficherProduits();
  }

  function modifierProduit(id, nouvellesDonnees) {
    produits = produits.map(function(p) {
      return p.id === id ? Object.assign({}, p, nouvellesDonnees) : p;
    });
    afficherProduits();
  }

  function supprimerProduit(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    produits = produits.filter(function(p) { return p.id !== id; });
    afficherProduits();
  }

  function ouvrirFormulaire() {
    modeEdition = false;
    document.getElementById('edit-id').value = '';
    document.getElementById('form-produit').reset();
    document.getElementById('form-titre-label').textContent = 'Nouveau produit';
    document.getElementById('btn-submit-label').textContent = 'Ajouter';
    document.getElementById('form-wrapper').classList.add('visible');
    document.getElementById('form-wrapper').scrollIntoView({ behavior: 'smooth' });
  }

  function ouvrirModification(id) {
    let p = produits.find(function(x) { return x.id === id; });
    if (!p) return;
    modeEdition = true;
    document.getElementById('edit-id').value = id;
    document.getElementById('f-image').value  = p.image;
    document.getElementById('f-titre').value  = p.titre;
    document.getElementById('f-prix').value   = p.prix;
    document.getElementById('f-desc').value   = p.description;
    document.getElementById('form-titre-label').textContent = 'Modifier le produit';
    document.getElementById('btn-submit-label').textContent = 'Enregistrer';
    document.getElementById('form-wrapper').classList.add('visible');
    document.getElementById('form-wrapper').scrollIntoView({ behavior: 'smooth' });
  }

  function fermerFormulaire() {
    document.getElementById('form-wrapper').classList.remove('visible');
    document.getElementById('form-produit').reset();
    modeEdition = false;
  }

  function soumettreFormulaire(e) {
    e.preventDefault();
    let data = {
      image:       document.getElementById('f-image').value.trim(),
      titre:       document.getElementById('f-titre').value.trim(),
      prix:        parseInt(document.getElementById('f-prix').value),
      description: document.getElementById('f-desc').value.trim()
    };
    if (modeEdition) {
      let id = parseInt(document.getElementById('edit-id').value);
      modifierProduit(id, data);
    } else {
      ajouterProduit(data);
    }
    fermerFormulaire();
  }

  function togglePanier() {
    document.getElementById('panier-overlay').classList.toggle('visible');
    document.getElementById('panier-sidebar').classList.toggle('visible');
  }

  function ajouterAuPanier(id) {
    let p = produits.find(function(x) { return x.id === id; });
    if (!p) return;
    let item = panier.find(function(x) { return x.id === id; });
    if (item) {
      item.quantite++;
    } else {
      panier.push({ id: p.id, titre: p.titre, prix: p.prix, image: p.image, quantite: 1 });
    }
    mettreAJourPanier();
  }

  function changerQuantite(id, delta) {
    let item = panier.find(function(x) { return x.id === id; });
    if (!item) return;
    item.quantite += delta;
    if (item.quantite <= 0) panier = panier.filter(function(x) { return x.id !== id; });
    mettreAJourPanier();
  }

  function supprimerDuPanier(id) {
    panier = panier.filter(function(x) { return x.id !== id; });
    mettreAJourPanier();
  }

  function viderPanier() {
    panier = [];
    mettreAJourPanier();
  }

  function mettreAJourTotal() {
    let total = panier.reduce(function(acc, x) { return acc + x.prix * x.quantite; }, 0);
    document.getElementById('panier-total').textContent = total + ' MAD';
    return total;
  }

  function mettreAJourPanier() {

    let nbArticles = panier.reduce(function(acc, x) { return acc + x.quantite; }, 0);
    let badge = document.getElementById('panier-count');
    if (nbArticles > 0) {
      badge.textContent = nbArticles;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }

    let container = document.getElementById('panier-items');
    if (panier.length === 0) {
      container.innerHTML = '<div id="panier-vide">Votre panier est vide.</div>';
    } else {
      container.innerHTML = panier.map(function(item) {
        return '<div class="panier-item">' +
          '<img src="' + item.image + '" alt="' + item.titre + '">' +
          '<div class="panier-info">' +
            '<div class="panier-item-nom">' + item.titre + '</div>' +
            '<div class="panier-item-prix">' + (item.prix * item.quantite) + ' MAD</div>' +
          '</div>' +
          '<div class="panier-qty">' +
            '<button class="qty-btn" onclick="changerQuantite(' + item.id + ',-1)">−</button>' +
            '<span class="qty-val">' + item.quantite + '</span>' +
            '<button class="qty-btn" onclick="changerQuantite(' + item.id + ',1)">+</button>' +
          '</div>' +
          '<button class="btn-del-item" onclick="supprimerDuPanier(' + item.id + ')">✕</button>' +
        '</div>';
      }).join('');
    }

    mettreAJourTotal();
  }

  function envoyerContact(e) {
    e.preventDefault();
    document.getElementById('msg-succes').classList.add('visible');
    e.target.reset();
    setTimeout(function() {
      document.getElementById('msg-succes').classList.remove('visible');
    }, 4000);
  }

  afficherProduits();
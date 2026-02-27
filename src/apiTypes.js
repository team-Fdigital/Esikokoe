/**
 * @typedef {Object} LoginResponse
 * @property {string} accessToken
 * @property {string} refreshToken
 */

/**
 * @typedef {Object} User
 * @property {string} idUtilisateur
 * @property {string} nom
 * @property {string} email
 * @property {string} role
 */

/**
 * @typedef {Object} Vente
 * @property {string} idVente
 * @property {string} nomClient
 * @property {string} telephone
 * @property {string} adresse
 * @property {string} modePaiement
 * @property {Array<{codeProduit:string,quantite:number,prixUnitaire:number}>} produits
 * @property {number} montantTotal
 * @property {string} dateVente
 */

/**
 * @typedef {Object} VenteStats
 * @property {number} montantTotal
 * @property {number} nombreVentes
 * @property {number} montantMoyen
 * @property {Object.<string, number>} ventesParModePaiement
 */

/**
 * @typedef {Object} Produit
 * @property {string} codeProduit
 * @property {string} nomProduit
 * @property {string} format
 * @property {string} categorie
 * @property {number} stockInitial
 * @property {number} stockMinimum
 * @property {number} prixUnitaire
 * @property {string} fournisseur
 */

/**
 * @typedef {Object} StockEntry
 * @property {string} codeProduit
 * @property {number} quantite
 * @property {string} format
 * @property {string} motif
 */

/**
 * @typedef {Object} StockCritical
 * @property {string} codeProduit
 * @property {string} nomProduit
 * @property {string} format
 * @property {number} stockActuel
 * @property {number} stockMinimum
 * @property {number} prixUnitaire
 * @property {boolean} estCritique
 * @property {number} pourcentageDisponibilite
 */

/**
 * @typedef {Object} RapportProduit
 * @property {string} codeProduit
 * @property {string} nomProduit
 * @property {number} totalVentes
 * @property {number} chiffreAffaires
 */

/**
 * @typedef {Object} RapportVente
 * @property {string} mois
 * @property {number} chiffreAffaires
 * @property {number} nombreCommandes
 * @property {number} panierMoyen
 * @property {number} tauxCroissance
 */

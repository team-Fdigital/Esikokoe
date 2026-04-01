import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Droplets, Package, Building, Calendar, Star, Heart, ShoppingCart, ArrowRight, CircleCheckBig, Truck, Shield } from 'lucide-react'
import useReveal from '../hooks/useReveal'
import { useTranslation } from 'react-i18next'

export default function Products() {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const autoPlayRef = useRef(null)
  const [likedProducts, setLikedProducts] = useState({})
  const [likesCount, setLikesCount] = useState({})
  const revealRef = useRef(null)

  useReveal(revealRef)

  const slides = [
    {
      id: 1,
      title: t("Prod_Sachets_Title", 'Sachets d\'Eau Pure'),
      badge: t("Prod_Sachets_Badge", 'Populaire'),
      price: '300 FCFA',
      originalPrice: '',
      format: t("Prod_Sachets_Format", 'Format Pratique'),
      description: t("Prod_Sachets_Desc", 'Nos sachets d\'eau pure de 500ml sont parfaits pour tous vos déplacements. Conditionnés dans un emballage hygiénique et pratique.'),
      volume: '500ml',
      features: [t("Prod_Sachets_F1", '500ml'), t("Prod_Sachets_F2", 'Hygiénique'), t("Prod_Sachets_F3", 'Portable'), t("Prod_Sachets_F4", 'Économique')],
      likes: '1,250',
      rating: '4.9',
      reviews: '2,340',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-600 to-cyan-600',
      icon: Droplets,
      image: '/eau.jpg'
    },
    {
      id: 2,
      title: t("Prod_22L_Title", 'Bonbonnes 22L'),
      badge: t("Prod_22L_Badge", 'Économisez 500 FCFA'),
      price: '2,300 FCFA',
      originalPrice: '2,800 FCFA',
      format: t("Prod_22L_Format", 'Format Familial'),
      description: t("Prod_22L_Desc", 'Nos bonbonnes de 22 litres sont idéales pour les familles et les bureaux. Eau pure et fraîche pour toute la semaine.'),
      volume: '22 Litres',
      features: [t("Prod_22L_F1", '22 Litres'), t("Prod_22L_F2", 'Réutilisable'), t("Prod_22L_F3", 'Économique'), t("Prod_22L_F4", 'Livraison gratuite')],
      likes: '890',
      rating: '4.9',
      reviews: '2,340',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-600 to-emerald-600',
      icon: Package,
      image: '/eau.jpg'
    },
    {
      id: 3,
      title: t("Prod_Enterprise_Title", 'Pack Entreprise'),
      badge: t("Prod_Enterprise_Badge", 'Nouveau'),
      price: 'Sur devis',
      originalPrice: '',
      format: t("Prod_Enterprise_Format", 'Solution Professionnelle'),
      description: t("Prod_Enterprise_Desc", 'Pack spécialement conçu pour les entreprises. Livraison régulière et tarifs préférentiels pour vos équipes.'),
      volume: t("Prod_Enterprise_Volume", 'Sur devis'),
      features: [t("Prod_Enterprise_F1", 'Livraison régulière'), t("Prod_Enterprise_F2", 'Tarifs préférentiels'), t("Prod_Enterprise_F3", 'Service dédié'), t("Prod_Enterprise_F4", 'Facturation mensuelle')],
      likes: '456',
      rating: '4.9',
      reviews: '2,340',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-600 to-pink-600',
      icon: Building,
      image: '/eau.jpg'
    },
    {
      id: 4,
      title: t("Prod_Sub_Title", 'Abonnement Mensuel'),
      badge: t("Prod_Sub_Badge", '2 mois gratuits'),
      price: '8,000 FCFA/mois',
      originalPrice: '10,000 FCFA/mois',
      format: t("Prod_Sub_Format", 'Service Premium'),
      description: t("Prod_Sub_Desc", 'Abonnez-vous et recevez votre eau pure chaque semaine. Service premium avec livraison garantie et prix avantageux.'),
      volume: t("Prod_Sub_Volume", 'Mensuel'),
      features: [t("Prod_Sub_F1", 'Livraison hebdomadaire'), t("Prod_Sub_F2", 'Prix fixe'), t("Prod_Sub_F3", 'Sans engagement'), t("Prod_Sub_F4", 'Service prioritaire')],
      likes: '2,100',
      rating: '4.9',
      reviews: '2,340',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-600 to-red-600',
      icon: Calendar,
      image: '/eau.jpg'
    },
    {
      id: 5,
      title: t("Prod_75cl_Title", 'Bouteille 75cl'),
      badge: t("Prod_75cl_Badge", 'Populaire'),
      price: '250 FCFA',
      originalPrice: '300 FCFA',
      format: t("Prod_75cl_Format", 'Format Individuel'),
      description: t("Prod_75cl_Desc", 'Notre bouteille de 75cl est idéale pour rester hydraté tout au long de la journée. Un format élégant pour le bureau ou le sport.'),
      volume: '75cl',
      features: [t("Prod_75cl_F1", '75cl'), t("Prod_75cl_F2", 'Bouchon sport'), t("Prod_75cl_F3", 'Recyclable'), t("Prod_75cl_F4", 'Format idéal')],
      likes: '1,540',
      rating: '4.9',
      reviews: '1,820',
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-blue-500 to-indigo-600',
      icon: Droplets,
      image: '/assets/b75cl.jpg'
    },
    {
      id: 6,
      title: t("Prod_35cl_Title", 'Bouteille 35cl'),
      badge: t("Prod_35cl_Badge", 'Pratique'),
      price: '150 FCFA',
      originalPrice: '200 FCFA',
      format: t("Prod_35cl_Format", 'Petit Format'),
      description: t("Prod_35cl_Desc", 'La petite bouteille de 35cl se glisse partout. Parfaite pour les enfants ou les événements.'),
      volume: '35cl',
      features: [t("Prod_35cl_F1", '35cl'), t("Prod_35cl_F2", 'Compacte'), t("Prod_35cl_F3", 'Légère'), t("Prod_35cl_F4", 'Pratique')],
      likes: '920',
      rating: '4.8',
      reviews: '1,150',
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-500 to-blue-600',
      icon: Droplets,
      image: '/assets/b35cl.jpg'
    }
  ]

  useEffect(() => {
    if (!autoPlay) return

    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(autoPlayRef.current)
  }, [autoPlay, slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 10000)
  }

  const toggleLike = (productId) => {
    setLikedProducts(prev => ({
      ...prev,
      [productId]: true
    }))

    setLikesCount(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
    
    setTimeout(() => {
      setLikedProducts(prev => ({
        ...prev,
        [productId]: false
      }))
    }, 1000)
  }

  return (
    <div className="w-full pb-20">
      {/* Carousel Section */}
      <div className="h-[550px] lg:h-[79vh] min-h-[630px]">
        <div className="relative h-full overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z%22 fill=%22%23000%22 fillOpacity=%220.1%22 fillRule=%22evenodd%22/%3E%3C/svg%3E')]"></div>
          </div>

          <div className="relative h-full">
            {/* Slides */}
            {slides.map((slide, index) => {
              const IconComponent = slide.icon
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                    ? 'opacity-100 scale-100 pointer-events-auto z-10'
                    : 'opacity-0 scale-95 pointer-events-none z-0'
                    }`}
                >
                  <div className="relative z-10 h-auto md:h-full flex items-center justify-center py-4 md:py-8">
                    <div className="container mx-auto px-4 max-w-7xl">
                      <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
                        {/* Product Card */}
                        <div className="relative block lg:block mb-8 lg:mb-0">
                          <div className="rounded-lg bg-card text-card-foreground overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 border-0">
                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} opacity-10`}></div>

                            {/* Badge */}
                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary hover:bg-primary/80 absolute top-4 right-4 z-10 bg-gradient-to-r ${slide.gradient} text-white animate-pulse`}>
                              {slide.badge}
                            </div>

                            {/* Wishlist Button */}
                            <button onClick={() => toggleLike(slide.id)} className={`absolute top-4 left-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 ${likedProducts[slide.id] ? 'bg-red-50' : ''}`}>
                              <Heart className={`w-5 h-5 transition-all duration-300 ${likedProducts[slide.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </button>

                            <div className="p-0">
                              <div className="relative">
                                <img
                                  src={slide.image}
                                  alt={slide.title}
                                  className="w-full h-40 sm:h-72 object-contain p-4"
                                  loading={index === 0 ? "eager" : "lazy"}
                                  fetchPriority={index === 0 ? "high" : "auto"}
                                  decoding="async"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient} opacity-20`}></div>
                              </div>

                              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                                {/* Product Header */}
                                <div className="flex items-center space-x-4">
                                  <div className={`p-3 rounded-xl bg-gradient-to-r ${slide.gradient}`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
                                    <p className="text-gray-600">{slide.format}</p>
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center space-x-4">
                                  <span className={`text-3xl font-bold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                                    {slide.price}
                                  </span>
                                  {slide.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">{slide.originalPrice}</span>
                                  )}
                                </div>

                                {/* Features - Caché sur mobile pour gagner de l'espace */}
                                <div className="hidden md:grid grid-cols-2 gap-3">
                                  {slide.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.gradient}`}></div>
                                      <span className="text-gray-600">{feature}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Likes */}
                                <div className="flex items-center space-x-2 text-gray-500">
                                  <Heart className="w-4 h-4" />
                                  <span>{likesCount[slide.id] || 0} {t("Prod_Likes_Text", "personnes aiment ce produit")}</span>
                                </div>

                                {/* CTA Button */}
                                <Link
                                  to="/contact"
                                  className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 md:h-11 rounded-md px-6 md:px-8 w-full bg-gradient-to-r ${slide.gradient} hover:opacity-90 text-white text-base md:text-lg py-2 md:py-4 font-bold`}
                                >
                                  <ShoppingCart className="w-5 h-5 mr-2" />
                                  {t("Prod_Order_Now", "Commander Maintenant")}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-6">
                          <div>
                            <div className="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-lg px-4 py-2 mb-4">
                              {slide.format}
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight text-center lg:text-left">
                              {slide.title}
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center lg:text-left">
                              {slide.description}
                            </p>
                          </div>

                          {/* Ratings */}
                          <div className="flex items-center space-x-4">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-gray-600 text-lg">{slide.rating}/5 ({slide.reviews} {t("Prod_Reviews_Text", "avis")})</span>
                          </div>

                          {/* Contact Info Box */}
                          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                            <h4 className="font-semibold text-gray-900">{t("Prod_Order_Phone", "Commandez par téléphone")}</h4>
                            <div className="space-y-2">
                              <p className="text-gray-600 text-sm"> +228 91 29 99 99</p>
                              <p className="text-gray-600 text-xs break-words"> Intercontinentaleau@gmail.com</p>
                              <p className="text-gray-600 text-sm"> {t("Prod_Available_24_7", "Disponible 24h/24, 7j/7")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessoires Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>

          <div className="w-full md:w-1/2 relative z-10">
            <div className="relative transition-all duration-700">
              <img
                src="/assets/fontaineb.jpg"
                alt="Fontaine à Eau Dispenser"
                className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm">
              <Package size={16} />
              <span>{t("Prod_Accessory_Badge", "Accessoire Indispensable")}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight" dangerouslySetInnerHTML={{ __html: t("Prod_Fountain_Title", "Fontaine à Eau <span className=\"text-blue-600\">Premium</span>") }} />

            <p className="text-gray-600 text-lg leading-relaxed">
              {t("Prod_Fountain_Desc", "Optimisez votre consommation d'eau avec notre fontaine moderne spécialement conçue pour nos bonbonnes de 22L. Design élégant, robuste et facile à utiliser pour une eau toujours à la bonne température.")}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CircleCheckBig className="text-green-500" size={20} />
                <span className="text-gray-700">{t("Prod_Fountain_F1", "Eau Chaude / Froide")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CircleCheckBig className="text-green-500" size={20} />
                <span className="text-gray-700">{t("Prod_Fountain_F2", "Facile à installer")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CircleCheckBig className="text-green-500" size={20} />
                <span className="text-gray-700">{t("Prod_Fountain_F3", "Design Moderne")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CircleCheckBig className="text-green-500" size={20} />
                <span className="text-gray-700">{t("Prod_Fountain_F4", "Garantie 1 an")}</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              >
                {t("Prod_Request_Quote", "Demander un devis")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Range Section */}
      <section className="py-20 water-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              {t("Prod_Range_Title", "Notre Gamme Complète")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("Prod_Range_Desc", "Choisissez parmi notre sélection de produits d'eau pure, conçus pour répondre à tous vos besoins d'hydratation.")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Sachets Product Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden card-hover">
              <div className="relative h-[500px] bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10"></div>
                <img
                  src="/eau.jpg"
                  alt="Sachets d'eau Intercontinental Eau"
                  className="w-80 h-80 object-contain animate-float relative z-10"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-500 text-white hover:bg-blue-600 animate-pulse">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {t("Prod_Bestseller", "Bestseller")}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-800">{t("Prod_Sachets_Title_Main", "Sachets d'Eau")}</h3>
                  <div className="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100 text-lg px-4 py-2">
                    500ml
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {t("Prod_Sachets_Desc_Main", "Nos sachets d'eau de 500ml sont parfaits pour une hydratation quotidienne. Pratiques, économiques et d'une pureté exceptionnelle, ils sont idéaux pour toute la famille, l'école ou le bureau.")}
                </p>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Droplets, label: t("Prod_Sachets_F1_Main", 'Eau purifiée par osmose inverse'), color: 'blue' },
                    { icon: Package, label: t("Prod_Sachets_F2_Main", 'Emballage hygiénique et résistant'), color: 'green' },
                    { icon: Shield, label: t("Prod_Sachets_F3_Main", 'Contrôle qualité rigoureux'), color: 'cyan' }
                  ].map((item, idx) => {
                    const ItemIcon = item.icon
                    const bgMap = { blue: 'bg-blue-100', green: 'bg-green-100', cyan: 'bg-cyan-100' }
                    const textMap = { blue: 'text-blue-500', green: 'text-green-500', cyan: 'text-cyan-500' }
                    return (
                      <div key={idx} className="flex items-center text-gray-600 group">
                        <div className={`w-8 h-8 ${bgMap[item.color]} rounded-full flex items-center justify-center mr-3`}>
                          <ItemIcon className={`w-4 h-4 ${textMap[item.color]} group-hover:animate-bounce`} />
                        </div>
                        <span>{item.label}</span>
                        <CircleCheckBig className="w-4 h-4 text-green-500 ml-auto" />
                      </div>
                    )
                  })}
                </div>

                {/* Price Info */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">{t("Prod_Unit_Price", "Prix unitaire")}</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-gray-800">300</span>
                      <span className="text-lg text-gray-600 ml-1">FCFA</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4" dangerouslySetInnerHTML={{ __html: t("Prod_Sachets_Info", "• Remise dégressive à partir de 50 sachets<br />• Livraison gratuite dès 100 sachets") }} />
                </div>

                <a href="/contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 w-full bg-blue-600 hover:bg-blue-700 text-lg py-4 button-ripple group font-bold text-white">
                  {t("Prod_Order_Now_Main", "Commander maintenant")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Bonbonnes Product Card */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden card-hover">
              <div className="relative h-[500px] bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10"></div>
                <img
                  src="/eau.jpg"
                  alt="Bonbonnes 22L Intercontinental Eau"
                  className="w-60 h-96 object-contain animate-float relative z-10"
                  style={{ animationDelay: '2s' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white hover:bg-green-600 animate-pulse">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {t("Prod_Economic", "Économique")}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-800">{t("Prod_22L_Title_Main", "Bonbonnes 22L")}</h3>
                  <div className="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 hover:bg-green-100 text-lg px-4 py-2">
                    22 Litres
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {t("Prod_22L_Desc_Main", "Nos bonbonnes de 22 litres sont parfaites pour les bureaux, les familles nombreuses et tous ceux qui consomment beaucoup d'eau. Économiques et pratiques avec notre service de livraison à domicile.")}
                </p>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Droplets, label: t("Prod_22L_F1_Main", '22 litres d\'eau pure et fraîche'), color: 'blue' },
                    { icon: Truck, label: t("Prod_22L_F2_Main", 'Livraison à domicile disponible'), color: 'green' },
                    { icon: Shield, label: t("Prod_22L_F3_Main", 'Bonbonne réutilisable et écologique'), color: 'cyan' }
                  ].map((item, idx) => {
                    const ItemIcon = item.icon
                    const bgMap = { blue: 'bg-blue-100', green: 'bg-green-100', cyan: 'bg-cyan-100' }
                    const textMap = { blue: 'text-blue-500', green: 'text-green-500', cyan: 'text-cyan-500' }
                    return (
                      <div key={idx} className="flex items-center text-gray-600 group">
                        <div className={`w-8 h-8 ${bgMap[item.color]} rounded-full flex items-center justify-center mr-3`}>
                          <ItemIcon className={`w-4 h-4 ${textMap[item.color]} group-hover:animate-bounce`} />
                        </div>
                        <span>{item.label}</span>
                        <CircleCheckBig className="w-4 h-4 text-green-500 ml-auto" />
                      </div>
                    )
                  })}
                </div>

                {/* Price Info */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500">{t("Prod_Unit_Price", "Prix unitaire")}</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-gray-800">2,300</span>
                      <span className="text-lg text-gray-600 ml-1">FCFA</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4" dangerouslySetInnerHTML={{ __html: t("Prod_22L_Info", "• Consigne bonbonne: 2,000 FCFA (remboursable)<br />• Livraison gratuite dès 5 bonbonnes") }} />
                </div>

                <a href="/contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 w-full bg-green-600 hover:bg-green-700 text-lg py-4 button-ripple group font-bold text-white">
                  {t("Prod_Order_Now_Main", "Commander maintenant")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800" dangerouslySetInnerHTML={{ __html: t("Prod_Why_Title", "Pourquoi Choisir <span className=\"text-blue-600\">Intercontinental Eau</span> ?") }} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Droplets,
                title: t("Prod_Why_Purity", 'Pureté Garantie'),
                description: t("Prod_Why_Purity_Desc", 'Eau filtrée par osmose inverse pour une pureté exceptionnelle'),
                color: 'blue'
              },
              {
                icon: Truck,
                title: t("Prod_Why_Delivery", 'Livraison Rapide'),
                description: t("Prod_Why_Delivery_Desc", 'Service de livraison dans tout le Togo en moins de 24h'),
                color: 'green'
              },
              {
                icon: Shield,
                title: t("Prod_Why_Quality", 'Qualité Certifiée'),
                description: t("Prod_Why_Quality_Desc", 'Contrôles qualité rigoureux selon les normes internationales'),
                color: 'cyan'
              },
              {
                icon: Heart,
                title: t("Prod_Why_Service", 'Service Client'),
                description: t("Prod_Why_Service_Desc", 'Équipe dédiée disponible 24/7 pour votre satisfaction'),
                color: 'purple'
              }
            ].map((item, idx) => {
              const ItemIcon = item.icon
              const bgMap = { blue: 'bg-blue-100', green: 'bg-green-100', cyan: 'bg-cyan-100', purple: 'bg-purple-100' }
              const textMap = { blue: 'text-blue-600', green: 'text-green-600', cyan: 'text-cyan-600', purple: 'text-purple-600' }
              return (
                <div key={idx} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow card-hover">
                  <div className={`w-16 h-16 ${bgMap[item.color]} rounded-full flex items-center justify-center mx-auto mb-4 pulse-ring`}>
                    <ItemIcon className={`w-8 h-8 ${textMap[item.color]}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            {t("Prod_CTA_Title", "Prêt à Commander Votre Eau Pure ?")}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t("Prod_CTA_Desc", "Contactez-nous dès maintenant pour passer votre commande et profiter de notre service de livraison rapide.")}
          </p>
          <a href="/contact" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 button-ripple">
            {t("Prod_CTA_Btn", "Passer ma commande")}
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  )
}

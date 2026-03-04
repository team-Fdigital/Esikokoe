import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Droplets, Package, Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const slideInterval = useRef(null)

  const slides = [
    {
      title: 'Eau Pure',
      titleHighlight: 'du Togo',
      badge: 'Qualité Premium',
      description: 'Découvrez notre eau pure...',
      stat: '100%',
      statLabel: 'Pure',
      gradient: 'from-blue-600 to-cyan-600',
      image: '/assets/sachet.png',
    },
    {
      title: 'Livraison',
      titleHighlight: 'Rapide',
      badge: 'Service Express',
      description: 'Livraison gratuite dans tout Lomé en moins de 2h. Service client disponible 24/7.',
      stat: '2h',
      statLabel: 'Livraison',
      gradient: 'from-green-600 to-emerald-600',
      image: '/assets/hero-water.jpg',
    },
    {
      title: 'Clients',
      titleHighlight: 'Satisfaits',
      badge: 'Confiance & Qualité',
      description: 'Plus de 10,000 clients nous font confiance pour leur approvisionnement en eau pure.',
      stat: '10K+',
      statLabel: 'Clients',
      gradient: 'from-purple-600 to-pink-600',
      image: '/assets/bonbonne.jpg',
    },
  ]

  const startAutoSlide = () => {
    if (slideInterval.current) clearInterval(slideInterval.current)
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
  }

  React.useEffect(() => {
    startAutoSlide()
    return () => clearInterval(slideInterval.current)
  }, [])

  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev + 0.5) % 100)
    }, 50)
    return () => clearInterval(progressInterval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    startAutoSlide()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    startAutoSlide()
  }

  const products = [
    {
      id: 1,
      name: 'Sachets 500ml',
      price: '25 FCFA',
      description: 'Parfait pour vos déplacements quotidiens. Eau pure et hygiénique dans un format pratique.',
      gradient: 'from-blue-400 to-cyan-500',
      badge: 'Bestseller',
      badgeColor: 'bg-yellow-500 text-black',
      features: ['Eau purifiée', 'Hygiénique'],
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      image: '/assets/sachet.png',
    },
    {
      id: 2,
      name: 'Bonbonnes 22L',
      price: '1,500 FCFA',
      description: 'Idéal pour les familles et bureaux. Solution économique avec livraison gratuite.',
      gradient: 'from-green-400 to-emerald-500',
      badge: 'Économique',
      badgeColor: 'bg-green-600 text-white',
      features: ['22L d\'eau pure', 'Réutilisable'],
      buttonColor: 'bg-green-600 hover:bg-green-700',
      image: '/assets/bonbonne.jpg',
    },
  ]

  const stats = [
    { icon: '📅', title: 'Notre Histoire', description: 'Plus de 2 ans d\'expérience dans la production d\'eau pure au Togo' },
    { icon: '🎯', title: 'Notre Mission', description: 'Fournir une eau pure et accessible à tous les Togolais' },
    { icon: '❤️', title: 'Nos Valeurs', description: 'Qualité, transparence et respect de nos clients' },
    { icon: '👥', title: 'Notre Équipe', description: '10+ professionnels dévoués à votre service' },
  ]

  const contact = [
    { icon: Phone, title: 'Téléphone', info: '+228 91 29 99 99', sub: 'Disponible 24/7', color: 'bg-green-100' },
    { icon: Mail, title: 'Email', info: 'Intercontinentaleau@gmail.com', sub: 'Réponse sous 2h', color: 'bg-blue-100' },
    { icon: MapPin, title: 'Adresse', info: 'Hedranawoé', sub: 'Lomé, Togo', color: 'bg-purple-100' },
    { icon: Clock, title: 'Horaires', info: 'Lun-Sam: 8h-18h', sub: 'Livraison 24/7', color: 'bg-orange-100' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <div className="h-[70vh] md:h-screen min-h-[500px]">
        <div className="relative h-full overflow-hidden bg-gradient-to-br from-blue-900 to-cyan-700">

          {/* Slides */}
          <div className="relative h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-full'
                  }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90`} />

                <div className="relative z-10 h-full flex items-center">
                  <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                      {/* LEFT CONTENT */}
                      <div className="text-white space-y-6">

                        {/* Badge */}
                        <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold bg-white/20 backdrop-blur-sm">
                          {slide.badge}
                        </div>

                        {/* TITLE (RÉDUIT POUR MOBILE) */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]">
                          {slide.title} <span className="block sm:inline text-blue-200 sm:text-white">{slide.titleHighlight}</span>
                        </h1>

                        {/* DESCRIPTION */}
                        <p className="text-lg lg:text-xl text-white/90 max-w-xl">
                          {slide.description}
                        </p>

                        {/* STATS + STARS */}
                        {/* STATS - CACHÉES SUR MOBILE TRÈS PETIT */}
                        <div className="hidden xs:flex items-center space-x-6 sm:space-x-8">
                          <div>
                            <div className="text-3xl sm:text-5xl font-bold">
                              {slide.stat}
                            </div>
                            <div className="text-white/80 text-xs sm:text-base">
                              {slide.statLabel}
                            </div>
                          </div>

                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Link
                            to="/products"
                            className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-white text-blue-700 font-semibold hover:bg-gray-100 transition"
                          >
                            <Droplets className="w-5 h-5 mr-2" />
                            Commander Maintenant
                          </Link>

                          <a
                            href="tel:+228 91 29 99 99"
                            className="inline-flex items-center justify-center rounded-full px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-700 transition"
                          >
                            <Phone className="w-5 h-5 mr-2" />
                            +228 91 29 99 99
                          </a>
                        </div>
                      </div>

                      <div className="relative hidden lg:block">
                        <div className="relative z-10">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/30 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Nos Produits <span className="text-blue-600">Premium</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre gamme complète d'eau pure, disponible en sachets pratiques et bonbonnes économiques
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`relative h-64 bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/placeholder.svg?height=200&width=200' }} />
                  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold absolute top-4 right-4 ${product.badgeColor} animate-pulse`}>
                    {product.badge}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{product.name}</h3>
                    <div className="text-2xl font-bold text-blue-600">{product.price}</div>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center space-x-4 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        {idx === 0 ? <Droplets className="w-4 h-4 text-blue-500" /> : <Package className="w-4 h-4 text-green-500" />}
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/products" className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full ${product.buttonColor} text-white`}>
                    Voir détails
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-11 rounded-md px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white"
            >
              Voir tous nos produits
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-4 bg-blue-100 text-blue-800">
              À propos de nous
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Qui Sommes-<span className="text-blue-600">Nous</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Depuis notre création, nous nous engageons à fournir une eau d'une pureté exceptionnelle à tous les Togolais, avec un service de qualité irréprochable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, idx) => (
              <div key={idx} className="rounded-lg bg-card text-card-foreground shadow-sm text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-gray-50 to-white">
                <div className="p-6 pt-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl">
                    {stat.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{stat.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">2+</div>
                <div className="text-blue-100">Années d'expérience</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
                <div className="text-blue-100">Clients satisfaits</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Service disponible</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Qualité garantie</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/about"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-11 rounded-md px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
            >
              En savoir plus sur nous
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Prêt à Commander Votre <span className="text-blue-600">Eau Pure</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contactez-nous dès maintenant pour passer votre commande. Notre équipe est disponible 24h/24 pour vous servir.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contact.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="rounded-lg border bg-card text-card-foreground shadow-sm text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6 pt-6">
                    <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.info}</p>
                    <p className="text-gray-600 text-sm">{item.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Commandez Maintenant !</h3>
            <p className="text-xl mb-8 text-blue-100">Livraison gratuite dès 10 bonbonnes ou 50 sachets dans tout Lomé</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+228 91 29 99 99"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-11 rounded-md px-8 bg-white text-blue-600 hover:bg-gray-100"
              >
                <Phone className="w-5 h-5 mr-2" />
                Appeler maintenant
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border h-11 rounded-md px-8 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Formulaire de contact
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

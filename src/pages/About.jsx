import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Target, Heart, Users } from 'lucide-react'
import useReveal from '../hooks/useReveal'

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const autoPlayRef = useRef(null)
  const revealRef = useRef(null)

  useReveal(revealRef)

  const slides = [
    {
      id: 1,
      title: 'Notre Histoire',
      badge: 'Depuis 2010',
      description: 'Fondée en 2010, Intercontinental Eau s\'est imposée comme le leader de la production d\'eau pure au Togo. Notre engagement envers la qualité et l\'innovation nous a permis de servir des milliers de familles.',
      stats: [
        { value: '2+', label: 'Années d\'expérience' },
        { value: '100K+', label: 'Clients servis' }
      ],
      gradient: 'from-blue-600 to-indigo-600',
      bgGradient: 'from-blue-600 to-indigo-600',
      icon: Calendar,
      image: '/eau.jpg'
    },
    {
      id: 2,
      title: 'Notre Mission',
      badge: 'Eau Pure pour Tous',
      description: 'Fournir une eau pure, saine et accessible à tous les Togolais. Nous nous engageons à maintenir les plus hauts standards de qualité tout en respectant l\'environnement.',
      stats: [
        { value: '100%', label: 'Qualité garantie' },
        { value: '24/7', label: 'Service client' }
      ],
      gradient: 'from-green-600 to-teal-600',
      bgGradient: 'from-green-600 to-teal-600',
      icon: Target,
      image: '/eau.jpg'
    },
    {
      id: 3,
      title: 'Nos Valeurs',
      badge: 'Excellence & Intégrité',
      description: 'La qualité, la transparence et le respect de nos clients sont au cœur de nos préoccupations. Chaque goutte d\'eau est testée et certifiée selon les normes internationales.',
      stats: [
        { value: 'ISO', label: 'Certifié' },
        { value: '0', label: 'Compromis qualité' }
      ],
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-600 to-pink-600',
      icon: Heart,
      image: '/eau.jpg'
    },
    {
      id: 4,
      title: 'Notre Équipe',
      badge: 'Professionnels Dévoués',
      description: 'Une équipe de 50+ professionnels passionnés travaille chaque jour pour vous offrir le meilleur service. De la production à la livraison, nous sommes là pour vous.',
      stats: [
        { value: '10+', label: 'Employés' },
        { value: '5', label: 'Livreurs' }
      ],
      gradient: 'from-orange-600 to-red-600',
      bgGradient: 'from-orange-600 to-red-600',
      icon: Users,
      image: '/eau.jpg'
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

  return (
    <div className="min-h-screen">
      {/* Carousel Section */}
      <div className="h-[70vh] md:min-h-screen min-h-[500px]">
        <div className="relative h-full md:min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-200 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>

          <div className="relative h-full">
            {/* Slides */}
            {slides.map((slide, index) => {
              const IconComponent = slide.icon
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-full'
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} opacity-10`} />
                  <div className="relative z-10 h-full flex items-center py-12 lg:py-20">
                    <div className="container mx-auto px-4">
                      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                          <div className="flex items-center space-x-4">
                            <div className={`p-4 rounded-2xl bg-gradient-to-r ${slide.gradient}`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div className="inline-flex items-center rounded-full border font-semibold text-lg px-4 py-2 bg-secondary text-secondary-foreground">
                              {slide.badge}
                            </div>
                          </div>

                          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 text-center lg:text-left">
                            {slide.title}
                          </h2>

                          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed text-center lg:text-left">
                            {slide.description}
                          </p>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-8">
                            {slide.stats.map((stat, idx) => (
                              <div key={idx} className="text-center lg:text-left">
                                <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${slide.gradient} bg-clip-text text-transparent`}>
                                  {stat.value}
                                </div>
                                <div className="text-gray-500 text-lg mt-2">{stat.label}</div>
                              </div>
                            ))}
                          </div>

                          <button className={`inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-11 rounded-md bg-gradient-to-r ${slide.gradient} hover:opacity-90 text-white text-lg px-8 py-4`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-droplets w-5 h-5 mr-2"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path></svg>
                            En Savoir Plus
                          </button>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                          <div className="rounded-lg border bg-card text-card-foreground overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-full h-48 sm:h-64 lg:h-[500px] object-contain p-4 bg-white/50 backdrop-blur-sm"
                            />
                          </div>
                          <div className={`absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r ${slide.gradient} rounded-full opacity-20 animate-pulse`} />
                          <div className={`absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r ${slide.gradient} rounded-full opacity-30 animate-bounce`} />
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

      {/* Notre Histoire Section */}
      <section className="py-24 relative overflow-hidden bg-white">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 rounded-l-[100px] -z-10 transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-50 rounded-full -z-10 blur-3xl opacity-60"></div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-3 block">Origines</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Notre Histoire
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Left side text column */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-blue-50/80 p-8 rounded-2xl border border-blue-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 text-blue-200">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>
                <p className="text-xl leading-relaxed text-gray-800 font-medium relative z-10 italic">
                  Fondée au cœur du Togo, <strong className="text-blue-700">Intercontinental Eau</strong> est née d'une vision simple mais ambitieuse : fournir à tous les Togolais un accès à une eau pure, saine et abordable.
                </p>
              </div>
            </div>

            {/* Right side narrative timeline */}
            <div className="md:col-span-7 relative">
              <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-100 via-blue-200 to-transparent"></div>

              <div className="space-y-12">
                {/* Paragraph 2 */}
                <div className="relative pl-24 md:pl-32 pr-4 group">
                  <div className="absolute left-6 md:left-10 top-1 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-md group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Target size={18} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Notre Engagement</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Depuis nos débuts, nous nous sommes engagés à respecter les plus hauts standards de qualité dans la production de nos sachets d'eau et bonbonnes de 22 litres. Notre équipe passionnée travaille chaque jour pour garantir que chaque goutte d'eau qui porte notre nom répond aux exigences les plus strictes de pureté et de goût.
                    </p>
                  </div>
                </div>

                {/* Paragraph 3 */}
                <div className="relative pl-24 md:pl-32 pr-4 group">
                  <div className="absolute left-6 md:left-10 top-1 w-5 h-5 bg-white border-4 border-cyan-500 rounded-full shadow-md group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-cyan-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                        <Heart size={18} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Aujourd'hui</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Aujourd'hui, nous sommes fiers d'être reconnus comme l'un des leaders du marché togolais de l'eau embouteillée, tout en restant fidèles à nos valeurs d'excellence et de service client.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Notre Mission & Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: 'droplets',
                title: 'Pureté',
                description: 'Nous garantissons une eau d\'une pureté exceptionnelle grâce à nos processus de filtration avancés.',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600'
              },
              {
                icon: 'award',
                title: 'Qualité',
                description: 'Chaque produit est soumis à des contrôles qualité rigoureux pour votre satisfaction.',
                bgColor: 'bg-green-100',
                textColor: 'text-green-600'
              },
              {
                icon: 'users',
                title: 'Service',
                description: 'Notre équipe dévouée est à votre service pour répondre à tous vos besoins en eau.',
                bgColor: 'bg-cyan-100',
                textColor: 'text-cyan-600'
              },
              {
                icon: 'leaf',
                title: 'Durabilité',
                description: 'Nous nous engageons pour un avenir durable avec des pratiques respectueuses de l\'environnement.',
                bgColor: 'bg-emerald-100',
                textColor: 'text-emerald-600'
              }
            ].map((value, idx) => (
              <div
                key={idx}
                className="rounded-lg border bg-card text-card-foreground shadow-sm text-center p-6 hover:shadow-lg transition-shadow card-hover"
              >
                <div className="p-6 pt-6">
                  <div className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {value.icon === 'droplets' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-droplets w-8 h-8 ${value.textColor}`}><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path></svg>
                    )}
                    {value.icon === 'award' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-award w-8 h-8 ${value.textColor}`}><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>
                    )}
                    {value.icon === 'users' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-users w-8 h-8 ${value.textColor}`}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    )}
                    {value.icon === 'leaf' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-leaf w-8 h-8 ${value.textColor}`}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
              Nos Engagements
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Qualité Certifiée
                </div>
                <p className="text-gray-600">
                  Nos produits respectent toutes les normes internationales de qualité et de sécurité alimentaire.
                </p>
              </div>
              <div className="p-6">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-4 bg-green-100 text-green-800 hover:bg-green-100">
                  Livraison Rapide
                </div>
                <p className="text-gray-600">
                  Service de livraison efficace dans tout le Togo pour répondre à vos besoins rapidement.
                </p>
              </div>
              <div className="p-6">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-4 bg-cyan-100 text-cyan-800 hover:bg-cyan-100">
                  Prix Compétitifs
                </div>
                <p className="text-gray-600">
                  Des tarifs accessibles pour rendre l'eau pure disponible à tous les Togolais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

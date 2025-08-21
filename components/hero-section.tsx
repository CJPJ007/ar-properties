import React from 'react'

function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden mt-0 md:mt-16">
        <div className="absolute inset-0 z-0">
          <Slider className="w-full h-screen relative"/>
        </div>

        <motion.div
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to Ananta Realty
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Find your dream home with our expert guidance
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search properties by city or zip code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white/90 backdrop-blur-sm border-0 text-slate-800 placeholder:text-slate-500"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Search
            </Button>
            {searchQuery && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="h-12 px-6 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Clear
              </Button>
            )}
          </motion.div>

          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                className="grid relative grid-cols-1 gap-6 max-w-6xl mx-auto my-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
            <div className="max-h-[400px] overflow-y-auto border rounded-lg bg-white/80 shadow p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              {searchResults.map((property) => {
                // Highlight search match in property title
                const regex = new RegExp(`(${searchQuery})`, "ig");
                const parts = property.title.split(regex);
                const locationParts = property.location.split(regex);
                const pinCodeParts = property.pinCode.toString().split(regex);
                const typeParts = property.type.split(regex);
                return (
                  <div key={property.id} className="flex items-center justify-between gap-4 border-b last:border-b-0 py-2">
                    <div className="flex gap-2 min-w-0 text-sm ">
                      <span className="font-medium text-slate-800 truncate">
                        Title : {parts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="font-medium text-slate-800 truncate">
                        Location : {locationParts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="font-medium text-slate-800 truncate">
                        Pincode : {pinCodeParts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="font-medium text-slate-800 truncate">
                        Type : {typeParts.map((part, i) =>
                          regex.test(part) ? (
                            <mark key={i} className="bg-yellow-200 text-blue-900 rounded px-1">{part}</mark>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      <span className="text-amber-600 font-semibold">{property.price} INR</span>
                    </div>
                    <Link href={`/properties/${property.slug}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          
              </motion.div>
            )}
          </AnimatePresence>

          {searchResults.length===0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              onClick={() => document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Properties
            </Button>
          </motion.div>}
        </motion.div>
      </section>
  )
}

export default HeroSection;

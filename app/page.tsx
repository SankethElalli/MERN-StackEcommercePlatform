import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react"

export default function HomeScreen() {
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: "/premium-wireless-headphones.png",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      originalPrice: 249.99,
      image: "/smart-fitness-watch.png",
      rating: 4.6,
      reviews: 89,
      badge: "New",
    },
    {
      id: 3,
      name: "Laptop Backpack Pro",
      price: 79.99,
      originalPrice: 99.99,
      image: "/laptop-backpack-professional.jpg",
      rating: 4.7,
      reviews: 156,
      badge: "Sale",
    },
  ]

  const categories = [
    { name: "Electronics", image: "/electronics-category.png", count: "500+ items" },
    { name: "Fashion", image: "/fashion-category.png", count: "800+ items" },
    { name: "Home & Garden", image: "/home-garden-category.png", count: "300+ items" },
    { name: "Sports", image: "/sports-collage.png", count: "250+ items" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Discover Amazing Products at Unbeatable Prices
              </h1>
              <p className="text-lg md:text-xl text-blue-100 text-pretty">
                Shop from thousands of products with fast delivery, secure payments, and excellent customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  Explore Categories
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="/ecommerce-hero-shopping-illustration.jpg"
                alt="Shopping illustration"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3 p-4">
              <Truck className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% protected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4">
              <RefreshCw className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="font-semibold">Top Quality</h3>
                <p className="text-sm text-muted-foreground">Premium products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-center mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground text-center">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of trending and popular products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      className="absolute top-3 left-3"
                      variant={product.badge === "Sale" ? "destructive" : "default"}
                    >
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-balance">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">${product.price}</span>
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      </div>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special
            offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
